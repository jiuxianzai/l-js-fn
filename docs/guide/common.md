# common — 通用工具

通用工具函数集，提供防抖、节流、深拷贝、设备检测等常用功能。

## 1. sleep 睡眠延迟

睡眠函数，延迟指定毫秒数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| time | `number` | 是 | 睡眠时间（毫秒） |

**返回值：** `Promise<void>`

**示例：**

::: code-group
```ts [TypeScript]
import { sleep } from 'l-js-fn';

async function demo() {
  console.log('开始');
  await sleep(1000); // 等待 1 秒
  console.log('1 秒后');
}
```

```js [JavaScript (ESM)]
import { sleep } from 'l-js-fn';

async function demo() {
  console.log('开始');
  await sleep(1000); // 等待 1 秒
  console.log('1 秒后');
}
```

```js [JavaScript (CJS)]
const { sleep } = require('l-js-fn');

async function demo() {
  console.log('开始');
  await sleep(1000); // 等待 1 秒
  console.log('1 秒后');
}
```
:::

## 2. debounce 防抖函数

创建防抖函数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| func | `Function` | 是 | 要防抖的函数 |
| wait | `number` | 否 | 等待时间（毫秒），默认 `300` |
| immediate | `boolean` | 否 | 是否立即执行，默认 `false` |

**返回值：** `Function` — 防抖后的函数

**示例：**

::: code-group
```ts [TypeScript]
import { debounce } from 'l-js-fn';

const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 500);

// 快速输入时只会在停止输入 500ms 后执行一次
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 最终只输出 "搜索: abc"
```

```js [JavaScript (ESM)]
import { debounce } from 'l-js-fn';

const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 500);

// 快速输入时只会在停止输入 500ms 后执行一次
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 最终只输出 "搜索: abc"
```

```js [JavaScript (CJS)]
const { debounce } = require('l-js-fn');

const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 500);

// 快速输入时只会在停止输入 500ms 后执行一次
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 最终只输出 "搜索: abc"
```
:::

## 3. throttle 节流函数

创建节流函数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| func | `Function` | 是 | 要节流的函数 |
| wait | `number` | 否 | 等待时间（毫秒），默认 `300` |

**返回值：** `Function` — 节流后的函数

**示例：**

::: code-group
```ts [TypeScript]
import { throttle } from 'l-js-fn';

const handleScroll = throttle(() => {
  console.log('滚动中');
}, 200);

// 每 200ms 最多执行一次
window.addEventListener('scroll', handleScroll);
```

```js [JavaScript (ESM)]
import { throttle } from 'l-js-fn';

const handleScroll = throttle(() => {
  console.log('滚动中');
}, 200);

// 每 200ms 最多执行一次
window.addEventListener('scroll', handleScroll);
```

```js [JavaScript (CJS)]
const { throttle } = require('l-js-fn');

const handleScroll = throttle(() => {
  console.log('滚动中');
}, 200);

// 每 200ms 最多执行一次
window.addEventListener('scroll', handleScroll);
```
:::

## 4. getType 获取详细类型

获取值的详细类型。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 要检查的值 |

**返回值：** `string` — 类型字符串

**示例：**

::: code-group
```ts [TypeScript]
import { getType } from 'l-js-fn';

getType(null);           // 'null'
getType(undefined);      // 'undefined'
getType([]);             // 'array'
getType(new Date());     // 'date'
getType(/abc/);          // 'regexp'
getType(() => {});       // 'function'
getType('hello');        // 'string'
getType(123);            // 'number'
getType({});             // 'object'
```

```js [JavaScript (ESM)]
import { getType } from 'l-js-fn';

getType(null);           // 'null'
getType(undefined);      // 'undefined'
getType([]);             // 'array'
getType(new Date());     // 'date'
getType(/abc/);          // 'regexp'
getType(() => {});       // 'function'
getType('hello');        // 'string'
getType(123);            // 'number'
getType({});             // 'object'
```

```js [JavaScript (CJS)]
const { getType } = require('l-js-fn');

getType(null);           // 'null'
getType(undefined);      // 'undefined'
getType([]);             // 'array'
getType(new Date());     // 'date'
getType(/abc/);          // 'regexp'
getType(() => {});       // 'function'
getType('hello');        // 'string'
getType(123);            // 'number'
getType({});             // 'object'
```
:::

## 5. deepClone 深拷贝

深拷贝函数，支持循环引用。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 要深拷贝的对象 |
| options | `object` | 否 | 配置选项 |
| options.cloneFunctions | `boolean` | 否 | 是否克隆函数，默认 `false` |
| options.cloneSpecialObjects | `boolean` | 否 | 是否克隆 DOM 节点等特殊对象，默认 `false` |

**返回值：** `T` — 深拷贝后的对象

**示例：**

::: code-group
```ts [TypeScript]
import { deepClone } from 'l-js-fn';

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);

cloned.b.c = 3;
console.log(obj.b.c); // 2（原对象未受影响）

// 循环引用
const a: any = { name: 'a' };
a.self = a;
const clonedA = deepClone(a);
console.log(clonedA.self === clonedA); // true
```

