# array-kit — 数组操作

数组操作工具集，提供增删改查、分页、分组、随机抽样等常用功能。

## 1. arrayRemove 删除指定元素

从数组中移除指定元素，返回新数组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| target | `T` | 是 | 要删除的目标元素 |
| key | `keyof T \| null` | 否 | 对象数组的属性名（用于匹配对象） |

**返回值：** `T[]` — 新数组

**示例：**

::: code-group
```ts [TypeScript]
import { arrayRemove } from 'l-js-fn';

// 基本类型
arrayRemove([1, 2, 3, 2], 2); // [1, 3]

// 对象数组（通过 key 匹配）
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
arrayRemove(users, { id: 2, name: 'Bob' }, 'id');
// [{ id: 1, name: 'Alice' }]

// 对象数组（JSON 序列化匹配）
arrayRemove(users, { id: 1, name: 'Alice' });
// [{ id: 2, name: 'Bob' }]
```

```js [JavaScript (ESM)]
import { arrayRemove } from 'l-js-fn';

// 基本类型
arrayRemove([1, 2, 3, 2], 2); // [1, 3]

// 对象数组（通过 key 匹配）
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
arrayRemove(users, { id: 2, name: 'Bob' }, 'id');
// [{ id: 1, name: 'Alice' }]

// 对象数组（JSON 序列化匹配）
arrayRemove(users, { id: 1, name: 'Alice' });
// [{ id: 2, name: 'Bob' }]
```

```js [JavaScript (CJS)]
const { arrayRemove } = require('l-js-fn');

// 基本类型
arrayRemove([1, 2, 3, 2], 2); // [1, 3]

// 对象数组（通过 key 匹配）
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
arrayRemove(users, { id: 2, name: 'Bob' }, 'id');
// [{ id: 1, name: 'Alice' }]

// 对象数组（JSON 序列化匹配）
arrayRemove(users, { id: 1, name: 'Alice' });
// [{ id: 2, name: 'Bob' }]
```
:::

## 2. arrayRemoveAt 根据索引删除

根据索引删除数组元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| index | `number` | 是 | 要删除的索引（从 0 开始） |

**返回值：** `T[]` — 新数组；索引无效时返回原数组副本

**示例：**

::: code-group
```ts [TypeScript]
import { arrayRemoveAt } from 'l-js-fn';

arrayRemoveAt([1, 2, 3], 1);   // [1, 3]
arrayRemoveAt([1, 2, 3], 0);   // [2, 3]
arrayRemoveAt([1, 2, 3], -1);  // [1, 2, 3]（无效索引）
```

```js [JavaScript (ESM)]
import { arrayRemoveAt } from 'l-js-fn';

arrayRemoveAt([1, 2, 3], 1);   // [1, 3]
arrayRemoveAt([1, 2, 3], 0);   // [2, 3]
arrayRemoveAt([1, 2, 3], -1);  // [1, 2, 3]（无效索引）
```

```js [JavaScript (CJS)]
const { arrayRemoveAt } = require('l-js-fn');

arrayRemoveAt([1, 2, 3], 1);   // [1, 3]
arrayRemoveAt([1, 2, 3], 0);   // [2, 3]
arrayRemoveAt([1, 2, 3], -1);  // [1, 2, 3]（无效索引）
```
:::

## 4. arrayRemoveBy 根据条件删除

根据条件函数删除数组元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| fn | `(item, index, array) => boolean` | 是 | 判断函数，返回 `true` 表示删除该元素 |

**返回值：** `T[]` — 新数组

**示例：**

::: code-group
```ts [TypeScript]
import { arrayRemoveBy } from 'l-js-fn';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 2, name: 'David' }
];
arrayRemoveBy(users, user => user.id === 2);
// [{ id: 1, name: 'Alice' }]
```

```js [JavaScript (ESM)]
import { arrayRemoveBy } from 'l-js-fn';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 2, name: 'David' }
];
arrayRemoveBy(users, user => user.id === 2);
// [{ id: 1, name: 'Alice' }]
```

