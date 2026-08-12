# uniapp — 剪贴板 (Clipboard)

剪贴板模块封装了复制 / 读取系统剪贴板的常用操作。**微信 `setClipboardData({ data })`、支付宝 `setClipboard({ text })` 的参数差异已由适配层自动处理**，业务代码只需关心内容本身。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；**主包中命名为 `uniClipboard`**，子路径 `l-js-fn/uniapp` 保留原始命名 `clipboard`，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { uniClipboard } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { uniClipboard } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { clipboard } = require('l-js-fn/uniapp');
```
:::

> **平台支持：** 微信 / 支付宝 / H5 / App 均支持剪贴板。

---

## 1. copy() 复制文本

将文本写入系统剪贴板，结果统一返回布尔值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| text | `string` | 是 | 待复制的文本 |

**返回值：** `Promise<boolean>` — 复制成功 `true`；平台不支持或失败 `false`

**示例：**

::: code-group
```ts [TypeScript]
import { uniClipboard } from 'l-js-fn';

const ok = await uniClipboard.copy('复制内容');
if (ok) {
  console.log('已复制到剪贴板');
}
```

```js [JavaScript (ESM)]
import { uniClipboard } from 'l-js-fn';

const ok = await uniClipboard.copy('复制内容');
if (ok) {
  console.log('已复制到剪贴板');
}
```

```js [JavaScript (CJS)]
const { clipboard } = require('l-js-fn/uniapp');

clipboard.copy('复制内容').then((ok) => {
  console.log(ok ? '已复制到剪贴板' : '复制失败');
});
```
:::

> **提示：** 小程序平台复制成功后会自带「已复制」轻提示（微信可通过在 `success` 回调里调用 `uniToast.success` 覆盖）。

---

## 2. read() 读取剪贴板

读取系统剪贴板中的文本内容。

**参数说明：**

无参数。

**返回值：** `Promise<string>` — 剪贴板文本；读取失败或平台不支持时返回空字符串 `''`

**示例：**

::: code-group
```ts [TypeScript]
import { uniClipboard } from 'l-js-fn';

const text = await uniClipboard.read();
console.log(text); // 剪贴板中的文本
```

```js [JavaScript (ESM)]
import { uniClipboard } from 'l-js-fn';

const text = await uniClipboard.read();
```

```js [JavaScript (CJS)]
const { clipboard } = require('l-js-fn/uniapp');

clipboard.read().then((text) => console.log(text));
```
:::

---

## 3. 完整示例：复制 → 读取回验

```ts
import { uniClipboard } from 'l-js-fn';

async function copyAndVerify() {
  const text = 'l-js-fn 复制测试 ' + Date.now();

  // 1. 复制
  const ok = await uniClipboard.copy(text);
  console.log('复制结果:', ok); // true

  // 2. 读取回验
  const readBack = await uniClipboard.read();
  console.log('读取内容:', readBack); // 与 text 一致
  console.log('往返一致:', readBack === text); // true
}
```

> 以上流程在微信、支付宝两端行为一致，参数差异已由模块内部自动处理。
