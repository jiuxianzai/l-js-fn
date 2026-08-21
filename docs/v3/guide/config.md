# config — 配置常量

常用配置常量集合，包括日期格式和 HTTP 状态码。

**导入方式：**

> 方法已全量平铺到主包 `l-js-fn`，可直接从主包导入（Tree-shaking 只打包用到的函数）；子路径 `l-js-fn/config` 仍保留，供 CJS 或需要精确加载的场景使用。

::: code-group
```ts [TypeScript]
import { DATE_FORMAT, HTTP_STATUS } from 'l-js-fn';
```

```js [JavaScript (ESM)]
import { DATE_FORMAT, HTTP_STATUS } from 'l-js-fn';
```

```js [JavaScript (CJS)]
const { DATE_FORMAT, HTTP_STATUS } = require('l-js-fn/config');
```
:::

## 1. DATE_FORMAT 日期格式常量

常见日期格式常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `FULL` | `'yyyy-MM-dd HH:mm:ss'` | 完整时间 |
| `DATE` | `'yyyy-MM-dd'` | 年月日 |
| `TIME` | `'HH:mm:ss'` | 时分秒 |
| `SHORT` | `'MM-dd'` | 月日 |
| `YEAR_MONTH` | `'yyyy-MM'` | 年月 |

### 1.1 使用示例

::: code-group
```ts [TypeScript]
import { DATE_FORMAT } from 'l-js-fn';
import { dateFormat } from 'l-js-fn';

// 使用预定义格式
dateFormat(new Date(), DATE_FORMAT.FULL);      // '2024-01-01 12:00:00'
dateFormat(new Date(), DATE_FORMAT.DATE);      // '2024-01-01'
dateFormat(new Date(), DATE_FORMAT.TIME);      // '12:00:00'
dateFormat(new Date(), DATE_FORMAT.SHORT);     // '01-01'
dateFormat(new Date(), DATE_FORMAT.YEAR_MONTH);// '2024-01'
```

```js [JavaScript (ESM)]
import { DATE_FORMAT } from 'l-js-fn';
import { dateFormat } from 'l-js-fn';

// 使用预定义格式
dateFormat(new Date(), DATE_FORMAT.FULL);      // '2024-01-01 12:00:00'
dateFormat(new Date(), DATE_FORMAT.DATE);      // '2024-01-01'
dateFormat(new Date(), DATE_FORMAT.TIME);      // '12:00:00'
dateFormat(new Date(), DATE_FORMAT.SHORT);     // '01-01'
dateFormat(new Date(), DATE_FORMAT.YEAR_MONTH);// '2024-01'
```

```js [JavaScript (CJS)]
const { DATE_FORMAT } = require('l-js-fn/config');
const { dateFormat } = require('l-js-fn');

// 使用预定义格式
dateFormat(new Date(), DATE_FORMAT.FULL);      // '2024-01-01 12:00:00'
dateFormat(new Date(), DATE_FORMAT.DATE);      // '2024-01-01'
dateFormat(new Date(), DATE_FORMAT.TIME);      // '12:00:00'
dateFormat(new Date(), DATE_FORMAT.SHORT);     // '01-01'
dateFormat(new Date(), DATE_FORMAT.YEAR_MONTH);// '2024-01'
```
:::

## 2. HTTP_STATUS HTTP状态码

常用 HTTP 状态码常量。

| 常量 | 值 | 说明 |
|------|-----|------|
| `OK` | `200` | 请求成功 |
| `UNAUTHORIZED` | `401` | 未授权 |
| `FORBIDDEN` | `403` | 禁止访问 |
| `NOT_FOUND` | `404` | 资源不存在 |
| `SERVER_ERROR` | `500` | 服务器内部错误 |
| `SERVER_UNAVAILABLE` | `503` | 服务不可用 |

### 2.1 使用示例

::: code-group
```ts [TypeScript]
import { HTTP_STATUS } from 'l-js-fn';

// 状态码判断
function handleResponse(status: number) {
  switch (status) {
    case HTTP_STATUS.OK:
      return '请求成功';
    case HTTP_STATUS.UNAUTHORIZED:
      return '请先登录';
    case HTTP_STATUS.FORBIDDEN:
      return '没有权限';
    case HTTP_STATUS.NOT_FOUND:
      return '资源不存在';
    case HTTP_STATUS.SERVER_ERROR:
      return '服务器错误';
    default:
      return '未知错误';
  }
}

// 请求拦截器
fetch('/api/data')
  .then(response => {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // 跳转到登录页
      window.location.href = '/login';
    }
    return response.json();
  });
```

```js [JavaScript (ESM)]
import { HTTP_STATUS } from 'l-js-fn';

// 状态码判断
function handleResponse(status: number) {
  switch (status) {
    case HTTP_STATUS.OK:
      return '请求成功';
    case HTTP_STATUS.UNAUTHORIZED:
      return '请先登录';
    case HTTP_STATUS.FORBIDDEN:
      return '没有权限';
    case HTTP_STATUS.NOT_FOUND:
      return '资源不存在';
    case HTTP_STATUS.SERVER_ERROR:
      return '服务器错误';
    default:
      return '未知错误';
  }
}

// 请求拦截器
fetch('/api/data')
  .then(response => {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // 跳转到登录页
      window.location.href = '/login';
    }
    return response.json();
  });
```

```js [JavaScript (CJS)]
const { HTTP_STATUS } = require('l-js-fn/config');

// 状态码判断
function handleResponse(status: number) {
  switch (status) {
    case HTTP_STATUS.OK:
      return '请求成功';
    case HTTP_STATUS.UNAUTHORIZED:
      return '请先登录';
    case HTTP_STATUS.FORBIDDEN:
      return '没有权限';
    case HTTP_STATUS.NOT_FOUND:
      return '资源不存在';
    case HTTP_STATUS.SERVER_ERROR:
      return '服务器错误';
    default:
      return '未知错误';
  }
}

// 请求拦截器
fetch('/api/data')
  .then(response => {
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      // 跳转到登录页
      window.location.href = '/login';
    }
    return response.json();
  });
```
:::
