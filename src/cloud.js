import cloudbase from '@cloudbase/js-sdk';

const envId = import.meta.env.VITE_CLOUDBASE_ENV_ID;
const region = import.meta.env.VITE_CLOUDBASE_REGION || 'ap-shanghai';
const accessKey = import.meta.env.VITE_PUBLISHABLE_KEY;

if (!envId || !accessKey) {
  throw new Error('CloudBase 环境配置缺失');
}

export const cloudApp = cloudbase.init({
  env: envId,
  region,
  accessKey,
  auth: { detectSessionInUrl: true },
});

export const auth = cloudApp.auth;
export const db = cloudApp.rdb();
export const PHOTO_BUCKET = 'health-checkin-photos';

function requireResult(result, fallbackMessage) {
  if (result?.error) {
    throw new Error(result.error.message || fallbackMessage);
  }
  return result?.data;
}

function normalizePhone(value) {
  return String(value || '').replace(/\s+/g, '').replace(/^\+86/, '');
}

export async function getCloudSession() {
  const { data, error } = await auth.getSession();
  const session = data?.session;
  if (error || !session?.user || session.user.is_anonymous) return null;
  const uid = session.user.id || session.user.sub || session.user.uid;
  if (!uid) return null;
  return {
    uid: String(uid),
    phone: normalizePhone(session.user.phone),
    email: String(session.user.email || ''),
    user: session.user,
  };
}

export function onCloudAuthStateChange(callback) {
  return auth.onAuthStateChange(callback);
}

export async function sendPhoneLoginCode(phone) {
  const normalizedPhone = String(phone).startsWith('+') ? String(phone) : `+86${phone}`;
  const data = requireResult(
    await auth.signInWithOtp({ phone: normalizedPhone }),
    '验证码发送失败',
  );
  if (!data?.verifyOtp) throw new Error('验证码服务未返回校验信息');
  return { challenge: data, phone: normalizedPhone };
}

export async function verifyPhoneLoginCode(challenge, code) {
  requireResult(
    await challenge.verifyOtp({ token: String(code) }),
    '验证码验证失败',
  );
  const session = await getCloudSession();
  if (!session) throw new Error('登录状态未建立，请重新获取验证码');
  return session;
}

export async function signOutCloud() {
  const { error } = await auth.signOut();
  if (error) throw new Error(error.message || '退出登录失败');
}

async function resolvePhotoUrl(bucket, key) {
  if (!bucket || !key) return '';
  const { data, error } = await cloudApp.storage
    .from(bucket)
    .createSignedUrl(key, 3600);
  if (error) return '';
  return data?.fullSignedURL || data?.signedUrl || '';
}

async function resolvePhotoRefs(photoRefs) {
  if (!photoRefs || typeof photoRefs !== 'object') return {};
  const entries = await Promise.all(Object.entries(photoRefs).map(async ([projectKey, ref]) => {
    if (!ref || typeof ref !== 'object') return null;
    const dataUrl = await resolvePhotoUrl(ref.bucket, ref.key);
    if (!dataUrl) return null;
    return [projectKey, {
      dataUrl,
      capturedAt: Number(ref.capturedAt || Date.now()),
      label: ref.label || '',
      bucket: ref.bucket,
      key: ref.key,
    }];
  }));
  return Object.fromEntries(entries.filter(Boolean));
}

