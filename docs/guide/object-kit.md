# object-kit — 对象操作

对象操作工具集，提供合并、过滤、转换等常用功能。

## 1. objMerge 深度合并对象
深度合并两个对象（**非破坏性**），递归合并嵌套对象，数组会直接复制，返回新对象，不修改入参。

> [!WARNING] v4.0 破坏性变更
> - `objMerge` 由**原地修改 target** 改为**返回新对象**，不再修改入参
> - 原 `deepMerge` 已合并到 `objMerge`（两者本就都是深合并），`deepMerge` 移除。多个对象合并请链式调用：`objMerge(objMerge(a, b), c)`

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| target | `T` | 是 | 目标对象（不会被修改） |
| source | `S` | 是 | 源对象 |
| mergeType | `string` | 否 | 合并类型：`'hard'`（硬合并，包含两者所有属性）、`'soft'`（软合并，只包含 target 的属性），默认 `'hard'` |

**返回值：** `T & S` — 合并后的新对象

**示例：**

::: code-group
```ts [TypeScript]
import { objMerge } from 'l-js-fn';

// 基本合并
objMerge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 递归合并嵌套对象
objMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// 深合并（source 覆盖 target 的同名字段）
objMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }

// 非破坏性：target 不会被修改
const target = { a: 1 };
objMerge(target, { b: 2 });
// target 仍为 { a: 1 }
```

```js [JavaScript (ESM)]
import { objMerge } from 'l-js-fn';

// 基本合并
objMerge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 递归合并嵌套对象
objMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// 深合并（source 覆盖 target 的同名字段）
objMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }

// 非破坏性：target 不会被修改
const target = { a: 1 };
objMerge(target, { b: 2 });
// target 仍为 { a: 1 }
```

```js [JavaScript (CJS)]
const { objMerge } = require('l-js-fn');

// 基本合并
objMerge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 递归合并嵌套对象
objMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// 深合并（source 覆盖 target 的同名字段）
objMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }

// 非破坏性：target 不会被修改
const target = { a: 1 };
objMerge(target, { b: 2 });
// target 仍为 { a: 1 }
```
:::

## 2. objFilterProp 过滤指定属性
过滤对象中不需要的属性，返回新对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 源对象 |
| keys | `K[]` | 是 | 需要过滤的属性名数组 |

**返回值：** `Omit<T, K>` — 过滤后的新对象

**示例：**

::: code-group
```ts [TypeScript]
import { objFilterProp } from 'l-js-fn';

const obj = { a: 1, b: 2, c: 3 };
objFilterProp(obj, ['b']);
// { a: 1, c: 3 }

objFilterProp(obj, ['a', 'c']);
// { b: 2 }
```

```js [JavaScript (ESM)]
import { objFilterProp } from 'l-js-fn';

const obj = { a: 1, b: 2, c: 3 };
objFilterProp(obj, ['b']);
// { a: 1, c: 3 }

objFilterProp(obj, ['a', 'c']);
// { b: 2 }
```

```js [JavaScript (CJS)]
const { objFilterProp } = require('l-js-fn');

const obj = { a: 1, b: 2, c: 3 };
objFilterProp(obj, ['b']);
// { a: 1, c: 3 }

objFilterProp(obj, ['a', 'c']);
// { b: 2 }
```
:::

## 3. objFilterNull 过滤空值
过滤对象中的空值（`null` 或 `undefined`），支持通过 `options` 控制过滤行为。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 源对象 |
| options | `{ null?: boolean, undefined?: boolean }` | 否 | 过滤选项，默认 `{ null: true, undefined: true }` |

**返回值：** `Partial<T>` — 过滤后的新对象

**示例：**

::: code-group
```ts [TypeScript]
import { objFilterNull } from 'l-js-fn';

// 默认过滤 null 和 undefined
objFilterNull({ a: 1, b: null, c: undefined, d: 0 });
// { a: 1, d: 0 }

// 只过滤 null，保留 undefined
objFilterNull({ a: 1, b: null, c: undefined }, { null: true, undefined: false });
// { a: 1, c: undefined }

// 只过滤 undefined，保留 null
objFilterNull({ a: 1, b: null, c: undefined }, { null: false, undefined: true });
// { a: 1, b: null }
```

```js [JavaScript (ESM)]
import { objFilterNull } from 'l-js-fn';

// 默认过滤 null 和 undefined
objFilterNull({ a: 1, b: null, c: undefined, d: 0 });
// { a: 1, d: 0 }

// 只过滤 null，保留 undefined
objFilterNull({ a: 1, b: null, c: undefined }, { null: true, undefined: false });
// { a: 1, c: undefined }

// 只过滤 undefined，保留 null
objFilterNull({ a: 1, b: null, c: undefined }, { null: false, undefined: true });
// { a: 1, b: null }
```

