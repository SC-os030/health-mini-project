import './styles.css';
import './apple.css';
import { appConfig } from './config.js';
import {
  deleteCheckinPhoto,
  deleteCloudHealthData,
  getCloudSession,
  loadCloudHealthData,
  joinCloudTeam,
  leaveCloudTeam,
  migrateLocalPhotosToCloud,
  onCloudAuthStateChange,
  saveCloudHealthData,
  signOutCloud,
  uploadCheckinPhoto,
} from './cloud.js';
import { choosePhoto, compressPhoto } from './media.js';
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
  dateLabel,
  exportState,
  formatNumber,
  getDayRecord,
  getAuthSession,
  getProject,
  historyOverview,
  homeOverview,
  importState,
  lastDateKeys,
  leaderboardOverview,
  loadState,
  loginWithRealName,
  logoutCurrentUser,
  maskPhone,
  normalizeState,
  parseDateKey,
  progressRatio,
  recordTeamActivity,
  removeCheckinPhoto,
  resetDemoState,
  resolveTeamActivity,
  saveState,
  saveTaskSetup,
  selectedProjects,
  shiftDateKey,
  startTeamChallenge,
  teamOverview,
  toDateKey,
  updateDayValues,
  updateGoals,
  updateHealthRecord,
  updateProfile,
  validateTeamActivity,
  walkingScore,
  weightManagementScore,
  weekdayShort,
} from './store.js';

const ROUTES = [
  { key: 'today', label: '今日', icon: 'home' },
  { key: 'records', label: '健康记录', icon: 'records' },
  { key: 'team', label: '组队挑战', icon: 'team' },
  { key: 'leaderboard', label: '排行榜', icon: 'trophy' },
  { key: 'profile', label: '我的', icon: 'profile' },
];

const GOAL_INPUT_MIN = {
  steps: 8000,
  weight: 30,
  fatloss: -2,
  musclegain: 0.1,
  water: 500,
  muscle: 10,
  sleep: 4,
  stand: 1,
  farview: 1,
};

const LEADERBOARD_DEFAULT_PROJECT_KEYS = ['steps', 'weight'];

const GOAL_INPUT_MAX = {
  steps: 30000,
  weight: 200,
  fatloss: -0.1,
  musclegain: 2,
  water: 5000,
  muscle: 180,
  sleep: 12,
  stand: 240,
  farview: 10,
};

const ICONS = {
  home: '<path d="M3 10.7 12 3l9 7.7V21h-6v-6.5H9V21H3z"/>',
  records: '<path d="M7 4h10v3h3v14H4V7h3z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 20c.4-4 2.2-6 5.5-6s5.1 2 5.5 6M14 14c3.6-.5 6 1.5 6.5 5"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21c.5-5 3-7.5 8-7.5s7.5 2.5 8 7.5"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .6-7.9A6 6 0 0 0 6.2 9 4.5 4.5 0 0 0 7 18Z"/>',
  download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16"/>',
  upload: '<path d="M12 16V4m0 0 4 4m-4-4L8 8M4 19h16"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a8 8 0 0 0-1.7-1L14.5 3h-5L9 5.9a8 8 0 0 0-1.7 1L5 5.9 3 9.4 5 11a7 7 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 1.7 1l.5 3h5l.5-3a8 8 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6a7 7 0 0 0 .1-1Z"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  wechat: '<path d="M8 5C4.7 5 2 7.5 2 10.6c0 1.8 1 3.4 2.5 4.4L4 18l3-1.6c.7.2 1.5.3 2.3.3M16 8c3.3 0 6 2.4 6 5.4 0 1.7-1 3.2-2.4 4.2l.4 2.7-2.7-1.4c-.7.2-1.5.3-2.3.3-3.3 0-6-2.2-6-4.9S12.7 8 16 8Z"/>',
  camera: '<path d="M4 8h3l1.5-2h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a3 3 0 0 0 4 3M16 6h4v2a3 3 0 0 1-4 3M12 13v5M8 21h8M9 18h6"/>',
  cycling: '<circle cx="5.5" cy="17" r="3.5"/><circle cx="18.5" cy="17" r="3.5"/><path d="m5.5 17 4-7h3l2.5 7M9.5 10h5M12 10l-2.5 7H15l3.5-7"/><path d="M14.5 7h2"/>',
  swimming: '<circle cx="7" cy="10" r="2"/><path d="M9 10h4l5 4M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 21c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  sleep: '<path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/><path d="M15 4h4l-4 4h4"/>',
  walk: '<circle cx="13.5" cy="4.5" r="2"/><path d="m10 21 2-6 3-2-1-5 4 3M8 13l3-3 4 3 3 1M4 21h6M14 15l3 6"/>',
  run: '<circle cx="15" cy="4.5" r="2"/><path d="m8 21 3-6 4-2-2-5 4 2M6 11l5-2 4 4 3 1M3 21h7M14 15l4 6"/>',
  rope: '<path d="M7 4v6M17 4v6M7 10c0 6 10 6 10 0M5 3h4M15 3h4"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M7 12c0 3 10 3 10 0"/>',
  yoga: '<circle cx="12" cy="5" r="2"/><path d="M12 8v5M7 20l5-7 5 7M5 13h14M8 11l4 2 4-2"/>',
  badminton: '<path d="M8 3h8l2 9-6 7-6-7z"/><path d="M9 7h6M9.5 11h5M12 19v2"/>',
  water: '<path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11Z"/><path d="M9 14c.5 1.5 1.5 2.5 3 3"/>',
  muscle: '<path d="M4 9v6M7 8v8M17 8v8M20 9v6M7 12h10"/><path d="M2 10v4M22 10v4"/>',
  basketball: '<circle cx="12" cy="12" r="9"/><path d="M3.5 9.5c4.5 1.2 8.8.7 13-1.7M4.2 16c4.3-1 8-.2 11.3 2.7M8.2 3.7c.5 5.5 2.5 10.1 6.8 13.5M15.7 3.8c-1.8 5.4-4.7 9.5-9.9 12.7"/>',
};

function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.arrow}</svg>`;
}

function rankBadge(rank, variant = 'row') {
  const placement = Number(rank);
  const className = variant === 'hero' ? 'rank-medal' : 'ranking-number';
  const visibleRank = Number.isFinite(placement) && placement > 0 ? placement : '—';
  if (![1, 2, 3].includes(placement)) {
    return `<span class="${className}">${visibleRank}</span>`;
  }
  return `<span class="${className} rank-trophy rank-${placement}" role="img" aria-label="第 ${placement} 名">${icon('trophy')}</span>`;
}

function signedMetric(value, decimals = 1) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return '—';
  const number = Math.abs(Number(value)) < 0.05 ? 0 : Number(value);
  return `${number > 0 ? '+' : ''}${formatNumber(number, decimals)}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '夜深了';
  if (hour < 11) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

let state = loadState();
let selectedRecordDate = toDateKey();
let selectedActivityKey = 'badminton';
let challengeDays = 7;
let leaderboardMode = 'individual';
let leaderboardRange = 7;
let leaderboardProject = 'steps';
let leaderboardDetailOpen = false;
let teamLeaderboardScope = 'default';
let calendarOpen = false;
let calendarCursor = toDateKey();
let recordChartProject = 'steps';
let recordChartRange = 'day';
let dailyCheckinPromptShownFor = '';
let pendingPhoto = null;
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
let mobileHeaderFrame = 0;
let mobileNavRevealTimer = 0;
let authBootStatus = 'checking';
let authDraft = {
  phone: state.profile.phone || '',
  realName: state.profile.realName || '',
  groupCode: state.profile.groupCode || 'personal_center',
  consent: false,
};
let cloudAuthenticated = false;
let cloudSyncStatus = 'idle';
let cloudSyncTimer = 0;
let cloudSyncRunning = false;
let cloudSyncPendingState = null;
let cloudHydrating = false;
let cloudRefreshTimer = 0;

const main = document.querySelector('#main');
const modalRoot = document.querySelector('#modal-root');
const toast = document.querySelector('#toast');
const desktopNav = document.querySelector('#desktop-nav');
const mobileNav = document.querySelector('#mobile-nav');
let authSession = null;