function dataUrlToBlob(dataUrl) {
  const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('照片数据格式不正确');
  const mimeType = match[1];
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

export async function uploadCheckinPhoto(dataUrl, uid, projectKey, dateKey) {
  const blob = dataUrlToBlob(dataUrl);
  const key = `${uid}/${dateKey}/${projectKey}-${Date.now()}.jpg`;
  const uploaded = await cloudApp.storage
    .from(PHOTO_BUCKET)
    .upload(key, blob, { contentType: 'image/jpeg', upsert: false });
  if (uploaded.error) {
    throw new Error(uploaded.error.message || '照片上传失败');
  }
  return {
    bucket: PHOTO_BUCKET,
    key,
    dataUrl: await resolvePhotoUrl(PHOTO_BUCKET, key),
  };
}

export async function deleteCheckinPhoto(ref) {
  if (!ref?.bucket || !ref?.key) return;
  const { error } = await cloudApp.storage
    .from(ref.bucket)
    .remove([ref.key]);
  if (error) throw new Error(error.message || '云端照片删除失败');
}

export async function migrateLocalPhotosToCloud(state, uid) {
  let uploaded = 0;
  let failed = 0;
  for (const [dateKey, record] of Object.entries(state.records || {})) {
    for (const [projectKey, photo] of Object.entries(record.photos || {})) {
      if (!String(photo?.dataUrl || '').startsWith('data:image/') || photo?.key) continue;
      try {
        const ref = await uploadCheckinPhoto(photo.dataUrl, uid, projectKey, dateKey);
        record.photos[projectKey] = {
          ...photo,
          ...ref,
        };
        uploaded += 1;
      } catch {
        failed += 1;
      }
    }
  }
  return { state, uploaded, failed };
}

export async function loadCloudHealthData(uid) {
  const [
    profileResult,
    recordsResult,
    checkinResult,
    publicProfilesResult,
    publicRecordsResult,
    publicTeamsResult,
    publicMembersResult,
    publicChallengesResult,
    publicLogsResult,
    ownTeamsResult,
    communityResult,
  ] = await Promise.all([
    db.from('health_profiles').select('*').eq('user_id', uid).limit(1),
    db.from('daily_health_records').select('*').eq('user_id', uid)
      .order('record_date', { ascending: true }).range(0, 999),
    db.from('daily_checkins').select('*').eq('user_id', uid)
      .order('checkin_date', { ascending: false }).limit(1),
    db.from('health_public_profiles').select('*').range(0, 999),
    db.from('health_public_daily_records').select('*')
      .order('record_date', { ascending: true }).range(0, 4999),
    db.from('health_public_teams').select('*').range(0, 999),
    db.from('health_public_team_members').select('*').range(0, 4999),
    db.from('health_public_challenges').select('*')
      .order('created_at', { ascending: false }).range(0, 999),
    db.from('health_public_challenge_logs').select('*')
      .order('log_date', { ascending: true }).range(0, 9999),
    db.from('health_teams').select('*').range(0, 99),
    db.from('health_community_shares').select('*')
      .order('record_date', { ascending: false }).range(0, 199),
  ]);
  const ownRecords = requireResult(recordsResult, '读取云端健康记录失败') || [];
  for (const record of ownRecords) {
    record.photos = await resolvePhotoRefs(record.photo_refs);
  }
  const communityShares = await Promise.all(
    (requireResult(communityResult, '读取社区分享失败') || []).map(async (share) => ({
      ...share,
      photos: await resolvePhotoRefs(share.photo_refs),
    })),
  );
  return {
    profile: requireResult(profileResult, '读取云端用户资料失败')?.[0] || null,
    records: ownRecords,
    latestCheckin: requireResult(checkinResult, '读取云端签到记录失败')?.[0] || null,
    publicProfiles: requireResult(publicProfilesResult, '读取用户榜失败') || [],
    publicRecords: requireResult(publicRecordsResult, '读取每日健康榜失败') || [],
    publicTeams: requireResult(publicTeamsResult, '读取小队榜失败') || [],
    publicMembers: requireResult(publicMembersResult, '读取小队成员失败') || [],
    publicChallenges: requireResult(publicChallengesResult, '读取挑战失败') || [],
    publicLogs: requireResult(publicLogsResult, '读取挑战记录失败') || [],
    ownTeams: requireResult(ownTeamsResult, '读取我的战队失败') || [],
    communityShares,
  };
}

function profilePayload(state, uid) {
  const profile = state.profile || {};
  return {
    user_id: uid,
    real_name: profile.realName || profile.nickname || '用户',
    phone: normalizePhone(profile.phone),
    nickname: profile.nickname || profile.realName || '用户',
    group_code: profile.groupCode || 'personal',
    avatar_text: profile.avatarText || (profile.nickname || profile.realName || '用').slice(0, 1),
    motto: profile.motto || '',
    goals: state.goals || {},
    enabled_projects: state.enabledProjects || [],
    onboarding_completed: Boolean(state.onboarding?.completed),
    onboarding_completed_at: state.onboarding?.completedAt
      ? new Date(state.onboarding.completedAt).toISOString()
      : null,
  };
}

function recordRowsPayload(state, uid) {
  return Object.entries(state.records || {}).map(([recordDate, record]) => {
    const photoRefs = Object.fromEntries(
      Object.entries(record.photos || {})
        .filter(([, photo]) => photo?.bucket && photo?.key)
        .map(([projectKey, photo]) => [projectKey, {
          bucket: photo.bucket,
          key: photo.key,
          capturedAt: Number(photo.capturedAt || Date.now()),
          label: String(photo.label || '').slice(0, 80),
        }]),
    );
    return {
      user_id: uid,
      record_date: recordDate,
      steps: Number(record.steps || 0),
    weight: Number(record.weight || 0),
      fatloss: Number(record.fatloss || 0),
      musclegain: Number(record.musclegain || 0),
      water: Number(record.water || 0),
      muscle: Number(record.muscle || 0),
      sleep: Number(record.sleep || 0),
      stand: Number(record.stand || 0),
      farview: Number(record.farview || 0),
      note: String(record.note || '').slice(0, 500),
      photo_refs: photoRefs,
      updated_at: record.updatedAt
        ? new Date(record.updatedAt).toISOString()
        : new Date().toISOString(),
    };
  });
}

export async function saveCloudHealthData(state, uid) {
  requireResult(
    await db
      .from('health_profiles')
      .upsert(profilePayload(state, uid), { onConflict: 'user_id' }),
    '保存云端用户资料失败',
  );
  const rows = recordRowsPayload(state, uid);
  if (rows.length) {
    requireResult(
      await db
        .from('daily_health_records')
        .upsert(rows, { onConflict: 'user_id,record_date' }),
      '保存云端健康记录失败',
    );
  }
  if (state.dailyCheckin?.lastDate) {
    requireResult(
      await db.from('daily_checkins').upsert({
        user_id: uid,
        checkin_date: state.dailyCheckin.lastDate,
        checked_in_at: state.dailyCheckin.checkedInAt
          ? new Date(state.dailyCheckin.checkedInAt).toISOString()
          : new Date().toISOString(),
        streak: Number(state.dailyCheckin.streak || 1),
      }, { onConflict: 'user_id,checkin_date' }),
      '保存云端签到记录失败',
    );
  }

  const team = state.team;
  if (team?.id) {
    const isOwner = !team.ownerId || team.ownerId === uid;
    if (isOwner) {
      requireResult(
        await db.from('health_teams').upsert({
          id: team.id,
          name: team.name,
          slogan: team.slogan || '',
          invite_code: team.inviteCode,
          owner_id: uid,
        }, { onConflict: 'id' }),
        '保存云端战队失败',
      );
    }
    requireResult(
      await db.from('health_team_members').upsert({
        team_id: team.id,
        user_id: uid,
        display_name: state.profile.nickname || state.profile.realName || '队员',
        avatar_text: state.profile.avatarText || '队',
        role: isOwner ? 'owner' : 'member',
      }, { onConflict: 'team_id,user_id' }),
      '同步战队成员失败',
    );

    const challenge = team.challenge;
    const canManageChallenge = !challenge?.createdBy
      || challenge.createdBy === uid
      || isOwner;
    if (challenge?.id && canManageChallenge) {
      requireResult(
        await db.from('health_challenges').upsert({
          id: challenge.id,
          team_id: team.id,
          activity_key: challenge.activityKey,
          activity_name: challenge.activityName,
          unit: challenge.unit,
          daily_goal: Number(challenge.dailyGoal || 0),
          decimals: Number(challenge.decimals || 0),
          quick_amount: Number(challenge.quickAmount || 1),
          record_source: challenge.recordSource || 'team',
          health_project: challenge.healthProject || null,
          days: Number(challenge.days || 7),
          start_date: challenge.startDate,
          end_date: challenge.endDate,
          goal: Number(challenge.goal || 0),
          created_by: challenge.createdBy || uid,
        }, { onConflict: 'id' }),
        '保存云端挑战失败',
      );
    }
    if (challenge?.id) {
      const logRows = Object.entries(challenge.logs || {}).flatMap(([logDate, members]) => (
        members?.[uid] === undefined ? [] : [{
          challenge_id: challenge.id,
          user_id: uid,
          log_date: logDate,
          value: Number(members[uid] || 0),
          updated_at: new Date().toISOString(),
        }]
      ));
      if (logRows.length) {
        requireResult(
          await db.from('health_challenge_logs')
            .upsert(logRows, { onConflict: 'challenge_id,user_id,log_date' }),
          '保存云端挑战记录失败',
        );
      }
    }
  }
}

export async function deleteCloudHealthData(uid) {
  const { error } = await db.rpc('delete_my_health_data');
  if (error) throw new Error(error.message || '删除云端健康数据失败');
}

export async function joinCloudTeam(inviteCode) {
  const { data, error } = await db.rpc('join_health_team', {
    p_invite_code: String(inviteCode || '').trim(),
  });
  if (error) throw new Error(error.message || '加入战队失败');
  return data;
}

export async function leaveCloudTeam(teamId, uid, isOwner) {
  const result = isOwner
    ? await db.from('health_teams').delete().eq('id', teamId).eq('owner_id', uid)
    : await db.from('health_team_members').delete().eq('team_id', teamId).eq('user_id', uid);
  requireResult(result, '退出云端战队失败');
}