```js [JavaScript (ESM)]
import { deepClone } from 'l-js-fn';

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);

cloned.b.c = 3;
console.log(obj.b.c); // 2（原对象未受影响）

// 循环引用
const a: any = { name: 'a' };
a.self = a;
const clonedA = deepClone(a);
console.log(clonedA.self === clonedA); // true
```

```js [JavaScript (CJS)]
const { deepClone } = require('l-js-fn');

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);

cloned.b.c = 3;
console.log(obj.b.c); // 2（原对象未受影响）

// 循环引用
const a: any = { name: 'a' };
a.self = a;
const clonedA = deepClone(a);
console.log(clonedA.self === clonedA); // true
```
:::

## 6. syntaxHighlight 语法高亮

将对象格式化为带 HTML 语法高亮的字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 要格式化的对象或数组 |
| indent | `number` | 否 | 当前缩进层级，默认 `0` |

**返回值：** `string` — HTML 格式化字符串

**示例：**

::: code-group
```ts [TypeScript]
import { syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John', age: 20 });
// 返回带颜色的 HTML 字符串，可直接用于 v-html
```

```js [JavaScript (ESM)]
import { syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John', age: 20 });
// 返回带颜色的 HTML 字符串，可直接用于 v-html
```

```js [JavaScript (CJS)]
const { syntaxHighlight } = require('l-js-fn');

const html = syntaxHighlight({ name: 'John', age: 20 });
// 返回带颜色的 HTML 字符串，可直接用于 v-html
```
:::

## 7. syntaxHtmlToJson HTML转JSON

将带语法高亮的 HTML 转换回 JSON 对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| html | `string` | 是 | HTML 字符串 |

**返回值：** `object \| array \| string` — 解析成功返回对象/数组，失败返回原字符串

**示例：**

::: code-group
```ts [TypeScript]
import { syntaxHtmlToJson, syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John' });
const obj = syntaxHtmlToJson(html);
// { name: 'John' }
```

```js [JavaScript (ESM)]
import { syntaxHtmlToJson, syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John' });
const obj = syntaxHtmlToJson(html);
// { name: 'John' }
```

```js [JavaScript (CJS)]
const { syntaxHtmlToJson, syntaxHighlight } = require('l-js-fn');

const html = syntaxHighlight({ name: 'John' });
const obj = syntaxHtmlToJson(html);
// { name: 'John' }
```
:::

## 8. loadScript 动态加载脚本

动态加载外部 JS 文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | `string \| null` | 是 | JS 文件路径 |

**返回值：** `Promise<HTMLScriptElement> \| undefined`

**示例：**

::: code-group
```ts [TypeScript]
import { loadScript } from 'l-js-fn';

await loadScript('https://example.com/sdk.js');
// 脚本加载完成
```

```js [JavaScript (ESM)]
import { loadScript } from 'l-js-fn';

await loadScript('https://example.com/sdk.js');
// 脚本加载完成
```

```js [JavaScript (CJS)]
const { loadScript } = require('l-js-fn');

await loadScript('https://example.com/sdk.js');
// 脚本加载完成
```
:::

::: warning 注意
- 如果脚本已存在（相同 `src`），返回已存在的 `HTMLScriptElement` 的 Promise
- `src` 为空时返回 `Promise.reject`
- 仅在浏览器环境中可用
:::

## 9. removeScript 移除加载的脚本

移除已加载的 JS 文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | `string` | 是 | JS 文件路径 |

**示例：**

::: code-group
```ts [TypeScript]
import { removeScript } from 'l-js-fn';

removeScript('https://example.com/sdk.js');
```

```js [JavaScript (ESM)]
import { removeScript } from 'l-js-fn';

removeScript('https://example.com/sdk.js');
```

```js [JavaScript (CJS)]
const { removeScript } = require('l-js-fn');

removeScript('https://example.com/sdk.js');
```
:::

## 10. getDevice 获取设备类型

获取设备类型。

**返回值：** `'miniProgram' \| 'alipayMiniProgram' \| 'alipay' \| 'wechat' \| 'android' \| 'ios' \| 'harmony' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'`

**示例：**

::: code-group
```ts [TypeScript]
import { getDevice } from 'l-js-fn';

getDevice(); // 'android' | 'ios' | 'wechat' | ...
```

```js [JavaScript (ESM)]
import { getDevice } from 'l-js-fn';

getDevice(); // 'android' | 'ios' | 'wechat' | ...
```

```js [JavaScript (CJS)]
const { getDevice } = require('l-js-fn');

getDevice(); // 'android' | 'ios' | 'wechat' | ...
```
:::

## 11. imageToBase64 图片转Base64

将图片转换为 Base64 字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | `File \| Blob \| string \| null` | 是 | 图片 URL 或 File/Blob |
| type | `string` | 否 | 输出类型，默认 `'image/png'` |
| quality | `number` | 否 | 压缩质量（0-1），默认 `1` |

