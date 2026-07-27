# url-kit — URL 处理

URL 处理工具集，提供参数解析、拼接、转换等功能。

## getUrlParams 解析URL查询参数

解析 URL 查询参数，支持数组参数和嵌套对象参数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 否 | 要解析的 URL，不提供则使用当前页面 URL（浏览器环境） |

**返回值：** `T` — 包含查询参数的对象

**异常：** 非浏览器环境未提供 URL 时抛出 `Error`

**示例：**

```typescript
import { getUrlParams } from 'l-js-fn';

getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

getUrlParams('https://example.com?a=1&a=2');
// { a: ['1', '2'] }

getUrlParams('https://example.com?user[name]=John&user[age]=20');
// { user: { name: 'John', age: '20' } }
```

## getUrlParam 获取单个参数

获取指定查询参数的值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string \| undefined` | 否 | 要解析的 URL |
| key | `string` | 是 | 参数键名 |

**返回值：** `T \| null` — 参数值，不存在返回 `null`

**示例：**

```typescript
import { getUrlParam } from 'l-js-fn';

getUrlParam('https://example.com?id=1', 'id');    // '1'
getUrlParam('https://example.com?id=1', 'name');  // null
```

## appendUrlParam 添加URL参数

向 URL 添加参数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | URL 地址 |
| paramName | `string` | 是 | 参数名 |
| paramValue | `T` | 否 | 参数值 |

**返回值：** `string \| null` — 新的 URL，参数无效返回 `null`

**示例：**

```typescript
import { appendUrlParam } from 'l-js-fn';

appendUrlParam('https://example.com', 'id', 1);
// 'https://example.com?id=1'

appendUrlParam('https://example.com?id=1', 'name', 'John');
// 'https://example.com?id=1&name=John'
```

## transUrlParams 对象转查询字符串

将对象转换为 URL 查询字符串，支持嵌套对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| params | `Record<string, any>` | 是 | 要转换的对象 |

**返回值：** `string` — 查询字符串

**示例：**

```typescript
import { transUrlParams } from 'l-js-fn';

transUrlParams({ id: 1, name: 'John' });
// 'id=1&name=John'

transUrlParams({ user: { name: 'John', age: 20 } });
// 'user[name]=John&user[age]=20'
```

## getFileInfoToUrl 提取文件信息

从 URL 中提取文件名及后缀。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 文件 URL |

**返回值：** `FileInfo` — 包含 `fileName` 和 `extension` 的对象

**示例：**

```typescript
import { getFileInfoToUrl } from 'l-js-fn';

getFileInfoToUrl('https://example.com/path/to/file.txt');
// { fileName: 'file.txt', extension: '.txt' }

getFileInfoToUrl('https://example.com/image.png');
// { fileName: 'image.png', extension: '.png' }
```
