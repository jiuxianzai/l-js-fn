---
sidebar: false
---

# 更新日志

各版本发版内容，仅展示与使用相关的变更。

<details open class="cl-current">
<summary><span class="cl-ver"><code>v3.19.0</code></span><span class="cl-date">2026-08-20</span><span class="cl-current-tag">最新版本</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `arrayToString`：过滤空值后按顺序拼接数组为字符串，常用于签名串生成

</details>

<details open>
<summary><span class="cl-ver"><code>v3.18.0</code></span><span class="cl-date">2026-08-20</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 SM3 国密哈希算法
- 新增 `l-js-fn/crypto/sm` 小程序子入口

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- `sm4` 加密支持 UTF-8 密钥自动转 hex，无需手动转换

</details>

<details open>
<summary><span class="cl-ver"><code>v3.17.1</code></span><span class="cl-date">2026-08-14</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `uniRequest` GET 请求参数序列化优化，URL 已自带 `?` 参数时能自动识别并正确拼接

</details>

<details open>
<summary><span class="cl-ver"><code>v3.17.0</code></span><span class="cl-date">2026-08-12</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- uniapp 新增剪贴板、设备适配、网络状态模块
- uniapp `actionSheet` 弹窗能力

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- uniapp `storage` 支持过期时间与加密存储（兼容中文与 Emoji）

</details>

<details open>
<summary><span class="cl-ver"><code>v3.16.0</code></span><span class="cl-date">2026-08-12</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 主包全量平铺子模块方法，支持主包直接导入并按需 Tree-shaking

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- 移除 ws 接收消息时的数据日志输出

</details>

<details>
<summary><span class="cl-ver"><code>v3.15.0</code></span><span class="cl-date">2026-08-11</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增银行卡号校验正则 `BANK_CARD` 与 `isBankCard` 方法

</details>

<details>
<summary><span class="cl-ver"><code>v3.14.0</code></span><span class="cl-date">2026-08-07</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 uniapp `file` 文件系统模块（`write` / `read` / `access` / `remove` / `getPath`），自动适配微信 / 支付宝

</details>

<details>
<summary><span class="cl-ver"><code>v3.13.0</code></span><span class="cl-date">2026-08-07</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 uniapp 平台适配层，支持自动检测 / 手动注册 / 扩展新平台
- 新增 uniapp `env` 环境信息、`router` 路由导航、`permission` 完整授权流程、`model` 弹窗、`toast`、`request` 网络请求、`storage` 本地存储等模块

</details>

<details>
<summary><span class="cl-ver"><code>v3.12.4</code></span><span class="cl-date">2026-08-06</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `urlDecode` 默认行为与 `urlEncode` 对称
- `dateSecond` 允许输出超过 24 小时的秒数
- `diffDays` 修复夏令时导致的日期差误差
- `toPercent` 修复 `decimals=0` 时输出异常
- `copyToClipboard` 增加 Clipboard API 降级回退
- `arrayDelEl` 改用深度相等算法比较，支持循环引用对象
- `getType` 兼容 `Object.create(null)` 创建的对象
- `random` / `objMerge` / `deepClone` / `sampleSize` / `Polling.stop` 等逻辑缺陷修复

<p class="cl-cat cl-cat-deprecated"><strong>废弃</strong></p>

- `arrayUnique` 已废弃，请使用 `uniq`

</details>

<details>
<summary><span class="cl-ver"><code>v3.12.3</code></span><span class="cl-date">2026-08-05</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `getDevice` 小程序检测逻辑优化，兼容 `globalThis` 为 undefined 的环境

</details>

<details>
<summary><span class="cl-ver"><code>v3.12.2</code></span><span class="cl-date">2026-08-04</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- `getUuid` 新增 `length` 参数，支持获取指定位数的 UUID

</details>

<details>
<summary><span class="cl-ver"><code>v3.12.1</code></span><span class="cl-date">2026-07-31</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- 修复 6 个 HIGH 与 6 个 MEDIUM 级别功能 bug（内存泄漏 / 崩溃 / 逻辑错误 / 正确性）

</details>

<details>
<summary><span class="cl-ver"><code>v3.12.0</code></span><span class="cl-date">2026-07-31</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `sortBy`、`uniq`、`sumBy`、`omit` 工具函数
- `isEqual` 增加循环引用检测

</details>

<details>
<summary><span class="cl-ver"><code>v3.11.0</code></span><span class="cl-date">2026-07-31</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `diffTime` 日期差值计算
- 新增 `desensitizeName` 姓名脱敏
- `formatNumber` 扩展金额格式化能力

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- `isURL` 合并 `isUrlLike` 逻辑，支持绝对路径与协议相对路径验证

</details>

<details>
<summary><span class="cl-ver"><code>v3.10.0</code></span><span class="cl-date">2026-07-30</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `isInArray`、`arrayPluck` 工具函数

</details>

<details>
<summary><span class="cl-ver"><code>v3.9.0</code></span><span class="cl-date">2026-07-30</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增加密模块 `l-js-fn/crypto`：MD5 / AES / RSA / SM2 / SM4

</details>

<details>
<summary><span class="cl-ver"><code>v3.8.0</code></span><span class="cl-date">2026-07-29</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增事件总线模块 `l-js-fn/event-bus`

</details>

<details>
<summary><span class="cl-ver"><code>v3.7.1</code></span><span class="cl-date">2026-07-29</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `appendUrlParams` 默认将参数追加到 `#` 后，新增 `position` 选项控制追加位置

