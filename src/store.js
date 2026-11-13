const STORAGE_KEY = 'health_motion_web_state_v3';
const AUTH_KEY = 'health_motion_web_auth_v1';
const CLEANUP_KEY = 'health_motion_mock_cleanup_v3';
const DAY_MS = 24 * 60 * 60 * 1000;

export const DEFAULT_PROJECT_KEYS = ['steps', 'weight'];

export const DEFAULT_TEAM_GROUPS = [
  { id: 'default_personal_center', code: 'personal_center', name: '个人中心', avatarText: '个' },
  { id: 'default_group_center', code: 'group_center', name: '团体中心', avatarText: '团' },
  { id: 'default_claims_operations', code: 'claims_operations', name: '理赔运营中心', avatarText: '赔' },
  { id: 'default_jiangyin', code: 'jiangyin_branch', name: '江阴中支', avatarText: '澄' },
  { id: 'default_yixing', code: 'yixing_branch', name: '宜兴中支', avatarText: '宜' },
  { id: 'default_shared_resources', code: 'shared_resources', name: '共同资源中心', avatarText: '共' },
];

export const HEALTH_PROJECTS = [
  {
    key: 'steps',
    name: '走路',
    kicker: 'MOVE',
    unit: '步',
    goal: 8000,
    min: 0,
    max: 100000,
    decimals: 0,
    mark: '步',
    tone: 'lime',
    hint: '每一次出发，都算数',
  },
  {
    key: 'weight',
    name: '体重',
    kicker: 'WEIGHT',
    unit: 'kg',
    goal: 65,
    min: 30,
    max: 200,
    decimals: 1,
    mark: '重',
    tone: 'blue',
    hint: '记录今天的体重，持续看见身体变化',
  },
  {
    key: 'fatloss',
    name: '减脂',
    kicker: 'LEAN',
    unit: 'kg',
    goal: -0.2,
    min: -5,
    max: 5,
    decimals: 1,
    mark: '减',
    tone: 'blue',
    hint: '记录今日体重变化，向减脂目标前进',
    direction: 'decrease',
  },
  {
    key: 'musclegain',
    name: '增肌',
    kicker: 'BUILD',
    unit: 'kg',
    goal: 0.1,
    min: -5,
    max: 5,
    decimals: 1,
    mark: '增',
    tone: 'sand',
    hint: '记录今日体重变化，持续积累增肌成果',
    direction: 'increase',
  },
  {
    key: 'water',
    name: '喝大水',
    kicker: 'HYDRATE',
    unit: 'ml',
    goal: 1800,
    min: 0,
    max: 10000,
    decimals: 0,
    mark: '水',
    tone: 'blue',
    hint: '分次补充，身体更轻松',
  },
  {
    key: 'muscle',
    name: '练肌肉',
    kicker: 'TRAIN',
    unit: '分钟',
    goal: 45,
    min: 0,
    max: 720,
    decimals: 0,
    mark: '力',
    tone: 'sand',
    hint: '累计训练 45 分钟，填满今日进度',
  },
  {
    key: 'sleep',
    name: '睡大觉',
    kicker: 'RESET',
    unit: '小时',
    goal: 8,
    min: 0,
    max: 24,
    decimals: 1,
    mark: '眠',
    tone: 'violet',
    hint: '好睡眠，是明天的底气',
  },
  {
    key: 'stand',
    name: '久坐起身',
    kicker: 'BREAK',
    unit: '分钟',
    goal: 20,
    min: 0,
    max: 240,
    decimals: 0,
    mark: '起',
    tone: 'teal',
    hint: '每坐 45 分钟起身活动，累计 20 分钟',
  },
  {
    key: 'farview',
    name: '看远处',
    kicker: 'FOCUS',
    unit: '分钟',
    goal: 10,
    min: 0,
    max: 10,
    decimals: 0,
    mark: '远',
    tone: 'sky',
    hint: '远眺放松双眼，单日最高 10 分钟',
  },
];

export const TEAM_ACTIVITIES = [
  {
    key: 'steps',
    name: '走路',
    mark: '步',
    iconName: 'walk',
    unit: '步',
    dailyGoal: 8000,
    quickAmount: 1000,
    decimals: 0,
    source: 'health',
    healthProject: 'steps',
    hidden: true,
  },
  {
    key: 'weight',
    name: '体重',
    mark: '重',
    iconName: 'muscle',
    unit: 'kg',
    dailyGoal: 65,
    quickAmount: 1,
    decimals: 1,
    source: 'health',
    healthProject: 'weight',
    hidden: true,
  },
  {
    key: 'badminton',
    name: '羽毛球',
    mark: '羽',
    iconName: 'badminton',
    unit: '分钟',
    dailyGoal: 60,
    quickAmount: 30,
    decimals: 0,
    source: 'team',
  },
  {
    key: 'fatloss',
    name: '减脂',
    mark: '减',
    iconName: 'walk',
    unit: 'kg',
    dailyGoal: -0.2,
    quickAmount: 0.1,
    decimals: 1,
    source: 'health',
    healthProject: 'fatloss',
    hidden: true,
  },
  {
    key: 'musclegain',
    name: '增肌',
    mark: '增',
    iconName: 'muscle',
    unit: 'kg',
    dailyGoal: 0.1,
    quickAmount: 0.1,
    decimals: 1,
    source: 'health',
    healthProject: 'musclegain',
    hidden: true,
  },
  {
    key: 'basketball',
    name: '篮球',
    mark: '篮',
    iconName: 'basketball',
    unit: '分钟',
    dailyGoal: 30,
    quickAmount: 10,
    decimals: 0,
    source: 'team',
    hidden: true,
  },
  {
    key: 'run',
    name: '跑步',
    mark: '跑',
    iconName: 'run',
    unit: '公里',
    dailyGoal: 5,
    quickAmount: 1,
    decimals: 1,
    source: 'team',
    hidden: true,
  },
  {
    key: 'cycling',
    name: '骑行',
    mark: '骑',
    iconName: 'cycling',
    unit: '公里',
    dailyGoal: 30,
    quickAmount: 5,
    decimals: 1,
    source: 'team',
  },
  {
    key: 'swimming',
    name: '游泳',
    mark: '游',
    iconName: 'swimming',
    unit: '米',
    dailyGoal: 1000,
    quickAmount: 200,
    decimals: 0,
    source: 'team',
    hidden: true,
  },
  {
    key: 'rope',
    name: '跳绳',
    mark: '跳',
    iconName: 'rope',
    unit: '次',
    dailyGoal: 1000,
    quickAmount: 100,
    decimals: 0,
    source: 'team',
    hidden: true,
  },
  {
    key: 'yoga',
    name: '瑜伽',
    mark: '瑜',
    iconName: 'yoga',
    unit: '分钟',
    dailyGoal: 30,
    quickAmount: 10,
    decimals: 0,
    source: 'team',
    hidden: true,
  },
  {
    key: 'water',
    name: '喝大水',
    mark: '水',
    iconName: 'water',
    unit: 'ml',
    dailyGoal: 1800,
    quickAmount: 250,
    decimals: 0,
    source: 'health',
    healthProject: 'water',
    hidden: true,
  },
  {
    key: 'muscle',
    name: '练肌肉',
    mark: '力',
    iconName: 'muscle',
    unit: '分钟',
    dailyGoal: 45,
    quickAmount: 15,
    decimals: 0,
    source: 'health',
    healthProject: 'muscle',
    hidden: true,
  },
  {
    key: 'sleep',
    name: '睡大觉',
    mark: '眠',
    iconName: 'sleep',
    unit: '小时',
    dailyGoal: 8,
    quickAmount: 1,
    decimals: 1,
    source: 'health',
    healthProject: 'sleep',
    hidden: true,
  },
  {
    key: 'custom',
    name: '自定义',
    mark: '＋',
    iconName: 'plus',
    unit: '次',
    dailyGoal: 1,
    quickAmount: 1,
    decimals: 1,
    source: 'team',
    custom: true,
  },
];