```js [JavaScript (CJS)]
const { arrayRemoveBy } = require('l-js-fn');

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 2, name: 'David' }
];
arrayRemoveBy(users, user => user.id === 2);
// [{ id: 1, name: 'Alice' }]
```
:::

::: tip 提示
`arrayRemoveBy(users, user => user.id === 2)` 等价于旧版 `arrayDelToKey(users, 'id', 2)`。
:::

## 5. arrayFill 补充到指定长度

补充数组到指定长度。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| originArr | `T[]` | 是 | 原数组 |
| num | `number` | 是 | 目标长度（非负整数） |
| obj | `T` | 是 | 填充的元素 |

**返回值：** `T[]` — 新数组

> [!NOTE] v4.0 变更
> 参数非法（非数组、`num` 非非负整数）不再抛错，返回空数组或原数组拷贝。

**示例：**

::: code-group
```ts [TypeScript]
import { arrayFill } from 'l-js-fn';

arrayFill([1, 2], 5, 0);      // [1, 2, 0, 0, 0]
arrayFill(['a'], 3, null);    // ['a', null, null]
arrayFill([1, 2, 3], 2, 0);   // [1, 2, 3]（长度已满足）
```

```js [JavaScript (ESM)]
import { arrayFill } from 'l-js-fn';

arrayFill([1, 2], 5, 0);      // [1, 2, 0, 0, 0]
arrayFill(['a'], 3, null);    // ['a', null, null]
arrayFill([1, 2, 3], 2, 0);   // [1, 2, 3]（长度已满足）
```

```js [JavaScript (CJS)]
const { arrayFill } = require('l-js-fn');

arrayFill([1, 2], 5, 0);      // [1, 2, 0, 0, 0]
arrayFill(['a'], 3, null);    // ['a', null, null]
arrayFill([1, 2, 3], 2, 0);   // [1, 2, 3]（长度已满足）
```
:::

## 6. arrayUnique 数组去重

数组去重（使用 `Set`，保留顺序）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |

**返回值：** `T[]` — 去重后的数组

**示例：**

::: code-group
```ts [TypeScript]
import { arrayUnique } from 'l-js-fn';

arrayUnique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
arrayUnique(['a', 'b', 'a']);    // ['a', 'b']
```

```js [JavaScript (ESM)]
import { arrayUnique } from 'l-js-fn';

arrayUnique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
arrayUnique(['a', 'b', 'a']);    // ['a', 'b']
```

```js [JavaScript (CJS)]
const { arrayUnique } = require('l-js-fn');

arrayUnique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
arrayUnique(['a', 'b', 'a']);    // ['a', 'b']
```
:::

## 7. arrayPaginate 数组分页

数组分页。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| page | `number` | 是 | 当前页码（从 1 开始） |
| size | `number` | 是 | 每页条数 |

**返回值：** `T[]` — 当前页数据；参数非法时返回 `[]`

**示例：**

::: code-group
```ts [TypeScript]
import { arrayPaginate } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

arrayPaginate(arr, 1, 3); // [1, 2, 3]
arrayPaginate(arr, 2, 3); // [4, 5, 6]
arrayPaginate(arr, 4, 3); // [10]
arrayPaginate(arr, 5, 3); // []（超出范围）
```

```js [JavaScript (ESM)]
import { arrayPaginate } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

arrayPaginate(arr, 1, 3); // [1, 2, 3]
arrayPaginate(arr, 2, 3); // [4, 5, 6]
arrayPaginate(arr, 4, 3); // [10]
arrayPaginate(arr, 5, 3); // []（超出范围）
```

```js [JavaScript (CJS)]
const { arrayPaginate } = require('l-js-fn');

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

arrayPaginate(arr, 1, 3); // [1, 2, 3]
arrayPaginate(arr, 2, 3); // [4, 5, 6]
arrayPaginate(arr, 4, 3); // [10]
arrayPaginate(arr, 5, 3); // []（超出范围）
```
:::

