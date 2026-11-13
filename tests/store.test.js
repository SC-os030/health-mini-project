import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PROJECT_KEYS,
  DEFAULT_TEAM_GROUPS,
  HEALTH_PROJECTS,
  TEAM_ACTIVITIES,
  attachPhotoCheckin,
  completeDailyCheckin,
  createDefaultState,
  createTeam,
  dailyCheckinStatus,
  exportState,
  getAuthSession,
  getDayRecord,
  homeOverview,
  importState,
  leaderboardOverview,
  loadState,
  loginWithRealName,
  logoutCurrentUser,
  recordTeamActivity,
  resetDemoState,
  removeCheckinPhoto,
  saveState,
  saveTaskSetup,
  setEnabledProjects,
  shiftDateKey,
  startTeamChallenge,
  teamOverview,
  toDateKey,
  updateGoals,
  updateHealthRecord,
  updateAuthProfile,
  walkingScore,
  weightManagementBreakdown,
  weightManagementScore,
} from '../src/store.js';

test.beforeEach(() => {
  logoutCurrentUser();
  resetDemoState();
});

test('手机号和姓名可以完成实名登录，并同步个人资料', () => {
  let state = loadState();
  const invalidPhone = loginWithRealName(state, {
    phone: '123',
    realName: '张三',
  });
  assert.equal(invalidPhone.ok, false);

  const login = loginWithRealName(state, {
    phone: '13800138000',
    realName: '张晓康',
  });
  assert.equal(login.ok, true);
  state = login.state;
  assert.equal(state.profile.nickname, '张晓康');
  assert.equal(state.profile.phone, '13800138000');
  assert.equal(getAuthSession().realName, '张晓康');

  const updated = updateAuthProfile(state, {
    phone: '13900139000',
    realName: '张小康',
  });
  assert.equal(updated.ok, true);
  assert.equal(loadState().profile.realName, '张小康');
  assert.equal(loadState().profile.phone, '13900139000');
});

test('全新账号固定启用走路和体重', () => {
  const state = loadState();
  const home = homeOverview(state);
  assert.equal(HEALTH_PROJECTS.length, 9);
  assert.equal(home.cards.length, 2);
  assert.equal(home.week.length, 7);
  assert.equal(home.cards[0].name, '走路');
  assert.equal(home.cards[1].name, '体重');
  assert.deepEqual(state.enabledProjects, DEFAULT_PROJECT_KEYS);
  assert.ok(home.cards.every((card) => card.value === 0));
  assert.equal(home.team.exists, false);
  assert.equal(Object.keys(state.records).length, 0);
  assert.equal(state.onboarding.completed, false);
  assert.equal(state.goals.stand, 20);
  assert.equal(HEALTH_PROJECTS.find((project) => project.key === 'stand').unit, '分钟');
});

test('每日任务始终固定为走路和体重', () => {
  const state = loadState();
  const attempted = setEnabledProjects(state, ['stand', 'farview']);
  assert.equal(attempted.ok, true);
  assert.deepEqual(attempted.state.enabledProjects, ['steps', 'weight']);
  assert.equal(homeOverview(state).cards.length, 2);
});

test('新用户首次设置固定任务目标并可完成引导', () => {
  let state = loadState();
  const missingWeight = saveTaskSetup(
    state,
    ['steps', 'weight'],
    { steps: '', weight: '' },
    { completeOnboarding: true },
  );
  assert.equal(missingWeight.ok, false);

  const result = saveTaskSetup(
    state,
    ['steps', 'weight'],
    { steps: '', weight: '65' },
    { completeOnboarding: true },
  );
  assert.equal(result.ok, true);
  state = result.state;
  assert.deepEqual(state.enabledProjects, ['steps', 'weight']);
  assert.equal(state.goals.steps, 8000);
  assert.equal(state.goals.weight, 65);
  assert.equal(state.goals.weightTargetSet, true);
  assert.equal(state.onboarding.completed, true);
  assert.ok(state.onboarding.completedAt > 0);

  const custom = saveTaskSetup(
    state,
    ['steps', 'weight'],
    { steps: '10000', weight: '60' },
    { completeOnboarding: true },
  );
  assert.equal(custom.ok, true);
  assert.equal(custom.state.goals.steps, 10000);
  assert.equal(custom.state.goals.weight, 60);
});

