# uniapp — 小程序工具集

uniapp 小程序工具集，封装了平台适配层、环境信息、弹窗、权限授权、路由导航、本地存储、Toast 提示、剪贴板、设备适配、网络状态、文件系统、网络请求等常用功能，**一份代码同时兼容微信和支付宝小程序**。

底层采用**策略模式（平台适配器）**，内置 `wechat` / `alipay` / `h5` / `app` 四个平台适配器，并支持通过 `registerAdapter()` 扩展任意新平台（抖音、快手等）。

> 文件系统模块详细用法请参考 [文件系统 (File)](/guide/uniapp-file)，网络请求模块详细用法请参考 [网络请求 (Request)](/guide/uniapp-request)。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；**主包中 uniapp 命名统一带 `uni` 前缀**（如 `uniModel`），子路径 `l-js-fn/uniapp` 保留原始命名，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import {
  uniGetAdapter, uniAutoDetect, uniRegisterAdapter,
  uniEnv, uniModel, uniPermission, uniRouter, uniStorage, uniToast,
  uniClipboard, uniDevice, uniNetwork, uniFile, uniRequest
} from 'l-js-fn';
```

```js [JavaScript (ESM)]
import {
  uniGetAdapter, uniAutoDetect, uniRegisterAdapter,
  uniEnv, uniModel, uniPermission, uniRouter, uniStorage, uniToast,
  uniClipboard, uniDevice, uniNetwork, uniFile, uniRequest
} from 'l-js-fn';
```

```js [JavaScript (CJS)]
const {
  getAdapter, autoDetect, registerAdapter,
  env, model, permission, router, storage, toast,
  clipboard, device, network, file, request
} = require('l-js-fn/uniapp');
```
:::

---

## 1. 平台适配层 (base)

这是整个模块的核心。它负责**自动检测当前平台**、提供**统一的平台 API**，以及**扩展新平台**。

### 1.1 自动检测（默认，无需任何初始化）

模块首次被调用时，会自动按以下优先级检测平台，并缓存适配器：

| 检测条件 | 选用适配器 |
|----------|-----------|
| 存在全局 `wx` 对象 | `wechat`（微信） |
| 存在全局 `my` 对象 | `alipay`（支付宝） |
| 存在全局 `uni` 且 `getSystemInfoSync().platform === 'mp-weixin'` | `wechat` |
| 存在全局 `uni` 且 `platform === 'mp-alipay'` | `alipay` |
| 存在 `uni` 且浏览器环境（有 `document`） | `h5` |
| 存在 `uni` 且 App 环境（有 `plus`） | `app` |
| 全部不满足 | 抛出错误，提示手动 `registerAdapter()` |

**也就是说：微信编译产物里自然有 `wx`，支付宝产物里自然有 `my`，无需写任何判断代码。**

```ts
// 微信包内运行 → 自动使用微信适配器
// 支付宝包内运行 → 自动使用支付宝适配器
import { uniStorage, uniToast } from 'l-js-fn';

uniStorage.set('token', 'abc');   // 微信: wx.setStorageSync，支付宝: my.setStorageSync({key,data})
uniToast.success('保存成功');       // 微信: title/icon，支付宝: content/type，自动转换
```

### 1.2 autoDetect() 主动检测

可以主动触发一次检测（例如在 `App.vue` 的 `onLaunch` 中），提前初始化适配器。

```ts
import { uniAutoDetect } from 'l-js-fn';

uniAutoDetect(); // 返回当前平台适配器，检测失败抛错
```

### 1.3 getAdapter() 获取当前适配器

```ts
import { uniGetAdapter } from 'l-js-fn';