## 8. arraySplitToGroups 按大小分组

将数组按指定大小分组，返回对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |
| groupSize | `number` | 否 | 每组大小，默认 `10` |

**返回值：** `Record<number, T[]>` — 键为组号（从 1 开始），值为数组

> [!NOTE] v4.0 变更
> 参数非法（非数组、`groupSize` 无效）不再抛错，返回空对象。

**示例：**

::: code-group
```ts [TypeScript]
import { arraySplitToGroups } from 'l-js-fn';

arraySplitToGroups([1, 2, 3, 4, 5], 2);
// { 1: [1, 2], 2: [3, 4], 3: [5] }

arraySplitToGroups([1, 2, 3, 4, 5, 6], 3);
// { 1: [1, 2, 3], 2: [4, 5, 6] }
```

```js [JavaScript (ESM)]
import { arraySplitToGroups } from 'l-js-fn';

arraySplitToGroups([1, 2, 3, 4, 5], 2);
// { 1: [1, 2], 2: [3, 4], 3: [5] }

arraySplitToGroups([1, 2, 3, 4, 5, 6], 3);
// { 1: [1, 2, 3], 2: [4, 5, 6] }
```

```js [JavaScript (CJS)]
const { arraySplitToGroups } = require('l-js-fn');

arraySplitToGroups([1, 2, 3, 4, 5], 2);
// { 1: [1, 2], 2: [3, 4], 3: [5] }

arraySplitToGroups([1, 2, 3, 4, 5, 6], 3);
// { 1: [1, 2, 3], 2: [4, 5, 6] }
```
:::

> [!WARNING] v4.0 破坏性变更
> `findIndex` 已在 v4.0 移除 —— 它只是 `Array.prototype.findIndex` 的薄封装，请直接使用原生方法：
> ```ts
> const index = users.findIndex(user => user.name === 'Bob'); // 1
> ```

## 10. arrayMove 移动元素位置

移动数组元素位置。

> [!WARNING] v4.0 破坏性变更
> v4.0 起返回值由 `Result<T[]>` 改为**纯数组 `T[]`**。无法移动时（索引越界、已到边界、非法操作）返回原数组的拷贝，不再返回失败对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| index | `number` | 是 | 要移动的元素索引 |
| action | `MoveAction` | 否 | 移动类型：`'up'`、`'down'`、`'top'`、`'bottom'`，默认 `'up'` |

**返回值：** `T[]` — 移动后的新数组

**示例：**

::: code-group
```ts [TypeScript]
import { arrayMove } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5];

arrayMove(arr, 2, 'up');     // [1, 3, 2, 4, 5]
arrayMove(arr, 2, 'down');   // [1, 2, 4, 3, 5]
arrayMove(arr, 4, 'top');    // [5, 1, 2, 3, 4]
arrayMove(arr, 0, 'bottom'); // [2, 3, 4, 5, 1]
arrayMove(arr, 0, 'up');     // [1, 2, 3, 4, 5]（已到边界，返回拷贝）
```

```js [JavaScript (ESM)]
import { arrayMove } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5];

arrayMove(arr, 2, 'up');     // [1, 3, 2, 4, 5]
arrayMove(arr, 2, 'down');   // [1, 2, 4, 3, 5]
arrayMove(arr, 4, 'top');    // [5, 1, 2, 3, 4]
arrayMove(arr, 0, 'bottom'); // [2, 3, 4, 5, 1]
arrayMove(arr, 0, 'up');     // [1, 2, 3, 4, 5]（已到边界，返回拷贝）
```