function currentRoute() {
  const route = location.hash.replace(/^#/, '') || 'today';
  return ROUTES.some((item) => item.key === route) ? route : 'today';
}

function navMarkup(mobile = false) {
  return ROUTES.map((item) => `
    <button class="nav-link" type="button" data-route="${item.key}">
      ${icon(item.icon)}
      <span>${item.label}</span>
      ${mobile ? '' : '<span class="nav-indicator"></span>'}
    </button>
  `).join('');
}

function renderUserChrome() {
  const name = state.profile.realName || state.profile.nickname || '用户';
  const avatar = state.profile.avatarText || name.slice(0, 1);
  document.querySelectorAll('[data-user-name]').forEach((node) => {
    node.textContent = name;
  });
  document.querySelectorAll('[data-user-avatar]').forEach((node) => {
    node.textContent = avatar;
  });
  document.querySelectorAll('[data-user-phone]').forEach((node) => {
    node.textContent = state.profile.phone ? maskPhone(state.profile.phone) : '我的健康空间';
  });
}

function renderAuthScreen() {
  document.body.classList.add('auth-mode');
  document.querySelectorAll('.nav-link').forEach((button) => {
    button.classList.remove('is-active');
  });
  main.innerHTML = `
    <section class="auth-page">
      <div class="auth-stage">
        <a class="auth-brand" href="#today">
          <span class="brand-mark">动</span>
          <span><b>动一点</b><small>HEALTH IN MOTION</small></span>
        </a>
        <div class="auth-copy">
          <span class="kicker">A BETTER DAY STARTS HERE</span>
          <h1>把健康，<br><em>变成每天的确定。</em></h1>
          <p>走走路，记下体重，再喊上伙伴一起完成今天的挑战。</p>
        </div>
        <div class="auth-motion" aria-hidden="true">
          <div class="auth-orbit one"></div>
          <div class="auth-orbit two"></div>
          <span class="auth-chip chip-a">步</span>
          <span class="auth-chip chip-b">重</span>
          <span class="auth-track"></span>
        </div>
        <div class="auth-benefits">
          <span>走路与体重</span>
          <span>自定义组队</span>
          <span>移动端可用</span>
        </div>
      </div>

      <div class="auth-form-wrap">
        <form class="auth-form" data-form="login">
          <span class="kicker">HEALTH SPACE ACCESS</span>
          <h2>${authBootStatus === 'checking' ? '正在连接健康空间' : '姓名与手机号登录'}</h2>
          <p>${authBootStatus === 'checking'
            ? '正在检查登录状态。'
            : '使用本人姓名、手机号和所属小组直接进入健康空间。'}</p>
          <label class="auth-field" data-phone-field>
            <span>手机号</span>
            <input name="phone" type="tel" inputmode="numeric" maxlength="11" pattern="1[3-9][0-9]{9}" value="${escapeHtml(authDraft.phone)}" placeholder="请输入 11 位手机号" autocomplete="tel" aria-describedby="phone-error" required />
            <small class="auth-field-error" id="phone-error" data-phone-error aria-live="polite"></small>
          </label>
          <label class="auth-field" data-name-field>
            <span>姓名</span>
            <input name="realName" type="text" maxlength="20" value="${escapeHtml(authDraft.realName)}" placeholder="请输入本人中文姓名" autocomplete="name" aria-describedby="name-error" required />
            <small class="auth-field-error" id="name-error" data-name-error aria-live="polite"></small>
          </label>
          <label class="auth-field">
            <span>所属小组</span>
            <select name="groupCode">
              ${DEFAULT_TEAM_GROUPS.map((group) => `
                <option value="${group.code}" ${authDraft.groupCode === group.code ? 'selected' : ''}>${group.name}</option>
              `).join('')}
            </select>
            <small class="auth-field-hint">用于公司小组与小队排行榜统计。</small>
          </label>
          <label class="auth-consent">
            <input name="consent" type="checkbox" ${authDraft.consent ? 'checked' : ''} required />
            <span>我已阅读并同意健康数据仅用于个人记录与组队挑战。</span>
          </label>
          <button class="button primary auth-submit" type="submit" data-login-submit disabled>进入健康空间 ${icon('arrow')}</button>
        </form>
        <div class="auth-trust">
          <span>${icon('cloud')} 健康数据保存在当前浏览器</span>
          <span>${icon('check')} 支持手机浏览器</span>
          <span>${icon('wechat')} 微信健康待接入</span>
        </div>
      </div>
    </section>
  `;
}

function updateLoginValidation() {
  const form = main.querySelector('[data-form="login"]');
  if (!form) return;
  const phoneInput = form.querySelector('[name="phone"]');
  const nameInput = form.querySelector('[name="realName"]');
  const groupInput = form.querySelector('[name="groupCode"]');
  const consent = form.querySelector('[name="consent"]');
  const submit = form.querySelector('[data-login-submit]');
  const phoneField = form.querySelector('[data-phone-field]');
  const nameField = form.querySelector('[data-name-field]');
  const phoneError = form.querySelector('[data-phone-error]');
  const nameError = form.querySelector('[data-name-error]');
  const phone = phoneInput.value.replace(/\s+/g, '');
  const phoneValid = /^1[3-9]\d{9}$/.test(phone);
  const name = nameInput.value.trim();
  const nameValid = /^[\u3400-\u9fff·]{2,20}$/.test(name);
  const groupValid = DEFAULT_TEAM_GROUPS.some((group) => group.code === groupInput.value);
  const phoneTouched = phone.length > 0;
  const nameTouched = name.length > 0;

  phoneField.classList.toggle('is-invalid', phoneTouched && !phoneValid);
  phoneInput.setAttribute('aria-invalid', phoneTouched && !phoneValid ? 'true' : 'false');
  phoneError.textContent = phoneTouched && !phoneValid ? '请输入正确的 11 位手机号' : '';
  nameField.classList.toggle('is-invalid', nameTouched && !nameValid);
  nameInput.setAttribute('aria-invalid', nameTouched && !nameValid ? 'true' : 'false');
  nameError.textContent = nameTouched && !nameValid ? '请输入 2-20 位中文姓名' : '';
  submit.disabled = !(
    phoneValid
    && nameValid
    && groupValid
    && consent.checked
  );
}

function renderNav() {
  if (authSession) renderUserChrome();
  desktopNav.innerHTML = navMarkup();
  mobileNav.innerHTML = navMarkup(true);
  const route = currentRoute();
  document.querySelectorAll('.nav-link').forEach((button) => {
    const active = button.dataset.route === route;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-current', active ? 'page' : 'false');
  });
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.dataset.type = type;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

function updateMobileHeaderOnScroll() {
  if (mobileHeaderFrame) return;
  mobileHeaderFrame = requestAnimationFrame(() => {
    mobileHeaderFrame = 0;
    const header = document.querySelector('.mobile-top');
    if (!header) return;
    const isPhoneLayout = window.matchMedia('(max-width: 980px)').matches;
    const currentY = Math.max(0, window.scrollY);
    const mobileNav = document.querySelector('.mobile-nav');

    if (!isPhoneLayout) {
      header.classList.remove('is-hidden', 'has-scrolled');
      mobileNav?.classList.remove('is-scrolling-down');
      clearTimeout(mobileNavRevealTimer);
      lastScrollY = currentY;
      return;
    }

    const scrollingDown = currentY > lastScrollY + 2 && currentY > 18;
    if (mobileNav && scrollingDown) {
      mobileNav.classList.add('is-scrolling-down');
    }
    clearTimeout(mobileNavRevealTimer);
    if (mobileNav) {
      mobileNavRevealTimer = setTimeout(() => {
        mobileNav.classList.remove('is-scrolling-down');
      }, 180);
    }

    if (currentY <= 6) {
      header.classList.remove('is-hidden');
    } else if (currentY > lastScrollY + 2) {
      header.classList.add('is-hidden');
    }
    header.classList.toggle('has-scrolled', currentY > 6);
    lastScrollY = currentY;
  });
}

function closeModal() {
  modalRoot.innerHTML = '';
  document.body.classList.remove('modal-open');
}

function maybeShowDailyCheckin() {
  if (!authSession) return;
  if (state.settings?.taskReminderDisabled) return;
  if (!state.onboarding?.completed) return;
  const today = toDateKey();
  const status = dailyCheckinStatus(state, today);
  if (status.checkedInToday || dailyCheckinPromptShownFor === today) return;
  dailyCheckinPromptShownFor = today;
  openModal({
    title: '别忘了今天的打卡任务',
    description: `${dateLabel(today)} · 完成今天的健康记录后，记得回来一键签到。`,
    submitLabel: '一键签到',
    content: `
      <div class="one-tap-checkin-visual">
        <span class="checkin-orbit"></span>
        <span class="checkin-check">${icon('check')}</span>
        <b>${status.nextStreak}</b>
        <small>天连续签到</small>
      </div>
      <p class="one-tap-checkin-note">完成后今日不再显示，明天进入时会再次提醒。也可以选择关闭这类登录提醒。</p>
      <label class="reminder-optout">
        <input type="checkbox" data-setting="task-reminder" />
        <span class="reminder-optout-marker">${icon('check')}</span>
        <span>不再提醒</span>
      </label>
    `,
    onSubmit() {
      const result = completeDailyCheckin(state, today);
      if (!result.ok) {
        showToast(result.message || '签到失败', 'error');
        return false;
      }
      state = result.state;
      showToast(`签到成功，已连续 ${result.streak} 天`);
      renderPage({ preserveScroll: true });
    },
  });
}

function promptForFirstEntry() {
  if (!authSession) return;
  if (!state.onboarding?.completed || !state.goals.weightTargetSet) {
    openTaskPicker({ firstRun: true });
    return;
  }
  maybeShowDailyCheckin();
}

function cloudStatusMarkup() {
  if (authSession?.localOnly && !cloudAuthenticated) {
    return '<span class="status-pill">本地保存</span>';
  }
  if (cloudSyncStatus === 'syncing') {
    return '<span class="status-pill"><span class="live-dot"></span>正在保存</span>';
  }
  if (cloudSyncStatus === 'error') {
    return '<span class="status-pill warning">保存待重试</span>';
  }
  if (cloudSyncStatus === 'synced') {
    return '<span class="status-pill"><span class="live-dot"></span>已保存</span>';
  }
  return '<span class="status-pill">准备就绪</span>';
}

function completeDirectLogin({ phone, realName, groupCode }) {
  const canReuseLocalState = state.profile.phone === phone;
  const baseState = canReuseLocalState ? state : createDefaultState();
  baseState.profile.groupCode = groupCode;
  const result = loginWithRealName(baseState, { phone, realName });
  if (!result.ok) return result;
  state = saveState({
    ...result.state,
    profile: {
      ...result.state.profile,
      groupCode,
    },
  });
  authSession = {
    ...result.session,
    uid: state.profile.id,
    groupCode,
    localOnly: true,
  };
  cloudAuthenticated = false;
  cloudSyncStatus = 'local';
  authBootStatus = 'ready';
  document.body.classList.remove('auth-mode');
  renderPage();
  showToast(`欢迎，${realName}`);
  setTimeout(promptForFirstEntry, 320);
  return { ok: true };
}

function restoreLocalSession() {
  const savedSession = getAuthSession();
  if (!savedSession) return false;
  authSession = {
    ...savedSession,
    uid: state.profile.id,
    realName: state.profile.realName || savedSession.realName,
    phone: state.profile.phone || savedSession.phone,
    groupCode: state.profile.groupCode,
    localOnly: true,
  };
  cloudAuthenticated = false;
  cloudSyncStatus = 'local';
  authBootStatus = 'ready';
  document.body.classList.remove('auth-mode');
  renderPage();
  setTimeout(promptForFirstEntry, 320);
  return true;
}

function cloudRecordFromRow(row, existing = {}) {
  return {
    ...existing,
    steps: Number(row.steps || 0),
    weight: Number(row.weight || 0),
    fatloss: Number(row.fatloss || 0),
    musclegain: Number(row.musclegain || 0),
    water: Number(row.water || 0),
    muscle: Number(row.muscle || 0),
    sleep: Number(row.sleep || 0),
    stand: Number(row.stand || 0),
    farview: Number(row.farview || 0),
    note: String(row.note || existing.note || ''),
    photos: Object.keys(row.photos || {}).length
      ? row.photos
      : (existing.photos || {}),
    updatedAt: new Date(row.updated_at || existing.updatedAt || 0).getTime(),
  };
}

function buildCloudTeamData(cloudData, recordsByUser) {
  const membersByTeam = new Map();
  (cloudData.publicMembers || []).forEach((member) => {
    if (!membersByTeam.has(member.team_id)) membersByTeam.set(member.team_id, []);
    membersByTeam.get(member.team_id).push(member);
  });
  const latestChallengeByTeam = new Map();
  (cloudData.publicChallenges || []).forEach((challenge) => {
    if (!latestChallengeByTeam.has(challenge.team_id)) {
      latestChallengeByTeam.set(challenge.team_id, challenge);
    }
  });
  const logsByChallenge = new Map();
  (cloudData.publicLogs || []).forEach((log) => {
    if (!logsByChallenge.has(log.challenge_id)) logsByChallenge.set(log.challenge_id, {});
    const challengeLogs = logsByChallenge.get(log.challenge_id);
    challengeLogs[log.log_date] = challengeLogs[log.log_date] || {};
    challengeLogs[log.log_date][log.user_id] = Number(log.value || 0);
  });
  const ownTeamRows = new Map((cloudData.ownTeams || []).map((team) => [team.id, team]));
  return (cloudData.publicTeams || []).map((team) => {
    const members = (membersByTeam.get(team.id) || []).map((member) => ({
      id: member.user_id,
      nickname: member.display_name,
      avatarText: member.avatar_text || '队',
      role: member.role,
    }));
    const challengeRow = latestChallengeByTeam.get(team.id);
    const currentTeamRow = ownTeamRows.get(team.id);
    const memberRecords = {};
    members.forEach((member) => {
      if (recordsByUser[member.id]) memberRecords[member.id] = recordsByUser[member.id];
    });
    return {
      id: team.id,
      demo: false,
      name: team.name,
      slogan: team.slogan || '',
      inviteCode: currentTeamRow?.invite_code || '',
      ownerId: team.owner_id,
      rank: null,
      totalTeams: null,
      members,
      memberSeeds: {},
      memberRecords,
      challenge: challengeRow ? {
        id: challengeRow.id,
        title: `${challengeRow.days}天${challengeRow.activity_name}挑战`,
        activityKey: challengeRow.activity_key,
        activityName: challengeRow.activity_name,
        unit: challengeRow.unit,
        dailyGoal: Number(challengeRow.daily_goal || 0),
        decimals: Number(challengeRow.decimals || 0),
        quickAmount: Number(challengeRow.quick_amount || 1),
        recordSource: challengeRow.record_source,
        healthProject: challengeRow.health_project || '',
        days: challengeRow.days,
        startDate: challengeRow.start_date,
        endDate: challengeRow.end_date,
        goal: Number(challengeRow.goal || 0),
        createdBy: challengeRow.created_by,
        logs: logsByChallenge.get(challengeRow.id) || {},
      } : null,
    };
  });
}

function mergeCloudData(localState, cloudData, session, identity = {}) {
  const remoteProfile = cloudData.profile;
  const profile = remoteProfile
    ? {
      ...localState.profile,
      id: session.uid,
      realName: remoteProfile.real_name || identity.realName || localState.profile.realName,
      phone: remoteProfile.phone || identity.phone || localState.profile.phone,
      nickname: remoteProfile.nickname || identity.realName || localState.profile.nickname,
      avatarText: remoteProfile.avatar_text
        || (identity.realName || localState.profile.nickname || '用').slice(0, 1),
      groupCode: remoteProfile.group_code
        || identity.groupCode
        || localState.profile.groupCode
        || 'personal',
      motto: remoteProfile.motto || localState.profile.motto,
    }
    : {
      ...localState.profile,
      id: session.uid,
      realName: identity.realName || localState.profile.realName,
      phone: identity.phone || localState.profile.phone,
      nickname: identity.realName || localState.profile.nickname,
      avatarText: (identity.realName || localState.profile.nickname || '用').slice(0, 1),
      groupCode: identity.groupCode || localState.profile.groupCode || 'personal',
    };
  const remoteGoals = remoteProfile?.goals && typeof remoteProfile.goals === 'object'
    ? remoteProfile.goals
    : {};
  const remoteProjects = Array.isArray(remoteProfile?.enabled_projects)
    ? remoteProfile.enabled_projects
    : localState.enabledProjects;
  const records = { ...localState.records };
  cloudData.records.forEach((row) => {
    const localRecord = records[row.record_date] || {};
    const cloudUpdatedAt = new Date(row.updated_at || 0).getTime();
    const localUpdatedAt = Number(localRecord.updatedAt || 0);
    if (localUpdatedAt > cloudUpdatedAt) return;
    records[row.record_date] = cloudRecordFromRow(row, localRecord);
  });
  const cloudDailyRecords = {};
  (cloudData.publicRecords || []).forEach((row) => {
    cloudDailyRecords[row.user_id] = cloudDailyRecords[row.user_id] || {};
    cloudDailyRecords[row.user_id][row.record_date] = cloudRecordFromRow(
      row,
      cloudDailyRecords[row.user_id][row.record_date] || {},
    );
  });
  Object.entries(records).forEach(([dateKey, record]) => {
    cloudDailyRecords[session.uid] = cloudDailyRecords[session.uid] || {};
    cloudDailyRecords[session.uid][dateKey] = {
      ...(cloudDailyRecords[session.uid][dateKey] || {}),
      ...record,
    };
  });
  const cloudTeams = buildCloudTeamData(cloudData, cloudDailyRecords);
  const currentTeam = cloudTeams.find((team) => (
    team.id === localState.team?.id
    && team.members.some((member) => member.id === session.uid)
  )) || cloudTeams.find((team) => (
    team.members.some((member) => member.id === session.uid)
  )) || null;
  const onboarding = remoteProfile
    ? {
      completed: Boolean(remoteProfile.onboarding_completed),
      completedAt: remoteProfile.onboarding_completed_at
        ? new Date(remoteProfile.onboarding_completed_at).getTime()
        : 0,
    }
    : localState.onboarding;
  return normalizeState({
    ...localState,
    profile,
    goals: { ...localState.goals, ...remoteGoals },
    enabledProjects: remoteProjects,
    records,
    onboarding,
    dailyCheckin: cloudData.latestCheckin
      ? {
        lastDate: cloudData.latestCheckin.checkin_date,
        checkedInAt: new Date(cloudData.latestCheckin.checked_in_at).getTime(),
        streak: Number(cloudData.latestCheckin.streak || 1),
      }
      : localState.dailyCheckin,
    team: currentTeam,
    cloudProfiles: cloudData.publicProfiles || [],
    cloudDailyRecords,
    cloudTeams,
    cloudCommunity: cloudData.communityShares || [],
  });
}

async function enterCloudSession(session, identity = {}) {
  authBootStatus = 'checking';
  const cloudData = await loadCloudHealthData(session.uid);
  const identityPhone = String(identity.phone || session.phone || '').replace(/\D/g, '');
  const localPhone = String(state.profile.phone || '').replace(/\D/g, '');
  const canReuseLocalState = state.profile.id === session.uid
    || Boolean(identityPhone && localPhone && identityPhone === localPhone);
  cloudHydrating = true;
  state = mergeCloudData(
    canReuseLocalState ? state : createDefaultState(),
    cloudData,
    session,
    identity,
  );
  const photoMigration = await migrateLocalPhotosToCloud(state, session.uid);
  state = photoMigration.state;
  state = saveState(state);
  cloudHydrating = false;
  authSession = {
    loggedIn: true,
    uid: session.uid,
    phone: identity.phone || session.phone || state.profile.phone,
    realName: state.profile.realName || identity.realName || state.profile.nickname,
    loggedInAt: Date.now(),
  };
  cloudAuthenticated = true;
  logoutCurrentUser();
  authBootStatus = 'ready';
  cloudSyncStatus = 'synced';
  document.body.classList.remove('auth-mode');
  renderPage();
  scheduleCloudSync(state);
  showToast(photoMigration.failed
    ? `健康数据已加载，${photoMigration.failed} 张旧照片保存失败`
    : '登录成功，健康数据已加载');
  setTimeout(promptForFirstEntry, 320);
}

async function bootstrapCloudAuth() {
  authBootStatus = 'checking';
  renderPage();
  try {
    const session = await getCloudSession();
    if (!session) {
      if (restoreLocalSession()) return;
      authBootStatus = 'ready';
      renderPage();
      return;
    }
    await enterCloudSession(session, {
      phone: session.phone || state.profile.phone,
      realName: state.profile.realName || state.profile.nickname,
      groupCode: state.profile.groupCode,
    });
  } catch (error) {
    if (restoreLocalSession()) return;
    authBootStatus = 'ready';
    authSession = null;
    renderPage();
    showToast(error.message || '登录状态检查失败', 'error');
  }
}

function scheduleCloudSync(nextState = state) {
  if (!cloudAuthenticated || !authSession?.uid || cloudHydrating) return;
  cloudSyncPendingState = nextState;
  clearTimeout(cloudSyncTimer);
  cloudSyncTimer = setTimeout(flushCloudSync, 650);
}

async function flushCloudSync() {
  if (cloudSyncRunning || !cloudSyncPendingState || !authSession?.uid) return;
  const snapshot = cloudSyncPendingState;
  cloudSyncPendingState = null;
  cloudSyncRunning = true;
  cloudSyncStatus = 'syncing';
  try {
    await saveCloudHealthData(snapshot, authSession.uid);
    cloudSyncStatus = 'synced';
  } catch (error) {
    cloudSyncStatus = 'error';
    showToast('保存暂时未完成，请稍后重试', 'error');
  } finally {
    cloudSyncRunning = false;
    if (cloudSyncPendingState) {
      clearTimeout(cloudSyncTimer);
      cloudSyncTimer = setTimeout(flushCloudSync, 350);
    }
  }
}

async function refreshCloudWorkspace() {
  if (!cloudAuthenticated || !authSession?.uid) return;
  if (cloudSyncRunning || cloudSyncPendingState) {
    clearTimeout(cloudRefreshTimer);
    cloudRefreshTimer = setTimeout(refreshCloudWorkspace, 650);
    return;
  }
  try {
    const session = await getCloudSession();
    if (!session) return;
    const cloudData = await loadCloudHealthData(session.uid);
    cloudHydrating = true;
    state = mergeCloudData(state, cloudData, session, {
      phone: state.profile.phone,
      realName: state.profile.realName,
      groupCode: state.profile.groupCode,
    });
    state = saveState(state);
    cloudHydrating = false;
    cloudSyncStatus = 'synced';
    renderPage({ preserveScroll: true });
  } catch {
    cloudHydrating = false;
    cloudSyncStatus = 'error';
  }
}

function openModal({ title, description = '', content, submitLabel = '保存', onSubmit, wide = false }) {
  modalRoot.innerHTML = `
    <div class="modal-backdrop" data-action="close-modal"></div>
    <section class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" type="button" data-action="close-modal" aria-label="关闭">×</button>
      <span class="kicker">HEALTH MOTION</span>
      <h2 id="modal-title">${escapeHtml(title)}</h2>
      ${description ? `<p class="modal-description">${escapeHtml(description)}</p>` : ''}
      <form id="modal-form">
        <div class="modal-content">${content || ''}</div>
        ${onSubmit ? `
          <div class="modal-actions">
            <button class="button secondary" type="button" data-action="close-modal">取消</button>
            <button class="button primary" type="submit">${escapeHtml(submitLabel)}</button>
          </div>
        ` : ''}
      </form>
    </section>
  `;
  document.body.classList.add('modal-open');
  if (onSubmit) {
    const form = modalRoot.querySelector('#modal-form');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        const result = await onSubmit(new FormData(form));
        if (result !== false) closeModal();
      } catch (error) {
        showToast(error.message || '操作失败，请稍后重试', 'error');
      }
    });
  }
  const firstInput = modalRoot.querySelector('input, textarea, select, button');
  firstInput?.focus();
}