const adapter = uniGetAdapter();
adapter.name;  // 'wechat' | 'alipay' | 'h5' | 'app' | 自定义名称
adapter.api;   // 平台原生 API 对象（wx / my / uni），可直连原生方法
```

> **日常业务代码通常不需要直接使用 getAdapter()**，模块内部已经帮你调好了。它主要用于：获取平台名、直连原生 API、扩展新平台、单元测试。

### 1.4 registerAdapter() 手动注册 / 扩展新平台

用于**覆盖自动检测结果**或**接入未内置的平台**。

```ts
import { uniRegisterAdapter, uniCreateWechatAdapter } from 'l-js-fn';

// 覆盖自动检测，强制使用微信适配器（一般不需要）
uniRegisterAdapter(uniCreateWechatAdapter(wx));

// 扩展新平台：实现 UniPlatformAdapter 接口后注册
uniRegisterAdapter(myDouyinAdapter); // 之后所有模块自动切换为抖音实现
```

---

## 2. 环境信息 (env)

### 2.1 platform() 获取平台信息

```ts
import { uniEnv } from 'l-js-fn';

const info = uniEnv.platform();
console.log(info);
// 微信运行结果: { isWechat: true, isAlipay: false, isH5: false, isApp: false, platformName: 'wechat' }
// 支付宝运行结果: { isWechat: false, isAlipay: true, isH5: false, isApp: false, platformName: 'alipay' }
```

### 2.2 version() 获取环境版本（微信/支付宝）

微信读 `__wxConfig.envVersion`，支付宝调 `my.getRunScene`，返回值结构统一。

```ts
const { v, d, s } = await uniEnv.version();
console.log(v, d, s);
// 微信开发版: 'develop' '开发版' 'wechat'
// 支付宝正式版: 'release' '正式版' 'alipay'
```

> **注意：** H5 / App 端不支持获取环境版本，会 reject，调用时建议用 try/catch。

### 2.3 launchOptions() 获取启动参数

微信 / 支付宝统一返回 `getLaunchOptionsSync()` 的**完整对象**（含 `query` 子属性）。

```ts
const opts = uniEnv.launchOptions();
console.log(opts);
// 微信扫码进入: { scene: 1011, query: { id: '123' }, referrerInfo: {...} }
// 无参数时: null
```

### 2.4 enterOptions() 获取进入参数

```ts
const opts = uniEnv.enterOptions();
console.log(opts);   // { id: '1', ... }，异常时返回 undefined
```

### 2.5 scanParams() 解析扫码参数

自动适配微信（`options.q`）与支付宝（`options.query.qrCode` / `options.qrCode`），提取二维码中的 URL 与 query 对象。

```ts
// 页面 onLoad(options) 里调用
uniEnv.scanParams(options, (url, paramsObj) => {
  console.log('扫码 URL:', url);      // 'https://example.com/detail'
  console.log('URL 参数:', paramsObj); // { id: '123', type: 'wx' }
});
```

---

## 3. 弹窗 (model)

### 3.1 confirm() 确认对话框

```ts
import { uniModel } from 'l-js-fn';

const { confirm, cancel } = await uniModel.confirm('确定删除这条记录？', {
  title: '删除确认',
  confirmText: '确定',
  cancelText: '取消',
});
if (confirm) {
  console.log('用户点击了确定');
} else {
  console.log('用户点击了取消'); // 返回 { confirm: false, cancel: true }
}
```

### 3.2 alert() 提示对话框（仅确认按钮）

```ts
await uniModel.alert('操作成功！', { title: '提示' });
// 微信/支付宝统一弹出仅含「确认」按钮的对话框
```

### 3.3 actionSheet() 操作菜单

从底部弹出选择列表，跨平台行为一致（微信/支付宝均基于 `uni.showActionSheet`）。

```ts
import { uniModel } from 'l-js-fn';