```js [JavaScript (CJS)]
const { arrayMove } = require('l-js-fn');

const arr = [1, 2, 3, 4, 5];

arrayMove(arr, 2, 'up');     // [1, 3, 2, 4, 5]
arrayMove(arr, 2, 'down');   // [1, 2, 4, 3, 5]
arrayMove(arr, 4, 'top');    // [5, 1, 2, 3, 4]
arrayMove(arr, 0, 'bottom'); // [2, 3, 4, 5, 1]
arrayMove(arr, 0, 'up');     // [1, 2, 3, 4, 5]（已到边界，返回拷贝）
```
:::

## 11. arrayGroupBy 按字段分组

按字段对数组对象进行分组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 对象数组 |
| key | `string` | 是 | 分组依据的键名（支持嵌套路径，如 `'user.id'`） |

**返回值：** `Record<string, T[]>` — 分组后的对象

> [!NOTE] v4.0 变更
> 参数非法（非数组）不再抛错，返回空对象。

**示例：**

::: code-group
```ts [TypeScript]
import { arrayGroupBy } from 'l-js-fn';

const users = [
  { name: 'Alice', age: 20, city: 'Beijing' },
  { name: 'Bob', age: 25, city: 'Shanghai' },
  { name: 'Charlie', age: 20, city: 'Beijing' }
];

arrayGroupBy(users, 'age');
// { 20: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], 25: [{ name: 'Bob', ... }] }

arrayGroupBy(users, 'city');
// { Beijing: [...], Shanghai: [...] }
```

```js [JavaScript (ESM)]
import { arrayGroupBy } from 'l-js-fn';

const users = [
  { name: 'Alice', age: 20, city: 'Beijing' },
  { name: 'Bob', age: 25, city: 'Shanghai' },
  { name: 'Charlie', age: 20, city: 'Beijing' }
];

arrayGroupBy(users, 'age');
// { 20: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], 25: [{ name: 'Bob', ... }] }

arrayGroupBy(users, 'city');
// { Beijing: [...], Shanghai: [...] }
```

```js [JavaScript (CJS)]
const { arrayGroupBy } = require('l-js-fn');

const users = [
  { name: 'Alice', age: 20, city: 'Beijing' },
  { name: 'Bob', age: 25, city: 'Shanghai' },
  { name: 'Charlie', age: 20, city: 'Beijing' }
];

arrayGroupBy(users, 'age');
// { 20: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], 25: [{ name: 'Bob', ... }] }

arrayGroupBy(users, 'city');
// { Beijing: [...], Shanghai: [...] }
```
:::

## 12. arraySample 随机取一个元素

随机获取数组中的一个元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |

**返回值：** `T \| undefined` — 随机元素；空数组返回 `undefined`

**示例：**

::: code-group
```ts [TypeScript]
import { arraySample } from 'l-js-fn';

const colors = ['red', 'green', 'blue'];
arraySample(colors); // 'blue'（随机）
arraySample([]);     // undefined
```

```js [JavaScript (ESM)]
import { arraySample } from 'l-js-fn';

const colors = ['red', 'green', 'blue'];
arraySample(colors); // 'blue'（随机）
arraySample([]);     // undefined
```

```js [JavaScript (CJS)]
const { arraySample } = require('l-js-fn');

const colors = ['red', 'green', 'blue'];
arraySample(colors); // 'blue'（随机）
arraySample([]);     // undefined
```
:::

## 13. arraySampleSize 随机取N个元素

随机获取数组中的 `n` 个不重复元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |
| n | `number` | 否 | 获取数量，默认 `1` |

**返回值：** `T[]` — 随机元素数组；`n` 大于数组长度时返回全部乱序

**示例：**

::: code-group
```ts [TypeScript]
import { arraySampleSize } from 'l-js-fn';

const numbers = [1, 2, 3, 4, 5];

arraySampleSize(numbers, 2);   // [3, 1]（随机，不重复）
arraySampleSize(numbers, 10);  // [2, 5, 1, 4, 3]（全部乱序）
arraySampleSize(numbers);      // [4]（默认 n=1）
arraySampleSize(numbers, 0);   // []（n=0 返回空数组）
```