function applyResult(result, successMessage, options = {}) {
  if (!result.ok) {
    showToast(result.message, 'error');
    return false;
  }
  state = result.state;
  showToast(successMessage);
  renderPage({
    preserveScroll: true,
    animateProject: options.animateProject,
  });
  return true;
}

function playHabitAnimation(projectKey) {
  const card = main.querySelector(`.habit-card[data-project="${projectKey}"]`);
  if (!card) return;
  const className = `animate-${projectKey}`;
  if (projectKey === 'steps') {
    const targetPercent = Number.parseFloat(card.style.getPropertyValue('--target')) || 0;
    const travel = Math.max(18, Math.round(card.clientWidth * targetPercent / 100 * 0.82));
    card.style.setProperty('--travel', `${travel}px`);
  }
  card.classList.add(className);
  const fill = card.querySelector('.progress-track span');
  if (fill) fill.classList.add('progress-fill-animated');
  setTimeout(() => {
    card.classList.remove(className);
    if (fill) fill.classList.remove('progress-fill-animated');
  }, projectKey === 'muscle' ? 1400 : 1100);
}

function projectToneClass(tone) {
  return `tone-${tone}`;
}

function ringStyle(percent) {
  return `--ring-value:${Math.max(3, percent)}%;`;
}

function healthScoreForProject(project, value, goal, dateKey) {
  if (project.key === 'steps') return walkingScore(value, goal);
  if (project.key === 'weight') {
    return weightManagementScore(
      value,
      state.goals.weightBaseline || value,
      goal,
      Number(getDayRecord(state, shiftDateKey(dateKey, -1)).weight || 0),
    );
  }
  return Math.round(progressRatio(project, value, goal) * 100);
}

function renderTrendChart(week) {
  const width = 560;
  const height = 220;
  const padding = { top: 24, right: 18, bottom: 38, left: 34 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const points = week.map((item, index) => ({
    x: padding.left + index * (innerWidth / (week.length - 1)),
    y: padding.top + innerHeight - item.ratio / 100 * innerHeight,
    ...item,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x},${point.y}`).join(' ');
  const area = `${line} L${points.at(-1).x},${height - padding.bottom} L${points[0].x},${height - padding.bottom} Z`;
  return `
    <svg class="trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="最近七天健康目标平均完成度">
      <defs>
        <linearGradient id="trend-area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#8cb43c" stop-opacity=".34"/>
          <stop offset="1" stop-color="#8cb43c" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="${padding.left}" x2="${width - padding.right}" y1="${padding.top + innerHeight * .25}" y2="${padding.top + innerHeight * .25}" class="chart-grid"/>
      <line x1="${padding.left}" x2="${width - padding.right}" y1="${padding.top + innerHeight * .65}" y2="${padding.top + innerHeight * .65}" class="chart-grid"/>
      <path d="${area}" fill="url(#trend-area)"/>
      <path d="${line}" class="chart-line"/>
      ${points.map((point) => `
        <circle cx="${point.x}" cy="${point.y}" r="${point.isToday ? 6 : 4}" class="${point.isToday ? 'chart-dot today' : 'chart-dot'}"/>
        <text x="${point.x}" y="${height - 13}" text-anchor="middle" class="chart-label ${point.isToday ? 'today' : ''}">${point.isToday ? '今天' : `周${point.weekday}`}</text>
      `).join('')}
    </svg>
  `;
}

function habitControl(project, card) {
  if (project.key === 'weight') {
    return `
      <form class="inline-field body-change-field" data-form="home-health" data-project="weight">
        <label class="sr-only" for="home-weight-input">今天的体重</label>
        <input
          id="home-weight-input"
          name="value"
          type="number"
          min="30"
          max="200"
          step="0.1"
          inputmode="decimal"
          value="${card.value || ''}"
          placeholder="例如 65.5"
        />
        <button type="submit">记录体重</button>
      </form>
    `;
  }
  if (project.key === 'fatloss' || project.key === 'musclegain') {
    return `
      <form class="inline-field body-change-field" data-form="home-health" data-project="${project.key}">
        <label class="sr-only" for="home-${project.key}-input">今日体重变化</label>
        <input
          id="home-${project.key}-input"
          name="value"
          type="number"
          min="-5"
          max="5"
          step="0.1"
          inputmode="decimal"
          value="${card.value || ''}"
          placeholder="${project.key === 'fatloss' ? '例如 -0.2' : '例如 +0.1'}"
        />
        <button type="submit">记录体重变化</button>
      </form>
    `;
  }
  if (project.key === 'water') {
    return `
      <div class="quick-row">
        <button class="quick-pill" type="button" data-action="quick-water" data-amount="250">+250ml</button>
        <button class="quick-pill" type="button" data-action="quick-water" data-amount="500">+500ml</button>
        <form class="inline-field" data-form="home-health" data-project="water">
          <label class="sr-only" for="home-water-input">今日喝大水总量</label>
          <input id="home-water-input" name="value" type="number" min="0" max="10000" step="1" value="${card.value || ''}" placeholder="自定义" />
          <button type="submit">更新</button>
        </form>
      </div>
    `;
  }
  if (project.key === 'muscle') {
    return `
      <div class="quick-row">
        <button class="quick-pill dark" type="button" data-action="quick-muscle" data-amount="15">${icon('plus')} 15 分钟</button>
        <button class="quick-pill" type="button" data-action="quick-muscle" data-amount="30">${icon('plus')} 30 分钟</button>
        <form class="inline-field" data-form="home-health" data-project="muscle">
          <label class="sr-only" for="home-muscle-input">今日练肌肉累计分钟数</label>
          <input id="home-muscle-input" name="value" type="number" min="0" max="720" step="1" value="${card.value || ''}" placeholder="输入分钟" />
          <button type="submit">记录</button>
        </form>
      </div>
    `;
  }
  if (project.key === 'stand') {
    return `
      <div class="quick-row">
        <button class="quick-pill dark" type="button" data-action="quick-stand" data-amount="5">${icon('plus')} 5 分钟</button>
        <button class="quick-pill" type="button" data-action="quick-stand" data-amount="10">${icon('plus')} 10 分钟</button>
        <form class="inline-field" data-form="home-health" data-project="stand">
          <label class="sr-only" for="home-stand-input">今日久坐起身活动分钟数</label>
          <input id="home-stand-input" name="value" type="number" min="0" max="240" step="1" value="${card.value || ''}" placeholder="输入分钟" />
          <button type="submit">记录</button>
        </form>
      </div>
    `;
  }
  if (project.key === 'farview') {
    return `
      <div class="quick-row">
        <button class="quick-pill dark" type="button" data-action="quick-farview" data-amount="5">${icon('plus')} 5 分钟</button>
        <button class="quick-pill" type="button" data-action="quick-farview" data-amount="10">${icon('plus')} 10 分钟</button>
        <form class="inline-field" data-form="home-health" data-project="farview">
          <label class="sr-only" for="home-farview-input">今日看远处分钟数</label>
          <input id="home-farview-input" name="value" type="number" min="0" max="10" step="1" value="${card.value || ''}" placeholder="最多 10 分钟" />
          <button type="submit">记录</button>
        </form>
      </div>
    `;
  }
  return `
    <form class="inline-field" data-form="home-health" data-project="${project.key}">
      <label class="sr-only" for="home-${project.key}-input">今日${project.name}</label>
      <input
        id="home-${project.key}-input"
        name="value"
        type="number"
        min="0"
        max="${project.max}"
        step="${project.decimals ? '0.1' : '1'}"
        value="${card.value || ''}"
        placeholder="输入今日数据"
      />
      <button type="submit">保存</button>
    </form>
  `;
}

function renderHome() {
  const overview = homeOverview(state);
  const todayDone = overview.completed;
  const taskCount = overview.cards.length;
  const taskNames = overview.cards.map((card) => card.name).join('、');
  return `
    <section class="page today-page">
      <header class="page-heading">
        <div>
          <span class="kicker">HEALTH IN MOTION · ${overview.dateLabel}</span>
          <h1>${greeting()}，${escapeHtml(state.profile.nickname)}</h1>
          <p>${escapeHtml(state.profile.motto)}</p>
        </div>
        <div class="heading-actions">
          ${cloudStatusMarkup()}
          <button class="avatar-button" type="button" data-route="profile" aria-label="打开个人中心">${escapeHtml(state.profile.avatarText)}</button>
        </div>
      </header>

      <section class="hero-panel" aria-label="今日健康概览">
        <div class="hero-orbit orbit-a"></div>
        <div class="hero-orbit orbit-b"></div>
        <div class="hero-lines"></div>
        <div class="hero-content">
          <span class="hero-badge">TODAY'S RHYTHM</span>
          <h2>把今天照顾好，<br><em>就是最好的长期主义。</em></h2>
          <p>每天固定记录走路和体重，目标可以按自己的节奏调整。</p>
          <button class="button light" type="button" data-route="records">完整记录今天 ${icon('arrow')}</button>
        </div>
        <div class="hero-score">
          <div class="hero-ring" style="${ringStyle(todayDone / taskCount * 100)}">
            <div class="hero-ring-inner">
              <strong>${todayDone}<small>/${taskCount}</small></strong>
              <span>今日完成</span>
            </div>
          </div>
          <div class="hero-score-copy">
            <b>连续 ${overview.streak} 天</b>
            <span>每一次记录都算数</span>
          </div>
        </div>
      </section>

      <div class="dashboard-grid">
        <div class="dashboard-main">
          <div class="section-heading">
            <div><span class="kicker">TODAY'S PLAN</span><h2>今天的 ${taskCount} 件大事</h2></div>
            <button class="text-link" type="button" data-action="edit-health-goals">调整目标 ${icon('arrow')}</button>
          </div>
          <div class="habit-grid">
            ${overview.cards.map((card) => {
              const project = getProject(card.key);
              return `
                <article class="habit-card ${projectToneClass(project.tone)} ${card.done ? 'is-done' : ''}" data-project="${card.key}" style="--target:${card.percent}%;">
                  <div class="habit-head">
                    <span class="habit-mark">${project.mark}</span>
                    <span class="habit-kicker">${project.kicker}</span>
                    <span class="habit-percent" style="--percent:${card.percent}%"><span>${card.percent}%</span></span>
                  </div>
                  <div class="habit-copy">
                    <h3>${card.name}</h3>
                    <p>${card.hint}</p>
                  </div>
                  <div class="habit-value">
                    <strong>${card.valueText}</strong>
                    <span>/ ${card.goalText} ${card.unit}</span>
                  </div>
                  <div class="progress-track" aria-label="${card.name}完成 ${card.percent}%">
                    <span style="width:${card.percent}%"></span>
                  </div>
                  <div class="habit-motion" aria-hidden="true">
                    <span class="foot-trail">
                      <i></i><i></i><i></i>
                    </span>
                    <span class="water-pour-motion">
                      <b class="cup"></b>
                      <i></i><i></i><i></i>
                    </span>
                    <span class="dumbbell-motion"><i></i><b></b><i></i></span>
                    <span class="sleep-motion"><b>Z</b><b>Z</b><b>Z</b></span>
                  </div>
                  <div class="habit-footer">
                    <span>${card.remainingText}</span>
                    <span class="habit-status">${card.done
                      ? '已达标'
                      : (card.key === 'weight' && card.value > 0 ? '已记录' : '继续积累')}</span>
                  </div>
                  ${habitControl(project, card)}
                  <div class="photo-checkin-row">
                    <button class="photo-checkin-button" type="button" data-action="capture-photo" data-project="${card.key}">
                      ${icon('camera')}
                      <span>${card.photo ? '重拍照片' : '拍照打卡'}</span>
                    </button>
                    ${card.photo ? `
                      <button class="photo-thumb" type="button" data-action="view-photo" data-project="${card.key}" aria-label="查看${card.name}照片">
                        <img src="${card.photo.dataUrl}" alt="${card.name}照片打卡" />
                        <span>已拍照</span>
                      </button>
                    ` : '<span class="photo-hint">支持手机相机</span>'}
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <section class="panel team-panel">
            <div class="panel-head">
              <div>
                <span class="kicker">BETTER TOGETHER</span>
                <h2>${overview.team.exists ? escapeHtml(overview.team.challenge.title) : '和伙伴一起出发'}</h2>
              </div>
              <button class="text-link" type="button" data-route="team">进入战队 ${icon('arrow')}</button>
            </div>
            ${overview.team.exists ? `
              <div class="team-summary">
                <div class="team-emblem">队</div>
                <div class="team-summary-copy">
                  <b>${escapeHtml(overview.team.name)}</b>
                  <p>${escapeHtml(overview.team.slogan || '一起完成新的健康挑战')}</p>
                </div>
                <span class="team-rank">${overview.team.rank ? `第 ${overview.team.rank} 名` : '新战队'}</span>
              </div>
              <div class="team-progress-row">
                <div>
                  <strong>${overview.team.challenge.totalText}</strong>
                  <span>/ ${overview.team.challenge.goalText} ${overview.team.challenge.unit}</span>
                </div>
                <b>${overview.team.percent}%</b>
              </div>
              <div class="progress-track dark"><span style="width:${overview.team.percent}%"></span></div>
              <div class="avatar-stack">
                ${overview.team.members.map((member) => `<span class="mini-avatar">${escapeHtml(member.avatarText)}</span>`).join('')}
                <span>已有 ${overview.team.memberCount} 人并肩</span>
              </div>
            ` : `
              <div class="empty-inline">
                <p>创建战队，发起羽毛球、骑行或自定义挑战，一起完成共同目标。</p>
                <button class="button dark" type="button" data-route="team">创建战队</button>
              </div>
            `}
          </section>
        </div>

        <aside class="dashboard-side">
          <section class="panel trend-panel">
            <div class="panel-head compact">
              <div><span class="kicker">7 DAY RHYTHM</span><h2>行动节奏</h2></div>
              <span class="trend-average">平均 ${Math.round(overview.week.reduce((sum, day) => sum + day.ratio, 0) / 7)}%</span>
            </div>
            ${renderTrendChart(overview.week)}
          </section>

          <section class="panel focus-panel">
            <span class="kicker">NEXT STEP</span>
            <h2>今天先完成哪一件？</h2>
            <div class="focus-list">
              ${overview.cards.map((card) => `
                <button class="focus-row ${card.done ? 'done' : ''}" type="button" data-route="records">
                  <span class="focus-mark">${getProject(card.key).mark}</span>
                  <span><b>${card.name}</b><small>${card.done ? '已完成' : card.remainingText}</small></span>
                  ${card.done ? icon('check') : icon('arrow')}
                </button>
              `).join('')}
            </div>
          </section>

        </aside>
      </div>
    </section>
  `;
}

function renderRecords() {
  const dates = lastDateKeys(7);
  const record = getDayRecord(state, selectedRecordDate);
  const history = historyOverview(state, 7);
  return `
    <section class="page records-page">
      <header class="page-heading">
        <div>
          <span class="kicker">DAILY LOG</span>
          <h1>健康记录</h1>
          <p>所有数据都可以手动填写或修改，支持补录最近日期。</p>
        </div>
        ${cloudStatusMarkup()}
      </header>

      <section class="date-panel">
        <div class="date-panel-head">
          <div><span class="kicker">SELECT DATE</span><h2>${dateLabel(selectedRecordDate)}</h2></div>
          <input class="date-input" type="date" value="${selectedRecordDate}" max="${toDateKey()}" data-action="change-date" aria-label="选择记录日期" />
        </div>
        <div class="date-strip">
          ${dates.map((key) => `
            <button class="date-chip ${key === selectedRecordDate ? 'is-active' : ''}" type="button" data-action="select-record-date" data-date="${key}">
              <span>周${weekdayShort(key)}</span>
              <b>${Number(key.slice(-2))}</b>
              <i></i>
            </button>
          `).join('')}
        </div>
      </section>

      <div class="record-layout">
        <section class="panel record-editor">
          <div class="panel-head">
            <div><span class="kicker">MANUAL INPUT</span><h2>填写 ${dateLabel(selectedRecordDate, false)} 的数据</h2></div>
            <span class="edit-badge">${selectedRecordDate === toDateKey() ? '今天' : '补录'}</span>
          </div>
          <form data-form="save-day">
            <input type="hidden" name="date" value="${selectedRecordDate}" />
            <div class="record-fields">
              ${HEALTH_PROJECTS.map((project) => {
                const goal = state.goals[project.key];
                return `
                  <label class="record-field ${projectToneClass(project.tone)}">
                    <span class="record-field-head">
                      <span class="habit-mark small">${project.mark}</span>
                      <span><b>${project.name}</b><small>目标 ${formatNumber(goal, project.decimals)} ${project.unit}</small></span>
                    </span>
                    <span class="record-input">
                      <input
                        name="${project.key}"
                        type="number"
                        min="${project.min}"
                        max="${project.max}"
                        step="${project.decimals ? '0.1' : '1'}"
                        value="${record[project.key] || ''}"
                        placeholder="未记录"
                        aria-label="${project.name}"
                      />
                      <em>${project.unit}</em>
                    </span>
                  </label>
                `;
              }).join('')}
            </div>
            <label class="note-field">
              <span>今日备注</span>
              <textarea name="note" maxlength="120" placeholder="记录身体感受、训练内容或今天的心情">${escapeHtml(record.note)}</textarea>
            </label>
            <div class="form-actions">
              <span>保存后会自动更新健康记录。</span>
              <button class="button primary" type="submit">保存这一天 ${icon('check')}</button>
            </div>
          </form>
        </section>

        <aside class="record-aside">
          <section class="panel insight-card">
            <span class="kicker">TODAY'S STATUS</span>
            <h2>四个维度，一起看</h2>
            <div class="mini-stat-grid">
              ${HEALTH_PROJECTS.map((project) => {
                const percent = Math.round(progressRatio(
                  project,
                  record[project.key],
                  state.goals[project.key] ?? project.goal,
                ) * 100);
                return `
                  <div class="mini-stat">
                    <span>${project.name}</span>
                    <strong>${percent}%</strong>
                    <i><b style="width:${percent}%"></b></i>
                  </div>
                `;
              }).join('')}
            </div>
          </section>
          <section class="panel privacy-card">
            <div class="shield-icon">${icon('settings')}</div>
            <h2>数据说明</h2>
            <p>当前 Web 版本采用本地优先存储。清空浏览器数据前，请先在个人中心导出备份。</p>
          </section>
        </aside>
      </div>

      <div class="section-heading history-heading">
        <div><span class="kicker">RECENT HISTORY</span><h2>最近记录</h2></div>
        <span class="muted-note">近 7 天</span>
      </div>
      <section class="history-list">
        ${history.map((item) => `
          <article class="history-row ${item.hasData ? '' : 'is-empty'}">
            <div class="history-date">
              <b>${item.dateLabel.split(' ')[0]}</b>
              <span>${item.dateLabel.split(' ')[1] || ''}</span>
            </div>
            <div class="history-values">
              ${item.items.map((value) => `<span><small>${value.label}</small><b>${value.value}</b><em>${value.unit}</em></span>`).join('')}
            </div>
            <span class="history-note">${item.note || (item.hasData ? '—' : '暂无记录')}</span>
          </article>
        `).join('')}
      </section>
    </section>
  `;
}

function monthCalendar(cursorKey) {
  const cursor = parseDateKey(cursorKey);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1, 12);
  const gridStart = new Date(year, month, 1 - first.getDay(), 12);
  const today = toDateKey();
  const projects = selectedProjects(state);
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart.getTime() + index * 86400000);
    const key = toDateKey(date);
    const record = getDayRecord(state, key);
    const active = projects.some((project) => Number(record[project.key]) !== 0);
    const completed = projects.filter((project) => (
      healthScoreForProject(
        project,
        record[project.key],
        state.goals[project.key] ?? project.goal,
        key,
      ) >= 100
    )).length;
    return {
      key,
      day: date.getDate(),
      weekday: date.getDay(),
      inMonth: date.getMonth() === month,
      isToday: key === today,
      isSelected: key === selectedRecordDate,
      isFuture: key > today,
      active,
      completed,
      allCompleted: projects.length > 0 && completed === projects.length,
    };
  });
  return {
    year,
    month,
    label: `${year}年${month + 1}月`,
    cells,
  };
}

function healthChartBuckets(range) {
  const today = parseDateKey(toDateKey());
  if (range === 'week') {
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    return Array.from({ length: 8 }, (_, index) => {
      const start = new Date(monday);
      start.setDate(monday.getDate() - (7 - index) * 7);
      return {
        label: `${start.getMonth() + 1}/${start.getDate()}`,
        dates: Array.from({ length: 7 }, (_, offset) => {
          const date = new Date(start);
          date.setDate(start.getDate() + offset);
          return toDateKey(date);
        }),
      };
    });
  }
  if (range === 'month') {
    return Array.from({ length: 6 }, (_, index) => {
      const start = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1, 12);
      const days = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      return {
        label: `${start.getMonth() + 1}月`,
        dates: Array.from({ length: days }, (_, offset) => {
          const date = new Date(start);
          date.setDate(offset + 1);
          return toDateKey(date);
        }),
      };
    });
  }
  if (range === 'year') {
    return Array.from({ length: 5 }, (_, index) => {
      const year = today.getFullYear() - (4 - index);
      const start = new Date(year, 0, 1, 12);
      const end = new Date(year, 11, 31, 12);
      const yearDays = Math.round((end - start) / 86400000) + 1;
      const count = year === today.getFullYear()
        ? Math.floor((today - start) / 86400000) + 1
        : yearDays;
      return {
        label: `${year}年`,
        dates: Array.from({ length: count }, (_, offset) => {
          const date = new Date(start);
          date.setDate(offset + 1);
          return toDateKey(date);
        }),
      };
    });
  }
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    return {
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      dates: [toDateKey(date)],
    };
  });
}

