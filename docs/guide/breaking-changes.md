---
title: 迁移指南
---

# 迁移指南

本文档汇总各**大版本**之间的破坏性变更（Breaking Changes）及迁移方法。

> [!TIP]
> 本文档始终面向最新版本。历史大版本文档已归档，可通过导航栏右上角的**版本下拉框**切换查看。
> 若你在升级过程中遇到问题，欢迎在 [GitHub Issues](https://github.com/jiuxianzai/l-js-fn/issues) 反馈。

## v4.0.0

**发布时间**：2026-08-21

### 变更内容

v4 是一次「命名统一 + API 精简」的大版本，聚焦让 API 更好记、更好用：

1. **统一命名前缀**：数组 `arrayXxx`、对象 `objXxx`、日期 `dateXxx`、判断 `isXxx`
2. **合并重复函数**：4 个数组删除函数合并为 `arrayRemove`/`arrayRemoveAt`/`arrayRemoveBy`；`deepMerge` 合并进 `objMerge`；URL 序列化统一到 `transUrlParams`/`getUrlParams`
3. **移除废弃与冗余**：`uniq`、`findIndex`、`filterSpace`、`isHasProperties`、`querystringify`、`parseQueryString`、`Result` 类
4. **统一错误语义**：无效输入返回安全空值，不再抛错
5. **清理 API 瑕疵**：`objMerge` 改非破坏性、`formatNumber` 去掉 boolean 重载、`getFileInfoFromUrl` 改名等

### 函数重命名对照表

#### 数组操作（array-kit）

| v3 | v4 |
|---|---|
| `arrayDelEl(arr, el, key)` | `arrayRemove(arr, el, key)` |
| `arrayDelToEl(arr, el)` | `arrayRemove(arr, el)` |
| `arrayDelToIndex(arr, index)` | `arrayRemoveAt(arr, index)` |
| `arrayDelToKey(arr, key, value)` | `arrayRemoveBy(arr, item => item[key] === value)` |
| `moveElement(list, idx, action)` | `arrayMove(arr, index, action)`（返回值改为纯数组） |
| `groupBy(arr, key)` | `arrayGroupBy(arr, key)` |
| `sample(arr)` | `arraySample(arr)` |
| `sampleSize(arr, n)` | `arraySampleSize(arr, n)` |
| `flatten(arr, depth)` | `arrayFlatten(arr, depth)` |
| `range(start, end, step)` | `arrayRange(start, end, step)` |
| `shuffle(arr)` | `arrayShuffle(arr)` |
| `uniqueBy(arr, key)` | `arrayUniqueBy(arr, key)` |
| `compact(arr)` | `arrayCompact(arr)` |
| `sum(arr)` | `arraySum(arr)` |
| `sumBy(arr, key)` | `arraySumBy(arr, key)` |
| `last(arr)` | `arrayLast(arr)` |
| `sortBy(arr, key, order)` | `arraySortBy(arr, key, order)` |
| `uniq(arr)` | `arrayUnique(arr)`（`uniq` 移除） |
| `findIndex(arr, fn)` | 移除（请用原生 `arr.findIndex`） |

#### 对象操作（object-kit）

| v3 | v4 |
|---|---|
| `pick(obj, keys)` | `objPick(obj, keys)` |
| `omit(obj, keys)` | `objOmit(obj, keys)` |
| `get(obj, path, default)` | `objGet(obj, path, default)` |
| `deepMerge(...sources)` | `objMerge(target, source)`（`deepMerge` 移除，多对象合并请链式调用） |
| `jsonToFormData(data, formData, parentKey)` | `objToFormData(...)` |
| `formDataToObject(formData)` | `objFromFormData(formData)` |
| `isHasProperties(obj, key)` | 移除（请用 `Object.prototype.hasOwnProperty.call`） |
| `objMerge(target, source, mergeType)` | 保持名称，但改为**非破坏性**（返回新对象） |

#### 日期处理（date-kit）

| v3 | v4 |
|---|---|
| `diffDays(date1, date2)` | `dateDiffDays(...)` |
| `diffTime(date1, date2)` | `dateDiffTime(...)` |
| `formatPassTime(time)` | `dateFormatPassTime(time)` |
| `monthDays(time)` | `dateMonthDays(time)` |
| `getTimeDiff(start, end)` | `dateDiff(start, end)` |
| `addDays(date, days)` | `dateAddDays(date, days)` |
| `getWeekDay(date)` | `dateWeekDay(date)` |

#### URL / 编码

| v3 | v4 |
|---|---|
| `querystringify(obj)` | `transUrlParams(obj)`（encode 模块移除） |
| `parseQueryString(str)` | `getUrlParams(str)`（encode 模块移除，支持裸查询字符串） |
| `getFileInfoToUrl(url)` | `getFileInfoFromUrl(url)`（命名修正） |

#### 其他

| v3 | v4 |
|---|---|
| `filterSpace(str)` | 移除（请用 `trim(str)`） |
| `Result` 类 | 移除；`arrayMove` 返回纯数组、`imageToBase64` 返回 `Promise<string>`（失败 reject） |
| `formatNumber(num, true)` | `formatNumber(num, { useUnit: true })`（boolean 重载移除） |
| `random(min, max)` | `min > max` 自动交换边界，不再抛错 |

### 错误语义统一（v4 起）

- 数组/对象类函数无效输入**不再抛错**，返回安全空值（`[]`/`{}`/`undefined`/原数组拷贝）
- 仅保留数据契约类函数的抛错行为（如 `deepClone` 循环引用、日期解析失败），并在文档中标注
- `imageToBase64` 失败时 **reject**（而非返回 `Result.fail`）

### 迁移步骤

1. 按上方对照表全局替换函数名（IDE 全局搜索替换即可）
2. 处理返回值变化：
   - `moveElement` → `arrayMove`：从 `result.data` 取值改为直接使用返回值
   - `imageToBase64`：从 `result.data` 取值改为直接使用返回值，并补充 `.catch` 处理
   - `objMerge`：若依赖原地修改副作用，改为接收返回值
3. 移除对 `Result`、`querystringify`、`parseQueryString`、`uniq`、`findIndex`、`filterSpace`、`isHasProperties` 的引用
4. 运行测试确认行为一致

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