```js [JavaScript (ESM)]
import { arraySampleSize } from 'l-js-fn';

const numbers = [1, 2, 3, 4, 5];

arraySampleSize(numbers, 2);   // [3, 1]（随机，不重复）
arraySampleSize(numbers, 10);  // [2, 5, 1, 4, 3]（全部乱序）
arraySampleSize(numbers);      // [4]（默认 n=1）
arraySampleSize(numbers, 0);   // []（n=0 返回空数组）
```

```js [JavaScript (CJS)]
const { arraySampleSize } = require('l-js-fn');

const numbers = [1, 2, 3, 4, 5];

arraySampleSize(numbers, 2);   // [3, 1]（随机，不重复）
arraySampleSize(numbers, 10);  // [2, 5, 1, 4, 3]（全部乱序）
arraySampleSize(numbers);      // [4]（默认 n=1）
arraySampleSize(numbers, 0);   // []（n=0 返回空数组）
```
:::

## 14. arrayFlatten 数组扁平化

数组扁平化，支持指定展开深度。

::: code-group
```ts [TypeScript]
import { arrayFlatten } from 'l-js-fn';

arrayFlatten([1, [2, [3, 4]], 5]);    // [1, 2, 3, 4, 5]
arrayFlatten([1, [2, [3, 4]], 5], 1); // [1, 2, [3, 4], 5]
```

```js [JavaScript (ESM)]
import { arrayFlatten } from 'l-js-fn';

arrayFlatten([1, [2, [3, 4]], 5]);    // [1, 2, 3, 4, 5]
arrayFlatten([1, [2, [3, 4]], 5], 1); // [1, 2, [3, 4], 5]
```

```js [JavaScript (CJS)]
const { arrayFlatten } = require('l-js-fn');

arrayFlatten([1, [2, [3, 4]], 5]);    // [1, 2, 3, 4, 5]
arrayFlatten([1, [2, [3, 4]], 5], 1); // [1, 2, [3, 4], 5]
```
:::

## 15. arrayRange 生成数字范围

生成数字范围数组。

::: code-group
```ts [TypeScript]
import { arrayRange } from 'l-js-fn';

arrayRange(0, 5);       // [0, 1, 2, 3, 4, 5]
arrayRange(5, 0, -1);   // [5, 4, 3, 2, 1, 0]
arrayRange(0, 10, 2);   // [0, 2, 4, 6, 8, 10]
```

```js [JavaScript (ESM)]
import { arrayRange } from 'l-js-fn';

arrayRange(0, 5);       // [0, 1, 2, 3, 4, 5]
arrayRange(5, 0, -1);   // [5, 4, 3, 2, 1, 0]
arrayRange(0, 10, 2);   // [0, 2, 4, 6, 8, 10]
```

```js [JavaScript (CJS)]
const { arrayRange } = require('l-js-fn');

arrayRange(0, 5);       // [0, 1, 2, 3, 4, 5]
arrayRange(5, 0, -1);   // [5, 4, 3, 2, 1, 0]
arrayRange(0, 10, 2);   // [0, 2, 4, 6, 8, 10]
```
:::

## 16. arrayShuffle 洗牌打乱

Fisher-Yates 洗牌算法打乱数组。

::: code-group
```ts [TypeScript]
import { arrayShuffle } from 'l-js-fn';

arrayShuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]（随机）
```

```js [JavaScript (ESM)]
import { arrayShuffle } from 'l-js-fn';

arrayShuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]（随机）
```

```js [JavaScript (CJS)]
const { arrayShuffle } = require('l-js-fn');

arrayShuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]（随机）
```
:::

## 17. arrayUniqueBy 按字段去重

根据对象数组中指定字段的值去重。

::: code-group
```ts [TypeScript]
import { arrayUniqueBy } from 'l-js-fn';

const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
arrayUniqueBy(arr, 'id'); // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
```

```js [JavaScript (ESM)]
import { arrayUniqueBy } from 'l-js-fn';

const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
arrayUniqueBy(arr, 'id'); // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
```

