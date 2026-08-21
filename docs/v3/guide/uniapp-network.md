# uniapp — 网络状态 (Network)

网络模块封装了网络类型检测、在线状态判断与网络变化监听，用于离线提示、弱网降级等场景。**微信 / 支付宝 / H5 / App 四端统一 API**。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；**主包中命名为 `uniNetwork`**，子路径 `l-js-fn/uniapp` 保留原始命名 `network`，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { uniNetwork } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { uniNetwork } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { network } = require('l-js-fn/uniapp');
```
:::

> **平台支持：** 四端均支持网络状态 API；H5 端 `getNetworkType` 不可用时自动降级为 `navigator.onLine`。

---

## 1. type() 获取网络类型

**参数说明：**

无参数。

**返回值：** `Promise<NetworkType>`

```ts
type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'ethernet' | 'unknown' | 'none';
```

**示例：**

::: code-group
```ts [TypeScript]
import { uniNetwork } from 'l-js-fn';

const type = await uniNetwork.type();
if (type === 'none') {
  console.log('当前无网络');
} else {
  console.log('当前网络类型:', type); // 'wifi' | '4g' | ...
}
```

```js [JavaScript (ESM)]
import { uniNetwork } from 'l-js-fn';

const type = await uniNetwork.type();
console.log(type);
```

```js [JavaScript (CJS)]
const { network } = require('l-js-fn/uniapp');

network.type().then((type) => console.log(type));
```
:::

---

## 2. isOnline() 判断是否联网

**参数说明：**

无参数。

**返回值：** `Promise<boolean>` — 在线 `true`，离线（`type === 'none'`）`false`

**示例：**

```ts
import { uniNetwork } from 'l-js-fn';

const online = await uniNetwork.isOnline();
if (!online) {
  // 展示离线提示 / 加载缓存数据
}
```

---

## 3. watch() 监听网络变化

注册网络状态变化监听，断网 / 恢复联网时触发回调。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| callback | `(isConnected: boolean, networkType: NetworkType) => void` | 是 | 变化回调 |

**示例：**

```ts
import { uniNetwork } from 'l-js-fn';

uniNetwork.watch((isConnected, type) => {
  console.log(isConnected, type);
  // 联网时: true 'wifi'
  // 断网时: false 'none'
});
```

---

## 4. off() 移除监听

移除 `watch()` 注册的网络状态监听。

**参数说明：**

无参数。

**示例：**

```ts
import { uniNetwork } from 'l-js-fn';

uniNetwork.off(); // 页面 onUnload 时移除，避免泄漏
```

---

## 5. 完整示例：离线提示

```ts
import { uniNetwork, uniToast } from 'l-js-fn';

async function initNetwork() {
  // 1. 进入页面时检测一次
  const online = await uniNetwork.isOnline();
  if (!online) {
    uniToast.error('网络异常，请检查网络连接');
  }

  // 2. 监听后续变化
  uniNetwork.watch((isConnected, type) => {
    if (isConnected) {
      uniToast.success('网络已恢复');
    } else {
      uniToast.error('网络已断开');
    }
  });
}

// onUnload 时移除监听
function onPageUnload() {
  uniNetwork.off();
}
```

> **H5 兜底：** `uni.getNetworkType` / `onNetworkStatusChange` 在 H5 端不可用时，模块自动降级为浏览器 `navigator.onLine` 与 `online`/`offline` 事件，API 行为保持一致。
