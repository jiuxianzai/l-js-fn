# regex — 正则常量

常用正则表达式常量集合，开箱即用。

**导入方式：**

::: code-group
```ts [TypeScript]
import { REGEXP } from 'l-js-fn/regex';
```

```js [JavaScript (ESM)]
import { REGEXP } from 'l-js-fn/regex';
```

```js [JavaScript (CJS)]
const { REGEXP } = require('l-js-fn/regex');
```
:::

## 常量列表

| 常量 | 正则表达式 | 说明 | 示例 |
|------|-----------|------|------|
| `PHONE` | `/^1[3-9]\d{9}$/` | 中国大陆手机号 | `'13800138000'` |
| `LAND_LINE` | `/^0\d{2,3}-?\d{7,8}$/` | 座机号码 | `'010-12345678'` |
| `EMAIL` | `/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/` | 邮箱地址 | `'test@example.com'` |
| `PASSWORD` | `/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s])\S{8,16}$/` | 强密码（8-16位，含大小写、数字、特殊字符） | `'Pass123!'` |
| `URL` | 复杂正则 | URL 地址 | `'https://example.com'` |
| `ID_CARD` | `/^(?:\d{15}\|\d{17}[\dXx])$/` | 身份证号（15或18位） | `'110101199001011234'` |
| `CHINESE` | `/^[\u4e00-\u9fa5]+$/` | 纯中文 | `'中文'` |
| `ENGLISH` | `/^[A-Za-z]+$/` | 纯英文 | `'Hello'` |
| `NUMBER` | `/^\d+$/` | 纯数字 | `'12345'` |
| `POSITIVE_NUMBER` | `/^[1-9]\d*$/` | 正整数 | `'123'` |
| `INTEGER` | `/^(-\|\+)?\d+$/` | 整数（含正负） | `'-123'` |
| `EN_OR_NUM` | `/^[A-Za-z0-9]+$/` | 英文+数字 | `'abc123'` |
| `EN_NUM_UNDER_LINE` | `/^\w+$/` | 英文+数字+下划线 | `'abc_123'` |
| `NO_SPECIAL` | `/^[\u4e00-\u9fa5A-Za-z0-9]+$/` | 无特殊字符（中英文数字） | `'中文abc123'` |
| `MONEY` | `/^(0\|[1-9]\d*)(\.\d{1,2})?$/` | 金额（最多两位小数） | `'123.45'` |

## 使用示例

### 基础验证

::: code-group
```ts [TypeScript]
import { REGEXP } from 'l-js-fn/regex';

// 手机号验证
REGEXP.PHONE.test('13800138000');        // true
REGEXP.PHONE.test('1380013800');         // false

// 邮箱验证
REGEXP.EMAIL.test('test@example.com');   // true
REGEXP.EMAIL.test('invalid-email');      // false

// 身份证验证
REGEXP.ID_CARD.test('110101199001011234'); // true
REGEXP.ID_CARD.test('123456789012345678'); // false
```

```js [JavaScript (ESM)]
import { REGEXP } from 'l-js-fn/regex';

// 手机号验证
REGEXP.PHONE.test('13800138000');        // true
REGEXP.PHONE.test('1380013800');         // false

// 邮箱验证
REGEXP.EMAIL.test('test@example.com');   // true
REGEXP.EMAIL.test('invalid-email');      // false

// 身份证验证
REGEXP.ID_CARD.test('110101199001011234'); // true
REGEXP.ID_CARD.test('123456789012345678'); // false
```

```js [JavaScript (CJS)]
const { REGEXP } = require('l-js-fn/regex');

// 手机号验证
REGEXP.PHONE.test('13800138000');        // true
REGEXP.PHONE.test('1380013800');         // false

// 邮箱验证
REGEXP.EMAIL.test('test@example.com');   // true
REGEXP.EMAIL.test('invalid-email');      // false

// 身份证验证
REGEXP.ID_CARD.test('110101199001011234'); // true
REGEXP.ID_CARD.test('123456789012345678'); // false
```
:::

### 表单验证

::: code-group
```ts [TypeScript]
import { REGEXP } from 'l-js-fn/regex';

function validateForm(data: { phone?: string; email?: string; password?: string }) {
  const errors: string[] = [];

  if (data.phone && !REGEXP.PHONE.test(data.phone)) {
    errors.push('手机号格式不正确');
  }

  if (data.email && !REGEXP.EMAIL.test(data.email)) {
    errors.push('邮箱格式不正确');
  }

  if (data.password && !REGEXP.PASSWORD.test(data.password)) {
    errors.push('密码必须为8-16位，包含大小写字母、数字和特殊字符');
  }

  return errors;
}
```

```js [JavaScript (ESM)]
import { REGEXP } from 'l-js-fn/regex';

function validateForm(data: { phone?: string; email?: string; password?: string }) {
  const errors: string[] = [];

  if (data.phone && !REGEXP.PHONE.test(data.phone)) {
    errors.push('手机号格式不正确');
  }

  if (data.email && !REGEXP.EMAIL.test(data.email)) {
    errors.push('邮箱格式不正确');
  }

  if (data.password && !REGEXP.PASSWORD.test(data.password)) {
    errors.push('密码必须为8-16位，包含大小写字母、数字和特殊字符');
  }

  return errors;
}
```

```js [JavaScript (CJS)]
const { REGEXP } = require('l-js-fn/regex');

function validateForm(data: { phone?: string; email?: string; password?: string }) {
  const errors: string[] = [];

  if (data.phone && !REGEXP.PHONE.test(data.phone)) {
    errors.push('手机号格式不正确');
  }

  if (data.email && !REGEXP.EMAIL.test(data.email)) {
    errors.push('邮箱格式不正确');
  }

  if (data.password && !REGEXP.PASSWORD.test(data.password)) {
    errors.push('密码必须为8-16位，包含大小写字母、数字和特殊字符');
  }

  return errors;
}
```
:::

### 输入限制

::: code-group
```ts [TypeScript]
import { REGEXP } from 'l-js-fn/regex';

// 只允许输入中文
function isChinese(input: string): boolean {
  return REGEXP.CHINESE.test(input);
}

// 金额格式检查
function isValidMoney(amount: string): boolean {
  return REGEXP.MONEY.test(amount);
}
```

```js [JavaScript (ESM)]
import { REGEXP } from 'l-js-fn/regex';

// 只允许输入中文
function isChinese(input: string): boolean {
  return REGEXP.CHINESE.test(input);
}

// 金额格式检查
function isValidMoney(amount: string): boolean {
  return REGEXP.MONEY.test(amount);
}
```

```js [JavaScript (CJS)]
const { REGEXP } = require('l-js-fn/regex');

// 只允许输入中文
function isChinese(input: string): boolean {
  return REGEXP.CHINESE.test(input);
}

// 金额格式检查
function isValidMoney(amount: string): boolean {
  return REGEXP.MONEY.test(amount);
}
```
:::
