# crypto — 加密模块

加密模块提供常用的加解密和哈希算法，支持 MD5、AES、RSA、SM2、SM4 等加密方式。

> **注意**：SM2、SM4 算法依赖 `sm-crypto` 包，按需安装：
>
> ```bash
> npm install sm-crypto
> ```

> **导入说明**：本模块依赖 Node 内置 `crypto`（MD5/AES/RSA），**仅在 Node 环境可用**，不参与主包平铺，始终通过子路径 `l-js-fn/crypto` 导入。

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

## 1. md5 — MD5 哈希

计算字符串的 MD5 哈希值，支持加盐。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| input | `string` | 是 | 待哈希的字符串 |
| options | `object` | 否 | 配置选项 |
| options.salt | `string` | 否 | 盐值，拼接到输入后方 |

**返回值：** `string` — 32 位十六进制哈希字符串

### 1.1 基础哈希

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

md5('Hello World');
// 'b10a8db164e0754105b7a99be72e3fe5'
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

md5('Hello World');
// 'b10a8db164e0754105b7a99be72e3fe5'
```
:::

### 1.2 加盐哈希

加盐可防止彩虹表攻击，即使输入相同，不同盐值也会产生不同的哈希。

::: code-group
```ts [TypeScript]
import { md5 } from 'l-js-fn/crypto';

md5('mypassword');
// 'a029d0df84eb5549c641e04a9ef389e5'

md5('mypassword', { salt: 'random-salt-value' });
// '984c47bda74bdb3f51dbdf5300e675d1'

// 相同输入 + 相同盐值 = 相同结果
const hash = md5('user_input', { salt: 'app_secret' });
const isValid = hash === md5('user_input', { salt: 'app_secret' });
// true
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

const hash = md5('password', { salt: 'my-salt' });
const isValid = hash === md5('password', { salt: 'my-salt' });
// true
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

const hash = md5('password', { salt: 'my-salt' });
```
:::

### 1.3 实际场景：密码存储校验

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

const hashed = hashPassword('user1234');
const ok = verifyPassword('user1234', hashed);
// true
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';
const SECRET_KEY = 'your-app-secret-key';

function hashPassword(password) {
  return md5(password, { salt: SECRET_KEY });
}
function verifyPassword(password, storedHash) {
  return hashPassword(password) === storedHash;
}
const hashed = hashPassword('user1234');
const ok = verifyPassword('user1234', hashed);
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');
const SECRET_KEY = 'your-app-secret-key';

function hashPassword(password) {
  return md5(password, { salt: SECRET_KEY });
}
```
:::

### 1.4 实际场景：请求签名

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
```

```js [JavaScript (ESM)]
import { md5 } from 'l-js-fn/crypto';

function generateApiSign(params, secretKey) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return md5(sorted, { salt: secretKey });
}
```

```js [JavaScript (CJS)]
const { md5 } = require('l-js-fn/crypto');

function generateApiSign(params, secretKey) {
  const sorted = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&');
  return md5(sorted, { salt: secretKey });
}
```
:::

---

## 2. AES — 对称加密

AES-128 对称加密/解密算法，支持 CBC 和 ECB 模式，支持 PBKDF2 密钥派生。

### 2.1 AesOptions

```ts
interface AesOptions {
  key: string;
  iv?: string;
  mode?: 'cbc' | 'ecb';
  salt?: string;
  iterations?: number;
  outputEncoding?: 'hex' | 'base64';
}
```

### 2.2 基础加密解密

::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
// 'Hello World'
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const encrypted = aesEncrypt('Hello World', { key: 'my-secret-key' });
const decrypted = aesDecrypt(encrypted, { key: 'my-secret-key' });
```
:::

### 2.3 自定义 IV

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
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');
const IV = '0123456789abcdef0123456789abcdef';
const enc = aesEncrypt('secret', { key: 'my-key', iv: IV });
const dec = aesDecrypt(enc, { key: 'my-key', iv: IV });
```
:::

### 2.4 PBKDF2 密钥派生（加盐）

::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('sensitive data', {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});

const dec = aesDecrypt(enc, {
  key: 'user-password',
  salt: 'unique-salt-per-user',
  iterations: 10000,
});
// 'sensitive data'

// 不提供盐值则解密失败
try { aesDecrypt(enc, { key: 'user-password' }); } catch (e) {}
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('data', { key: 'password', salt: 'salt', iterations: 10000 });
const dec = aesDecrypt(enc, { key: 'password', salt: 'salt', iterations: 10000 });
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const enc = aesEncrypt('data', { key: 'password', salt: 'salt', iterations: 10000 });
const dec = aesDecrypt(enc, { key: 'password', salt: 'salt', iterations: 10000 });
```
:::

