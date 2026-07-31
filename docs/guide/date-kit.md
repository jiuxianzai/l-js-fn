# date-kit — 日期处理

日期处理工具集，提供格式化、计算、转换等常用功能。

## 1. dateFormat 日期格式化

将日期或时间戳格式化为指定格式的字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | `Date \| string \| number` | 否 | 输入，默认当前时间 |
| format | `string` | 否 | 输出格式，默认 `'yyyy-MM-dd HH:mm:ss'` |

**返回值：** `string` — 格式化后的日期字符串；无效输入返回 `''`

**支持的格式符：**

| 格式符 | 说明 |
|--------|------|
| `yyyy` | 四位年份 |
| `MM` | 月份（01-12） |
| `dd` | 日期（01-31） |
| `HH` | 小时（00-23） |
| `mm` | 分钟（00-59） |
| `ss` | 秒（00-59） |
| `SSS` | 毫秒（000-999） |
| `q` | 季度（1-4） |

**示例：**

::: code-group
```ts [TypeScript]
import { dateFormat } from 'l-js-fn';

dateFormat(new Date());                        // '2024-01-01 12:00:00'
dateFormat(new Date(), 'yyyy-MM-dd');          // '2024-01-01'
dateFormat(1704067200000);                     // '2024-01-01 00:00:00'
dateFormat('2024-01-01');                      // '2024-01-01 00:00:00'
dateFormat(null);                              // ''
```

```js [JavaScript (ESM)]
import { dateFormat } from 'l-js-fn';

dateFormat(new Date());                        // '2024-01-01 12:00:00'
dateFormat(new Date(), 'yyyy-MM-dd');          // '2024-01-01'
dateFormat(1704067200000);                     // '2024-01-01 00:00:00'
dateFormat('2024-01-01');                      // '2024-01-01 00:00:00'
dateFormat(null);                              // ''
```

```js [JavaScript (CJS)]
const { dateFormat } = require('l-js-fn');

dateFormat(new Date());                        // '2024-01-01 12:00:00'
dateFormat(new Date(), 'yyyy-MM-dd');          // '2024-01-01'
dateFormat(1704067200000);                     // '2024-01-01 00:00:00'
dateFormat('2024-01-01');                      // '2024-01-01 00:00:00'
dateFormat(null);                              // ''
```
:::

## 2. dateSecond 秒数转时间

将秒数转换为 `HH:mm:ss` 格式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `number` | 是 | 秒数 |

**返回值：** `string` — 格式化后的时间字符串

**示例：**

::: code-group
```ts [TypeScript]
import { dateSecond } from 'l-js-fn';

dateSecond(3661);   // '01:01:01'
dateSecond(59);     // '00:00:59'
dateSecond(86400);  // '24:00:00'
dateSecond(-1);     // '00:00:01'（负数取绝对值处理）
```

```js [JavaScript (ESM)]
import { dateSecond } from 'l-js-fn';

dateSecond(3661);   // '01:01:01'
dateSecond(59);     // '00:00:59'
dateSecond(86400);  // '24:00:00'
dateSecond(-1);     // '00:00:01'（负数取绝对值处理）
```

```js [JavaScript (CJS)]
const { dateSecond } = require('l-js-fn');

dateSecond(3661);   // '01:01:01'
dateSecond(59);     // '00:00:59'
dateSecond(86400);  // '24:00:00'
dateSecond(-1);     // '00:00:01'（负数取绝对值处理）
```
:::

## 3. diffDays 计算天数差

计算两个日期之间相差的天数（忽略时分秒）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date1 | `Date \| string \| number` | 是 | 第一个日期 |
| date2 | `Date \| string \| number` | 是 | 第二个日期 |

**返回值：** `number` — 相差的天数（非负数）

**示例：**

::: code-group
```ts [TypeScript]
import { diffDays } from 'l-js-fn';

diffDays('2024-01-01', '2024-01-03');          // 2
diffDays(new Date('2024-01-01'), new Date('2024-01-10')); // 9
```

```js [JavaScript (ESM)]
import { diffDays } from 'l-js-fn';

diffDays('2024-01-01', '2024-01-03');          // 2
diffDays(new Date('2024-01-01'), new Date('2024-01-10')); // 9
```

```js [JavaScript (CJS)]
const { diffDays } = require('l-js-fn');

diffDays('2024-01-01', '2024-01-03');          // 2
diffDays(new Date('2024-01-01'), new Date('2024-01-10')); // 9
```
:::

## 4. formatPassTime 相对时间格式化

格式化过去时间为相对时间字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| startTime | `string \| number \| Date` | 否 | 起始时间，默认当前时间 |

**返回值：** `string` — 相对时间描述

**示例：**

::: code-group
```ts [TypeScript]
import { formatPassTime } from 'l-js-fn';

formatPassTime('2020-01-01 12:12:12'); // '3年前'
formatPassTime(new Date());             // '刚刚'
formatPassTime(Date.now() - 60000);     // '1分钟前'
```

```js [JavaScript (ESM)]
import { formatPassTime } from 'l-js-fn';

formatPassTime('2020-01-01 12:12:12'); // '3年前'
formatPassTime(new Date());             // '刚刚'
formatPassTime(Date.now() - 60000);     // '1分钟前'
```

```js [JavaScript (CJS)]
const { formatPassTime } = require('l-js-fn');

formatPassTime('2020-01-01 12:12:12'); // '3年前'
formatPassTime(new Date());             // '刚刚'
formatPassTime(Date.now() - 60000);     // '1分钟前'
```
:::

## 5. monthDays 当月总天数

获取指定日期月份的总天数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| time | `Date \| string \| number` | 是 | 日期 |

