# crypto — 加密模块

加密模块提供常用的加解密和哈希算法，支持 MD5、AES、RSA、SM2、SM4 等加密方式。

> **注意**：SM2、SM4 算法依赖 `sm-crypto` 包，按需安装：
>
> ```bash
> npm install sm-crypto
> ```

**导入方式：**

::: code-group
```ts [TypeScript]
import {
  md5,
  aesEncrypt, aesDecrypt,
  rsaEncrypt, rsaDecrypt, rsaGenerateKeyPair,
  sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair,
  sm4Encrypt, sm4Decrypt,
} from 'l-js-fn/crypto';
```

```js [JavaScript (ESM)]
import {
  md5,
  aesEncrypt, aesDecrypt,
  rsaEncrypt, rsaDecrypt, rsaGenerateKeyPair,
  sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair,
  sm4Encrypt, sm4Decrypt,
} from 'l-js-fn/crypto';
```

```js [JavaScript (CJS)]
const {
  md5,
  aesEncrypt, aesDecrypt,
  rsaEncrypt, rsaDecrypt, rsaGenerateKeyPair,
  sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair,
  sm4Encrypt, sm4Decrypt,
} = require('l-js-fn/crypto');
```
:::

---

## md5 — MD5 哈希

计算字符串的 MD5 哈希值，支持加盐。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | `string` | 是 | 待哈希的字符串 |
| options | `object` | 否 | 配置选项 |
| options.salt | `string` | 否 | 盐值，拼接到输入后方 |

**返回值：** `string` — 32 位十六进制哈希字符串

### 基础哈希