function healthChartData(projectKey, range) {
  const bucketList = healthChartBuckets(range);
  const project = getProject(projectKey);
  const goal = Number(state.goals[projectKey] || project.goal);
  const todayKey = toDateKey();
  return bucketList.map((bucket) => {
    const validDates = bucket.dates.filter((key) => key <= todayKey);
    const records = validDates.map((key) => getDayRecord(state, key));
    if (projectKey === 'weight') {
      const values = records.map((record) => Number(record.weight || 0)).filter((value) => value > 0);
      return {
        label: bucket.label,
        value: values.length
          ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1))
          : null,
      };
    }
    const averageSteps = records.reduce((sum, record) => sum + Number(record.steps || 0), 0)
      / Math.max(1, records.length);
    return {
      label: bucket.label,
      value: Math.round(averageSteps),
      score: walkingScore(averageSteps, goal),
    };
  });
}

function renderStepsBarChart(data, goal) {
  const width = 640;
  const height = 250;
  const top = 28;
  const bottom = 38;
  const innerHeight = height - top - bottom;
  const slot = (width - 56) / Math.max(1, data.length);
  const maxValue = Math.max(goal, ...data.map((item) => Number(item.value || 0)), 1);
  return `
    <svg class="health-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="走路趋势柱状图">
      <defs>
        <linearGradient id="steps-bar-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#00d7ff"/>
          <stop offset="1" stop-color="#1677ff"/>
        </linearGradient>
      </defs>
      <line x1="28" x2="${width - 28}" y1="${top + innerHeight}" y2="${top + innerHeight}" class="health-chart-axis"/>
      ${data.map((item, index) => {
        const barHeight = Math.max(4, Number(item.value || 0) / maxValue * innerHeight);
        const x = 34 + index * slot + slot * 0.16;
        const barWidth = slot * 0.68;
        return `
          <rect x="${x}" y="${top + innerHeight - barHeight}" width="${barWidth}" height="${barHeight}" rx="8" fill="url(#steps-bar-gradient)"/>
          <text x="${x + barWidth / 2}" y="${top + innerHeight - barHeight - 8}" text-anchor="middle" class="health-chart-value">${item.score}</text>
          <text x="${x + barWidth / 2}" y="${height - 14}" text-anchor="middle" class="health-chart-label">${item.label}</text>
        `;
      }).join('')}
    </svg>
  `;
}

function renderWeightLineChart(data) {
  const width = 640;
  const height = 250;
  const top = 26;
  const bottom = 38;
  const known = data
    .map((item, index) => ({ ...item, index }))
    .filter((item) => item.value !== null);
  if (!known.length) {
    return `<div class="health-chart-empty">记录体重后，这里会出现变化曲线</div>`;
  }
  const values = known.map((item) => item.value);
  const min = Math.min(...values) - 1;
  const max = Math.max(...values) + 1;
  const innerHeight = height - top - bottom;
  const xFor = (index) => 34 + index * ((width - 68) / Math.max(1, data.length - 1));
  const yFor = (value) => top + (max - value) / Math.max(1, max - min) * innerHeight;
  const points = known.map((item) => `${xFor(item.index)},${yFor(item.value)}`).join(' ');
  const area = known.length > 1
    ? `M${xFor(known[0].index)},${height - bottom} L${points.replaceAll(' ', ' L')} L${xFor(known.at(-1).index)},${height - bottom} Z`
    : '';
  return `
    <svg class="health-chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="体重变化折线图">
      <defs>
        <linearGradient id="weight-area-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#19c37d" stop-opacity=".38"/>
          <stop offset="1" stop-color="#19c37d" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <line x1="28" x2="${width - 28}" y1="${top + innerHeight}" y2="${top + innerHeight}" class="health-chart-axis"/>
      ${area ? `<path d="${area}" fill="url(#weight-area-gradient)"/>` : ''}
      ${known.length > 1 ? `<polyline points="${points}" class="weight-chart-line"/>` : ''}
      ${known.map((item) => `
        <circle cx="${xFor(item.index)}" cy="${yFor(item.value)}" r="6" class="weight-chart-dot"/>
        <text x="${xFor(item.index)}" y="${yFor(item.value) - 12}" text-anchor="middle" class="health-chart-value">${item.value}</text>
      `).join('')}
      ${data.map((item, index) => `
        <text x="${xFor(index)}" y="${height - 14}" text-anchor="middle" class="health-chart-label">${item.label}</text>
      `).join('')}
    </svg>
  `;
}

function renderHealthVisualization() {
  const project = getProject(recordChartProject) || getProject('steps');
  const today = getDayRecord(state, toDateKey());
  const previousWeight = Number(getDayRecord(state, shiftDateKey(toDateKey(), -1)).weight || 0);
  const stepScore = walkingScore(today.steps, state.goals.steps);
  const weightScore = weightManagementScore(
    today.weight,
    state.goals.weightBaseline || today.weight,
    state.goals.weight,
    previousWeight,
  );
  const data = healthChartData(project.key, recordChartRange);
  const rangeOptions = project.key === 'steps'
    ? [['day', '每天'], ['week', '每周'], ['month', '每月'], ['year', '每年']]
    : [['day', '每天'], ['week', '每周'], ['month', '每月']];
  return `
    <section class="panel health-viz-panel">
      <div class="panel-head">
        <div><span class="kicker">HEALTH INSIGHTS</span><h2>完成概览</h2></div>
        <span class="muted-note">点击指标查看趋势</span>
      </div>
      <div class="health-metric-switch" role="tablist" aria-label="健康指标">
        <button class="${project.key === 'steps' ? 'is-selected metric-steps' : 'metric-steps'}" type="button" data-action="record-chart-project" data-project="steps">
          <span>${icon('walk')} 走路</span>
          <b>${stepScore}</b>
          <small>今日得分</small>
        </button>
        <button class="${project.key === 'weight' ? 'is-selected metric-weight' : 'metric-weight'}" type="button" data-action="record-chart-project" data-project="weight">
          <span>${icon('water')} 体重</span>
          <b>${weightScore}</b>
          <small>今日得分</small>
        </button>
      </div>
      <div class="chart-range-switch" role="tablist" aria-label="统计周期">
        ${rangeOptions.map(([key, label]) => `
          <button class="${recordChartRange === key ? 'is-selected' : ''}" type="button" data-action="record-chart-range" data-range="${key}">${label}</button>
        `).join('')}
      </div>
      <div class="health-chart-stage">
        ${project.key === 'steps'
          ? renderStepsBarChart(data, state.goals.steps)
          : renderWeightLineChart(data)}
      </div>
    </section>
  `;
}

