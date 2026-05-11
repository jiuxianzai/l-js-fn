# array-kit — 数组操作

数组操作工具集，提供增删改查、分页、分组、随机抽样等常用功能。

## arrayDelEl

从数组中移除指定元素，返回新数组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| target | `T` | 是 | 要删除的目标元素 |
| key | `keyof T \| null` | 否 | 对象数组的属性名（用于匹配对象） |

**返回值：** `T[]` — 新数组

**示例：**

```typescript
import { arrayDelEl } from 'l-js-fn';

// 基本类型
arrayDelEl([1, 2, 3, 2], 2); // [1, 3]

// 对象数组（通过 key 匹配）
const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
arrayDelEl(users, { id: 2, name: 'Bob' }, 'id');
// [{ id: 1, name: 'Alice' }]

// 对象数组（JSON 序列化匹配）
arrayDelEl(users, { id: 1, name: 'Alice' });
// [{ id: 2, name: 'Bob' }]
```

## arrayDelToIndex

根据索引删除数组元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| index | `number` | 是 | 要删除的索引（从 0 开始） |

**返回值：** `T[]` — 新数组；索引无效时返回原数组副本

**示例：**

```typescript
import { arrayDelToIndex } from 'l-js-fn';

arrayDelToIndex([1, 2, 3], 1);   // [1, 3]
arrayDelToIndex([1, 2, 3], 0);   // [2, 3]
arrayDelToIndex([1, 2, 3], -1);  // [1, 2, 3]（无效索引）
```

## arrayDelToEl

根据基本类型元素删除数组元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| el | `T` | 是 | 要删除的元素 |

**返回值：** `T[]` — 新数组

**示例：**

```typescript
import { arrayDelToEl } from 'l-js-fn';

arrayDelToEl([1, 2, 3, 2], 2);           // [1, 3]
arrayDelToEl(['a', 'b', 'a'], 'a');      // ['b']
arrayDelToEl([true, false, true], true); // [false]
```

## arrayDelToKey

根据对象数组的键值对删除元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| key | `keyof T` | 是 | 对象的键 |
| value | `any` | 是 | 要匹配删除的值 |

**返回值：** `T[]` — 新数组

**示例：**

```typescript
import { arrayDelToKey } from 'l-js-fn';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 2, name: 'David' }
];
arrayDelToKey(users, 'id', 2);
// [{ id: 1, name: 'Alice' }]
```

## arrayFill

补充数组到指定长度。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| originArr | `T[]` | 是 | 原数组 |
| num | `number` | 是 | 目标长度（非负整数） |
| obj | `T` | 是 | 填充的元素 |

**返回值：** `T[]` — 新数组

**异常：** 参数非法时抛出 `Error`

**示例：**

```typescript
import { arrayFill } from 'l-js-fn';

arrayFill([1, 2], 5, 0);      // [1, 2, 0, 0, 0]
arrayFill(['a'], 3, null);    // ['a', null, null]
arrayFill([1, 2, 3], 2, 0);   // [1, 2, 3]（长度已满足）
```

## arrayUnique

数组去重（使用 `Set`，保留顺序）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |

**返回值：** `T[]` — 去重后的数组

**示例：**

```typescript
import { arrayUnique } from 'l-js-fn';

arrayUnique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
arrayUnique(['a', 'b', 'a']);    // ['a', 'b']
```

## arrayPaginate

数组分页。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| arr | `T[]` | 是 | 原数组 |
| page | `number` | 是 | 当前页码（从 1 开始） |
| size | `number` | 是 | 每页条数 |

**返回值：** `T[]` — 当前页数据；参数非法时返回 `[]`

**示例：**

```typescript
import { arrayPaginate } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

arrayPaginate(arr, 1, 3); // [1, 2, 3]
arrayPaginate(arr, 2, 3); // [4, 5, 6]
arrayPaginate(arr, 4, 3); // [10]
arrayPaginate(arr, 5, 3); // []（超出范围）
```

