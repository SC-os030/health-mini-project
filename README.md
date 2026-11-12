# 动一点 

可直接在桌面和手机浏览器中使用的健康行动应用。首版聚焦完整数据闭环：

- 走路、喝水等运动均可手动填写、修改和补录；
- 自动计算每日目标、七日趋势、连续天数和历史记录。
- 支持本地创建战队、挑战配置和贡献榜；邀请码校验需等待 CloudBase 数据库接入。
- 发起新挑战支持羽毛球（默认每人每次 60 分钟）、骑行（默认每人每次 30 公里）及完全自定义运动；历史挑战数据仍可正常展示。
- 支持个人资料、健康目标、JSON 数据导出与导入。
- 支持手机号短信验证码与姓名实名登录，登录后个人空间自动使用当前登录人的姓名和手机号。
- 用户资料、健康目标和每日健康记录自动同步到 CloudBase PostgreSQL，并在本机保留离线缓存。
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

- 身份认证：CloudBase Auth 手机号验证码
- 用户资料：`public.health_profiles`
- 每日健康记录：`public.daily_health_records`
- 每日签到：`public.daily_checkins`
- 战队与成员：`public.health_teams`、`public.health_team_members`
- 挑战与挑战记录：`public.health_challenges`、`public.health_challenge_logs`
- 打卡照片：`health-checkin-photos` 私有对象存储桶
- 浏览器缓存：`health_motion_web_state_v3`

所有用户表均启用了行级安全策略；排行榜和社区分享通过受限公开视图只暴露完成率、挑战积分与用户主动分享的照片，不暴露手机号或私人备注。

战队、成员、挑战、签到、跨用户排行榜和社区照片已经使用 CloudBase 云端数据。微信健康自动同步仍需后续接入。

排行榜总分按走路 70% 和体重管理 30% 计算。走路采用目标完成比例连续计分；体重管理分由目标进度 60%、变化平稳度 25% 和记录完成度 15% 组成，公开榜只展示得分。排行榜另提供累计步数子榜，小队按成员人均累计步数排名。

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
