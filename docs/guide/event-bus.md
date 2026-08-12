# event-bus — 事件总线

类型安全的事件总线，支持事件的订阅、发布和取消。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/event-bus` 仍保留，供 CJS 或需要精确加载的场景使用。

::: code-group
```typescript [TypeScript]
import { EventBus, eventBus } from 'l-js-fn';
```

```javascript [JavaScript]
import { EventBus, eventBus } from 'l-js-fn';
```
:::

## 1. EventBus 事件总线类

创建独立的事件总线实例，用于组件间或模块间的通信。

### 1.1 构造函数

::: code-group
```typescript [TypeScript]
new EventBus<Events>()
```

```javascript [JavaScript]
new EventBus()
```
:::

泛型 `Events` 用于定义类型安全的事件 map（TS 专属）。

### 1.2 方法

| 方法 | 说明 |
|------|------|
| `on(event, handler)` | 订阅事件 |
| `once(event, handler)` | 订阅一次性事件（触发一次后自动取消） |
| `off(event, handler?)` | 取消订阅，不传 handler 则取消该事件的所有回调 |
| `emit(event, ...args)` | 发布事件 |
| `clear()` | 清除所有事件监听 |
| `listenerCount(event?)` | 获取监听数量，不传 event 则返回总数 |

### 1.3 基础用法

::: code-group
```typescript [TypeScript]
import { EventBus } from 'l-js-fn/event-bus';

const bus = new EventBus();

const handler = (user: string) => {
  console.log('用户登录:', user);
};

// 订阅
bus.on('login', handler);

// 一次性订阅
bus.once('ready', () => console.log('初始化完成'));

// 发布
bus.emit('login', 'Alice');

// 取消指定回调
bus.off('login', handler);

// 取消某事件全部回调
bus.off('login');

// 清除所有
bus.clear();
```

```javascript [JavaScript]
import { EventBus } from 'l-js-fn/event-bus';

const bus = new EventBus();

const handler = (user) => {
  console.log('用户登录:', user);
};

// 订阅
bus.on('login', handler);

// 一次性订阅
bus.once('ready', () => console.log('初始化完成'));

// 发布
bus.emit('login', 'Alice');

// 取消指定回调
bus.off('login', handler);

// 取消某事件全部回调
bus.off('login');

// 清除所有
bus.clear();
```
:::

### 1.4 类型安全用法

::: code-group
```typescript [TypeScript]
import { EventBus } from 'l-js-fn/event-bus';

// 定义事件签名
type AppEvents = {
  login: [user: string];
  logout: [];
  score: [name: string, points: number];
};

const bus = new EventBus<AppEvents>();

// 自动推断参数类型
bus.on('login', (user) => {
  // user 类型自动推断为 string
  console.log(user);
});

bus.on('score', (name, points) => {
  // name: string, points: number
  console.log(`${name}: ${points}`);
});

bus.emit('login', 'Bob');
bus.emit('score', 'Alice', 100);
```

```javascript [JavaScript]
import { EventBus } from 'l-js-fn/event-bus';

// JS 中无需类型定义，直接使用
const bus = new EventBus();

bus.on('login', (user) => {
  console.log(user);
});

bus.on('score', (name, points) => {
  console.log(`${name}: ${points}`);
});

bus.emit('login', 'Bob');
bus.emit('score', 'Alice', 100);
```
:::

## 2. eventBus 全局单例

项目中全局共享的事件总线实例，适合跨模块通信。

::: code-group
```typescript [TypeScript]
import { eventBus } from 'l-js-fn/event-bus';

interface User {
  name: string;
  role: string;
}

eventBus.on('userChanged', (user: User) => {
  updateUI(user);
});

eventBus.emit('userChanged', { name: 'Alice', role: 'admin' });
```

```javascript [JavaScript]
import { eventBus } from 'l-js-fn/event-bus';

eventBus.on('userChanged', (user) => {
  updateUI(user);
});

eventBus.emit('userChanged', { name: 'Alice', role: 'admin' });
```
:::

## 3. 多参数事件

::: code-group
```typescript [TypeScript]
type SocketEvents = {
  message: [from: string, content: string, timestamp: number];
  connect: [];
  error: [code: number, reason: string];
};

const socketBus = new EventBus<SocketEvents>();

