import { md5, aesEncrypt, aesDecrypt, rsaEncrypt, rsaDecrypt, rsaGenerateKeyPair, sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair, sm4Encrypt, sm4Decrypt } from '@/crypto/index';

describe('crypto - 加密模块', () => {
	// ==================== MD5 ====================
	describe('md5 - MD5 哈希', () => {
		describe('RFC 1321 测试向量', () => {
			it('正确计算空字符串的 MD5', () => {
				expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
			});

			it('正确计算单字符 "a" 的 MD5', () => {
				expect(md5('a')).toBe('0cc175b9c0f1b6a831c399e269772661');
			});

			it('正确计算 "abc" 的 MD5', () => {
				expect(md5('abc')).toBe('900150983cd24fb0d6963f7d28e17f72');
			});

			it('正确计算 "message digest" 的 MD5', () => {
				expect(md5('message digest')).toBe('f96b697d7cb7938d525a2f31aaf161d0');
			});

			it('正确计算字母表的 MD5', () => {
				expect(md5('abcdefghijklmnopqrstuvwxyz')).toBe('c3fcd3d76192e4007dfb496cca67e13b');
			});

			it('正确计算长句子的 MD5', () => {
				expect(md5('The quick brown fox jumps over the lazy dog')).toBe('9e107d9d372bb6826bd81d3542a419d6');
			});
		});

		describe('散列特性验证', () => {
			it('相同输入产生相同哈希（确定性）', () => {
				expect(md5('test')).toBe(md5('test'));
			});

			it('不同输入产生不同哈希（雪崩效应）', () => {
				expect(md5('test1')).not.toBe(md5('test2'));
			});

			it('输出固定为 32 位十六进制字符串', () => {
				const tests = ['', 'a', 'abc', 'hello world', Math.random().toString(), 'x'.repeat(100)];
				for (const t of tests) {
					const hash = md5(t);
					expect(hash).toHaveLength(32);
					expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true);
				}
			});

			it('大小写敏感', () => {
				expect(md5('ABC')).not.toBe(md5('abc'));
			});

			it('空格敏感', () => {
				expect(md5('hello')).not.toBe(md5('hello '));
			});
		});

		describe('Unicode 支持', () => {
			it('处理中文', () => {
				expect(md5('你好世界')).toBe('65396ee4aad0b4f17aacd1c6112ee364');
			});

			it('处理日文', () => {
				expect(md5('こんにちは')).toHaveLength(32);
				expect(/^[a-f0-9]{32}$/.test(md5('こんにちは'))).toBe(true);
			});

			it('处理 emoji', () => {
				const hash = md5('😀🎉🔥');
				expect(hash).toHaveLength(32);
				expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true);
			});

			it('处理混合中英文和 emoji', () => {
				const hash = md5('你好 World 😀');
				expect(hash).toHaveLength(32);
			});
		});

		describe('特殊字符', () => {
			it('处理标点符号', () => {
				const hash = md5('!@#$%^&*()');
				expect(hash).toHaveLength(32);
				expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true);
			});

			it('处理换行符', () => {
				const hash = md5('line1\nline2\r\nline3');
				expect(hash).toHaveLength(32);
			});

			it('处理 JSON 字符串', () => {
				const json = JSON.stringify({ key: 'value', nested: { arr: [1, 2, 3] } });
				const hash = md5(json);
				expect(hash).toHaveLength(32);
			});
		});

		describe('长文本', () => {
			it('处理 10K 字符长文本', () => {
				const long = 'a'.repeat(10000);
				const hash = md5(long);
				expect(hash).toHaveLength(32);
			});

			it('处理 100K 字符长文本', () => {
				const long = 'b'.repeat(100000);
				const hash = md5(long);
				expect(hash).toHaveLength(32);
			});
		});

		describe('纯数字输入', () => {
			it('处理纯数字字符串', () => {
				expect(md5('1234567890')).toHaveLength(32);
			});

			it('数字 0-9 连串', () => {
				const hash = md5('0123456789');
				expect(hash).toHaveLength(32);
			});
		});

		describe('盐值功能', () => {
			it('加盐后结果不同于不加盐', () => {
				const withoutSalt = md5('hello');
				const withSalt = md5('hello', { salt: 'mySalt' });
				expect(withSalt).not.toBe(withoutSalt);
			});

			it('相同输入相同盐值结果一致', () => {
				expect(md5('hello', { salt: 'mySalt' })).toBe(md5('hello', { salt: 'mySalt' }));
			});

			it('不同盐值产生不同结果', () => {
				const s1 = md5('hello', { salt: 'salt1' });
				const s2 = md5('hello', { salt: 'salt2' });
				expect(s1).not.toBe(s2);
			});

			it('盐值为空字符串等同于不加盐', () => {
				expect(md5('hello', { salt: '' })).toBe(md5('hello'));
			});

			it('盐值支持特殊字符', () => {
				const hash = md5('hello', { salt: '!@# $%^' });
				expect(hash).toHaveLength(32);
			});

			it('盐值支持中文', () => {
				const hash = md5('password', { salt: '中文盐值' });
				expect(hash).toHaveLength(32);
			});

			it('盐值支持 emoji', () => {
				const hash = md5('password', { salt: '🔑' });
				expect(hash).toHaveLength(32);
			});

			it('短密码加盐后与不加盐完全不同', () => {
				const noSalt = md5('123');
				const withSalt = md5('123', { salt: 'pepper' });
				expect(withSalt).not.toBe(noSalt);
			});
		});
	});

	// ==================== AES ====================
	describe('AES - 对称加密', () => {
		const testKey = 'my-secret-key-123';
		const exactKey16 = 'exactly16bytes!!'; // 恰好 16 字节的 key

		describe('aesEncrypt / aesDecrypt - CBC 模式 (默认)', () => {
			it('加密后解密得到原始数据', () => {
				const data = 'Hello World';
				const encrypted = aesEncrypt(data, { key: testKey });
				expect(typeof encrypted).toBe('string');
				expect(encrypted.length).toBeGreaterThan(0);
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密中文数据后解密正确', () => {
				const data = '你好世界，Hello World！';
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密 emoji 后解密正确', () => {
				const data = '🎉 Hello 🔥 你好 🌍';
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('支持自定义 IV', () => {
				const data = 'Test with custom IV';
				const customIv = '0123456789abcdef0123456789abcdef';
				const encrypted = aesEncrypt(data, { key: testKey, iv: customIv });
				const decrypted = aesDecrypt(encrypted, { key: testKey, iv: customIv });
				expect(decrypted).toBe(data);
			});

			it('自定义 IV 时相同输入产生相同密文（确定性）', () => {
				const data = 'Deterministic with IV';
				const iv = '0123456789abcdef0123456789abcdef';
				const enc1 = aesEncrypt(data, { key: testKey, iv });
				const enc2 = aesEncrypt(data, { key: testKey, iv });
				expect(enc1).toBe(enc2);
			});

			it('支持加盐 PBKDF2 密钥派生', () => {
				const data = 'Data with salt';
				const salt = 'my-salt-value';
				const encrypted = aesEncrypt(data, { key: testKey, salt, iterations: 1000 });
				const decrypted = aesDecrypt(encrypted, { key: testKey, salt, iterations: 1000 });
				expect(decrypted).toBe(data);
			});

			it('PBKDF2 不指定 iterations 时使用默认值', () => {
				const data = 'Default iterations';
				const salt = 'salt';
				const encrypted = aesEncrypt(data, { key: testKey, salt });
				const decrypted = aesDecrypt(encrypted, { key: testKey, salt });
				expect(decrypted).toBe(data);
			});

			it('加盐密钥加密后，不加盐解密失败', () => {
				const data = 'Sensitive data';
				const encrypted = aesEncrypt(data, { key: testKey, salt: 'salt123' });
				expect(() => aesDecrypt(encrypted, { key: testKey })).toThrow();
			});

			it('加盐密钥用错误的盐值解密失败', () => {
				const data = 'Wrong salt test';
				const encrypted = aesEncrypt(data, { key: testKey, salt: 'saltA' });
				expect(() => aesDecrypt(encrypted, { key: testKey, salt: 'saltB' })).toThrow();
			});

			it('hex 输出编码格式正确且可解密', () => {
				const data = 'Hex output test';
				const encrypted = aesEncrypt(data, { key: testKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = aesDecrypt(encrypted, { key: testKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('base64 输出编码格式正确且可解密', () => {
				const data = 'Base64 output test';
				const encrypted = aesEncrypt(data, { key: testKey, outputEncoding: 'base64' });
				const decrypted = aesDecrypt(encrypted, { key: testKey, outputEncoding: 'base64' });
				expect(decrypted).toBe(data);
			});

			it('每次加密结果不同（随机 IV）', () => {
				const data = 'Random IV test';
				const enc1 = aesEncrypt(data, { key: testKey });
				const enc2 = aesEncrypt(data, { key: testKey });
				expect(enc1).not.toBe(enc2);
			});

			it('使用随机 IV 的不同密文均能正确解密', () => {
				const data = 'Multi decrypt test';
				for (let i = 0; i < 3; i++) {
					const enc = aesEncrypt(data, { key: testKey });
					expect(aesDecrypt(enc, { key: testKey })).toBe(data);
				}
			});

			it('长数据加密解密（10K 字符）', () => {
				const data = 'A'.repeat(10000);
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('空字符串加密解密', () => {
				const data = '';
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('恰好 16 字节的密钥正常工作', () => {
				const data = '16 byte key test';
				const encrypted = aesEncrypt(data, { key: exactKey16 });
				const decrypted = aesDecrypt(encrypted, { key: exactKey16 });
				expect(decrypted).toBe(data);
			});

			it('超短密钥（1 字符）仍可加密解密', () => {
				const data = 'Single char key';
				const encrypted = aesEncrypt(data, { key: 'k' });
				const decrypted = aesDecrypt(encrypted, { key: 'k' });
				expect(decrypted).toBe(data);
			});

			it('数字和特殊字符混合数据', () => {
				const data = 'User_123!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('多次加解密循环（稳定性测试）', () => {
				const data = 'Stability test data';
				let current = data;
				for (let i = 0; i < 5; i++) {
					const enc = aesEncrypt(current, { key: testKey });
					current = aesDecrypt(enc, { key: testKey });
				}
				expect(current).toBe(data);
			});
		});

		describe('AES - ECB 模式', () => {
			it('ECB 模式加密解密正确', () => {
				const data = 'ECB mode test';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const decrypted = aesDecrypt(encrypted, { key: testKey, mode: 'ecb' });
				expect(decrypted).toBe(data);
			});

			it('ECB 模式相同输入产生相同输出（确定性加密）', () => {
				const data = 'Deterministic test';
				const enc1 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const enc2 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				expect(enc1).toBe(enc2);
			});

			it('ECB 模式下使用 IV 参数不影响加密结果', () => {
				const data = 'ECB IV ignored test';
				const enc1 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const enc2 = aesEncrypt(data, { key: testKey, mode: 'ecb', iv: '0123456789abcdef0123456789abcdef' });
				expect(enc1).toBe(enc2);
			});

			it('ECB 模式支持 hex 输出', () => {
				const data = 'ECB hex test';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'ecb', outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = aesDecrypt(encrypted, { key: testKey, mode: 'ecb', outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('ECB 模式 + 加盐密钥派生', () => {
				const data = 'ECB with PBKDF2';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'ecb', salt: 'ecb-salt', iterations: 500 });
				const decrypted = aesDecrypt(encrypted, { key: testKey, mode: 'ecb', salt: 'ecb-salt', iterations: 500 });
				expect(decrypted).toBe(data);
			});
		});

		describe('AES - 模式交叉验证', () => {
			it('CBC 模式加密的密文不能用 ECB 模式解密', () => {
				const data = 'Cross mode test';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'cbc' });
				expect(() => aesDecrypt(encrypted, { key: testKey, mode: 'ecb' })).toThrow();
			});

			it('ECB 模式加密的密文不能用 CBC 模式解密', () => {
				const data = 'Cross mode test 2';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				expect(() => aesDecrypt(encrypted, { key: testKey, mode: 'cbc' })).toThrow();
			});
		});

		describe('AES - 错误处理与边界', () => {
			it('缺少 key 抛出异常', () => {
				expect(() => aesEncrypt('data', { key: '' })).toThrow(TypeError);
			});

			it('错误的 key 解密失败', () => {
				const encrypted = aesEncrypt('data', { key: testKey });
				expect(() => aesDecrypt(encrypted, { key: 'wrong-key-4321' })).toThrow();
			});

			it('无效 hex 输出时解密抛异常', () => {
				expect(() => aesDecrypt('!!!not-hex!!!', { key: testKey, outputEncoding: 'hex' })).toThrow();
			});

			it('无效 base64 输出时解密抛异常', () => {
				expect(() => aesDecrypt('!!!not-base64!!!', { key: testKey, outputEncoding: 'base64' })).toThrow();
			});

			it('hex 密文使用 base64 模式解密失败', () => {
				const encrypted = aesEncrypt('data', { key: testKey, outputEncoding: 'hex' });
				expect(() => aesDecrypt(encrypted, { key: testKey, outputEncoding: 'base64' })).toThrow();
			});

			it('加密解密模式不匹配导致解密失败', () => {
				const encrypted = aesEncrypt('test', { key: testKey, mode: 'cbc' });
				expect(() => aesDecrypt(encrypted, { key: testKey, mode: 'ecb' })).toThrow();
			});
		});
	});

	// ==================== RSA ====================
	describe('RSA - 非对称加密', () => {
		let keyPair: { publicKey: string; privateKey: string };

		beforeAll(() => {
			keyPair = rsaGenerateKeyPair({ keySize: 2048 });
		});

		describe('rsaGenerateKeyPair', () => {
			it('默认生成 2048 位密钥对(PEM)', () => {
				const pair = rsaGenerateKeyPair();
				expect(pair.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(pair.privateKey).toContain('BEGIN PRIVATE KEY');
				expect(pair.publicKey).toContain('END PUBLIC KEY');
				expect(pair.privateKey).toContain('END PRIVATE KEY');
			});

			it('生成 2048 位密钥对', () => {
				expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
			});

			it('生成 1024 位密钥对', () => {
				const smallKey = rsaGenerateKeyPair({ keySize: 1024 });
				expect(smallKey.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(smallKey.privateKey).toContain('BEGIN PRIVATE KEY');
			});

			it('生成 4096 位密钥对', () => {
				const bigKey = rsaGenerateKeyPair({ keySize: 4096 });
				expect(bigKey.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(bigKey.privateKey).toContain('BEGIN PRIVATE KEY');
			});

			it('支持 DER base64 格式', () => {
				const derPair = rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });
				expect(derPair.publicKey).not.toContain('BEGIN');
				expect(derPair.privateKey).not.toContain('BEGIN');
				expect(typeof derPair.publicKey).toBe('string');
				expect(typeof derPair.privateKey).toBe('string');
				expect(derPair.publicKey.length).toBeGreaterThan(0);
				expect(derPair.privateKey.length).toBeGreaterThan(0);
			});

			it('每次生成的密钥对不同', () => {
				const pair1 = rsaGenerateKeyPair({ keySize: 2048 });
				const pair2 = rsaGenerateKeyPair({ keySize: 2048 });
				expect(pair1.publicKey).not.toBe(pair2.publicKey);
				expect(pair1.privateKey).not.toBe(pair2.privateKey);
			});

			it('生成的密钥对能正常加解密', () => {
				const pair = rsaGenerateKeyPair({ keySize: 2048 });
				const encrypted = rsaEncrypt('test', { publicKey: pair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: pair.privateKey });
				expect(decrypted).toBe('test');
			});
		});

		describe('rsaEncrypt / rsaDecrypt', () => {
			it('公钥加密私钥解密：普通英文', () => {
				const data = 'Hello RSA';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				expect(typeof encrypted).toBe('string');
				expect(encrypted).not.toBe(data);
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：中文数据', () => {
				const data = '你好 RSA 加密';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：JSON 数据', () => {
				const data = JSON.stringify({ user: 'test', id: 123, roles: ['admin', 'user'] });
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(JSON.parse(decrypted)).toEqual({ user: 'test', id: 123, roles: ['admin', 'user'] });
			});

			it('公钥加密私钥解密：emoji', () => {
				const data = 'Hello 🎉 World 🌍🔥';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('hex 输出编码格式正确且可解密', () => {
				const data = 'Hex encoding test';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('base64 输出编码格式正确且可解密', () => {
				const data = 'Base64 encoding test';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey, outputEncoding: 'base64' });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey, outputEncoding: 'base64' });
				expect(decrypted).toBe(data);
			});

			it('错误私钥解密失败', () => {
				const otherPair = rsaGenerateKeyPair({ keySize: 2048 });
				const encrypted = rsaEncrypt('data', { publicKey: keyPair.publicKey });
				expect(() => rsaDecrypt(encrypted, { privateKey: otherPair.privateKey })).toThrow();
			});

			it('公钥不能用于解密', () => {
				const encrypted = rsaEncrypt('data', { publicKey: keyPair.publicKey });
				expect(() => rsaDecrypt(encrypted, { privateKey: keyPair.publicKey } as any)).toThrow();
			});

			it('空字符串加密解密', () => {
				const encrypted = rsaEncrypt('', { publicKey: keyPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe('');
			});

			it('多次加密同一密钥产生不同密文', () => {
				const data = 'Same data';
				const enc1 = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				const enc2 = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				expect(enc1).not.toBe(enc2);
				expect(rsaDecrypt(enc1, { privateKey: keyPair.privateKey })).toBe(data);
				expect(rsaDecrypt(enc2, { privateKey: keyPair.privateKey })).toBe(data);
			});

			it('1024 位密钥加解密', () => {
				const smallPair = rsaGenerateKeyPair({ keySize: 1024 });
				const data = 'Small key test';
				const encrypted = rsaEncrypt(data, { publicKey: smallPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: smallPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('4096 位密钥加解密', () => {
				const bigPair = rsaGenerateKeyPair({ keySize: 4096 });
				const data = 'Large key test';
				const encrypted = rsaEncrypt(data, { publicKey: bigPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: bigPair.privateKey });
				expect(decrypted).toBe(data);
			});
		});

		describe('RSA - 错误处理', () => {
			it('缺少 publicKey 抛出异常', () => {
				expect(() => rsaEncrypt('data', { publicKey: '' })).toThrow(TypeError);
			});

			it('缺少 privateKey 抛出异常', () => {
				expect(() => rsaDecrypt('encrypted', { privateKey: '' })).toThrow(TypeError);
			});

			it('无效公钥格式抛出异常', () => {
				expect(() => rsaEncrypt('data', { publicKey: 'invalid-key' })).toThrow();
			});

			it('无效私钥格式抛出异常', () => {
				expect(() => rsaDecrypt('data', { privateKey: 'invalid-key' })).toThrow();
			});
		});
	});

	// ==================== SM2 ====================
	describe('SM2 - 国密非对称加密', () => {
		let keyPair: { publicKey: string; privateKey: string };

		beforeAll(async () => {
			keyPair = await sm2GenerateKeyPair();
		});

		describe('sm2GenerateKeyPair', () => {
			it('生成 SM2 密钥对格式正确', () => {
				expect(keyPair.publicKey).toBeDefined();
				expect(keyPair.privateKey).toBeDefined();
				expect(keyPair.publicKey).toHaveLength(130);
				expect(keyPair.privateKey).toHaveLength(64);
				expect(keyPair.publicKey.startsWith('04')).toBe(true);
				expect(/^[a-f0-9]{64}$/.test(keyPair.privateKey)).toBe(true);
			});

			it('每次生成的密钥对不同', async () => {
				const pair2 = await sm2GenerateKeyPair();
				expect(pair2.publicKey).not.toBe(keyPair.publicKey);
				expect(pair2.privateKey).not.toBe(keyPair.privateKey);
			});

			it('多次生成密钥对（10 次）均格式正确', async () => {
				const pubKeys = new Set<string>();
				for (let i = 0; i < 10; i++) {
					const pair = await sm2GenerateKeyPair();
					expect(pair.publicKey).toHaveLength(130);
					expect(pair.privateKey).toHaveLength(64);
					pubKeys.add(pair.publicKey);
				}
				expect(pubKeys.size).toBeGreaterThan(1);
			});
		});

		describe('sm2Encrypt / sm2Decrypt', () => {
			it('公钥加密私钥解密：普通英文', async () => {
				const data = 'Hello SM2';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				expect(encrypted.startsWith('04')).toBe(true);
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：中文数据', async () => {
				const data = '你好 SM2 加密';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：emoji', async () => {
				const data = 'SM2 🔐 加密 🎉';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：长文本数据', async () => {
				const data = 'A'.repeat(200);
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：空字符串', async () => {
				const encrypted = await sm2Encrypt('', { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe('');
			});

			it('公钥加密私钥解密：特殊字符', async () => {
				const data = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('hex 输出编码（默认）', async () => {
				const data = 'Hex SM2 output';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				expect(encrypted.startsWith('04')).toBe(true);
				expect(/^04[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('base64 输出编码', async () => {
				const data = 'Base64 output test';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey, outputEncoding: 'base64' });
				expect(encrypted.startsWith('04')).toBe(false);
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('错误密钥解密返回错误结果', async () => {
				const otherPair = await sm2GenerateKeyPair();
				const encrypted = await sm2Encrypt('data', { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: otherPair.privateKey });
				expect(decrypted).not.toBe('data');
			});

			it('多次加密同一数据产生不同密文', async () => {
				const data = 'Non-deterministic';
				const enc1 = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const enc2 = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				expect(enc1).not.toBe(enc2);
				expect(await sm2Decrypt(enc1, { privateKey: keyPair.privateKey })).toBe(data);
				expect(await sm2Decrypt(enc2, { privateKey: keyPair.privateKey })).toBe(data);
			});
		});

		describe('SM2 - 错误处理', () => {
			it('缺少 publicKey 抛出异常', async () => {
				await expect(sm2Encrypt('data', { publicKey: '' })).rejects.toThrow(TypeError);
			});

			it('缺少 privateKey 抛出异常', async () => {
				await expect(sm2Decrypt('encrypted', { privateKey: '' })).rejects.toThrow(TypeError);
			});

			it('无效公钥格式抛出异常', async () => {
				await expect(sm2Encrypt('data', { publicKey: 'not-a-hex-key' })).rejects.toThrow();
			});
		});
	});

	// ==================== SM4 ====================
	describe('SM4 - 国密对称加密', () => {
		const testKey = '0123456789abcdeffedcba9876543210';

		describe('sm4Encrypt / sm4Decrypt - CBC 模式 (默认)', () => {
			it('加密后解密得到原始数据', async () => {
				const data = 'Hello SM4';
				const encrypted = await sm4Encrypt(data, { key: testKey });
				expect(typeof encrypted).toBe('string');
				expect(encrypted.length).toBeGreaterThan(32);
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密中文数据后解密正确', async () => {
				const data = '你好 SM4 加密';
				const encrypted = await sm4Encrypt(data, { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密 emoji 后解密正确', async () => {
				const data = 'SM4 🔐 安全 🔒';
				const encrypted = await sm4Encrypt(data, { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('支持自定义 IV', async () => {
				const data = 'Custom IV test';
				const customIv = '000102030405060708090a0b0c0d0e0f';
				const encrypted = await sm4Encrypt(data, { key: testKey, iv: customIv });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, iv: customIv });
				expect(decrypted).toBe(data);
			});

			it('自定义 IV 时相同输入产生相同密文', async () => {
				const data = 'Deterministic SM4';
				const iv = '000102030405060708090a0b0c0d0e0f';
				const enc1 = await sm4Encrypt(data, { key: testKey, iv });
				const enc2 = await sm4Encrypt(data, { key: testKey, iv });
				expect(enc1).toBe(enc2);
			});

			it('hex 输出编码（默认）', async () => {
				const data = 'Hex SM4 test';
				const encrypted = await sm4Encrypt(data, { key: testKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('base64 输出编码', async () => {
				const data = 'Base64 SM4 test';
				const encrypted = await sm4Encrypt(data, { key: testKey, outputEncoding: 'base64' });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, outputEncoding: 'base64' });
				expect(decrypted).toBe(data);
			});

			it('长数据加密解密（1K 字符）', async () => {
				const data = 'B'.repeat(1000);
				const encrypted = await sm4Encrypt(data, { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('空字符串加密解密', async () => {
				const encrypted = await sm4Encrypt('', { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe('');
			});

			it('特殊字符数据', async () => {
				const data = '`~!@#$%^&*()_+-=[]{}|;:,.<>?/"\'';
				const encrypted = await sm4Encrypt(data, { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('多次加解密循环（稳定性）', async () => {
				const data = 'SM4 stability test';
				let current = data;
				for (let i = 0; i < 5; i++) {
					const enc = await sm4Encrypt(current, { key: testKey });
					current = await sm4Decrypt(enc, { key: testKey });
				}
				expect(current).toBe(data);
			});

			it('每次加密结果不同（随机 IV）', async () => {
				const data = 'Random IV SM4';
				const enc1 = await sm4Encrypt(data, { key: testKey });
				const enc2 = await sm4Encrypt(data, { key: testKey });
				expect(enc1).not.toBe(enc2);
				expect(await sm4Decrypt(enc1, { key: testKey })).toBe(data);
				expect(await sm4Decrypt(enc2, { key: testKey })).toBe(data);
			});
		});

		describe('SM4 - ECB 模式', () => {
			it('ECB 模式加密解密正确', async () => {
				const data = 'ECB SM4 mode test';
				const encrypted = await sm4Encrypt(data, { key: testKey, mode: 'ecb' });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, mode: 'ecb' });
				expect(decrypted).toBe(data);
			});

			it('ECB 模式相同输入产生相同输出', async () => {
				const data = 'Deterministic SM4';
				const enc1 = await sm4Encrypt(data, { key: testKey, mode: 'ecb' });
				const enc2 = await sm4Encrypt(data, { key: testKey, mode: 'ecb' });
				expect(enc1).toBe(enc2);
			});

			it('ECB 模式 + base64 输出', async () => {
				const data = 'ECB base64';
				const encrypted = await sm4Encrypt(data, { key: testKey, mode: 'ecb', outputEncoding: 'base64' });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, mode: 'ecb', outputEncoding: 'base64' });
				expect(decrypted).toBe(data);
			});
		});

		describe('SM4 - 模式交叉验证', () => {
			it('CBC 模式加密密文不能用 ECB 模式解密', async () => {
				const data = 'Cross mode SM4';
				const encrypted = await sm4Encrypt(data, { key: testKey, mode: 'cbc' });
				await expect(sm4Decrypt(encrypted, { key: testKey, mode: 'ecb' })).rejects.toThrow();
			});
		});

		describe('SM4 - 错误处理', () => {
			it('缺少 key 抛出异常', async () => {
				await expect(sm4Encrypt('data', { key: '' })).rejects.toThrow(TypeError);
			});

			it('错误 key 解密失败', async () => {
				const wrongKey = '11111111111111111111111111111111';
				const encrypted = await sm4Encrypt('data', { key: testKey });
				await expect(sm4Decrypt(encrypted, { key: wrongKey })).rejects.toThrow();
			});

			it('无效 key 格式抛出异常', async () => {
				await expect(sm4Encrypt('data', { key: 'not-hex-key!!!' })).rejects.toThrow();
			});
		});
	});

	// ==================== 组合场景测试 ====================
	describe('组合场景测试', () => {
		it('MD5 生成 AES 密钥进行加解密', () => {
			const password = 'user-password';
			const hashKey = md5(password, { salt: 'app-secret' });
			const data = 'Sensitive user data';

			const encrypted = aesEncrypt(data, { key: hashKey });
			const decrypted = aesDecrypt(encrypted, { key: hashKey });
			expect(decrypted).toBe(data);
		});

		it('AES 密钥加密后通过 RSA 传输', () => {
			const pair = rsaGenerateKeyPair({ keySize: 2048 });
			const aesKey = 'my-16-char-key!';
			const secretData = 'Confidential message';

			// AES 加密数据
			const encryptedData = aesEncrypt(secretData, { key: aesKey });

			// RSA 加密 AES 密钥
			const encryptedKey = rsaEncrypt(aesKey, { publicKey: pair.publicKey });

			// 服务端用私钥解密 AES 密钥
			const recoveredKey = rsaDecrypt(encryptedKey, { privateKey: pair.privateKey });
			expect(recoveredKey).toBe(aesKey);

			// 用恢复的密钥解密数据
			const recoveredData = aesDecrypt(encryptedData, { key: recoveredKey });
			expect(recoveredData).toBe(secretData);
		});

		it('MD5 + AES + 盐值完整加密流程', () => {
			const userPassword = 'user123456';
			const appSecret = 'application-secret';

			// 使用 MD5+盐值生成确定性密钥
			const derivedKey = md5(userPassword, { salt: appSecret });

			const originalData = 'Protected data with full pipeline';

			// AES 加密
			const encrypted = aesEncrypt(originalData, {
				key: derivedKey,
				outputEncoding: 'base64',
			});

			// AES 解密
			const decrypted = aesDecrypt(encrypted, {
				key: derivedKey,
				outputEncoding: 'base64',
			});

			expect(decrypted).toBe(originalData);
		});
	});
});