const PROJECT_MAP = Object.fromEntries(HEALTH_PROJECTS.map((project) => [project.key, project]));
const ACTIVITY_MAP = Object.fromEntries(TEAM_ACTIVITIES.map((activity) => [activity.key, activity]));
const memoryStorage = new Map();

function getStorage() {
  if (typeof localStorage !== 'undefined') return localStorage;
  return {
    getItem(key) {
      return memoryStorage.has(key) ? memoryStorage.get(key) : null;
    },
    setItem(key, value) {
      memoryStorage.set(key, value);
    },
    removeItem(key) {
      memoryStorage.delete(key);
    },
  };
}

export function pad(value) {
  return String(value).padStart(2, '0');
}

export function toDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDateKey(key) {
  const [year, month, day] = String(key).split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export function shiftDateKey(key, offset) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + Number(offset || 0));
  return toDateKey(date);
}

export function rangeDateKeys(startKey, endKey) {
  const keys = [];
  let cursor = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  while (cursor <= end && keys.length < 366) {
    keys.push(toDateKey(cursor));
    cursor = new Date(cursor.getTime() + DAY_MS);
  }
  return keys;
}

export function lastDateKeys(count = 7, endKey = toDateKey()) {
  return Array.from({ length: count }, (_, index) => (
    shiftDateKey(endKey, index - count + 1)
  ));
}

export function dateLabel(key, includeWeekday = true) {
  const date = parseDateKey(key);
  const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
  return includeWeekday
    ? `${date.getMonth() + 1}月${date.getDate()}日 ${weekday}`
    : `${date.getMonth() + 1}月${date.getDate()}日`;
}

export function weekdayShort(key) {
  return ['日', '一', '二', '三', '四', '五', '六'][parseDateKey(key).getDay()];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(value, decimals = 0) {
  const number = Number(value || 0);
  return number.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals > 0 && number % 1 !== 0 ? decimals : 0,
    maximumFractionDigits: decimals,
  });
}

export function progressRatio(project, value, goal) {
  const numericValue = Number(value || 0);
  const numericGoal = Number(goal || project?.goal || 0);
  if (project?.direction === 'decrease') {
    const target = Math.abs(numericGoal || 0.1);
    if (numericValue <= numericGoal && numericValue < 0) return 1;
    if (numericValue >= 0) return 0;
    return clamp(Math.abs(numericValue) / target, 0, 1);
  }
  if (project?.direction === 'increase') {
    const target = Math.max(0.1, numericGoal);
    if (numericValue >= numericGoal && numericValue > 0) return 1;
    if (numericValue <= 0) return 0;
    return clamp(numericValue / target, 0, 1);
  }
  return clamp(numericValue / Math.max(1, numericGoal), 0, 1);
}

export function walkingScore(value, goal = 8000) {
  const steps = Math.max(0, Number(value || 0));
  const target = Math.max(1, Number(goal || 8000));
  return Math.round(clamp(steps / target, 0, 1) * 100);
}

export function weightManagementBreakdown(value, baseline, target, previousValue = null) {
  const current = Number(value || 0);
  const start = Number(baseline || 0);
  const goal = Number(target || 0);
  const empty = { total: 0, progress: 0, stability: 0, record: 0 };
  if (current <= 0 || start <= 0 || goal <= 0) return empty;

  const previous = Number(previousValue || 0);
  const baselineDistance = Math.abs(start - goal);
  const currentDistance = Math.abs(current - goal);
  const progress = baselineDistance <= 0.05
    ? clamp(1 - Math.abs(current - goal) / 2, 0, 1)
    : clamp((baselineDistance - currentDistance) / baselineDistance, 0, 1);
  const dailyChange = previous > 0 ? Math.abs(current - previous) : 0;
  const stability = previous > 0
    ? clamp(1 - Math.max(0, dailyChange - 1) / 1, 0, 1)
    : 1;
  const record = 1;
  return {
    progress: Math.round(progress * 60),
    stability: Math.round(stability * 25),
    record: Math.round(record * 15),
    total: Math.round(progress * 60 + stability * 25 + record * 15),
  };
}

export function weightManagementScore(value, baseline, target, previousValue = null) {
  return weightManagementBreakdown(value, baseline, target, previousValue).total;
}

function seedRecord(dateKey, values) {
  return {
    steps: values.steps,
    weight: values.weight || 0,
    fatloss: values.fatloss || 0,
    musclegain: values.musclegain || 0,
    water: values.water,
    muscle: values.muscle,
    sleep: values.sleep,
    stand: values.stand || 0,
    farview: values.farview || 0,
    note: values.note || '',
    photos: {},
    updatedAt: parseDateKey(dateKey).getTime() + 20 * 60 * 60 * 1000,
  };
}

export function createDefaultState(now = new Date()) {
  const today = toDateKey(now);

  return {
    version: 7,
    profile: {
      id: 'me',
      nickname: '用户',
      avatarText: '用',
      realName: '',
      phone: '',
      groupCode: 'personal_center',
      motto: '记录真实行动，看见持续改变。',
      joinedAt: today,
    },
    goals: {
      steps: 8000,
      weight: 65,
      weightBaseline: null,
      weightBaselineDate: null,
      weightTargetSet: false,
      fatloss: -0.2,
      musclegain: 0.1,
      water: 1800,
      muscle: 45,
      sleep: 8,
      stand: 20,
      farview: 10,
    },
    enabledProjects: [...DEFAULT_PROJECT_KEYS],
    records: {},
    team: null,
    onboarding: {
      completed: false,
      completedAt: 0,
    },
    dailyCheckin: {
      lastDate: '',
      checkedInAt: 0,
      streak: 0,
    },
    settings: {
      dataSource: 'manual',
      wechatHealthConnected: false,
      lastManualInputAt: null,
      taskReminderDisabled: false,
    },
    meta: {
      createdAt: now.getTime(),
      updatedAt: now.getTime(),
    },
  };
}

function normalizeRecords(input, fallback) {
  if (!input || typeof input !== 'object') return fallback.records;
  const normalized = {};
  Object.entries(input).forEach(([key, record]) => {
    normalized[key] = {
      steps: Number(record?.steps || 0),
      weight: Number(record?.weight || 0),
      fatloss: Number(record?.fatloss || 0),
      musclegain: Number(record?.musclegain || 0),
      water: Number(record?.water || 0),
      muscle: Number(record?.muscle || 0),
      sleep: Number(record?.sleep || 0),
      stand: Number(record?.stand || 0),
      farview: Number(record?.farview || 0),
      note: String(record?.note || ''),
      photos: record?.photos && typeof record.photos === 'object' ? record.photos : {},
      updatedAt: Number(record?.updatedAt || 0),
    };
  });
  return normalized;
}

export function normalizeState(input) {
  const fallback = createDefaultState();
  if (!input || typeof input !== 'object') return fallback;
  const incomingVersion = Number(input.version || 1);
  const records = normalizeRecords(input.records, fallback);
  const goals = {
    ...fallback.goals,
    ...(input.goals || {}),
  };
  if (incomingVersion < 4) {
    goals.muscle = 45;
    Object.values(records).forEach((record) => {
      record.muscle = 0;
    });
  }
  if (incomingVersion < 5) {
    goals.stand = Number(goals.stand) === 6
      ? fallback.goals.stand
      : clamp(Math.round(Number(goals.stand || fallback.goals.stand) * 2), 1, 240);
    Object.values(records).forEach((record) => {
      record.stand = Number(record.stand || 0) * 2;
    });
  }
  const enabledProjects = [...DEFAULT_PROJECT_KEYS];
  const hasExistingUsage = incomingVersion < 5 && Boolean(
    input.profile?.phone
    || Object.keys(records).length
    || input.team
    || input.dailyCheckin?.lastDate,
  );
  const allowedGroupCodes = new Set(DEFAULT_TEAM_GROUPS.map((group) => group.code));
  const profileInput = input.profile || {};
  const legacyGroupCodes = {
    personal: 'personal_center',
    group: 'group_center',
    claims: 'claims_operations',
  };
  const incomingGroupCode = legacyGroupCodes[profileInput.groupCode]
    || profileInput.groupCode;
  const normalizedProfile = {
    ...fallback.profile,
    ...profileInput,
    groupCode: allowedGroupCodes.has(incomingGroupCode)
      ? incomingGroupCode
      : fallback.profile.groupCode,
  };
  return {
    ...fallback,
    ...input,
    version: 7,
    profile: normalizedProfile,
    goals,
    enabledProjects,
    records,
    team: input.team === null ? null : (input.team || fallback.team),
    onboarding: input.onboarding
      ? {
        ...fallback.onboarding,
        ...input.onboarding,
        completed: Boolean(input.onboarding.completed),
      }
      : {
        completed: hasExistingUsage,
        completedAt: hasExistingUsage ? Date.now() : 0,
      },
    dailyCheckin: {
      ...fallback.dailyCheckin,
      ...(input.dailyCheckin || {}),
    },
    settings: {
      ...fallback.settings,
      ...(input.settings || {}),
    },
    meta: {
      ...fallback.meta,
      ...(input.meta || {}),
    },
  };
}

