# Changelog

## [Unreleased]

### Refactor

- `arrayUnique` 标记 `@deprecated`，委托给 `uniq`
- `findIndex` 删除永不执行的 fallback 死代码
- `objFilterNull` 用 `Object.fromEntries` 替代 `reduce`
- `pick` 用 `hasOwnProperty` 替代 `key in obj` 避免原型链误判
- `objFilterProp` 用 `Set` 替代 `includes` 线性查找
- `filterSpace` 复用 `trim(str, 'both')`
- 抽取 `readFile` 私有 helper 消除三大段重复 FileReader 样板代码
- `isImage` 统一到 `is-kit.ts`，`file/index.ts` 重导出，消除双处维护
- `isArray` 删除冗余 `Object.toString` 回退分支

### Fixed

- WebSocket 连接关闭后清理心跳 `timer`，防止泄漏
- `Polling.stop()` 在等待间隔期间主动 resolve，防止遗留挂起 Promise
- `arrayDelEl` 用 `isEqual` 替代 `JSON.stringify` 深比较，修复循环引用崩溃
- `sampleSize` 用 `shuffle().slice()` 替代随机索引重试，消除 O(n²) 退化
- `deepClone` 中 `cloneFunctions` 改为返回原引用，不再 `bind({})`
- `storage` 环境判断改为直接探测 `typeof localStorage`/`typeof sessionStorage`
- `downloadFile` 中 `revokeObjectURL` 延迟到 `setTimeout(0)` 执行
- `toPercent` 非四舍五入模式改为算术截断，修复 `decimals=0` 输出畸形 bug
- 构建改为只 drop `console.log`，保留 `console.warn`/`console.error`
- IframeBridge 未注册 handler 时加空值守卫，防止 `TypeError`
- IframeBridge / H5Bridge 的 `off()` 加 `|| []` 防护，防止未注册事件崩溃
- `debounce` 消除 `no-this-alias` lint 问题

### Added

- 添加 ESLint 配置 + `lint`/`format`/`check` npm scripts

## [3.12.3] - 2026-08-05

### Fixed

- `getDevice` 小程序检测改用 `typeof` 直接检测 `wx`/`my`，修复 `globalThis` 为 `undefined` 的问题

## [3.12.2] - 2026-08-04

### Added

- `getUuid` 新增 `length` 参数，支持获取指定位数的 UUID

### Refactor

- 移除 `imageToBase64` 中的无效 try-catch，直接 reject 处理空 ctx

## [3.12.1] - 2026-08-04

### Fixed

- 修复 6 个 MEDIUM 严重性 bug（正确性 / 安全 / 性能）
- 修复 6 个 HIGH 严重性 bug（内存泄漏 / 崩溃 / 逻辑错误）

### Docs

- 更新 `validateParams`/`isEqual`/`monthDays`/`memoize`/`appendUrlParam` 文档反映行为变更

## [3.12.0] - 2026-08-01

### Added

- 新增 `sortBy`、`uniq`、`sumBy`、`omit` 工具函数
- `isEqual` 添加 WeakMap 循环引用检测

### Fixed

- `sleep` 测试偶发失败修复

### Refactor

- 消除代码重复，统一复用已有工具函数

## [3.11.0] - 2026-07-28

### Added

- 新增 `diffTime` 日期差值计算
- 新增 `desensitizeName` 姓名脱敏
- 扩展 `formatNumber` 金额格式化
- `isURL` 合并 `isUrlLike` 逻辑，支持绝对路径和协议相对路径验证

### Tests

- 补齐测试用例，覆盖率全面提升至 90%+

## [3.10.0] - 2026-07-25

### Added

- 新增 `isInArray` 工具函数
- 新增 `arrayPluck` 工具函数

### Docs

- 所有指南模块添加章节编号

## [3.9.0] — 2026-07-22

### Added

- 新增加密模块（`l-js-fn/crypto`），支持 MD5 / AES / RSA / SM2 / SM4
- 新增事件总线模块（`l-js-fn/event-bus`）
- 新增原生 Node.js ESM 分布测试脚本

## [3.8.0] — 2026-07-18

### Added

- 新增事件总线模块

### Changed

- 优化类型安全，消除隐式 `any` 和 `as any` 断言

## [3.7.0] — 2026-07-15

### Added

- `appendUrlParams`：批量添加 URL 查询参数，兼容 hash/history 路由模式
- 补充 21 个常用工具方法
- 正则模块：新增 9 条常用正则规则

### Docs

- GitHub Pages 文档站点上线（VitePress）
- 函数说明加入 TS/ESM/CJS 三栏代码示例

### Fixed

- `appendUrlParams` 默认参数追加到 `#` 后，新增 `position` 选项

## [3.6.0] — 2026-07-10

### Added

- 补充 21 个常用工具方法

### Docs

- 添加 GitHub Pages 文档站点和部署脚本
- 新增 9 条常用正则规则

## [3.5.0] — 2026-07-05

### Added

- `isHttp`/`isHttps` 方法

### Docs

- VitePress 文档主题美化：暖金色系 + SVG 图标 + 过渡动画

### Fixed

- 补充缺失的函数参数/返回值类型，消除 `any`/`Function` 类型