const index = await uniModel.actionSheet({
  title: '选择操作',
  itemList: ['编辑', '删除'],
  itemColor: '#576b95', // 可选，菜单文字颜色
});
if (index !== null) {
  console.log('选择了第', index, '项');
} else {
  console.log('用户取消了'); // 取消/失败返回 null
}
```

---

## 4. 权限授权 (permission)

统一授权流程，微信 / 支付宝通用：

```
1. getSetting 预检   → 已授权则直接返回 true
2. 未授权 → authorize 弹授权框
3. 仍失败（曾被拒绝）→ 打开设置页引导（openSetting，微信支持）
```

```ts
import { uniPermission } from 'l-js-fn';

const ok = await uniPermission.camera();       // 相机权限
const ok = await uniPermission.album();        // 相册写入权限
const ok = await uniPermission.location();     // 位置权限
const ok = await uniPermission.microphone();   // 麦克风权限

// 任意 scope
const ok = await uniPermission.authorize('scope.userLocation');
console.log(ok); // true: 已授权; false: 用户拒绝
```

> **平台差异：** H5 / App 无小程序权限体系，上述方法一律返回 `true`。

---

## 5. 路由导航 (router)

### 5.1 基础跳转

```ts
import { uniRouter } from 'l-js-fn';

await uniRouter.push('/pages/detail/index', {
  query: { id: '1', name: 'test' },      // 拼接到 URL 的 query
  params: { user: { name: 'John' } },    // 对象自动 JSON.stringify
}); // → '/pages/detail/index?id=1&name=test&user=%7B%22name%22%3A%22John%22%7D'

await uniRouter.replace('/pages/home/index'); // 重定向（关闭当前页）
await uniRouter.back(2);                       // 返回两级
await uniRouter.switchTab('/pages/mine/index'); // 切换 tabBar 页（不可带参）
await uniRouter.reLaunch('/pages/index/index'); // 关闭所有页面重新打开
```

### 5.2 beforeEach() 路由守卫

```ts
uniRouter.beforeEach((to, from, next) => {
  if (to.includes('/pages/login') || to.includes('/pages/auth')) {
    next();                        // 放行
  } else if (!isLoggedIn()) {
    next('/pages/login/index');    // 重定向到登录页
  } else {
    next();                        // 放行
  }
});
```

> 守卫若 5 秒内未调用 `next()`，将被跳过（不阻塞导航）。内置 300ms 防重复跳转保护。

---

## 6. 本地存储 (storage)

支持**过期时间**和**加密存储**（固定宽度 XOR，支持中文 / Emoji 全 Unicode）。

```ts
import { uniStorage } from 'l-js-fn';

// 基本存取
uniStorage.set('user', { name: 'John', age: 20 });
uniStorage.get('user');               // { name: 'John', age: 20 }

// 过期时间（秒）
uniStorage.set('token', 'abc', { expire: 3600 }); // 1 小时后过期
uniStorage.get('token');               // 过期后返回 null，并自动清除

// 加密存储（XOR）
uniStorage.set('secret', '张三👋', { encrypt: true });
uniStorage.get('secret', { encrypt: true }); // '张三👋'（中文/Emoji 完整往返）

// 删除 / 清空
uniStorage.remove('user');
uniStorage.clear();

// 查询
uniStorage.has('token');          // 是否存在某个键
uniStorage.keys();                // 获取所有键名 ['token', 'user', ...]

// 清理过期项
const removed = uniStorage.clearExpired(); // 清除所有已过期的项，返回清除数量
```

> 所有方法在微信（`(key,data)` 位置参数）和支付宝（`{key,data}` 对象参数）上**自动切换存储格式**。

---

## 7. Toast 提示 (toast)


```ts
import { uniToast } from 'l-js-fn';