**返回值：** `Promise<Result>` — 包含 Base64 字符串的结果对象

**示例：**

::: code-group
```ts [TypeScript]
import { imageToBase64 } from 'l-js-fn';

// 从 URL 转换
const result = await imageToBase64('https://example.com/image.png');
console.log(result.data); // 'data:image/png;base64,...'

// 从 File 对象转换
const file = document.querySelector('input[type="file"]').files[0];
const result2 = await imageToBase64(file, 'image/jpeg', 0.8);
```

```js [JavaScript (ESM)]
import { imageToBase64 } from 'l-js-fn';

// 从 URL 转换
const result = await imageToBase64('https://example.com/image.png');
console.log(result.data); // 'data:image/png;base64,...'

// 从 File 对象转换
const file = document.querySelector('input[type="file"]').files[0];
const result2 = await imageToBase64(file, 'image/jpeg', 0.8);
```

```js [JavaScript (CJS)]
const { imageToBase64 } = require('l-js-fn');

// 从 URL 转换
const result = await imageToBase64('https://example.com/image.png');
console.log(result.data); // 'data:image/png;base64,...'

// 从 File 对象转换
const file = document.querySelector('input[type="file"]').files[0];
const result2 = await imageToBase64(file, 'image/jpeg', 0.8);
```
:::

::: warning 注意
- `imageToBase64` 仅在浏览器环境中可用（依赖 Canvas API）
- 当 `input` 为 `null` 时，返回 `Result.fail('输入不能为空')`，不会抛出异常
:::

## 12. retry 异步重试

异步函数失败重试。

::: code-group
```ts [TypeScript]
import { retry } from 'l-js-fn';

const fetchData = retry(
  async () => {
    const res = await fetch('/api');
    if (!res.ok) throw new Error('request failed');
    return res.json();
  },
  { times: 3, delay: 1000 }
);

await fetchData(); // 失败后最多重试 3 次
```

```js [JavaScript (ESM)]
import { retry } from 'l-js-fn';

const fetchData = retry(
  async () => {
    const res = await fetch('/api');
    if (!res.ok) throw new Error('request failed');
    return res.json();
  },
  { times: 3, delay: 1000 }
);

await fetchData(); // 失败后最多重试 3 次
```

```js [JavaScript (CJS)]
const { retry } = require('l-js-fn');

const fetchData = retry(
  async () => {
    const res = await fetch('/api');
    if (!res.ok) throw new Error('request failed');
    return res.json();
  },
  { times: 3, delay: 1000 }
);

await fetchData(); // 失败后最多重试 3 次
```
:::

## 13. once 只执行一次

包装函数使其只执行一次。

::: code-group
```ts [TypeScript]
import { once } from 'l-js-fn';

const init = once(() => {
  console.log('初始化');
  return 'done';
});

init(); // 输出 '初始化' → 'done'
init(); // 直接返回 'done'（无输出）
```

```js [JavaScript (ESM)]
import { once } from 'l-js-fn';

const init = once(() => {
  console.log('初始化');
  return 'done';
});

init(); // 输出 '初始化' → 'done'
init(); // 直接返回 'done'（无输出）
```

```js [JavaScript (CJS)]
const { once } = require('l-js-fn');

const init = once(() => {
  console.log('初始化');
  return 'done';
});

init(); // 输出 '初始化' → 'done'
init(); // 直接返回 'done'（无输出）
```
:::

## 14. memoize 缓存计算结果

缓存函数计算结果，相同参数不重复执行。支持自定义缓存上限，默认 200 条。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fn | `T` | 是 | 需要缓存的函数 |
| maxSize | `number` | 否 | 最大缓存条目数，默认 200，设为 0 则不限制 |

::: code-group
```ts [TypeScript]
import { memoize } from 'l-js-fn';

const add = memoize((a: number, b: number) => {
  console.log('计算中');
  return a + b;
});

add(1, 2); // 输出 '计算中' → 3
add(1, 2); // 直接返回 3（缓存命中，无输出）
add(2, 3); // 输出 '计算中' → 5（不同参数重新计算）

// 自定义缓存上限
const fn = memoize(expensiveFn, 100);
```

```js [JavaScript (ESM)]
import { memoize } from 'l-js-fn';

const add = memoize((a: number, b: number) => {
  console.log('计算中');
  return a + b;
});

add(1, 2); // 输出 '计算中' → 3
add(1, 2); // 直接返回 3（缓存命中，无输出）
add(2, 3); // 输出 '计算中' → 5（不同参数重新计算）
```

```js [JavaScript (CJS)]
const { memoize } = require('l-js-fn');

const add = memoize((a: number, b: number) => {
  console.log('计算中');
  return a + b;
});

add(1, 2); // 输出 '计算中' → 3
add(1, 2); // 直接返回 3（缓存命中，无输出）
add(2, 3); // 输出 '计算中' → 5（不同参数重新计算）
```
:::