## arraySplitToGroups

将数组按指定大小分组，返回对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |
| groupSize | `number` | 否 | 每组大小，默认 `10` |

**返回值：** `Record<number, T[]>` — 键为组号（从 1 开始），值为数组

**异常：** 参数非法时抛出 `Error`

**示例：**

```typescript
import { arraySplitToGroups } from 'l-js-fn';

arraySplitToGroups([1, 2, 3, 4, 5], 2);
// { 1: [1, 2], 2: [3, 4], 3: [5] }

arraySplitToGroups([1, 2, 3, 4, 5, 6], 3);
// { 1: [1, 2, 3], 2: [4, 5, 6] }
```

## findIndex

查找数组元素的索引（兼容旧浏览器）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| ary | `T[]` | 是 | 查找的数组 |
| fn | `Function` | 是 | 判断函数，返回 `true` 表示找到 |

**返回值：** `number` — 找到的索引，未找到返回 `-1`

**示例：**

```typescript
import { findIndex } from 'l-js-fn';

const users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

findIndex(users, user => user.name === 'Bob'); // 1
findIndex([1, 2, 3], item => item === 5);      // -1
```

## moveElement

移动数组元素位置。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| list | `T[]` | 是 | 原数组 |
| idx | `number` | 是 | 要移动的元素索引 |
| action | `MoveAction` | 否 | 移动类型：`'up'`、`'down'`、`'top'`、`'bottom'`，默认 `'up'` |

**返回值：** `Result<T[]>` — 包含 `success`、`message`、`data` 的结果对象

**示例：**

```typescript
import { moveElement } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5];

moveElement(arr, 2, 'up');     // { success: true, data: [1, 3, 2, 4, 5] }
moveElement(arr, 2, 'down');   // { success: true, data: [1, 2, 4, 3, 5] }
moveElement(arr, 4, 'top');    // { success: true, data: [5, 1, 2, 3, 4] }
moveElement(arr, 0, 'bottom'); // { success: true, data: [2, 3, 4, 5, 1] }
moveElement(arr, 0, 'up');     // { success: false, message: '已经是第一个元素', data: [1, 2, 3, 4, 5] }
```

## groupBy

按字段对数组对象进行分组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 对象数组 |
| key | `string` | 是 | 分组依据的键名（支持嵌套路径，如 `'user.id'`） |

**返回值：** `Record<string, T[]>` — 分组后的对象

**异常：** 参数非法时抛出 `Error`

**示例：**

```typescript
import { groupBy } from 'l-js-fn';

const users = [
  { name: 'Alice', age: 20, city: 'Beijing' },
  { name: 'Bob', age: 25, city: 'Shanghai' },
  { name: 'Charlie', age: 20, city: 'Beijing' }
];

groupBy(users, 'age');
// { 20: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], 25: [{ name: 'Bob', ... }] }

groupBy(users, 'city');
// { Beijing: [...], Shanghai: [...] }
```

## sample

随机获取数组中的一个元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |

**返回值：** `T \| undefined` — 随机元素；空数组返回 `undefined`

**示例：**

```typescript
import { sample } from 'l-js-fn';

const colors = ['red', 'green', 'blue'];
sample(colors); // 'blue'（随机）
sample([]);     // undefined
```

## sampleSize

随机获取数组中的 `n` 个不重复元素。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| array | `T[]` | 是 | 原数组 |
| n | `number` | 否 | 获取数量，默认 `1` |

**返回值：** `T[]` — 随机元素数组；`n` 大于数组长度时返回全部乱序

**示例：**

```typescript
import { sampleSize } from 'l-js-fn';

const numbers = [1, 2, 3, 4, 5];

sampleSize(numbers, 2);   // [3, 1]（随机，不重复）
sampleSize(numbers, 10);  // [2, 5, 1, 4, 3]（全部乱序）
sampleSize(numbers);      // [4]（默认 n=1）
```