### 2.5 ECB 模式

::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
// 'data'

// ECB 模式下相同输入产生相同输出
const e1 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
const e2 = aesEncrypt('hello', { key: 'k', mode: 'ecb' });
e1 === e2; // true
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const enc = aesEncrypt('data', { key: 'my-key', mode: 'ecb' });
const dec = aesDecrypt(enc, { key: 'my-key', mode: 'ecb' });
```
:::

### 2.6 输出编码格式

::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

// Base64 输出（默认）
const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });
// Hex 输出
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });

aesDecrypt(b64, { key: 'secret' });
aesDecrypt(hex, { key: 'secret', outputEncoding: 'hex' });
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');

const b64 = aesEncrypt('data', { key: 'secret', outputEncoding: 'base64' });
const hex = aesEncrypt('data', { key: 'secret', outputEncoding: 'hex' });
```
:::

### 2.7 实际场景：本地敏感数据存储

::: code-group
```ts [TypeScript]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';

const APP_SECRET = 'my-app-secret-key16';

function saveSecrets(key: string, value: string): void {
  const encrypted = aesEncrypt(value, { key: APP_SECRET });
  localStorage.setItem(key, encrypted);
}

function loadSecrets(key: string): string {
  const encrypted = localStorage.getItem(key);
  if (!encrypted) return '';
  return aesDecrypt(encrypted, { key: APP_SECRET });
}

saveSecrets('api_token', 'sk-xxxx-xxxxxxxxxxxxx');
const token = loadSecrets('api_token');
// 'sk-xxxx-xxxxxxxxxxxxx'
```

```js [JavaScript (ESM)]
import { aesEncrypt, aesDecrypt } from 'l-js-fn/crypto';
const APP_SECRET = 'my-app-secret-key16';

function saveSecrets(key, value) {
  const encrypted = aesEncrypt(value, { key: APP_SECRET });
  localStorage.setItem(key, encrypted);
}
function loadSecrets(key) {
  const encrypted = localStorage.getItem(key);
  return encrypted ? aesDecrypt(encrypted, { key: APP_SECRET }) : '';
}

saveSecrets('token', 'abc123');
const token = loadSecrets('token');
```

```js [JavaScript (CJS)]
const { aesEncrypt, aesDecrypt } = require('l-js-fn/crypto');
const APP_SECRET = 'my-app-secret-key16';

function saveSecrets(key, value) {
  localStorage.setItem(key, aesEncrypt(value, { key: APP_SECRET }));
}
```
:::

---

## 3. RSA — 非对称加密

RSA 非对称加密算法，支持密钥对生成、公钥加密、私钥解密。

### 3.1 相关类型

```ts
interface RsaKeyPair {
  publicKey: string;
  privateKey: string;
}

interface RsaEncryptOptions {
  publicKey: string;
  outputEncoding?: 'hex' | 'base64';
}

interface RsaDecryptOptions {
  privateKey: string;
  outputEncoding?: 'hex' | 'base64';
}
```

### 3.2 生成密钥对

::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair } from 'l-js-fn/crypto';

// 默认 2048 位 PEM 格式
const { publicKey, privateKey } = rsaGenerateKeyPair();

// 1024 位
rsaGenerateKeyPair({ keySize: 1024 });

// 4096 位
rsaGenerateKeyPair({ keySize: 4096 });

// DER-base64 格式（便于网络传输）
rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();
console.log(publicKey);
// -----BEGIN PUBLIC KEY-----
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
```
:::

### 3.3 公钥加密 / 私钥解密

::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

const encrypted = rsaEncrypt('Hello RSA', { publicKey });
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
const encrypted = rsaEncrypt('Hello RSA', { publicKey });
const decrypted = rsaDecrypt(encrypted, { privateKey });
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
const encrypted = rsaEncrypt('Hello RSA', { publicKey });
const decrypted = rsaDecrypt(encrypted, { privateKey });
```
:::

### 3.4 实际场景：前端加密敏感数据

::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });

// 前端加密
function encryptLoginData(password: string, pubKey: string) {
  return rsaEncrypt(password, { publicKey: pubKey });
}

