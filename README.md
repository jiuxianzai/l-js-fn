<div align="center">

# l-js-fn

**轻量级 JavaScript 工具函数库** —— 180+ 工具函数、20+ 模块，核心零依赖，
完整 TypeScript 类型，ESM / CJS 双格式，天然支持 Tree-shaking。

[![npm version](https://img.shields.io/npm/v/l-js-fn?color=cb3837&logo=npm)](https://www.npmjs.com/package/l-js-fn)
[![npm downloads](https://img.shields.io/npm/dm/l-js-fn?color=blue)](https://www.npmjs.com/package/l-js-fn)
[![license](https://img.shields.io/npm/l/l-js-fn?color=green)](./LICENSE)
[![node](https://img.shields.io/node/v/l-js-fn)](https://www.npmjs.com/package/l-js-fn)
[![tests](https://img.shields.io/badge/tests-1907%20passed-brightgreen)](https://jiuxianzai.github.io/l-js-fn/)
[![coverage](https://img.shields.io/badge/coverage-98.8%25-brightgreen)](https://jiuxianzai.github.io/l-js-fn/)
[![docs](https://img.shields.io/badge/docs-GitHub%20Pages-42b883?logo=github)](https://jiuxianzai.github.io/l-js-fn/)

[📖 在线文档](https://jiuxianzai.github.io/l-js-fn/) ·
[🚀 快速开始](#-快速开始) ·
[🔧 模块一览](#-模块一览) ·
[📦 迁移指南](https://jiuxianzai.github.io/l-js-fn/guide/breaking-changes.html) ·
[📝 更新日志](https://jiuxianzai.github.io/l-js-fn/guide/changelog.html) ·
[🐞 Issues](https://github.com/jiuxianzai/l-js-fn/issues)

</div>

---

## ✨ 特性

- **工具齐全**：类型判断、数组、字符串、对象、日期、数字、URL、颜色、编码、加密、文件、正则、配置，以及 WebSocket、轮询、IPC、事件总线、uni-app 适配层等 20+ 子模块；主包 **167 个具名导出**。
- **主包全量平铺**：除 `crypto` 外，所有子模块方法都可以直接从 `l-js-fn` 导入；主包为 ESM 具名导出且 `sideEffects: false`，webpack5 / vite / rollup / esbuild 均可摇树到函数级，只打包真正用到的方法。
- **核心零依赖**：仅国密 SM2 / SM3 / SM4 需要按需安装可选依赖 `sm-crypto`（peerDependency，未安装不影响其他模块）。
- **TypeScript 友好**：随包提供 `.d.ts`，参数与返回值完整标注；`EventBus` 还支持事件名与参数的类型推导。
- **双模块格式**：同时产出 ESM 与 CJS，并保留 `l-js-fn/<module>` 子路径入口，兼容老项目与 CJS 场景。
- **面向业务**：脱敏、身份证 / 手机号 / 银行卡校验、中文大写金额、日期差与相对时间、WebSocket 心跳重连、轮询、事件总线、H5 ↔ Iframe 通信等开箱即用。

## 📦 安装

```bash
# npm
npm install l-js-fn

# pnpm
pnpm add l-js-fn

# yarn
yarn add l-js-fn
```

- Node.js `>= 18`（仅 `crypto` 模块依赖 Node 内置能力）
- 需要国密算法时再安装可选依赖：`npm install sm-crypto`

## 🚀 快速开始

### 主包导入（推荐）

```ts
import { isArray, isEmpty, dateFormat, desensitization } from 'l-js-fn';

isArray([1, 2, 3]);                              // true
isEmpty('');                                     // true（'', [], {}, null, undefined 均为空）
dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');   // '2024-01-01 12:00:00'
desensitization('13800138000', 3, 4);            // '138****8000'
```

主包已平铺各子模块方法，浏览器相关能力同样可以直接导入：

```ts
import {
  scrollTop, copyToClipboard,          // bom
  setStorage, getStorage,              // storage
  WebSocketManager, Polling, EventBus, // ws / polling / event-bus
  REGEXP, DATE_FORMAT, HTTP_STATUS,    // 常量
} from 'l-js-fn';
```

> `crypto` 依赖 Node 内置 `crypto`，因此不参与主包平铺，需通过子路径导入。

### 子路径导入（兼容旧用法）

`l-js-fn/<module>` 子路径完整保留，适合 CJS（`require` 无法摇树）或需要精确控制加载范围的场景：

```ts
import { scrollTop, copyToClipboard } from 'l-js-fn/bom';
import { WebSocketManager } from 'l-js-fn/ws';
import { Polling } from 'l-js-fn/polling';
import { EventBus, eventBus } from 'l-js-fn/event-bus';
import { md5, aesEncrypt } from 'l-js-fn/crypto';   // 仅 Node 环境
import { env, router, request } from 'l-js-fn/uniapp';
```

CommonJS 用法一致：

```js
const { isArray } = require('l-js-fn');
const { scrollTop } = require('l-js-fn/bom');
```

## 🔧 模块一览

| 模块 | 导入方式 | 说明 |
| --- | --- | --- |
| [is-kit](https://jiuxianzai.github.io/l-js-fn/guide/is-kit.html) | 主包 | 类型判断：空值、数组、对象、邮箱、手机号、身份证、银行卡、URL、深度比较 |
| [array-kit](https://jiuxianzai.github.io/l-js-fn/guide/array-kit.html) | 主包 | 数组：增删、去重、分组、分页、扁平化、排序、洗牌、求和、取样 |
| [string-kit](https://jiuxianzai.github.io/l-js-fn/guide/string-kit.html) | 主包 | 字符串：脱敏、去空格、UUID、命名风格转换、序号生成 |
| [object-kit](https://jiuxianzai.github.io/l-js-fn/guide/object-kit.html) | 主包 | 对象：合并、过滤、pick / omit、深层取值、FormData 互转 |
| [common](https://jiuxianzai.github.io/l-js-fn/guide/common.html) | 主包 | 通用：防抖、节流、深拷贝、重试、单次执行、缓存、设备检测 |
| [date-kit](https://jiuxianzai.github.io/l-js-fn/guide/date-kit.html) | 主包 | 日期：格式化、差值、加减天数、闰年、相对时间、当月天数 |
| [number-kit](https://jiuxianzai.github.io/l-js-fn/guide/number-kit.html) | 主包 | 数字：千分位、单位换算、中文大写金额、百分比、随机数、取整 |
| [url-kit](https://jiuxianzai.github.io/l-js-fn/guide/url-kit.html) | 主包 | URL：参数解析 / 拼接、hash 路由兼容、文件信息提取 |
| [color](https://jiuxianzai.github.io/l-js-fn/guide/color.html) | 主包 | 颜色：HEX / HSL 互转、主题适配、文本色计算 |
| [encode](https://jiuxianzai.github.io/l-js-fn/guide/encode.html) | 主包 | 编码：Base64（含 Unicode）、HTML 转义、URL 编解码 |
| [file](https://jiuxianzai.github.io/l-js-fn/guide/file.html) | 主包 | 文件：大小格式化、扩展名、类型判断、下载、读取 |
| [bom](https://jiuxianzai.github.io/l-js-fn/guide/bom.html) | 主包 | 浏览器：滚动、全屏、剪贴板、Cookie |
| [storage](https://jiuxianzai.github.io/l-js-fn/guide/storage.html) | 主包 | 存储：localStorage / sessionStorage，支持过期时间 |
| [ws](https://jiuxianzai.github.io/l-js-fn/guide/ws.html) | 主包 | WebSocket 管理：连接、心跳、重连、消息队列 |
| [polling](https://jiuxianzai.github.io/l-js-fn/guide/polling.html) | 主包 | 轮询：异步方法定时执行、启停控制 |
| [ipc](https://jiuxianzai.github.io/l-js-fn/guide/ipc.html) | 主包 | H5 ↔ 原生 / Iframe 双向通信 |
| [event-bus](https://jiuxianzai.github.io/l-js-fn/guide/event-bus.html) | 主包 | 事件总线：发布订阅、一次性事件、类型安全 |
| [regex](https://jiuxianzai.github.io/l-js-fn/guide/regex.html) | 主包 | 25 条常用正则：手机号、邮箱、身份证、银行卡、车牌、金额等 |
| [config](https://jiuxianzai.github.io/l-js-fn/guide/config.html) | 主包 | 常量：日期格式、HTTP 状态码 |
| [crypto](https://jiuxianzai.github.io/l-js-fn/guide/crypto.html) | **仅子路径** | 加密：MD5、AES、RSA、SM2、SM3、SM4（Node 环境） |
| [uniapp](https://jiuxianzai.github.io/l-js-fn/guide/uniapp.html) | 主包（`uni` 前缀）/ 子路径 | 小程序：环境、弹窗、权限、路由、存储、Toast、剪贴板、设备、网络、请求、文件 |

> **uniapp 命名说明**：为避免与通用命名（`env`、`file`、`request` 等）冲突，主包中统一加 `uni` 前缀，如 `uniEnv`、`uniFile`、`uniRequest`；子路径 `l-js-fn/uniapp` 保留原始命名。

## 🧩 常用示例

```ts
import {
  arrayGroupBy, arrayUnique, formatNumber, toPercent,
  getUrlParams, appendUrlParams, objGet, clamp, sleep,
} from 'l-js-fn';

arrayGroupBy([{ kind: 'a' }, { kind: 'b' }, { kind: 'a' }], 'kind');
// { a: [...], b: [...] }

arrayUnique([1, 2, 2, 3]);              // [1, 2, 3]
formatNumber(1234567);                  // '1,234,567'
formatNumber(1234567, { useUnit: true }); // '123.47万'
formatNumber(123.45, { type: 'chinese' }); // '壹佰贰拾叁元肆角伍分'
toPercent(0.5332);                      // '53.32%'

getUrlParams('https://example.com?id=1&name=John'); // { id: '1', name: 'John' }
appendUrlParams('https://example.com/#/home', { id: '1' }); // 'https://example.com/#/home?id=1'

objGet({ a: { b: { c: 1 } } }, 'a.b.c'); // 1
clamp(-1, 0, 10);                        // 0
await sleep(1000);
```

## 🔐 加密与国密

```ts
import { md5, aesEncrypt, aesDecrypt, rsaEncrypt, rsaGenerateKeyPair } from 'l-js-fn/crypto';

md5('Hello World');                                  // b10a8db164e0754105b7a99be72e3fe5
const cipher = aesEncrypt('Hello World', { key: 'my-secret-key' });
aesDecrypt(cipher, { key: 'my-secret-key' });        // 'Hello World'
```

小程序等无 Node 内置 `crypto` 的环境，请使用只包含国密的子入口：

```ts
// 需先安装：npm install sm-crypto
import { sm3, sm4Encrypt, sm4Decrypt, sm2Encrypt } from 'l-js-fn/crypto/sm';
```

## 📱 uni-app 支持

一份代码同时兼容微信小程序、支付宝小程序、H5 与 App，内置 `wechat` / `alipay` / `h5` / `app` 四套适配器，并可通过 `registerAdapter()` 扩展新平台：

```ts
import { env, router, storage, request, toast } from 'l-js-fn/uniapp';

env.platform();                                   // { isWechat: true, isAlipay: false, ... }
await router.push('/pages/detail/index', { query: { id: '1' } });
storage.set('user', { name: 'John' }, { expire: 3600 });
const user = await request.objGet('/user', { params: { id: 1 } });
```

详见 [uniapp 文档](https://jiuxianzai.github.io/l-js-fn/guide/uniapp.html)。

## ⬆️ v4.0.0 变更速览

v4 是一次「命名统一 + API 精简」的大版本：

| v3 | v4 |
| --- | --- |
| `arrayDelEl` / `arrayDelToEl` / `arrayDelToIndex` | `arrayRemove` / `arrayRemoveAt` / `arrayRemoveBy` |
| `moveElement` / `groupBy` / `sample` / `uniq` | `arrayMove` / `arrayGroupBy` / `arraySample` / `arrayUnique` |
| `pick` / `omit` / `get` / `deepMerge` | `objPick` / `objOmit` / `objGet` / `objMerge`（非破坏性） |
| `diffDays` / `formatPassTime` / `addDays` | `dateDiffDays` / `dateFormatPassTime` / `dateAddDays` |
| `querystringify` / `parseQueryString` | `transUrlParams` / `getUrlParams` |
| `filterSpace` / `Result` 类 | 移除（改用 `trim` / 普通返回值） |

其他要点：`objMerge` 改为返回新对象、`formatNumber(num, true)` 改为 `{ useUnit: true }`、无效输入统一返回安全空值而非抛错。
完整对照见 [迁移指南](https://jiuxianzai.github.io/l-js-fn/guide/breaking-changes.html)。

## 🌐 环境支持

| 环境 | 支持情况 |
| --- | --- |
| Node.js | `>= 18`（`crypto` 模块仅 Node 可用） |
| 浏览器 | Chrome >= 90、Edge >= 90、Firefox >= 88、Safari >= 14 |
| 小程序 / uni-app | 通过 `l-js-fn/uniapp` 与 `l-js-fn/crypto/sm` 使用，不依赖 Node 内置模块 |
| SSR / Nuxt / Next | 纯工具函数可直接使用；`bom`、`storage`、`ws`、`file`、`ipc`、`polling` 依赖浏览器环境，请在客户端调用 |

## ✅ 质量保障

使用 [Jest](https://jestjs.io/) 进行单元测试，覆盖率阈值 90%+：

| 指标 | 数值 |
| --- | --- |
| 测试套件 | 35 passed |
| 测试用例 | 1907 passed / 1907 total |
| 语句覆盖率 | 98.81% |
| 分支覆盖率 | 95.67% |
| 函数覆盖率 | 100% |
| 行覆盖率 | 99.66% |

> 覆盖率仅统计项目自有代码，已排除内嵌的第三方库 `luch-request`。

## 📚 文档与反馈

- 在线文档：<https://jiuxianzai.github.io/l-js-fn/>
- API 索引：[guide/is-kit](https://jiuxianzai.github.io/l-js-fn/guide/is-kit.html) 起按左侧导航浏览
- 历史版本：导航栏版本下拉可切换到 [v3.x](https://jiuxianzai.github.io/l-js-fn/v3/) / [v2.x](https://jiuxianzai.github.io/l-js-fn/v2/guide/) 归档文档
- 问题反馈：[GitHub Issues](https://github.com/jiuxianzai/l-js-fn/issues)
- npm 主页：<https://www.npmjs.com/package/l-js-fn>

> **仓库说明**：默认分支 `gh-pages` 存放 VitePress 文档站点的构建产物，由 GitHub Pages 直接托管；README 中的示例均已在 npm 包 `l-js-fn@4.0.0` 上验证。

## 📄 License

[ISC](./LICENSE) © 2024-present [jiuxianzai](https://github.com/jiuxianzai)