function renderHealthRecords() {
  const dates = lastDateKeys(7);
  const record = getDayRecord(state, selectedRecordDate);
  const projects = selectedProjects(state);
  const calendar = monthCalendar(calendarCursor);
  const localCommunity = historyOverview(state, 7)
    .filter((item) => Object.keys(item.photos || {}).length > 0)
    .map((item) => ({
      ...item,
      key: `local-${state.profile.id}-${item.key}`,
      dateKey: item.key,
      authorName: state.profile.nickname || state.profile.realName || '我',
      authorAvatar: state.profile.avatarText || '我',
    }));
  const cloudCommunity = Array.isArray(state.cloudCommunity)
    ? state.cloudCommunity.map((share) => ({
      key: `${share.user_id}-${share.record_date}`,
      dateKey: share.record_date,
      dateLabel: dateLabel(share.record_date),
      authorName: share.nickname || '用户',
      authorAvatar: share.avatar_text || '用',
      note: share.note || '',
      photos: share.photos || {},
      items: selectedProjects(state).map((project) => ({
        label: project.name,
        value: formatNumber(share[project.key], project.decimals),
        unit: project.unit,
      })),
    }))
    : [];
  const seenCommunity = new Set();
  const community = [...localCommunity, ...cloudCommunity].filter((item) => {
    const dedupeKey = `${item.dateKey}-${item.authorName}`;
    if (seenCommunity.has(dedupeKey)) return false;
    seenCommunity.add(dedupeKey);
    return true;
  });
  return `
    <section class="page records-page">
      <header class="page-heading">
        <div>
          <span class="kicker">DAILY LOG</span>
          <h1>健康记录</h1>
          <p>健康数据由首页输入，这里以只读方式查看每日完成情况。</p>
        </div>
        <span class="status-pill">${icon('check')} 只读展示</span>
      </header>

      <section class="date-panel">
        <div class="date-panel-head">
          <div><span class="kicker">SELECT DATE</span><h2>${dateLabel(selectedRecordDate)}</h2></div>
          <div class="date-panel-actions">
            <button class="calendar-toggle ${calendarOpen ? 'is-active' : ''}" type="button" data-action="toggle-calendar">
              ${icon('calendar')} ${calendarOpen ? '收起日历' : '查看全月'}
            </button>
            <input class="date-input" type="date" value="${selectedRecordDate}" max="${toDateKey()}" data-action="change-date" aria-label="选择记录日期" />
          </div>
        </div>
        ${calendarOpen ? `
          <div class="month-calendar">
            <div class="month-calendar-head">
              <button type="button" data-action="calendar-prev" aria-label="上个月">‹</button>
              <b>${calendar.label}</b>
              <button type="button" data-action="calendar-next" aria-label="下个月">›</button>
            </div>
            <div class="month-weekdays">
              ${['日', '一', '二', '三', '四', '五', '六'].map((day) => `<span>${day}</span>`).join('')}
            </div>
            <div class="month-grid">
              ${calendar.cells.map((cell) => `
                <button
                  class="month-day ${cell.inMonth ? '' : 'is-outside'} ${cell.isSelected ? 'is-selected' : ''} ${cell.isToday ? 'is-today' : ''}"
                  type="button"
                  data-action="select-record-date"
                  data-date="${cell.key}"
                  ${cell.isFuture ? 'disabled' : ''}
                  aria-label="${dateLabel(cell.key)}，${cell.completed}项达标"
                >
                  <span>${cell.day}</span>
                  <i class="${cell.allCompleted ? 'is-complete' : 'is-incomplete'}"></i>
                </button>
              `).join('')}
            </div>
          </div>
        ` : `
          <div class="date-strip">
            ${dates.map((key) => {
              const dayRecord = getDayRecord(state, key);
              const completed = projects.filter((project) => (
                healthScoreForProject(
                  project,
                  dayRecord[project.key],
                  state.goals[project.key] ?? project.goal,
                  key,
                ) >= 100
              )).length;
              const allCompleted = projects.length > 0 && completed === projects.length;
              return `
                <button class="date-chip ${key === selectedRecordDate ? 'is-active' : ''}" type="button" data-action="select-record-date" data-date="${key}">
                  <span>周${weekdayShort(key)}</span>
                  <b>${Number(key.slice(-2))}</b>
                  <i class="${allCompleted ? 'is-complete' : 'is-incomplete'}"></i>
                </button>
              `;
            }).join('')}
          </div>
        `}
      </section>

      <div class="record-layout">
        <section class="panel record-display">
          <div class="panel-head">
            <div><span class="kicker">READ ONLY</span><h2>${dateLabel(selectedRecordDate, false)} 的完成情况</h2></div>
            <span class="edit-badge">来自首页</span>
          </div>
          <div class="record-fields read-only-fields">
            ${projects.map((project) => {
              const goal = state.goals[project.key] ?? project.goal;
              const value = Number(record[project.key] || 0);
              const percent = project.key === 'steps'
                ? walkingScore(value, goal)
                : project.key === 'weight'
                  ? weightManagementScore(
                    value,
                    state.goals.weightBaseline || value,
                    goal,
                    Number(getDayRecord(state, shiftDateKey(selectedRecordDate, -1)).weight || 0),
                  )
                  : Math.round(progressRatio(project, value, goal) * 100);
              return `
                <article class="record-field ${projectToneClass(project.tone)}">
                  <span class="record-field-head">
                    <span class="habit-mark small">${project.mark}</span>
                    <span><b>${project.name}</b><small>目标 ${formatNumber(goal, project.decimals)} ${project.unit}</small></span>
                  </span>
                  <span class="record-display-value">${formatNumber(value, project.decimals)} <em>${project.unit}</em></span>
                  <span class="record-display-track"><i style="width:${percent}%"></i></span>
                  <small class="record-display-status">${percent >= 100 ? '已达标' : `得分 ${percent}`}</small>
                </article>
              `;
            }).join('')}
          </div>
          ${record.note ? `<blockquote class="record-note-readonly">“${escapeHtml(record.note)}”</blockquote>` : ''}
          <div class="read-only-footer">
            <span>健康记录请在首页填写，此页面仅供查看。</span>
            <button class="button primary" type="button" data-route="today">去首页记录 ${icon('arrow')}</button>
          </div>
        </section>

        <aside class="record-aside">
          <section class="panel privacy-card">
            <div class="shield-icon">${icon('settings')}</div>
            <h2>记录说明</h2>
            <p>每日任务在首页完成，健康记录会自动保存并支持历史查看。</p>
          </section>
        </aside>
      </div>

      ${renderHealthVisualization()}

      <div class="section-heading history-heading">
        <div><span class="kicker">COMMUNITY</span><h2>社区分享</h2></div>
        <span class="muted-note">成员照片分享</span>
      </div>
      <section class="community-feed">
        ${community.length ? community.map((item) => `
          <article class="community-post panel">
            <div class="community-post-head">
              <span class="avatar">${escapeHtml(item.authorAvatar || state.profile.avatarText)}</span>
              <span class="community-author">
                <b>${escapeHtml(item.authorName || state.profile.nickname)}</b>
                <small>${item.dateLabel} · 社区可见</small>
              </span>
              <span class="community-badge">${item.items.filter((value) => value.value !== '0').length} 项记录</span>
            </div>
            <div class="community-activity-list">
              ${item.items.filter((value) => value.value !== '0').map((value) => `
                <span><b>${value.label}</b><strong>${value.value}</strong><em>${value.unit}</em></span>
              `).join('')}
            </div>
            ${Object.keys(item.photos || {}).length ? `
              <div class="community-photo-strip">
                ${Object.values(item.photos).slice(0, 3).map((photo) => `<img src="${photo.dataUrl}" alt="打卡照片" />`).join('')}
              </div>
            ` : ''}
            ${item.note ? `<p class="community-note">${escapeHtml(item.note)}</p>` : ''}
          </article>
        `).join('') : `
          <div class="panel empty-state community-empty">
            <b class="empty-title">还没有照片分享</b>
            <span class="empty-copy">只有包含照片的打卡才会出现在社区分享中，当前尚未有用户分享照片。</span>
          </div>
        `}
      </section>
      <div class="community-database-note">
        ${icon('cloud')}
        <span>社区照片仅向已登录成员展示，请避免上传包含敏感信息的照片。</span>
      </div>
    </section>
  `;
}

function activityOptionsMarkup() {
  return TEAM_ACTIVITIES.filter((activity) => !activity.hidden).map((activity) => `
    <button class="activity-choice ${selectedActivityKey === activity.key ? 'is-selected' : ''}" type="button" data-action="select-activity" data-activity="${activity.key}" aria-pressed="${selectedActivityKey === activity.key}">
      <span>${icon(activity.iconName, 'activity-icon')}</span>
      <b>${activity.name}</b>
      <small>${activity.custom
        ? '自定目标'
        : `每次 ${formatNumber(activity.dailyGoal, activity.decimals)} ${activity.unit}`}</small>
    </button>
  `).join('');
}

function renderTeam() {
  const team = teamOverview(state);
  const selectedActivity = resolveTeamActivity(selectedActivityKey);
  const previewMembers = team.exists ? team.memberCount : 1;
  const totalGoal = Math.abs(selectedActivity.dailyGoal) * challengeDays * previewMembers;
  return `
    <section class="page team-page">
      <header class="page-heading">
        <div>
          <span class="kicker">CREW CHALLENGE</span>
          <h1>组队挑战</h1>
          <p>默认参与走路和体重挑战，也可以创建自己的战队与自定义挑战。</p>
        </div>
      </header>

      ${team.exists ? `
        <section class="team-hero-panel">
          <div class="team-hero-copy">
            <span class="team-demo">${team.demo ? '体验战队' : '我的战队'}</span>
            <span class="kicker">OUR CREW</span>
            <h2>${escapeHtml(team.name)}</h2>
            <p>${escapeHtml(team.slogan || '一起出发，彼此照亮。')}</p>
            <div class="team-metrics">
              <div><strong>${team.memberCount}</strong><span>位伙伴</span></div>
              <div><strong>${team.challenge.currentDay}</strong><span>挑战第几天</span></div>
              <div><strong>${team.challenge.daysLeft}</strong><span>天后结束</span></div>
            </div>
          </div>
          <div class="team-hero-art" aria-hidden="true">
            <span class="hero-avatar a">满</span>
            <span class="hero-avatar b">泽</span>
            <span class="hero-avatar c">晴</span>
            <span class="hero-avatar me">康</span>
            <i></i>
          </div>
        </section>

        <div class="team-layout">
          <section class="panel challenge-overview">
            <div class="panel-head">
              <div><span class="kicker">CURRENT CHALLENGE</span><h2>${escapeHtml(team.challenge.title)}</h2></div>
              <span class="team-rank">${team.rank ? `当前第 ${team.rank} 名` : '新晋战队'}</span>
            </div>
            <div class="challenge-big-number">
              <div><strong>${team.challenge.totalText}</strong><span>/ ${team.challenge.goalText} ${team.challenge.unit}</span></div>
              <b>${team.percent}%</b>
            </div>
            <div class="challenge-progress"><span style="width:${team.percent}%"></span></div>
            <div class="challenge-meta">
              <span>${dateLabel(team.challenge.startDate, false)} - ${dateLabel(team.challenge.endDate, false)}</span>
              <span>每人每日 ${team.challenge.dailyGoalText} ${team.challenge.unit}</span>
            </div>
            ${team.challenge.recordSource === 'team' ? `
              <form class="team-entry" data-form="team-activity">
                <div>
                  <span class="kicker">MY ACTIVITY</span>
                  <h3>记录今天的${escapeHtml(team.challenge.activityName)}</h3>
                  <p>今天已记录 ${team.challenge.myTodayText} ${team.challenge.unit}</p>
                </div>
                <div class="team-entry-input">
                  <input name="value" type="number" min="0" step="0.1" value="${team.challenge.myTodayValue || ''}" placeholder="今日累计" required />
                  <span>${team.challenge.unit}</span>
                </div>
                <button class="button secondary" type="button" data-action="quick-team-activity">+${formatNumber(team.challenge.quickAmount, team.challenge.decimals)}</button>
                <button class="button dark" type="submit">记录</button>
              </form>
            ` : `
              <button class="team-health-link" type="button" data-route="today">
                <span>今天的${escapeHtml(team.challenge.activityName)}已记录 ${team.challenge.myTodayText} ${team.challenge.unit}</span>
                <b>去首页记录 ${icon('arrow')}</b>
              </button>
            `}
          </section>

          <section class="panel leaderboard">
            <div class="panel-head compact">
              <div><span class="kicker">TEAM RANKING</span><h2>队友贡献榜</h2></div>
              <span class="muted-note">单位：${team.challenge.unit}</span>
            </div>
            ${team.members.map((member) => `
              <div class="leader-row ${member.isMe ? 'is-me' : ''}">
                <span class="leader-rank">${member.rank}</span>
                <span class="mini-avatar">${escapeHtml(member.avatarText)}</span>
                <span class="leader-main">
                  <span class="leader-title"><b>${escapeHtml(member.nickname)}</b><small>${member.role}</small></span>
                  <i><b style="width:${member.percent}%"></b></i>
                </span>
                <strong>${member.progressText}</strong>
              </div>
            `).join('')}
          </section>
        </div>
      ` : `
        <section class="team-empty-panel">
          <div>
            <span class="kicker">BETTER TOGETHER</span>
            <h2>一个人会犹豫，<em>一群人会出发。</em></h2>
            <p>创建战队，发起羽毛球、骑行或自定义挑战。邀请朋友加入后，每个人记录的数据都会累计到共同目标。</p>
            <div class="team-empty-actions">
              <button class="button primary" type="button" data-action="create-team">创建我的战队</button>
              <button class="button secondary" type="button" data-action="join-team">输入邀请码加入</button>
            </div>
          </div>
        </section>
      `}

      <section class="panel challenge-builder">
        <div class="panel-head">
          <div><span class="kicker">CUSTOM CHALLENGE</span><h2>发起新挑战</h2></div>
          <span class="edit-badge">目标自动计算</span>
        </div>
        <form data-form="start-challenge">
          <span class="form-label">选择运动</span>
          <div class="activity-grid">${activityOptionsMarkup()}</div>
          <div class="custom-activity-fields" id="custom-activity-fields" ${selectedActivityKey === 'custom' ? '' : 'hidden'}>
            <label><span>运动名称</span><input name="customName" maxlength="8" placeholder="例如：爬楼" /></label>
            <label><span>计量单位</span><input name="customUnit" maxlength="3" placeholder="层" /></label>
          </div>
          <div class="builder-row">
            <label class="goal-field">
              <span>每人每次目标</span>
              <div><input id="challenge-daily-goal" name="dailyGoal" type="number" min="${selectedActivity.key === 'fatloss' ? -2 : 0.1}" max="${selectedActivity.key === 'fatloss' ? -0.1 : 1000000}" step="0.1" value="${selectedActivity.dailyGoal}" /><em>${selectedActivity.unit}</em></div>
            </label>
            <div class="period-field">
              <span>挑战周期</span>
              <div class="period-pills">
                ${[3, 7, 14, 21].map((days) => `<button class="${challengeDays === days ? 'is-selected' : ''}" type="button" data-action="select-days" data-days="${days}">${days}天</button>`).join('')}
              </div>
            </div>
            <button class="button primary" type="submit" ${team.exists ? '' : 'disabled'}>${team.exists ? '开始挑战' : '请先创建战队'}</button>
          </div>
          <div class="goal-preview" id="team-goal-preview">
            每人每次 ${formatNumber(selectedActivity.dailyGoal, selectedActivity.decimals)} ${selectedActivity.unit}，${previewMembers} 人团队目标约 ${formatNumber(totalGoal, selectedActivity.decimals)} ${selectedActivity.unit}
          </div>
        </form>
      </section>

      ${team.exists ? `
        <section class="team-manage-row">
          <div><span class="kicker">INVITE CODE</span><b>${escapeHtml(team.inviteCode)}</b></div>
          <button class="button secondary" type="button" data-action="copy-invite">复制邀请码</button>
          <button class="text-link danger" type="button" data-action="leave-team">退出当前战队</button>
        </section>
      ` : ''}
    </section>
  `;
}