// 服务端解密
function decryptLoginData(encrypted: string, privKey: string) {
  return rsaDecrypt(encrypted, { privateKey: privKey });
}

const encrypted = encryptLoginData('userPassword123', publicKey);
const original = decryptLoginData(encrypted, privateKey);
// 'userPassword123'
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });
const encrypted = rsaEncrypt('userPassword123', { publicKey });
const original = rsaDecrypt(encrypted, { privateKey });
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair({ keySize: 2048 });
const encrypted = rsaEncrypt('userPassword123', { publicKey });
const original = rsaDecrypt(encrypted, { privateKey });
```
:::

### 3.5 实际场景：JSON 数据加密

::: code-group
```ts [TypeScript]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();

const userData = JSON.stringify({ name: 'Alice', email: 'alice@example.com' });
const encrypted = rsaEncrypt(userData, { publicKey });
const parsed = JSON.parse(rsaDecrypt(encrypted, { privateKey }));
// { name: 'Alice', email: 'alice@example.com' }
```

```js [JavaScript (ESM)]
import { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = rsaGenerateKeyPair();
const data = JSON.stringify({ name: 'Alice', email: 'alice@example.com' });
const parsed = JSON.parse(rsaDecrypt(rsaEncrypt(data, { publicKey }), { privateKey }));
```

```js [JavaScript (CJS)]
const { rsaGenerateKeyPair, rsaEncrypt, rsaDecrypt } = require('l-js-fn/crypto');

const { publicKey, privateKey } = rsaGenerateKeyPair();
const data = JSON.stringify({ name: 'Alice', email: 'alice@example.com' });
const parsed = JSON.parse(rsaDecrypt(rsaEncrypt(data, { publicKey }), { privateKey }));
```
:::

---

## 4. SM2 — 国密非对称加密

SM2 椭圆曲线公钥密码算法，所有方法均为异步，按需依赖 `sm-crypto`。

> **依赖安装**：`npm install sm-crypto`

### 4.1 相关类型

```ts
interface Sm2KeyPair {
  publicKey: string;
  privateKey: string;
}

interface Sm2EncryptOptions {
  publicKey: string;
  outputEncoding?: 'hex' | 'base64';
}

interface Sm2DecryptOptions {
  privateKey: string;
}
```

### 4.2 生成密钥对

::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();
// publicKey:  '04a1b2c3...' (130 位 hex)
// privateKey: '0123456789...' (64 位 hex)

const pair2 = await sm2GenerateKeyPair();
pair2.publicKey !== publicKey; // true
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair } from 'l-js-fn/crypto';

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  console.log(publicKey.length); // 130
})();
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
})();
```
:::

### 4.3 公钥加密 / 私钥解密

::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();

// Hex 输出（默认）
const encHex = await sm2Encrypt('Hello SM2', { publicKey });
const decHex = await sm2Decrypt(encHex, { privateKey });
// 'Hello SM2'

// Base64 输出
const encB64 = await sm2Encrypt('data', { publicKey, outputEncoding: 'base64' });
const decB64 = await sm2Decrypt(encB64, { privateKey });
// 'data'

// 中文数据
const encCn = await sm2Encrypt('你好世界', { publicKey });
const decCn = await sm2Decrypt(encCn, { privateKey });
// '你好世界'
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  const encrypted = await sm2Encrypt('Hello', { publicKey });
  const decrypted = await sm2Decrypt(encrypted, { privateKey });
})();
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  const encrypted = await sm2Encrypt('Hello', { publicKey });
  const decrypted = await sm2Decrypt(encrypted, { privateKey });
})();
```
:::

### 4.4 实际场景：国密通信加密

::: code-group
```ts [TypeScript]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

const { publicKey, privateKey } = await sm2GenerateKeyPair();

// 客户端加密
async function encryptRequest(data: string, pubKey: string) {
  return await sm2Encrypt(data, { publicKey: pubKey, outputEncoding: 'base64' });
}

const payload = await encryptRequest(
  JSON.stringify({ name: 'Alice', idCard: '110101199001011234' }),
  publicKey
);

// 服务端解密
async function decryptRequest(encrypted: string, privKey: string) {
  return await sm2Decrypt(encrypted, { privateKey: privKey });
}

