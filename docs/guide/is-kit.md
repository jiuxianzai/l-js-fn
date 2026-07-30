# is-kit — 类型判断

类型判断工具集，提供常用的值类型检查、格式验证和深度比较功能。

## 1. isEmpty 空值检查

检查值是否为空。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T \| null \| undefined` | 是 | 待检查的值 |

**返回值：** `boolean` — 为空返回 `true`，否则返回 `false`

**判断规则：**
- `null`、`undefined` → `true`
- 空字符串、字符串 `"null"`、`"undefined"` → `true`
- 空数组 → `true`
- 空对象 → `true`
- 其他 → `false`

**示例：**

::: code-group
```ts [TypeScript]
import { isEmpty } from 'l-js-fn';

isEmpty(null);           // true
isEmpty(undefined);      // true
isEmpty('');             // true
isEmpty('null');         // true
isEmpty([]);             // true
isEmpty({});             // true
isEmpty('hello');        // false
isEmpty([1, 2]);         // false
isEmpty({ a: 1 });       // false
isEmpty(0);              // false
```

```js [JavaScript (ESM)]
import { isEmpty } from 'l-js-fn';

isEmpty(null);           // true
isEmpty(undefined);      // true
isEmpty('');             // true
isEmpty('null');         // true
isEmpty([]);             // true
isEmpty({});             // true
isEmpty('hello');        // false
isEmpty([1, 2]);         // false
isEmpty({ a: 1 });       // false
isEmpty(0);              // false
```

```js [JavaScript (CJS)]
const { isEmpty } = require('l-js-fn');

isEmpty(null);           // true
isEmpty(undefined);      // true
isEmpty('');             // true
isEmpty('null');         // true
isEmpty([]);             // true
isEmpty({});             // true
isEmpty('hello');        // false
isEmpty([1, 2]);         // false
isEmpty({ a: 1 });       // false
isEmpty(0);              // false
```
:::

## 2. isNotEmpty 非空检查

检查值是否非空，是 `isEmpty` 的反向判断。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T \| null \| undefined` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isNotEmpty } from 'l-js-fn';

isNotEmpty('hello');     // true
isNotEmpty(null);        // false
isNotEmpty([]);          // false
```

```js [JavaScript (ESM)]
import { isNotEmpty } from 'l-js-fn';

isNotEmpty('hello');     // true
isNotEmpty(null);        // false
isNotEmpty([]);          // false
```

```js [JavaScript (CJS)]
const { isNotEmpty } = require('l-js-fn');

isNotEmpty('hello');     // true
isNotEmpty(null);        // false
isNotEmpty([]);          // false
```
:::

## 3. isObject 判断对象

判断是否为普通对象（`[object Object]`）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean` — 是对象返回 `true`

**示例：**

::: code-group
```ts [TypeScript]
import { isObject } from 'l-js-fn';

isObject({});            // true
isObject({ a: 1 });      // true
isObject([]);            // false
isObject(null);          // false
isObject(new Date());    // false
```

```js [JavaScript (ESM)]
import { isObject } from 'l-js-fn';

isObject({});            // true
isObject({ a: 1 });      // true
isObject([]);            // false
isObject(null);          // false
isObject(new Date());    // false
```

```js [JavaScript (CJS)]
const { isObject } = require('l-js-fn');

isObject({});            // true
isObject({ a: 1 });      // true
isObject([]);            // false
isObject(null);          // false
isObject(new Date());    // false
```
:::

## 4. isArray 判断数组

判断是否为数组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isArray } from 'l-js-fn';

isArray([1, 2, 3]);      // true
isArray([]);             // true
isArray('hello');        // false
isArray({});             // false
```

```js [JavaScript (ESM)]
import { isArray } from 'l-js-fn';

isArray([1, 2, 3]);      // true
isArray([]);             // true
isArray('hello');        // false
isArray({});             // false
```

```js [JavaScript (CJS)]
const { isArray } = require('l-js-fn');