socketBus.on('message', (from, content, timestamp) => {
  console.log(`${timestamp}: ${from} 说 "${content}"`);
});

socketBus.emit('message', 'Alice', 'Hello!', Date.now());
```

```javascript [JavaScript]
const socketBus = new EventBus();

socketBus.on('message', (from, content, timestamp) => {
  console.log(`${timestamp}: ${from} 说 "${content}"`);
});

socketBus.emit('message', 'Alice', 'Hello!', Date.now());
```
:::

## 4. 解耦组件通信

在 Vue / React 等框架中，用 EventBus 实现非父子组件间的解耦通信。

::: code-group
```typescript [TypeScript]
// shared.ts —— 定义事件类型
type ComponentEvents = {
  sidebarToggle: [visible: boolean];
  themeChange: [theme: 'light' | 'dark'];
  dataRefresh: [];
};

export const componentBus = new EventBus<ComponentEvents>();
```

```javascript [JavaScript]
// shared.js —— 创建共享实例
export const componentBus = new EventBus();
```
:::

### 4.1 Header 组件（触发）

::: code-group
```typescript [TypeScript]
// Header.vue
import { componentBus } from './shared';

function toggleTheme(theme: 'light' | 'dark') {
  componentBus.emit('themeChange', theme);
}
```

```javascript [JavaScript]
// Header.vue
import { componentBus } from './shared';

function toggleTheme(theme) {
  componentBus.emit('themeChange', theme);
}
```
:::

### 4.2 Sidebar 组件（订阅）

::: code-group
```typescript [TypeScript]
// Sidebar.vue
import { componentBus } from './shared';
import { onMounted, onUnmounted } from 'vue';

const bus = componentBus;

onMounted(() => {
  bus.on('themeChange', (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme);
  });
});

onUnmounted(() => {
  bus.off('themeChange');
});
```

```javascript [JavaScript]
// Sidebar.vue
import { componentBus } from './shared';
import { onMounted, onUnmounted } from 'vue';

const bus = componentBus;

onMounted(() => {
  bus.on('themeChange', (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
  });
});

onUnmounted(() => {
  bus.off('themeChange');
});
```
:::

## 5. 全局事件总线场景

### 1. 跨页面状态同步

::: code-group
```typescript [TypeScript]
import { eventBus } from 'l-js-fn/event-bus';

interface User {
  name: string;
  id: number;
}

// A 页面：用户登录后广播
async function login(username: string, password: string): Promise<void> {
  const user: User = await api.login(username, password);
  eventBus.emit('userLoggedIn', user);
}

// B 页面：头部组件显示用户信息
eventBus.on('userLoggedIn', (user: User) => {
  document.getElementById('header-avatar')!.textContent = user.name;
});
```

```javascript [JavaScript]
import { eventBus } from 'l-js-fn/event-bus';

// A 页面：用户登录后广播
async function login(username, password) {
  const user = await api.login(username, password);
  eventBus.emit('userLoggedIn', user);
}

// B 页面：头部组件显示用户信息
eventBus.on('userLoggedIn', (user) => {
  document.getElementById('header-avatar').textContent = user.name;
});
```
:::

### 2. 全局通知系统

::: code-group
```typescript [TypeScript]
import { eventBus } from 'l-js-fn/event-bus';

// 通知中心订阅
eventBus.on('notification', (message: string) => {
  showToast(message);
});

// 任意模块推送通知
eventBus.emit('notification', '文件上传成功');
eventBus.emit('notification', '网络连接异常，请检查');
```

```javascript [JavaScript]
import { eventBus } from 'l-js-fn/event-bus';

// 通知中心订阅
eventBus.on('notification', (message) => {
  showToast(message);
});

// 任意模块推送通知
eventBus.emit('notification', '文件上传成功');
eventBus.emit('notification', '网络连接异常，请检查');
```
:::

### 3. 插件 / 中间件通信

::: code-group
```typescript [TypeScript]
import { EventBus } from 'l-js-fn/event-bus';

type PluginEvents = {
  beforeRequest: [url: string, options: RequestInit];
  afterResponse: [url: string, data: unknown];
  requestError: [url: string, error: Error];
};

const pluginBus = new EventBus<PluginEvents>();

