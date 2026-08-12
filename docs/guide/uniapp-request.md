# uniapp — 网络请求 (Request)

Request 模块基于 luch-request 封装，支持拦截器链、重试机制、并发 Loading 控制，适用于微信和支付宝小程序。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；**主包中命名为 `uniRequest`**，子路径 `l-js-fn/uniapp` 保留原始命名 `request`，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');
```
:::

## 1. 全局配置

### setConfig() 设置全局默认配置

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| cfg | `object` | 是 | 配置对象 |

```ts
interface RequestStaticConfig {
  baseURL?: string;                 // 全局根路径
  timeout?: number;                 // 超时时间（毫秒），默认 60000
  header?: Record<string, string>;  // 全局请求头
}
```

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

uniRequest.setConfig({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  header: { 'Content-Type': 'application/json' }
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

uniRequest.setConfig({
  baseURL: 'https://api.example.com',
  timeout: 30000,
});
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

request.setConfig({
  baseURL: 'https://api.example.com',
  timeout: 30000,
});
```
:::

## 2. HTTP 方法

### 2.1 get() GET 请求

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 请求路径（相对路径拼接 baseURL） |
| config | `object` | 否 | 请求配置（params, header, timeout 等） |

**返回值：** `Promise<T>`

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

interface User { id: number; name: string; }

