# encode — 编码解码

编码解码工具集，提供 Base64、HTML 转义、URL 编解码、查询字符串处理等功能。

**导入方式：**

```typescript
import {
  base64Encode, base64Decode,
  escapeHTML, unescapeHTML,
  urlEncode, urlDecode,
  querystringify, parseQueryString
} from 'l-js-fn/encode';
```

## Base64

### base64Encode

将字符串编码为 Base64（支持 Unicode）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要编码的字符串 |

**返回值：** `string` — Base64 编码后的字符串

**异常：** 参数非法时抛出 `TypeError`

**示例：**

```typescript
import { base64Encode } from 'l-js-fn/encode';

base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
base64Encode('你好');        // '5L2g5aW9'
```

### base64Decode

将 Base64 字符串解码（支持 Unicode）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | Base64 编码的字符串 |

**返回值：** `string` — 解码后的原始字符串

**异常：** 无效的 Base64 字符串时抛出 `Error`

**示例：**

```typescript
import { base64Decode } from 'l-js-fn/encode';

base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'
base64Decode('5L2g5aW9');          // '你好'
```

## HTML 转义

### escapeHTML

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

```typescript
import { escapeHTML } from 'l-js-fn/encode';

escapeHTML('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### unescapeHTML

HTML 反转义。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要反转义的字符串 |

**返回值：** `string`

**示例：**

```typescript
import { unescapeHTML } from 'l-js-fn/encode';

unescapeHTML('&lt;div&gt;Hello&lt;/div&gt;');
// '<div>Hello</div>'
```

## URL 编码

### urlEncode

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

```typescript
import { urlEncode } from 'l-js-fn/encode';

urlEncode('Hello World!');    // 'Hello%20World%21'
urlEncode('你好世界');         // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
urlEncode('a/b', { uri: true }); // 'a/b'（URI 模式保留 /）
```

### urlDecode

URL 解码。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | 要解码的字符串 |
| options | `object` | 否 | 配置选项 |
| options.component | `boolean` | 否 | 是否解码 URL 组件，默认 `false` |

**返回值：** `string`

**示例：**

```typescript
import { urlDecode } from 'l-js-fn/encode';

urlDecode('Hello%20World');  // 'Hello World'
urlDecode('%E4%BD%A0%E5%A5%BD'); // '你好'
```

## 查询字符串

### querystringify

将对象转换为 URL 查询字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | `Record<string, any>` | 是 | 要转换的对象 |

**返回值：** `string`

**示例：**

```typescript
import { querystringify } from 'l-js-fn/encode';

querystringify({ name: 'John', age: 20 });
// 'name=John&age=20'

querystringify({ a: [1, 2, 3] });
// 'a=1&a=2&a=3'
```

### parseQueryString

解析 URL 查询字符串为对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| str | `string` | 是 | URL 查询字符串（可包含或不包含 `?`） |

**返回值：** `Record<string, string | string[]>`

**示例：**

```typescript
import { parseQueryString } from 'l-js-fn/encode';

parseQueryString('name=John&age=20');
// { name: 'John', age: '20' }

parseQueryString('?a=1&a=2');
// { a: ['1', '2'] }
```
