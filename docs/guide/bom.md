# bom — 浏览器对象模型

浏览器对象模型工具集，提供滚动、全屏、剪贴板、Cookie 等浏览器相关操作。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/bom` 仍保留，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import {
  scrollTop, scrollToBottom, getScrollPosition, setScrollPosition,
  launchFullscreen, exitFullscreen, copyToClipboard,
  setCookie, getCookie, removeCookie, hasCookie, getAllCookies
} from 'l-js-fn';
```

```js [JavaScript (ESM)]
import {
  scrollTop, scrollToBottom, getScrollPosition, setScrollPosition,
  launchFullscreen, exitFullscreen, copyToClipboard,
  setCookie, getCookie, removeCookie, hasCookie, getAllCookies
} from 'l-js-fn';
```

```js [JavaScript (CJS)]
const {
  scrollTop, scrollToBottom, getScrollPosition, setScrollPosition,
  launchFullscreen, exitFullscreen, copyToClipboard,
  setCookie, getCookie, removeCookie, hasCookie, getAllCookies
} = require('l-js-fn/bom');
```
:::

## 1. 滚动操作

### 1.1 scrollTop 滚动到顶部

平滑滚动到页面顶部。

**返回值：** `void`

**示例：**

::: code-group
```ts [TypeScript]
import { scrollTop } from 'l-js-fn';

scrollTop();
```

```js [JavaScript (ESM)]
import { scrollTop } from 'l-js-fn';

scrollTop();
```

```js [JavaScript (CJS)]
const { scrollTop } = require('l-js-fn/bom');

scrollTop();
```
:::

### 1.2 scrollToBottom 滚动到底部

滚动到页面底部。

**返回值：** `void`

**示例：**

::: code-group
```ts [TypeScript]
import { scrollToBottom } from 'l-js-fn';

scrollToBottom();
```

```js [JavaScript (ESM)]
import { scrollToBottom } from 'l-js-fn';

scrollToBottom();
```

```js [JavaScript (CJS)]
const { scrollToBottom } = require('l-js-fn/bom');

scrollToBottom();
```
:::

### 1.3 getScrollPosition 获取滚动位置

获取当前页面滚动位置。

**返回值：** `ScrollPosition` — `{ x: number, y: number }`

**示例：**

::: code-group
```ts [TypeScript]
import { getScrollPosition } from 'l-js-fn';

const pos = getScrollPosition();
console.log(pos.x, pos.y); // 0, 100
```

```js [JavaScript (ESM)]
import { getScrollPosition } from 'l-js-fn';

const pos = getScrollPosition();
console.log(pos.x, pos.y); // 0, 100
```

```js [JavaScript (CJS)]
const { getScrollPosition } = require('l-js-fn/bom');

const pos = getScrollPosition();
console.log(pos.x, pos.y); // 0, 100
```
:::

### 1.4 setScrollPosition 设置滚动位置

设置页面滚动位置。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| position | `Partial<ScrollPosition>` | 是 | 目标滚动位置 `{ x?, y? }` |
| smooth | `boolean` | 否 | 是否平滑滚动，默认 `false` |

**返回值：** `void`

**示例：**

::: code-group
```ts [TypeScript]
import { setScrollPosition } from 'l-js-fn';

setScrollPosition({ y: 500 });         // 直接跳转
setScrollPosition({ y: 500 }, true);   // 平滑滚动
```

```js [JavaScript (ESM)]
import { setScrollPosition } from 'l-js-fn';

setScrollPosition({ y: 500 });         // 直接跳转
setScrollPosition({ y: 500 }, true);   // 平滑滚动
```

```js [JavaScript (CJS)]
const { setScrollPosition } = require('l-js-fn/bom');

setScrollPosition({ y: 500 });         // 直接跳转
setScrollPosition({ y: 500 }, true);   // 平滑滚动
```
:::

## 2. 全屏操作

### 2.1 launchFullscreen 进入全屏

进入全屏模式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| element | `HTMLElement` | 是 | 要全屏显示的元素 |

**返回值：** `Promise<boolean>` — 是否成功进入全屏

**示例：**

::: code-group
```ts [TypeScript]
import { launchFullscreen } from 'l-js-fn';

const video = document.getElementById('video');
const success = await launchFullscreen(video);
if (success) {
  console.log('已进入全屏');
}
```

```js [JavaScript (ESM)]
import { launchFullscreen } from 'l-js-fn';

const video = document.getElementById('video');
const success = await launchFullscreen(video);
if (success) {
  console.log('已进入全屏');
}
```

```js [JavaScript (CJS)]
const { launchFullscreen } = require('l-js-fn/bom');

const video = document.getElementById('video');
const success = await launchFullscreen(video);
if (success) {
  console.log('已进入全屏');
}
```
:::

### 2.2 exitFullscreen 退出全屏

退出全屏模式。

**返回值：** `Promise<boolean>` — 是否成功退出全屏

**示例：**

::: code-group
```ts [TypeScript]
import { exitFullscreen } from 'l-js-fn';

await exitFullscreen();
```