// 日志插件
pluginBus.on('beforeRequest', (url) => {
  console.log(`[Request] ${url}`);
});
pluginBus.on('afterResponse', (url) => {
  console.log(`[Response] ${url}`);
});
pluginBus.on('requestError', (url, err) => {
  console.error(`[Error] ${url}:`, err.message);
});
```

```javascript [JavaScript]
import { EventBus } from 'l-js-fn/event-bus';

const pluginBus = new EventBus();

// 日志插件
pluginBus.on('beforeRequest', (url) => {
  console.log(`[Request] ${url}`);
});
pluginBus.on('afterResponse', (url) => {
  console.log(`[Response] ${url}`);
});
pluginBus.on('requestError', (url, err) => {
  console.error(`[Error] ${url}:`, err.message);
});
```
:::

## 6. 一次性事件监听

适用于只需要响应一次的初始化、加载完成等场景。

::: code-group
```typescript [TypeScript]
import { EventBus } from 'l-js-fn/event-bus';

type AppEvents = { appReady: [config: Record<string, unknown>] };
const bus = new EventBus<AppEvents>();

bus.once('appReady', (config) => {
  startApp(config);
  initModules();
});

bus.emit('appReady', { version: '2.0' });
// 再次 emit 不会触发
bus.emit('appReady', { version: '2.0' });
```

```javascript [JavaScript]
import { EventBus } from 'l-js-fn/event-bus';

const bus = new EventBus();

bus.once('appReady', (config) => {
  startApp(config);
  initModules();
});

bus.emit('appReady', { version: '2.0' });
// 再次 emit 不会触发
bus.emit('appReady', { version: '2.0' });
```
:::

## 7. 事件编排与链式操作

将多个事件组合成业务流程。

::: code-group
```typescript [TypeScript]
type WorkflowEvents = {
  step1Done: [data: string];
  step2Done: [data: number];
  step3Done: [];
  workflowComplete: [];
};

const workflow = new EventBus<WorkflowEvents>();

workflow.on('step1Done', (data) => {
  const result = parseStep1(data);
  workflow.emit('step2Done', result);
});

workflow.on('step2Done', (data) => {
  saveToDatabase(data);
  workflow.emit('step3Done');
});

workflow.on('step3Done', () => {
  workflow.emit('workflowComplete');
});

workflow.once('workflowComplete', () => {
  console.log('流程执行完毕');
});

// 开始流程
workflow.emit('step1Done', 'raw-data');
```

```javascript [JavaScript]
const workflow = new EventBus();

workflow.on('step1Done', (data) => {
  const result = parseStep1(data);
  workflow.emit('step2Done', result);
});

workflow.on('step2Done', (data) => {
  saveToDatabase(data);
  workflow.emit('step3Done');
});

workflow.on('step3Done', () => {
  workflow.emit('workflowComplete');
});

workflow.once('workflowComplete', () => {
  console.log('流程执行完毕');
});

// 开始流程
workflow.emit('step1Done', 'raw-data');
```
:::

## 8. 调试与监控

利用 `listenerCount` 检查订阅状态，防止内存泄漏。

::: code-group
```typescript [TypeScript]
import { EventBus } from 'l-js-fn/event-bus';

const bus = new EventBus<{ dataUpdate: [payload: unknown] }>();

bus.on('dataUpdate', handler1);
bus.on('dataUpdate', handler2);
bus.on('dataUpdate', handler3);

console.log(bus.listenerCount('dataUpdate')); // 3

// 组件卸载时清理
function cleanup(): void {
  bus.off('dataUpdate');
  console.log(bus.listenerCount('dataUpdate')); // 0
}

console.log(bus.listenerCount()); // 全局总监听数
```

```javascript [JavaScript]
import { EventBus } from 'l-js-fn/event-bus';

const bus = new EventBus();

bus.on('dataUpdate', handler1);
bus.on('dataUpdate', handler2);
bus.on('dataUpdate', handler3);

console.log(bus.listenerCount('dataUpdate')); // 3

// 组件卸载时清理
function cleanup() {
  bus.off('dataUpdate');
  console.log(bus.listenerCount('dataUpdate')); // 0
}

console.log(bus.listenerCount()); // 全局总监听数
```
:::

> **提示**：请在组件销毁或页面离开时调用 `off()` 或 `clear()` 清理监听，避免内存泄漏。
