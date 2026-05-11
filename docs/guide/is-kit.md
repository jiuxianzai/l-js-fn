# is-kit — 类型判断

类型判断工具集，提供常用的值类型检查、格式验证和深度比较功能。

## isEmpty

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

```typescript
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

## isNotEmpty

检查值是否非空，是 `isEmpty` 的反向判断。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T \| null \| undefined` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

```typescript
import { isNotEmpty } from 'l-js-fn';

isNotEmpty('hello');     // true
isNotEmpty(null);        // false
isNotEmpty([]);          // false
```

## isObject

判断是否为普通对象（`[object Object]`）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean` — 是对象返回 `true`

**示例：**

```typescript
import { isObject } from 'l-js-fn';

isObject({});            // true
isObject({ a: 1 });      // true
isObject([]);            // false
isObject(null);          // false
isObject(new Date());    // false
```

## isArray

判断是否为数组。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

```typescript
import { isArray } from 'l-js-fn';

isArray([1, 2, 3]);      // true
isArray([]);             // true
isArray('hello');        // false
isArray({});             // false
```

## isImage

判断文件名是否为图片。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名 |

**返回值：** `boolean`

**支持的格式：** `jpg`、`jpeg`、`png`、`gif`、`bmp`、`webp`、`svg`

**示例：**

```typescript
import { isImage } from 'l-js-fn';

isImage('photo.png');    // true
isImage('doc.pdf');      // false
```

## isString

判断是否为字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 待检查的值 |

**返回值：** `boolean`

**示例：**

```typescript
import { isString } from 'l-js-fn';

isString('hello');       // true
isString(new String('a')); // true
isString(123);           // false
```

## isEmail

判断是否为有效邮箱地址。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | 邮箱字符串 |

**返回值：** `boolean`

**示例：**

```typescript
import { isEmail } from 'l-js-fn';

isEmail('test@example.com');  // true
isEmail('invalid-email');     // false
```

## isURL

判断是否为合法 URL。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `string` | 是 | URL 字符串 |

**返回值：** `boolean`

**示例：**

```typescript
import { isURL } from 'l-js-fn';

isURL('https://example.com'); // true
isURL('not-a-url');           // false
```

## isIdCard

判断是否为有效的中国大陆身份证号码（支持 15 位和 18 位）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| idCard | `string` | 是 | 身份证号 |

**返回值：** `boolean`

**示例：**

```typescript
import { isIdCard } from 'l-js-fn';

isIdCard('110101199001011234'); // true（18位）
isIdCard('110101900101123');    // true（15位）
isIdCard('123456789012345678'); // false
```

## isPhoneNumber

判断是否为有效的中国大陆手机号码。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | `string` | 是 | 手机号 |

**返回值：** `boolean`

**示例：**

```typescript
import { isPhoneNumber } from 'l-js-fn';

isPhoneNumber('13800138000'); // true
isPhoneNumber('1380013800');  // false
```

## isEqual

深度比较两个值是否相等（支持对象、数组、NaN 比较）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 第一个值 |
| other | `T` | 是 | 第二个值 |

**返回值：** `boolean`

**示例：**

```typescript
import { isEqual } from 'l-js-fn';

isEqual({ a: 1 }, { a: 1 });     // true
isEqual([1, 2], [1, 2]);         // true
isEqual(NaN, NaN);               // true
isEqual({ a: { b: 1 } }, { a: { b: 1 } }); // true
isEqual({ a: 1 }, { a: 2 });     // false
```

## validateParams

校验参数对象中必填字段是否都存在且非空。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| required | `string[]` | 是 | 必填字段数组 |
| params | `Record<string, any>` | 是 | 待校验的参数对象 |

**返回值：** `string \| null` — 未通过的字段名，全部通过返回 `null`

**示例：**

```typescript
import { validateParams } from 'l-js-fn';

validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'
```
