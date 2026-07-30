/**
 * dist ESM 验证 — 原生 Node.js ESM 脚本
 * 运行: node --experimental-vm-modules scripts/test-dist-esm.mjs
 */
import { strict as assert } from 'node:assert';

// 主包 ESM
const main = await import('../dist/index.js');
assert.ok(typeof main.isEmpty === 'function', 'isEmpty');
assert.ok(typeof main.isArray === 'function', 'isArray');
assert.ok(typeof main.isEmail === 'function', 'isEmail');
assert.ok(typeof main.arrayUnique === 'function', 'arrayUnique');
assert.ok(typeof main.flatten === 'function', 'flatten');
assert.ok(typeof main.desensitization === 'function', 'desensitization');
assert.ok(typeof main.trim === 'function', 'trim');
assert.ok(typeof main.getUuid === 'function', 'getUuid');
assert.ok(typeof main.objMerge === 'function', 'objMerge');
assert.ok(typeof main.deepMerge === 'function', 'deepMerge');
assert.ok(typeof main.getType === 'function', 'getType');
assert.ok(typeof main.deepClone === 'function', 'deepClone');
assert.ok(typeof main.once === 'function', 'once');
assert.ok(typeof main.dateFormat === 'function', 'dateFormat');
assert.ok(typeof main.formatNumber === 'function', 'formatNumber');
assert.ok(main.Result.ok('data').success === true, 'Result.ok');

// 子模块 ESM
const bom = await import('../dist/bom/index.js');
assert.ok(typeof bom.scrollTop === 'function', 'bom.scrollTop');
assert.ok(typeof bom.copyToClipboard === 'function', 'bom.copyToClipboard');
assert.ok(typeof bom.setCookie === 'function', 'bom.setCookie');

const encode = await import('../dist/encode/index.js');
assert.strictEqual(encode.base64Encode('Hello'), 'SGVsbG8=', 'encode.base64Encode');
assert.strictEqual(encode.base64Decode('SGVsbG8='), 'Hello', 'encode.base64Decode');

const file = await import('../dist/file/index.js');
assert.strictEqual(file.formatFileSize(1024).formatted, '1 KB', 'file.formatFileSize');
assert.strictEqual(file.getExtension('a.png'), '.png', 'file.getExtension');

const config = await import('../dist/config/index.js');
assert.strictEqual(config.DATE_FORMAT.FULL, 'yyyy-MM-dd HH:mm:ss', 'config.DATE_FORMAT');
assert.strictEqual(config.HTTP_STATUS.OK, 200, 'config.HTTP_STATUS');

const regex = await import('../dist/regex/index.js');
assert.ok(regex.REGEXP.PHONE.test('13800138000'), 'regex.PHONE');
assert.ok(regex.REGEXP.EMAIL.test('test@example.com'), 'regex.EMAIL');

const ws = await import('../dist/ws/index.js');
assert.ok(new ws.WebSocketManager('ws://localhost:9999') instanceof ws.WebSocketManager, 'ws');

const polling = await import('../dist/polling/index.js');
assert.ok(new polling.Polling() instanceof polling.Polling, 'polling');

const eventBus = await import('../dist/event-bus/index.js');
const bus = new eventBus.EventBus();
let received = '';
bus.on('test', (msg) => { received = msg; });
bus.emit('test', 'hello');
assert.strictEqual(received, 'hello', 'event-bus');

const crypto = await import('../dist/crypto/index.js');
assert.strictEqual(crypto.md5('hello'), '5d41402abc4b2a76b9719d911017c592', 'crypto.md5');
const aesEnc = crypto.aesEncrypt('test', { key: 'my-key-12345678' });
const aesDec = crypto.aesDecrypt(aesEnc, { key: 'my-key-12345678' });
assert.strictEqual(aesDec, 'test', 'crypto.aes');

const sm2Pair = await crypto.sm2GenerateKeyPair();
const sm2Enc = await crypto.sm2Encrypt('hello', { publicKey: sm2Pair.publicKey });
const sm2Dec = await crypto.sm2Decrypt(sm2Enc, { privateKey: sm2Pair.privateKey });
assert.strictEqual(sm2Dec, 'hello', 'crypto.sm2');

console.log(`✅ 全部 ${46} 个 ESM 断言通过`);