test('已有本地用户升级后不会重复出现新用户任务引导', () => {
  let state = loadState();
  state = updateHealthRecord(state, 'steps', 3200).state;
  state.version = 4;
  state.profile.phone = '13800138000';
  delete state.onboarding;
  const restored = importState(JSON.stringify({ state }));
  assert.equal(restored.ok, true);
  assert.equal(restored.state.onboarding.completed, true);
  assert.ok(restored.state.onboarding.completedAt > 0);
});

test('每日一键签到当天只记录一次，并计算连续天数', () => {
  let state = loadState();
  assert.equal(dailyCheckinStatus(state, '2026-11-06').checkedInToday, false);

  let result = completeDailyCheckin(state, '2026-11-06');
  assert.equal(result.ok, true);
  assert.equal(result.streak, 1);
  state = result.state;
  assert.equal(dailyCheckinStatus(state, '2026-11-06').checkedInToday, true);

  const repeated = completeDailyCheckin(state, '2026-11-06');
  assert.equal(repeated.alreadyChecked, true);

  result = completeDailyCheckin(state, '2026-11-07');
  assert.equal(result.streak, 2);
  state = result.state;
  result = completeDailyCheckin(state, '2026-11-09');
  assert.equal(result.streak, 1);
});

test('四项数据均可手动修改并持久化', () => {
  let state = loadState();
  for (const [key, value] of [['steps', 9200], ['water', 2050], ['muscle', 7], ['sleep', 8.4]]) {
    const result = updateHealthRecord(state, key, value);
    assert.equal(result.ok, true);
    state = result.state;
  }
  const record = getDayRecord(loadState(), toDateKey());
  assert.equal(record.steps, 9200);
  assert.equal(record.water, 2050);
  assert.equal(record.muscle, 7);
  assert.equal(record.sleep, 8.4);
});

test('已隐藏的历史项目数据仍可以兼容读取', () => {
  let state = loadState();
  const project = HEALTH_PROJECTS.find((item) => item.key === 'muscle');
  assert.equal(project.unit, '分钟');
  assert.equal(state.goals.muscle, 45);

  const result = updateHealthRecord(state, 'muscle', 45);
  assert.equal(result.ok, true);
  state = result.state;
  assert.equal(getDayRecord(state, toDateKey()).muscle, 45);
  assert.equal(homeOverview(state).cards.some((item) => item.key === 'muscle'), false);
});

test('个人榜和小队榜按走路70%和体重30%计算总分', () => {
  let state = loadState();
  for (const [key, value] of [['steps', 8000], ['weight', 65]]) {
    const result = updateHealthRecord(state, key, value);
    assert.equal(result.ok, true);
    state = result.state;
  }
  let board = leaderboardOverview(state, 1);
  assert.equal(board.myPerson.today.rate, 70);
  assert.equal(board.myPerson.today.completed, 1);
  assert.equal(board.myPerson.projectScores.steps.averagePercent, 100);
  assert.equal(board.myPerson.projectScores.weight.averagePercent, 0);

  const created = createTeam(state, {
    name: '每日满分队',
    activity: 'basketball',
    days: 7,
  });
  state = created.state;
  board = leaderboardOverview(state, 1);
  assert.equal(board.myTeam.today.rate, 70);
  assert.equal(board.myTeam.ownerId, state.profile.id);
  assert.equal(board.myTeam.today.completed, 1);
  assert.equal(board.myTeam.projectScores.steps.averagePercent, 100);
});

