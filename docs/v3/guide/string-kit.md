# string-kit — 字符串处理

字符串处理工具集，提供脱敏、去除空格、UUID 生成、序号生成等功能。

## 1. desensitization 字符串脱敏

对字符串进行脱敏处理，将指定位置的字符替换为 `*`。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要处理的字符串 |
| start | `number` | 是 | 脱敏起始位置（从 0 开始） |
| count | `number` | 否 | 脱敏字符数，默认 `3` |

**返回值：** `string` — 脱敏后的字符串

**异常：** 参数非法时抛出 `Error`

**示例：**

::: code-group
```ts [TypeScript]
import { desensitization } from 'l-js-fn';

desensitization('13800138000', 3, 4); // '138****8000'
desensitization('123456789', 3, 3);   // '123***789'
desensitization('', 0);                // ''
```

```js [JavaScript (ESM)]
import { desensitization } from 'l-js-fn';

desensitization('13800138000', 3, 4); // '138****8000'
desensitization('123456789', 3, 3);   // '123***789'
desensitization('', 0);                // ''
```

```js [JavaScript (CJS)]
const { desensitization } = require('l-js-fn');

desensitization('13800138000', 3, 4); // '138****8000'
desensitization('123456789', 3, 3);   // '123***789'
desensitization('', 0);                // ''
```
:::

## 2. desensitizeName 姓名脱敏

对姓名进行脱敏处理，支持中间脱敏、姓氏脱敏和末位脱敏三种模式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | 姓名 |
| mode | `'middle' \| 'surname' \| 'last'` | 否 | 脱敏模式，默认 `'middle'` |

**模式说明：**

- `middle` （中间脱敏）：保留首尾字符，中间替换为 `*`
  - 1 字 → `*`，2 字 → `x*`，3 字 → `x*x`，4 字 → `x**x`，以此类推
- `surname` （姓氏脱敏）：仅脱敏第一个字符（姓氏），其余保留
- `last` （末位脱敏）：仅保留最后一个字，其余全部脱敏

**示例：**

::: code-group
```ts [TypeScript]
import { desensitizeName } from 'l-js-fn';

// 中间脱敏（默认）
desensitizeName('张三');          // '张*'
desensitizeName('张三丰');        // '张*丰'
desensitizeName('欧阳飞飞');      // '欧**飞'
desensitizeName('阿不都拉木');    // '阿***木'

// 姓氏脱敏
desensitizeName('张三', 'surname');     // '*三'
desensitizeName('张三四', 'surname');   // '*三四'

// 末位脱敏
desensitizeName('张三', 'last');        // '*三'
desensitizeName('张三丰', 'last');      // '**丰'
```

```js [JavaScript (ESM)]
import { desensitizeName } from 'l-js-fn';

// 中间脱敏（默认）
desensitizeName('张三');          // '张*'
desensitizeName('张三丰');        // '张*丰'
desensitizeName('欧阳飞飞');      // '欧**飞'

// 姓氏脱敏
desensitizeName('张三', 'surname');     // '*三'

// 末位脱敏
desensitizeName('张三丰', 'last');      // '**丰'
```

```js [JavaScript (CJS)]
const { desensitizeName } = require('l-js-fn');

// 中间脱敏（默认）
desensitizeName('张三');          // '张*'
desensitizeName('张三丰');        // '张*丰'
desensitizeName('欧阳飞飞');      // '欧**飞'

// 姓氏脱敏
desensitizeName('张三', 'surname');     // '*三'

// 末位脱敏
desensitizeName('张三丰', 'last');      // '**丰'
```
:::

## 3. trim 去除空格

去除字符串中的空格。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要处理的字符串 |
| pos | `string` | 否 | 去除类型：`'both'`、`'left'`、`'right'`、`'all'`，默认 `'both'` |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { trim } from 'l-js-fn';

trim('  hello  ');         // 'hello'
trim('  hello  ', 'left'); // 'hello  '
trim('  hello  ', 'right');// '  hello'
trim('  hello  ', 'all');  // 'hello'
```

```js [JavaScript (ESM)]
import { trim } from 'l-js-fn';

trim('  hello  ');         // 'hello'
trim('  hello  ', 'left'); // 'hello  '
trim('  hello  ', 'right');// '  hello'
trim('  hello  ', 'all');  // 'hello'
```

```js [JavaScript (CJS)]
const { trim } = require('l-js-fn');