isArray([1, 2, 3]);      // true
isArray([]);             // true
isArray('hello');        // false
isArray({});             // false
```
:::

## 5. isImage 判断图片

判断文件名是否为图片。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名 |

**返回值：** `boolean`

**支持的格式：** `jpg`、`jpeg`、`png`、`gif`、`bmp`、`webp`、`svg`、`ico`、`tiff`、`psd`、`raw`、`heic`、`heif`

**示例：**

::: code-group
```ts [TypeScript]
import { isImage } from 'l-js-fn';

isImage('photo.png');    // true
isImage('doc.pdf');      // false
```

```js [JavaScript (ESM)]
import { isImage } from 'l-js-fn';

isImage('photo.png');    // true
isImage('doc.pdf');      // false
```

```js [JavaScript (CJS)]
const { isImage } = require('l-js-fn');

isImage('photo.png');    // true
isImage('doc.pdf');      // false
```
:::

## 6. isString 判断字符串

判断是否为字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isString } from 'l-js-fn';

isString('hello');       // true
isString(new String('a')); // true
isString(123);           // false
```

```js [JavaScript (ESM)]
import { isString } from 'l-js-fn';

isString('hello');       // true
isString(new String('a')); // true
isString(123);           // false
```

```js [JavaScript (CJS)]
const { isString } = require('l-js-fn');

isString('hello');       // true
isString(new String('a')); // true
isString(123);           // false
```
:::

## 7. isEmail 邮箱验证

判断是否为有效邮箱地址。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | 邮箱字符串 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isEmail } from 'l-js-fn';

isEmail('test@example.com');  // true
isEmail('invalid-email');     // false
```

```js [JavaScript (ESM)]
import { isEmail } from 'l-js-fn';

isEmail('test@example.com');  // true
isEmail('invalid-email');     // false
```

```js [JavaScript (CJS)]
const { isEmail } = require('l-js-fn');

isEmail('test@example.com');  // true
isEmail('invalid-email');     // false
```
:::

## 8. isURL URL验证

判断是否为合法 URL。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | URL 字符串 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isURL } from 'l-js-fn';

isURL('https://example.com'); // true
isURL('not-a-url');           // false
```

```js [JavaScript (ESM)]
import { isURL } from 'l-js-fn';

isURL('https://example.com'); // true
isURL('not-a-url');           // false
```

```js [JavaScript (CJS)]
const { isURL } = require('l-js-fn');

isURL('https://example.com'); // true
isURL('not-a-url');           // false
```
:::

## 9. isHttp HTTP协议判断

判断是否为 http 链接（忽略大小写）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | 待检查的字符串 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isHttp } from 'l-js-fn';

isHttp('http://example.com');  // true
isHttp('HTTP://EXAMPLE.COM');  // true
isHttp('https://example.com'); // false
isHttp('');                    // false
```

```js [JavaScript (ESM)]
import { isHttp } from 'l-js-fn';

isHttp('http://example.com');  // true
isHttp('HTTP://EXAMPLE.COM');  // true
isHttp('https://example.com'); // false
isHttp('');                    // false
```

```js [JavaScript (CJS)]
const { isHttp } = require('l-js-fn');

isHttp('http://example.com');  // true
isHttp('HTTP://EXAMPLE.COM');  // true
isHttp('https://example.com'); // false
isHttp('');                    // false
```
:::

## 10. isHttps HTTPS协议判断

判断是否为 https 链接（忽略大小写）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | 待检查的字符串 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isHttps } from 'l-js-fn';

isHttps('https://example.com');  // true
isHttps('HTTPS://EXAMPLE.COM');  // true
isHttps('http://example.com');   // false
isHttps('');                     // false
```

```js [JavaScript (ESM)]
import { isHttps } from 'l-js-fn';

isHttps('https://example.com');  // true
isHttps('HTTPS://EXAMPLE.COM');  // true
isHttps('http://example.com');   // false
isHttps('');                     // false
```