test('走路采用连续比例得分，体重按进度、平稳度和记录度计分', () => {
  assert.equal(walkingScore(8000, 8000), 100);
  assert.equal(walkingScore(7000, 8000), 88);
  assert.equal(walkingScore(4000, 8000), 50);
  assert.equal(walkingScore(0, 8000), 0);
  assert.equal(weightManagementScore(65, 80, 65, 66), 100);
  assert.deepEqual(weightManagementBreakdown(79, 80, 65, 79), {
    progress: 4,
    stability: 25,
    record: 15,
    total: 44,
  });
  assert.equal(weightManagementScore(81, 80, 65, 81), 40);

  let state = loadState();
  let result = updateHealthRecord(state, 'weight', 80);
  assert.equal(result.ok, true);
  state = result.state;
  assert.equal(state.goals.weightBaseline, 80);
  assert.equal(homeOverview(state).cards.find((card) => card.key === 'weight').done, false);
  state.goals.weightBaselineDate = shiftDateKey(toDateKey(), -1);
  state.records[toDateKey()].weight = 79;
  const improvedCard = homeOverview(state).cards.find((card) => card.key === 'weight');
  assert.equal(improvedCard.percent, 44);
  assert.equal(improvedCard.done, true);
});

test('累计步数榜使用区间总步数，小队按成员人均计算', () => {
  let state = loadState();
  state.records = {};
  const today = toDateKey();
  const yesterday = shiftDateKey(today, -1);
  state.records[yesterday] = {
    ...getDayRecord(state, yesterday),
    steps: 4000,
  };
  const result = updateHealthRecord(state, 'steps', 8000);
  assert.equal(result.ok, true);
  state = result.state;

  let board = leaderboardOverview(state, 7);
  const me = board.people.find((person) => person.isMe);
  assert.equal(me.cumulativeSteps.total, 12000);

  const created = createTeam(state, {
    name: '累计步数测试队',
    activity: 'badminton',
    days: 7,
  });
  assert.equal(created.ok, true);
  board = leaderboardOverview(created.state, 7);
  const customTeam = board.teams.find((team) => !team.isDefaultGroup);
  assert.equal(customTeam.cumulativeSteps.total, 12000);
  assert.equal(customTeam.cumulativeSteps.perMember, 12000);
});

test('排行榜体重使用当前体重与目标差值，小队按成员差值求和', () => {
  const state = createDefaultState();
  const today = toDateKey();
  state.profile.groupCode = 'personal_center';
  state.goals.weight = 70;
  state.records[today] = {
    ...getDayRecord(state, today),
    weight: 73,
  };
  state.cloudProfiles = [
    {
      user_id: 'weight-peer-a',
      nickname: '队员甲',
      avatar_text: '甲',
      group_code: 'personal_center',
      goals: { ...state.goals, weight: 70 },
      enabled_projects: [...DEFAULT_PROJECT_KEYS],
    },
    {
      user_id: 'weight-peer-b',
      nickname: '队员乙',
      avatar_text: '乙',
      group_code: 'personal_center',
      goals: { ...state.goals, weight: 70 },
      enabled_projects: [...DEFAULT_PROJECT_KEYS],
    },
  ];
  state.cloudDailyRecords = {
    'weight-peer-a': {
      [today]: { ...getDayRecord(state, today), weight: 68 },
    },
    'weight-peer-b': {
      [today]: { ...getDayRecord(state, today), weight: 66 },
    },
  };

  const board = leaderboardOverview(state, 1);
  assert.equal(board.myPerson.weightSummary.difference, 3);
  const group = board.teams.find((team) => team.code === 'personal_center');
  assert.equal(group.weightSummary.memberCount, 3);
  assert.equal(group.weightSummary.difference, -3);
  assert.equal(createDefaultState().settings.taskReminderDisabled, false);
});

test('小队榜默认展示六个公司小组', () => {
  const state = loadState();
  const board = leaderboardOverview(state, 1);
  const groups = board.teams.filter((team) => team.isDefaultGroup);
  assert.equal(groups.length, 6);
  assert.deepEqual(
    groups.map((team) => team.name).sort(),
    DEFAULT_TEAM_GROUPS.map((group) => group.name).sort(),
  );
  assert.ok(groups.every((team) => (
    DEFAULT_PROJECT_KEYS.every((key) => Boolean(team.challengeScores[key]))
  )));
});