```js [JavaScript (CJS)]
const { arrayUniqueBy } = require('l-js-fn');

const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
arrayUniqueBy(arr, 'id'); // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
```
:::

## 18. arrayCompact 过滤falsy值

过滤数组中的 falsy 值。

::: code-group
```ts [TypeScript]
import { arrayCompact } from 'l-js-fn';

arrayCompact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
```

```js [JavaScript (ESM)]
import { arrayCompact } from 'l-js-fn';

arrayCompact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
```

```js [JavaScript (CJS)]
const { arrayCompact } = require('l-js-fn');

arrayCompact([0, 1, false, 2, '', 3, null, undefined, NaN]); // [1, 2, 3]
```
:::

## 19. arraySum 数组求和

计算数组元素总和。

::: code-group
```ts [TypeScript]
import { arraySum } from 'l-js-fn';

arraySum([1, 2, 3, 4, 5]); // 15
```

```js [JavaScript (ESM)]
import { arraySum } from 'l-js-fn';

arraySum([1, 2, 3, 4, 5]); // 15
```

```js [JavaScript (CJS)]
const { arraySum } = require('l-js-fn');

arraySum([1, 2, 3, 4, 5]); // 15
```
:::

## 20. arrayLast 获取最后元素

获取数组最后一个元素。

::: code-group
```ts [TypeScript]
import { arrayLast } from 'l-js-fn';

arrayLast([1, 2, 3]); // 3
arrayLast([]);        // undefined
```

```js [JavaScript (ESM)]
import { arrayLast } from 'l-js-fn';

arrayLast([1, 2, 3]); // 3
arrayLast([]);        // undefined
```

```js [JavaScript (CJS)]
const { arrayLast } = require('l-js-fn');

arrayLast([1, 2, 3]); // 3
arrayLast([]);        // undefined
```
:::

## 21. arrayPluck 提取指定字段

递归提取对象数组中指定字段的值，返回扁平数组（自动过滤 `null` 和 `undefined`）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 对象数组（支持深层嵌套） |
| key | `keyof T` | 是 | 要提取的字段名 |

**返回值：** `T[keyof T][]` — 字段值组成的数组，非数组或空数组返回 `[]`

**示例：**

::: code-group
```ts [TypeScript]
import { arrayPluck } from 'l-js-fn';

arrayPluck([{ name: 'zz' }, { name: 'yy' }], 'name'); // ['zz', 'yy']
arrayPluck([{ id: 1 }, { id: 2 }], 'id'); // [1, 2]

// 深层嵌套对象
arrayPluck(
  [{ name: 'zz', children: [{ name: 'yy' }, { name: null }] }, { name: 'xx' }],
  'name'
); // ['zz', 'yy', 'xx']

// 空数组
arrayPluck([], 'name'); // []
```

```js [JavaScript (ESM)]
import { arrayPluck } from 'l-js-fn';

arrayPluck([{ name: 'zz' }, { name: 'yy' }], 'name'); // ['zz', 'yy']
arrayPluck([{ id: 1 }, { id: 2 }], 'id'); // [1, 2]

// 深层嵌套对象
arrayPluck(
  [{ name: 'zz', children: [{ name: 'yy' }, { name: null }] }, { name: 'xx' }],
  'name'
); // ['zz', 'yy', 'xx']

arrayPluck([], 'name'); // []
```

```js [JavaScript (CJS)]
const { arrayPluck } = require('l-js-fn');

arrayPluck([{ name: 'zz' }, { name: 'yy' }], 'name'); // ['zz', 'yy']
arrayPluck([{ id: 1 }, { id: 2 }], 'id'); // [1, 2]

// 深层嵌套对象
arrayPluck(
  [{ name: 'zz', children: [{ name: 'yy' }, { name: null }] }, { name: 'xx' }],
  'name'
); // ['zz', 'yy', 'xx']

arrayPluck([], 'name'); // []
```
:::