uniToast.show('普通提示');                        // icon 默认 none
uniToast.show('成功', { icon: 'success', duration: 3000, mask: true });
uniToast.success('保存成功');
uniToast.error('网络异常');
uniToast.loading('加载中...');                    // 默认带遮罩
uniToast.hideLoading();
```

**icon 平台差异自动处理：**

| 传入 icon | 微信 | 支付宝 |
|-----------|------|--------|
| `success` | `success` | `success` |
| `error` | `error` | `fail` |
| `fail`（支付宝专属） | **降级为 `error`** | `fail` |
| `exception`（支付宝专属） | **降级为 `none`** | `exception` |
| `none` | `none` | `none` |

---

## 8. 剪贴板 (clipboard)

### 8.1 copy() 复制文本

微信/支付宝/H5/App 参数差异（微信 `data`、支付宝 `text`）已封装，复制结果统一返回布尔值。

```ts
import { uniClipboard } from 'l-js-fn';

const ok = await uniClipboard.copy('复制内容');
if (ok) {
  uniToast.success('已复制');
}
```

### 8.2 read() 读取剪贴板

```ts
const text = await uniClipboard.read();
console.log(text); // 剪贴板中的文本
```

---

## 9. 设备/UI 适配 (device)

针对**状态栏高度、安全区、胶囊按钮**等 UI 适配刚需场景，自动透传系统信息并缓存，无需关心平台差异。

### 9.1 info() 设备信息

首次调用读取并缓存系统信息（横竖屏切换后用 `refresh()` 刷新）。

```ts
import { uniDevice } from 'l-js-fn';

const info = uniDevice.info();
console.log(info);
// {
//   brand: 'iPhone', model: 'iPhone 15 Pro', system: 'iOS 17.0',
//   statusBarHeight: 47, screenWidth: 390, screenHeight: 844,
//   pixelRatio: 3, safeArea: {...}, safeAreaInsets: { top: 47, bottom: 74, ... }
// }
```

### 9.2 statusBarHeight() 状态栏高度

```ts
const bar = uniDevice.statusBarHeight();
// 自定义导航栏计算占位高度时使用
```

### 9.3 safeAreaInsets() 安全区内边距

```ts
const { top, bottom, left, right } = uniDevice.safeAreaInsets();
// bottom > 0 表示底部有 Home 指示条（iPhone X 系），页面底部按钮需留出该高度
```

### 9.4 capsule() 胶囊按钮（微信/支付宝）

```ts
const capsule = uniDevice.capsule(); // 微信/支付宝返回 { left, top, right, bottom, width, height }
if (capsule) {
  // 自定义右上角按钮时按胶囊位置对齐
} else {
  // 其余平台（H5/App）返回 null
}
```

### 9.5 isInSafeArea() 是否处于底部安全区

```ts
if (uniDevice.isInSafeArea()) {
  // 底部存在 Home 指示条，操作栏需要增加安全区内边距
}
```

---

## 10. 网络状态 (network)

### 10.1 type() / isOnline() 检测网络

```ts
import { uniNetwork } from 'l-js-fn';

const type = await uniNetwork.type();
// 'wifi' | '4g' | '3g' | '2g' | 'none' | 'unknown'

const online = await uniNetwork.isOnline(); // true / false
```

### 10.2 watch() / off() 监听网络变化

```ts
uniNetwork.watch((isConnected, type) => {
  console.log(isConnected, type); // true 'wifi'（断网时 false 'none'）
});

uniNetwork.off(); // 移除监听
```

> H5 端 `uni.getNetworkType` 不可用时自动降级为 `navigator.onLine`。

---

## 11. 扩展新平台

以抖音小程序为例，只需实现 `PlatformAdapter` 接口并注册，**无需修改任何模块源码**。以下分别展示 TypeScript、JavaScript (ESM)、JavaScript (CJS) 三种写法。

::: code-group
```ts [TypeScript]
// douyin-adapter.ts
import { uniRegisterAdapter, type UniPlatformAdapter } from 'l-js-fn';