test('默认小组排行榜按注册时选择的小组汇总所有成员', () => {
  const state = loadState();
  const today = toDateKey();
  state.profile.groupCode = 'personal_center';
  state.cloudProfiles = [
    {
      user_id: 'personal-peer',
      nickname: '个人组队友',
      avatar_text: '个',
      group_code: 'personal_center',
      goals: { ...state.goals },
      enabled_projects: [...DEFAULT_PROJECT_KEYS],
    },
    {
      user_id: 'group-peer',
      nickname: '团体组成员',
      avatar_text: '团',
      group_code: 'group_center',
      goals: { ...state.goals },
      enabled_projects: [...DEFAULT_PROJECT_KEYS],
    },
  ];
  const fullRecord = {
    steps: 8000,
    weight: 65,
    fatloss: -0.2,
    musclegain: 0.1,
    water: 0,
    muscle: 0,
    sleep: 0,
    stand: 0,
    farview: 0,
    note: '',
    photos: {},
    updatedAt: Date.now(),
  };
  state.cloudDailyRecords = {
    'personal-peer': { [today]: fullRecord },
    'group-peer': { [today]: { ...fullRecord } },
  };

  const board = leaderboardOverview(state, 1);
  const personalGroup = board.teams.find((team) => team.code === 'personal_center');
  const teamGroup = board.teams.find((team) => team.code === 'group_center');
  const claimsGroup = board.teams.find((team) => team.code === 'claims_operations');
  assert.equal(personalGroup.memberCount, 2);
  assert.equal(personalGroup.rating, 35);
  assert.equal(teamGroup.memberCount, 1);
  assert.equal(teamGroup.rating, 70);
  assert.equal(claimsGroup.memberCount, 0);
  assert.equal(claimsGroup.rating, 0);
});

test('排行榜可以合并 CloudBase 用户资料与跨用户每日记录', () => {
  const state = loadState();
  const today = toDateKey();
  state.cloudProfiles = [{
    user_id: 'cloud-user-b',
    nickname: '云端队友',
    avatar_text: '云',
    goals: { ...state.goals },
    enabled_projects: [...DEFAULT_PROJECT_KEYS],
  }];
  state.cloudDailyRecords = {
    'cloud-user-b': {
      [today]: {
        steps: 8000,
        weight: 65,
        fatloss: -0.2,
        musclegain: 0.1,
        water: 0,
        muscle: 0,
        sleep: 0,
        stand: 0,
        farview: 0,
        note: '',
        photos: {},
        updatedAt: Date.now(),
      },
    },
  };
  const board = leaderboardOverview(state, 1);
  const cloudUser = board.people.find((person) => person.id === 'cloud-user-b');
  assert.ok(cloudUser);
  assert.equal(cloudUser.name, '云端队友');
  assert.equal(cloudUser.today.rate, 70);
  assert.equal(cloudUser.today.completed, 1);
});

test('小队榜按当前组队挑战项目计算独立完成率', () => {
  let state = loadState();
  const created = createTeam(state, {
    name: '篮球挑战队',
    activity: {
      key: 'basketball',
      dailyGoal: 30,
    },
    days: 7,
  });
  assert.equal(created.ok, true);
  state = created.state;

  const recorded = recordTeamActivity(state, 15);
  assert.equal(recorded.ok, true);
  state = recorded.state;
  let board = leaderboardOverview(state, 1);
  assert.equal(board.myTeam.challenge.key, 'basketball');
  assert.equal(board.myTeam.challenge.name, '篮球');
  assert.equal(board.myTeam.challenge.rating, 50);
  assert.equal(board.myTeam.challenge.daily[0].percent, 50);

  state = startTeamChallenge(state, {
    key: 'swimming',
    dailyGoal: 1000,
  }, 7).state;
  state = recordTeamActivity(state, 250).state;
  board = leaderboardOverview(state, 1);
  assert.equal(board.myTeam.challenge.key, 'swimming');
  assert.equal(board.myTeam.challenge.name, '游泳');
  assert.equal(board.myTeam.challenge.rating, 25);
});

