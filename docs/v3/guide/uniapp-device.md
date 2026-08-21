# uniapp — 设备/UI 适配 (Device)

设备模块针对**状态栏高度、安全区、胶囊按钮**等 UI 适配刚需场景，自动读取系统信息并缓存，**一份代码同时适配微信 / 支付宝 / H5 / App**，无需关心平台差异。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；**主包中命名为 `uniDevice`**，子路径 `l-js-fn/uniapp` 保留原始命名 `device`，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { uniDevice } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { uniDevice } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { device } = require('l-js-fn/uniapp');
```
:::

> **平台支持：** 系统信息四端均支持；胶囊按钮仅微信 / 支付宝小程序（其余平台返回 `null`）。

---

## 1. info() 设备信息

返回设备 / 系统信息，**首次调用读取并缓存**（横竖屏切换后用 `refresh()` 强制刷新）。

**参数说明：**

无参数。

**返回值：** `DeviceInfo`

```ts
interface DeviceInfo {
  brand: string;            // 设备品牌，如 'iPhone' / 'HUAWEI'
  model: string;            // 设备型号，如 'iPhone 15 Pro'
  system: string;           // 操作系统版本，如 'iOS 17.0' / 'Android 14'
  platform: string;         // 平台标识，如 'ios' / 'android' / 'mp-weixin'
  statusBarHeight: number;  // 状态栏高度（px）
  screenWidth: number;      // 屏幕宽度（px）
  screenHeight: number;     // 屏幕高度（px）
  windowWidth: number;      // 可使用窗口宽度（px）
  windowHeight: number;     // 可使用窗口高度（px）
  pixelRatio: number;       // 像素比
  safeArea?: SafeArea;      // 安全区域（原样透传，可能为 undefined）
  safeAreaInsets: SafeAreaInsets; // 安全区内边距（由 safeArea 计算）
}

interface SafeAreaInsets { top: number; right: number; bottom: number; left: number; }
```

**示例：**

::: code-group
```ts [TypeScript]
import { uniDevice } from 'l-js-fn';

const info = uniDevice.info();
console.log(info);
// {
//   brand: 'iPhone', model: 'iPhone 15 Pro', system: 'iOS 17.0',
//   statusBarHeight: 47, screenWidth: 390, screenHeight: 844,
//   pixelRatio: 3, safeArea: {...}, safeAreaInsets: { top: 47, bottom: 74, ... }
// }
```

```js [JavaScript (ESM)]
import { uniDevice } from 'l-js-fn';

const info = uniDevice.info();
console.log(info.statusBarHeight, info.safeAreaInsets);
```

```js [JavaScript (CJS)]
const { device } = require('l-js-fn/uniapp');

const info = device.info();
console.log(info.screenWidth, info.pixelRatio);
```
:::

> **safeAreaInsets 计算规则：** 平台存在 `safeArea` 时按 `screenWidth/Height - safeArea` 推导四边内边距；缺失时以 `statusBarHeight` 兜底（仅 `top` 有值，其余为 `0`）。

---

## 2. refresh() 强制刷新

清除缓存并重新读取系统信息（横竖屏切换、`onResize` 时调用）。

**参数说明：**

无参数。

**返回值：** `DeviceInfo` — 刷新后的设备信息

**示例：**

```ts
import { uniDevice } from 'l-js-fn';

// onResize 等回调中调用
uniDevice.refresh();
```

---

## 3. statusBarHeight() 状态栏高度

获取状态栏高度，自定义导航栏计算占位高度时使用。

**返回值：** `number` — 状态栏高度（px），获取失败返回 `0`

**示例：**

```ts
import { uniDevice } from 'l-js-fn';

const bar = uniDevice.statusBarHeight();
// 自定义导航栏: padding-top = bar + 若干安全边距
```

---

## 4. safeAreaInsets() 安全区内边距

获取安全区四边内边距，适配 iPhone X 系刘海屏与底部 Home 指示条。

**返回值：** `SafeAreaInsets` — `{ top, right, bottom, left }`（px）

**示例：**

```ts
import { uniDevice } from 'l-js-fn';

const { top, right, bottom, left } = uniDevice.safeAreaInsets();
// bottom > 0 表示底部有 Home 指示条，页面底部操作栏需留出该高度
```

---

## 5. capsule() 胶囊按钮（微信/支付宝）

获取小程序右上角胶囊按钮的位置信息，方便自定义顶部布局避开该按钮。

**返回值：** `CapsuleInfo | null`

```ts
interface CapsuleInfo {
  left: number; top: number; right: number; bottom: number;
  width: number; height: number;
}
```

**示例：**

::: code-group
```ts [TypeScript]
import { uniDevice } from 'l-js-fn';

const capsule = uniDevice.capsule();
if (capsule) {
  // 微信/支付宝：按胶囊位置对齐自定义右上角按钮
  console.log(capsule.left, capsule.top, capsule.width, capsule.height);
} else {
  // 其余平台（H5/App）：返回 null
}
```

```js [JavaScript (ESM)]
import { uniDevice } from 'l-js-fn';

const capsule = uniDevice.capsule();
```

```js [JavaScript (CJS)]
const { device } = require('l-js-fn/uniapp');

const capsule = device.capsule();
```
:::

> **平台差异：** 微信 `wx.getMenuButtonBoundingClientRect()` / 支付宝 `my.getMenuButtonBoundingClientRect()`，返回结构一致；H5 / App 不支持，返回 `null`。

---

## 6. isInSafeArea() 是否处于底部安全区

判断底部是否存在 Home 指示条（iPhone X 系刘海屏），用于操作栏内边距适配。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bottom | `number` | 否 | 底部偏移阈值（px），默认 `0` |

**返回值：** `boolean` — 底部存在安全区（Home 指示条）时为 `true`

**示例：**

```ts
import { uniDevice } from 'l-js-fn';

if (uniDevice.isInSafeArea()) {
  // 底部操作栏加上 safeAreaInsets().bottom 的内边距
}
```

---

## 7. 完整示例：自定义导航栏 + 底部操作栏

```ts
import { uniDevice } from 'l-js-fn';

// 页面 onLoad 中获取一次即可（info 已缓存）
const statusBarHeight = uniDevice.statusBarHeight(); // 状态栏高度
const capsule = uniDevice.capsule();                 // 胶囊按钮（小程序）

// 自定义导航栏高度 = 状态栏 + 胶囊高度 + 间距
if (capsule) {
  const navBarHeight = statusBarHeight + (capsule.bottom - capsule.top) + 8;
  console.log('导航栏高度:', navBarHeight);
}

// 底部操作栏安全区内边距
const insets = uniDevice.safeAreaInsets();
const bottomPadding = uniDevice.isInSafeArea() ? insets.bottom : 0;
console.log('底部安全内边距:', bottomPadding);
```