```js [JavaScript (CJS)]
const { isHttps } = require('l-js-fn');

isHttps('https://example.com');  // true
isHttps('HTTPS://EXAMPLE.COM');  // true
isHttps('http://example.com');   // false
isHttps('');                     // false
```
:::

## 11. isIdCard 身份证验证

判断是否为有效的中国大陆身份证号码（支持 15 位和 18 位）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| idCard | `string` | 是 | 身份证号 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isIdCard } from 'l-js-fn';

isIdCard('110101199001011234'); // true（18位）
isIdCard('110101900101123');    // true（15位）
isIdCard('123456789012345678'); // false
```

```js [JavaScript (ESM)]
import { isIdCard } from 'l-js-fn';

isIdCard('110101199001011234'); // true（18位）
isIdCard('110101900101123');    // true（15位）
isIdCard('123456789012345678'); // false
```

```js [JavaScript (CJS)]
const { isIdCard } = require('l-js-fn');

isIdCard('110101199001011234'); // true（18位）
isIdCard('110101900101123');    // true（15位）
isIdCard('123456789012345678'); // false
```
:::

## 12. isPhoneNumber 手机号验证

判断是否为有效的中国大陆手机号码。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | `string` | 是 | 手机号 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isPhoneNumber } from 'l-js-fn';

isPhoneNumber('13800138000'); // true
isPhoneNumber('1380013800');  // false
```

```js [JavaScript (ESM)]
import { isPhoneNumber } from 'l-js-fn';

isPhoneNumber('13800138000'); // true
isPhoneNumber('1380013800');  // false
```

```js [JavaScript (CJS)]
const { isPhoneNumber } = require('l-js-fn');

isPhoneNumber('13800138000'); // true
isPhoneNumber('1380013800');  // false
```
:::

## 13. isEqual 深度比较

深度比较两个值是否相等（支持对象、数组、NaN 比较）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 第一个值 |
| other | `T` | 是 | 第二个值 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isEqual } from 'l-js-fn';

isEqual({ a: 1 }, { a: 1 });     // true
isEqual([1, 2], [1, 2]);         // true
isEqual(NaN, NaN);               // true
isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
isEqual({ a: 1 }, { a: 2 });     // false

// null 与对象比较
isEqual(null, {}); // false
isEqual(null, null); // true
```

```js [JavaScript (ESM)]
import { isEqual } from 'l-js-fn';

isEqual({ a: 1 }, { a: 1 });     // true
isEqual([1, 2], [1, 2]);         // true
isEqual(NaN, NaN);               // true
isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
isEqual({ a: 1 }, { a: 2 });     // false

// null 与对象比较
isEqual(null, {}); // false
isEqual(null, null); // true
```

```js [JavaScript (CJS)]
const { isEqual } = require('l-js-fn');

isEqual({ a: 1 }, { a: 1 });     // true
isEqual([1, 2], [1, 2]);         // true
isEqual(NaN, NaN);               // true
isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
isEqual({ a: 1 }, { a: 2 });     // false

// null 与对象比较
isEqual(null, {}); // false
isEqual(null, null); // true
```
:::

::: warning 注意
`isEqual(null, {})` 或 `isEqual({}, null)` 等 null 与非 null 对象的比较会返回 `false`，而不会抛出异常。
:::

## 14. validateParams 参数校验

校验参数对象中必填字段是否都存在且非空。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| required | `string[]` | 是 | 必填字段数组 |
| params | `Record<string, any>` | 是 | 待校验的参数对象 |

**返回值：** `string \| null` — 未通过的字段名，全部通过返回 `null`

**示例：**

::: code-group
```ts [TypeScript]
import { validateParams } from 'l-js-fn';

validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'
```

```js [JavaScript (ESM)]
import { validateParams } from 'l-js-fn';

validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'
```

```js [JavaScript (CJS)]
const { validateParams } = require('l-js-fn');

validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'
```
:::