```js [JavaScript (CJS)]
const { objFilterNull } = require('l-js-fn');

// 默认过滤 null 和 undefined
objFilterNull({ a: 1, b: null, c: undefined, d: 0 });
// { a: 1, d: 0 }

// 只过滤 null，保留 undefined
objFilterNull({ a: 1, b: null, c: undefined }, { null: true, undefined: false });
// { a: 1, c: undefined }

// 只过滤 undefined，保留 null
objFilterNull({ a: 1, b: null, c: undefined }, { null: false, undefined: true });
// { a: 1, b: null }
```
:::

> [!WARNING] v4.0 破坏性变更
> `isHasProperties` 已在 v4.0 移除 —— 它只是 `Object.prototype.hasOwnProperty` 的薄封装，请直接使用：
> ```ts
> Object.prototype.hasOwnProperty.call(obj, 'a'); // true
> ```

## 4. objToFormData JSON转FormData
将 JSON 对象转换为 `FormData`。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | `Record<string, any>` | 是 | JSON 数据对象 |
| formData | `FormData` | 否 | 已有 FormData 实例（用于递归） |
| parentKey | `string` | 否 | 父级键名前缀 |

**返回值：** `FormData`

> [!NOTE] v4.0 变更
> `data` 不是对象时不再抛错，返回传入的 `formData`（默认空 FormData）。

**示例：**

::: code-group
```ts [TypeScript]
import { objToFormData } from 'l-js-fn';

const data = { name: 'John', age: 20 };
const formData = objToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = objToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```

```js [JavaScript (ESM)]
import { objToFormData } from 'l-js-fn';

const data = { name: 'John', age: 20 };
const formData = objToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = objToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```

```js [JavaScript (CJS)]
const { objToFormData } = require('l-js-fn');

const data = { name: 'John', age: 20 };
const formData = objToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = objToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```
:::

## 5. objFromFormData FormData转对象
将 `FormData` 转换为 JSON 对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| formData | `FormData` | 是 | FormData 实例 |

**返回值：** `Record<string, any>`

**示例：**

::: code-group
```ts [TypeScript]
import { objFromFormData } from 'l-js-fn';

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	objFromFormData(formData);
	// { name: 'John', age: 20 }
```

```js [JavaScript (ESM)]
import { objFromFormData } from 'l-js-fn';

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	objFromFormData(formData);
	// { name: 'John', age: 20 }
```

```js [JavaScript (CJS)]
const { objFromFormData } = require('l-js-fn');

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	objFromFormData(formData);
	// { name: 'John', age: 20 }
```
:::

## 6. objPick 选取指定属性
从对象中选取指定属性，返回新对象。

::: code-group
```ts [TypeScript]
import { objPick } from 'l-js-fn';

objPick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```

```js [JavaScript (ESM)]
import { objPick } from 'l-js-fn';

objPick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```

```js [JavaScript (CJS)]
const { objPick } = require('l-js-fn');

objPick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```
:::

## 7. objOmit 排除指定属性
排除对象中指定 key 的属性，返回一个新对象（objPick 的反操作）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 源对象 |
| keys | `Array<keyof T>` | 是 | 需要排除的键名数组 |

**返回值：** `Omit<T, K>` — 排除后的新对象

**示例：**

::: code-group
```ts [TypeScript]
import { objOmit } from 'l-js-fn';

objOmit({ a: 1, b: 2, c: 3 }, ['b']);    // { a: 1, c: 3 }
objOmit({ a: 1, b: 2 }, []);              // { a: 1, b: 2 }
```

```js [JavaScript (ESM)]
import { objOmit } from 'l-js-fn';

objOmit({ a: 1, b: 2, c: 3 }, ['b']);    // { a: 1, c: 3 }
```

```js [JavaScript (CJS)]
const { objOmit } = require('l-js-fn');

objOmit({ a: 1, b: 2, c: 3 }, ['b']);    // { a: 1, c: 3 }
```
:::

## 8. objGet 安全深层取值
安全获取对象深层属性值。

::: code-group
```ts [TypeScript]
import { objGet } from 'l-js-fn';

const obj = { a: { b: { c: 1 } } };
objGet(obj, 'a.b.c');           // 1
objGet(obj, 'a.b.d', 'default'); // 'default'
objGet({ list: [1, 2, 3] }, 'list[1]'); // 2
```

```js [JavaScript (ESM)]
import { objGet } from 'l-js-fn';

const obj = { a: { b: { c: 1 } } };
objGet(obj, 'a.b.c');           // 1
objGet(obj, 'a.b.d', 'default'); // 'default'
objGet({ list: [1, 2, 3] }, 'list[1]'); // 2
```

```js [JavaScript (CJS)]
const { objGet } = require('l-js-fn');

const obj = { a: { b: { c: 1 } } };
objGet(obj, 'a.b.c');           // 1
objGet(obj, 'a.b.d', 'default'); // 'default'
objGet({ list: [1, 2, 3] }, 'list[1]'); // 2
```
:::

> [!WARNING] v4.0 破坏性变更
> 原 `deepMerge` 已合并到 `objMerge`（objMerge 本身就是深度合并），`deepMerge` 不再导出。
> 多个对象合并请链式调用：`objMerge(objMerge(a, b), c)`。
