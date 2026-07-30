# ipc — IPC 通信

IPC（进程间通信）工具集，提供 H5 与 Iframe 之间的双向通信能力。

**导入方式：**

::: code-group
```ts [TypeScript]
import { H5Bridge, IframeBridge } from 'l-js-fn/ipc';
```

```js [JavaScript (ESM)]
import { H5Bridge, IframeBridge } from 'l-js-fn/ipc';
```

```js [JavaScript (CJS)]
const { H5Bridge, IframeBridge } = require('l-js-fn/ipc');
```
:::

## 1. IPCMessage

消息体类型定义：

```ts
interface IPCMessage<T = any> {
  type: IPC_TYPE;    // 消息类型
  id?: string;       // 消息 ID
  eventName: string; // 事件名称
  params?: T;        // 参数
  error?: string;    // 错误信息
  result?: any;      // 结果
}
```

### 1.1 IPC_TYPE 枚举

```ts
enum IPC_TYPE {
  REQUEST = 'request',   // 请求
  RESPONSE = 'response', // 响应
  EMIT = 'emit'          // 事件
}
```

## 2. H5Bridge

父应用向子应用（Iframe）发送消息的桥接类。

### 2.1 构造函数

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| iframe | `HTMLIFrameElement \| null` | 是 | Iframe 元素 |

**示例：**

::: code-group
```ts [TypeScript]
import { H5Bridge } from 'l-js-fn/ipc';

const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);
```

```js [JavaScript (ESM)]
import { H5Bridge } from 'l-js-fn/ipc';

const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);
```

```js [JavaScript (CJS)]
const { H5Bridge } = require('l-js-fn/ipc');

const iframe = document.getElementById('myIframe') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);
```
:::

### 2.2 call

调用子应用的方法。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| params | `any` | 否 | 参数 |

**返回值：** `Promise<any>`

**示例：**

```typescript
// 父应用调用子应用方法
const result = await bridge.call('getUserInfo', { id: 1 });
console.log(result);
```

### 2.3 on

监听子应用触发的事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| callback | `Function` | 是 | 回调函数 |

**示例：**

```typescript
bridge.on('dataChanged', (data) => {
  console.log('数据变化:', data);
});
```

### 2.4 off

移除监听事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| callback | `Function` | 否 | 特定回调函数（不传则移除该事件所有监听） |

**示例：**

```typescript
bridge.off('dataChanged'); // 移除所有监听
```

### 2.5 emit

向子应用发布事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| params | `any` | 否 | 参数 |

**示例：**

```typescript
bridge.emit('updateConfig', { theme: 'dark' });
```

### 2.6 destroy

销毁桥接实例，清理所有监听和未完成的 Promise。

**示例：**

```typescript
bridge.destroy();
```

## 3. IframeBridge

子应用向父应用发送消息的桥接类。

### 3.1 构造函数

无需参数。

**示例：**

::: code-group
```ts [TypeScript]
import { IframeBridge } from 'l-js-fn/ipc';

const bridge = new IframeBridge();
```

```js [JavaScript (ESM)]
import { IframeBridge } from 'l-js-fn/ipc';

const bridge = new IframeBridge();
```

```js [JavaScript (CJS)]
const { IframeBridge } = require('l-js-fn/ipc');

const bridge = new IframeBridge();
```
:::

### 3.2 register

注册事件处理函数。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| callback | `Function` | 是 | 处理函数 |

**示例：**

```typescript
// 子应用注册可被父应用调用的方法
bridge.register('getUserInfo', async (params) => {
  const user = await fetchUser(params.id);
  return user;
});
```

### 3.3 on

监听父应用触发的事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| callback | `Function` | 是 | 回调函数 |

**示例：**

```typescript
bridge.on('updateConfig', (config) => {
  console.log('更新配置:', config);
});
```

### 3.4 off

移除监听事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| callback | `Function` | 否 | 特定回调函数（不传则移除该事件所有监听） |

**示例：**

```typescript
bridge.off('updateConfig');
```

### 3.5 emit

向父应用发布事件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| eventName | `string` | 是 | 事件名称 |
| params | `any` | 否 | 参数 |

**示例：**

```typescript
bridge.emit('dataChanged', { id: 1, status: 'completed' });
```

### 3.6 destroy

销毁桥接实例。

**示例：**

```typescript
bridge.destroy();
```

## 4. 完整使用示例

### 4.1 父应用（H5）

```html
<iframe id="child" src="./child.html"></iframe>
```

::: code-group
```ts [TypeScript]
import { H5Bridge } from 'l-js-fn/ipc';

const iframe = document.getElementById('child') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);

// 调用子应用方法
async function getUser() {
  try {
    const user = await bridge.call('getUser', { id: 1 });
    console.log('用户信息:', user);
  } catch (error) {
    console.error('获取失败:', error);
  }
}

// 监听子应用事件
bridge.on('ready', () => {
  console.log('子应用准备就绪');
});

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```

```js [JavaScript (ESM)]
import { H5Bridge } from 'l-js-fn/ipc';

const iframe = document.getElementById('child') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);

// 调用子应用方法
async function getUser() {
  try {
    const user = await bridge.call('getUser', { id: 1 });
    console.log('用户信息:', user);
  } catch (error) {
    console.error('获取失败:', error);
  }
}

// 监听子应用事件
bridge.on('ready', () => {
  console.log('子应用准备就绪');
});

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```

```js [JavaScript (CJS)]
const { H5Bridge } = require('l-js-fn/ipc');

const iframe = document.getElementById('child') as HTMLIFrameElement;
const bridge = new H5Bridge(iframe);

// 调用子应用方法
async function getUser() {
  try {
    const user = await bridge.call('getUser', { id: 1 });
    console.log('用户信息:', user);
  } catch (error) {
    console.error('获取失败:', error);
  }
}

// 监听子应用事件
bridge.on('ready', () => {
  console.log('子应用准备就绪');
});

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```
:::

### 4.2 子应用（Iframe）

::: code-group
```ts [TypeScript]
import { IframeBridge } from 'l-js-fn/ipc';

const bridge = new IframeBridge();

// 注册可被调用的方法
bridge.register('getUser', async (params) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// 通知父应用
bridge.emit('ready');

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```

```js [JavaScript (ESM)]
import { IframeBridge } from 'l-js-fn/ipc';

const bridge = new IframeBridge();

// 注册可被调用的方法
bridge.register('getUser', async (params) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// 通知父应用
bridge.emit('ready');

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```

```js [JavaScript (CJS)]
const { IframeBridge } = require('l-js-fn/ipc');

const bridge = new IframeBridge();

// 注册可被调用的方法
bridge.register('getUser', async (params) => {
  const response = await fetch(`/api/users/${params.id}`);
  return response.json();
});

// 通知父应用
bridge.emit('ready');

// 页面卸载时销毁
window.addEventListener('beforeunload', () => bridge.destroy());
```
:::
