# url-kit — URL 处理

URL 处理工具集，提供参数解析、拼接、转换等功能。

## 1. getUrlParams 解析URL查询参数

解析 URL 查询参数，支持数组参数和嵌套对象参数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 否 | 要解析的 URL，不提供则使用当前页面 URL（浏览器环境） |

**返回值：** `T` — 包含查询参数的对象

**异常：** 非浏览器环境未提供 URL 时抛出 `Error`

**示例：**

::: code-group
```ts [TypeScript]
import { getUrlParams } from 'l-js-fn';

getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

getUrlParams('https://example.com?a=1&a=2');
// { a: ['1', '2'] }

getUrlParams('https://example.com?user[name]=John&user[age]=20');
// { user: { name: 'John', age: '20' } }
```

```js [JavaScript (ESM)]
import { getUrlParams } from 'l-js-fn';

getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

getUrlParams('https://example.com?a=1&a=2');
// { a: ['1', '2'] }

getUrlParams('https://example.com?user[name]=John&user[age]=20');
// { user: { name: 'John', age: '20' } }
```

```js [JavaScript (CJS)]
const { getUrlParams } = require('l-js-fn');

getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

getUrlParams('https://example.com?a=1&a=2');
// { a: ['1', '2'] }

getUrlParams('https://example.com?user[name]=John&user[age]=20');
// { user: { name: 'John', age: '20' } }
```
:::

## 2. getUrlParam 获取单个参数

获取指定查询参数的值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string \| undefined` | 否 | 要解析的 URL |
| key | `string` | 是 | 参数键名 |

**返回值：** `T \| null` — 参数值，不存在返回 `null`

**示例：**

::: code-group
```ts [TypeScript]
import { getUrlParam } from 'l-js-fn';

getUrlParam('https://example.com?id=1', 'id');    // '1'
getUrlParam('https://example.com?id=1', 'name');  // null
```

```js [JavaScript (ESM)]
import { getUrlParam } from 'l-js-fn';

getUrlParam('https://example.com?id=1', 'id');    // '1'
getUrlParam('https://example.com?id=1', 'name');  // null
```

```js [JavaScript (CJS)]
const { getUrlParam } = require('l-js-fn');

getUrlParam('https://example.com?id=1', 'id');    // '1'
getUrlParam('https://example.com?id=1', 'name');  // null
```
:::

## 3. appendUrlParam 添加URL参数

向 URL 添加参数，支持控制参数放在 `#` 前或 `#` 后。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | URL 地址 |
| paramName | `string` | 是 | 参数名 |
| paramValue | `T` | 否 | 参数值 |
| options | `AppendUrlOptions` | 否 | 配置项，`position` 控制参数追加位置 |

**返回值：** `string | null` — 新的 URL，参数无效返回 `null`；`paramValue` 为 `undefined` 时仅追加参数名；为空字符串时追加 `?key=`

**示例：**

::: code-group
```ts [TypeScript]
import { appendUrlParam } from 'l-js-fn';

appendUrlParam('https://example.com', 'id', 1);
// 'https://example.com?id=1'

appendUrlParam('https://example.com?id=1', 'name', 'John');
// 'https://example.com?id=1&name=John'

// 默认追加到 # 后
appendUrlParam('https://example.com/#/home', 'id', '1');
// 'https://example.com/#/home?id=1'

// 参数放在 # 前
appendUrlParam('https://example.com/#/home', 'id', '1', { position: 'before' });
// 'https://example.com/?id=1#/home'
```

```js [JavaScript (ESM)]
import { appendUrlParam } from 'l-js-fn';

appendUrlParam('https://example.com', 'id', 1);
// 'https://example.com?id=1'

appendUrlParam('https://example.com?id=1', 'name', 'John');
// 'https://example.com?id=1&name=John'

// 默认追加到 # 后
appendUrlParam('https://example.com/#/home', 'id', '1');
// 'https://example.com/#/home?id=1'

// 参数放在 # 前
appendUrlParam('https://example.com/#/home', 'id', '1', { position: 'before' });
// 'https://example.com/?id=1#/home'
```

```js [JavaScript (CJS)]
const { appendUrlParam } = require('l-js-fn');

appendUrlParam('https://example.com', 'id', 1);
// 'https://example.com?id=1'

appendUrlParam('https://example.com?id=1', 'name', 'John');
// 'https://example.com?id=1&name=John'

// 默认追加到 # 后
appendUrlParam('https://example.com/#/home', 'id', '1');
// 'https://example.com/#/home?id=1'

// 参数放在 # 前
appendUrlParam('https://example.com/#/home', 'id', '1', { position: 'before' });
// 'https://example.com/?id=1#/home'
```
:::

## 4. appendUrlParams 批量添加URL参数

向 URL 批量添加查询参数，兼容 hash 和 history 路由模式，自动判断使用 `?` 还是 `&`。默认追加在 `#` 之后，可通过 `position: 'before'` 放在 `#` 之前。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | URL 地址 |
| params | `Record<string, any>` | 是 | 参数键值对对象 |
| options | `AppendUrlOptions` | 否 | 配置项，`position` 控制参数放在 `#` 前 (`'before'`) 或 `#` 后 (`'after'`，默认) |

**返回值：** `string | null` — 新的 URL，参数无效返回 `null`

**示例：**

