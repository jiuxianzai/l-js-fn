# object-kit — 对象操作

对象操作工具集，提供合并、过滤、转换等常用功能。

## objMerge 合并两个对象

合并两个对象，递归合并嵌套对象，数组会直接复制。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| target | `T` | 是 | 目标对象（会被修改） |
| source | `S` | 是 | 源对象 |
| mergeType | `string` | 否 | 合并类型：`'hard'`（硬合并，包含两者所有属性）、`'soft'`（软合并，只包含 target 的属性），默认 `'hard'` |

**返回值：** `T & S` — 合并后的对象

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

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }
```

```js [JavaScript (ESM)]
import { objMerge } from 'l-js-fn';

// 基本合并
objMerge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 递归合并嵌套对象
objMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }
```

```js [JavaScript (CJS)]
const { objMerge } = require('l-js-fn');

// 基本合并
objMerge({ a: 1 }, { b: 2 });
// { a: 1, b: 2 }

// 递归合并嵌套对象
objMerge({ a: { x: 1 } }, { a: { y: 2 } });
// { a: { x: 1, y: 2 } }

// 软合并（只保留 target 的属性）
objMerge({ a: 1, b: 2 }, { b: 3, c: 4 }, 'soft');
// { a: 1, b: 3 }
```
:::

## objFilterProp 过滤指定属性

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

## objFilterNull 过滤空值

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

## isHasProperties 判断属性存在

判断对象是否存在指定属性。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `Record<string, any>` | 是 | 对象 |
| key | `string` | 是 | 属性键 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isHasProperties } from 'l-js-fn';

isHasProperties({ a: 1, b: 2 }, 'a'); // true
isHasProperties({ a: 1, b: 2 }, 'c'); // false
```

```js [JavaScript (ESM)]
import { isHasProperties } from 'l-js-fn';

isHasProperties({ a: 1, b: 2 }, 'a'); // true
isHasProperties({ a: 1, b: 2 }, 'c'); // false
```

```js [JavaScript (CJS)]
const { isHasProperties } = require('l-js-fn');

isHasProperties({ a: 1, b: 2 }, 'a'); // true
isHasProperties({ a: 1, b: 2 }, 'c'); // false
```
:::

## jsonToFormData JSON转FormData

将 JSON 对象转换为 `FormData`。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | `Record<string, any>` | 是 | JSON 数据对象 |
| formData | `FormData` | 否 | 已有 FormData 实例（用于递归） |
| parentKey | `string` | 否 | 父级键名前缀 |

**返回值：** `FormData`

**异常：** 参数非法时抛出 `TypeError`

**示例：**

::: code-group
```ts [TypeScript]
import { jsonToFormData } from 'l-js-fn';

const data = { name: 'John', age: 20 };
const formData = jsonToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = jsonToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```

```js [JavaScript (ESM)]
import { jsonToFormData } from 'l-js-fn';

const data = { name: 'John', age: 20 };
const formData = jsonToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = jsonToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```

```js [JavaScript (CJS)]
const { jsonToFormData } = require('l-js-fn');

const data = { name: 'John', age: 20 };
const formData = jsonToFormData(data);
// FormData { name: 'John', age: '20' }

// 嵌套对象
const nested = { user: { name: 'John', age: 20 } };
const formData2 = jsonToFormData(nested);
// FormData { 'user[name]': 'John', 'user[age]': '20' }
```
:::

## formDataToObject FormData转对象

将 `FormData` 转换为 JSON 对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| formData | `FormData` | 是 | FormData 实例 |

**返回值：** `Record<string, any>`

**示例：**

::: code-group
```ts [TypeScript]
import { formDataToObject } from 'l-js-fn';

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	formDataToObject(formData);
	// { name: 'John', age: 20 }
```

```js [JavaScript (ESM)]
import { formDataToObject } from 'l-js-fn';

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	formDataToObject(formData);
	// { name: 'John', age: 20 }
```

```js [JavaScript (CJS)]
const { formDataToObject } = require('l-js-fn');

const formData = new FormData();
formData.append('name', 'John');
formData.append('age', '20');

	formDataToObject(formData);
	// { name: 'John', age: 20 }
```
:::

## pick 选取指定属性

从对象中选取指定属性，返回新对象。

::: code-group
```ts [TypeScript]
import { pick } from 'l-js-fn';

pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```

```js [JavaScript (ESM)]
import { pick } from 'l-js-fn';

pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```

```js [JavaScript (CJS)]
const { pick } = require('l-js-fn');

pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }
```
:::

## get 安全深层取值

安全获取对象深层属性值。

::: code-group
```ts [TypeScript]
import { get } from 'l-js-fn';

const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c');           // 1
get(obj, 'a.b.d', 'default'); // 'default'
get({ list: [1, 2, 3] }, 'list[1]'); // 2
```

```js [JavaScript (ESM)]
import { get } from 'l-js-fn';

const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c');           // 1
get(obj, 'a.b.d', 'default'); // 'default'
get({ list: [1, 2, 3] }, 'list[1]'); // 2
```

```js [JavaScript (CJS)]
const { get } = require('l-js-fn');

const obj = { a: { b: { c: 1 } } };
get(obj, 'a.b.c');           // 1
get(obj, 'a.b.d', 'default'); // 'default'
get({ list: [1, 2, 3] }, 'list[1]'); // 2
```
:::

## deepMerge 深度合并对象

深度合并多个对象。

::: code-group
```ts [TypeScript]
import { deepMerge } from 'l-js-fn';

deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
// { a: 1, b: 2, c: 3 }
```

```js [JavaScript (ESM)]
import { deepMerge } from 'l-js-fn';

deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
// { a: 1, b: 2, c: 3 }
```

```js [JavaScript (CJS)]
const { deepMerge } = require('l-js-fn');

deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }

deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
// { a: 1, b: 2, c: 3 }
```
:::
