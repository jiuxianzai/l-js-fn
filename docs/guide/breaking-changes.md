---
title: 迁移指南
---

# 迁移指南

本文档汇总各**大版本**之间的破坏性变更（Breaking Changes）及迁移方法。

> [!TIP]
> 本文档始终面向最新版本。历史大版本文档已归档，可通过导航栏右上角的**版本下拉框**切换查看。
> 若你在升级过程中遇到问题，欢迎在 [GitHub Issues](https://github.com/jiuxianzai/l-js-fn/issues) 反馈。

## v3.0.0

**发布时间**：2025-11-17

### 变更内容

- 引入**分包模块化**，所有函数改为按需导入，全面支持 Tree-shaking
- 主包新增子模块入口：`l-js-fn/bom`、`l-js-fn/ws`、`l-js-fn/storage`、`l-js-fn/polling`、`l-js-fn/ipc` 等

### 迁移方法

从主包按需导入，替代 `import { xxx } from 'l-js-fn'` 的旧写法：

```ts
// v2 写法
import { isArray } from 'l-js-fn'

// v3 写法（推荐，主包平铺导出仍可用）
import { isArray } from 'l-js-fn'
```

子模块使用方式：

```ts
// 浏览器相关能力
import { scrollToBottom } from 'l-js-fn/bom'

// WebSocket 管理
import { WebSocketManager } from 'l-js-fn/ws'
```

## v2.0.0

**发布时间**：2025-11-12

### 变更内容

- **取消全量导出**，仅保留按需导出

### 迁移方法

移除对全量导出的依赖，改用具名按需导入：

```ts
// v1 写法（已废弃）
import L from 'l-js-fn'
L.isArray([])

// v2 写法
import { isArray } from 'l-js-fn'
isArray([])
```

## v1.0.0

**发布时间**：2025-09-30

### 说明

v1 为初始发布版本，无破坏性变更。

## 未来版本约定

发布新大版本时，本文档将新增对应小节，并遵循以下约定：

- **破坏性变更**以 `vX.0.0` 小节独立列出，标注变更内容与迁移方法
- 对应历史版本文档归档至 `/vX/guide/`，通过导航栏版本下拉框访问
- 每个破坏性 API 均会在其函数文档中标注「vX.0 破坏性变更」徽章