export function loadState() {
  clearLegacyMockDataOnce();
  const storage = getStorage();
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    const state = createDefaultState();
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

export function saveState(state) {
  const next = normalizeState({
    ...state,
    meta: {
      ...state.meta,
      updatedAt: Date.now(),
    },
  });
  getStorage().setItem(STORAGE_KEY, JSON.stringify(next));
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('health-state-saved', { detail: next }));
  }
  return next;
}

export function resetDemoState() {
  const state = createDefaultState();
  getStorage().setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function clearLegacyMockDataOnce() {
  const storage = getStorage();
  if (storage.getItem(CLEANUP_KEY)) return;
  storage.removeItem('health_motion_web_state_v2');
  storage.removeItem('health_motion_web_auth_v1');
  storage.setItem(CLEANUP_KEY, String(Date.now()));
}

export function getAuthSession() {
  const raw = getStorage().getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    const session = JSON.parse(raw);
    return session && session.loggedIn ? session : null;
  } catch {
    return null;
  }
}

export function loginWithRealName(state, input) {
  const phone = String(input.phone || '').replace(/\s+/g, '');
  const realName = String(input.realName || '').trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { ok: false, message: '请输入有效的 11 位手机号' };
  }
  if (!/^[\u3400-\u9fff·]{2,20}$/.test(realName)) {
    return { ok: false, message: '请输入 2-20 位中文姓名' };
  }
  const session = {
    loggedIn: true,
    phone,
    realName,
    loggedInAt: Date.now(),
  };
  state.profile = {
    ...state.profile,
    id: `user_${phone.slice(-4)}`,
    nickname: realName,
    realName,
    phone,
    avatarText: realName.slice(0, 1),
  };
  if (state.team?.members) {
    state.team.members = state.team.members.map((member) => (
      member.id === 'me' || member.id.startsWith('user_')
        ? {
          ...member,
          id: state.profile.id,
          nickname: realName,
          avatarText: state.profile.avatarText,
        }
        : member
    ));
  }
  getStorage().setItem(AUTH_KEY, JSON.stringify(session));
  return { ok: true, session, state: saveState(state) };
}

export function updateAuthProfile(state, input) {
  const current = getAuthSession();
  if (!current) return { ok: false, message: '登录已失效，请重新登录' };
  const phone = String(input.phone || '').replace(/\s+/g, '');
  const realName = String(input.realName || '').trim();
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { ok: false, message: '请输入有效的 11 位手机号' };
  }
  if (!/^[\u3400-\u9fff·]{2,20}$/.test(realName)) {
    return { ok: false, message: '请输入 2-20 位中文姓名' };
  }
  const session = {
    ...current,
    phone,
    realName,
  };
  state.profile = {
    ...state.profile,
    id: `user_${phone.slice(-4)}`,
    nickname: realName,
    realName,
    phone,
    avatarText: realName.slice(0, 1),
  };
  getStorage().setItem(AUTH_KEY, JSON.stringify(session));
  return { ok: true, session, state: saveState(state) };
}

export function logoutCurrentUser() {
  getStorage().removeItem(AUTH_KEY);
}

export function maskPhone(phone) {
  const value = String(phone || '');
  return /^\d{11}$/.test(value)
    ? `${value.slice(0, 3)} **** ${value.slice(-4)}`
    : value;
}

export function getDayRecord(state, dateKey = toDateKey()) {
  return {
    steps: Number(state.records[dateKey]?.steps || 0),
    weight: Number(state.records[dateKey]?.weight || 0),
    fatloss: Number(state.records[dateKey]?.fatloss || 0),
    musclegain: Number(state.records[dateKey]?.musclegain || 0),
    water: Number(state.records[dateKey]?.water || 0),
    muscle: Number(state.records[dateKey]?.muscle || 0),
    sleep: Number(state.records[dateKey]?.sleep || 0),
    stand: Number(state.records[dateKey]?.stand || 0),
    farview: Number(state.records[dateKey]?.farview || 0),
    note: String(state.records[dateKey]?.note || ''),
    photos: state.records[dateKey]?.photos && typeof state.records[dateKey].photos === 'object'
      ? state.records[dateKey].photos
      : {},
    updatedAt: Number(state.records[dateKey]?.updatedAt || 0),
  };
}

export function updateHealthRecord(state, projectKey, value, options = {}) {
  const project = PROJECT_MAP[projectKey];
  if (!project) return { ok: false, message: '未知健康项目' };
  const dateKey = options.dateKey || toDateKey();
  const record = getDayRecord(state, dateKey);
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < project.min) {
    return { ok: false, message: `请输入有效的${project.name}数据` };
  }
  const nextValue = options.increment ? Number(record[projectKey]) + numeric : numeric;
  if (nextValue < project.min || nextValue > project.max) {
    return { ok: false, message: `${project.name}需在 ${project.min} - ${formatNumber(project.max)} ${project.unit} 之间` };
  }
  if (project.decimals === 0 && !Number.isInteger(nextValue)) {
    return { ok: false, message: `${project.name}需要填写整数` };
  }
  state.records[dateKey] = {
    ...record,
    [projectKey]: Number(nextValue.toFixed(project.decimals)),
    updatedAt: Date.now(),
  };
  if (projectKey === 'weight' && !state.goals.weightBaseline) {
    state.goals.weightBaseline = Number(nextValue.toFixed(project.decimals));
    state.goals.weightBaselineDate = dateKey;
  }
  state.settings.lastManualInputAt = Date.now();
  return {
    ok: true,
    value: state.records[dateKey][projectKey],
    state: saveState(state),
  };
}

export function updateDayValues(state, dateKey, values) {
  for (const project of HEALTH_PROJECTS) {
    if (values[project.key] === '' || values[project.key] === undefined) continue;
    const result = updateHealthRecord(state, project.key, values[project.key], { dateKey });
    if (!result.ok) return result;
  }
  const record = getDayRecord(state, dateKey);
  state.records[dateKey] = {
    ...record,
    note: String(values.note || '').slice(0, 120),
    updatedAt: Date.now(),
  };
  return { ok: true, state: saveState(state) };
}

export function attachPhotoCheckin(state, projectKey, photo, options = {}) {
  const project = PROJECT_MAP[projectKey];
  if (!project) return { ok: false, message: '未知健康项目' };
  if (!photo || !String(photo).startsWith('data:image/')) {
    return { ok: false, message: '照片数据无效，请重新拍摄' };
  }
  const dateKey = options.dateKey || toDateKey();
  const nextState = normalizeState(JSON.parse(JSON.stringify(state)));
  const increment = Number(options.increment || 0);
  const record = getDayRecord(nextState, dateKey);
  if (increment > 0) {
    const nextValue = Number(record[projectKey]) + increment;
    if (nextValue > project.max) {
      return { ok: false, message: `${project.name}不能超过 ${formatNumber(project.max)} ${project.unit}` };
    }
    record[projectKey] = Number(nextValue.toFixed(project.decimals));
  }
  const photos = {
    ...(record.photos || {}),
    [projectKey]: {
      ...(options.cloudRef || {}),
      dataUrl: photo,
      capturedAt: Date.now(),
      label: options.label || `${project.name}照片打卡`,
    },
  };
  nextState.records[dateKey] = {
    ...record,
    photos,
    updatedAt: Date.now(),
  };
  try {
    return { ok: true, state: saveState(nextState) };
  } catch {
    return {
      ok: false,
      message: '照片保存空间不足，请先导出并清理历史照片',
    };
  }
}

