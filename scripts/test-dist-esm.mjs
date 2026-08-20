/**
 * dist ESM 验证 — 原生 Node.js ESM 脚本
 * 运行: node --experimental-vm-modules scripts/test-dist-esm.mjs
 */
import { strict as baseAssert } from 'node:assert';

// 包装 assert 以自动统计断言总数（含循环内执行次数）
let assertCount = 0;
const assert = new Proxy(baseAssert, {
	get(target, prop) {
		const fn = target[prop];
		return (...args) => {
			assertCount++;
			return fn.apply(target, args);
		};
	},
});

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

// 主包全量平铺 —— 子模块函数也应可直接从主包导入
const flattened = [
  ['scrollTop', 'function'],
  ['getScrollPosition', 'function'],
  ['setCookie', 'function'],
  ['getStorage', 'function'],
  ['setSession', 'function'],
  ['WebSocketManager', 'function'],
  ['EventBus', 'function'],
  ['eventBus', 'object'],
  ['Polling', 'function'],
  ['H5Bridge', 'function'],
  ['IframeBridge', 'function'],
  ['DATE_FORMAT', 'object'],
  ['HTTP_STATUS', 'object'],
  ['REGEXP', 'object'],
  ['base64Encode', 'function'],
  ['urlEncode', 'function'],
  ['formatFileSize', 'function'],
  ['downloadFile', 'function'],
  ['isImage', 'function'],
  // uniapp 模块：主包统一加 uni 前缀
  ['uniEnv', 'object'],
  ['uniFile', 'object'],
  ['uniModel', 'object'],
  ['uniPermission', 'object'],
  ['uniRequest', 'object'],
  ['uniRouter', 'object'],
  ['uniStorage', 'object'],
  ['uniToast', 'object'],
  ['uniGetAdapter', 'function'],
  ['uniRegisterAdapter', 'function'],
  ['uniAutoDetect', 'function'],
  ['uniCreateWechatAdapter', 'function'],
];
for (const [name, type] of flattened) {
  assert.ok(main[name] !== undefined, `主包平铺导出 ${name} 不存在`);
  assert.strictEqual(typeof main[name], type, `主包平铺导出 ${name} 类型`);
}

// uniapp 旧命名不应出现在主包（已在主包内改为 uni 前缀）
const uniOldNames = ['env', 'file', 'model', 'permission', 'request', 'router', 'storage', 'toast', 'getAdapter', 'registerAdapter', 'autoDetect', 'createWechatAdapter'];
for (const name of uniOldNames) {
  assert.ok(main[name] === undefined, `主包不应再导出 ${name}（应使用 uni 前缀）`);
}

// uniapp 子路径保持原始命名
const uniapp = await import('../dist/uniapp/index.js');
assert.ok(typeof uniapp.env === 'object', 'uniapp.env');
assert.ok(typeof uniapp.storage === 'object', 'uniapp.storage');
assert.ok(typeof uniapp.toast === 'object', 'uniapp.toast');
assert.ok(typeof uniapp.request === 'object', 'uniapp.request');
assert.ok(typeof uniapp.getAdapter === 'function', 'uniapp.getAdapter');

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

// sm3：已知向量
assert.strictEqual(
  await crypto.sm3('abc'),
  '66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0',
  'crypto.sm3 向量',
);
assert.strictEqual(
  await crypto.sm3(''),
  '1ab21d8355cfa17f8e61194831e81a8f22bec8c728fefb747ed035eb5082aa2b',
  'crypto.sm3 空串',
);

// sm4：ECB 往返（真实产物）
const sm4Enc = await crypto.sm4Encrypt('test', { key: '0123456789abcdeffedcba9876543210', mode: 'ecb' });
const sm4Dec = await crypto.sm4Decrypt(sm4Enc, { key: '0123456789abcdeffedcba9876543210', mode: 'ecb' });
assert.strictEqual(sm4Dec, 'test', 'crypto.sm4');

// crypto/sm 子入口（不依赖 node crypto，供小程序使用）
const sm = await import('../dist/crypto/sm.js');
assert.strictEqual(typeof sm.sm3, 'function', 'crypto/sm.sm3');
assert.strictEqual(typeof sm.sm4Encrypt, 'function', 'crypto/sm.sm4Encrypt');
assert.strictEqual(typeof sm.sm2GenerateKeyPair, 'function', 'crypto/sm.sm2GenerateKeyPair');
const smSm4Enc = await sm.sm4Encrypt('test', { key: '0123456789abcdeffedcba9876543210', mode: 'ecb' });
const smSm4Dec = await sm.sm4Decrypt(smSm4Enc, { key: '0123456789abcdeffedcba9876543210', mode: 'ecb' });
assert.strictEqual(smSm4Dec, 'test', 'crypto/sm.sm4 往返');

console.log(`✅ 全部 ${assertCount} 个 ESM 断言通过`);
