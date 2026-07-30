# storage — 本地存储

本地存储工具集，提供 `localStorage` 和 `sessionStorage` 的增强操作，支持过期时间。

**导入方式：**

::: code-group
```ts [TypeScript]
import {
  setStorage, getStorage, removeStorage, clearStorage,
  clearExpiredStorage, hasStorage, getStorageKeys, getStorageLength,
  setSession, getSession, removeSession, clearSession, hasSession, getSessionKeys
} from 'l-js-fn/storage';
```

```js [JavaScript (ESM)]
import {
  setStorage, getStorage, removeStorage, clearStorage,
  clearExpiredStorage, hasStorage, getStorageKeys, getStorageLength,
  setSession, getSession, removeSession, clearSession, hasSession, getSessionKeys
} from 'l-js-fn/storage';
```

```js [JavaScript (CJS)]
const {
  setStorage, getStorage, removeStorage, clearStorage,
  clearExpiredStorage, hasStorage, getStorageKeys, getStorageLength,
  setSession, getSession, removeSession, clearSession, hasSession, getSessionKeys
} = require('l-js-fn/storage');
```
:::

## localStorage 操作

### StorageOptions

```ts
interface StorageOptions {
  expire?: number; // 过期时间（秒），默认 -1（永不过期）
}
```

### setStorage localStorage设置

设置 localStorage（支持过期时间）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |
| value | `T` | 是 | 值（支持对象、数组等 JSON 可序列化类型） |
| options | `StorageOptions` | 否 | 配置选项 |

**返回值：** `boolean` — 是否设置成功

**示例：**

::: code-group
```ts [TypeScript]
import { setStorage } from 'l-js-fn/storage';

setStorage('user', { name: 'John', age: 20 });
setStorage('token', 'abc123', { expire: 3600 }); // 1小时后过期
```

```js [JavaScript (ESM)]
import { setStorage } from 'l-js-fn/storage';

setStorage('user', { name: 'John', age: 20 });
setStorage('token', 'abc123', { expire: 3600 }); // 1小时后过期
```

```js [JavaScript (CJS)]
const { setStorage } = require('l-js-fn/storage');

setStorage('user', { name: 'John', age: 20 });
setStorage('token', 'abc123', { expire: 3600 }); // 1小时后过期
```
:::

### getStorage localStorage获取

获取 localStorage（自动处理过期）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `T \| null` — 值；不存在或已过期返回 `null`

**示例：**

::: code-group
```ts [TypeScript]
import { getStorage } from 'l-js-fn/storage';

getStorage('user');     // { name: 'John', age: 20 }
getStorage('expired');  // null（已过期）
getStorage('notexist'); // null（不存在）
```

```js [JavaScript (ESM)]
import { getStorage } from 'l-js-fn/storage';

getStorage('user');     // { name: 'John', age: 20 }
getStorage('expired');  // null（已过期）
getStorage('notexist'); // null（不存在）
```

```js [JavaScript (CJS)]
const { getStorage } = require('l-js-fn/storage');

getStorage('user');     // { name: 'John', age: 20 }
getStorage('expired');  // null（已过期）
getStorage('notexist'); // null（不存在）
```
:::

### removeStorage localStorage删除

删除 localStorage。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { removeStorage } from 'l-js-fn/storage';

removeStorage('user');
```

```js [JavaScript (ESM)]
import { removeStorage } from 'l-js-fn/storage';

removeStorage('user');
```

```js [JavaScript (CJS)]
const { removeStorage } = require('l-js-fn/storage');

removeStorage('user');
```
:::

### clearStorage localStorage清空

清空所有 localStorage。

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { clearStorage } from 'l-js-fn/storage';

clearStorage();
```

```js [JavaScript (ESM)]
import { clearStorage } from 'l-js-fn/storage';

clearStorage();
```

```js [JavaScript (CJS)]
const { clearStorage } = require('l-js-fn/storage');

clearStorage();
```
:::

### clearExpiredStorage 清理过期数据

清理所有已过期的 localStorage。

**返回值：** `number` — 清理的数量

**示例：**

::: code-group
```ts [TypeScript]
import { clearExpiredStorage } from 'l-js-fn/storage';

const count = clearExpiredStorage();
console.log(`清理了 ${count} 个过期项`);
```

```js [JavaScript (ESM)]
import { clearExpiredStorage } from 'l-js-fn/storage';

const count = clearExpiredStorage();
console.log(`清理了 ${count} 个过期项`);
```