export function removeCheckinPhoto(state, projectKey, dateKey = toDateKey()) {
  const record = getDayRecord(state, dateKey);
  if (!record.photos?.[projectKey]) return { ok: false, message: '当天没有这张照片' };
  const photos = { ...record.photos };
  delete photos[projectKey];
  state.records[dateKey] = {
    ...record,
    photos,
    updatedAt: Date.now(),
  };
  return { ok: true, state: saveState(state) };
}

const GOAL_LIMITS = {
  steps: { min: 8000, max: 30000, message: '走路目标建议为 8,000 - 30,000 步' },
  weight: { min: 30, max: 200, message: '目标体重需设置在 30 - 200kg' },
  fatloss: { min: -2, max: -0.1, message: '减脂目标需设置为 -2 至 -0.1kg' },
  musclegain: { min: 0.1, max: 2, message: '增肌目标需设置为 0.1 - 2kg' },
  water: { min: 500, max: 5000, message: '喝大水目标建议为 500 - 5,000ml' },
  muscle: { min: 10, max: 180, message: '练肌肉目标建议为 10 - 180 分钟' },
  sleep: { min: 4, max: 12, message: '睡大觉目标建议为 4 - 12 小时' },
  stand: { min: 1, max: 240, message: '久坐起身目标建议为 1 - 240 分钟' },
  farview: { min: 1, max: 10, message: '看远处目标建议为 1 - 10 分钟' },
};

function normalizeGoalValue(projectKey, rawValue, fallbackValue) {
  const isBlank = rawValue === '' || rawValue === null || rawValue === undefined;
  const project = PROJECT_MAP[projectKey];
  const numeric = isBlank ? Number(fallbackValue) : Number(rawValue);
  const value = project?.decimals ? Number(numeric.toFixed(project.decimals)) : Math.round(numeric);
  const limit = GOAL_LIMITS[projectKey];
  if (!Number.isFinite(value) || !limit) {
    return { ok: false, message: '请输入有效的健康目标' };
  }
  if (value < limit.min || value > limit.max) {
    return { ok: false, message: limit.message };
  }
  return { ok: true, value };
}

export function updateGoals(state, values) {
  const goals = {};
  for (const project of HEALTH_PROJECTS) {
    const result = normalizeGoalValue(
      project.key,
      values[project.key],
      state.goals[project.key] ?? project.goal,
    );
    if (!result.ok) return result;
    goals[project.key] = result.value;
  }
  state.goals = {
    ...goals,
    weightBaseline: state.goals.weightBaseline ?? null,
    weightBaselineDate: state.goals.weightBaselineDate ?? null,
    weightTargetSet: Boolean(state.goals.weightTargetSet),
  };
  return { ok: true, state: saveState(state) };
}

export function setEnabledProjects(state, projectKeys) {
  const allowed = new Set(HEALTH_PROJECTS.map((project) => project.key));
  const selected = [...new Set((projectKeys || []).filter((key) => allowed.has(key)))];
  if (selected.length < 2) return { ok: false, message: '至少选择 2 项每日任务' };
  if (selected.length > 4) return { ok: false, message: '最多选择 4 项每日任务' };
  state.enabledProjects = selected;
  return { ok: true, state: saveState(state) };
}

export function saveTaskSetup(state, projectKeys, goalValues = {}, options = {}) {
  const allowed = new Set(HEALTH_PROJECTS.map((project) => project.key));
  const selected = [...new Set((projectKeys || []).filter((key) => allowed.has(key)))];
  if (selected.length < 2) return { ok: false, message: '至少选择 2 项每日任务' };
  if (selected.length > 4) return { ok: false, message: '最多选择 4 项每日任务' };
  if (
    options.completeOnboarding
    && (goalValues.weight === '' || goalValues.weight === null || goalValues.weight === undefined)
  ) {
    return { ok: false, message: '请先填写你的目标体重' };
  }

  const goals = { ...state.goals };
  for (const key of selected) {
    const project = PROJECT_MAP[key];
    const result = normalizeGoalValue(key, goalValues[key], project.goal);
    if (!result.ok) return result;
    goals[key] = result.value;
  }
  state.enabledProjects = selected;
  state.goals = goals;
  if (options.completeOnboarding) {
    state.onboarding = {
      completed: true,
      completedAt: Date.now(),
    };
    state.goals.weightTargetSet = true;
  }
  return { ok: true, state: saveState(state) };
}

export function selectedProjects(state) {
  return (state.enabledProjects || [])
    .map((key) => PROJECT_MAP[key])
    .filter(Boolean);
}

export function updateProfile(state, values) {
  const nickname = String(values.nickname || '').trim().slice(0, 12);
  if (!nickname) return { ok: false, message: '请输入昵称' };
  state.profile = {
    ...state.profile,
    nickname,
    avatarText: nickname.slice(0, 1),
    motto: String(values.motto || '').trim().slice(0, 60),
  };
  if (state.team?.members) {
    state.team.members = state.team.members.map((member) => (
      member.id === state.profile.id
        ? {
          ...member,
          nickname,
          avatarText: state.profile.avatarText,
        }
        : member
    ));
  }
  return { ok: true, state: saveState(state) };
}

export function resolveTeamActivity(input) {
  const source = typeof input === 'object' && input ? input : { key: input };
  const base = ACTIVITY_MAP[source.key || source.activityKey] || ACTIVITY_MAP.basketball;
  const custom = Boolean(base.custom || source.custom);
  return {
    ...base,
    key: custom ? 'custom' : base.key,
    name: custom ? String(source.name || '').trim().slice(0, 8) : base.name,
    unit: custom ? String(source.unit || '').trim().slice(0, 3) : base.unit,
    dailyGoal: Number(source.dailyGoal || base.dailyGoal),
    decimals: custom ? 1 : base.decimals,
    source: custom ? 'team' : base.source,
    healthProject: custom ? '' : (base.healthProject || ''),
    direction: custom ? '' : (PROJECT_MAP[base.healthProject]?.direction || ''),
    custom,
  };
}

export function validateTeamActivity(activity) {
  if (!activity.name) return '请输入运动名称';
  if (!activity.unit) return '请输入计量单位';
  if (!Number.isFinite(activity.dailyGoal)) return '请输入有效的每日目标';
  if (activity.direction === 'decrease' && activity.dailyGoal >= 0) return '减脂目标需要设置为负数';
  if (activity.direction !== 'decrease' && activity.dailyGoal <= 0) return '每日目标需要大于 0';
  if (Math.abs(activity.dailyGoal) > 1000000) return '每日目标过大';
  return '';
}

function buildChallenge(activity, days, memberCount) {
  const today = toDateKey();
  const count = clamp(Number(days) || 7, 3, 21);
  return {
    id: `challenge_${Date.now()}`,
    title: `${count}天${activity.name}挑战`,
    activityKey: activity.key,
    activityName: activity.name,
    unit: activity.unit,
    dailyGoal: activity.dailyGoal,
    decimals: activity.decimals,
    quickAmount: activity.quickAmount || 1,
    recordSource: activity.source === 'health' ? 'health' : 'team',
    healthProject: activity.healthProject,
    days: count,
    startDate: today,
    endDate: shiftDateKey(today, count - 1),
    goal: Math.abs(activity.dailyGoal) * count * Math.max(1, memberCount),
    logs: {},
  };
}