function renderLeaderboardLegacy() {
  const board = leaderboardOverview(state, leaderboardRange);
  const individualMode = leaderboardMode === 'individual';
  const myPerson = board.myPerson;
  const myTeam = board.myTeam;
  const daily = individualMode ? (myPerson?.daily || []) : (myTeam?.daily || []);
  return `
    <section class="page leaderboard-page">
      <header class="page-heading">
        <div>
          <span class="kicker">DAILY RANKING</span>
          <h1>排行榜</h1>
          <p>每天四项健康进度各占 25%，汇总后形成个人每日完成率；小队成绩按成员每日完成率计算。</p>
        </div>
        <span class="status-pill">${icon('check')} 排名按最新记录更新</span>
      </header>

      <div class="ranking-controls">
        <div class="ranking-segment" role="tablist" aria-label="排行榜类型">
          <button class="${individualMode ? 'is-selected' : ''}" type="button" data-action="leaderboard-mode" data-mode="individual" role="tab" aria-selected="${individualMode}">个人榜</button>
          <button class="${!individualMode ? 'is-selected' : ''}" type="button" data-action="leaderboard-mode" data-mode="team" role="tab" aria-selected="${!individualMode}">小队榜</button>
        </div>
        <div class="ranking-range">
          <button class="${leaderboardRange === 1 ? 'is-selected' : ''}" type="button" data-action="leaderboard-range" data-range="1">今日</button>
          <button class="${leaderboardRange === 7 ? 'is-selected' : ''}" type="button" data-action="leaderboard-range" data-range="7">近 7 天</button>
        </div>
      </div>

      <section class="leaderboard-hero panel">
        <div class="leaderboard-hero-copy">
          <span class="kicker">${individualMode ? 'PERSONAL SCORE' : 'CREW SCORE'}</span>
          <h2>${individualMode ? escapeHtml(myPerson?.name || state.profile.nickname) : escapeHtml(myTeam?.name || '尚未创建小队')}</h2>
          <p>${individualMode
            ? `近 ${leaderboardRange === 1 ? '今日' : '7 天'}平均完成率，按走路、喝大水、练肌肉、睡大觉四项平均计算。`
            : '小队成绩为全部成员每日四项完成率的平均值，成员缺记录按 0% 计入。'}</p>
          <div class="leaderboard-big-score">
            <strong>${individualMode ? (myPerson?.rating || 0) : (myTeam?.rating || 0)}</strong>
            <span>%</span>
          </div>
        </div>
        <div class="leaderboard-medal" aria-hidden="true">
          <span class="rank-medal">${individualMode ? (myPerson?.rank || '—') : (myTeam?.rank || '—')}</span>
          <small>${individualMode ? '个人名次' : '小队名次'}</small>
        </div>
      </section>

      <div class="leaderboard-grid">
        <section class="panel leaderboard-table">
          <div class="panel-head compact">
            <div><span class="kicker">${individualMode ? 'INDIVIDUAL' : 'TEAMS'}</span><h2>${individualMode ? '个人每日排行' : '小队每日排行'}</h2></div>
            <span class="muted-note">${board.range === 1 ? '今日' : '近 7 天平均'}</span>
          </div>
          ${individualMode ? `
            <div class="ranking-list">
              ${board.people.length ? board.people.map((person) => `
                <div class="ranking-row ${person.isMe ? 'is-me' : ''}">
                  <span class="ranking-number">${person.rank}</span>
                  <span class="mini-avatar">${escapeHtml(person.avatarText)}</span>
                  <span class="ranking-person">
                    <b>${escapeHtml(person.name)}${person.isMe ? ' · 我' : ''}</b>
                    <small>今日 ${person.today.completed} / 4 项达标 · 累计 ${person.completedTotal} 项</small>
                  </span>
                  <span class="ranking-score"><b>${person.rating}%</b><small>完成率</small></span>
                </div>
              `).join('') : '<div class="empty-state"><b class="empty-title">暂无排行数据</b><span class="empty-copy">完成今日记录后即可生成个人榜。</span></div>'}
            </div>
          ` : `
            ${board.teams.length ? `
              <div class="ranking-list">
                ${board.teams.map((team) => `
                  <div class="ranking-row team-ranking-row ${team.isMine ? 'is-me' : ''}">
                    <span class="ranking-number">${team.rank}</span>
                    <span class="mini-avatar">${escapeHtml(team.avatarText)}</span>
                    <span class="ranking-person">
                      <b>${escapeHtml(team.name)}${team.isMine ? ' · 我的小队' : ''}</b>
                      <small>${team.memberCount} 位成员 · 今日 ${team.today.rate}%</small>
                    </span>
                    <span class="ranking-score"><b>${team.rating}%</b><small>完成率</small></span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="empty-state">
                <b class="empty-title">还没有小队排名</b>
                <span class="empty-copy">创建战队并完成每日记录后，小队榜会自动生成。</span>
                <button class="button primary" type="button" data-route="team">去创建小队</button>
              </div>
            `}
          `}
        </section>

        <section class="panel leaderboard-trend">
          <div class="panel-head compact">
            <div><span class="kicker">DAILY COMPLETION</span><h2>每日完成情况</h2></div>
          </div>
          ${daily.length ? `
            <div class="daily-rank-list">
              ${daily.map((day) => `
                <div class="daily-rank-row">
                  <span class="daily-rank-date"><b>${dateLabel(day.dateKey, false)}</b><small>周${weekdayShort(day.dateKey)}</small></span>
                  <span class="daily-rank-track"><i style="width:${day.rate}%"></i></span>
                  <strong>${day.rate}%</strong>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state">
              <span class="empty-copy">${individualMode ? '今天开始记录四项健康数据后，这里会显示每日排行趋势。' : '创建小队后，这里会显示小队每天的四项完成率。'}</span>
            </div>
          `}
          <div class="ranking-rule">
            <span class="kicker">RANKING RULE</span>
            <p>走路、喝大水、练肌肉、睡大觉各按目标进度计算，最高各计 100%，四项平均后作为每日完成率。</p>
          </div>
        </section>
      </div>

    </section>
  `;
}

function renderLeaderboard() {
  const board = leaderboardOverview(state, leaderboardRange);
  const individualMode = leaderboardMode === 'individual';
  const defaultProjects = LEADERBOARD_DEFAULT_PROJECT_KEYS
    .map((key) => HEALTH_PROJECTS.find((project) => project.key === key))
    .filter(Boolean);
  const personalExtraProjects = selectedProjects(state).filter((project) => (
    !LEADERBOARD_DEFAULT_PROJECT_KEYS.includes(project.key)
    && !DEFAULT_PROJECT_KEYS.includes(project.key)
  ));
  const personalProjectChoices = [
    ...defaultProjects.map((project) => ({
      key: project.key,
      name: project.name,
      mark: project.mark,
    })),
    ...personalExtraProjects.map((project) => ({
      key: project.key,
      name: project.name,
      mark: project.mark,
    })),
  ];
  const realBoardTeams = board.teams.filter((team) => !team.isDefaultGroup);
  const hasOwnCustomTeam = realBoardTeams.some((team) => (
    team.ownerId === state.profile.id
  ));
  if (!hasOwnCustomTeam && teamLeaderboardScope === 'custom') {
    teamLeaderboardScope = 'default';
  }
  const extraTeamChoices = Array.from(
    new Map(
      realBoardTeams
        .filter((team) => team.challenge)
        .map((team) => [
          `team_${team.challenge.key}`,
          {
            key: `team_${team.challenge.key}`,
            name: team.challenge.name,
            mark: team.challenge.unit,
            activityKey: team.challenge.key,
          },
        ]),
    ).values(),
  );
  const organizationTeamProjectChoices = [
    ...defaultProjects.map((project) => ({
      key: `team_${project.key}`,
      name: project.name,
      mark: project.mark,
      activityKey: project.key,
    })),
  ];
  const customTeamProjectChoices = Array.from(
    new Map(
      [
        ...defaultProjects.map((project) => ({
          key: `team_${project.key}`,
          name: project.name,
          mark: project.mark,
          activityKey: project.key,
        })),
        ...extraTeamChoices,
      ].map((choice) => [choice.key, choice]),
    ).values(),
  );
  const teamProjectChoices = teamLeaderboardScope === 'custom'
    ? customTeamProjectChoices
    : organizationTeamProjectChoices;
  const projectChoices = individualMode ? personalProjectChoices : teamProjectChoices;
  const selectedHealthProject = HEALTH_PROJECTS.find(
    (project) => project.key === leaderboardProject,
  ) || null;
  const selectedTeamProject = teamProjectChoices.find((choice) => choice.key === leaderboardProject)
    || teamProjectChoices[0];
  const stepRanking = individualMode
    ? leaderboardProject === 'steps'
    : selectedTeamProject.activityKey === 'steps';
  const weightRanking = individualMode
    ? selectedHealthProject?.key === 'weight'
    : selectedTeamProject.activityKey === 'weight';
  const defaultMetricRanking = individualMode
    ? Boolean(selectedHealthProject)
    : ['steps', 'weight'].includes(selectedTeamProject.activityKey);
  const activeProjectKey = individualMode ? leaderboardProject : selectedTeamProject.key;
  const teamChallengeScoreFor = (team, activityKey) => (
    team?.challengeScores?.[activityKey]
    || (team?.challenge?.key === activityKey ? team.challenge : null)
  );
  const metricFor = (row) => {
    if (!row) return null;
    if (!individualMode) {
      if (stepRanking) {
        return Number(row.cumulativeSteps?.perMember || 0);
      }
      if (weightRanking) {
        return row.weightSummary ? Number(row.weightSummary.difference) : null;
      }
      return Number(teamChallengeScoreFor(row, selectedTeamProject.activityKey)?.rating || 0);
    }
    if (stepRanking) {
      return Number(row.cumulativeSteps?.total || 0);
    }
    if (weightRanking) {
      return row.weightSummary ? Number(row.weightSummary.difference) : null;
    }
    return Number(teamChallengeScoreFor(row, selectedHealthProject?.key)?.rating || 0);
  };
  const dayMetricFor = (row, day) => {
    if (!individualMode) {
      if (stepRanking) {
        return Number(day?.stepPerMember || 0);
      }
      if (weightRanking) {
        return Number(day?.weightMembers || 0) > 0 ? Number(day.weightDifference || 0) : null;
      }
      const challengeDay = teamChallengeScoreFor(row, selectedTeamProject.activityKey)
        ?.daily?.find((item) => item.dateKey === day?.dateKey);
      return Number(challengeDay?.percent || 0);
    }
    if (stepRanking) {
      return Number(day?.projects?.find((item) => item.key === 'steps')?.value || 0);
    }
    if (weightRanking) {
      const weight = day?.projects?.find((item) => item.key === 'weight');
      return Number(weight?.value || 0) > 0 && Number(weight?.goal || 0) > 0
        ? Number(weight.value) - Number(weight.goal)
        : null;
    }
    return Number(day?.projects?.find((item) => item.key === selectedHealthProject?.key)?.percent || 0);
  };
  const people = board.people
    .filter((person) => metricFor(person) !== null)
    .sort((a, b) => (
      weightRanking
        ? metricFor(a) - metricFor(b)
        : metricFor(b) - metricFor(a)
    ));
  people.forEach((person, index) => {
    person.liveRank = index + 1;
  });
  const scopedTeams = board.teams.filter((team) => (
    teamLeaderboardScope === 'custom' ? !team.isDefaultGroup : team.isDefaultGroup
  ));
  const teams = scopedTeams.filter((team) => (
    (defaultMetricRanking && metricFor(team) !== null)
    || Boolean(teamChallengeScoreFor(team, selectedTeamProject.activityKey))
  )).slice().sort((a, b) => (
    weightRanking
      ? metricFor(a) - metricFor(b)
      : metricFor(b) - metricFor(a)
  ));
  teams.forEach((team, index) => {
    team.liveRank = index + 1;
  });
  const myRow = individualMode
    ? (people.find((person) => person.isMe) || board.myPerson)
    : (teams.find((team) => team.isMine) || scopedTeams.find((team) => team.isMine));
  const myDaily = individualMode
    ? (myRow?.daily || [])
    : (defaultMetricRanking
      ? (myRow?.daily || []).map((day) => ({ ...day, percent: day.rate }))
      : (teamChallengeScoreFor(myRow, selectedTeamProject.activityKey)?.daily || []));
  const metricLabel = weightRanking
    ? (individualMode ? '体重与目标差值 · kg' : '队员差值合计 · kg')
    : stepRanking
      ? (individualMode ? `${leaderboardRange === 1 ? '今日' : '累计'}步数 · 步` : '成员人均步数 · 步')
      : `${selectedTeamProject.name}完成率`;
  const activeProjectName = individualMode
    ? (selectedHealthProject?.name || '步数')
    : selectedTeamProject.name;
  const rangeLabel = leaderboardRange === 1 ? '今日' : '近 7 天';
  const rankingDescription = weightRanking
    ? '体重差值 = 当天体重 − 目标体重。负值表示低于目标，正值表示高于目标；小队数值为所有已记录队员差值之和。'
    : stepRanking
      ? `${rangeLabel}步数直接统计。${individualMode ? '个人按累计步数排名。' : '小队按成员人均步数排名，避免人数影响结果。'}`
      : `${selectedTeamProject.name}在${rangeLabel}的挑战完成情况。`;
  const rankingRule = weightRanking
    ? '差值越低排名越靠前；负值表示低于目标体重，正值表示高于目标体重。小队合计为正，说明整体更偏向高于目标。'
    : stepRanking
      ? (individualMode
        ? '个人步数按所选周期直接累计，不再转换为分数。'
        : '小队步数先汇总全部成员，再除以成员人数，以人均步数排名。')
      : `${selectedTeamProject.name}按挑战完成比例显示，不再参与体重或步数总分计算。`;
  const trendValues = myDaily
    .map((day) => dayMetricFor(myRow, day))
    .filter((value) => value !== null);
  const trendScaleMax = Math.max(1, ...trendValues.map((value) => Math.abs(value)));
  const metricText = (value) => (
    weightRanking
      ? signedMetric(value, 1)
      : value === null ? '—' : formatNumber(value)
  );
  const metricClass = (value) => (
    weightRanking && Number(value) < -0.05
      ? 'is-negative'
      : weightRanking && Number(value) > 0.05
        ? 'is-positive'
        : ''
  );
  const weightPositionLabel = (value) => (
    Number(value) < -0.05
      ? '低于目标'
      : Number(value) > 0.05
        ? '高于目标'
        : '与目标持平'
  );
  return `
    <section class="page leaderboard-page">
      <header class="page-heading">
        <div>
          <span class="kicker">DAILY RANKING</span>
          <h1>排行榜</h1>
          <p>排行榜直接展示步数和体重差值，不再使用加权总分。个人看步数累计，小队看成员人均步数。</p>
        </div>
        <span class="status-pill">${icon('check')} 排名按最新记录更新</span>
      </header>

      <div class="ranking-controls ranking-controls-stacked">
        <div class="ranking-controls-row">
          <div class="ranking-segment" role="tablist" aria-label="排行榜类型">
            <button class="${individualMode ? 'is-selected' : ''}" type="button" data-action="leaderboard-mode" data-mode="individual" role="tab" aria-selected="${individualMode}">个人榜</button>
            <button class="${!individualMode ? 'is-selected' : ''}" type="button" data-action="leaderboard-mode" data-mode="team" role="tab" aria-selected="${!individualMode}">小队榜</button>
          </div>
          <div class="ranking-range">
            <button class="${leaderboardRange === 1 ? 'is-selected' : ''}" type="button" data-action="leaderboard-range" data-range="1">今日</button>
            <button class="${leaderboardRange === 7 ? 'is-selected' : ''}" type="button" data-action="leaderboard-range" data-range="7">近 7 天</button>
          </div>
        </div>
        ${!individualMode && hasOwnCustomTeam ? `
          <div class="ranking-segment ranking-team-scope" role="tablist" aria-label="小队榜范围">
            <button class="${teamLeaderboardScope === 'default' ? 'is-selected' : ''}" type="button" data-action="leaderboard-team-scope" data-scope="default" role="tab" aria-selected="${teamLeaderboardScope === 'default'}">默认小组</button>
            <button class="${teamLeaderboardScope === 'custom' ? 'is-selected' : ''}" type="button" data-action="leaderboard-team-scope" data-scope="custom" role="tab" aria-selected="${teamLeaderboardScope === 'custom'}">自建战队</button>
          </div>
        ` : ''}
        ${leaderboardDetailOpen ? `
          <div class="ranking-project-tabs" role="tablist" aria-label="${individualMode ? '健康任务独立排名' : '组队挑战项目独立排名'}">
            ${projectChoices.map((choice) => `
              <button
                class="${activeProjectKey === choice.key ? 'is-selected' : ''}"
                type="button"
                data-action="leaderboard-project"
                data-project="${choice.key}"
                role="tab"
                aria-selected="${activeProjectKey === choice.key}"
              >
                <span>${choice.mark}</span>${choice.name}
              </button>
            `).join('')}
          </div>
        ` : `
          <button class="ranking-detail-hint" type="button" data-action="leaderboard-mode" data-mode="${individualMode ? 'individual' : 'team'}">
            再次点击当前${individualMode ? '个人榜' : '小队榜'}，查看各项目独立排名
            <span>⌄</span>
          </button>
        `}
      </div>

      <section class="leaderboard-hero panel">
        <div class="leaderboard-hero-copy">
          <span class="kicker">${individualMode ? 'PERSONAL METRIC' : 'CREW METRIC'}</span>
          <h2>${individualMode ? escapeHtml(myRow?.name || state.profile.nickname) : escapeHtml(myRow?.name || '尚未创建小队')}</h2>
          <p>${rankingDescription}</p>
          <div class="leaderboard-big-score">
            <strong class="${metricClass(metricFor(myRow))}">${metricText(metricFor(myRow))}</strong>
          </div>
          <small class="leaderboard-score-label">${metricLabel}</small>
        </div>
        <div class="leaderboard-medal" aria-hidden="true">
          ${rankBadge(myRow?.liveRank, 'hero')}
          <small>${individualMode ? '个人名次' : '小队名次'}</small>
        </div>
      </section>

      <div class="leaderboard-grid">
        <section class="panel leaderboard-table">
          <div class="panel-head compact">
            <div><span class="kicker">${individualMode ? 'INDIVIDUAL' : 'TEAM CHALLENGE'}</span><h2>${individualMode ? '个人独立排行' : '小队挑战排行'}</h2></div>
            <span class="muted-note">${individualMode ? '' : `${teamLeaderboardScope === 'custom' ? '自建战队' : '默认小组'} · `}${activeProjectName} · ${board.range === 1 ? '今日' : '近 7 天'}</span>
          </div>
          ${individualMode ? `
            <div class="ranking-list">
              ${people.map((person) => {
                const stepToday = person.today.projects.find((item) => item.key === 'steps');
                const metricValue = metricFor(person);
                return `
                  <div class="ranking-row ${person.isMe ? 'is-me' : ''}">
                    ${rankBadge(person.liveRank)}
                    <span class="mini-avatar">${escapeHtml(person.avatarText)}</span>
                    <span class="ranking-person">
                      <b>${escapeHtml(person.name)}${person.isMe ? ' · 我' : ''}</b>
                      <small>${stepRanking
                        ? `今日 ${formatNumber(stepToday?.value || 0)} 步 · ${rangeLabel}累计 ${formatNumber(metricValue)} 步`
                        : weightRanking
                          ? (person.weightSummary
                            ? `${weightPositionLabel(person.weightSummary.difference)} · 目标 ${formatNumber(person.weightSummary.target, 1)} kg`
                            : '当前周期暂无体重记录')
                          : `当前完成率 ${formatNumber(metricValue)}`}</small>
                    </span>
                    <span class="ranking-score"><b class="${metricClass(metricValue)}">${metricText(metricValue)}</b><small>${metricLabel}</small></span>
                  </div>
                `;
              }).join('')}
            </div>
          ` : `
            ${teams.length ? `
              <div class="ranking-list">
                ${teams.map((team) => `
                  <div class="ranking-row team-ranking-row ${team.isMine ? 'is-me' : ''}">
                    ${rankBadge(team.liveRank)}
                    <span class="mini-avatar">${escapeHtml(team.avatarText)}</span>
                    <span class="ranking-person">
                      <b>${escapeHtml(team.name)}${team.isMine && !team.isDefaultGroup ? ' · 我的小队' : ''}</b>
                      <small>${stepRanking
                        ? `${team.memberCount} 位成员 · 今日人均 ${formatNumber(dayMetricFor(team, team.today))} 步`
                        : weightRanking
                          ? `${team.weightSummary?.memberCount || 0} 位成员已记录 · 今日合计 ${signedMetric(dayMetricFor(team, team.today), 1)} kg`
                          : `${team.memberCount} 位成员 · 今日完成率 ${formatNumber(dayMetricFor(team, team.today))}`}</small>
                    </span>
                    <span class="ranking-score"><b class="${metricClass(metricFor(team))}">${metricText(metricFor(team))}</b><small>${metricLabel}</small></span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="empty-state">
                <b class="empty-title">${teamLeaderboardScope === 'custom' ? '还没有自建战队排名' : '还没有默认小组排名'}</b>
                <span class="empty-copy">${teamLeaderboardScope === 'custom' ? '创建或加入战队并完成挑战后，自建战队榜会自动生成。' : '成员记录每日健康数据后，默认小组榜会自动生成。'}</span>
                <button class="button primary" type="button" data-route="team">${teamLeaderboardScope === 'custom' ? '去创建自建战队' : '查看组队挑战'}</button>
              </div>
            `}
          `}
        </section>

        <section class="panel leaderboard-trend">
          <div class="panel-head compact">
            <div><span class="kicker">DAILY TREND</span><h2>${activeProjectName}每日变化</h2></div>
          </div>
          <div class="daily-rank-list">
            ${myDaily.map((day) => {
              const value = dayMetricFor(myRow, day);
              const width = value === null
                ? 0
                : (stepRanking || weightRanking)
                  ? Math.round((Math.abs(value) / trendScaleMax) * 100)
                  : Math.min(100, Math.max(0, value));
              return `
                <div class="daily-rank-row">
                  <span class="daily-rank-date"><b>${dateLabel(day.dateKey, false)}</b><small>周${weekdayShort(day.dateKey)}</small></span>
                  <span class="daily-rank-track"><i class="${metricClass(value)}" style="width:${width}%"></i></span>
                  <strong class="${metricClass(value)}">${metricText(value)}</strong>
                </div>
              `;
            }).join('')}
          </div>
          <div class="ranking-rule">
            <span class="kicker">RANKING RULE</span>
            <p>${rankingRule}</p>
          </div>
        </section>
      </div>

    </section>
  `;
}

function renderProfile() {
  const overview = homeOverview(state);
  const session = authSession;
  const realName = state.profile.realName || state.profile.nickname;
  const groupName = DEFAULT_TEAM_GROUPS.find(
    (group) => group.code === (state.profile.groupCode || 'personal'),
  )?.name || '个人';
  return `
    <section class="page profile-page">
      <header class="page-heading">
        <div>
          <span class="kicker">MY HEALTH SPACE</span>
          <h1>我的</h1>
          <p>个人资料、健康目标与数据管理。</p>
        </div>
      </header>

      <section class="profile-hero">
        <div class="profile-avatar-large">${escapeHtml(state.profile.avatarText)}</div>
        <div class="profile-hero-copy">
          <span class="kicker">HEALTH PROFILE</span>
          <h2>${escapeHtml(realName)}</h2>
          <span class="verified-line">${icon('check')} 已实名 · ${escapeHtml(maskPhone(state.profile.phone))}</span>
          <span class="verified-line">所属小组 · ${escapeHtml(groupName)}</span>
          <p>${escapeHtml(state.profile.motto)}</p>
          <span>登录于 ${session ? new Date(session.loggedInAt).toLocaleDateString('zh-CN') : '—'} · 从 ${state.profile.joinedAt} 开始记录健康</span>
        </div>
        <div class="profile-hero-stats">
          <div><strong>${overview.streak}</strong><span>连续天数</span></div>
          <div><strong>${overview.cards.filter((card) => card.done).length}</strong><span>今日达标</span></div>
          <div><strong>${overview.team.exists ? overview.team.memberCount : 0}</strong><span>战队伙伴</span></div>
        </div>
      </section>

      <div class="profile-grid">
        <section class="panel profile-settings">
          <div class="panel-head">
            <div><span class="kicker">PROFILE</span><h2>个人资料</h2></div>
          </div>
          <form data-form="profile">
            <label><span>实名姓名</span><input name="realName" maxlength="20" value="${escapeHtml(realName)}" required /></label>
            <label><span>手机号</span><input name="phone" type="tel" inputmode="numeric" value="${escapeHtml(maskPhone(state.profile.phone || ''))}" readonly /></label>
            <label><span>个人签名</span><input name="motto" maxlength="60" value="${escapeHtml(state.profile.motto)}" /></label>
            <button class="button primary" type="submit">保存实名资料</button>
          </form>
        </section>

        <section class="panel goal-settings">
          <div class="panel-head">
            <div><span class="kicker">DAILY TARGETS</span><h2>健康目标</h2></div>
          </div>
          <form data-form="goals">
            <div class="goal-setting-grid">
              ${selectedProjects(state).map((project) => `
                <label class="${projectToneClass(project.tone)}">
                  <span class="goal-setting-title"><i>${project.mark}</i><b>${project.name}</b></span>
                  <span class="goal-setting-input"><input name="${project.key}" type="number" step="${project.decimals ? '0.1' : '1'}" min="${GOAL_INPUT_MIN[project.key]}" max="${GOAL_INPUT_MAX[project.key]}" value="${state.goals[project.key]}" /><em>${project.unit}</em></span>
                </label>
              `).join('')}
            </div>
            <button class="button primary" type="submit">保存健康目标</button>
          </form>
        </section>
      </div>

      <div class="profile-bottom-grid">
        <section class="panel danger-panel">
          <span class="kicker">LOCAL DATA</span>
          <h2>清空健康数据</h2>
          <p>删除账号中的资料、健康记录、照片、战队和登录信息。此操作不可撤销。</p>
          <div class="danger-actions">
            <button class="button danger" type="button" data-action="reset-data">清空全部数据</button>
            <button class="button secondary" type="button" data-action="logout">退出登录</button>
          </div>
        </section>
      </div>

      <footer class="app-footer">
        <span>动一点 ${appConfig.version}</span>
        <span>${appConfig.releaseLabel}</span>
      </footer>
    </section>
  `;
}

function renderPage(options = {}) {
  if (!authSession) {
    renderAuthScreen();
    return;
  }
  document.body.classList.remove('auth-mode');
  const route = currentRoute();
  const anchor = selectedRecordDate;
  renderNav();
  if (route === 'today') main.innerHTML = renderHome();
  if (route === 'records') main.innerHTML = renderHealthRecords();
  if (route === 'team') main.innerHTML = renderTeam();
  if (route === 'leaderboard') main.innerHTML = renderLeaderboard();
  if (route === 'profile') main.innerHTML = renderProfile();
  if (!options.preserveScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
  if (route === 'records' && options.preserveScroll) {
    const dateInput = main.querySelector('.date-input');
    if (dateInput) dateInput.value = anchor;
  }
  updateActivityBuilderPreview();
  if (options.animateProject) {
    requestAnimationFrame(() => playHabitAnimation(options.animateProject));
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function selectedActivityFromDom() {
  const dailyGoal = Number(main.querySelector('#challenge-daily-goal')?.value || 1);
  const customName = main.querySelector('[name="customName"]')?.value || '';
  const customUnit = main.querySelector('[name="customUnit"]')?.value || '';
  return resolveTeamActivity({
    key: selectedActivityKey,
    name: customName,
    unit: customUnit,
    dailyGoal,
    custom: selectedActivityKey === 'custom',
  });
}

function updateActivityBuilderPreview() {
  if (currentRoute() !== 'team') return;
  const customFields = main.querySelector('#custom-activity-fields');
  if (customFields) customFields.hidden = selectedActivityKey !== 'custom';
  const goalInput = main.querySelector('#challenge-daily-goal');
  if (goalInput) {
    const selected = resolveTeamActivity(selectedActivityKey);
    const goalUnit = goalInput.closest('div')?.querySelector('em');
    if (goalUnit) goalUnit.textContent = selected.unit;
  }
  const preview = main.querySelector('#team-goal-preview');
  if (!preview) return;
  const activity = selectedActivityFromDom();
  const validation = validateTeamActivity(activity);
  if (validation) {
    preview.textContent = validation;
    preview.dataset.state = 'error';
    return;
  }
  const team = teamOverview(state);
  const members = team.exists ? team.memberCount : 1;
  const total = Math.abs(activity.dailyGoal) * challengeDays * members;
  preview.dataset.state = 'ok';
  preview.textContent = `每人每次 ${formatNumber(activity.dailyGoal, activity.decimals)} ${activity.unit}，${members} 人团队目标约 ${formatNumber(total, activity.decimals)} ${activity.unit}`;
}

function openTaskPicker(options = {}) {
  const firstRun = Boolean(options.firstRun || !state.onboarding?.completed);
  const fixedProjects = DEFAULT_PROJECT_KEYS
    .map((key) => getProject(key))
    .filter(Boolean);
  openModal({
    title: firstRun ? '设置你的健康目标' : '调整健康目标',
    description: firstRun
      ? '每日固定记录走路和体重。可以调整自己的步数目标与目标体重，完成后会提醒今天的打卡。'
      : '走路和体重是固定记录项目，可以随时调整目标。',
    submitLabel: firstRun ? '完成设置并开始打卡' : '保存健康目标',
    wide: true,
    content: `
      <div class="task-picker-intro">
        <span class="task-picker-intro-icon">${icon('calendar')}</span>
        <div>
          <b>走路与体重，每天两项</b>
          <small>步数默认 8,000 步。目标体重用于计算每日体重与目标的差值。</small>
        </div>
      </div>
      <div class="task-picker-grid">
        ${fixedProjects.map((project) => {
          const initialGoal = project.key === 'weight' && !state.goals.weightTargetSet
            ? ''
            : state.goals[project.key];
          const numericGoal = Number(initialGoal);
          const goalComplete = String(initialGoal ?? '').trim() !== ''
            && Number.isFinite(numericGoal)
            && numericGoal >= Number(GOAL_INPUT_MIN[project.key])
            && numericGoal <= Number(GOAL_INPUT_MAX[project.key]);
          return `
          <div class="task-picker-option is-fixed ${goalComplete ? 'is-complete' : ''} ${projectToneClass(project.tone)}">
            <input type="hidden" name="projects" value="${project.key}" />
            <div class="task-picker-select">
              <span class="task-picker-mark">${project.mark}</span>
              <span class="task-picker-copy"><b>${project.name}</b>${project.key === 'weight' ? '' : `<small>建议 ${project.goal} ${project.unit} / 天</small>`}</span>
              <span class="task-picker-check-ui">${icon('check')}</span>
            </div>
            <label class="task-picker-goal">
              <span>${project.key === 'weight' ? '目标体重' : '每日目标'}</span>
              <input
                class="task-goal-input"
                data-task-goal="${project.key}"
                name="goal_${project.key}"
                type="number"
                min="${GOAL_INPUT_MIN[project.key]}"
                max="${GOAL_INPUT_MAX[project.key]}"
                step="${project.decimals ? '0.1' : '1'}"
                inputmode="${project.decimals ? 'decimal' : 'numeric'}"
                value="${initialGoal}"
                placeholder="${project.goal}"
                ${project.key === 'weight' ? 'required' : ''}
              />
              <em>${project.unit}</em>
            </label>
          </div>
        `;
        }).join('')}
      </div>
      <p class="task-picker-count">固定 2 项 · 目标可以随时调整</p>
    `,
    onSubmit(formData) {
      const goals = Object.fromEntries(fixedProjects.map((project) => [
        project.key,
        formData.get(`goal_${project.key}`),
      ]));
      const result = saveTaskSetup(
        state,
        formData.getAll('projects'),
        goals,
        { completeOnboarding: firstRun },
      );
      if (!result.ok) {
        showToast(result.message, 'error');
        return false;
      }
      state = result.state;
      showToast(firstRun ? '每日行动已设置，准备今天的打卡' : '每日任务与目标已更新');
      renderPage({ preserveScroll: true });
      if (firstRun) setTimeout(maybeShowDailyCheckin, 220);
    },
  });
}

function updateTaskPickerCompletion(input) {
  if (!input?.matches?.('.task-goal-input')) return;
  const option = input.closest('.task-picker-option');
  if (!option) return;
  const value = Number(input.value);
  const hasValue = input.value.trim() !== '';
  const isValid = hasValue
    && Number.isFinite(value)
    && value >= Number(input.min)
    && value <= Number(input.max);
  option.classList.toggle('is-complete', isValid);
}

function createTeamDialog() {
  const activity = resolveTeamActivity(selectedActivityKey);
  openModal({
    title: '创建我的战队',
    description: `首期将以「${activity.name}」发起 ${challengeDays} 天挑战。`,
    content: `
      <label class="modal-field"><span>战队名称</span><input name="name" maxlength="12" placeholder="例如：周末骑行小分队" required /></label>
      <label class="modal-field"><span>战队口号</span><input name="slogan" maxlength="40" placeholder="给伙伴一句出发的理由" /></label>
    `,
    submitLabel: '创建并加入',
    onSubmit(formData) {
      const result = createTeam(state, {
        name: formData.get('name'),
        slogan: formData.get('slogan'),
        activity: selectedActivityFromDom(),
        days: challengeDays,
      });
      if (!result.ok) {
        showToast(result.message, 'error');
        return false;
      }
      state = result.state;
      showToast('战队创建成功');
      renderPage({ preserveScroll: true });
    },
  });
}

function joinTeamDialog() {
  openModal({
    title: '加入伙伴的战队',
    description: '输入伙伴分享的邀请码，加入后会和队员同步挑战进度。',
    content: '<label class="modal-field"><span>战队邀请码</span><input name="code" maxlength="6" placeholder="SUN7" required /></label>',
    submitLabel: '加入战队',
    async onSubmit(formData) {
      try {
        await joinCloudTeam(formData.get('code'));
        const session = await getCloudSession();
        if (!session) throw new Error('登录状态已失效，请重新登录');
        await enterCloudSession(session, {
          phone: state.profile.phone,
          realName: state.profile.realName,
          groupCode: state.profile.groupCode,
        });
        showToast('已加入战队');
      } catch (error) {
        showToast(error.message || '加入战队失败', 'error');
        return false;
      }
    },
  });
}

function showSourceInfo() {
  openModal({
    title: '微信健康接入规划',
    description: '当前可手动记录健康数据，后续将在本人授权后同步微信健康数据。',
    content: `
      <div class="timeline-list">
        <div><span>01</span><b>用户授权</b><p>通过微信开放平台完成身份与健康数据授权，不在浏览器保存敏感凭证。</p></div>
        <div><span>02</span><b>数据同步</b><p>用户授权后，健康数据会同步到个人记录，并保留手动修正入口。</p></div>
        <div><span>03</span><b>多端使用</b><p>Web 与微信小程序使用同一份健康记录，方便持续查看和更新。</p></div>
      </div>
      <p class="modal-note">该能力将在小程序完成审核并取得微信健康授权后开放。</p>
    `,
    submitLabel: '',
  });
}

function confirmReset() {
  openModal({
    title: '清空全部健康数据？',
    description: '账号中的健康记录、照片、战队与登录信息将全部删除，操作不可撤销。',
    content: '',
    submitLabel: '确认清空',
    async onSubmit() {
      if (authSession?.uid) {
        const photoRefs = Object.values(state.records || {})
          .flatMap((record) => Object.values(record.photos || {}))
          .filter((photo) => photo?.bucket && photo?.key);
        const uniquePhotos = Array.from(
          new Map(photoRefs.map((photo) => [`${photo.bucket}/${photo.key}`, photo])).values(),
        );
        for (const photo of uniquePhotos) {
          await deleteCheckinPhoto(photo);
        }
        if (cloudAuthenticated) {
          await deleteCloudHealthData(authSession.uid);
          await signOutCloud();
        }
      }
      state = resetDemoState();
      logoutCurrentUser();
      authSession = null;
      cloudAuthenticated = false;
      authBootStatus = 'ready';
      authDraft = { phone: '', realName: '', groupCode: 'personal_center', consent: false };
      selectedRecordDate = toDateKey();
      selectedActivityKey = 'badminton';
      challengeDays = 7;
      cloudSyncStatus = 'idle';
      showToast('账号数据已全部清空');
      renderPage();
    },
  });
}

function confirmLogout() {
  openModal({
    title: '退出当前账号？',
    description: '退出后健康记录仍会保留，下次使用同一手机号验证登录后可继续查看。',
    submitLabel: '退出登录',
    async onSubmit() {
      if (cloudAuthenticated) await signOutCloud();
      logoutCurrentUser();
      authSession = null;
      cloudAuthenticated = false;
      authBootStatus = 'ready';
      cloudSyncStatus = 'idle';
      renderPage();
    },
  });
}

function leaveTeamConfirm() {
  openModal({
    title: '退出当前战队？',
    description: '个人健康记录会保留，战队和邀请信息将被移除。',
    submitLabel: '确认退出',
    async onSubmit() {
      const leavingTeamId = state.team?.id;
      if (leavingTeamId && authSession?.uid) {
        await leaveCloudTeam(
          leavingTeamId,
          authSession.uid,
          state.team.ownerId === authSession.uid,
        );
      }
      state.team = null;
      state.cloudTeams = (state.cloudTeams || []).filter((team) => team.id !== leavingTeamId);
      state = saveState(state);
      showToast('已退出战队');
      renderPage({ preserveScroll: true });
    },
  });
}

function downloadBackup() {
  const blob = new Blob([exportState(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `health-motion-backup-${toDateKey()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast('备份文件已生成');
}

async function copyInvite() {
  const team = teamOverview(state);
  if (!team.exists) return;
  try {
    await navigator.clipboard.writeText(team.inviteCode);
    showToast('邀请码已复制');
  } catch {
    showToast(`邀请码：${team.inviteCode}`, 'info');
  }
}

async function captureCheckinPhoto(projectKey) {
  const project = getProject(projectKey);
  if (!project) return;
  const file = await choosePhoto();
  if (!file) return;
  showToast('正在优化照片…', 'info');
  let dataUrl;
  try {
    dataUrl = await compressPhoto(file);
  } catch (error) {
    showToast(error.message || '照片处理失败', 'error');
    return;
  }
  let cloudRef = null;
  if (cloudAuthenticated) {
    try {
      cloudRef = await uploadCheckinPhoto(dataUrl, authSession.uid, projectKey, toDateKey());
    } catch (error) {
      cloudRef = null;
      showToast('云端照片暂不可用，已切换为本地社区发布', 'info');
    }
  }
  pendingPhoto = { projectKey, dataUrl, cloudRef };
  const amountField = projectKey === 'water'
    ? `
      <label class="modal-field">
        <span>同时增加饮水量</span>
        <div class="photo-amount-field">
          <input name="increment" type="number" min="0" max="2000" step="50" value="250" />
          <em>ml</em>
        </div>
      </label>
    `
    : '';
  openModal({
    title: `${project.name} · 照片打卡`,
    description: '照片确认后会保存到当天的健康记录，并展示在社区分享中。',
    submitLabel: '发布照片打卡',
    wide: true,
    content: `
      <div class="photo-confirm-preview">
        <img src="${dataUrl}" alt="${project.name}照片预览" />
        <span>${icon('camera')} 刚刚拍摄</span>
      </div>
      ${amountField}
      <p class="photo-privacy-note">${cloudAuthenticated
        ? '照片会保存到当前账号的私有云存储，并出现在已登录成员可见的社区分享中。'
        : '当前为本地登录，照片保存在此浏览器，并显示在本机的社区分享中。'}</p>
    `,
    onSubmit(formData) {
      if (!pendingPhoto) return false;
      const {
        projectKey: photoProject,
        dataUrl: photoData,
        cloudRef: photoCloudRef,
      } = pendingPhoto;
      const result = attachPhotoCheckin(state, photoProject, photoData, {
        increment: Number(formData.get('increment') || 0),
        cloudRef: photoCloudRef,
      });
      pendingPhoto = null;
      if (!result.ok) {
        showToast(result.message, 'error');
        return false;
      }
      state = result.state;
      showToast('照片打卡已发布到社区分享');
      renderPage({
        preserveScroll: true,
        animateProject: photoProject,
      });
      return true;
    },
  });
}

function openPhotoViewer(projectKey) {
  const project = getProject(projectKey);
  const record = getDayRecord(state, toDateKey());
  const photo = record.photos?.[projectKey];
  if (!photo) return;
  openModal({
    title: `${project.name} · 照片打卡`,
    description: `拍摄于 ${new Date(photo.capturedAt).toLocaleString('zh-CN')}`,
    wide: true,
    content: `
      <div class="photo-confirm-preview">
        <img src="${photo.dataUrl}" alt="${project.name}照片打卡" />
      </div>
      <button class="button danger photo-remove" type="button" data-action="remove-photo" data-project="${projectKey}">
        ${icon('trash')} 删除这张照片
      </button>
    `,
  });
}

document.addEventListener('click', async (event) => {
  const routeTarget = event.target.closest('[data-route]');
  if (routeTarget) {
    location.hash = routeTarget.dataset.route;
    return;
  }
  const actionTarget = event.target.closest('[data-action]');
  if (!actionTarget) return;
  const action = actionTarget.dataset.action;

  if (action === 'close-modal') closeModal();
  if (action === 'quick-water') {
    const result = updateHealthRecord(state, 'water', Number(actionTarget.dataset.amount), { increment: true });
    applyResult(result, `已记录 ${actionTarget.dataset.amount}ml`, { animateProject: 'water' });
  }
  if (action === 'quick-muscle') {
    const minutes = Number(actionTarget.dataset.amount || 15);
    const result = updateHealthRecord(state, 'muscle', minutes, { increment: true });
    applyResult(result, `已记录 ${minutes} 分钟肌肉训练`, { animateProject: 'muscle' });
  }
  if (action === 'quick-stand') {
    const minutes = Number(actionTarget.dataset.amount || 5);
    const result = updateHealthRecord(state, 'stand', minutes, { increment: true });
    applyResult(result, `已记录起身活动 ${minutes} 分钟`, { animateProject: 'stand' });
  }
  if (action === 'quick-farview') {
    const minutes = Number(actionTarget.dataset.amount || 5);
    const result = updateHealthRecord(state, 'farview', minutes, { increment: true });
    applyResult(result, `已记录远眺 ${minutes} 分钟`, { animateProject: 'farview' });
  }
  if (action === 'select-record-date') {
    selectedRecordDate = actionTarget.dataset.date;
    calendarCursor = selectedRecordDate;
    renderPage({ preserveScroll: true });
  }
  if (action === 'record-chart-project') {
    recordChartProject = actionTarget.dataset.project === 'weight' ? 'weight' : 'steps';
    if (recordChartProject === 'weight' && recordChartRange === 'year') {
      recordChartRange = 'month';
    }
    renderPage({ preserveScroll: true });
  }
  if (action === 'record-chart-range') {
    recordChartRange = ['day', 'week', 'month', 'year'].includes(actionTarget.dataset.range)
      ? actionTarget.dataset.range
      : 'day';
    renderPage({ preserveScroll: true });
  }
  if (action === 'toggle-calendar') {
    calendarOpen = !calendarOpen;
    if (calendarOpen) calendarCursor = selectedRecordDate;
    renderPage({ preserveScroll: true });
  }
  if (action === 'calendar-prev' || action === 'calendar-next') {
    const cursor = parseDateKey(calendarCursor);
    cursor.setDate(1);
    cursor.setMonth(cursor.getMonth() + (action === 'calendar-prev' ? -1 : 1));
    calendarCursor = toDateKey(cursor);
    renderPage({ preserveScroll: true });
  }
  if (action === 'select-activity') {
    selectedActivityKey = actionTarget.dataset.activity;
    renderPage({ preserveScroll: true });
  }
  if (action === 'select-days') {
    challengeDays = Number(actionTarget.dataset.days);
    renderPage({ preserveScroll: true });
  }
  if (action === 'leaderboard-mode') {
    const nextMode = actionTarget.dataset.mode;
    if (leaderboardMode === nextMode) {
      leaderboardDetailOpen = !leaderboardDetailOpen;
      leaderboardProject = nextMode === 'individual' ? 'steps' : 'team_steps';
    } else {
      leaderboardMode = nextMode;
      leaderboardDetailOpen = true;
      leaderboardProject = nextMode === 'individual' ? 'steps' : 'team_steps';
      if (nextMode === 'team') teamLeaderboardScope = 'default';
    }
    renderPage({ preserveScroll: true });
  }
  if (action === 'leaderboard-team-scope') {
    teamLeaderboardScope = actionTarget.dataset.scope === 'custom' ? 'custom' : 'default';
    leaderboardProject = 'team_steps';
    renderPage({ preserveScroll: true });
  }
  if (action === 'leaderboard-project') {
    leaderboardProject = actionTarget.dataset.project
      || (leaderboardMode === 'individual' ? 'steps' : 'team_steps');
    renderPage({ preserveScroll: true });
  }
  if (action === 'leaderboard-range') {
    leaderboardRange = Number(actionTarget.dataset.range) === 1 ? 1 : 7;
    renderPage({ preserveScroll: true });
  }
  if (action === 'edit-health-goals') openTaskPicker();
  if (action === 'quick-team-activity') {
    const challenge = teamOverview(state).challenge;
    const result = recordTeamActivity(state, challenge.quickAmount, { increment: true });
    if (applyResult(result, '运动记录已累加')) {
      // Render happens in applyResult.
    }
  }
  if (action === 'create-team') createTeamDialog();
  if (action === 'join-team') joinTeamDialog();
  if (action === 'source-info') showSourceInfo();
  if (action === 'copy-invite') copyInvite();
  if (action === 'leave-team') leaveTeamConfirm();
  if (action === 'export-data') downloadBackup();
  if (action === 'reset-data') confirmReset();
  if (action === 'logout') confirmLogout();
  if (action === 'capture-photo') captureCheckinPhoto(actionTarget.dataset.project);
  if (action === 'view-photo') openPhotoViewer(actionTarget.dataset.project);
  if (action === 'remove-photo') {
    const photoRecord = getDayRecord(state, toDateKey());
    const cloudPhoto = photoRecord.photos?.[actionTarget.dataset.project];
    if (cloudPhoto?.bucket && cloudPhoto?.key) {
      try {
        await deleteCheckinPhoto(cloudPhoto);
      } catch (error) {
        showToast(error.message || '照片删除失败', 'error');
        return;
      }
    }
    const result = removeCheckinPhoto(state, actionTarget.dataset.project);
    if (!result.ok) {
      showToast(result.message, 'error');
      return;
    }
    state = result.state;
    closeModal();
    showToast('照片已删除');
    renderPage({ preserveScroll: true });
  }
});

document.addEventListener('input', (event) => {
  if (event.target.closest('[data-form="login"]')) {
    if (event.target.name === 'phone') {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 11);
      authDraft.phone = event.target.value;
    }
    if (event.target.name === 'realName') {
      authDraft.realName = event.target.value;
    }
    if (event.target.name === 'groupCode') {
      authDraft.groupCode = event.target.value;
    }
    updateLoginValidation();
  }
  if (['challenge-daily-goal', 'customName', 'customUnit'].includes(event.target.name) || event.target.id === 'challenge-daily-goal') {
    updateActivityBuilderPreview();
  }
  if (event.target.matches('.task-goal-input')) {
    updateTaskPickerCompletion(event.target);
  }
});

document.addEventListener('change', (event) => {
  if (event.target.matches('[data-setting="task-reminder"]')) {
    state = saveState({
      ...state,
      settings: {
        ...state.settings,
        taskReminderDisabled: event.target.checked,
      },
    });
    showToast(event.target.checked ? '已关闭登录任务提醒' : '已恢复登录任务提醒');
    return;
  }
  if (event.target.closest('[data-form="login"]')) {
    if (event.target.name === 'consent') authDraft.consent = event.target.checked;
    if (event.target.name === 'groupCode') authDraft.groupCode = event.target.value;
    updateLoginValidation();
  }
  if (event.target.id === 'import-data' && event.target.files?.[0]) {
    const reader = new FileReader();
    reader.onload = () => {
      const result = importState(String(reader.result || ''));
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      state = result.state;
      showToast('备份已导入');
      renderPage({ preserveScroll: true });
    };
    reader.readAsText(event.target.files[0]);
    return;
  }
  if (event.target.matches('.date-input')) {
    selectedRecordDate = event.target.value || toDateKey();
    calendarCursor = selectedRecordDate;
    renderPage({ preserveScroll: true });
  }
});

document.addEventListener('submit', async (event) => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const type = form.dataset.form;

  if (type === 'home-health') {
    const project = form.dataset.project;
    const result = updateHealthRecord(state, project, data.get('value'));
    applyResult(result, `${getProject(project).name}已保存`, { animateProject: project });
  }

  if (type === 'save-day') {
    const values = Object.fromEntries(HEALTH_PROJECTS.map((project) => [project.key, data.get(project.key)]));
    values.note = data.get('note');
    const result = updateDayValues(state, data.get('date'), values);
    applyResult(result, '当天健康记录已保存');
  }

  if (type === 'start-challenge') {
    const activity = selectedActivityFromDom();
    const result = startTeamChallenge(state, activity, challengeDays);
    applyResult(result, '新挑战已发起');
  }

  if (type === 'team-activity') {
    const result = recordTeamActivity(state, data.get('value'));
    applyResult(result, '运动记录已保存');
  }

  if (type === 'profile') {
    const realName = String(data.get('realName') || '').trim();
    if (!/^[\u3400-\u9fff·]{2,20}$/.test(realName)) {
      showToast('请输入 2-20 位中文姓名', 'error');
      return;
    }
    state.profile = {
      ...state.profile,
      realName,
      nickname: realName,
      avatarText: realName.slice(0, 1),
    };
    const result = updateProfile(state, {
      nickname: realName,
      motto: data.get('motto'),
    });
    if (authSession) authSession.realName = realName;
    applyResult(result, '个人资料已保存');
  }

  if (type === 'login') {
    if (!data.get('consent')) {
      showToast('请先同意健康数据使用说明', 'error');
      return;
    }
    const submit = form.querySelector('[data-login-submit]');
    if (submit) {
      submit.disabled = true;
      submit.textContent = '正在进入…';
    }
    const result = completeDirectLogin({
      phone: String(data.get('phone') || '').replace(/\D/g, ''),
      realName: String(data.get('realName') || '').trim(),
      groupCode: String(data.get('groupCode') || 'personal_center'),
    });
    if (!result.ok) {
      if (submit) {
        submit.disabled = false;
        submit.textContent = '进入健康空间';
      }
      showToast(result.message || '登录失败，请检查信息', 'error');
    }
  }

  if (type === 'goals') {
    const result = updateGoals(state, Object.fromEntries(selectedProjects(state).map((project) => [
      project.key,
      data.get(project.key),
    ])));
    applyResult(result, '健康目标已更新');
  }
});

window.addEventListener('hashchange', () => {
  renderPage();
  clearTimeout(cloudRefreshTimer);
  if (['records', 'team', 'leaderboard'].includes(currentRoute())) {
    cloudRefreshTimer = setTimeout(refreshCloudWorkspace, 250);
  }
});
window.addEventListener('scroll', updateMobileHeaderOnScroll, { passive: true });
window.addEventListener('resize', updateMobileHeaderOnScroll, { passive: true });
window.addEventListener('health-state-saved', (event) => {
  if (authSession?.uid) scheduleCloudSync(event.detail || state);
});
onCloudAuthStateChange?.((event) => {
  if (event === 'SIGNED_OUT' && authSession && !authSession.localOnly) {
    authSession = null;
    cloudAuthenticated = false;
    cloudSyncStatus = 'idle';
    renderPage();
  }
});
if (!location.hash) history.replaceState(null, '', '#today');
renderPage();
bootstrapCloudAuth();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