```js [JavaScript (CJS)]
const { clearExpiredStorage } = require('l-js-fn/storage');

const count = clearExpiredStorage();
console.log(`清理了 ${count} 个过期项`);
```
:::

### hasStorage

检查 localStorage 是否存在且未过期。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { hasStorage } from 'l-js-fn/storage';

hasStorage('user'); // true
```

```js [JavaScript (ESM)]
import { hasStorage } from 'l-js-fn/storage';

hasStorage('user'); // true
```

```js [JavaScript (CJS)]
const { hasStorage } = require('l-js-fn/storage');

hasStorage('user'); // true
```
:::

### getStorageKeys

获取所有 localStorage 的键名。

**返回值：** `string[]`

**示例：**

::: code-group
```ts [TypeScript]
import { getStorageKeys } from 'l-js-fn/storage';

getStorageKeys(); // ['user', 'token', 'settings']
```

```js [JavaScript (ESM)]
import { getStorageKeys } from 'l-js-fn/storage';

getStorageKeys(); // ['user', 'token', 'settings']
```

```js [JavaScript (CJS)]
const { getStorageKeys } = require('l-js-fn/storage');

getStorageKeys(); // ['user', 'token', 'settings']
```
:::

### getStorageLength

获取 localStorage 的数量。

**返回值：** `number`

**示例：**

::: code-group
```ts [TypeScript]
import { getStorageLength } from 'l-js-fn/storage';

getStorageLength(); // 3
```

```js [JavaScript (ESM)]
import { getStorageLength } from 'l-js-fn/storage';

getStorageLength(); // 3
```

```js [JavaScript (CJS)]
const { getStorageLength } = require('l-js-fn/storage');

getStorageLength(); // 3
```
:::

## sessionStorage 操作

### setSession sessionStorage设置

设置 sessionStorage。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |
| value | `T` | 是 | 值 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { setSession } from 'l-js-fn/storage';

setSession('tabData', { id: 1, name: 'test' });
```

```js [JavaScript (ESM)]
import { setSession } from 'l-js-fn/storage';

setSession('tabData', { id: 1, name: 'test' });
```

```js [JavaScript (CJS)]
const { setSession } = require('l-js-fn/storage');

setSession('tabData', { id: 1, name: 'test' });
```
:::

### getSession

获取 sessionStorage。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `T \| null`

**示例：**

::: code-group
```ts [TypeScript]
import { getSession } from 'l-js-fn/storage';

getSession('tabData'); // { id: 1, name: 'test' }
```

```js [JavaScript (ESM)]
import { getSession } from 'l-js-fn/storage';

getSession('tabData'); // { id: 1, name: 'test' }
```

```js [JavaScript (CJS)]
const { getSession } = require('l-js-fn/storage');

getSession('tabData'); // { id: 1, name: 'test' }
```
:::

### removeSession sessionStorage删除

删除 sessionStorage。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { removeSession } from 'l-js-fn/storage';

removeSession('tabData');
```

```js [JavaScript (ESM)]
import { removeSession } from 'l-js-fn/storage';

removeSession('tabData');
```

```js [JavaScript (CJS)]
const { removeSession } = require('l-js-fn/storage');

removeSession('tabData');
```
:::

### clearSession

清空所有 sessionStorage。

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { clearSession } from 'l-js-fn/storage';

clearSession();
```

```js [JavaScript (ESM)]
import { clearSession } from 'l-js-fn/storage';

clearSession();
```

```js [JavaScript (CJS)]
const { clearSession } = require('l-js-fn/storage');

clearSession();
```
:::

### hasSession

检查 sessionStorage 是否存在。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| key | `string` | 是 | 键名 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { hasSession } from 'l-js-fn/storage';

hasSession('tabData'); // true
```

```js [JavaScript (ESM)]
import { hasSession } from 'l-js-fn/storage';

hasSession('tabData'); // true
```

```js [JavaScript (CJS)]
const { hasSession } = require('l-js-fn/storage');

hasSession('tabData'); // true
```
:::

### getSessionKeys

获取所有 sessionStorage 的键名。

**返回值：** `string[]`

**示例：**

::: code-group
```ts [TypeScript]
import { getSessionKeys } from 'l-js-fn/storage';

getSessionKeys(); // ['tabData', 'formState']
```

```js [JavaScript (ESM)]
import { getSessionKeys } from 'l-js-fn/storage';

getSessionKeys(); // ['tabData', 'formState']
```

```js [JavaScript (CJS)]
const { getSessionKeys } = require('l-js-fn/storage');

getSessionKeys(); // ['tabData', 'formState']
```
:::