```js [JavaScript (ESM)]
import { exitFullscreen } from 'l-js-fn';

await exitFullscreen();
```

```js [JavaScript (CJS)]
const { exitFullscreen } = require('l-js-fn/bom');

await exitFullscreen();
```
:::

## 3. 剪贴板操作

### 3.1 copyToClipboard 复制到剪贴板

复制文本到剪贴板。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | `string` | 是 | 要复制的文本 |

**返回值：** `boolean` — 是否复制成功

**示例：**

::: code-group
```ts [TypeScript]
import { copyToClipboard } from 'l-js-fn';

await copyToClipboard('要复制的文本');
```

```js [JavaScript (ESM)]
import { copyToClipboard } from 'l-js-fn';

await copyToClipboard('要复制的文本');
```

```js [JavaScript (CJS)]
const { copyToClipboard } = require('l-js-fn/bom');

await copyToClipboard('要复制的文本');
```
:::

## 4. Cookie 操作

### 4.1 CookieOptions

Cookie 配置选项接口：

```ts
interface CookieOptions {
  expires?: number;      // 过期时间（天数），默认 7 天
  path?: string;         // 路径，默认 '/'
  domain?: string;       // 域名
  secure?: boolean;      // 是否仅 HTTPS 传输
  httpOnly?: boolean;    // 是否禁止 JavaScript 访问
  sameSite?: 'strict' | 'lax' | 'none'; // SameSite 属性
}
```

::: warning 注意
`httpOnly` 选项在客户端设置 Cookie 时无效。`httpOnly` Cookie 只能由服务端通过 `Set-Cookie` 响应头设置。客户端传入此选项只会输出 `console.warn` 警告。
:::

### 4.2 setCookie 设置Cookie

设置 Cookie。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |
| value | `string` | 是 | Cookie 值 |
| options | `CookieOptions` | 否 | 配置选项 |

**返回值：** `boolean` — 是否设置成功

**示例：**

::: code-group
```ts [TypeScript]
import { setCookie } from 'l-js-fn';

setCookie('token', 'abc123', { expires: 30, secure: true });
setCookie('user', 'john', { expires: 7, path: '/' });
```

```js [JavaScript (ESM)]
import { setCookie } from 'l-js-fn';

setCookie('token', 'abc123', { expires: 30, secure: true });
setCookie('user', 'john', { expires: 7, path: '/' });
```

```js [JavaScript (CJS)]
const { setCookie } = require('l-js-fn/bom');

setCookie('token', 'abc123', { expires: 30, secure: true });
setCookie('user', 'john', { expires: 7, path: '/' });
```
:::

### 4.3 getCookie 获取Cookie

获取 Cookie 值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |

**返回值：** `string \| null` — Cookie 值，不存在返回 `null`

**示例：**

::: code-group
```ts [TypeScript]
import { getCookie } from 'l-js-fn';

getCookie('token'); // 'abc123'
getCookie('notexist'); // null
```

```js [JavaScript (ESM)]
import { getCookie } from 'l-js-fn';

getCookie('token'); // 'abc123'
getCookie('notexist'); // null
```

```js [JavaScript (CJS)]
const { getCookie } = require('l-js-fn/bom');

getCookie('token'); // 'abc123'
getCookie('notexist'); // null
```
:::

### 4.4 removeCookie 删除Cookie

删除 Cookie。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |
| options | `Pick<CookieOptions, 'path' | 'domain'>` | 否 | 配置选项（需与设置时一致） |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { removeCookie } from 'l-js-fn';

removeCookie('token');
removeCookie('user', { path: '/', domain: '.example.com' });
```

```js [JavaScript (ESM)]
import { removeCookie } from 'l-js-fn';

removeCookie('token');
removeCookie('user', { path: '/', domain: '.example.com' });
```

```js [JavaScript (CJS)]
const { removeCookie } = require('l-js-fn/bom');

removeCookie('token');
removeCookie('user', { path: '/', domain: '.example.com' });
```
:::

### 4.5 hasCookie 检查Cookie

检查 Cookie 是否存在。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { hasCookie } from 'l-js-fn';

hasCookie('token'); // true | false
```

```js [JavaScript (ESM)]
import { hasCookie } from 'l-js-fn';

hasCookie('token'); // true | false
```

```js [JavaScript (CJS)]
const { hasCookie } = require('l-js-fn/bom');

hasCookie('token'); // true | false
```
:::

### 4.6 getAllCookies 获取全部Cookie

获取所有 Cookie。

**返回值：** `Record<string, string>` — 键值对对象

**示例：**

::: code-group
```ts [TypeScript]
import { getAllCookies } from 'l-js-fn';

getAllCookies(); // { token: 'abc123', user: 'john' }
```

```js [JavaScript (ESM)]
import { getAllCookies } from 'l-js-fn';

getAllCookies(); // { token: 'abc123', user: 'john' }
```

```js [JavaScript (CJS)]
const { getAllCookies } = require('l-js-fn/bom');

getAllCookies(); // { token: 'abc123', user: 'john' }
```
:::