export function startTeamChallenge(state, activityInput, days) {
  if (!state.team) return { ok: false, message: '请先创建或加入战队' };
  const activity = resolveTeamActivity(activityInput);
  const error = validateTeamActivity(activity);
  if (error) return { ok: false, message: error };
  state.team.challenge = buildChallenge(activity, days, state.team.members.length);
  state.team.rank = null;
  state.team.totalTeams = null;
  return { ok: true, state: saveState(state) };
}

export function createTeam(state, input) {
  const name = String(input.name || '').trim().slice(0, 12);
  if (!name) return { ok: false, message: '请填写战队名称' };
  const activity = resolveTeamActivity(input.activity || 'badminton');
  const error = validateTeamActivity(activity);
  if (error) return { ok: false, message: error };
  state.team = {
    id: `team_${Date.now()}`,
    demo: false,
    name,
    slogan: String(input.slogan || '').trim().slice(0, 40),
    inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    ownerId: state.profile.id,
    rank: null,
    totalTeams: null,
    members: [{
      id: state.profile.id,
      nickname: state.profile.nickname,
      avatarText: state.profile.avatarText,
    }],
    memberSeeds: {},
    challenge: buildChallenge(activity, input.days || 7, 1),
  };
  return { ok: true, state: saveState(state) };
}

export function joinTeam(state, code) {
  return {
    ok: false,
    message: String(code || '').trim()
      ? '邀请码验证将在 CloudBase 数据库接入后开放'
      : '请输入战队邀请码',
  };
}

export function recordTeamActivity(state, value, options = {}) {
  if (!state.team?.challenge) return { ok: false, message: '请先创建挑战' };
  const challenge = state.team.challenge;
  if (challenge.recordSource === 'health') {
    return { ok: false, message: `请在健康记录中填写${challenge.activityName}` };
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) return { ok: false, message: '请输入有效数据' };
  const today = toDateKey();
  if (today < challenge.startDate || today > challenge.endDate) {
    return { ok: false, message: '挑战当前不在可记录日期内' };
  }
  challenge.logs = challenge.logs || {};
  challenge.logs[today] = challenge.logs[today] || {};
  const previous = Number(challenge.logs[today][state.profile.id] || 0);
  const next = options.increment ? previous + numeric : numeric;
  if (next > 1000000) return { ok: false, message: '记录数值过大' };
  challenge.logs[today][state.profile.id] = Number(next.toFixed(challenge.decimals || 0));
  return { ok: true, state: saveState(state) };
}

export function teamOverview(state) {
  const team = state.team;
  if (!team?.challenge) return { exists: false, percent: 0, members: [] };
  const challenge = team.challenge;
  const keys = rangeDateKeys(challenge.startDate, challenge.endDate);
  const logs = challenge.logs || {};
  const healthSource = challenge.recordSource === 'health' && challenge.healthProject;
  const healthProject = healthSource ? PROJECT_MAP[challenge.healthProject] : null;

  function logsTotal(memberId) {
    return keys.reduce((sum, key) => sum + Number(logs[key]?.[memberId] || 0), 0);
  }

  const members = team.members.map((member) => {
    let progress = 0;
    if (member.id === state.profile.id && healthSource) {
      progress = keys.reduce((sum, key) => (
        sum + progressRatio(
          healthProject,
          state.records[key]?.[challenge.healthProject],
          challenge.dailyGoal,
        )
      ), 0);
    } else {
      progress = logsTotal(member.id);
      if (member.id !== state.profile.id && progress === 0) {
        progress = Number(team.memberSeeds?.[member.id]?.[challenge.activityKey] || 0);
      }
    }
    return {
      ...member,
      progress,
      isMe: member.id === state.profile.id,
      role: member.id === team.ownerId ? '队长' : (member.id === state.profile.id ? '我' : '队员'),
    };
  }).sort((a, b) => b.progress - a.progress);

  const top = Math.max(...members.map((member) => member.progress), 1);
  members.forEach((member, index) => {
    member.rank = index + 1;
    member.percent = Math.round(member.progress / top * 100);
    member.progressText = formatNumber(member.progress, challenge.decimals);
  });

  const total = members.reduce((sum, member) => sum + member.progress, 0);
  const percent = challenge.goal > 0
    ? Math.round(clamp(total / challenge.goal, 0, 1) * 100)
    : 0;
  const today = toDateKey();
  const myTodayValue = healthSource
    ? Number(state.records[today]?.[challenge.healthProject] || 0)
    : Number(logs[today]?.[state.profile.id] || 0);
  const daysLeft = today > challenge.endDate
    ? 0
    : rangeDateKeys(today, challenge.endDate).length;

  return {
    exists: true,
    id: team.id,
    name: team.name,
    slogan: team.slogan,
    inviteCode: team.inviteCode,
    demo: team.demo,
    rank: team.rank,
    totalTeams: team.totalTeams,
    challenge: {
      ...challenge,
      total,
      percent,
      totalText: formatNumber(total, challenge.decimals),
      goalText: formatNumber(challenge.goal, challenge.decimals),
      dailyGoalText: formatNumber(challenge.dailyGoal, challenge.decimals),
      myTodayValue,
      myTodayText: formatNumber(myTodayValue, challenge.decimals),
      daysLeft,
      currentDay: clamp(rangeDateKeys(challenge.startDate, today <= challenge.endDate ? today : challenge.endDate).length, 1, challenge.days),
    },
    members,
    memberCount: members.length,
    percent,
  };
}

export function weeklyOverview(state, endKey = toDateKey()) {
  const projects = selectedProjects(state);
  return lastDateKeys(7, endKey).map((key) => {
    const record = getDayRecord(state, key);
    const ratios = projects.map((project) => {
      if (project.key === 'steps') {
        return walkingScore(record.steps, state.goals.steps) / 100;
      }
      if (project.key === 'weight') {
        return Number(record.weight || 0) > 0 ? 1 : 0;
      }
      return progressRatio(project, record[project.key], state.goals[project.key]);
    });
    const average = ratios.reduce((sum, value) => sum + value, 0) / Math.max(1, ratios.length);
    return {
      key,
      weekday: weekdayShort(key),
      dateLabel: dateLabel(key, false),
      ratio: Math.round(average * 100),
      record,
      isToday: key === toDateKey(),
    };
  });
}