## 22. arraySortBy 按字段排序

根据指定字段对对象数组排序（不修改原数组）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 对象数组 |
| key | `keyof T` | 是 | 排序字段 |
| order | `'asc' \| 'desc'` | 否 | 排序方向，默认 `'asc'` |

**返回值：** `T[]` — 排序后的新数组

**示例：**

::: code-group
```ts [TypeScript]
import { arraySortBy } from 'l-js-fn';

arraySortBy([{ id: 2 }, { id: 1 }], 'id');                     // [{ id: 1 }, { id: 2 }]
arraySortBy([{ age: 20 }, { age: 30 }], 'age', 'desc');        // [{ age: 30 }, { age: 20 }]
arraySortBy([{ name: 'c' }, { name: 'a' }], 'name');           // [{ name: 'a' }, { name: 'c' }]
```

```js [JavaScript (ESM)]
import { arraySortBy } from 'l-js-fn';

arraySortBy([{ id: 2 }, { id: 1 }], 'id');                     // [{ id: 1 }, { id: 2 }]
```

```js [JavaScript (CJS)]
const { arraySortBy } = require('l-js-fn');

arraySortBy([{ id: 2 }, { id: 1 }], 'id');                     // [{ id: 1 }, { id: 2 }]
```
:::

> [!WARNING] v4.0 破坏性变更
> `uniq` 已在 v4.0 移除 —— 请统一使用 `arrayUnique` 去重（两者行为一致，均基于 Set 实现）。

## 24. arraySumBy 按字段求和

计算对象数组中指定字段数值的总和。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 对象数组 |
| key | `keyof T` | 是 | 需要求和的数字字段名 |

**返回值：** `number` — 总和，空数组返回 `0`

**示例：**

::: code-group
```ts [TypeScript]
import { arraySumBy } from 'l-js-fn';

const items = [{ name: 'a', price: 10 }, { name: 'b', price: 20 }];
arraySumBy(items, 'price'); // 30
```

```js [JavaScript (ESM)]
import { arraySumBy } from 'l-js-fn';

const items = [{ name: 'a', price: 10 }, { name: 'b', price: 20 }];
arraySumBy(items, 'price'); // 30
```

```js [JavaScript (CJS)]
const { arraySumBy } = require('l-js-fn');

const items = [{ name: 'a', price: 10 }, { name: 'b', price: 20 }];
arraySumBy(items, 'price'); // 30
```
:::

## 25. arrayToString 过滤空值后拼接字符串

过滤掉数组中的空值（`null`、`undefined`、空字符串 `''`）后，按顺序拼接为字符串。常用于签名串拼接、多字段值合并等场景。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 需要处理的数组 |
| separator | `string` | 否 | 分隔符，默认为空字符串 `''`，与 `join` 的语义一致 |

**返回值：** `string` — 拼接后的字符串；非数组或空数组返回 `''`

**说明：** 仅过滤 `null`、`undefined`、`''` 三种空值，保留 `0`、`false` 等值

**示例：**

::: code-group
```ts [TypeScript]
import { arrayToString } from 'l-js-fn';

arrayToString(['a', null, 'b', '', 'c']);            // 'abc'
arrayToString([1, 0, false, null, '', 2]);           // '10false2'
arrayToString(['a', 'b', 'c'], '&');                 // 'a&b&c'

// 典型场景：签名串拼接
const signStr = arrayToString([
  form.username,
  form.password,
  form.phone,
]);
```

```js [JavaScript (ESM)]
import { arrayToString } from 'l-js-fn';

arrayToString(['a', null, 'b', '', 'c']);  // 'abc'
arrayToString(['a', 'b', 'c'], '&');       // 'a&b&c'
```

```js [JavaScript (CJS)]
const { arrayToString } = require('l-js-fn');

arrayToString(['a', null, 'b', '', 'c']);  // 'abc'
arrayToString(['a', 'b', 'c'], '&');       // 'a&b&c'
```
:::