const original = JSON.parse(await decryptRequest(payload, privateKey));
// { name: 'Alice', idCard: '110101199001011234' }
```

```js [JavaScript (ESM)]
import { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } from 'l-js-fn/crypto';

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  const enc = await sm2Encrypt('sensitive data', { publicKey, outputEncoding: 'base64' });
  const dec = await sm2Decrypt(enc, { privateKey });
})();
```

```js [JavaScript (CJS)]
const { sm2GenerateKeyPair, sm2Encrypt, sm2Decrypt } = require('l-js-fn/crypto');

(async () => {
  const { publicKey, privateKey } = await sm2GenerateKeyPair();
  const enc = await sm2Encrypt('data', { publicKey, outputEncoding: 'base64' });
  const dec = await sm2Decrypt(enc, { privateKey });
})();
```
:::

---

## 5. SM4 — 国密对称加密

SM4 分组密码算法，所有方法均为异步，按需依赖 `sm-crypto`。CBC 模式未指定 IV 时会自动生成随机 IV。

> **依赖安装**：`npm install sm-crypto`

### 5.1 Sm4Options

```ts
interface Sm4Options {
  key: string;
  iv?: string;
  mode?: 'cbc' | 'ecb';
  outputEncoding?: 'hex' | 'base64';
}
```

### 5.2 基础加密解密

::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

const encrypted = await sm4Encrypt('Hello SM4', { key: KEY });
const decrypted = await sm4Decrypt(encrypted, { key: KEY });
// 'Hello SM4'
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const encrypted = await sm4Encrypt('Hello SM4', { key: KEY });
  const decrypted = await sm4Decrypt(encrypted, { key: KEY });
})();
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

### 5.3 自定义 IV

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
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');
const KEY = '0123456789abcdeffedcba9876543210';
const IV = '000102030405060708090a0b0c0d0e0f';

const enc = await sm4Encrypt('data', { key: KEY, iv: IV });
const dec = await sm4Decrypt(enc, { key: KEY, iv: IV });
```
:::

### 5.4 ECB 模式与输出编码

::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

const KEY = '0123456789abcdeffedcba9876543210';

// ECB 模式
const encEcb = await sm4Encrypt('data', { key: KEY, mode: 'ecb' });
const decEcb = await sm4Decrypt(encEcb, { key: KEY, mode: 'ecb' });

// Hex 输出（默认）
const encHex = await sm4Encrypt('data', { key: KEY, outputEncoding: 'hex' });
const decHex = await sm4Decrypt(encHex, { key: KEY, outputEncoding: 'hex' });

// Base64 输出
const encB64 = await sm4Encrypt('data', { key: KEY, outputEncoding: 'base64' });
const decB64 = await sm4Decrypt(encB64, { key: KEY, outputEncoding: 'base64' });
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';
const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const enc = await sm4Encrypt('data', { key: KEY, mode: 'ecb' });
  const dec = await sm4Decrypt(enc, { key: KEY, mode: 'ecb' });
})();
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

### 5.5 实际场景：国密业务数据加密

::: code-group
```ts [TypeScript]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';

function generateSm4Key(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
}

const sm4Key = generateSm4Key();

const businessData = JSON.stringify({
  orderId: '202401010001',
  amount: '100.00',
  timestamp: Date.now(),
});

const encrypted = await sm4Encrypt(businessData, {
  key: sm4Key, outputEncoding: 'base64', mode: 'cbc',
});

const decrypted = await sm4Decrypt(encrypted, {
  key: sm4Key, outputEncoding: 'base64', mode: 'cbc',
});
const data = JSON.parse(decrypted);
// { orderId: '202401010001', amount: '100.00', ... }
```

```js [JavaScript (ESM)]
import { sm4Encrypt, sm4Decrypt } from 'l-js-fn/crypto';
const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const data = JSON.stringify({ orderId: '001', amount: '100.00' });
  const enc = await sm4Encrypt(data, { key: KEY, outputEncoding: 'base64' });
  const dec = JSON.parse(await sm4Decrypt(enc, { key: KEY, outputEncoding: 'base64' }));
})();
```

```js [JavaScript (CJS)]
const { sm4Encrypt, sm4Decrypt } = require('l-js-fn/crypto');
const KEY = '0123456789abcdeffedcba9876543210';

(async () => {
  const data = JSON.stringify({ orderId: '001', amount: '100.00' });
  const enc = await sm4Encrypt(data, { key: KEY, outputEncoding: 'base64' });
  const dec = JSON.parse(await sm4Decrypt(enc, { key: KEY, outputEncoding: 'base64' }));
})();
```
:::
