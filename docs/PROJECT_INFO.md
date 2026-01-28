# l-js-fn

> 整理了常用的 JavaScript 方法，轻量级、零依赖、TypeScript 支持

![npm version](https://badge.fury.io/js/l-js-fn.svg)
![downloads](https://img.shields.io/npm/dm/l-js-fn)
![license](https://img.shields.io/npm/l/l-js-fn)

## ✨ 特性

- 🚀 **轻量级** - 零依赖，打包体积小
- 📦 **模块化** - 支持按需导入，减少包体积
- 🔒 **TypeScript** - 完整的类型定义
- 🌐 **双模块格式** - 同时支持 ESM 和 CJS
- 🎨 **Tree-shaking** - 完整支持 Tree-shaking，只打包用到的代码
- 💪 **工具齐全** - 涵盖数组、对象、字符串、日期、URL、正则等常用操作
- 🔧 **高级功能** - WebSocket 管理、轮询、IPC 通信等

## 📦 安装

```bash
npm install l-js-fn
# 或
yarn add l-js-fn
# 或
pnpm add l-js-fn
```

## 🚀 快速开始

### 导入主包（包含所有工具函数）

```typescript
import { isArray, dateFormat, isEmpty } from 'l-js-fn';

// 类型判断
isArray([1, 2, 3]); // true

// 日期格式化
dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss'); // "2024-01-01 12:00:00"

// 空值检查
isEmpty(''); // true
isEmpty(null); // true
```

### 按需导入（推荐）

只导入你需要的模块，减少打包体积：

```typescript
// 浏览器对象模型方法
import { scrollTop, copyToClipboard, launchFullscreen } from 'l-js-fn/bom';

// 轮询工具类
import { Polling } from 'l-js-fn/polling';

// WebSocket 管理类
import { WebSocketManager } from 'l-js-fn/ws';

// 正则表达式常量
import { REGEXP } from 'l-js-fn/regex';

// 配置常量
import { DATE_FORMAT, HTTP_STATUS } from 'l-js-fn/config';

// IPC 通信
import { H5Bridge, IframeBridge } from 'l-js-fn/ipc';
```

## 📚 API 文档

### 主包工具函数

#### 类型判断 (is-kit)

```typescript
import {
  isEmpty,
  isNotEmpty,
  isObject,
  isArray,
  isString,
  isEmail,
  isURL,
  isIdCard,
  isPhoneNumber,
  isEqual,
  validateParams
} from 'l-js-fn';

// 空值检查
isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true

// 邮箱验证
isEmail('test@example.com'); // true

// 手机号验证（中国大陆）
isPhoneNumber('13800138000'); // true

// 身份证验证
isIdCard('110101199001011234'); // true

// 深度比较
isEqual({ a: 1 }, { a: 1 }); // true

// 参数校验
validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'
```

#### 数组操作 (array-kit)

```typescript
import {
  arrayDelEl,
  arrayDelToIndex,
  arrayFill,
  arrayUnique,
  arrayPaginate,
  arraySplitToGroups,
  moveElement
} from 'l-js-fn';

// 删除元素
arrayDelEl([1, 2, 3, 2], 2); // [1, 3]

// 根据索引删除
arrayDelToIndex([1, 2, 3], 1); // [1, 3]

// 数组补充到指定长度
arrayFill([1, 2], 5, 0); // [1, 2, 0, 0, 0]

// 数组去重
arrayUnique([1, 2, 2, 3]); // [1, 2, 3]

// 数组分页
arrayPaginate([1, 2, 3, 4, 5], 2, 2); // [3, 4]

// 数组分组
arraySplitToGroups([1, 2, 3, 4, 5], 2);
// { 1: [1, 2], 2: [3, 4], 3: [5] }

// 移动数组元素
moveElement([1, 2, 3], 1, 'up'); // 移动索引1的元素向上
```

#### 字符串处理 (string-kit)

```typescript
import {
  desensitization,
  trim,
  getMobile,
  getUuid,
  indexToLabel
} from 'l-js-fn';

// 字符串脱敏
desensitization('13800138000', 3, 4); // "138****8000"

// 去除空格
trim('  hello  '); // "hello"
trim('  hello  ', 'all'); // "hello"

// 生成随机手机号
getMobile(); // "13800138000"

// 生成 UUID
getUuid(); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

// 索引转标签
indexToLabel(0, 'upper'); // "A"
indexToLabel(1, 'lower'); // "b"
indexToLabel(0, 'chinese'); // "一"
```

#### 对象操作 (object-kit)

```typescript
import {
  objMerge,
  objFilterProp,
  objFilterNull,
  jsonToFormData,
  formDataToObject
} from 'l-js-fn';

// 对象合并
objMerge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }

// 过滤属性
objFilterProp({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }

// 过滤空值
objFilterNull({ a: 1, b: null, c: undefined }); // { a: 1 }

// JSON 转 FormData
jsonToFormData({ name: 'John', age: 20 }); // FormData

// FormData 转 JSON
formDataToObject(formData); // { name: 'John', age: 20 }
```

#### 日期处理 (date-kit)

```typescript
import {
  dateFormat,
  dateSecond,
  diffDays,
  formatPassTime,
  monthDays,
  getTimeDiff
} from 'l-js-fn';

// 日期格式化
dateFormat(new Date()); // "2024-01-01 12:00:00"
dateFormat(new Date(), 'yyyy-MM-dd'); // "2024-01-01"

// 秒数转时间
dateSecond(3661); // "01:01:01"

// 计算天数差
diffDays('2024-01-01', '2024-01-03'); // 2

// 格式化过去时间
formatPassTime('2024-01-01 12:00:00'); // "3天前"

// 获取当月天数
monthDays('2024-02-01'); // 29

// 时间差计算
getTimeDiff('2024-01-01', '2024-01-02'); // 86400000
```

#### 数字处理 (number-kit)

```typescript
import {
  formatNumber,
  toPercent,
  random,
  getUniqueRandomIndexes
} from 'l-js-fn';

// 数字格式化
formatNumber(1234567); // "1,234,567"
formatNumber(1234567, true); // "123万"

// 转百分比
toPercent(0.5332); // "53.32%"

// 生成随机数
random(10); // 0-10 之间的随机整数
random(1, 10); // 1-10 之间的随机整数
random(1, 10, { float: true }); // 1-10 之间的随机浮点数

// 生成不重复随机索引
getUniqueRandomIndexes(10, 3); // [0, 5, 8]
```

#### URL 处理 (url-kit)

```typescript
import {
  getUrlParams,
  getUrlParam,
  appendUrlParam,
  transUrlParams,
  getFileInfoToUrl
} from 'l-js-fn';

// 解析 URL 参数
getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

// 获取单个参数
getUrlParam('https://example.com?id=1', 'id'); // '1'

// 添加 URL 参数
appendUrlParam('https://example.com', 'id', 1);
// "https://example.com?id=1"

// 对象转 URL 参数
transUrlParams({ id: 1, name: 'John' }); // "id=1&name=John"

// 从 URL 获取文件信息
getFileInfoToUrl('https://example.com/file.txt');
// { fileName: 'file.txt', extension: '.txt' }
```

#### 通用工具 (common)

```typescript
import {
  sleep,
  debounce,
  throttle,
  getType,
  deepClone,
  getDevice,
  imageToBase64
} from 'l-js-fn';

// 睡眠函数
await sleep(1000); // 延迟 1 秒

// 防抖
const debouncedFn = debounce(() => {
  console.log('执行');
}, 300);

// 节流
const throttledFn = throttle(() => {
  console.log('执行');
}, 300);

// 获取类型
getType([1, 2, 3]); // "array"
getType(new Date()); // "date"

// 深拷贝
deepClone({ a: { b: 1 } }); // { a: { b: 1 } }

// 获取设备类型
getDevice(); // "ios" | "android" | "windows" | "macos" | ...

// 图片转 Base64
const result = await imageToBase64('https://example.com/image.png');
```

### 浏览器对象模型 (bom)

```typescript
import {
  scrollTop,
  scrollToBottom,
  getScrollPosition,
  setScrollPosition,
  launchFullscreen,
  exitFullscreen,
  copyToClipboard
} from 'l-js-fn/bom';

// 平滑滚动到顶部
scrollTop();

// 滚动到底部
scrollToBottom();

// 获取滚动位置
getScrollPosition(); // { x: 0, y: 100 }

// 设置滚动位置
setScrollPosition({ x: 0, y: 100 }, true);

// 进入全屏
await launchFullscreen(document.documentElement);

// 退出全屏
await exitFullscreen();

// 复制到剪贴板
await copyToClipboard('要复制的文本');
```

### WebSocket 管理 (ws)

```typescript
import { WebSocketManager } from 'l-js-fn/ws';

const ws = new WebSocketManager(
  'ws://localhost:8080',
  (message) => console.log('收到消息:', message),
  (error) => console.error('错误:', error)
);

// 发送消息
ws.sendWebSocketMessage({ type: 'ping', data: 'hello' });

// 检查连接并发送消息
ws.checkConnection({ type: 'heartbeat' }, 10000);

// 重新连接
ws.reconnect(5000);

// 关闭连接
ws.close();
```

### 轮询工具 (polling)

```typescript
import { Polling } from 'l-js-fn/polling';

const polling = new Polling();

// 启动轮询
polling.start(
  async () => {
    const response = await fetch('https://api.example.com/data');
    return response.json();
  },
  1000, // 间隔 1 秒
  true // 立即执行
);

// 停止轮询
polling.stop();

// 检查是否正在运行
polling.running; // true
```

### 正则表达式 (regex)

```typescript
import { REGEXP } from 'l-js-fn/regex';

// 手机号验证
REGEXP.PHONE.test('13800138000'); // true

// 邮箱验证
REGEXP.EMAIL.test('test@example.com'); // true

// URL 验证
REGEXP.URL.test('https://example.com'); // true

// 身份证验证
REGEXP.ID_CARD.test('110101199001011234'); // true

// 中文验证
REGEXP.CHINESE.test('中文'); // true

// 金额验证
REGEXP.MONEY.test('123.45'); // true
```

### 配置常量 (config)

```typescript
import { DATE_FORMAT, HTTP_STATUS } from 'l-js-fn/config';

// 日期格式
DATE_FORMAT.FULL; // "yyyy-MM-dd HH:mm:ss"
DATE_FORMAT.DATE; // "yyyy-MM-dd"
DATE_FORMAT.TIME; // "HH:mm:ss"

// HTTP 状态码
HTTP_STATUS.OK; // 200
HTTP_STATUS.UNAUTHORIZED; // 401
HTTP_STATUS.NOT_FOUND; // 404
```

### IPC 通信 (ipc)

```typescript
import { H5Bridge, IframeBridge } from 'l-js-fn/ipc';

// H5 与原生通信
const h5Bridge = new H5Bridge();

// Iframe 通信
const iframeBridge = new IframeBridge('https://example.com');
```

## 🌐 浏览器兼容性

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 📦 模块化导入

本项目支持多种导入方式：

```typescript
// 导入主包
import { isArray } from 'l-js-fn';

// 按需导入子模块
import { scrollTop } from 'l-js-fn/bom';
import { Polling } from 'l-js-fn/polling';
import { WebSocketManager } from 'l-js-fn/ws';

// CommonJS 导入
const { isArray } = require('l-js-fn');
const { scrollTop } = require('l-js-fn/bom');
```

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

请查看 [CONTRIBUTING.md](./CONTRTRIBUTING.md) 了解详情。

## 📄 许可证

[ISC](LICENSE)

## 🔗 相关链接

- [npm](https://www.npmjs.com/package/l-js-fn)
- [GitHub Issues](https://github.com/jiuxianzai/l-js-fn/issues)