::: code-group
```ts [TypeScript]
import { md5 } from 'l-js-fn/crypto';

md5('');
// 'd41d8cd98f00b204e9800998ecf8427e'

md5('abc');
// '900150983cd24fb0d6963f7d28e17f72'

md5('Hello World');
// 'b10a8db164e0754105b7a99be72e3fe5'
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

md5('');
// 'd41d8cd98f00b204e9800998ecf8427e'

md5('abc');
// '900150983cd24fb0d6963f7d28e17f72'

md5('Hello World');
// 'b10a8db164e0754105b7a99be72e3fe5'
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

md5('Hello World');
// 'b10a8db164e0754105b7a99be72e3fe5'
```
:::
::: code-group
```ts [TypeScript]
import { md5 } from 'l-js-fn/crypto';

// 不加盐
md5('mypassword');
// 'a029d0df84eb5549c641e04a9ef389e5'

// 加盐
md5('mypassword', { salt: 'random-salt-value' });
// '984c47bda74bdb3f51dbdf5300e675d1'

// 相同输入 + 相同盐值 = 相同结果（可用于密码校验）
const hash = md5('user_input', { salt: 'app_secret' });
const isValid = hash === md5('user_input', { salt: 'app_secret' });
// true
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

// 不加盐
md5('mypassword');
// 'a029d0df84eb5549c641e04a9ef389e5'

// 加盐
md5('mypassword', { salt: 'random-salt-value' });
// '984c47bda74bdb3f51dbdf5300e675d1'

// 相同输入 + 相同盐值 = 相同结果（可用于密码校验）
const hash = md5('user_input', { salt: 'app_secret' });
const isValid = hash === md5('user_input', { salt: 'app_secret' });
// true
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

const hash = md5('password', { salt: 'my-salt' });
```
:::
::: code-group
```ts [TypeScript]
import { md5 } from 'l-js-fn/crypto';

const SECRET_KEY = 'your-app-secret-key';

function hashPassword(password: string): string {
  return md5(password, { salt: SECRET_KEY });
}

function verifyPassword(password: string, storedHash: string): boolean {
  return hashPassword(password) === storedHash;
}

// 注册
const hashed = hashPassword('user1234');
// 存入数据库

// 登录校验
const ok = verifyPassword('user1234', hashed);
// true
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

const SECRET_KEY = 'your-app-secret-key';

function hashPassword(password: string): string {
  return md5(password, { salt: SECRET_KEY });
}

function verifyPassword(password: string, storedHash: string): boolean {
  return hashPassword(password) === storedHash;
}

// 注册
const hashed = hashPassword('user1234');
// 存入数据库

// 登录校验
const ok = verifyPassword('user1234', hashed);
// true
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');
const SECRET_KEY = 'your-app-secret-key';

function hashPassword(password) {
  return md5(password, { salt: SECRET_KEY });
}

function verifyPassword(password, storedHash) {
  return hashPassword(password) === storedHash;
}

const hashed = hashPassword('user1234');
const ok = verifyPassword('user1234', hashed);
// true
```
:::
::: code-group
```ts [TypeScript]
import { md5 } from 'l-js-fn/crypto';

function generateApiSign(params: Record<string, string>, secretKey: string): string {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return md5(sorted, { salt: secretKey });
}

const sign = generateApiSign(
  { userId: '123', timestamp: '1700000000' },
  'api-secret'
);
// 将 sign 附带在请求头中
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

function generateApiSign(params: Record<string, string>, secretKey: string): string {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return md5(sorted, { salt: secretKey });
}

const sign = generateApiSign(
  { userId: '123', timestamp: '1700000000' },
  'api-secret'
);
// 将 sign 附带在请求头中
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

function generateApiSign(params, secretKey) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return md5(sorted, { salt: secretKey });
}
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// CBC 模式（默认），自动生成随机 IV
const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
// 'Hello World'
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// CBC 模式（默认），自动生成随机 IV
const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
// 'Hello World'
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
// 'Hello World'
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const IV = '0123456789abcdef0123456789abcdef';

const enc = aesEncrypt('secret', { key: 'my-key', iv: IV });
const dec = aesDecrypt(enc, { key: 'my-key', iv: IV });
// 'secret'

// 相同输入 + 相同 IV = 相同密文
aesEncrypt('data', { key: 'k', iv: IV }) === aesEncrypt('data', { key: 'k', iv: IV });
// true
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const IV = '0123456789abcdef0123456789abcdef';

const enc = aesEncrypt('secret', { key: 'my-key', iv: IV });
const dec = aesDecrypt(enc, { key: 'my-key', iv: IV });
// 'secret'

// 相同输入 + 相同 IV = 相同密文
aesEncrypt('data', { key: 'k', iv: IV }) === aesEncrypt('data', { key: 'k', iv: IV });
// true
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');
const IV = '0123456789abcdef0123456789abcdef';
const enc = aesEncrypt('secret', { key: 'my-key', iv: IV });
const dec = aesDecrypt(enc, { key: 'my-key', iv: IV });
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// 加密时使用盐值派生密钥
const enc = aesEncrypt('sensitive data', {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});

// 解密时必须提供相同参数
const dec = aesDecrypt(enc, {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});
// 'sensitive data'

// 不提供盐值则解密失败
try {
  aesDecrypt(enc, { key: 'user-password' });
} catch (e) {
  // 解密失败
}
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// 加密时使用盐值派生密钥
const enc = aesEncrypt('sensitive data', {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});

// 解密时必须提供相同参数
const dec = aesDecrypt(enc, {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});
// 'sensitive data'

// 不提供盐值则解密失败
try {
  aesDecrypt(enc, { key: 'user-password' });
} catch (e) {
  // 解密失败
}
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const enc = aesEncrypt('data', {
  key: 'password',
  salt: 'salt',
  iterations: 10000,
});
const dec = aesDecrypt(enc, {
  key: 'password',
  salt: 'salt',
  iterations: 10000,
});
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
// 'data'

// ECB 模式下相同输入产生相同输出（确定性）
const e1 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
const e2 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
e1 === e2; // true
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
// 'data'

// ECB 模式下相同输入产生相同输出（确定性）
const e1 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
const e2 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
e1 === e2; // true
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// Base64 输出（默认）
const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });

// Hex 输出
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });

// 解密对应编码的密文
aesDecrypt(b64, { key: 'secret' });              // base64（默认）
aesDecrypt(hex, { key: 'secret', outputEncoding: 'hex' }); // hex
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// Base64 输出（默认）
const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });

// Hex 输出
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });

// 解密对应编码的密文
aesDecrypt(b64, { key: 'secret' });              // base64（默认）
aesDecrypt(hex, { key: 'secret', outputEncoding: 'hex' }); // hex
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });
```
:::
::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const APP_SECRET = 'my-app-secret-key-16';