trim('  hello  ');         // 'hello'
trim('  hello  ', 'left'); // 'hello  '
trim('  hello  ', 'right');// '  hello'
trim('  hello  ', 'all');  // 'hello'
```
:::

## 4. getMobile 随机生成手机号

随机生成中国大陆手机号码。

**返回值：** `string` — 随机手机号

**示例：**

::: code-group
```ts [TypeScript]
import { getMobile } from 'l-js-fn';

getMobile(); // '13800138000'（随机）
```

```js [JavaScript (ESM)]
import { getMobile } from 'l-js-fn';

getMobile(); // '13800138000'（随机）
```

```js [JavaScript (CJS)]
const { getMobile } = require('l-js-fn');

getMobile(); // '13800138000'（随机）
```
:::

## 5. getUuid 生成UUID

生成 UUID（v4 风格）。

**参数说明：**

| 参数 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `length` | `number` | 否 | `36` | 返回 UUID 的长度 |

**返回值：** `string` — UUID 字符串

**示例：**

::: code-group
```ts [TypeScript]
import { getUuid } from 'l-js-fn';

getUuid();    // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
getUuid(8);   // 'XXXXXXXX'（前 8 位）
getUuid(16);  // 'xxxxxxxx-xxxx-4x'（前 16 位）
```

```js [JavaScript (ESM)]
import { getUuid } from 'l-js-fn';

getUuid();    // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
getUuid(8);   // 'XXXXXXXX'（前 8 位）
getUuid(16);  // 'xxxxxxxx-xxxx-4x'（前 16 位）
```

```js [JavaScript (CJS)]
const { getUuid } = require('l-js-fn');

getUuid();    // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
getUuid(8);   // 'XXXXXXXX'（前 8 位）
getUuid(16);  // 'xxxxxxxx-xxxx-4x'（前 16 位）
```
:::

## 6. indexToLabel 索引转序号

根据数组索引生成序号标识，支持大写、小写、数字、中文四种格式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| index | `number` | 是 | 从 0 开始的索引 |
| type | `string` | 否 | 格式类型：`'upper'`、`'lower'`、`'number'`、`'chinese'`，默认 `'upper'` |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { indexToLabel } from 'l-js-fn';

indexToLabel(0);            // 'A'
indexToLabel(1);            // 'B'
indexToLabel(25);           // 'Z'
indexToLabel(26);           // 'AA'
indexToLabel(0, 'lower');   // 'a'
indexToLabel(0, 'number');  // '1'
indexToLabel(0, 'chinese'); // '一'
indexToLabel(10, 'chinese');// '十一'
```

```js [JavaScript (ESM)]
import { indexToLabel } from 'l-js-fn';

indexToLabel(0);            // 'A'
indexToLabel(1);            // 'B'
indexToLabel(25);           // 'Z'
indexToLabel(26);           // 'AA'
indexToLabel(0, 'lower');   // 'a'
indexToLabel(0, 'number');  // '1'
indexToLabel(0, 'chinese'); // '一'
indexToLabel(10, 'chinese');// '十一'
```

```js [JavaScript (CJS)]
const { indexToLabel } = require('l-js-fn');

indexToLabel(0);            // 'A'
indexToLabel(1);            // 'B'
indexToLabel(25);           // 'Z'
indexToLabel(26);           // 'AA'
indexToLabel(0, 'lower');   // 'a'
indexToLabel(0, 'number');  // '1'
indexToLabel(0, 'chinese'); // '一'
indexToLabel(10, 'chinese');// '十一'
```
:::

## 7. searchTextColor 匹配文字变色

匹配文字并添加 HTML 颜色高亮标签（用于搜索场景）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| val | `string` | 是 | 搜索关键词 |
| text | `string` | 否 | 要处理的字符串，默认 `''` |
| color | `string` | 否 | 高亮颜色，默认 `'red'` |

**返回值：** `string` — 处理后的 HTML 字符串

**示例：**

::: code-group
```ts [TypeScript]
import { searchTextColor } from 'l-js-fn';

searchTextColor('hello', 'hello world');
// "<span style='color: red'>hello</span> world"

searchTextColor('hello', 'hello world', 'blue');
// "<span style='color: blue'>hello</span> world"
```

```js [JavaScript (ESM)]
import { searchTextColor } from 'l-js-fn';

searchTextColor('hello', 'hello world');
// "<span style='color: red'>hello</span> world"

searchTextColor('hello', 'hello world', 'blue');
// "<span style='color: blue'>hello</span> world"
```

```js [JavaScript (CJS)]
const { searchTextColor } = require('l-js-fn');

searchTextColor('hello', 'hello world');
// "<span style='color: red'>hello</span> world"

searchTextColor('hello', 'hello world', 'blue');
// "<span style='color: blue'>hello</span> world"
```
:::