::: code-group
```ts [TypeScript]
import { appendUrlParams } from 'l-js-fn';

appendUrlParams('https://example.com', { name: 'zs', age: '1' });
// 'https://example.com?name=zs&age=1'

appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' });
// 'https://example.com?id=1&name=zs&age=1'

// 默认：参数追加到 # 后
appendUrlParams('https://example.com/#/path', { name: 'zs' });
// 'https://example.com/#/path?name=zs'

appendUrlParams('https://example.com/?id=1#/path', { name: 'zs' });
// 'https://example.com/?id=1#/path?name=zs'

appendUrlParams('https://example.com#section', { name: 'zs' });
// 'https://example.com#section?name=zs'

// 参数放在 # 前
appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' }, { position: 'before' });
// 'https://example.com/?id=1&name=yyp#/home'

// History 模式（无 # 时退化为普通拼接）
appendUrlParams('https://example.com/user/list', { name: 'zs' });
// 'https://example.com/user/list?name=zs'
```

```js [JavaScript (ESM)]
import { appendUrlParams } from 'l-js-fn';

appendUrlParams('https://example.com', { name: 'zs', age: '1' });
// 'https://example.com?name=zs&age=1'

appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' });
// 'https://example.com?id=1&name=zs&age=1'

// 默认：参数追加到 # 后
appendUrlParams('https://example.com/#/path', { name: 'zs' });
// 'https://example.com/#/path?name=zs'

appendUrlParams('https://example.com/?id=1#/path', { name: 'zs' });
// 'https://example.com/?id=1#/path?name=zs'

appendUrlParams('https://example.com#section', { name: 'zs' });
// 'https://example.com#section?name=zs'

// 参数放在 # 前
appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' }, { position: 'before' });
// 'https://example.com/?id=1&name=yyp#/home'

// History 模式（无 # 时退化为普通拼接）
appendUrlParams('https://example.com/user/list', { name: 'zs' });
// 'https://example.com/user/list?name=zs'
```

```js [JavaScript (CJS)]
const { appendUrlParams } = require('l-js-fn');

appendUrlParams('https://example.com', { name: 'zs', age: '1' });
// 'https://example.com?name=zs&age=1'

appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' });
// 'https://example.com?id=1&name=zs&age=1'

// 默认：参数追加到 # 后
appendUrlParams('https://example.com/#/path', { name: 'zs' });
// 'https://example.com/#/path?name=zs'

appendUrlParams('https://example.com/?id=1#/path', { name: 'zs' });
// 'https://example.com/?id=1#/path?name=zs'

appendUrlParams('https://example.com#section', { name: 'zs' });
// 'https://example.com#section?name=zs'

// 参数放在 # 前
appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' }, { position: 'before' });
// 'https://example.com/?id=1&name=yyp#/home'

// History 模式（无 # 时退化为普通拼接）
appendUrlParams('https://example.com/user/list', { name: 'zs' });
// 'https://example.com/user/list?name=zs'
```
:::

## 5. transUrlParams 对象转查询字符串

将对象转换为 URL 查询字符串，支持嵌套对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| params | `Record<string, any>` | 是 | 要转换的对象 |

**返回值：** `string` — 查询字符串

**示例：**

::: code-group
```ts [TypeScript]
import { transUrlParams } from 'l-js-fn';

transUrlParams({ id: 1, name: 'John' });
// 'id=1&name=John'

transUrlParams({ user: { name: 'John', age: 20 } });
// 'user[name]=John&user[age]=20'
```

```js [JavaScript (ESM)]
import { transUrlParams } from 'l-js-fn';

transUrlParams({ id: 1, name: 'John' });
// 'id=1&name=John'

transUrlParams({ user: { name: 'John', age: 20 } });
// 'user[name]=John&user[age]=20'
```

```js [JavaScript (CJS)]
const { transUrlParams } = require('l-js-fn');

transUrlParams({ id: 1, name: 'John' });
// 'id=1&name=John'

transUrlParams({ user: { name: 'John', age: 20 } });
// 'user[name]=John&user[age]=20'
```
:::

## 6. getFileInfoToUrl 提取文件信息

从 URL 中提取文件名及后缀。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 文件 URL |

**返回值：** `FileInfo` — 包含 `fileName` 和 `extension` 的对象

**示例：**

::: code-group
```ts [TypeScript]
import { getFileInfoToUrl } from 'l-js-fn';

getFileInfoToUrl('https://example.com/path/to/file.txt');
// { fileName: 'file.txt', extension: '.txt' }

getFileInfoToUrl('https://example.com/image.png');
// { fileName: 'image.png', extension: '.png' }
```

```js [JavaScript (ESM)]
import { getFileInfoToUrl } from 'l-js-fn';

getFileInfoToUrl('https://example.com/path/to/file.txt');
// { fileName: 'file.txt', extension: '.txt' }

getFileInfoToUrl('https://example.com/image.png');
// { fileName: 'image.png', extension: '.png' }
```

```js [JavaScript (CJS)]
const { getFileInfoToUrl } = require('l-js-fn');

getFileInfoToUrl('https://example.com/path/to/file.txt');
// { fileName: 'file.txt', extension: '.txt' }

getFileInfoToUrl('https://example.com/image.png');
// { fileName: 'image.png', extension: '.png' }
```
:::