function saveSecrets(key: string, value: string): void {
  const encrypted = aesEncrypt(value, { key: APP_SECRET });
  localStorage.setItem(key, encrypted);
}

function loadSecrets(key: string): string {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return '';
  return aesDecrypt(encrypted, { key: APP_SECRET });
}

// 存储令牌
saveSecrets('api_token', 'sk-xxxx-xxxxxxxxxxxxx');

// 读取令牌
const token = loadSecrets('api_token');
// 'sk-xxxx-xxxxxxxxxxxxx'
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const APP_SECRET = 'my-app-secret-key-16';

function saveSecrets(key: string, value: string): void {
  const encrypted = aesEncrypt(value, { key: APP_SECRET });
  localStorage.setItem(key, encrypted);
}

function loadSecrets(key: string): string {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return '';
  return aesDecrypt(encrypted, { key: APP_SECRET });
}

// 存储令牌
saveSecrets('api_token', 'sk-xxxx-xxxxxxxxxxxxx');

// 读取令牌
const token = loadSecrets('api_token');
// 'sk-xxxx-xxxxxxxxxxxxx'
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');
const APP_SECRET = 'my-app-secret-key-16';

function saveSecrets(key, value) {
  const encrypted = aesEncrypt(value, { key: APP_SECRET });
  localStorage.setItem(key, encrypted);
}

function loadSecrets(key) {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return '';
  return aesDecrypt(encrypted, { key: APP_SECRET });
}

saveSecrets('token', 'abc123');
const token = loadSecrets('token');
```
:::
::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair } from 'l-js-fn/crypto';

// 默认 2048 位 PEM 格式
const { publicKey, privateKey } = rsaGenerateKeyPair();
// publicKey:  '-----BEGIN PUBLIC KEY-----\nMIIB...\n-----END PUBLIC KEY-----'
// privateKey: '-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----'

// 1024 位密钥（不建议用于生产环境）
const small = rsaGenerateKeyPair({ keySize: 1024 });

// 4096 位更安全
const secure = rsaGenerateKeyPair({ keySize: 4096 });

// DER-base64 格式（便于网络传输）
const der = rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });
// { publicKey: 'MIIBIjAN...', privateKey: 'MIIEvAIB...' }
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair } from 'l-js-fn/crypto';

// 默认 2048 位 PEM 格式
const { publicKey, privateKey } = rsaGenerateKeyPair();
// publicKey:  '-----BEGIN PUBLIC KEY-----\nMIIB...\n-----END PUBLIC KEY-----'
// privateKey: '-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----'

// 1024 位密钥（不建议用于生产环境）
const small = rsaGenerateKeyPair({ keySize: 1024 });

// 4096 位更安全
const secure = rsaGenerateKeyPair({ keySize: 4096 });

// DER-base64 格式（便于网络传输）
const der = rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });
// { publicKey: 'MIIBIjAN...', privateKey: 'MIIEvAIB...' }
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
console.log(publicKey);
// -----BEGIN PUBLIC KEY-----
// ...
```
:::
::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

// 公钥加密
const encrypted = rsaEncrypt('Hello RSA', { publicKey });

// 私钥解密
const decrypted = rsaDecrypt(encrypted, { privateKey });
// 'Hello RSA'

// hex 输出编码
const hexEnc = rsaEncrypt('data', { publicKey, outputEncoding: 'hex' });
const hexDec = rsaDecrypt(hexEnc, { privateKey, outputEncoding: 'hex' });
// 'data'
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

// 公钥加密
const encrypted = rsaEncrypt('Hello RSA', { publicKey });

// 私钥解密
const decrypted = rsaDecrypt(encrypted, { privateKey });
// 'Hello RSA'

