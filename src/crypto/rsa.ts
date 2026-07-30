import crypto from 'crypto';
import { bytesToBase64, bytesToHex, stringToBytes, base64ToBytes, hexToBytes } from '@/crypto/utils';

export interface RsaKeyPair {
	publicKey: string;
	privateKey: string;
}

export interface RsaEncryptOptions {
	publicKey: string;
	outputEncoding?: 'hex' | 'base64';
}

export interface RsaDecryptOptions {
	privateKey: string;
	outputEncoding?: 'hex' | 'base64';
}

export interface RsaGenerateOptions {
	keySize?: number;
	format?: 'pem' | 'der-base64';
}

/**
 * 生成 RSA 密钥对
 * @param options - 密钥生成选项
 * @returns 包含公私钥的对象
 */
export function rsaGenerateKeyPair(options?: RsaGenerateOptions): RsaKeyPair {
	const { keySize = 2048, format = 'pem' } = options || {};
	const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: keySize,
		publicKeyEncoding: { type: 'spki', format: 'pem' },
		privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
	});

	if (format === 'der-base64') {
		const pubDer = crypto.createPublicKey(publicKey).export({ type: 'spki', format: 'der' });
		const privDer = crypto.createPrivateKey(privateKey).export({ type: 'pkcs8', format: 'der' });
		return {
			publicKey: bytesToBase64(new Uint8Array(pubDer)),
			privateKey: bytesToBase64(new Uint8Array(privDer)),
		};
	}

	return { publicKey, privateKey };
}

/**
 * RSA 公钥加密
 * @param data - 待加密的字符串
 * @param options - 加密选项
 * @returns 加密结果
 */
export function rsaEncrypt(data: string, options: RsaEncryptOptions): string {
	const { publicKey, outputEncoding = 'base64' } = options;
	if (!publicKey) throw new TypeError('RSA: publicKey is required');

	const dataBytes = stringToBytes(data);
	const encrypted = crypto.publicEncrypt(
		{ key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
		Buffer.from(dataBytes),
	);

	if (outputEncoding === 'hex') return bytesToHex(new Uint8Array(encrypted));
	return bytesToBase64(new Uint8Array(encrypted));
}

/**
 * RSA 私钥解密
 * @param encrypted - 加密后的字符串
 * @param options - 解密选项
 * @returns 原始字符串
 */
export function rsaDecrypt(encrypted: string, options: RsaDecryptOptions): string {
	const { privateKey, outputEncoding = 'base64' } = options;
	if (!privateKey) throw new TypeError('RSA: privateKey is required');

	const raw = outputEncoding === 'hex' ? hexToBytes(encrypted) : base64ToBytes(encrypted);
	const decrypted = crypto.privateDecrypt(
		{ key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
		Buffer.from(raw),
	);

	return Buffer.from(decrypted).toString('utf-8');
}