const douyinAdapter: UniPlatformAdapter = {
  name: 'douyin',
  api: tt, // 抖音全局对象

  // 存储（抖音与微信同为位置参数格式）
  setStorageSync(key, data) { tt.setStorageSync(key, data); },
  getStorageSync(key) { return tt.getStorageSync(key); },
  removeStorageSync(key) { tt.removeStorageSync(key); },
  clearStorageSync() { tt.clearStorageSync(); },

  // Toast
  showToast(title, icon, duration, mask, image) {
    tt.showToast({ title, icon, duration, mask, ...(image ? { image } : {}) });
  },
  showLoading(title, mask) { tt.showLoading({ title, mask }); },
  hideLoading() { tt.hideLoading(); },

  // 权限（按抖音 API 实现）
  async checkPermission(scope) { /* 抖音实现 */ return true; },
  async requestPermission(scope) { /* 抖音实现 */ return true; },

  // 环境
  async getEnvVersion() { /* 抖音实现 */ return { v: 'release', d: '正式版', s: 'douyin' }; },
  getLaunchOptionsSync() { return tt.getLaunchOptionsSync?.() ?? null; },
  extractScanUrl(options) { /* 抖音实现 */ return undefined; },
};

// App.vue onLaunch
uniRegisterAdapter(douyinAdapter);
```

```js [JavaScript (ESM)]
// douyin-adapter.mjs
import { uniRegisterAdapter } from 'l-js-fn';

const douyinAdapter = {
  name: 'douyin',
  api: tt, // 抖音全局对象

  // 存储（抖音与微信同为位置参数格式）
  setStorageSync(key, data) { tt.setStorageSync(key, data); },
  getStorageSync(key) { return tt.getStorageSync(key); },
  removeStorageSync(key) { tt.removeStorageSync(key); },
  clearStorageSync() { tt.clearStorageSync(); },

  // Toast
  showToast(title, icon, duration, mask, image) {
    tt.showToast({ title, icon, duration, mask, ...(image ? { image } : {}) });
  },
  showLoading(title, mask) { tt.showLoading({ title, mask }); },
  hideLoading() { tt.hideLoading(); },

  // 权限（按抖音 API 实现）
  async checkPermission(scope) { /* 抖音实现 */ return true; },
  async requestPermission(scope) { /* 抖音实现 */ return true; },

  // 环境
  async getEnvVersion() { /* 抖音实现 */ return { v: 'release', d: '正式版', s: 'douyin' }; },
  getLaunchOptionsSync() { return tt.getLaunchOptionsSync?.() ?? null; },
  extractScanUrl(options) { /* 抖音实现 */ return undefined; },
};

// App.vue onLaunch
uniRegisterAdapter(douyinAdapter);
```

```js [JavaScript (CJS)]
// douyin-adapter.cjs
const { registerAdapter } = require('l-js-fn/uniapp');

const douyinAdapter = {
  name: 'douyin',
  api: tt, // 抖音全局对象

  // 存储（抖音与微信同为位置参数格式）
  setStorageSync(key, data) { tt.setStorageSync(key, data); },
  getStorageSync(key) { return tt.getStorageSync(key); },
  removeStorageSync(key) { tt.removeStorageSync(key); },
  clearStorageSync() { tt.clearStorageSync(); },

  // Toast
  showToast(title, icon, duration, mask, image) {
    tt.showToast({ title, icon, duration, mask, ...(image ? { image } : {}) });
  },
  showLoading(title, mask) { tt.showLoading({ title, mask }); },
  hideLoading() { tt.hideLoading(); },

  // 权限（按抖音 API 实现）
  async checkPermission(scope) { /* 抖音实现 */ return true; },
  async requestPermission(scope) { /* 抖音实现 */ return true; },

  // 环境
  async getEnvVersion() { /* 抖音实现 */ return { v: 'release', d: '正式版', s: 'douyin' }; },
  getLaunchOptionsSync() { return tt.getLaunchOptionsSync?.() ?? null; },
  extractScanUrl(options) { /* 抖音实现 */ return undefined; },
};

