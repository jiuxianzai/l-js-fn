# number-kit — 数字处理

数字处理工具集，提供格式化、百分比、随机数生成等功能。

## formatNumber 格式化数字

格式化数字，支持千分位分割和中文单位。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string \| number` | 是 | 数字或数字字符串 |
| useUnit | `boolean` | 否 | 是否使用中文单位（万/亿），默认 `false` |

**返回值：** `string` — 格式化后的字符串；非数字原样返回

**示例：**

::: code-group
```ts [TypeScript]
import { formatNumber } from 'l-js-fn';

// 千分位分割
formatNumber(1234567);        // '1,234,567'
formatNumber('1234567');      // '1,234,567'

// 中文单位
formatNumber(1234567, true);  // '123.46万'
formatNumber(123456789, true);// '1.23亿'
formatNumber(1500, true);     // '0.15万'

// 非数字
formatNumber('abc');          // 'abc'
```

```js [JavaScript (ESM)]
import { formatNumber } from 'l-js-fn';

// 千分位分割
formatNumber(1234567);        // '1,234,567'
formatNumber('1234567');      // '1,234,567'

// 中文单位
formatNumber(1234567, true);  // '123.46万'
formatNumber(123456789, true);// '1.23亿'
formatNumber(1500, true);     // '0.15万'

// 非数字
formatNumber('abc');          // 'abc'
```

```js [JavaScript (CJS)]
const { formatNumber } = require('l-js-fn');

// 千分位分割
formatNumber(1234567);        // '1,234,567'
formatNumber('1234567');      // '1,234,567'

// 中文单位
formatNumber(1234567, true);  // '123.46万'
formatNumber(123456789, true);// '1.23亿'
formatNumber(1500, true);     // '0.15万'

// 非数字
formatNumber('abc');          // 'abc'
```
:::

## toPercent 转百分比

将小数转为百分比字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `any` | 是 | 输入的小数值 |
| decimals | `number` | 否 | 小数点位数，默认 `2` |
| round | `boolean` | 否 | 是否四舍五入，默认 `true` |

**返回值：** `string` — 百分比字符串

**示例：**

::: code-group
```ts [TypeScript]
import { toPercent } from 'l-js-fn';

toPercent(0.5332);           // '53.32%'
toPercent(0.5332, 1);        // '53.3%'
toPercent(0.533234, 2, false); // '53.32%'（截断）
toPercent(null);             // '0%'
```

```js [JavaScript (ESM)]
import { toPercent } from 'l-js-fn';

toPercent(0.5332);           // '53.32%'
toPercent(0.5332, 1);        // '53.3%'
toPercent(0.533234, 2, false); // '53.32%'（截断）
toPercent(null);             // '0%'
```

```js [JavaScript (CJS)]
const { toPercent } = require('l-js-fn');

toPercent(0.5332);           // '53.32%'
toPercent(0.5332, 1);        // '53.3%'
toPercent(0.533234, 2, false); // '53.32%'（截断）
toPercent(null);             // '0%'
```
:::

## random 生成随机数

生成一个随机数（支持负数、整数或浮点数）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| min | `number` | 是 | 最小值（如果只传一个参数，则作为最大值，最小值默认 `0`） |
| max | `number` | 否 | 最大值 |
| options | `object` | 否 | 配置选项 |
| options.float | `boolean` | 否 | 是否返回浮点数，默认 `false` |

**返回值：** `number`

**异常：** 参数非法时抛出 `Error`

**示例：**

::: code-group
```ts [TypeScript]
import { random } from 'l-js-fn';

random(10);                    // 0-10 的随机整数
random(1, 10);                 // 1-10 的随机整数
random(1, 10, { float: true }); // 1-10 的随机浮点数
random(-5, 5);                 // -5 到 5 的随机整数
```

```js [JavaScript (ESM)]
import { random } from 'l-js-fn';

random(10);                    // 0-10 的随机整数
random(1, 10);                 // 1-10 的随机整数
random(1, 10, { float: true }); // 1-10 的随机浮点数
random(-5, 5);                 // -5 到 5 的随机整数
```

```js [JavaScript (CJS)]
const { random } = require('l-js-fn');

random(10);                    // 0-10 的随机整数
random(1, 10);                 // 1-10 的随机整数
random(1, 10, { float: true }); // 1-10 的随机浮点数
random(-5, 5);                 // -5 到 5 的随机整数
```
:::

## getUniqueRandomIndexes 不重复随机索引

生成指定数量的不重复随机索引。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| len | `number` | 是 | 最大索引（一般为数组长度） |
| count | `number` | 是 | 需要生成的随机索引数量 |

**返回值：** `number[]` — 不重复的随机索引数组

**示例：**

::: code-group
```ts [TypeScript]
import { getUniqueRandomIndexes } from 'l-js-fn';

getUniqueRandomIndexes(10, 3); // [0, 5, 8]（随机，不重复）
getUniqueRandomIndexes(5, 5);  // [2, 4, 1, 3, 0]（全部打乱）
```

```js [JavaScript (ESM)]
import { getUniqueRandomIndexes } from 'l-js-fn';

getUniqueRandomIndexes(10, 3); // [0, 5, 8]（随机，不重复）
getUniqueRandomIndexes(5, 5);  // [2, 4, 1, 3, 0]（全部打乱）
```

```js [JavaScript (CJS)]
const { getUniqueRandomIndexes } = require('l-js-fn');

getUniqueRandomIndexes(10, 3); // [0, 5, 8]（随机，不重复）
getUniqueRandomIndexes(5, 5);  // [2, 4, 1, 3, 0]（全部打乱）
```
:::

## clamp 限制值范围

将数值限制在指定范围内。

::: code-group
```ts [TypeScript]
import { clamp } from 'l-js-fn';

clamp(5, 0, 10);  // 5
clamp(-1, 0, 10); // 0
clamp(15, 0, 10); // 10
```

```js [JavaScript (ESM)]
import { clamp } from 'l-js-fn';

clamp(5, 0, 10);  // 5
clamp(-1, 0, 10); // 0
clamp(15, 0, 10); // 10
```

```js [JavaScript (CJS)]
const { clamp } = require('l-js-fn');

clamp(5, 0, 10);  // 5
clamp(-1, 0, 10); // 0
clamp(15, 0, 10); // 10
```
:::

## round 四舍五入

四舍五入到指定小数位。

::: code-group
```ts [TypeScript]
import { round } from 'l-js-fn';

round(3.14159, 2); // 3.14
round(3.14159);    // 3
round(3.5);        // 4
```

```js [JavaScript (ESM)]
import { round } from 'l-js-fn';

round(3.14159, 2); // 3.14
round(3.14159);    // 3
round(3.5);        // 4
```

```js [JavaScript (CJS)]
const { round } = require('l-js-fn');

round(3.14159, 2); // 3.14
round(3.14159);    // 3
round(3.5);        // 4
```
:::