</details>

<details>
<summary><span class="cl-ver"><code>v3.7.0</code></span><span class="cl-date">2026-07-29</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `appendUrlParams` 批量添加 URL 查询参数，兼容 hash / history 路由模式
- 补充 21 个常用工具方法
- 正则模块新增 9 条常用正则规则

</details>

<details>
<summary><span class="cl-ver"><code>v3.6.0</code></span><span class="cl-date">2026-07-27</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 补充 21 个常用工具方法
- GitHub Pages 文档站点上线（VitePress）

</details>

<details>
<summary><span class="cl-ver"><code>v3.5.0</code></span><span class="cl-date">2026-07-27</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `isHttp` / `isHttps` 方法，判断链接协议类型

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- VitePress 文档主题美化（暖金色系 + SVG 图标 + 过渡动画）

</details>

<details>
<summary><span class="cl-ver"><code>v3.4.2</code></span><span class="cl-date">2026-07-03</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `imageToBase64` / `loadScript` 返回值类型不一致
- `setCookie` httpOnly 客户端设置无效
- `urlDecode` 的 `component` 参数无效
- `dateSecond` 负数输入返回异常
- `searchTextColor` 正则特殊字符导致渲染异常
- `isEqual` 与 null 比较时崩溃

</details>

<details>
<summary><span class="cl-ver"><code>v3.4.1</code></span><span class="cl-date">2026-04-16</span></summary>

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- `isEmpty` 空字符串判断

</details>

<details>
<summary><span class="cl-ver"><code>v3.4.0</code></span><span class="cl-date">2026-04-01</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增颜色处理、驼峰命名相关方法

</details>

<details>
<summary><span class="cl-ver"><code>v3.3.0</code></span><span class="cl-date">2026-02-06</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增若干工具方法

</details>

<details>
<summary><span class="cl-ver"><code>v3.2.1</code></span><span class="cl-date">2026-01-28</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增文档网页与代码覆盖率报告

<p class="cl-cat cl-cat-fix"><strong>修复</strong></p>

- 修复 number-kit 模块的多个关键 bug

</details>

<details>
<summary><span class="cl-ver"><code>v3.2.0</code></span><span class="cl-date">2025-12-03</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `validateParams` 参数校验方法

</details>

<details>
<summary><span class="cl-ver"><code>v3.1.0</code></span><span class="cl-date">2025-11-21</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `syntaxHtmlToJson` 语法高亮 HTML 转 JSON 方法

</details>

<details>
<summary><span class="cl-ver"><code>v3.0.1</code></span><span class="cl-date">2025-11-17</span></summary>

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- 打包产物开启代码压缩，减小体积

</details>

<details>
<summary><span class="cl-ver"><code>v3.0.0</code></span><span class="cl-date">2025-11-17</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 分包模块化，支持按需导入

</details>

<details>
<summary><span class="cl-ver"><code>v2.2.0</code></span><span class="cl-date">2025-11-13</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `arrayDelToIndex` / `arrayDelToEl` / `arrayDelToKey` 数组删除方法

</details>

<details>
<summary><span class="cl-ver"><code>v2.1.0</code></span><span class="cl-date">2025-11-13</span></summary>

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- 小版本迭代优化

</details>

<details>
<summary><span class="cl-ver"><code>v2.0.0</code></span><span class="cl-date">2025-11-12</span></summary>

<p class="cl-cat cl-cat-change"><strong>变更</strong></p>

- 取消全量导出，保留按需导出

</details>

<details>
<summary><span class="cl-ver"><code>v1.8.0</code></span><span class="cl-date">2025-10-29</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增数组移动方法

</details>

<details>
<summary><span class="cl-ver"><code>v1.7.0</code></span><span class="cl-date">2025-10-27</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增生成指定数量不重复随机索引方法

</details>

<details>
<summary><span class="cl-ver"><code>v1.5.0</code> / <code>v1.6.0</code></span><span class="cl-date">2025-10-21</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `copyToClipboard`、`scrollToBottom`、`MONEY` 正则、`imageToBase64`

</details>

<details>
<summary><span class="cl-ver"><code>v1.4.0</code></span><span class="cl-date">2025-10-21</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- `dateFormat` 支持默认当前时间参数
- 新增 `getTimeDiff` 时间间隔计算

</details>

<details>
<summary><span class="cl-ver"><code>v1.3.0</code></span><span class="cl-date">2025-10-16</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `indexToLabel` 索引转序号

</details>

<details>
<summary><span class="cl-ver"><code>v1.2.0</code></span><span class="cl-date">2025-10-16</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- 新增 `isHasProperties`、`scrollTop`、`getScrollPosition`、`setScrollPosition`、`formDataToObject` 方法

</details>

<details>
<summary><span class="cl-ver"><code>v1.1.x</code></span><span class="cl-date">2025-10-15</span></summary>

<p class="cl-cat cl-cat-enhance"><strong>增强</strong></p>

- 小版本迭代与稳定性优化

</details>

<details>
<summary><span class="cl-ver"><code>v1.0.x</code></span><span class="cl-date">2025-09-30 ~ 2025-10-14</span></summary>

<p class="cl-cat cl-cat-add"><strong>新增</strong></p>

- v1.0.0 首个版本发布
- 逐步新增 WebSocket 管理、`findIndex`、`isImage`、`getFileInfoToUrl`、IPC 工具类等方法与配套测试

</details>
