import { utf8ToHex } from '@/crypto/utils';

export interface Sm4Options {
	key: string;
	iv?: string;
	mode?: 'cbc' | 'ecb';
	outputEncoding?: 'hex' | 'base64';
	keyEncoding?: 'hex' | 'utf8';
}

async function loadSmCrypto(): Promise<any> {
	try {
		// sm-crypto 是 CJS 包，Node ESM 动态导入返回 { default: {sm2,sm3,sm4}, sm2 }，sm3/sm4 只在 default 上
		const mod = await import('sm-crypto');
		return mod.default ?? mod;
	} catch {
		throw new Error('SM4 requires the "sm-crypto" package.\nInstall it: npm install sm-crypto');
	}
}

/**
 * sm-crypto 要求 key/iv 为 hex 格式，如传入 utf8 编码的 key/iv 则统一转 hex
 */
function normalizeKey(key: string, keyEncoding: 'hex' | 'utf8'): string {
	return keyEncoding === 'utf8' ? utf8ToHex(key) : key;
}

/**
 * SM4 加密
 * @param data - 待加密的字符串
 * @param options - 加密选项
 * @returns 加密结果字符串
 */
export async function sm4Encrypt(data: string, options: Sm4Options): Promise<string> {
	const { key, iv, mode = 'cbc', outputEncoding = 'hex', keyEncoding = 'hex' } = options;
	if (!key) throw new TypeError('SM4: key is required');

	const smCrypto = await loadSmCrypto();

	const keyHex = normalizeKey(key, keyEncoding);
	const ivHex = iv ? normalizeKey(iv, keyEncoding) : iv;

	// sm-crypto 的 CBC 模式需要 IV，如未传入则自动生成随机 IV
	let ivToUse = ivHex;
	if (!ivToUse && mode === 'cbc') {
		ivToUse = '';
		for (let i = 0; i < 16; i++) {
			ivToUse += ('0' + Math.floor(Math.random() * 256).toString(16)).slice(-2);
		}
	}

	const encryptData = smCrypto.sm4.encrypt(data, keyHex, { mode, iv: ivToUse, output: 'string' });

	// 将 IV 拼接到密文前缀（CBC 模式且未显式传入 IV 时）
	if (!ivHex && mode === 'cbc') {
		const result = ivToUse + encryptData;
		if (outputEncoding === 'base64') {
			const { hexToBytes, bytesToBase64 } = await import('@/crypto/utils');
			return bytesToBase64(hexToBytes(result));
		}
		return result;
	}

	if (outputEncoding === 'base64') {
		const { hexToBytes, bytesToBase64 } = await import('@/crypto/utils');
		return bytesToBase64(hexToBytes(encryptData));
	}
	return encryptData;
}

/**
 * SM4 解密
 * @param encrypted - 加密后的字符串
 * @param options - 解密选项（需与加密时保持一致）
 * @returns 原始字符串
 */
export async function sm4Decrypt(encrypted: string, options: Sm4Options): Promise<string> {
	const { key, iv, mode = 'cbc', outputEncoding = 'hex', keyEncoding = 'hex' } = options;
	if (!key) throw new TypeError('SM4: key is required');

	const smCrypto = await loadSmCrypto();

	const keyHex = normalizeKey(key, keyEncoding);
	const ivHex = iv ? normalizeKey(iv, keyEncoding) : iv;

	let hexData = encrypted;

	// 如果输入是 base64，先转为 hex
	if (outputEncoding === 'base64') {
		const { base64ToBytes, bytesToHex } = await import('@/crypto/utils');
		hexData = bytesToHex(base64ToBytes(encrypted));
	}

	let ivToUse = ivHex;
	let ciphertext = hexData;

	// 未显式传入 IV 时，从前缀提取 IV
	if (!ivHex && mode === 'cbc') {
		ivToUse = hexData.slice(0, 32);
		ciphertext = hexData.slice(32);
	}

	const decryptData = smCrypto.sm4.decrypt(ciphertext, keyHex, { mode, iv: ivToUse, output: 'string' });
	return decryptData;
}
