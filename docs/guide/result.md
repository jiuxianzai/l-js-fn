# Result — 结果类

标准化的结果封装类，用于统一处理操作成功/失败的状态。

## 概述

`Result` 是一个泛型类，用于封装操作结果，**构造函数为私有，必须通过静态方法 `Result.ok()` 和 `Result.fail()` 创建实例**。

## Result 结果类

`Result` 是一个泛型类，用于封装操作结果，**构造函数为私有，必须通过静态方法 `Result.ok()` 和 `Result.fail()` 创建实例**。

| 属性 | 类型 | 说明 |
|------|------|------|
| success | `boolean` | 是否成功 |
| message | `string` | 结果消息 |
| data | `T` | 附加数据（可选） |

## Result.ok 成功结果

创建成功结果。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| data | `T` | 否 | 附加数据 |
| message | `string` | 否 | 消息，默认 `'操作成功'` |

**返回值：** `Result<T>`

**示例：**

::: code-group
```ts [TypeScript]
import { Result } from 'l-js-fn';

// 简单成功
const ok1 = Result.ok();
// { success: true, message: '操作成功' }

// 带数据
const ok2 = Result.ok({ id: 1, name: 'John' });
// { success: true, message: '操作成功', data: { id: 1, name: 'John' } }

// 自定义消息
const ok3 = Result.ok({ id: 1 }, '创建成功');
// { success: true, message: '创建成功', data: { id: 1 } }
```

```js [JavaScript (ESM)]
import { Result } from 'l-js-fn';

// 简单成功
const ok1 = Result.ok();
// { success: true, message: '操作成功' }

// 带数据
const ok2 = Result.ok({ id: 1, name: 'John' });
// { success: true, message: '操作成功', data: { id: 1, name: 'John' } }

// 自定义消息
const ok3 = Result.ok({ id: 1 }, '创建成功');
// { success: true, message: '创建成功', data: { id: 1 } }
```

```js [JavaScript (CJS)]
const { Result } = require('l-js-fn');

// 简单成功
const ok1 = Result.ok();
// { success: true, message: '操作成功' }

// 带数据
const ok2 = Result.ok({ id: 1, name: 'John' });
// { success: true, message: '操作成功', data: { id: 1, name: 'John' } }

// 自定义消息
const ok3 = Result.ok({ id: 1 }, '创建成功');
// { success: true, message: '创建成功', data: { id: 1 } }
```
:::

## Result.fail 失败结果

创建失败结果。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| message | `string` | 否 | 错误消息，默认 `'操作失败'` |
| data | `T` | 否 | 附加数据 |

**返回值：** `Result<T>`

**示例：**

::: code-group
```ts [TypeScript]
import { Result } from 'l-js-fn';

// 简单失败
const fail1 = Result.fail();
// { success: false, message: '操作失败' }

// 带错误消息
const fail2 = Result.fail('用户不存在');
// { success: false, message: '用户不存在' }

// 带数据
const fail3 = Result.fail('参数错误', { field: 'email' });
// { success: false, message: '参数错误', data: { field: 'email' } }
```

```js [JavaScript (ESM)]
import { Result } from 'l-js-fn';

// 简单失败
const fail1 = Result.fail();
// { success: false, message: '操作失败' }

// 带错误消息
const fail2 = Result.fail('用户不存在');
// { success: false, message: '用户不存在' }

// 带数据
const fail3 = Result.fail('参数错误', { field: 'email' });
// { success: false, message: '参数错误', data: { field: 'email' } }
```

```js [JavaScript (CJS)]
const { Result } = require('l-js-fn');

// 简单失败
const fail1 = Result.fail();
// { success: false, message: '操作失败' }

// 带错误消息
const fail2 = Result.fail('用户不存在');
// { success: false, message: '用户不存在' }

// 带数据
const fail3 = Result.fail('参数错误', { field: 'email' });
// { success: false, message: '参数错误', data: { field: 'email' } }
```
:::

::: warning 参数顺序注意
`Result.ok(data?, message?)` 的第一个参数是 `data`，第二个是 `message`。\
`Result.fail(message?, data?)` 的第一个参数是 `message`，第二个是 `data`。\
两个方法的参数顺序不同。
:::

## 实际应用场景

### API 响应封装

::: code-group
```ts [TypeScript]
import { Result } from 'l-js-fn';

async function getUser(id: number): Promise<Result> {
  try {
    const user = await db.user.findById(id);
    if (!user) {
      return Result.fail('用户不存在');
    }
    return Result.ok(user);
  } catch (error) {
    return Result.fail('查询失败', error);
  }
}

// 使用
const result = await getUser(1);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.message);
}
```

```js [JavaScript (ESM)]
import { Result } from 'l-js-fn';

async function getUser(id: number): Promise<Result> {
  try {
    const user = await db.user.findById(id);
    if (!user) {
      return Result.fail('用户不存在');
    }
    return Result.ok(user);
  } catch (error) {
    return Result.fail('查询失败', error);
  }
}

// 使用
const result = await getUser(1);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.message);
}
```

```js [JavaScript (CJS)]
const { Result } = require('l-js-fn');

async function getUser(id: number): Promise<Result> {
  try {
    const user = await db.user.findById(id);
    if (!user) {
      return Result.fail('用户不存在');
    }
    return Result.ok(user);
  } catch (error) {
    return Result.fail('查询失败', error);
  }
}

// 使用
const result = await getUser(1);
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.message);
}
```
:::

### 数组操作结果

::: code-group
```ts [TypeScript]
import { moveElement } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5];
const result = moveElement(arr, 2, 'up');

if (result.success) {
  console.log('移动成功:', result.data);
} else {
  console.log('移动失败:', result.message);
}
```

```js [JavaScript (ESM)]
import { moveElement } from 'l-js-fn';

const arr = [1, 2, 3, 4, 5];
const result = moveElement(arr, 2, 'up');

if (result.success) {
  console.log('移动成功:', result.data);
} else {
  console.log('移动失败:', result.message);
}
```

```js [JavaScript (CJS)]
const { moveElement } = require('l-js-fn');

const arr = [1, 2, 3, 4, 5];
const result = moveElement(arr, 2, 'up');

if (result.success) {
  console.log('移动成功:', result.data);
} else {
  console.log('移动失败:', result.message);
}
```
:::
