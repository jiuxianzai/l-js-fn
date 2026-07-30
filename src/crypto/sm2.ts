import { hexToBytes, bytesToBase64, base64ToBytes, bytesToHex } from '@/crypto/utils';

export interface Sm2KeyPair {
	publicKey: string;
	privateKey: string;
}

export interface Sm2EncryptOptions {
	publicKey: string;
	outputEncoding?: 'hex' | 'base64';
}

export interface Sm2DecryptOptions {
	privateKey: string;
}

async function loadSmCrypto(): Promise<any> {
	try {
		return await import('sm-crypto');
	} catch {
		throw new Error('SM2 requires the "sm-crypto" package.\nInstall it: npm install sm-crypto');
	}
}

/**
 * 生成 SM2 密钥对
 * @returns 包含公私钥的对象（hex 格式）
 */
export async function sm2GenerateKeyPair(): Promise<Sm2KeyPair> {
	const smCrypto = await loadSmCrypto();
	const keypair = smCrypto.sm2.generateKeyPairHex();
	return {
		publicKey: keypair.publicKey,
		privateKey: keypair.privateKey,
	};
}

/**
 * SM2 公钥加密
 * @param data - 待加密的字符串
 * @param options - 加密选项
 * @returns 加密结果
 */
export async function sm2Encrypt(data: string, options: Sm2EncryptOptions): Promise<string> {
	const { publicKey, outputEncoding = 'hex' } = options;
	if (!publicKey) throw new TypeError('SM2: publicKey is required');

	const smCrypto = await loadSmCrypto();
	const encryptData = smCrypto.sm2.doEncrypt(data, publicKey, 1);
	const result = '04' + encryptData;

	if (outputEncoding === 'base64') {
		return bytesToBase64(hexToBytes(result));
	}
	return result;
}

/**
 * SM2 私钥解密
 * @param encrypted - 加密后的字符串（自动识别 hex 或 base64）
 * @param options - 解密选项
 * @returns 原始字符串
 */
export async function sm2Decrypt(encrypted: string, options: Sm2DecryptOptions): Promise<string> {
	const { privateKey } = options;
	if (!privateKey) throw new TypeError('SM2: privateKey is required');

	const smCrypto = await loadSmCrypto();

	// 自动识别 hex 或 base64 格式
	let hexContent = encrypted;
	if (!/^[0-9a-fA-F]+$/.test(encrypted)) {
		// 可能是 base64 格式，先转为 hex
		hexContent = bytesToHex(base64ToBytes(encrypted));
	}

	// 去除 04 前缀
	if (hexContent.startsWith('04')) hexContent = hexContent.slice(2);

	return smCrypto.sm2.doDecrypt(hexContent, privateKey, 1);
}
