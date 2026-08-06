# 更新日志

## [未发布]

### 修复

- `syntaxHighlight`/`searchTextColor` 对字符串值做 HTML 转义防止 XSS
- `imageToBase64` 添加 `try/catch` 防止 tainted canvas 导致 Promise 挂起
- `urlDecode` 默认改为 `decodeURIComponent` 与 `urlEncode` 对称
- `parseQueryString`/`getUrlParams` 改用 `indexOf('=')` 防止含 `=` 值截断
- `getUrlParams` 添加 `decodeURIComponent` 异常捕获防止非法编码崩溃
- `dateSecond` 去掉 `%24` 截断，允许输出超 24h
- `diffDays` 改用 `Date.UTC` 归一化避免 DST 夏令时误差
- `toTimestamp` 增强 iOS/Safari 兼容，统一 `getTimeDiff` 复用
- `copyToClipboard` clipboard API 加 `try/catch`，fallback 检查 `execCommand` 返回值
- `objMerge` 添加 `WeakSet` 循环引用检测，`||{}` 改为 `?? {}`
- `getType` 添加 `constructor` 存在性检查，防止 `Object.create(null)` 崩溃
- `random()` 合并单参 `<=0` 判定与 `=undefined` 分支，消除逻辑缺陷
- IframeBridge 未注册 handler 时加空值守卫，防止 `TypeError`
- IframeBridge / H5Bridge 的 `off()` 加 `|| []` 防护，防止未注册事件崩溃
- WebSocket 连接关闭后清理心跳 `timer`，防止泄漏
- `Polling.stop()` 在等待间隔期间主动 resolve，防止遗留挂起 Promise
- `arrayDelEl` 用 `isEqual` 替代 `JSON.stringify` 深比较，修复循环引用崩溃
- `sampleSize` 用 `shuffle().slice()` 替代随机索引重试，消除 O(n²) 退化
- `deepClone` 中 `cloneFunctions` 改为返回原引用，不再 `bind({})`
- `storage` 环境判断改为直接探测 `typeof localStorage`/`typeof sessionStorage`
- `downloadFile` 中 `revokeObjectURL` 延迟到 `setTimeout(0)` 执行
- `toPercent` 非四舍五入模式改为算术截断，修复 `decimals=0` 输出畸形 bug
- `debounce` 用箭头函数消除 `no-this-alias` lint 问题
- `findIndex` 参数 `ary` → `arr` 统一
- `crypto/md5` 移除未使用的 `stringToBytes` 导入
- 消除 6 处 ESLint warnings（catch 绑定、未使用变量）

### 重构

- `arrayUnique` 标记 `@deprecated`，委托给 `uniq`
- `findIndex` 删除永不执行的 fallback 死代码
- `objFilterNull` 用 `Object.fromEntries` 替代 `reduce`
- `pick` 用 `hasOwnProperty` 替代 `key in obj` 避免原型链误判
- `objFilterProp` 用 `Set` 替代 `includes` 线性查找
- `filterSpace` 复用 `trim(str, 'both')`
- 抽取 `readFile` 私有 helper 消除三大段重复 FileReader 样板代码
- `isImage` 统一到 `is-kit.ts`，`file/index.ts` 重导出，消除双处维护
- `isArray` 删除冗余 `Object.toString` 回退分支
- `CookieOptions`/`FileSizeUnit`/`FileSizeInfo` 移至 `src/types/index.ts` 集中管理
- `tsconfig` 的 `target`/`lib` 从 `ES2019` 升级为 `ES2020`，与 tsup 对齐

### 新增

- 添加 ESLint 配置 + `lint`/`format`/`check` npm scripts
- 创建 CHANGELOG.md

### 文档

- AGENTS.md 移除未实现的 SM3 引用
- `regex/index.ts` URL 正则添加 ReDoS 风险注释

### 配置

- `engines.node` 从 `>=14` 提升为 `>=18`，匹配 rimraf v6 要求

## [3.12.3] - 2026-08-05

### 修复

- `getDevice` 小程序检测改用 `typeof` 直接检测 `wx`/`my`，修复 `globalThis` 为 `undefined` 的问题

## [3.12.2] - 2026-08-04

### 新增

- `getUuid` 新增 `length` 参数，支持获取指定位数的 UUID

### 重构

- 移除 `imageToBase64` 中的无效 try-catch，直接 reject 处理空 ctx

## [3.12.1] - 2026-08-04

### 修复

- 修复 6 个 MEDIUM 严重性 bug（正确性 / 安全 / 性能）
- 修复 6 个 HIGH 严重性 bug（内存泄漏 / 崩溃 / 逻辑错误）

### 文档

- 更新 `validateParams`/`isEqual`/`monthDays`/`memoize`/`appendUrlParam` 文档反映行为变更

## [3.12.0] - 2026-08-01

### 新增

- 新增 `sortBy`、`uniq`、`sumBy`、`omit` 工具函数
- `isEqual` 添加 WeakMap 循环引用检测

### 修复

- `sleep` 测试偶发失败修复

### 重构

- 消除代码重复，统一复用已有工具函数

## [3.11.0] - 2026-07-28

### 新增

- 新增 `diffTime` 日期差值计算
- 新增 `desensitizeName` 姓名脱敏
- 扩展 `formatNumber` 金额格式化
- `isURL` 合并 `isUrlLike` 逻辑，支持绝对路径和协议相对路径验证

### 测试

- 补齐测试用例，覆盖率全面提升至 90%+

## [3.10.0] - 2026-07-25

### 新增

- 新增 `isInArray` 工具函数
- 新增 `arrayPluck` 工具函数

### 文档

- 所有指南模块添加章节编号

## [3.9.0] — 2026-07-22

### 新增

- 新增加密模块（`l-js-fn/crypto`），支持 MD5 / AES / RSA / SM2 / SM4
- 新增事件总线模块（`l-js-fn/event-bus`）
- 新增原生 Node.js ESM 分布测试脚本

## [3.8.0] — 2026-07-18

### 新增

- 新增事件总线模块

### 变更

- 优化类型安全，消除隐式 `any` 和 `as any` 断言

## [3.7.0] — 2026-07-15

### 新增

- `appendUrlParams`：批量添加 URL 查询参数，兼容 hash/history 路由模式
- 补充 21 个常用工具方法
- 正则模块：新增 9 条常用正则规则

### 文档

- GitHub Pages 文档站点上线（VitePress）
- 函数说明加入 TS/ESM/CJS 三栏代码示例

### 修复

- `appendUrlParams` 默认参数追加到 `#` 后，新增 `position` 选项

## [3.6.0] — 2026-07-10

### 新增

- 补充 21 个常用工具方法

### 文档

- 添加 GitHub Pages 文档站点和部署脚本
- 新增 9 条常用正则规则

## [3.5.0] — 2026-07-05

### 新增

- `isHttp`/`isHttps` 方法

### 文档

- VitePress 文档主题美化：暖金色系 + SVG 图标 + 过渡动画

### 修复

- 补充缺失的函数参数/返回值类型，消除 `any`/`Function` 类型
