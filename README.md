# l-js-fn

> 整理了常用的 JavaScript 方法，轻量级、零依赖、TypeScript 支持

![npm version](https://badge.fury.io/js/l-js-fn.svg)
![downloads](https://img.shields.io/npm/dm/l-js-fn)
![license](https://img.shields.io/npm/l/l-js-fn)
![test pass](https://img.shields.io/badge/tests-1446%2F1446%20passed-brightgreen)
![coverage](https://img.shields.io/badge/coverage-99%25-brightgreen)
![functions](https://img.shields.io/badge/functions-100%25-brightgreen)
![branches](https://img.shields.io/badge/branches-93%25-brightgreen)
[![docs](https://img.shields.io/badge/docs-GitHub%20Pages-42b883)](https://jiuxianzai.github.io/l-js-fn/)

## ✨ 特性

- 🚀 **轻量级** - 零依赖，打包体积小
- 📦 **模块化** - 支持按需导入，减少包体积
- 🔒 **TypeScript** - 完整的类型定义
- 🌐 **双模块格式** - 同时支持 ESM 和 CJS
- 🎨 **Tree-shaking** - 完整支持 Tree-shaking，只打包用到的代码
- 💪 **工具齐全** - 涵盖数组、对象、字符串、日期、URL、正则等常用操作
- 🔧 **高级功能** - WebSocket 管理、轮询、IPC 通信、事件总线等
- 📖 **完整文档** - 在线文档见 [GitHub Pages](https://jiuxianzai.github.io/l-js-fn/)

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

// 编码/解码
import { escapeHTML, base64Encode } from 'l-js-fn/encode';

// 文件处理
import { formatFileSize, isImage } from 'l-js-fn/file';

// 加密模块
import {
	md5,
	aesEncrypt,
	aesDecrypt,
	rsaEncrypt,
	rsaDecrypt,
	rsaGenerateKeyPair,
	sm2Encrypt,
	sm2Decrypt,
	sm2GenerateKeyPair,
	sm4Encrypt,
	sm4Decrypt,
} from 'l-js-fn/crypto';

// 事件总线
import { EventBus, eventBus } from 'l-js-fn/event-bus';

// 加密模块
import { md5, aesEncrypt, rsaEncrypt } from 'l-js-fn/crypto';
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
	isInArray,
	isString,
	isEmail,
	isURL,
	isIdCard,
	isPhoneNumber,
	isEqual,
	validateParams,
} from 'l-js-fn';

// 空值检查
isEmpty(''); // true
isEmpty([]); // true
isEmpty({}); // true

// 邮箱验证
isEmail('test@example.com'); // true

// URL 验证（含绝对路径、协议相对路径）
isURL('https://example.com'); // true
isURL('/path/to/page'); // true
isURL('//cdn.example.com'); // true

// 手机号验证（中国大陆）
isPhoneNumber('13800138000'); // true

// 身份证验证
isIdCard('110101199001011234'); // true

// 深度比较
isEqual({ a: 1 }, { a: 1 }); // true

// 参数校验
validateParams(['name', 'age'], { name: 'John', age: 20 }); // null
validateParams(['name'], { age: 20 }); // 'name'

// 地址数组检查（忽略 ? 后的查询参数）
isInArray(['https://example.com'], 'https://example.com?foo=bar'); // true
isInArray([], 'https://example.com'); // false
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
	moveElement,
	groupBy,
	sample,
	sampleSize,
	flatten,
	range,
	shuffle,
	uniqueBy,
	compact,
	sum,
	sumBy,
	last,
	arrayPluck,
	sortBy,
	uniq,
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

// 按字段分组对象数组
groupBy(
	[
		{ name: 'Alice', age: 25 },
		{ name: 'Bob', age: 25 },
		{ name: 'Charlie', age: 30 },
	],
	'age'
);
// { 25: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 25 }], 30: [{ name: 'Charlie', age: 30 }] }

// 随机取一个元素
sample([1, 2, 3, 4, 5]); // 3（随机）

// 随机取 n 个元素
sampleSize([1, 2, 3, 4, 5], 2); // [2, 5]（随机）

// 数组扁平化
flatten([1, [2, [3]]]); // [1, 2, 3]
flatten([1, [2, [3]]], 1); // [1, 2, [3]]

// 生成范围数组
range(0, 5); // [0, 1, 2, 3, 4, 5]
range(5, 0, -1); // [5, 4, 3, 2, 1, 0]

// Fisher-Yates 洗牌
shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]（随机）

// 按对象字段去重
uniqueBy([{ id: 1 }, { id: 2 }, { id: 1 }], 'id'); // [{id:1},{id:2}]

// 过滤 falsy 值
compact([0, 1, false, 2, '', 3]); // [1, 2, 3]

// 数组求和
sum([1, 2, 3, 4, 5]); // 15

// 获取最后一个元素
last([1, 2, 3]); // 3

// 提取对象数组指定字段为扁平数组（递归深层嵌套，过滤 null/undefined）
arrayPluck([{ name: 'zz' }, { name: 'yy' }], 'name'); // ['zz', 'yy']

// 按字段排序
sortBy([{ id: 2 }, { id: 1 }], 'id'); // [{ id: 1 }, { id: 2 }]
sortBy([{ age: 20 }, { age: 30 }], 'age', 'desc'); // [{ age: 30 }, { age: 20 }]

// 基础类型数组去重
uniq([1, 2, 2, 3]); // [1, 2, 3]
uniq(['a', 'b', 'a']); // ['a', 'b']

// 按字段求和
sumBy([{ price: 10 }, { price: 20 }], 'price'); // 30
```

#### 字符串处理 (string-kit)

```typescript
import {
	desensitization,
	desensitizeName,
	trim,
	getMobile,
	getUuid,
	indexToLabel,
	toPascalCase,
	toCamelCase,
	toKebabCase,
	capitalize,
} from 'l-js-fn';

// 字符串脱敏
desensitization('13800138000', 3, 4); // "138****8000"

// 姓名脱敏
desensitizeName('张三丰'); // "张*丰"
desensitizeName('欧阳飞飞'); // "欧**飞"
desensitizeName('张三', 'surname'); // "*三"
desensitizeName('张三丰', 'last'); // "**丰"

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

// 帕斯卡命名 (PascalCase)
toPascalCase('hello-world'); // "HelloWorld"

// 驼峰命名 (camelCase)
toCamelCase('hello-world'); // "helloWorld"

// 短横线命名 (kebab-case)
toKebabCase('helloWorld'); // "hello-world"

// 首字母大写
capitalize('hello'); // "Hello"
```

#### 对象操作 (object-kit)

```typescript
import { objMerge, objFilterProp, objFilterNull, jsonToFormData, formDataToObject, pick, omit, get, deepMerge } from 'l-js-fn';

// 对象合并
objMerge({ a: 1 }, { b: 2 }); // { a: 1, b: 2 }

// 过滤属性
objFilterProp({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }

// 过滤空值（默认同时过滤 null 和 undefined）
objFilterNull({ a: 1, b: null, c: undefined }); // { a: 1 }

// 只过滤 null，保留 undefined
objFilterNull({ a: 1, b: null, c: undefined }, { null: true, undefined: false }); // { a: 1, c: undefined }

// 只过滤 undefined，保留 null
objFilterNull({ a: 1, b: null, c: undefined }, { null: false, undefined: true }); // { a: 1, b: null }

// JSON 转 FormData
jsonToFormData({ name: 'John', age: 20 }); // FormData

// FormData 转 JSON
formDataToObject(formData); // { name: 'John', age: 20 }

// 选取属性
pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a: 1, c: 3 }

// 排除属性（pick 的反操作）
omit({ a: 1, b: 2, c: 3 }, ['b']); // { a: 1, c: 3 }

// 安全深层取值
get({ a: { b: { c: 1 } } }, 'a.b.c'); // 1
get({ a: 1 }, 'b.c', 'default'); // 'default'

// 深度合并
deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
// { a: { b: 1, c: 2 } }
```

#### 日期处理 (date-kit)

```typescript
import { dateFormat, dateSecond, diffDays, diffTime, formatPassTime, monthDays, getTimeDiff, addDays, isLeapYear, getWeekDay } from 'l-js-fn';

// 日期格式化
dateFormat(new Date()); // "2024-01-01 12:00:00"
dateFormat(new Date(), 'yyyy-MM-dd'); // "2024-01-01"

// 秒数转时间
dateSecond(3661); // "01:01:01"

// 计算天数差
diffDays('2024-01-01', '2024-01-03'); // 2

// 计算时间差值（日/时/分/秒）
diffTime('2024-01-01 10:00:00', '2024-01-02 12:30:45');
// { days: 1, hours: 2, minutes: 30, seconds: 45 }

// 格式化过去时间
formatPassTime('2024-01-01 12:00:00'); // "3天前"

// 获取当月天数
monthDays('2024-02-01'); // 29

// 时间差计算
getTimeDiff('2024-01-01', '2024-01-02'); // 86400000

// 日期加减天数
addDays(new Date('2024-01-01'), 1); // 2024-01-02
addDays(new Date('2024-01-01'), -1); // 2023-12-31

// 闰年判断
isLeapYear(2024); // true

// 中文星期
getWeekDay(new Date('2024-01-01')); // '星期一'
```

#### 数字处理 (number-kit)

```typescript
import { formatNumber, toPercent, random, getUniqueRandomIndexes, clamp, round } from 'l-js-fn';

// 数字格式化
formatNumber(1234567); // "1,234,567"
formatNumber(1234567, true); // "123.47万"

// 控制小数位
formatNumber(1234, { decimals: 2 }); // "1,234.00"
formatNumber(1234567, { type: 'number', decimals: 2 }); // "1234567.00"

// 中文大写金额
formatNumber(123.45, { type: 'chinese' }); // "壹佰贰拾叁元肆角伍分"
formatNumber(0.5, { type: 'chinese' }); // "伍角"

// 转百分比
toPercent(0.5332); // "53.32%"

// 生成随机数
random(10); // 0-10 之间的随机整数
random(1, 10); // 1-10 之间的随机整数
random(1, 10, { float: true }); // 1-10 之间的随机浮点数

// 生成不重复随机索引
getUniqueRandomIndexes(10, 3); // [0, 5, 8]

// 限制值范围
clamp(5, 0, 10); // 5
clamp(-1, 0, 10); // 0

// 四舍五入
round(3.14159, 2); // 3.14
```

#### URL 处理 (url-kit)

```typescript
import { getUrlParams, getUrlParam, appendUrlParam, appendUrlParams, transUrlParams, getFileInfoToUrl } from 'l-js-fn';

// 解析 URL 参数
getUrlParams('https://example.com?id=1&name=John');
// { id: '1', name: 'John' }

// 获取单个参数
getUrlParam('https://example.com?id=1', 'id'); // '1'

// 添加 URL 参数
appendUrlParam('https://example.com', 'id', 1);
// "https://example.com?id=1"

// 批量添加 URL 参数（默认追加到 # 后，支持 position: 'before' 控制）
appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' });
// "https://example.com?id=1&name=zs&age=1"

appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' });
// "https://example.com/#/home?id=1&name=yyp"

appendUrlParams('https://example.com/#/home', { id: '1' }, { position: 'before' });
// "https://example.com/?id=1#/home"

// 对象转 URL 参数
transUrlParams({ id: 1, name: 'John' }); // "id=1&name=John"

// 从 URL 获取文件信息
getFileInfoToUrl('https://example.com/file.txt');
// { fileName: 'file.txt', extension: '.txt' }
```

#### 通用工具 (common)

```typescript
import { sleep, debounce, throttle, getType, deepClone, getDevice, imageToBase64, retry, once, memoize, loadScript, removeScript } from 'l-js-fn';

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

// 异步函数重试
const fn = retry(async () => fetch('/api'), { times: 3, delay: 1000 });
await fn();

// 只执行一次
const init = once(() => console.log('init'));
init(); // 输出 'init'
init(); // 无输出（跳过）

// 缓存计算结果
const add = memoize((a, b) => a + b);
add(1, 2); // 计算并返回 3
add(1, 2); // 直接返回 3（缓存命中）
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
	copyToClipboard,
	setCookie,
	getCookie,
	removeCookie,
	hasCookie,
	getAllCookies,
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

// Cookie 操作
setCookie('token', 'abc123', { expires: 30, secure: true }); // 设置 Cookie，30 天后过期
getCookie('token'); // 'abc123'
hasCookie('token'); // true
removeCookie('token'); // 删除 Cookie
getAllCookies(); // { token: 'abc123', user: 'john' }
```

### 本地存储 (storage)

```typescript
import { setStorage, getStorage, removeStorage, clearStorage, clearExpiredStorage, setSession, getSession, removeSession } from 'l-js-fn/storage';

// localStorage 操作（支持过期时间）
setStorage('user', { name: 'John', age: 20 });
setStorage('token', 'abc123', { expire: 3600 }); // 1 小时后过期
getStorage('user'); // { name: 'John', age: 20 }
getStorage('token'); // 'abc123'（未过期）或 null（已过期）
removeStorage('user');
clearStorage();
clearExpiredStorage(); // 清理所有已过期的数据

// sessionStorage 操作
setSession('tabData', { id: 1, name: 'test' });
getSession('tabData'); // { id: 1, name: 'test' }
removeSession('tabData');
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

// IPv4 地址
REGEXP.IPV4.test('192.168.1.1'); // true

// 十六进制颜色值
REGEXP.HEX_COLOR.test('#fff'); // true
REGEXP.HEX_COLOR.test('#ffffff'); // true

// 中国邮政编码
REGEXP.POSTAL_CODE.test('100000'); // true

// 车牌号（含新能源）
REGEXP.PLATE_NUMBER.test('京A12345'); // true
REGEXP.PLATE_NUMBER.test('粤C12345D'); // true

// 小数/浮点数
REGEXP.DECIMAL.test('3.14'); // true
REGEXP.DECIMAL.test('-1.5'); // true

// 日期格式 yyyy-MM-dd
REGEXP.DATE.test('2024-01-01'); // true

// 时间格式 HH:mm:ss
REGEXP.TIME.test('12:30:00'); // true

// 域名（不含协议）
REGEXP.DOMAIN.test('example.com'); // true

// 统一社会信用代码
REGEXP.TAX_ID.test('91110108551111111A'); // true
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

### 编码/解码 (encode)

```typescript
import { base64Encode, base64Decode, escapeHTML, unescapeHTML, urlEncode, urlDecode, querystringify, parseQueryString } from 'l-js-fn/encode';

// Base64 编码/解码（支持 Unicode）
base64Encode('Hello World'); // 'SGVsbG8gV29ybGQ='
base64Encode('你好'); // '5L2g5aW9'
base64Decode('SGVsbG8gV29ybGQ='); // 'Hello World'

// HTML 转义/反转义（防 XSS 攻击）
escapeHTML('<script>alert("XSS")</script>');
// '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
unescapeHTML('&lt;div&gt;'); // '<div>'

// URL 编码/解码
urlEncode('Hello World!'); // 'Hello%20World!'
urlDecode('Hello%20World'); // 'Hello World'

// 查询字符串转换
querystringify({ name: 'John', age: 20 }); // 'name=John&age=20'
querystringify({ a: [1, 2, 3] }); // 'a=1&a=2&a=3'
parseQueryString('name=John&age=20'); // { name: 'John', age: '20' }
parseQueryString('?a=1&a=2'); // { a: ['1', '2'] }
```

### 文件处理 (file)

```typescript
import {
	formatFileSize,
	getExtension,
	getFileName,
	downloadFile,
	readAsText,
	readAsDataURL,
	readAsArrayBuffer,
	isImage,
	isVideo,
	isAudio,
	isPDF,
	FileSizeUnit,
} from 'l-js-fn/file';

// 格式化文件大小
formatFileSize(1024); // { formatted: '1 KB', value: 1, unit: 'KB' }
formatFileSize(1536000); // { formatted: '1.46 MB', value: 1.46, unit: 'MB' }
formatFileSize(1024, { precision: 0 }); // { formatted: '1 KB', value: 1, unit: 'KB' }
formatFileSize(1000, { base: 1000 }); // { formatted: '1 KB', value: 1, unit: 'KB' }

// 文件名处理
getExtension('image.png'); // '.png'
getExtension('/path/to/file.txt'); // '.txt'
getFileName('/path/to/image.png'); // 'image'
getFileName('document.pdf'); // 'document'

// 浏览器下载文件
const blob = new Blob(['Hello World'], { type: 'text/plain' });
downloadFile(blob, 'hello.txt');

// 读取文件内容
const file = new File(['content'], 'test.txt');
await readAsText(file); // 'content'
await readAsDataURL(file); // 'data:text/plain;base64,...'
await readAsArrayBuffer(file); // ArrayBuffer

// 文件类型判断
isImage('photo.jpg'); // true
isVideo('movie.mp4'); // true
isAudio('music.mp3'); // true
isPDF('document.pdf'); // true
```

### 事件总线 (event-bus)

```typescript
import { EventBus, eventBus } from 'l-js-fn/event-bus';

// 创建实例
const bus = new EventBus();

// 订阅事件
bus.on('login', (user: string) => console.log(user));

// 订阅一次性事件
bus.once('init', () => console.log('初始化'));

// 发布事件
bus.emit('login', 'Alice');
bus.emit('init');

// 取消订阅
const handler = (data: string) => console.log(data);
bus.on('data', handler);
bus.off('data', handler);

// 取消某事件的所有订阅
bus.off('login');

// 查看监听数量
bus.listenerCount('login'); // 0
bus.listenerCount(); // 总数量

// 清除所有事件
bus.clear();

// 类型安全用法
type Events = {
	login: [user: string];
	logout: [];
	score: [name: string, points: number];
};
const typedBus = new EventBus<Events>();
typedBus.on('login', (user) => console.log(user)); // user 自动推断为 string
typedBus.emit('login', 'Bob');

// 全局单例
eventBus.on('global-event', (msg: string) => console.log(msg));
eventBus.emit('global-event', 'Hello');
```

### 加密模块 (crypto)

> **注意**: SM2、SM4 依赖 `sm-crypto` 包，按需安装：`npm install sm-crypto`

```typescript
import {
	md5,
	aesEncrypt,
	aesDecrypt,
	rsaEncrypt,
	rsaDecrypt,
	rsaGenerateKeyPair,
	sm2Encrypt,
	sm2Decrypt,
	sm2GenerateKeyPair,
	sm4Encrypt,
	sm4Decrypt,
} from 'l-js-fn/crypto';
```

#### MD5 哈希

```typescript
// 基本用法
md5('Hello World'); // "b10a8db164e0754105b7a99be72e3fe5"

// 加盐
md5('Hello World', { salt: 'mySalt' }); // 加盐后的哈希值
```

#### AES 对称加密

```typescript
// CBC 模式（默认）- 自动生成随机 IV
const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
// decrypted === 'Hello World'

// 自定义 IV（32 位 hex 字符串）
const enc = aesEncrypt('data', { key: 'key', iv: '0123456789abcdef0123456789abcdef' });
const dec = aesDecrypt(enc, { key: 'key', iv: '0123456789abcdef0123456789abcdef' });

// PBKDF2 密钥派生（加盐）
const enc2 = aesEncrypt('data', { key: 'password', salt: 'salt123', iterations: 10000 });
const dec2 = aesDecrypt(enc2, { key: 'password', salt: 'salt123', iterations: 10000 });

// ECB 模式
aesEncrypt('data', { key: 'key', mode: 'ecb' });

// hex 输出编码
aesEncrypt('data', { key: 'key', outputEncoding: 'hex' });
```

#### RSA 非对称加密

```typescript
// 生成密钥对
const keyPair = rsaGenerateKeyPair({ keySize: 2048 });
// { publicKey: '-----BEGIN PUBLIC KEY-----...', privateKey: '-----BEGIN PRIVATE KEY-----...' }

// 生成 DER base64 格式
rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });

// 公钥加密
const encrypted = rsaEncrypt('Hello RSA', { publicKey: keyPair.publicKey });

// 私钥解密
const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
// decrypted === 'Hello RSA'

// hex 输出编码
rsaEncrypt('data', { publicKey: keyPair.publicKey, outputEncoding: 'hex' });
```

#### SM2 国密非对称加密

```bash
npm install sm-crypto  # 需先安装依赖
```

```typescript
// 生成 SM2 密钥对
const keyPair = await sm2GenerateKeyPair();
// { publicKey: '04...', privateKey: '...' }

// 公钥加密
const encrypted = await sm2Encrypt('Hello SM2', { publicKey: keyPair.publicKey });

// 私钥解密
const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
// decrypted === 'Hello SM2'

// base64 输出编码
await sm2Encrypt('data', { publicKey: keyPair.publicKey, outputEncoding: 'base64' });
```

#### SM4 国密对称加密

```typescript
// CBC 模式（默认）- 自动生成随机 IV
const encrypted = await sm4Encrypt('Hello SM4', { key: '0123456789abcdeffedcba9876543210' });
const decrypted = await sm4Decrypt(encrypted, { key: '0123456789abcdeffedcba9876543210' });
// decrypted === 'Hello SM4'

// 自定义 IV
await sm4Encrypt('data', { key: '0...0', iv: '000102030405060708090a0b0c0d0e0f' });

// ECB 模式
await sm4Encrypt('data', { key: '0...0', mode: 'ecb' });

// hex / base64 输出
await sm4Encrypt('data', { key: '0...0', outputEncoding: 'base64' });
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
import { escapeHTML } from 'l-js-fn/encode';
import { formatFileSize } from 'l-js-fn/file';
import { EventBus } from 'l-js-fn/event-bus';

// CommonJS 导入
const { isArray } = require('l-js-fn');
const { scrollTop } = require('l-js-fn/bom');
const { escapeHTML } = require('l-js-fn/encode');
```

## ✅ 测试

本项目使用 [Jest](https://jestjs.io/) 进行单元测试，覆盖率阈值 90%+。

### 测试统计

| 指标       | 数值                     |
| ---------- | ------------------------ |
| 测试套件   | 27 passed                |
| 测试用例   | 1446 passed / 1446 total |
| 通过率     | 100%                     |
| 语句覆盖率 | 98.73%                   |
| 分支覆盖率 | 93.49%                   |
| 函数覆盖率 | 100%                     |
| 行覆盖率   | 99.37%                   |

#### 核心工具模块

| 模块                    | 用例数 | 通过 | 失败 | 通过率 |
| ----------------------- | ------ | ---- | ---- | ------ |
| color (颜色处理)        | 31     | 31   | 0    | 100%   |
| is-kit (类型判断)       | 75     | 75   | 0    | 100%   |
| array-kit (数组操作)    | 134    | 134  | 0    | 100%   |
| string-kit (字符串处理) | 94     | 94   | 0    | 100%   |
| object-kit (对象操作)   | 62     | 62   | 0    | 100%   |
| common (通用工具)       | 75     | 75   | 0    | 100%   |
| date-kit (日期处理)     | 72     | 72   | 0    | 100%   |
| number-kit (数字处理)   | 72     | 72   | 0    | 100%   |
| url-kit (URL 处理)      | 81     | 81   | 0    | 100%   |
| bugfixes (兼容修复)     | 17     | 17   | 0    | 100%   |

#### 子模块

| 模块                 | 用例数 | 通过 | 失败 | 通过率 |
| -------------------- | ------ | ---- | ---- | ------ |
| bom (浏览器 BOM)     | 46     | 46   | 0    | 100%   |
| ws (WebSocket)       | 24     | 24   | 0    | 100%   |
| storage (本地存储)   | 32     | 32   | 0    | 100%   |
| polling (轮询)       | 16     | 16   | 0    | 100%   |
| ipc (IPC 通信)       | 41     | 41   | 0    | 100%   |
| regex (正则表达式)   | 173    | 173  | 0    | 100%   |
| config (配置常量)    | 21     | 21   | 0    | 100%   |
| encode (编码/解码)   | 56     | 56   | 0    | 100%   |
| file (文件处理)      | 62     | 62   | 0    | 100%   |
| event-bus (事件总线) | 31     | 31   | 0    | 100%   |
| crypto (加密模块)    | 132    | 132  | 0    | 100%   |

#### 其他

| 模块              | 用例数 | 通过 | 失败 | 通过率 |
| ----------------- | ------ | ---- | ---- | ------ |
| Result (结果封装) | 15     | 15   | 0    | 100%   |
| dist (构建产物)   | 84     | 84   | 0    | 100%   |
