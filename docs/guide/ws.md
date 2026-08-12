# ws — WebSocket

WebSocket 管理类，提供连接管理、消息发送、心跳检测、自动重连等功能。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/ws` 仍保留，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { WebSocketManager } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { WebSocketManager } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { WebSocketManager } = require('l-js-fn/ws');
```
:::

## 1. WebSocketManager WebSocket管理器

WebSocket 管理类。

### 1.1 构造函数

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| url | `string` | 是 | WebSocket 连接地址 |
| onMessageCallback | `MessageCallback` | 否 | 收到消息的回调函数 |
| onErrorCallback | `ErrorCallback` | 否 | 错误回调函数 |

**示例：**

::: code-group
```ts [TypeScript]
import { WebSocketManager } from 'l-js-fn/ws';

const ws = new WebSocketManager(
  'ws://localhost:8080',
  (message) => {
    console.log('收到消息:', message);
  },
  (error) => {
    console.error('错误:', error);
  }
);
```

```js [JavaScript (ESM)]
import { WebSocketManager } from 'l-js-fn/ws';

const ws = new WebSocketManager(
  'ws://localhost:8080',
  (message) => {
    console.log('收到消息:', message);
  },
  (error) => {
    console.error('错误:', error);
  }
);
```

```js [JavaScript (CJS)]
const { WebSocketManager } = require('l-js-fn/ws');

const ws = new WebSocketManager(
  'ws://localhost:8080',
  (message) => {
    console.log('收到消息:', message);
  },
  (error) => {
    console.error('错误:', error);
  }
);
```
:::

### 1.2 sendWebSocketMessage 发送消息

发送消息。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | `object \| string` | 是 | 要发送的消息 |

**返回值：** `void`

**示例：**

```typescript
ws.sendWebSocketMessage({ type: 'ping', data: 'hello' });
ws.sendWebSocketMessage('hello');
```

### 1.3 checkConnection 检查连接

检查连接并定时发送消息（心跳检测）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| body | `object \| string` | 是 | 心跳消息内容 |
| setTime | `number` | 否 | 心跳间隔（毫秒），默认 `10000` |

**返回值：** `void`

**示例：**

```typescript
ws.checkConnection({ type: 'heartbeat' }, 5000);
// 每 5 秒发送一次心跳
```

### 1.4 reconnect 重新连接

重新连接。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| delay | `number` | 否 | 延迟时间（毫秒），默认 `5000` |

**返回值：** `void`

**示例：**

```typescript
ws.reconnect(3000); // 3 秒后重新连接
```

### 1.5 getWebSocket 获取实例

获取 WebSocket 实例。

**返回值：** `WebSocket \| null`

**示例：**

```typescript
const socket = ws.getWebSocket();
console.log(socket?.readyState);
```

### 1.6 close 关闭连接

关闭连接。

**返回值：** `void`

**示例：**

```typescript
ws.close();
```

## 2. 错误类型

### 2.1 ErrorType

```ts
type ErrorType =
  | 'connection_create_error'  // 连接创建失败
  | 'connection_error'          // 连接错误
  | 'connection_close'          // 连接关闭
  | 'connection_send_error';    // 发送消息失败
```

### 2.2 ErrorPayload

```ts
interface ErrorPayload {
  type: ErrorType;
  data: unknown;
}
```

### 2.3 使用示例

::: code-group
```ts [TypeScript]
import { WebSocketManager } from 'l-js-fn/ws';

const ws = new WebSocketManager(
  'wss://api.example.com/ws',
  (message) => {
    console.log('收到:', message);
  },
  (error) => {
    switch (error.type) {
      case 'connection_close':
        console.log('连接已关闭');
        ws.reconnect();
        break;
      case 'connection_error':
        console.error('连接错误:', error.data);
        break;
    }
  }
);

// 发送消息
ws.sendWebSocketMessage({ type: 'subscribe', channel: 'orders' });

// 心跳
ws.checkConnection({ type: 'ping' }, 30000);

// 页面卸载时关闭
window.addEventListener('beforeunload', () => ws.close());
```

```js [JavaScript (ESM)]
import { WebSocketManager } from 'l-js-fn/ws';

const ws = new WebSocketManager(
  'wss://api.example.com/ws',
  (message) => {
    console.log('收到:', message);
  },
  (error) => {
    switch (error.type) {
      case 'connection_close':
        console.log('连接已关闭');
        ws.reconnect();
        break;
      case 'connection_error':
        console.error('连接错误:', error.data);
        break;
    }
  }
);

// 发送消息
ws.sendWebSocketMessage({ type: 'subscribe', channel: 'orders' });

// 心跳
ws.checkConnection({ type: 'ping' }, 30000);

// 页面卸载时关闭
window.addEventListener('beforeunload', () => ws.close());
```

```js [JavaScript (CJS)]
const { WebSocketManager } = require('l-js-fn/ws');

const ws = new WebSocketManager(
  'wss://api.example.com/ws',
  (message) => {
    console.log('收到:', message);
  },
  (error) => {
    switch (error.type) {
      case 'connection_close':
        console.log('连接已关闭');
        ws.reconnect();
        break;
      case 'connection_error':
        console.error('连接错误:', error.data);
        break;
    }
  }
);

// 发送消息
ws.sendWebSocketMessage({ type: 'subscribe', channel: 'orders' });

// 心跳
ws.checkConnection({ type: 'ping' }, 30000);

// 页面卸载时关闭
window.addEventListener('beforeunload', () => ws.close());
```
:::
