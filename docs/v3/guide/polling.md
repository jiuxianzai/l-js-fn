# polling — 轮询工具

轮询工具类，支持异步方法的定时执行，兼容 Jest FakeTimers。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/polling` 仍保留，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { Polling } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { Polling } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { Polling } = require('l-js-fn/polling');
```
:::

## 1. Polling 轮询类

轮询工具类。

### 1.1 start 启动轮询

启动轮询。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| asyncMethod | `() => Promise<T>` | 是 | 异步方法 |
| interval | `number` | 否 | 轮询间隔（毫秒），默认 `1000` |
| immediate | `boolean` | 否 | 是否立即执行，默认 `true` |

**返回值：** `void`

**示例：**

::: code-group
```ts [TypeScript]
import { Polling } from 'l-js-fn';

const polling = new Polling();

polling.start(
  async () => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  },
  5000,  // 每 5 秒执行一次
  true   // 立即执行
);
```

```js [JavaScript (ESM)]
import { Polling } from 'l-js-fn';

const polling = new Polling();

polling.start(
  async () => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  },
  5000,  // 每 5 秒执行一次
  true   // 立即执行
);
```

```js [JavaScript (CJS)]
const { Polling } = require('l-js-fn/polling');

const polling = new Polling();

polling.start(
  async () => {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  },
  5000,  // 每 5 秒执行一次
  true   // 立即执行
);
```
:::

### 1.2 stop 停止轮询

停止轮询。

**返回值：** `void`

**示例：**

```typescript
polling.stop();
```

### 1.3 running

获取轮询状态（getter）。

**返回值：** `boolean` — 是否正在轮询

**示例：**

```typescript
console.log(polling.running); // true | false
```

## 2. 完整示例

::: code-group
```ts [TypeScript]
import { Polling } from 'l-js-fn';

const polling = new Polling();

// 启动轮询
polling.start(
  async () => {
    const response = await fetch('/api/status');
    const data = await response.json();
    
    if (data.status === 'completed') {
      console.log('任务完成');
      polling.stop();
    }
  },
  2000,  // 每 2 秒检查一次
  true
);

// 5 分钟后自动停止
setTimeout(() => {
  if (polling.running) {
    polling.stop();
    console.log('轮询超时');
  }
}, 5 * 60 * 1000);
```

```js [JavaScript (ESM)]
import { Polling } from 'l-js-fn';

const polling = new Polling();

// 启动轮询
polling.start(
  async () => {
    const response = await fetch('/api/status');
    const data = await response.json();
    
    if (data.status === 'completed') {
      console.log('任务完成');
      polling.stop();
    }
  },
  2000,  // 每 2 秒检查一次
  true
);

// 5 分钟后自动停止
setTimeout(() => {
  if (polling.running) {
    polling.stop();
    console.log('轮询超时');
  }
}, 5 * 60 * 1000);
```

```js [JavaScript (CJS)]
const { Polling } = require('l-js-fn/polling');

const polling = new Polling();

// 启动轮询
polling.start(
  async () => {
    const response = await fetch('/api/status');
    const data = await response.json();
    
    if (data.status === 'completed') {
      console.log('任务完成');
      polling.stop();
    }
  },
  2000,  // 每 2 秒检查一次
  true
);

// 5 分钟后自动停止
setTimeout(() => {
  if (polling.running) {
    polling.stop();
    console.log('轮询超时');
  }
}, 5 * 60 * 1000);
```
:::
