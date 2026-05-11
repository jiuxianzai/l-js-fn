# common — 通用工具

通用工具函数集，提供防抖、节流、深拷贝、设备检测等常用功能。

## sleep

睡眠函数，延迟指定毫秒数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| time | `number` | 是 | 睡眠时间（毫秒） |

**返回值：** `Promise<void>`

**示例：**

```typescript
import { sleep } from 'l-js-fn';

async function demo() {
  console.log('开始');
  await sleep(1000); // 等待 1 秒
  console.log('1 秒后');
}
```

## debounce

创建防抖函数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| func | `Function` | 是 | 要防抖的函数 |
| wait | `number` | 否 | 等待时间（毫秒），默认 `300` |
| immediate | `boolean` | 否 | 是否立即执行，默认 `false` |

**返回值：** `Function` — 防抖后的函数

**示例：**

```typescript
import { debounce } from 'l-js-fn';

const handleSearch = debounce((query: string) => {
  console.log('搜索:', query);
}, 500);

// 快速输入时只会在停止输入 500ms 后执行一次
handleSearch('a');
handleSearch('ab');
handleSearch('abc'); // 最终只输出 "搜索: abc"
```

## throttle

创建节流函数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| func | `Function` | 是 | 要节流的函数 |
| wait | `number` | 否 | 等待时间（毫秒），默认 `300` |

**返回值：** `Function` — 节流后的函数

**示例：**

```typescript
import { throttle } from 'l-js-fn';

const handleScroll = throttle(() => {
  console.log('滚动中');
}, 200);

// 每 200ms 最多执行一次
window.addEventListener('scroll', handleScroll);
```

## getType

获取值的详细类型。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| value | `T` | 是 | 要检查的值 |

**返回值：** `string` — 类型字符串

**示例：**

```typescript
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

## deepClone

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

```typescript
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

## syntaxHighlight

将对象格式化为带 HTML 语法高亮的字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| obj | `T` | 是 | 要格式化的对象或数组 |
| indent | `number` | 否 | 当前缩进层级，默认 `0` |

**返回值：** `string` — HTML 格式化字符串

**示例：**

```typescript
import { syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John', age: 20 });
// 返回带颜色的 HTML 字符串，可直接用于 v-html
```

## syntaxHtmlToJson

将带语法高亮的 HTML 转换回 JSON 对象。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| html | `string` | 是 | HTML 字符串 |

**返回值：** `object \| array \| string` — 解析成功返回对象/数组，失败返回原字符串

**示例：**

```typescript
import { syntaxHtmlToJson, syntaxHighlight } from 'l-js-fn';

const html = syntaxHighlight({ name: 'John' });
const obj = syntaxHtmlToJson(html);
// { name: 'John' }
```

## loadScript

动态加载外部 JS 文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | `string \| null` | 是 | JS 文件路径 |

**返回值：** `Promise<HTMLScriptElement> \| undefined`

**示例：**

```typescript
import { loadScript } from 'l-js-fn';

await loadScript('https://example.com/sdk.js');
// 脚本加载完成
```

## removeScript

移除已加载的 JS 文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| src | `string` | 是 | JS 文件路径 |

**示例：**

```typescript
import { removeScript } from 'l-js-fn';

removeScript('https://example.com/sdk.js');
```

## getDevice

获取设备类型。

**返回值：** `'miniProgram' \| 'alipayMiniProgram' \| 'alipay' \| 'wechat' \| 'android' \| 'ios' \| 'harmony' \| 'windows' \| 'macos' \| 'linux' \| 'unknown'`

**示例：**

```typescript
import { getDevice } from 'l-js-fn';

getDevice(); // 'android' | 'ios' | 'wechat' | ...
```

## imageToBase64

将图片转换为 Base64 字符串。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | `File \| Blob \| string \| null` | 是 | 图片 URL 或 File/Blob |
| type | `string` | 否 | 输出类型，默认 `'image/png'` |
| quality | `number` | 否 | 压缩质量（0-1），默认 `1` |

**返回值：** `Promise<Result>` — 包含 Base64 字符串的结果对象

**示例：**

```typescript
import { imageToBase64 } from 'l-js-fn';

// 从 URL 转换
const result = await imageToBase64('https://example.com/image.png');
console.log(result.data); // 'data:image/png;base64,...'

// 从 File 对象转换
const file = document.querySelector('input[type="file"]').files[0];
const result2 = await imageToBase64(file, 'image/jpeg', 0.8);
```