::: warning 安全提示
`searchTextColor` 直接生成 HTML 字符串，仅适用于通过 `v-html`/`innerHTML` 渲染的场景。请确保 `text` 参数来自可信来源，避免 XSS 风险。搜索关键词中的正则特殊字符（如 `.`、`*`、`+` 等）会被自动转义。
:::

## 8. filterSpace 禁止空格

禁止输入空格，去除字符串首尾空格。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| val | `string` | 是 | 要处理的字符串 |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { filterSpace } from 'l-js-fn';

filterSpace('  hello  ');  // 'hello'
filterSpace(' hello world '); // 'hello world'
```

```js [JavaScript (ESM)]
import { filterSpace } from 'l-js-fn';

filterSpace('  hello  ');  // 'hello'
filterSpace(' hello world '); // 'hello world'
```

```js [JavaScript (CJS)]
const { filterSpace } = require('l-js-fn');

filterSpace('  hello  ');  // 'hello'
filterSpace(' hello world '); // 'hello world'
```
:::

## 9. toPascalCase 转帕斯卡命名

将字符串转换为帕斯卡命名法（PascalCase）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要转换的字符串 |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { toPascalCase } from 'l-js-fn';

toPascalCase('hello-world');  // 'HelloWorld'
toPascalCase('hello_world');  // 'HelloWorld'
toPascalCase('hello world');  // 'HelloWorld'
toPascalCase('helloWorld');   // 'HelloWorld'
```

```js [JavaScript (ESM)]
import { toPascalCase } from 'l-js-fn';

toPascalCase('hello-world');  // 'HelloWorld'
toPascalCase('hello_world');  // 'HelloWorld'
toPascalCase('hello world');  // 'HelloWorld'
toPascalCase('helloWorld');   // 'HelloWorld'
```

```js [JavaScript (CJS)]
const { toPascalCase } = require('l-js-fn');

toPascalCase('hello-world');  // 'HelloWorld'
toPascalCase('hello_world');  // 'HelloWorld'
toPascalCase('hello world');  // 'HelloWorld'
toPascalCase('helloWorld');   // 'HelloWorld'
```
:::

## 10. toCamelCase 转驼峰命名

短横线/下划线/空格命名 → 驼峰命名。

::: code-group
```ts [TypeScript]
import { toCamelCase } from 'l-js-fn';

toCamelCase('hello-world');  // 'helloWorld'
toCamelCase('hello_world');  // 'helloWorld'
toCamelCase('Hello World');  // 'helloWorld'
```

```js [JavaScript (ESM)]
import { toCamelCase } from 'l-js-fn';

toCamelCase('hello-world');  // 'helloWorld'
toCamelCase('hello_world');  // 'helloWorld'
toCamelCase('Hello World');  // 'helloWorld'
```

```js [JavaScript (CJS)]
const { toCamelCase } = require('l-js-fn');

toCamelCase('hello-world');  // 'helloWorld'
toCamelCase('hello_world');  // 'helloWorld'
toCamelCase('Hello World');  // 'helloWorld'
```
:::

## 11. toKebabCase 转短横线命名

驼峰/帕斯卡/下划线 → 短横线命名。

::: code-group
```ts [TypeScript]
import { toKebabCase } from 'l-js-fn';

toKebabCase('helloWorld');   // 'hello-world'
toKebabCase('HelloWorld');   // 'hello-world'
toKebabCase('hello_world');  // 'hello-world'
```

```js [JavaScript (ESM)]
import { toKebabCase } from 'l-js-fn';

toKebabCase('helloWorld');   // 'hello-world'
toKebabCase('HelloWorld');   // 'hello-world'
toKebabCase('hello_world');  // 'hello-world'
```

```js [JavaScript (CJS)]
const { toKebabCase } = require('l-js-fn');

toKebabCase('helloWorld');   // 'hello-world'
toKebabCase('HelloWorld');   // 'hello-world'
toKebabCase('hello_world');  // 'hello-world'
```
:::

## 12. capitalize 首字母大写

首字母大写。

::: code-group
```ts [TypeScript]
import { capitalize } from 'l-js-fn';

capitalize('hello');        // 'Hello'
capitalize('hello world');  // 'Hello world'
```

```js [JavaScript (ESM)]
import { capitalize } from 'l-js-fn';

capitalize('hello');        // 'Hello'
capitalize('hello world');  // 'Hello world'
```

```js [JavaScript (CJS)]
const { capitalize } = require('l-js-fn');

capitalize('hello');        // 'Hello'
capitalize('hello world');  // 'Hello world'
```
:::
