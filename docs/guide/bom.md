# bom — 浏览器对象模型

浏览器对象模型工具集，提供滚动、全屏、剪贴板、Cookie 等浏览器相关操作。

**导入方式：**

```typescript
import {
  scrollTop, scrollToBottom, getScrollPosition, setScrollPosition,
  launchFullscreen, exitFullscreen, copyToClipboard,
  setCookie, getCookie, removeCookie, hasCookie, getAllCookies
} from 'l-js-fn/bom';
```

## 滚动操作

### scrollTop

平滑滚动到页面顶部。

**返回值：** `void`

**示例：**

```typescript
import { scrollTop } from 'l-js-fn/bom';

scrollTop();
```

### scrollToBottom

滚动到页面底部。

**返回值：** `void`

**示例：**

```typescript
import { scrollToBottom } from 'l-js-fn/bom';

scrollToBottom();
```

### getScrollPosition

获取当前页面滚动位置。

**返回值：** `ScrollPosition` — `{ x: number, y: number }`

**示例：**

```typescript
import { getScrollPosition } from 'l-js-fn/bom';

const pos = getScrollPosition();
console.log(pos.x, pos.y); // 0, 100
```

### setScrollPosition

设置页面滚动位置。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| position | `Partial<ScrollPosition>` | 是 | 目标滚动位置 `{ x?, y? }` |
| smooth | `boolean` | 否 | 是否平滑滚动，默认 `false` |

**返回值：** `void`

**示例：**

```typescript
import { setScrollPosition } from 'l-js-fn/bom';

setScrollPosition({ y: 500 });         // 直接跳转
setScrollPosition({ y: 500 }, true);   // 平滑滚动
```

## 全屏操作

### launchFullscreen

进入全屏模式。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| element | `HTMLElement` | 是 | 要全屏显示的元素 |

**返回值：** `Promise<boolean>` — 是否成功进入全屏

**示例：**

```typescript
import { launchFullscreen } from 'l-js-fn/bom';

const video = document.getElementById('video');
const success = await launchFullscreen(video);
if (success) {
  console.log('已进入全屏');
}
```

### exitFullscreen

退出全屏模式。

**返回值：** `Promise<boolean>` — 是否成功退出全屏

**示例：**

```typescript
import { exitFullscreen } from 'l-js-fn/bom';

await exitFullscreen();
```

## 剪贴板操作

### copyToClipboard

复制文本到剪贴板。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | `string` | 是 | 要复制的文本 |

**返回值：** `boolean` — 是否复制成功

**示例：**

```typescript
import { copyToClipboard } from 'l-js-fn/bom';

await copyToClipboard('要复制的文本');
```

## Cookie 操作

### CookieOptions

Cookie 配置选项接口：

```typescript
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

### setCookie

设置 Cookie。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |
| value | `string` | 是 | Cookie 值 |
| options | `CookieOptions` | 否 | 配置选项 |

**返回值：** `boolean` — 是否设置成功

**示例：**

```typescript
import { setCookie } from 'l-js-fn/bom';

setCookie('token', 'abc123', { expires: 30, secure: true });
setCookie('user', 'john', { expires: 7, path: '/' });
```

### getCookie

获取 Cookie 值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |

**返回值：** `string \| null` — Cookie 值，不存在返回 `null`

**示例：**

```typescript
import { getCookie } from 'l-js-fn/bom';

getCookie('token'); // 'abc123'
getCookie('notexist'); // null
```

### removeCookie

删除 Cookie。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |
| options | `Pick<CookieOptions, 'path' | 'domain'>` | 否 | 配置选项（需与设置时一致） |

**返回值：** `boolean`

**示例：**

```typescript
import { removeCookie } from 'l-js-fn/bom';

removeCookie('token');
removeCookie('user', { path: '/', domain: '.example.com' });
```

### hasCookie

检查 Cookie 是否存在。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| name | `string` | 是 | Cookie 名称 |

**返回值：** `boolean`

**示例：**

```typescript
import { hasCookie } from 'l-js-fn/bom';

hasCookie('token'); // true | false
```

### getAllCookies

获取所有 Cookie。

**返回值：** `Record<string, string>` — 键值对对象

**示例：**

```typescript
import { getAllCookies } from 'l-js-fn/bom';

getAllCookies(); // { token: 'abc123', user: 'john' }
```
