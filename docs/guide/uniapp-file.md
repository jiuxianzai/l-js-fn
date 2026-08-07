# uniapp — 文件系统 (File)

文件系统模块基于小程序 `FileSystemManager` 封装，支持本地文件写入 / 读取 / 检查 / 删除 / 路径拼接。**微信自动走 `getFileSystemManager` + `wx.env.USER_DATA_PATH`，支付宝自动走 `my.getFileSystemManager` + `my.env.USER_DATA_PATH`**，无需关心平台差异。

**导入方式：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');
```
:::

> **平台支持：** 微信 / 支付宝小程序均支持文件系统；H5 / App 端视平台能力而定，若不支持相关方法会 reject 并提示。

---

## 1. write() 写入文件

将内容写入用户数据目录，**对象自动 JSON 序列化**。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fileName | `string` | 是 | 文件名（可含子路径，如 `dir/a.json`） |
| data | `string \| object` | 是 | 内容；对象自动 `JSON.stringify`，字符串原样写入 |
| options | `FileOptions` | 否 | 配置选项 |

```ts
interface FileOptions {
  json?: boolean; // 写入时是否 JSON 序列化对象，默认 true
}
```

**返回值：** `Promise<void>` — 成功 resolve，失败 reject

**示例：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';

await file.write('user.json', { name: 'John', age: 20 });
await file.write('note.txt', '纯文本内容');
await file.write('raw.json', '{"a":1}', { json: false }); // 原样写入
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';

await file.write('user.json', { name: 'John', age: 20 });
await file.write('note.txt', '纯文本内容');
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');

file.write('user.json', { name: 'John', age: 20 }).then(() => {
  console.log('写入成功');
});
```
:::

---

## 2. read() 读取文件

读取文件内容，**JSON 内容自动反序列化**。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fileName | `string` | 是 | 文件名 |
| options | `FileOptions` | 否 | 配置选项 |

**返回值：** `Promise<T | string>` — `json: true` 时优先反序列化为对象，失败自动降级返回字符串

**示例：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';

interface User { name: string; age: number; }

const user = await file.read<User>('user.json');      // { name: 'John', age: 20 }
const text = await file.read('note.txt', { json: false }); // 纯文本
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';

const user = await file.read('user.json');
const text = await file.read('note.txt', { json: false });
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');

file.read('user.json').then((user) => console.log(user));
```
:::

> **说明：** `read` 默认 `json: true`，读取时优先尝试 `JSON.parse`；若内容不是合法 JSON，自动返回原始字符串。

---

## 3. access() 检查文件是否存在

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fileName | `string` | 是 | 文件名 |

**返回值：** `Promise<boolean>` — 存在 `true`，不存在 `false`

**示例：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';

const exists = await file.access('user.json');
console.log(exists); // true | false
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';

const exists = await file.access('user.json');
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');

file.access('user.json').then((exists) => console.log(exists));
```
:::

---

## 4. remove() 删除文件

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fileName | `string` | 是 | 文件名 |

**返回值：** `Promise<void>` — 成功 resolve，失败 reject

**示例：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';

await file.remove('user.json');
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';

await file.remove('user.json');
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');

file.remove('user.json').then(() => console.log('删除成功'));
```
:::

---

## 5. getPath() 获取完整路径

拼接 `USER_DATA_PATH / 文件名`，可用于下载、预览等需要绝对路径的场景。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fileName | `string` | 是 | 文件名 |

**返回值：** `string` — 平台相关的完整路径

**示例：**

::: code-group
```ts [TypeScript]
import { file } from 'l-js-fn/uniapp';

const path = file.getPath('a.json');
console.log(path);
// 微信: wxfile://usr/a.json
// 支付宝: https://usr/a.json
```

```js [JavaScript (ESM)]
import { file } from 'l-js-fn/uniapp';

const path = file.getPath('a.json');
```

```js [JavaScript (CJS)]
const { file } = require('l-js-fn/uniapp');

const path = file.getPath('a.json');
```
:::

---

## 6. 完整示例：写入 → 读取 → 检查 → 删除

```ts
import { file } from 'l-js-fn/uniapp';

async function saveUser() {
  // 1. 写入对象
  await file.write('user.json', { name: 'John', age: 20 });

  // 2. 读取（自动反序列化）
  const user = await file.read('user.json');
  console.log(user); // { name: 'John', age: 20 }

  // 3. 检查存在
  const exists = await file.access('user.json');
  console.log(exists); // true

  // 4. 删除
  await file.remove('user.json');

  // 5. 再次检查
  const gone = await file.access('user.json');
  console.log(gone); // false
}
```

> 以上流程在微信、支付宝两端行为一致，平台差异已由模块内部自动处理。