**返回值：** `number` — 当月天数

**示例：**

::: code-group
```ts [TypeScript]
import { monthDays } from 'l-js-fn';

monthDays('2024-02-01'); // 29（闰年）
monthDays('2023-02-01'); // 28
monthDays('2024-01-01'); // 31
```

```js [JavaScript (ESM)]
import { monthDays } from 'l-js-fn';

monthDays('2024-02-01'); // 29（闰年）
monthDays('2023-02-01'); // 28
monthDays('2024-01-01'); // 31
```

```js [JavaScript (CJS)]
const { monthDays } = require('l-js-fn');

monthDays('2024-02-01'); // 29（闰年）
monthDays('2023-02-01'); // 28
monthDays('2024-01-01'); // 31
```
:::

## 6. getTimeDiff 计算时间间隔

计算两个时间的间隔（单位：毫秒）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| start | `Date \| string \| number` | 是 | 开始时间 |
| end | `Date \| string \| number` | 是 | 结束时间 |

**返回值：** `number` — 时间间隔（毫秒）

**异常：** 类型不一致或格式无效时抛出 `Error`

**示例：**

::: code-group
```ts [TypeScript]
import { getTimeDiff } from 'l-js-fn';

getTimeDiff('2024-01-01', '2024-01-02'); // 86400000（1天）
getTimeDiff(new Date('2024-01-01'), new Date('2024-01-02')); // 86400000
```

```js [JavaScript (ESM)]
import { getTimeDiff } from 'l-js-fn';

getTimeDiff('2024-01-01', '2024-01-02'); // 86400000（1天）
getTimeDiff(new Date('2024-01-01'), new Date('2024-01-02')); // 86400000
```

```js [JavaScript (CJS)]
const { getTimeDiff } = require('l-js-fn');

getTimeDiff('2024-01-01', '2024-01-02'); // 86400000（1天）
getTimeDiff(new Date('2024-01-01'), new Date('2024-01-02')); // 86400000
```
:::

## 7. diffTime 计算时间差值

计算两个时间之间的差值，返回包含天/时/分/秒的结构化结果。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| date1 | `Date \| string \| number` | 是 | 第一个日期 |
| date2 | `Date \| string \| number` | 是 | 第二个日期 |

**返回值：** `{ days: number; hours: number; minutes: number; seconds: number }` — 各分量均为非负数

**示例：**

::: code-group
```ts [TypeScript]
import { diffTime } from 'l-js-fn';

diffTime('2024-01-01 10:00:00', '2024-01-02 12:30:45');
// { days: 1, hours: 2, minutes: 30, seconds: 45 }

diffTime('2024-01-01', '2024-01-01 01:02:03');
// { days: 0, hours: 1, minutes: 2, seconds: 3 }

diffTime('2024-01-01 23:30:00', '2024-01-02 01:15:30');
// { days: 0, hours: 1, minutes: 45, seconds: 30 }
```

```js [JavaScript (ESM)]
import { diffTime } from 'l-js-fn';

diffTime('2024-01-01 10:00:00', '2024-01-02 12:30:45');
// { days: 1, hours: 2, minutes: 30, seconds: 45 }

diffTime('2024-01-01', '2024-01-01 01:02:03');
// { days: 0, hours: 1, minutes: 2, seconds: 3 }
```

```js [JavaScript (CJS)]
const { diffTime } = require('l-js-fn');

diffTime('2024-01-01 10:00:00', '2024-01-02 12:30:45');
// { days: 1, hours: 2, minutes: 30, seconds: 45 }

diffTime('2024-01-01', '2024-01-01 01:02:03');
// { days: 0, hours: 1, minutes: 2, seconds: 3 }
```
:::

## 8. addDays 日期加减天数

日期加减天数，返回新 Date 对象。

::: code-group
```ts [TypeScript]
import { addDays } from 'l-js-fn';

addDays(new Date('2024-01-01'), 1);  // 2024-01-02
addDays(new Date('2024-01-01'), -1); // 2023-12-31
```

```js [JavaScript (ESM)]
import { addDays } from 'l-js-fn';

addDays(new Date('2024-01-01'), 1);  // 2024-01-02
addDays(new Date('2024-01-01'), -1); // 2023-12-31
```

```js [JavaScript (CJS)]
const { addDays } = require('l-js-fn');

addDays(new Date('2024-01-01'), 1);  // 2024-01-02
addDays(new Date('2024-01-01'), -1); // 2023-12-31
```
:::

## 9. isLeapYear 闰年判断

判断指定年份是否为闰年。

::: code-group
```ts [TypeScript]
import { isLeapYear } from 'l-js-fn';

isLeapYear(2024); // true
isLeapYear(2023); // false
```

```js [JavaScript (ESM)]
import { isLeapYear } from 'l-js-fn';

isLeapYear(2024); // true
isLeapYear(2023); // false
```

```js [JavaScript (CJS)]
const { isLeapYear } = require('l-js-fn');

isLeapYear(2024); // true
isLeapYear(2023); // false
```
:::

## 10. getWeekDay 获取中文星期

获取中文星期几。

::: code-group
```ts [TypeScript]
import { getWeekDay } from 'l-js-fn';

getWeekDay(new Date('2024-01-01')); // '星期一'
getWeekDay(); // '星期一'（今天）
```

```js [JavaScript (ESM)]
import { getWeekDay } from 'l-js-fn';

getWeekDay(new Date('2024-01-01')); // '星期一'
getWeekDay(); // '星期一'（今天）
```

```js [JavaScript (CJS)]
const { getWeekDay } = require('l-js-fn');

getWeekDay(new Date('2024-01-01')); // '星期一'
getWeekDay(); // '星期一'（今天）
```
:::
