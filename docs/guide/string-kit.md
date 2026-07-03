# string-kit — 字符串处理

字符串处理工具集，提供脱敏、去除空格、UUID 生成、序号生成等功能。

## desensitization

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

```typescript
import { desensitization } from 'l-js-fn';

desensitization('13800138000', 3, 4); // '138****8000'
desensitization('123456789', 3, 3);   // '123***789'
desensitization('', 0);                // ''
```

## trim

去除字符串中的空格。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要处理的字符串 |
| pos | `string` | 否 | 去除类型：`'both'`、`'left'`、`'right'`、`'all'`，默认 `'both'` |

**返回值：** `string`

**示例：**

```typescript
import { trim } from 'l-js-fn';

trim('  hello  ');         // 'hello'
trim('  hello  ', 'left'); // 'hello  '
trim('  hello  ', 'right');// '  hello'
trim('  hello  ', 'all');  // 'hello'
```

## getMobile

随机生成中国大陆手机号码。

**返回值：** `string` — 随机手机号

**示例：**

```typescript
import { getMobile } from 'l-js-fn';

getMobile(); // '13800138000'（随机）
```

## getUuid

生成 UUID（v4 风格）。

**返回值：** `string` — UUID 字符串

**示例：**

```typescript
import { getUuid } from 'l-js-fn';

getUuid(); // 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
```

## indexToLabel

根据数组索引生成序号标识，支持大写、小写、数字、中文四种格式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| index | `number` | 是 | 从 0 开始的索引 |
| type | `string` | 否 | 格式类型：`'upper'`、`'lower'`、`'number'`、`'chinese'`，默认 `'upper'` |

**返回值：** `string`

**示例：**

```typescript
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

## searchTextColor

匹配文字并添加 HTML 颜色高亮标签（用于搜索场景）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| val | `string` | 是 | 搜索关键词 |
| text | `string` | 否 | 要处理的字符串，默认 `''` |
| color | `string` | 否 | 高亮颜色，默认 `'red'` |

**返回值：** `string` — 处理后的 HTML 字符串

**示例：**

```typescript
import { searchTextColor } from 'l-js-fn';

searchTextColor('hello', 'hello world');
// "<span style='color: red'>hello</span> world"

searchTextColor('hello', 'hello world', 'blue');
// "<span style='color: blue'>hello</span> world"
```

::: warning 安全提示
`searchTextColor` 直接生成 HTML 字符串，仅适用于通过 `v-html`/`innerHTML` 渲染的场景。请确保 `text` 参数来自可信来源，避免 XSS 风险。搜索关键词中的正则特殊字符（如 `.`、`*`、`+` 等）会被自动转义。
:::

## filterSpace

禁止输入空格，去除字符串首尾空格。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| val | `string` | 是 | 要处理的字符串 |

**返回值：** `string`

**示例：**

```typescript
import { filterSpace } from 'l-js-fn';

filterSpace('  hello  ');  // 'hello'
filterSpace(' hello world '); // 'hello world'
```

## toPascalCase

将字符串转换为帕斯卡命名法（PascalCase）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要转换的字符串 |

**返回值：** `string`

**示例：**

```typescript
import { toPascalCase } from 'l-js-fn';

toPascalCase('hello-world');  // 'HelloWorld'
toPascalCase('hello_world');  // 'HelloWorld'
toPascalCase('hello world');  // 'HelloWorld'
toPascalCase('helloWorld');   // 'HelloWorld'
```