// hex 输出编码
const hexEnc = rsaEncrypt('data', { publicKey, outputEncoding: 'hex' });
const hexDec = rsaDecrypt(hexEnc, { privateKey, outputEncoding: 'hex' });
// 'data'
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
const encrypted = rsaEncrypt('Hello RSA', { publicKey });
const decrypted = rsaDecrypt(encrypted, { privateKey });
// 'Hello RSA'
```
:::
::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

// 服务端生成密钥对，公钥返回给前端，私钥安全保存
const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });

// === 前端：使用公钥加密用户密码 ===
function encryptLoginData(password: string, pubKey: string) {
  return rsaEncrypt(password, { publicKey: pubKey });
}

const encryptedPassword = encryptLoginData('userPassword123', publicKey);

// 发送 encryptedPassword 到服务端...

// === 服务端：使用私钥解密 ===
function decryptLoginData(encrypted: string, privKey: string) {
  return rsaDecrypt(encrypted, { privateKey: privKey });
}

const originalPassword = decryptLoginData(encryptedPassword, privateKey);
// 'userPassword123'
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

// 服务端生成密钥对，公钥返回给前端，私钥安全保存
const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });

// === 前端：使用公钥加密用户密码 ===
function encryptLoginData(password: string, pubKey: string) {
  return rsaEncrypt(password, { publicKey: pubKey });
}

const encryptedPassword = encryptLoginData('userPassword123', publicKey);

// 发送 encryptedPassword 到服务端...

// === 服务端：使用私钥解密 ===
function decryptLoginData(encrypted: string, privKey: string) {
  return rsaDecrypt(encrypted, { privateKey: privKey });
}

const originalPassword = decryptLoginData(encryptedPassword, privateKey);
// 'userPassword123'
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });

// 前端加密
const encrypted = rsaEncrypt('userPassword123', { publicKey });

// 服务端解密
const original = rsaDecrypt(encrypted, { privateKey });
// 'userPassword123'
```
:::
::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

const userData = JSON.stringify({
  name: 'Alice',
  email: 'alice@example.com',
  phone: '13800138000',
});

// 加密 JSON
const encrypted = rsaEncrypt(userData, { publicKey });

// 解密并解析
const decrypted = rsaDecrypt(encrypted, { privateKey });
const parsed = JSON.parse(decrypted);
// { name: 'Alice', email: 'alice@example.com', phone: '13800138000' }
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

const userData = JSON.stringify({
  name: 'Alice',
  email: 'alice@example.com',
  phone: '13800138000',
});

// 加密 JSON
const encrypted = rsaEncrypt(userData, { publicKey });

// 解密并解析
const decrypted = rsaDecrypt(encrypted, { privateKey });
const parsed = JSON.parse(decrypted);
// { name: 'Alice', email: 'alice@example.com', phone: '13800138000' }
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
const data = JSON.stringify({ name: 'Alice', email: 'alice@example.com' });
const encrypted = rsaEncrypt(data, { publicKey });
const parsed = JSON.parse(rsaDecrypt(encrypted, { privateKey }));
```
:::
::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();
// publicKey:  '04a1b2c3...' (130 位 hex 字符串)
// privateKey: '0123456789...' (64 位 hex 字符串)

// 每次生成的密钥对不同
const pair2 = await sm2GenerateKeyPair();
pair2.publicKey !== publicKey; // true
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();
// publicKey:  '04a1b2c3...' (130 位 hex 字符串)
// privateKey: '0123456789...' (64 位 hex 字符串)

// 每次生成的密钥对不同
const pair2 = await sm2GenerateKeyPair();
pair2.publicKey !== publicKey; // true
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  console.log(publicKey.length); // 130
})();
```
:::
::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();

// Hex 输出（默认）
const encHex = await sm2Encrypt('Hello SM2', { publicKey });
const decHex = await sm2Decrypt(encHex, { privateKey });
// 'Hello SM2'

// Base64 输出
const encBase64 = await sm2Encrypt('data', { publicKey, outputEncoding: 'base64' });
const decBase64 = await sm2Decrypt(encBase64, { privateKey });
// 'data'（自动识别 base64 格式密文）