// App.vue onLaunch
registerAdapter(douyinAdapter);
```
:::

注册后，`env` / `model` / `permission` / `router` / `storage` / `toast` / `clipboard` / `device` / `network` 全部自动切换为抖音实现。

> **可跳过的方法说明：** `openSetting()`、`getMenuButtonInfo()`、`showActionSheet()` 为可选方法，不实现时模块内部自动兜底（权限引导降级为 `false`、胶囊按钮返回 `null`、操作菜单按 uni 统一 API 调用）。若你的平台没有 `getLaunchOptionsSync` / 扫码能力，对应方法返回 `null` / `undefined` 即可，模块内部已做空值兜底。

---

## 12. 平台差异速查表

| 能力 | 微信 (wechat) | 支付宝 (alipay) | H5 / App |
|------|---------------|-----------------|----------|
| 存储参数格式 | `(key, data)` | `{ key, data }` | `(key, data)` |
| Toast 字段 | `title` / `icon` | `content` / `type` | `title` / `icon` |
| Toast icon 支持 | 4 种（`fail`/`exception` 自动降级） | 6 种全支持 | 同微信 |
| 权限授权流程 | getSetting → authorize → openSetting | getSetting → authorize | 恒为 `true` |
| 环境版本 | `__wxConfig.envVersion` | `my.getRunScene` | 不支持（reject） |
| 扫码参数 | `options.q` | `options.query.qrCode` | 无 |
| 启动参数 | `wx.getLaunchOptionsSync()` | `my.getLaunchOptionsSync()` | `null` |
| 胶囊按钮 | `wx.getMenuButtonBoundingClientRect()` | `my.getMenuButtonBoundingClientRect()` | `null` |
| 操作菜单 | `itemList` / `res.tapIndex` | `items` / `res.index` | `itemList` / `res.tapIndex` |
| 剪贴板 | `wx.setClipboardData({ data })` | `my.setClipboard({ text })` | `uni.setClipboardData({ data })` |
| 文件系统 | `wx.getFileSystemManager()` + `wx.env.USER_DATA_PATH` | `my.getFileSystemManager()` + `my.env.USER_DATA_PATH` | 视平台支持 |

---

## 13. 平台适配器接口参考

```ts
interface UniPlatformAdapter {
  name: string;                     // 平台标识
  api: Record<string, any>;         // 平台原生 API 对象（wx / my / uni）

  // 存储
  setStorageSync(key: string, data: string): void;
  getStorageSync(key: string): string | null;
  removeStorageSync(key: string): void;
  clearStorageSync(): void;

  // Toast
  showToast(title: string, icon: string, duration: number, mask: boolean, image?: string): void;
  showLoading(title: string, mask: boolean): void;
  hideLoading(): void;

  // 权限
  checkPermission(scope: string): Promise<boolean>;
  requestPermission(scope: string): Promise<boolean>;
  openSetting?(): Promise<boolean>;

  // 弹窗（可选，缺省时 model.actionSheet 按 uni 统一 API 兜底）
  showActionSheet?(options: { itemList: string[]; title?: string; itemColor?: string }): Promise<number | null>;

  // 环境
  getEnvVersion(): Promise<EnvVersion>;
  getLaunchOptionsSync(): Record<string, any> | null;
  extractScanUrl(options: Record<string, any>): string | undefined;

  // 剪贴板
  copyToClipboard(text: string): Promise<boolean>;
  readClipboard(): Promise<string>;

  // 设备（可选）
  getMenuButtonInfo?(): Record<string, any> | null;

  // 文件系统（可选）
  getFileSystemManager?(): any;
  getUserDataPath?(): string;
  fileWrite?(filePath: string, data: string): Promise<void>;
  fileRead?(filePath: string): Promise<string>;
  fileAccess?(filePath: string): Promise<boolean>;
  fileRemove?(filePath: string): Promise<void>;
}
```

内置适配器工厂：`createWechatAdapter(api)` / `createAlipayAdapter(api)` / `createH5Adapter(api)` / `createAppAdapter(api)`。
