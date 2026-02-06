# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 JavaScript 工具函数库（l-js-fn），提供了常用的工具方法和类，支持 ESM 和 CJS 双模块格式，使用 TypeScript 开发。

## 构建命令

### 开发与构建
```bash
npm run dev          # 监听模式开发（热重载）
npm run build        # 清理并构建生产版本
npm run clean        # 清理 dist 目录
npm run reload       # 重装依赖（删除 node_modules 和 package-lock.json）
```

### 测试
```bash
npm test             # 运行 Jest 测试
npm run test:coverage  # 运行测试并生成覆盖率报告
npm run test:watch      # 监听模式运行测试
```

### 发布
```bash
npm run publish:npm      # 构建并发布到 npm
npm run publish:major    # major 版本升级并发布
npm run publish:feat     # minor 版本升级并发布
npm run publish:fix      # patch 版本升级并发布
npm run publish:pre      # prerelease 版本升级并发布（beta）
```

### 文档
```bash
npm run docs           # 使用 TypeDoc 生成 API 文档
npm run docs:serve     # 在本地 8080 端口预览文档
```

## 项目架构

### 模块化导出结构

项目采用**多入口点**的模块化设计，支持按需导入：

```
l-js-fn/
├── 主入口点（.）
│   ├── libs/*          # 工具函数集合
│   │   ├── is-kit.ts       # 类型判断
│   │   ├── url-kit.ts      # URL 处理
│   │   ├── array-kit.ts    # 数组操作
│   │   ├── object-kit.ts   # 对象操作
│   │   ├── string-kit.ts   # 字符串处理
│   │   ├── date-kit.ts     # 日期处理
│   │   ├── number-kit.ts   # 数字处理
│   │   └── common.ts       # 通用方法
│   └── utils/*         # 工具类
│       └── Result.ts      # Result 类型处理类
│
├── /bom              # 浏览器对象模型方法
│   └── 滚动、全屏、剪贴板、Cookie 等浏览器 API 封装
│
├── /config           # 配置常量
│   └── DATE_FORMAT、HTTP_STATUS 等常量定义
│
├── /ipc              # 跨进程通信
│   ├── H5Bridge.ts   # H5 与原生通信桥接
│   └── IframeBridge.ts # Iframe 通信桥接
│
├── /polling          # 轮询工具类
│   └── Polling 类（异步方法定时执行）
│
├── /regex            # 正则表达式常量
│   └── PHONE、EMAIL、PASSWORD 等常用正则
│
├── /storage          # 本地存储工具
│   └── localStorage/sessionStorage 封装（支持过期时间）
│
└── /ws               # WebSocket 管理类
    └── WebSocketManager 类（连接、重连、消息发送）
```

### 导入方式

```typescript
// 导入主包（所有工具函数）
import { isArray, formatDate } from 'l-js-fn';

// 按需导入子模块（推荐）
import { scrollTop, copyToClipboard, setCookie, getCookie } from 'l-js-fn/bom';
import { Polling } from 'l-js-fn/polling';
import { REGEXP } from 'l-js-fn/regex';
import { WebSocketManager } from 'l-js-fn/ws';
import { DATE_FORMAT } from 'l-js-fn/config';
import { H5Bridge, IframeBridge } from 'l-js-fn/ipc';
import { setStorage, getStorage } from 'l-js-fn/storage';
```

## 构建工具配置

### tsup.config.ts
- **打包工具**：tsup（基于 esbuild）
- **输出格式**：同时生成 ESM（.js）和 CJS（.cjs）
- **TypeScript 声明**：仅 ESM 入口生成 .d.ts
- **代码优化**：
  - minify: true（压缩）
  - treeshake: true（摇树优化）
  - drop: ['console', 'debugger']（移除 console 和 debugger）
- **目标环境**：ES2020
- **路径别名**：@/* 映射到 src/*

### package.json exports
每个子模块都有独立的 exports 配置，支持 types、import、require 三种导入方式。

## 代码规范

### Commitlint
提交信息遵循 Conventional Commits，支持的 type：
- feat：新功能
- fix：修复 bug
- bug：针对 bug 号的修改
- docs：文档变更
- style：格式调整
- refactor：重构
- test：增加测试
- build：构建相关
- chore：辅助工具变动
- ci：自动化构建
- types：类型定义
- revert：撤销提交

### Prettier
- printWidth: 150（一行最多 150 字符）
- useTabs: true（使用 tab 缩进）
- singleQuote: true（使用单引号）
- semi: true（使用分号）
- trailingComma: es5（ES5 尾随逗号）
- endOfLine: lf（Unix 换行符）

## TypeScript 配置

- **target**：ES2019
- **module**：ESNext
- **moduleResolution**：Node
- **strict**：true（严格模式）
- **路径映射**：@/* → src/*

## 开发注意事项

1. **子模块独立性**：新增工具函数时，判断应该放在主入口还是子模块（bom/ipc/ws/polling/regex/config）
2. **类型导出**：主要在 src/types/index.ts 中集中管理类型定义
3. **类的设计**：WebSocketManager、Polling 等类设计为可独立使用的工具类
4. **浏览器兼容性**：bom 模块中的方法需要考虑旧浏览器兼容（如全屏 API）
5. **环境判断**：涉及浏览器 API 的方法需做服务端渲染（SSR）兼容判断
6. **常量定义**：使用 as const 确保常量类型推断

## 测试

测试环境：node（Jest 配置）

### 测试文件结构
测试文件位于 `__tests__/` 目录，与源代码结构对应：
```
__tests__/
├── bom/index.test.ts
├── config/index.test.ts
├── ipc/
│   ├── H5Bridge.test.ts
│   └── IframeBridge.test.ts
├── libs/
│   ├── array-kit.test.ts
│   ├── common.test.ts
│   ├── date-kit.test.ts
│   ├── is-kit.test.ts
│   ├── number-kit.test.ts
│   ├── object-kit.test.ts
│   ├── string-kit.test.ts
│   └── url-kit.test.ts
├── polling/index.test.ts
├── regex/index.test.ts
├── utils/Result.test.ts
└── ws/index.test.ts
```

### 覆盖率要求
- **阈值**：80%（branches、functions、lines、statements）
- **报告格式**：text、text-summary、lcov、html、json
- **输出目录**：`coverage/`

### 运行单个测试文件
```bash
# 测试单个文件
npx jest __tests__/libs/is-kit.test.ts

# 测试匹配模式
npx jest --testNamePattern="should return true"
```