// 中文数据
const encCn = await sm2Encrypt('你好世界', { publicKey });
const decCn = await sm2Decrypt(encCn, { privateKey });
// '你好世界'
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();

// Hex 输出（默认）
const encHex = await sm2Encrypt('Hello SM2', { publicKey });
const decHex = await sm2Decrypt(encHex, { privateKey });
// 'Hello SM2'

// Base64 输出
const encBase64 = await sm2Encrypt('data', { publicKey, outputEncoding: 'base64' });
const decBase64 = await sm2Decrypt(encBase64, { privateKey });
// 'data'（自动识别 base64 格式密文）

// 中文数据
const encCn = await sm2Encrypt('你好世界', { publicKey });
const decCn = await sm2Decrypt(encCn, { privateKey });
// '你好世界'
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  const encrypted = await sm2Encrypt('Hello', { publicKey });
  const decrypted = await sm2Decrypt(encrypted, { privateKey });
  console.log(decrypted); // 'Hello'
})();
```
:::
::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

// 服务端生成密钥对
const { publicKey, privateKey } = await sm2GenerateKeyPair();
// 将 publicKey 发送给客户端，privateKey 安全保存

// === 客户端：使用公钥加密请求数据 ===
async function encryptRequest(data: string, pubKey: string) {
  return await sm2Encrypt(data, { publicKey: pubKey, outputEncoding: 'base64' });
}

const securePayload = await encryptRequest(
  JSON.stringify({ name: 'Alice', idCard: '110101199001011234' }),
  publicKey
);
// 发送 securePayload 到服务端

// === 服务端：使用私钥解密 ===
async function decryptRequest(encrypted: string, privKey: string) {
  return await sm2Decrypt(encrypted, { privateKey: privKey });
}

const original = await decryptRequest(securePayload, privateKey);
const parsed = JSON.parse(original);
// { name: 'Alice', idCard: '110101199001011234' }
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

// 服务端生成密钥对
const { publicKey, privateKey } = await sm2GenerateKeyPair();
// 将 publicKey 发送给客户端，privateKey 安全保存

// === 客户端：使用公钥加密请求数据 ===
async function encryptRequest(data: string, pubKey: string) {
  return await sm2Encrypt(data, { publicKey: pubKey, outputEncoding: 'base64' });
}

const securePayload = await encryptRequest(
  JSON.stringify({ name: 'Alice', idCard: '110101199001011234' }),
  publicKey
);
// 发送 securePayload 到服务端

// === 服务端：使用私钥解密 ===
async function decryptRequest(encrypted: string, privKey: string) {
  return await sm2Decrypt(encrypted, { privateKey: privKey });
}

const original = await decryptRequest(securePayload, privateKey);
const parsed = JSON.parse(original);
// { name: 'Alice', idCard: '110101199001011234' }
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();

  // 加密
  const enc = await sm2Encrypt('sensitive data', { publicKey, outputEncoding: 'base64' });

  // 解密
  const dec = await sm2Decrypt(enc, { privateKey });
  console.log(dec); // 'sensitive data'
})();
```
:::
::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

// CBC 模式（默认），自动生成随机 IV
const encrypted = await sm4Encrypt('Hello SM4', { key: KEY });
const decrypted = await sm4Decrypt(encrypted, { key: KEY });
// 'Hello SM4'
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

// CBC 模式（默认），自动生成随机 IV
const encrypted = await sm4Encrypt('Hello SM4', { key: KEY });
const decrypted = await sm4Decrypt(encrypted, { key: KEY });
// 'Hello SM4'
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');

const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const encrypted = await sm4Encrypt('Hello SM4', { key: KEY });
  const decrypted = await sm4Decrypt(encrypted, { key: KEY });
})();
```
:::
::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';
const IV = '000102030405060708090a0b0c0d0e0f';

const enc = await sm4Encrypt('data', { key: KEY, iv: IV });
const dec = await sm4Decrypt(enc, { key: KEY, iv: IV });
// 'data'
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';
const IV = '000102030405060708090a0b0c0d0e0f';

const enc = await sm4Encrypt('data', { key: KEY, iv: IV });
const dec = await sm4Decrypt(enc, { key: KEY, iv: IV });
// 'data'
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');

const KEY = '0123456789abcdeffedcba9876543210';
const IV = '000102030405060708090a0b0c0d0e0f';

const enc = await sm4Encrypt('data', { key: KEY, iv: IV });
const dec = await sm4Decrypt(enc, { key: KEY, iv: IV });
```
:::
::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

