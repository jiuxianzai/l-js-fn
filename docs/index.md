---
layout: home

hero:
  name: "l-js-fn"
  text: "轻量级 JavaScript 工具函数库"
  tagline: 170+ 方法 · 核心零依赖 · 模块化 · TypeScript · Tree-shaking
  image:
    src: /logo.svg
    alt: l-js-fn
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/is-kit
    - theme: alt
      text: GitHub
      link: https://github.com/jiuxianzai/l-js-fn

features:
  - title: 170+ 工具函数
    details: 覆盖类型判断、数组、对象、字符串、日期、数字、URL、颜色、编码、加密等场景。
  - title: 轻量级
    details: 核心零依赖，打包体积小，按需引入（SM2/SM4 可选依赖 sm-crypto）。
  - title: 模块化
    details: 支持按需导入，减少包体积，主包和子模块分离。
  - title: TypeScript
    details: 完整的类型定义，享受类型安全的开发体验。
  - title: 双模块格式
    details: 同时支持 ESM 和 CJS，兼容各种构建工具。
  - title: Tree-shaking
    details: 完整支持 Tree-shaking，只打包用到的代码。
---

<div style="display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:4px;margin:32px auto 24px;max-width:960px;">
  <a href="https://www.npmjs.com/package/l-js-fn"><img src="https://img.shields.io/npm/v/l-js-fn?color=cb3837&logo=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/l-js-fn"><img src="https://img.shields.io/npm/dm/l-js-fn?color=blue" alt="downloads"></a>
  <a href="https://github.com/jiuxianzai/l-js-fn/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/l-js-fn?color=green" alt="license"></a>
  <img src="https://img.shields.io/badge/functions-173-blueviolet" alt="functions">
  <img src="https://img.shields.io/badge/tests-1842%2F1842_passed-brightgreen" alt="tests">
  <img src="https://img.shields.io/badge/stmts-98.8%25-brightgreen" alt="statements">
  <img src="https://img.shields.io/badge/branches-95.7%25-brightgreen" alt="branches">
  <img src="https://img.shields.io/badge/lines-99.7%25-brightgreen" alt="lines">
  <a href="https://jiuxianzai.github.io/l-js-fn/"><img src="https://img.shields.io/badge/docs-GitHub_Pages-42b883?logo=github" alt="docs"></a>
</div>

## 安装

```bash
npm install l-js-fn
# 或
yarn add l-js-fn
# 或
pnpm add l-js-fn
```

## 快速开始

### 导入主包

```typescript
import { isArray, dateFormat, isEmpty } from 'l-js-fn';

isArray([1, 2, 3]); // true
dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'); // "2024-01-01 12:00:00"
isEmpty(''); // true
```

### 按需导入子模块

```typescript
import { scrollTop, copyToClipboard } from 'l-js-fn/bom';
import { WebSocketManager } from 'l-js-fn/ws';
import { Polling } from 'l-js-fn/polling';
```

## 文档导航

| 模块 | 说明 |
|------|------|
| [is-kit](/guide/is-kit) | 类型判断（空值、数组、邮箱、身份证、手机号等） |
| [array-kit](/guide/array-kit) | 数组操作（增删改查、分页、分组、随机抽样等） |
| [string-kit](/guide/string-kit) | 字符串处理（脱敏、去除空格、UUID、序号生成等） |
| [object-kit](/guide/object-kit) | 对象操作（合并、过滤、FormData 转换等） |
| [common](/guide/common) | 通用工具（防抖、节流、深拷贝、设备检测等） |
| [date-kit](/guide/date-kit) | 日期处理（格式化、计算、相对时间等） |
| [number-kit](/guide/number-kit) | 数字处理（格式化、百分比、随机数等） |
| [url-kit](/guide/url-kit) | URL 处理（参数解析、拼接、转换等） |
| [color](/guide/color) | 颜色处理（HEX/HSL 转换、图标颜色适配等） |
| [Result](/guide/result) | 结果类（标准化成功/失败结果封装） |
| [bom](/guide/bom) | 浏览器对象模型（滚动、全屏、剪贴板、Cookie 等） |
| [ws](/guide/ws) | WebSocket 管理（连接、心跳、重连等） |
| [storage](/guide/storage) | 本地存储（localStorage/sessionStorage，支持过期时间） |
| [polling](/guide/polling) | 轮询工具（异步方法定时执行） |
| [ipc](/guide/ipc) | IPC 通信（H5 与 Iframe 双向通信） |
| [regex](/guide/regex) | 正则常量（手机号、邮箱、身份证、URL 等） |
| [config](/guide/config) | 配置常量（日期格式、HTTP 状态码） |
| [encode](/guide/encode) | 编码解码（Base64、HTML 转义、URL 编码等） |
| [file](/guide/file) | 文件处理（大小格式化、类型判断、下载、读取等） |
| [event-bus](/guide/event-bus) | 事件总线（子消息发布订阅、类型安全事件） |
| [crypto](/guide/crypto) | 加密模块（MD5、AES、RSA、SM2、SM4 等） |

