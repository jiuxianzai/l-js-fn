import { md5, aesEncrypt, aesDecrypt, rsaEncrypt, rsaDecrypt, rsaGenerateKeyPair, sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair, sm4Encrypt, sm4Decrypt } from '@/crypto/index';

describe('crypto - 加密模块', () => {
	// ==================== MD5 ====================
	describe('md5 - MD5 哈希', () => {
		it('正确计算空字符串的 MD5', () => {
			expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
		});

		it('正确计算短字符串的 MD5', () => {
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

		it('支持自定义盐值', () => {
			const withoutSalt = md5('hello');
			const withSalt = md5('hello', { salt: 'mySalt' });
			expect(withSalt).not.toBe(withoutSalt);
			expect(withSalt).toBe(md5('hello', { salt: 'mySalt' }));
		});

		it('相同输入产生相同哈希', () => {
			expect(md5('test')).toBe(md5('test'));
		});

		it('不同输入产生不同哈希', () => {
			expect(md5('test1')).not.toBe(md5('test2'));
		});

		it('处理包含中文的字符串', () => {
			expect(md5('你好世界')).toBe('65396ee4aad0b4f17aacd1c6112ee364');
		});

		it('处理特殊字符', () => {
			const hash = md5('!@#$%^&*()');
			expect(hash).toHaveLength(32);
			expect(/^[a-f0-9]{32}$/.test(hash)).toBe(true);
		});

		it('盐值为空字符串时表现一致', () => {
			expect(md5('hello', { salt: '' })).toBe(md5('hello'));
		});
	});

	// ==================== AES ====================
	describe('AES - 对称加密', () => {
		const testKey = 'my-secret-key-123';

		describe('aesEncrypt / aesDecrypt - CBC 模式 (默认)', () => {
			it('加密后解密得到原始数据', () => {
				const data = 'Hello World';
				const encrypted = aesEncrypt(data, { key: testKey });
				const decrypted = aesDecrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密中文数据后解密正确', () => {
				const data = '你好世界，Hello World！';
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

			it('支持加盐 PBKDF2 密钥派生', () => {
				const data = 'Data with salt';
				const salt = 'my-salt-value';
				const encrypted = aesEncrypt(data, { key: testKey, salt, iterations: 1000 });
				const decrypted = aesDecrypt(encrypted, { key: testKey, salt, iterations: 1000 });
				expect(decrypted).toBe(data);
			});

			it('加盐密钥加密后，不加盐解密应该失败', () => {
				const data = 'Sensitive data';
				const encrypted = aesEncrypt(data, { key: testKey, salt: 'salt123' });
				expect(() => aesDecrypt(encrypted, { key: testKey })).toThrow();
			});

			it('支持 hex 输出编码', () => {
				const data = 'Hex output test';
				const encrypted = aesEncrypt(data, { key: testKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = aesDecrypt(encrypted, { key: testKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('每次加密结果不同（随机 IV）', () => {
				const data = 'Random IV test';
				const enc1 = aesEncrypt(data, { key: testKey });
				const enc2 = aesEncrypt(data, { key: testKey });
				expect(enc1).not.toBe(enc2);
			});

			it('长数据加密解密正确', () => {
				const data = 'A'.repeat(1000);
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
		});

		describe('AES - ECB 模式', () => {
			it('ECB 模式加密解密正确', () => {
				const data = 'ECB mode test';
				const encrypted = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const decrypted = aesDecrypt(encrypted, { key: testKey, mode: 'ecb' });
				expect(decrypted).toBe(data);
			});

			it('ECB 模式相同输入产生相同输出', () => {
				const data = 'Deterministic test';
				const enc1 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const enc2 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				expect(enc1).toBe(enc2);
			});

			it('ECB 模式下使用 IV 参数不影响加密', () => {
				const data = 'ECB IV test';
				const enc1 = aesEncrypt(data, { key: testKey, mode: 'ecb' });
				const dec1 = aesDecrypt(enc1, { key: testKey, mode: 'ecb' });
				expect(dec1).toBe(data);
			});
		});

		describe('AES - 错误处理', () => {
			it('缺少 key 抛出异常', () => {
				expect(() => aesEncrypt('data', { key: '' })).toThrow(TypeError);
			});

			it('错误的 key 解密失败', () => {
				const encrypted = aesEncrypt('data', { key: testKey });
				expect(() => aesDecrypt(encrypted, { key: 'wrong-key-4321' })).toThrow();
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
			it('生成 2048 位密钥对', () => {
				expect(keyPair.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(keyPair.privateKey).toContain('BEGIN PRIVATE KEY');
			});

			it('生成 1024 位密钥对', () => {
				const smallKey = rsaGenerateKeyPair({ keySize: 1024 });
				expect(smallKey.publicKey).toContain('BEGIN PUBLIC KEY');
				expect(smallKey.privateKey).toContain('BEGIN PRIVATE KEY');
			});

			it('支持 DER base64 格式', () => {
				const derPair = rsaGenerateKeyPair({ keySize: 2048, format: 'der-base64' });
				expect(derPair.publicKey).not.toContain('BEGIN');
				expect(derPair.privateKey).not.toContain('BEGIN');
				expect(typeof derPair.publicKey).toBe('string');
				expect(typeof derPair.privateKey).toBe('string');
			});

			it('生成的密钥对能正常加解密', () => {
				const pair = rsaGenerateKeyPair({ keySize: 2048 });
				const encrypted = rsaEncrypt('test', { publicKey: pair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: pair.privateKey });
				expect(decrypted).toBe('test');
			});
		});

		describe('rsaEncrypt / rsaDecrypt', () => {
			it('公钥加密私钥解密：普通数据', () => {
				const data = 'Hello RSA';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
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
				const data = JSON.stringify({ user: 'test', id: 123 });
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(JSON.parse(decrypted)).toEqual({ user: 'test', id: 123 });
			});

			it('支持 hex 输出编码', () => {
				const data = 'Hex encoding test';
				const encrypted = rsaEncrypt(data, { publicKey: keyPair.publicKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = rsaDecrypt(encrypted, { privateKey: keyPair.privateKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('错误公钥解密失败', () => {
				const otherPair = rsaGenerateKeyPair({ keySize: 2048 });
				const encrypted = rsaEncrypt('data', { publicKey: keyPair.publicKey });
				expect(() => rsaDecrypt(encrypted, { privateKey: otherPair.privateKey })).toThrow();
			});

			it('缺少 publicKey 抛出异常', () => {
				expect(() => rsaEncrypt('data', { publicKey: '' })).toThrow(TypeError);
			});

			it('缺少 privateKey 抛出异常', () => {
				expect(() => rsaDecrypt('encrypted', { privateKey: '' })).toThrow(TypeError);
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
	});

	// ==================== SM2 ====================
	describe('SM2 - 国密非对称加密', () => {
		let keyPair: { publicKey: string; privateKey: string };

		beforeAll(async () => {
			keyPair = await sm2GenerateKeyPair();
		});

		describe('sm2GenerateKeyPair', () => {
			it('生成 SM2 密钥对', () => {
				expect(keyPair.publicKey).toBeDefined();
				expect(keyPair.privateKey).toBeDefined();
				expect(keyPair.publicKey).toHaveLength(130);
				expect(keyPair.privateKey).toHaveLength(64);
			});

			it('每次生成的密钥对不同', async () => {
				const pair2 = await sm2GenerateKeyPair();
				expect(pair2.publicKey).not.toBe(keyPair.publicKey);
				expect(pair2.privateKey).not.toBe(keyPair.privateKey);
			});
		});

		describe('sm2Encrypt / sm2Decrypt', () => {
			it('公钥加密私钥解密：普通数据', async () => {
				const data = 'Hello SM2';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('公钥加密私钥解密：中文数据', async () => {
				const data = '你好 SM2 加密';
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

			it('支持 base64 输出编码', async () => {
				const data = 'Base64 output test';
				const encrypted = await sm2Encrypt(data, { publicKey: keyPair.publicKey, outputEncoding: 'base64' });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: keyPair.privateKey });
				expect(decrypted).toBe(data);
			});

			it('错误密钥解密失败', async () => {
				const otherPair = await sm2GenerateKeyPair();
				const encrypted = await sm2Encrypt('data', { publicKey: keyPair.publicKey });
				const decrypted = await sm2Decrypt(encrypted, { privateKey: otherPair.privateKey });
				expect(decrypted).not.toBe('data');
			});

			it('缺少 publicKey 抛出异常', async () => {
				await expect(sm2Encrypt('data', { publicKey: '' })).rejects.toThrow(TypeError);
			});

			it('缺少 privateKey 抛出异常', async () => {
				await expect(sm2Decrypt('encrypted', { privateKey: '' })).rejects.toThrow(TypeError);
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
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
			});

			it('加密中文数据后解密正确', async () => {
				const data = '你好 SM4 加密';
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

			it('支持 hex 输出编码', async () => {
				const data = 'Hex SM4 test';
				const encrypted = await sm4Encrypt(data, { key: testKey, outputEncoding: 'hex' });
				expect(/^[a-f0-9]+$/.test(encrypted)).toBe(true);
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, outputEncoding: 'hex' });
				expect(decrypted).toBe(data);
			});

			it('支持 base64 输出编码', async () => {
				const data = 'Base64 SM4 test';
				const encrypted = await sm4Encrypt(data, { key: testKey, outputEncoding: 'base64' });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey, outputEncoding: 'base64' });
				expect(decrypted).toBe(data);
			});

			it('长数据加密解密正确', async () => {
				const data = 'B'.repeat(500);
				const encrypted = await sm4Encrypt(data, { key: testKey });
				const decrypted = await sm4Decrypt(encrypted, { key: testKey });
				expect(decrypted).toBe(data);
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
				const enc1 = await sm4Encrypt(data, { key: testKey, mode: 'ecb', iv: '000102030405060708090a0b0c0d0e0f' });
				const enc2 = await sm4Encrypt(data, { key: testKey, mode: 'ecb', iv: '000102030405060708090a0b0c0d0e0f' });
				expect(enc1).toBe(enc2);
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
		});
	});
});