test('照片打卡会保存到当天记录并随数据备份', () => {
  let state = loadState();
  const photo = 'data:image/jpeg;base64,ZmFrZS1waG90bw==';
  const result = attachPhotoCheckin(state, 'water', photo, { increment: 250 });
  assert.equal(result.ok, true);
  state = result.state;
  const record = getDayRecord(state, toDateKey());
  assert.equal(record.photos.water.dataUrl, photo);
  assert.equal(record.water, 250);
  assert.match(exportState(state), /data:image\/jpeg/);

  const removed = removeCheckinPhoto(state, 'water');
  assert.equal(removed.ok, true);
  assert.equal(getDayRecord(removed.state, toDateKey()).photos.water, undefined);
});

test('非法数据与目标不会写入', () => {
  const state = loadState();
  assert.equal(updateHealthRecord(state, 'steps', 5.5).ok, false);
  assert.equal(updateHealthRecord(state, 'sleep', 25).ok, false);
  assert.equal(updateGoals(state, {
    steps: 500,
    water: 1800,
    muscle: 6,
    sleep: 8,
  }).ok, false);
});

test('自定义骑行挑战会写入个人团队记录并计算进度', () => {
  let state = loadState();
  state.team = null;
  const created = createTeam(state, {
    name: '周末骑行队',
    slogan: '一起去看更远的风景',
    activity: {
      key: 'cycling',
      dailyGoal: 20,
    },
    days: 7,
  });
  assert.equal(created.ok, true);
  state = created.state;
  assert.equal(state.team.challenge.unit, '公里');

  const record = recordTeamActivity(state, 12.5);
  assert.equal(record.ok, true);
  state = record.state;
  const overview = teamOverview(state);
  assert.equal(overview.challenge.total, 12.5);
  assert.equal(overview.challenge.myTodayValue, 12.5);
});

test('内置游泳和完全自定义运动都可以发起', () => {
  let state = loadState();
  const team = createTeam(state, {
    name: '真实运动队',
    days: 7,
  });
  assert.equal(team.ok, true);
  state = team.state;
  assert.equal(teamOverview(state).challenge.activityName, '羽毛球');
  assert.equal(teamOverview(state).challenge.unit, '分钟');
  assert.deepEqual(
    TEAM_ACTIVITIES.filter((activity) => !activity.hidden).map((activity) => activity.name),
    ['羽毛球', '骑行', '自定义'],
  );
  let result = startTeamChallenge(state, {
    key: 'swimming',
    dailyGoal: 1200,
  }, 3);
  assert.equal(result.ok, true);
  state = result.state;
  assert.equal(teamOverview(state).challenge.activityName, '游泳');

  result = startTeamChallenge(state, {
    key: 'custom',
    name: '爬楼',
    unit: '层',
    dailyGoal: 50,
    custom: true,
  }, 7);
  assert.equal(result.ok, true);
  state = result.state;
  assert.ok(TEAM_ACTIVITIES.some((activity) => activity.key === 'custom'));
  assert.equal(teamOverview(state).challenge.activityName, '爬楼');
});

test('JSON 备份可以导出并恢复', () => {
  let state = loadState();
  const result = updateHealthRecord(state, 'sleep', 9.1);
  assert.equal(result.ok, true);
  state = result.state;
  const backup = exportState(state);

  state.profile.nickname = '临时';
  state = saveState(state);
  assert.equal(loadState().profile.nickname, '临时');

  const restored = importState(backup);
  assert.equal(restored.ok, true);
  assert.equal(getDayRecord(loadState(), toDateKey()).sleep, 9.1);
});