// ECB 模式
const encEcb = await sm4Encrypt('data', { key: KEY, mode: 'ecb' });
const decEcb = await sm4Decrypt(encEcb, { key: KEY, mode: 'ecb' });
// 'data'

// Hex 输出（默认）
const encHex = await sm4Encrypt('data', { key: KEY, outputEncoding: 'hex' });
const decHex = await sm4Decrypt(encHex, { key: KEY, outputEncoding: 'hex' });
// 'data'

// Base64 输出
const encB64 = await sm4Encrypt('data', { key: KEY, outputEncoding: 'base64' });
const decB64 = await sm4Decrypt(encB64, { key: KEY, outputEncoding: 'base64' });
// 'data'
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

// ECB 模式
const encEcb = await sm4Encrypt('data', { key: KEY, mode: 'ecb' });
const decEcb = await sm4Decrypt(encEcb, { key: KEY, mode: 'ecb' });
// 'data'

// Hex 输出（默认）
const encHex = await sm4Encrypt('data', { key: KEY, outputEncoding: 'hex' });
const decHex = await sm4Decrypt(encHex, { key: KEY, outputEncoding: 'hex' });
// 'data'

// Base64 输出
const encB64 = await sm4Encrypt('data', { key: KEY, outputEncoding: 'base64' });
const decB64 = await sm4Decrypt(encB64, { key: KEY, outputEncoding: 'base64' });
// 'data'
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');
const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const enc = await sm4Encrypt('data', { key: KEY, mode: 'ecb' });
  const dec = await sm4Decrypt(enc, { key: KEY, mode: 'ecb' });
})();
```
:::
::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

// 生成随机的 SM4 密钥（32 位 hex）
function generateSm4Key(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

const sm4Key = generateSm4Key();
// 'a3f1e204b7c8d9056e7a1234ab5690c1'

// 加密业务数据
const businessData = JSON.stringify({
  orderId: '202401010001',
  amount: '100.00',
  timestamp: Date.now(),
});

const encrypted = await sm4Encrypt(businessData, {
  key: sm4Key,
  outputEncoding: 'base64',
  mode: 'cbc',
});

// 解密
const decrypted = await sm4Decrypt(encrypted, {
  key: sm4Key,
  outputEncoding: 'base64',
  mode: 'cbc',
});
const data = JSON.parse(decrypted);
// { orderId: '202401010001', amount: '100.00', timestamp: 1704067200000 }
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

// 生成随机的 SM4 密钥（32 位 hex）
function generateSm4Key(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

const sm4Key = generateSm4Key();
// 'a3f1e204b7c8d9056e7a1234ab5690c1'

// 加密业务数据
const businessData = JSON.stringify({
  orderId: '202401010001',
  amount: '100.00',
  timestamp: Date.now(),
});

const encrypted = await sm4Encrypt(businessData, {
  key: sm4Key,
  outputEncoding: 'base64',
  mode: 'cbc',
});

// 解密
const decrypted = await sm4Decrypt(encrypted, {
  key: sm4Key,
  outputEncoding: 'base64',
  mode: 'cbc',
});
const data = JSON.parse(decrypted);
// { orderId: '202401010001', amount: '100.00', timestamp: 1704067200000 }
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');

const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const data = JSON.stringify({ orderId: '001', amount: '100.00' });
  const enc = await sm4Encrypt(data, { key: KEY, outputEncoding: 'base64' });
  const dec = JSON.parse(await sm4Decrypt(enc, { key: KEY, outputEncoding: 'base64' }));
  console.log(dec); // { orderId: '001', amount: '100.00' }
})();
```
:::
