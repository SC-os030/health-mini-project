# 动一点 

可直接在桌面和手机浏览器中使用的健康行动应用。首版聚焦完整数据闭环：

- 走路、喝水等运动均可手动填写、修改和补录；
- 自动计算每日目标、七日趋势、连续天数和历史记录。
- 支持本地创建战队、挑战配置和贡献榜；邀请码校验需等待 CloudBase 数据库接入。
- 发起新挑战支持羽毛球（默认每人每次 60 分钟）、骑行（默认每人每次 30 公里）及完全自定义运动；历史挑战数据仍可正常展示。
- 支持个人资料、健康目标、JSON 数据导出与导入。
- 支持姓名、手机号和所属小组直接登录，登录后个人空间自动使用当前登录人的姓名和手机号。
- 本地登录数据保存在当前浏览器；已有 CloudBase 登录会话仍可加载并同步云端 PostgreSQL 数据。
- 四项累计操作拥有专属动效：脚印前进、倒水入进度条、三次举哑铃、睡眠气泡加载。
- 四项记录均支持照片打卡；手机端点击相机按钮可直接调用后置摄像头。喝水照片可选择同时增加饮水量。
- 适配手机浏览器，并提供 PWA 安装清单和离线缓存。
- 微信健康接入入口已预留，当前不会伪造自动同步结果。

## 本地运行

```powershell
npm install
npm run dev
```

打开终端提示的地址。生产构建：

```powershell
npm run check
npm run build
```

构建产物在 `dist/`。

## 数据边界

当前版本已经接入 CloudBase Auth 与 PostgreSQL：

- 身份认证：姓名与手机号本地登录；已有 CloudBase Auth 会话继续可用
- 用户资料：`public.health_profiles`
- 每日健康记录：`public.daily_health_records`
- 每日签到：`public.daily_checkins`
- 战队与成员：`public.health_teams`、`public.health_team_members`
- 挑战与挑战记录：`public.health_challenges`、`public.health_challenge_logs`
- 打卡照片：`health-checkin-photos` 私有对象存储桶
- 浏览器缓存：`health_motion_web_state_v3`

所有用户表均启用了行级安全策略；排行榜和社区分享通过受限公开视图只暴露完成率、挑战积分与用户主动分享的照片，不暴露手机号或私人备注。

战队、成员、挑战、签到、跨用户排行榜和社区照片已经使用 CloudBase 云端数据。微信健康自动同步仍需后续接入。

排行榜直接展示原始指标，不再计算加权总分。个人步数按所选周期累计，小队按成员人均步数排名；个人体重展示“当前体重 − 目标体重”的差值，负值表示低于目标、正值表示高于目标，小队体重为已记录成员的差值之和。

本版本不再生成任何示例健康记录、示例战队或模拟成员。升级后当前浏览器中的旧版 `health_motion_web_state_v2` 模拟数据会被一次性删除。

## 微信健康后续接入

1. 在 CloudBase 创建健康数据同步云函数。
2. Web 端只负责发起授权和读取同步状态，不在浏览器保存 AppSecret 或永久授权凭据。
3. 小程序审核通过后复用同一套 CloudBase 用户、记录和战队模型。
4. 保留手动输入与修正能力，避免第三方数据异常影响用户记录。

## CloudBase 静态托管

登录 CLI 并选择环境：

```powershell
tcb login
tcb env list
tcb hosting deploy dist -e <你的环境ID>
```

当前绑定环境：`lovely-herring-d8g0r2mntd6f4dc3f`（ap-shanghai）。

正式访问地址：

https://health-motion-lovely-herring-d8g0r2mntd6f4dc3f.webapps.tcloudbase.com/

应用使用 hash 路由，静态托管无需额外服务器重写规则。