export function homeOverview(state) {
  const today = toDateKey();
  const record = getDayRecord(state, today);
  const cards = selectedProjects(state).map((project) => {
    const goal = Number(state.goals[project.key] || project.goal);
    const value = Number(record[project.key] || 0);
    const score = project.key === 'steps'
      ? walkingScore(value, goal)
      : project.key === 'weight'
        ? (value > 0 ? 100 : 0)
        : Math.round(progressRatio(project, value, goal) * 100);
    const ratio = score / 100;
    const remaining = project.direction === 'decrease'
      ? Math.abs(goal - value)
      : Math.max(0, goal - value);
    return {
      ...project,
      value,
      goal,
      percent: score,
      valueText: formatNumber(value, project.decimals),
      goalText: formatNumber(goal, project.decimals),
      done: project.key === 'weight' ? value > 0 : score >= 100,
      remainingText: project.key === 'weight'
        ? (value > 0 ? '今天已记录' : '输入今天的体重')
        : ratio >= 1
          ? '今天已完成'
          : `还差 ${formatNumber(remaining, project.decimals)} ${project.unit}`,
      photo: record.photos?.[project.key] || null,
    };
  });
  const week = weeklyOverview(state);
  let streak = 0;
  let cursor = today;
  while (streak < 366) {
    const item = getDayRecord(state, cursor);
    if (!HEALTH_PROJECTS.some((project) => Number(item[project.key]) !== 0)) break;
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return {
    dateLabel: dateLabel(today),
    cards,
    week,
    completed: cards.filter((card) => card.done).length,
    streak,
    team: teamOverview(state),
  };
}

export function dailyCheckinStatus(state, today = toDateKey()) {
  const checkin = {
    ...createDefaultState().dailyCheckin,
    ...(state.dailyCheckin || {}),
  };
  const checkedInToday = checkin.lastDate === today;
  const yesterday = shiftDateKey(today, -1);
  return {
    checkedInToday,
    lastDate: checkin.lastDate,
    checkedInAt: checkin.checkedInAt,
    streak: checkin.streak,
    nextStreak: checkedInToday
      ? checkin.streak
      : (checkin.lastDate === yesterday ? checkin.streak + 1 : 1),
  };
}

export function completeDailyCheckin(state, today = toDateKey()) {
  const current = dailyCheckinStatus(state, today);
  if (current.checkedInToday) {
    return { ok: true, alreadyChecked: true, state };
  }
  state.dailyCheckin = {
    lastDate: today,
    checkedInAt: Date.now(),
    streak: current.nextStreak,
  };
  return {
    ok: true,
    alreadyChecked: false,
    streak: current.nextStreak,
    state: saveState(state),
  };
}

function completionForRecord(
  state,
  dateKey,
  recordOverride = null,
  projectDefinitions = selectedProjects(state),
  goalsOverride = null,
) {
  const record = recordOverride ? normalizeRecords({ temp: recordOverride }, { records: {} }).temp
    : getDayRecord(state, dateKey);
  const projects = projectDefinitions.map((project) => {
    const goal = Number(goalsOverride?.[project.key] ?? state.goals[project.key] ?? project.goal);
    const value = Number(record?.[project.key] || 0);
    const ratio = progressRatio(project, value, goal);
    return {
      key: project.key,
      name: project.name,
      value,
      goal,
      percent: Math.round(ratio * 100),
      done: ratio >= 1,
    };
  });
  const completed = projects.filter((project) => project.done).length;
  const rate = Math.round(projects.reduce((sum, project) => sum + project.percent, 0) / Math.max(1, projects.length));
  return {
    dateKey,
    projects,
    completed,
    rate,
  };
}

export function leaderboardOverview(state, range = 7) {
  const count = range === 1 ? 1 : 7;
  const dates = lastDateKeys(count);
  const today = toDateKey();
  const allProjects = HEALTH_PROJECTS;
  const memberRecordFor = (memberId, dateKey) => {
    const cloudRecord = state.cloudDailyRecords?.[memberId]?.[dateKey];
    if (cloudRecord) return cloudRecord;
    if (memberId === state.profile.id) {
      return state.records[dateKey] ? getDayRecord(state, dateKey) : null;
    }
    return state.team?.memberRecords?.[memberId]?.[dateKey] || null;
  };
  const cloudGoalProfiles = new Map(
    (state.cloudProfiles || []).map((profile) => [profile.user_id, profile.goals || {}]),
  );
  const memberGoalsFor = (memberId) => (
    memberId === state.profile.id
      ? state.goals
      : (cloudGoalProfiles.get(memberId) || {})
  );
  const weightBaselineFor = (memberId) => {
    const goals = memberGoalsFor(memberId);
    if (Number(goals.weightBaseline || 0) > 0) return Number(goals.weightBaseline);
    const recordMap = memberId === state.profile.id
      ? state.records
      : (state.cloudDailyRecords?.[memberId] || {});
    const first = Object.entries(recordMap)
      .filter(([, record]) => Number(record.weight || 0) > 0)
      .sort(([left], [right]) => left.localeCompare(right))[0];
    return Number(first?.[1]?.weight || 0);
  };
  const weightBaselineDateFor = (memberId) => {
    const goals = memberGoalsFor(memberId);
    if (goals.weightBaselineDate) return goals.weightBaselineDate;
    const recordMap = memberId === state.profile.id
      ? state.records
      : (state.cloudDailyRecords?.[memberId] || {});
    return Object.entries(recordMap)
      .filter(([, record]) => Number(record.weight || 0) > 0)
      .sort(([left], [right]) => left.localeCompare(right))[0]?.[0] || null;
  };
  const memberDayScore = (memberId, dateKey) => {
    const record = memberRecordFor(memberId, dateKey);
    if (!record) {
      return {
        projects: selectedProjects(state).map((project) => ({
          key: project.key,
          name: project.name,
          value: 0,
          goal: Number(memberGoalsFor(memberId)[project.key] || project.goal),
          percent: 0,
          score: 0,
          done: false,
        })),
        rate: 0,
        completed: 0,
        hasRecord: false,
      };
    }
    const goals = memberGoalsFor(memberId);
    const projects = DEFAULT_PROJECT_KEYS.map((key) => {
      const project = PROJECT_MAP[key];
      const value = Number(record[key] || 0);
      const goal = Number(goals[key] ?? project.goal);
      const weightBreakdown = key === 'weight'
        && weightBaselineDateFor(memberId)
        && dateKey > weightBaselineDateFor(memberId)
        ? weightManagementBreakdown(
          value,
          goals.weightBaseline || weightBaselineFor(memberId),
          goal,
          Number(memberRecordFor(memberId, shiftDateKey(dateKey, -1))?.weight || 0),
        )
        : null;
      const score = key === 'steps'
        ? walkingScore(value, goal)
        : key === 'weight'
          ? weightBreakdown?.total || 0
          : Math.round(progressRatio(project, value, goal) * 100);
      return {
        key,
        name: project.name,
        value,
        goal,
        percent: score,
        score,
        breakdown: weightBreakdown,
        done: score >= 100,
      };
    });
    const stepScore = projects.find((project) => project.key === 'steps')?.score || 0;
    const weightScore = projects.find((project) => project.key === 'weight')?.score || 0;
    return {
      projects,
      rate: Math.round(stepScore * 0.7 + weightScore * 0.3),
      completed: projects.filter((project) => project.done).length,
      hasRecord: true,
    };
  };
  const peopleById = new Map();

  peopleById.set(state.profile.id, {
    id: state.profile.id,
    name: state.profile.nickname,
    avatarText: state.profile.avatarText,
    goals: state.goals,
    enabledProjects: state.enabledProjects,
    recordsFor: (dateKey) => (state.records[dateKey] ? getDayRecord(state, dateKey) : null),
  });

  (state.cloudProfiles || []).forEach((profile) => {
    if (peopleById.has(profile.user_id)) return;
    peopleById.set(profile.user_id, {
      id: profile.user_id,
      name: profile.nickname,
      avatarText: profile.avatar_text || '用',
      goals: profile.goals || {},
      enabledProjects: profile.enabled_projects || DEFAULT_PROJECT_KEYS,
      recordsFor: (dateKey) => state.cloudDailyRecords?.[profile.user_id]?.[dateKey] || null,
    });
  });

  const teams = Array.isArray(state.cloudTeams) && state.cloudTeams.length
    ? state.cloudTeams
    : (Array.isArray(state.teams) && state.teams.length
      ? state.teams
      : (state.team ? [state.team] : []));

  teams.forEach((team) => {
    (team.members || []).forEach((member) => {
      if (peopleById.has(member.id)) return;
      peopleById.set(member.id, {
        id: member.id,
        name: member.nickname,
        avatarText: member.avatarText,
        goals: {},
        enabledProjects: DEFAULT_PROJECT_KEYS,
        recordsFor: (dateKey) => (
          state.cloudDailyRecords?.[member.id]?.[dateKey]
          || team.memberRecords?.[member.id]?.[dateKey]
          || null
        ),
      });
    });
  });

  const people = Array.from(peopleById.values()).map((person) => {
    const daily = dates.map((dateKey) => {
      const scored = memberDayScore(person.id, dateKey);
      return {
        dateKey,
        ...scored,
      };
    });
    const averageRate = Math.round(daily.reduce((sum, day) => sum + day.rate, 0) / daily.length);
    const completedTotal = daily.reduce((sum, day) => sum + day.completed, 0);
    const projectScores = Object.fromEntries(allProjects.map((project) => {
      const projectDays = daily.map((day) => (
        day.projects.find((item) => item.key === project.key)
      ));
      const weightDays = projectDays.map((item) => item?.breakdown).filter(Boolean);
      return [
        project.key,
        {
          averagePercent: Math.round(
            projectDays.reduce((sum, item) => sum + Number(item?.score || 0), 0) / daily.length,
          ),
          completedDays: projectDays.filter((item) => Number(item?.score || 0) >= 100).length,
          totalValue: projectDays.reduce((sum, item) => sum + Number(item?.value || 0), 0),
          components: project.key === 'weight' ? {
            progress: Math.round(weightDays.reduce((sum, item) => sum + item.progress, 0) / daily.length),
            stability: Math.round(weightDays.reduce((sum, item) => sum + item.stability, 0) / daily.length),
            record: Math.round(weightDays.reduce((sum, item) => sum + item.record, 0) / daily.length),
          } : null,
        },
      ];
    }));
    const latestWeightDay = daily.slice().reverse().find((day) => {
      const weight = day.projects.find((item) => item.key === 'weight');
      return Number(weight?.value || 0) > 0 && Number(weight?.goal || 0) > 0;
    });
    const latestWeight = latestWeightDay?.projects.find((item) => item.key === 'weight');
    return {
      ...person,
      daily,
      rating: averageRate,
      completedTotal,
      projectScores,
      weightSummary: latestWeight
        ? {
          dateKey: latestWeightDay.dateKey,
          difference: Math.round((latestWeight.value - latestWeight.goal) * 10) / 10,
          target: latestWeight.goal,
        }
        : null,
      cumulativeSteps: {
        total: Number(projectScores.steps?.totalValue || 0),
        perMember: Number(projectScores.steps?.totalValue || 0),
      },
      today: daily.find((day) => day.dateKey === today) || daily[daily.length - 1],
    };
  }).sort((a, b) => b.rating - a.rating || b.completedTotal - a.completedTotal);

  people.forEach((person, index) => {
    person.rank = index + 1;
    person.isMe = person.id === state.profile.id;
  });

  const customTeamRows = teams.map((team) => {
    const daily = dates.map((dateKey) => {
      const memberStats = (team.members || []).map((member) => {
        return memberDayScore(member.id, dateKey);
      });
      const memberCount = Math.max(1, memberStats.length);
      const projectRates = Object.fromEntries(allProjects.map((project) => [
        project.key,
        Math.round(memberStats.reduce((sum, item) => (
          sum + Number(item.projects.find((value) => value.key === project.key)?.score || 0)
        ), 0) / memberCount),
      ]));
      const stepTotal = (team.members || []).reduce((sum, member) => (
        sum + Number(memberRecordFor(member.id, dateKey)?.steps || 0)
      ), 0);
      const weightDifferences = memberStats.flatMap((item) => {
        const weight = item.projects.find((project) => project.key === 'weight');
        return Number(weight?.value || 0) > 0 && Number(weight?.goal || 0) > 0
          ? [Number(weight.value) - Number(weight.goal)]
          : [];
      });
      return {
        dateKey,
        rate: Math.round(memberStats.reduce((sum, item) => sum + item.rate, 0) / memberCount),
        completed: memberStats.reduce((sum, item) => sum + item.completed, 0),
        activeMembers: memberStats.filter((item) => item.hasRecord).length,
        projectRates,
        stepTotal,
        stepPerMember: Math.round(stepTotal / memberCount),
        weightDifference: Math.round(
          weightDifferences.reduce((sum, value) => sum + value, 0) * 10,
        ) / 10,
        weightMembers: weightDifferences.length,
      };
    });
    const rating = Math.round(daily.reduce((sum, day) => sum + day.rate, 0) / daily.length);
    const projectScores = Object.fromEntries(allProjects.map((project) => [
      project.key,
      {
        averagePercent: Math.round(
          daily.reduce((sum, day) => sum + Number(day.projectRates[project.key] || 0), 0) / daily.length,
        ),
        completedDays: daily.filter((day) => Number(day.projectRates[project.key] || 0) >= 100).length,
      },
    ]));
    const challenge = team.challenge;
    const challengeActivity = challenge
      ? resolveTeamActivity(challenge.activity || {
        key: challenge.activityKey || challenge.project,
        name: challenge.activityName,
        unit: challenge.unit,
        dailyGoal: challenge.dailyGoal,
      })
      : null;
    const challengeDaily = challenge
      ? dates.map((dateKey) => {
        const memberValues = (team.members || []).map((member) => {
          let value = 0;
          if (challengeActivity.source === 'health') {
            const record = memberRecordFor(member.id, dateKey);
            value = Number(record?.[challengeActivity.healthProject] || 0);
          } else {
            value = Number(challenge.logs?.[dateKey]?.[member.id] || 0);
          }
          return { member, value };
        });
        let percent = 0;
        if (challengeActivity.key === 'steps') {
          const averageSteps = memberValues.reduce((sum, item) => sum + item.value, 0)
            / Math.max(1, memberValues.length);
          percent = walkingScore(averageSteps, challengeActivity.dailyGoal);
        } else if (challengeActivity.key === 'weight') {
          const memberScores = memberValues.map(({ member, value }) => {
            const goals = memberGoalsFor(member.id);
            const baselineDate = weightBaselineDateFor(member.id);
            return baselineDate && dateKey > baselineDate
              ? weightManagementScore(
                value,
                goals.weightBaseline || weightBaselineFor(member.id),
                goals.weight || challengeActivity.dailyGoal,
                Number(memberRecordFor(member.id, shiftDateKey(dateKey, -1))?.weight || 0),
              )
              : 0;
          });
          percent = Math.round(
            memberScores.reduce((sum, value) => sum + value, 0)
            / Math.max(1, memberScores.length),
          );
        } else if (challengeActivity.source === 'health') {
          const memberRates = memberValues.map(({ value }) => Math.round(progressRatio(
            PROJECT_MAP[challengeActivity.healthProject],
            value,
            challengeActivity.dailyGoal,
          ) * 100));
          percent = Math.round(
            memberRates.reduce((sum, value) => sum + value, 0)
            / Math.max(1, memberRates.length),
          );
        } else {
          const memberRates = memberValues.map(({ value }) => Math.round(
            clamp(value / Math.max(1, challengeActivity.dailyGoal), 0, 1) * 100,
          ));
          percent = Math.round(
            memberRates.reduce((sum, value) => sum + value, 0)
            / Math.max(1, memberRates.length),
          );
        }
        return {
          dateKey,
          percent,
        };
      })
      : [];
    const challengeRating = challengeDaily.length
      ? Math.round(challengeDaily.reduce((sum, day) => sum + day.percent, 0) / challengeDaily.length)
      : 0;
    const challengeScore = challengeActivity ? {
      key: challengeActivity.key,
      name: challengeActivity.name,
      unit: challengeActivity.unit,
      dailyGoal: challengeActivity.dailyGoal,
      daily: challengeDaily,
      rating: challengeRating,
    } : null;
    const cumulativeStepTotal = daily.reduce((sum, day) => sum + Number(day.stepTotal || 0), 0);
    const latestWeightDay = daily.slice().reverse().find((day) => Number(day.weightMembers || 0) > 0);
    return {
      id: team.id,
      name: team.name,
      ownerId: team.ownerId,
      avatarText: team.members?.[0]?.avatarText || '队',
      memberCount: team.members?.length || 0,
      daily,
      rating,
      projectScores,
      cumulativeSteps: {
        total: cumulativeStepTotal,
        perMember: Math.round(cumulativeStepTotal / Math.max(1, team.members?.length || 0)),
        todayPerMember: Number(daily[daily.length - 1]?.stepPerMember || 0),
      },
      weightSummary: latestWeightDay
        ? {
          dateKey: latestWeightDay.dateKey,
          difference: Number(latestWeightDay.weightDifference || 0),
          memberCount: Number(latestWeightDay.weightMembers || 0),
        }
        : null,
      challenge: challengeScore,
      challengeScores: challengeScore ? { [challengeActivity.key]: challengeScore } : {},
      today: daily.find((day) => day.dateKey === today) || daily[daily.length - 1],
      isMine: team.id === state.team?.id,
    };
  }).sort((a, b) => b.rating - a.rating || b.today.rate - a.today.rate);

  const defaultProjects = DEFAULT_PROJECT_KEYS
    .map((key) => PROJECT_MAP[key])
    .filter(Boolean);
  const cloudProfiles = (state.cloudProfiles || []).filter(
    (profile) => profile.user_id !== state.profile.id,
  );
  const groupProfiles = [
    {
      user_id: state.profile.id,
      group_code: state.profile.groupCode || 'personal_center',
      goals: state.goals,
    },
    ...cloudProfiles,
  ];
  const defaultTeamRows = DEFAULT_TEAM_GROUPS.map((group) => {
    const members = groupProfiles.filter((profile) => (
      (profile.group_code || 'personal_center') === group.code
    ));
    const challengeScores = Object.fromEntries(defaultProjects.map((project) => {
      const daily = dates.map((dateKey) => {
        const memberValues = members.map((profile) => {
          const record = memberRecordFor(profile.user_id, dateKey);
          const value = Number(record?.[project.key] || 0);
          const goal = profile.goals?.[project.key]
            ?? state.goals[project.key]
            ?? project.goal;
          return { profile, value, goal };
        });
        let percent = 0;
        if (project.key === 'steps') {
          const averageValue = memberValues.reduce((sum, item) => sum + item.value, 0)
            / Math.max(1, memberValues.length);
          const averageGoal = memberValues.reduce((sum, item) => sum + Number(item.goal), 0)
            / Math.max(1, memberValues.length);
          percent = walkingScore(averageValue, averageGoal);
        } else if (project.key === 'weight') {
          const memberScores = memberValues.map(({ profile, value }) => (
            weightBaselineDateFor(profile.user_id)
              && dateKey > weightBaselineDateFor(profile.user_id)
              ? weightManagementScore(
                value,
                profile.goals?.weightBaseline || weightBaselineFor(profile.user_id),
                profile.goals?.weight || state.goals.weight,
                Number(memberRecordFor(profile.user_id, shiftDateKey(dateKey, -1))?.weight || 0),
              )
              : 0
          ));
          percent = Math.round(
            memberScores.reduce((sum, value) => sum + value, 0)
            / Math.max(1, memberScores.length),
          );
        } else {
          percent = Math.round(
            memberValues.reduce((sum, { value, goal }) => (
              sum + progressRatio(project, value, goal) * 100
            ), 0) / Math.max(1, memberValues.length),
          );
        }
        return {
          dateKey,
          percent,
          stepTotal: memberValues
            .filter(({ profile }) => Boolean(profile))
            .reduce((sum, item) => sum + Number(memberRecordFor(item.profile.user_id, dateKey)?.steps || 0), 0),
        };
      });
      const rating = Math.round(
        daily.reduce((sum, day) => sum + day.percent, 0) / Math.max(1, daily.length),
      );
      return [project.key, {
        key: project.key,
        name: project.name,
        unit: project.unit,
        dailyGoal: Number(state.goals[project.key] ?? project.goal),
        daily,
        rating,
      }];
    }));
    const cumulativeStepTotal = dates.reduce((sum, dateKey) => (
      sum + members.reduce((memberSum, profile) => (
        memberSum + Number(memberRecordFor(profile.user_id, dateKey)?.steps || 0)
      ), 0)
    ), 0);
    const memberCount = members.length;
    const daily = dates.map((dateKey) => {
      const projectRates = Object.fromEntries(defaultProjects.map((project) => [
        project.key,
        challengeScores[project.key].daily.find((day) => day.dateKey === dateKey)?.percent || 0,
      ]));
      const weightedTotal = projectRates.steps !== undefined && projectRates.weight !== undefined
        ? Number(projectRates.steps) * 0.7 + Number(projectRates.weight) * 0.3
        : Object.values(projectRates).reduce((sum, value) => sum + value, 0)
          / Math.max(1, defaultProjects.length);
      return {
        dateKey,
        rate: Math.round(weightedTotal),
        completed: Object.values(projectRates).filter((value) => value >= 100).length,
        projectRates,
        stepPerMember: Math.round(
          Number(challengeScores.steps.daily.find((day) => day.dateKey === dateKey)?.stepTotal || 0)
          / Math.max(1, memberCount),
        ),
        weightDifference: Math.round(
          members.reduce((sum, profile) => {
            const value = Number(memberRecordFor(profile.user_id, dateKey)?.weight || 0);
            const goal = Number(profile.goals?.weight || state.goals.weight || 0);
            return value > 0 && goal > 0 ? sum + value - goal : sum;
          }, 0) * 10,
        ) / 10,
        weightMembers: members.filter((profile) => {
          const value = Number(memberRecordFor(profile.user_id, dateKey)?.weight || 0);
          const goal = Number(profile.goals?.weight || state.goals.weight || 0);
          return value > 0 && goal > 0;
        }).length,
      };
    });
    const rating = Math.round(
      daily.reduce((sum, day) => sum + day.rate, 0) / Math.max(1, daily.length),
    );
    const latestWeightDay = daily.slice().reverse().find((day) => Number(day.weightMembers || 0) > 0);
    return {
      id: group.id,
      code: group.code,
      name: group.name,
      avatarText: group.avatarText,
      memberCount: members.length,
      daily,
      rating,
      cumulativeSteps: {
        total: cumulativeStepTotal,
        perMember: Math.round(cumulativeStepTotal / Math.max(1, memberCount)),
        todayPerMember: Math.round(
          members.reduce((sum, profile) => (
            sum + Number(memberRecordFor(profile.user_id, today)?.steps || 0)
          ), 0) / Math.max(1, memberCount),
        ),
      },
      weightSummary: latestWeightDay
        ? {
          dateKey: latestWeightDay.dateKey,
          difference: Number(latestWeightDay.weightDifference || 0),
          memberCount: Number(latestWeightDay.weightMembers || 0),
        }
        : null,
      projectScores: Object.fromEntries(allProjects.map((project) => {
        const score = challengeScores[project.key];
        return [project.key, {
          averagePercent: score?.rating || 0,
          completedDays: score?.daily.filter((day) => day.percent >= 100).length || 0,
        }];
      })),
      challenge: challengeScores.steps,
      challengeScores,
      today: daily.find((day) => day.dateKey === today) || daily[daily.length - 1],
      isMine: (state.profile.groupCode || 'personal') === group.code,
      isDefaultGroup: true,
    };
  });

  const teamRows = [...customTeamRows, ...defaultTeamRows]
    .sort((a, b) => b.rating - a.rating || b.today.rate - a.today.rate);

  teamRows.forEach((team, index) => {
    team.rank = index + 1;
  });

  return {
    range: count,
    dates,
    people,
    myPerson: people.find((person) => person.isMe) || null,
    teams: teamRows,
    myTeam: teamRows.find((team) => team.isMine) || teamRows[0] || null,
  };
}

export function historyOverview(state, count = 14) {
  const projects = selectedProjects(state);
  return lastDateKeys(count).slice().reverse().map((key) => {
    const record = getDayRecord(state, key);
    const items = projects.map((project) => ({
      label: project.name,
      value: formatNumber(record[project.key], project.decimals),
      unit: project.unit,
      percent: Math.round(progressRatio(
        project,
        record[project.key],
        state.goals[project.key] ?? project.goal,
      ) * 100),
    }));
    return {
      key,
      dateLabel: dateLabel(key),
      items,
      note: record.note,
      hasData: projects.some((project) => Number(record[project.key]) !== 0),
      photos: record.photos || {},
    };
  });
}

export function exportState(state) {
  return JSON.stringify({
    app: 'health-motion',
    version: 2,
    exportedAt: new Date().toISOString(),
    state,
  }, null, 2);
}

export function importState(raw) {
  try {
    const parsed = JSON.parse(raw);
    const candidate = parsed.state || parsed;
    if (!candidate.records || !candidate.goals || !candidate.profile) {
      return { ok: false, message: '文件不包含有效的健康数据' };
    }
    const state = normalizeState(candidate);
    getStorage().setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true, state };
  } catch {
    return { ok: false, message: '无法解析备份文件' };
  }
}

export function getProject(key) {
  return PROJECT_MAP[key];
}

export function getActivity(key) {
  return ACTIVITY_MAP[key];
}

export { STORAGE_KEY, AUTH_KEY };