const user = await uniRequest.get<User>('/user', {
  params: { id: 1 }
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const user = await uniRequest.get('/user', { params: { id: 1 } });
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const user = await request.get('/user', { params: { id: 1 } });
```
:::

### 2.2 post() POST 请求

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 请求路径 |
| data | `any` | 否 | 请求体数据 |
| config | `object` | 否 | 请求配置 |

**返回值：** `Promise<T>`

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

const result = await uniRequest.post('/user', {
  name: 'John',
  age: 20
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const result = await uniRequest.post('/user', { name: 'John' });
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const result = await request.post('/user', { name: 'John' });
```
:::

### 2.3 put() PUT 请求

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 请求路径 |
| data | `any` | 否 | 请求体数据 |
| config | `object` | 否 | 请求配置 |

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

await uniRequest.put('/user/1', { name: 'Jane' });
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

await uniRequest.put('/user/1', { name: 'Jane' });
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

await request.put('/user/1', { name: 'Jane' });
```
:::

### 2.4 delete() DELETE 请求

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

await uniRequest.delete('/user/1');
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

await uniRequest.delete('/user/1');
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

await request.delete('/user/1');
```
:::

### 2.5 upload() 文件上传

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | 上传地址 |
| config | `object` | 是 | 上传配置 |

**config 关键参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filePath | `string` | 是 | 文件路径 |
| name | `string` | 是 | 文件对应的 key |
| formData | `object` | 否 | 额外表单数据 |
| timeout | `number` | 否 | 超时时间 |

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.upload('/upload', {
  filePath: '/tmp/avatar.jpg',
  name: 'file',
  formData: { userId: '1' }
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.upload('/upload', {
  filePath: '/tmp/avatar.jpg',
  name: 'file',
});
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const res = await request.upload('/upload', {
  filePath: '/tmp/avatar.jpg',
  name: 'file',
});
```
:::

### 2.6 download() 文件下载

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.download('/file/report.pdf');
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.download('/file/report.pdf');
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const res = await request.download('/file/report.pdf');
```
:::

## 3. 拦截器

### 3.1 beforeRequest() 请求拦截器

在请求发送前处理 config，可用于注入 Token、添加公共参数等。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fulfilled | `(config) => config \| Promise<config>` | 是 | 拦截处理函数 |
| rejected | `(error) => any` | 否 | 错误处理函数 |

**返回值：** `number` — 拦截器 ID，用于后续移除

**执行顺序：** 后注册的先执行（与 axios 行为一致）

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

// 注入 Token
uniRequest.beforeRequest((config) => {
  config.header = {
    ...config.header,
    'Authorization': 'Bearer ' + getToken()
  };
  return config;
});

// 添加公共参数
uniRequest.beforeRequest((config) => {
  config.params = { ...config.params, _t: Date.now() };
  return config;
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

uniRequest.beforeRequest((config) => {
  config.header['Authorization'] = 'Bearer ' + getToken();
  return config;
});
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

request.beforeRequest((config) => {
  config.header['Authorization'] = 'Bearer ' + getToken();
  return config;
});
```
:::

### 3.2 afterResponse() 响应拦截器

在收到响应后处理数据，可用于统一错误处理、数据提取等。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fulfilled | `(response) => response \| Promise<response>` | 是 | 拦截处理函数 |
| rejected | `(error) => any` | 否 | 错误处理函数 |

**返回值：** `number` — 拦截器 ID

**执行顺序：** 先注册的先执行

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

// 统一错误处理
uniRequest.afterResponse((response) => {
  const { data } = response;
  if (data.code !== 0) {
    uni.showToast({ title: data.msg || '请求失败', icon: 'none' });
    return Promise.reject(new Error(data.msg));
  }
  return response;
});

// 提取 data 字段
uniRequest.afterResponse((response) => {
  return response.data.data;
});
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

uniRequest.afterResponse((response) => {
  if (response.data.code !== 0) {
    return Promise.reject(new Error(response.data.msg));
  }
  return response;
});
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

request.afterResponse((response) => {
  if (response.data.code !== 0) {
    return Promise.reject(new Error(response.data.msg));
  }
  return response;
});
```
:::

## 4. 重试机制

请求失败时自动重试，通过 `config` 参数控制。

**配置参数：**

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| retry | `number` | `0` | 重试次数（不包含首次请求） |
| retryDelay | `number` | `1000` | 每次重试间隔（毫秒） |

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

// 失败时重试 3 次，间隔 1 秒
try {
  const res = await uniRequest.get('/api/data', {
    retry: 3,
    retryDelay: 1000
  });
} catch (err) {
  console.error('请求最终失败', err);
}
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.get('/api/data', { retry: 3, retryDelay: 1000 });
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const res = await request.get('/api/data', { retry: 3, retryDelay: 1000 });
```
:::

## 5. Loading 并发控制

通过 `loading: true` 自动管理 `uni.showLoading` / `uni.hideLoading`。使用计数器控制并发，第一个请求显示 loading，最后一个请求完成时隐藏。

**示例：**

::: code-group
```ts [TypeScript]
import { uniRequest } from 'l-js-fn';

// 显示 loading，请求完成后自动隐藏
const res = await uniRequest.get('/api/data', { loading: true });
```

```js [JavaScript (ESM)]
import { uniRequest } from 'l-js-fn';

const res = await uniRequest.get('/api/data', { loading: true });
```

```js [JavaScript (CJS)]
const { request } = require('l-js-fn/uniapp');

const res = await request.get('/api/data', { loading: true });
```
:::

> **注意：** 并发请求中只要有一个设置 `loading: true`，loading 就会显示，直到所有带 loading 的请求完成。

## 6. 完整示例

### 项目初始化配置

```ts
import { uniRequest } from 'l-js-fn';

// App.vue 的 onLaunch 中初始化
uniRequest.setConfig({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  header: { 'Content-Type': 'application/json' },
});

// 请求拦截：注入 Token
uniRequest.beforeRequest((config) => {
  const token = uni.getStorageSync('token');
  if (token) {
    config.header.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截：统一错误处理
uniRequest.afterResponse((response) => {
  if (response.data.code === 401) {
    uni.reLaunch({ url: '/pages/login/index' });
    return Promise.reject(new Error('未登录'));
  }
  if (response.data.code !== 0) {
    return Promise.reject(response.data);
  }
  return response;
});
```

### 业务层使用

```ts
// 带 loading 的请求
const users = await uniRequest.get('/users', { loading: true });

// 带重试的请求
const detail = await uniRequest.get('/detail/1', { retry: 2 });

// 文件上传
const avatar = await uniRequest.upload('/upload/avatar', {
  filePath: tempFilePath,
  name: 'file',
  loading: true,
});
```

## 7. TypeScript 类型定义

```ts
interface RequestStaticConfig {
  baseURL?: string;
  timeout?: number;
  header?: Record<string, string>;
}

interface RequestExtraConfig {
  retry?: number;       // 重试次数，默认 0
  retryDelay?: number;  // 重试间隔（毫秒），默认 1000
  loading?: boolean;    // 是否显示 loading，默认 false
}
```
