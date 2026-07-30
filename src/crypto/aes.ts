import crypto from 'crypto';
import { bytesToBase64, bytesToHex, hexToBytes, stringToBytes, bytesToString, concatBytes, base64ToBytes } from '@/crypto/utils';

const ALGORITHM_AES = 'aes-128-cbc';
const ALGORITHM_AES_ECB = 'aes-128-ecb';
const IV_LENGTH = 16;
const KEY_LENGTH = 16;
const PBKDF2_ITERATIONS = 10000;

export interface AesOptions {
	key: string;
	iv?: string;
	mode?: 'cbc' | 'ecb';
	salt?: string;
	iterations?: number;
	outputEncoding?: 'hex' | 'base64';
}

function deriveKey(key: string, salt: string, iterations: number): Buffer {
	return crypto.pbkdf2Sync(key, salt, iterations, KEY_LENGTH, 'sha256');
}

function getCipherKey(keyStr: string, salt?: string, iterations = PBKDF2_ITERATIONS): Buffer {
	if (salt) {
		return deriveKey(keyStr, salt, iterations);
	}
	const raw = stringToBytes(keyStr);
	const buf = Buffer.alloc(KEY_LENGTH);
	const len = Math.min(raw.length, KEY_LENGTH);
	for (let i = 0; i < len; i++) buf[i] = raw[i];
	return buf;
}

function getIv(ivStr?: string): Buffer {
	if (ivStr) {
		const bytes = hexToBytes(ivStr);
		if (bytes.length !== IV_LENGTH) {
			throw new TypeError(`IV must be ${IV_LENGTH} bytes (${IV_LENGTH * 2} hex characters)`);
		}
		return Buffer.from(bytes);
	}
	return crypto.randomBytes(IV_LENGTH);
}

/**
 * AES 加密
 * @param data - 待加密的字符串
 * @param options - 加密选项
 * @returns 加密结果字符串（CBC 模式未指定 IV 时，默认在密文前缀随机 IV）
 */
export function aesEncrypt(data: string, options: AesOptions): string {
	const { key, iv, mode = 'cbc', salt, iterations, outputEncoding = 'base64' } = options;
	if (!key) throw new TypeError('AES: key is required');

	const cipherKey = getCipherKey(key, salt, iterations);

	if (mode === 'ecb') {
		const cipher = crypto.createCipheriv(ALGORITHM_AES_ECB, cipherKey, Buffer.alloc(0));
		const dataBytes = stringToBytes(data);
		const encrypted = concatBytes(new Uint8Array(cipher.update(dataBytes)), new Uint8Array(cipher.final()));
		const output = outputEncoding === 'hex' ? bytesToHex(encrypted) : bytesToBase64(encrypted);
		return output;
	}

	const ivBuffer = getIv(iv);
	const cipher = crypto.createCipheriv(ALGORITHM_AES, cipherKey, ivBuffer);
	const dataBytes = stringToBytes(data);
	const encrypted = concatBytes(new Uint8Array(cipher.update(dataBytes)), new Uint8Array(cipher.final()));

	// IV 未显式指定时，将 IV 拼接到密文前缀
	if (!iv) {
		const combined = concatBytes(new Uint8Array(ivBuffer), encrypted);
		return outputEncoding === 'hex' ? bytesToHex(combined) : bytesToBase64(combined);
	}

	return outputEncoding === 'hex' ? bytesToHex(encrypted) : bytesToBase64(encrypted);
}

/**
 * AES 解密
 * @param encrypted - 加密后的字符串
 * @param options - 解密选项（需与加密时保持一致）
 * @returns 原始字符串
 */
export function aesDecrypt(encrypted: string, options: AesOptions): string {
	const { key, iv, mode = 'cbc', salt, iterations, outputEncoding = 'base64' } = options;
	if (!key) throw new TypeError('AES: key is required');

	const cipherKey = getCipherKey(key, salt, iterations);
	const raw = outputEncoding === 'hex' ? hexToBytes(encrypted) : base64ToBytes(encrypted);

	if (mode === 'ecb') {
		const decipher = crypto.createDecipheriv(ALGORITHM_AES_ECB, cipherKey, Buffer.alloc(0));
		const decrypted = concatBytes(new Uint8Array(decipher.update(raw)), new Uint8Array(decipher.final()));
		return bytesToString(decrypted);
	}

	let ivBuffer: Buffer;
	let encryptedData: Uint8Array;

	if (iv) {
		ivBuffer = Buffer.from(hexToBytes(iv));
		encryptedData = raw;
	} else {
		ivBuffer = Buffer.from(raw.slice(0, IV_LENGTH));
		encryptedData = raw.slice(IV_LENGTH);
	}

	const decipher = crypto.createDecipheriv(ALGORITHM_AES, cipherKey, ivBuffer);
	const decrypted = concatBytes(new Uint8Array(decipher.update(encryptedData)), new Uint8Array(decipher.final()));
	return bytesToString(decrypted);
}