## 单元测试

本项目使用 [Jest](https://jestjs.io/) 进行单元测试，覆盖率达 **90%+**。

> 覆盖率统计仅针对本项目内部代码，已排除内嵌的第三方库 `luch-request`（见 `jest.config.js` 的 `collectCoverageFrom` 配置）。

### 总览

| 指标 | 数值 |
|------|------|
| 测试套件 | 33 passed |
| 测试用例 | 1842 passed / 1842 total |
| 语句覆盖率 | 98.81% |
| 分支覆盖率 | 95.67% |
| 函数覆盖率 | 100% |
| 行覆盖率 | 99.66% |

### 核心工具模块

| 模块 | 用例数 | 通过率 |
|------|--------|--------|
| color (颜色处理) | 31 | 100% |
| is-kit (类型判断) | 85 | 100% |
| array-kit (数组操作) | 151 | 100% |
| string-kit (字符串处理) | 97 | 100% |
| object-kit (对象操作) | 67 | 100% |
| common (通用工具) | 77 | 100% |
| date-kit (日期处理) | 75 | 100% |
| number-kit (数字处理) | 78 | 100% |
| url-kit (URL 处理) | 81 | 100% |

### 子模块

| 模块 | 用例数 | 通过率 |
|------|--------|--------|
| bom (浏览器 BOM) | 53 | 100% |
| ws (WebSocket) | 33 | 100% |
| storage (本地存储) | 32 | 100% |
| polling (轮询) | 16 | 100% |
| ipc (IPC 通信) | 49 | 100% |
| regex (正则表达式) | 173 | 100% |
| config (配置常量) | 21 | 100% |
| encode (编码/解码) | 56 | 100% |
| file (文件处理) | 62 | 100% |
| event-bus (事件总线) | 31 | 100% |
| crypto (加密模块) | 132 | 100% |
| uniapp (跨端框架) | 326 | 100% |

## 常见问题

### 是否支持服务端/SSR 环境？

大部分工具函数（`is-kit`、`array-kit`、`string-kit`、`object-kit`、`date-kit`、`number-kit`、`url-kit`、`common`、`color`、`Result`、`regex`、`config`、`encode`）可以在任何 JavaScript 环境中使用。

以下模块**仅在浏览器环境**中可用：
- `bom`（DOM 滚动、全屏、剪贴板、Cookie）
- `file`（文件下载、读取）
- `storage`（localStorage/sessionStorage）
- `ws`（WebSocket）
- `ipc`（iframe 通信）
- `polling`（定时轮询）

### `isImage` 在多个模块中出现，应该用哪个？

`is-kit` 和 `file` 模块中都提供了 `isImage` 函数，功能一致（均支持 13 种常见图片格式）。建议：
- 主包用户直接使用 `import { isImage } from 'l-js-fn'`
- 子模块用户使用 `import { isImage } from 'l-js-fn/file'`
- 两者行为完全相同

### 如何正确使用 `Result` 类？

`Result` 的构造函数是私有的，必须通过静态方法创建实例：
- `Result.ok(data?, message?)` — 创建成功结果
- `Result.fail(message?, data?)` — 创建失败结果
::: warning 注意
`Result.fail()` 的第一个参数是 `message`（默认 `'操作失败'`），第二个参数是 `data`。这与 `Result.ok()` 的参数顺序不同。
:::
