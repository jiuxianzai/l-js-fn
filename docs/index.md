---
layout: home

hero:
  name: "l-js-fn"
  text: "轻量级 JavaScript 工具函数库"
  tagline: 零依赖 · 模块化 · TypeScript · Tree-shaking
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
  - title: 🚀 轻量级
    details: 零依赖，打包体积小，按需引入。
  - title: 📦 模块化
    details: 支持按需导入，减少包体积，主包和子模块分离。
  - title: 🔒 TypeScript
    details: 完整的类型定义，享受类型安全的开发体验。
  - title: 🌐 双模块格式
    details: 同时支持 ESM 和 CJS，兼容各种构建工具。
  - title: 🎨 Tree-shaking
    details: 完整支持 Tree-shaking，只打包用到的代码。
  - title: 💪 工具齐全
    details: 涵盖数组、对象、字符串、日期、URL、正则等常用操作。
---

## 📦 安装

```bash
npm install l-js-fn
# 或
yarn add l-js-fn
# 或
pnpm add l-js-fn
```

## 🚀 快速开始

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

## 📚 文档导航

- [is-kit — 类型判断](/guide/is-kit)
- [array-kit — 数组操作](/guide/array-kit)
- [string-kit — 字符串处理](/guide/string-kit)
- [object-kit — 对象操作](/guide/object-kit)
- [common — 通用工具](/guide/common)
- [date-kit — 日期处理](/guide/date-kit)
- [number-kit — 数字处理](/guide/number-kit)
- [url-kit — URL 处理](/guide/url-kit)
- [color — 颜色处理](/guide/color)
- [Result — 结果类](/guide/result)
- [bom — 浏览器对象模型](/guide/bom)
- [ws — WebSocket](/guide/ws)
- [storage — 本地存储](/guide/storage)
- [polling — 轮询工具](/guide/polling)
- [ipc — IPC 通信](/guide/ipc)
- [regex — 正则常量](/guide/regex)
- [config — 配置常量](/guide/config)
- [encode — 编码解码](/guide/encode)
- [file — 文件处理](/guide/file)
