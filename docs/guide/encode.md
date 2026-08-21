# encode — 编码解码

编码解码工具集，提供 Base64、HTML 转义、URL 编解码等功能。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/encode` 仍保留，供 CJS 或需要精确加载的场景使用。

> [!WARNING] v4.0 破坏性变更
> `querystringify` 与 `parseQueryString` 已在 v4.0 移除，查询字符串能力统一收敛到 URL 处理模块：
> - 对象 → 查询字符串：`transUrlParams`（`l-js-fn/url-kit`）
> - 查询字符串 → 对象：`getUrlParams`（`l-js-fn/url-kit`，同时支持完整 URL 与裸查询字符串）

::: code-group
```ts [TypeScript]
import {
  base64Encode, base64Decode,
  escapeHTML, unescapeHTML,
  urlEncode, urlDecode
} from 'l-js-fn';
```

```js [JavaScript (ESM)]
import {
  base64Encode, base64Decode,
  escapeHTML, unescapeHTML,
  urlEncode, urlDecode
} from 'l-js-fn';
```

```js [JavaScript (CJS)]
const {
  base64Encode, base64Decode,
  escapeHTML, unescapeHTML,
  urlEncode, urlDecode
} = require('l-js-fn/encode');
```
:::

## 1. Base64

### 1.1 base64Encode Base64编码

将字符串编码为 Base64（支持 Unicode）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要编码的字符串 |

**返回值：** `string` — Base64 编码后的字符串

**异常：** 参数非法时抛出 `TypeError`

**示例：**

::: code-group
```ts [TypeScript]
import { base64Encode } from 'l-js-fn';

base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
base64Encode('你好');        // '5L2g5aW9'
```

```js [JavaScript (ESM)]
import { base64Encode } from 'l-js-fn';

base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
base64Encode('你好');        // '5L2g5aW9'
```

```js [JavaScript (CJS)]
const { base64Encode } = require('l-js-fn/encode');

base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
base64Encode('你好');        // '5L2g5aW9'
```
:::

### 1.2 base64Decode Base64解码

将 Base64 字符串解码（支持 Unicode）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | Base64 编码的字符串 |

**返回值：** `string` — 解码后的原始字符串

**异常：** 无效的 Base64 字符串时抛出 `Error`

**示例：**

::: code-group
```ts [TypeScript]
import { base64Decode } from 'l-js-fn';

base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'
base64Decode('5L2g5aW9');          // '你好'
```

```js [JavaScript (ESM)]
import { base64Decode } from 'l-js-fn';

base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'
base64Decode('5L2g5aW9');          // '你好'
```

```js [JavaScript (CJS)]
const { base64Decode } = require('l-js-fn/encode');

base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'
base64Decode('5L2g5aW9');          // '你好'
```
:::

## 2. HTML 转义

### 2.1 escapeHTML HTML转义

HTML 转义（防 XSS 攻击）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要转义的字符串 |

**返回值：** `string` — 转义后的字符串

**转义字符映射：**

| 原字符 | 转义后 |
|--------|--------|
| `&` | `&amp;` |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `"` | `&quot;` |
| `'` | `&apos;` |
| `` ` `` | `&#96;` |
| `/` | `&#x2F;` |
| `=` | `&#x3D;` |

**示例：**

::: code-group
```ts [TypeScript]
import { escapeHTML } from 'l-js-fn';

escapeHTML('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

```js [JavaScript (ESM)]
import { escapeHTML } from 'l-js-fn';

escapeHTML('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

```js [JavaScript (CJS)]
const { escapeHTML } = require('l-js-fn/encode');

escapeHTML('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```
:::

### 2.2 unescapeHTML HTML反转义

HTML 反转义。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要反转义的字符串 |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { unescapeHTML } from 'l-js-fn';

unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;');
// '<div>Hello</div>'
```

```js [JavaScript (ESM)]
import { unescapeHTML } from 'l-js-fn';

unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;');
// '<div>Hello</div>'
```

```js [JavaScript (CJS)]
const { unescapeHTML } = require('l-js-fn/encode');

unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;');
// '<div>Hello</div>'
```
:::

## 3. URL 编码

### 3.1 urlEncode URL编码

URL 编码。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要编码的字符串 |
| options | `object` | 否 | 配置选项 |
| options.component | `boolean` | 否 | 是否编码 URL 组件，默认 `false` |
| options.uri | `boolean` | 否 | 是否编码完整 URI，默认 `false` |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { urlEncode } from 'l-js-fn';

urlEncode('Hello World!');    // 'Hello%20World%21'
urlEncode('你好世界');         // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
urlEncode('a/b', { uri: true }); // 'a/b'（URI 模式保留 /）
```

```js [JavaScript (ESM)]
import { urlEncode } from 'l-js-fn';

urlEncode('Hello World!');    // 'Hello%20World%21'
urlEncode('你好世界');         // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
urlEncode('a/b', { uri: true }); // 'a/b'（URI 模式保留 /）
```

```js [JavaScript (CJS)]
const { urlEncode } = require('l-js-fn/encode');

urlEncode('Hello World!');    // 'Hello%20World%21'
urlEncode('你好世界');         // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
urlEncode('a/b', { uri: true }); // 'a/b'（URI 模式保留 /）
```
:::

### 3.2 urlDecode URL解码

URL 解码。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要解码的字符串 |
| options | `object` | 否 | 配置选项 |
| options.component | `boolean` | 否 | 是否使用 `decodeURIComponent` 解码，默认 `false`（使用 `decodeURI`） |

**返回值：** `string`

**示例：**

::: code-group
```ts [TypeScript]
import { urlDecode } from 'l-js-fn';

urlDecode('Hello%20World');  // 'Hello World'
urlDecode('%E4%BD%A0%E5%A5%BD'); // '你好'

// 使用 decodeURIComponent 解码更多字符
urlDecode('Hello%20World%21', { component: true }); // 'Hello World!'
```

```js [JavaScript (ESM)]
import { urlDecode } from 'l-js-fn';

urlDecode('Hello%20World');  // 'Hello World'
urlDecode('%E4%BD%A0%E5%A5%BD'); // '你好'

// 使用 decodeURIComponent 解码更多字符
urlDecode('Hello%20World%21', { component: true }); // 'Hello World!'
```

```js [JavaScript (CJS)]
const { urlDecode } = require('l-js-fn/encode');

urlDecode('Hello%20World');  // 'Hello World'
urlDecode('%E4%BD%A0%E5%A5%BD'); // '你好'

// 使用 decodeURIComponent 解码更多字符
urlDecode('Hello%20World%21', { component: true }); // 'Hello World!'
```
:::

## 4. 查询字符串

> [!WARNING] v4.0 破坏性变更
> `querystringify` / `parseQueryString` 已在 v4.0 移除，请使用 URL 处理模块的等价能力：
> ```ts
> import { transUrlParams, getUrlParams } from 'l-js-fn';
>
> // 对象 → 查询字符串
> transUrlParams({ name: 'John', age: 20 });      // 'name=John&age=20'
> transUrlParams({ a: [1, 2, 3] });               // 'a%5B0%5D=1&a%5B1%5D=2&a%5B2%5D=3'
>
> // 查询字符串 → 对象
> getUrlParams('name=John&age=20');               // { name: 'John', age: '20' }
> getUrlParams('?a=1&a=2');                       // { a: ['1', '2'] }
> ```
