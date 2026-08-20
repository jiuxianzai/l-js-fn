const HEX_CHARS = '0123456789abcdef';

export function bytesToHex(bytes: Uint8Array): string {
	let hex = '';
	for (let i = 0; i < bytes.length; i++) {
		hex += HEX_CHARS[(bytes[i] >>> 4) & 0xf] + HEX_CHARS[bytes[i] & 0xf];
	}
	return hex;
}

export function hexToBytes(hex: string): Uint8Array {
	const len = hex.length;
	if (len % 2 !== 0) {
		throw new TypeError('Invalid hex string: length must be even');
	}
	const bytes = new Uint8Array(len / 2);
	for (let i = 0; i < len; i += 2) {
		const byte = parseInt(hex.substring(i, i + 2), 16);
		if (isNaN(byte)) {
			throw new TypeError(`Invalid hex string: unexpected character at position ${i}`);
		}
		bytes[i / 2] = byte;
	}
	return bytes;
}

export function stringToBytes(str: string): Uint8Array {
	const encoder = new TextEncoder();
	return encoder.encode(str);
}

export function bytesToString(bytes: Uint8Array): string {
	const decoder = new TextDecoder();
	return decoder.decode(bytes);
}

/**
 * UTF-8 字符串转十六进制字符串（与 CryptoJS.enc.Utf8.parse(str).toString() 行为一致）
 * 不依赖 TextEncoder，兼容小程序等无 TextEncoder 的环境
 * @param str - 待转换的 UTF-8 字符串
 * @returns 十六进制字符串
 * @example
 * utf8ToHex('你好'); // 'e4bda0e5a5bd'
 */
export function utf8ToHex(str: string): string {
	let hex = '';
	for (const ch of str) {
		const code = ch.codePointAt(0) as number;
		if (code < 0x80) {
			hex += code.toString(16).padStart(2, '0');
		} else if (code < 0x800) {
			hex += ((code >> 6) | 0xc0).toString(16).padStart(2, '0') + ((code & 0x3f) | 0x80).toString(16).padStart(2, '0');
		} else if (code < 0x10000) {
			hex +=
				((code >> 12) | 0xe0).toString(16).padStart(2, '0') +
				(((code >> 6) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
				((code & 0x3f) | 0x80).toString(16).padStart(2, '0');
		} else {
			hex +=
				((code >> 18) | 0xf0).toString(16).padStart(2, '0') +
				(((code >> 12) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
				(((code >> 6) & 0x3f) | 0x80).toString(16).padStart(2, '0') +
				((code & 0x3f) | 0x80).toString(16).padStart(2, '0');
		}
	}
	return hex;
}

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const BASE64_LOOKUP = (() => {
	const lookup = new Int8Array(128).fill(-1);
	for (let i = 0; i < BASE64_CHARS.length; i++) {
		lookup[BASE64_CHARS.charCodeAt(i)] = i;
	}
	return lookup;
})();

export function base64ToBytes(base64: string): Uint8Array {
	const clean = base64.replace(/=+$/, '').replace(/[^A-Za-z0-9+/]/g, '');
	const length = clean.length;
	const bytes = new Uint8Array((length * 3) / 4);
	let buffer = 0;
	let bits = 0;
	let out = 0;
	for (let i = 0; i < length; i++) {
		const value = BASE64_LOOKUP[clean.charCodeAt(i)];
		if (value < 0) {
			throw new TypeError(`Invalid base64 string: unexpected character at position ${i}`);
		}
		buffer = (buffer << 6) | value;
		bits += 6;
		if (bits >= 8) {
			bits -= 8;
			bytes[out++] = (buffer >> bits) & 0xff;
		}
	}
	return bytes.slice(0, out);
}

export function bytesToBase64(bytes: Uint8Array): string {
	let result = '';
	let buffer = 0;
	let bits = 0;
	for (let i = 0; i < bytes.length; i++) {
		buffer = (buffer << 8) | bytes[i];
		bits += 8;
		while (bits >= 6) {
			bits -= 6;
			result += BASE64_CHARS[(buffer >> bits) & 0x3f];
		}
	}
	if (bits > 0) {
		result += BASE64_CHARS[(buffer << (6 - bits)) & 0x3f];
	}
	while (result.length % 4 !== 0) {
		result += '=';
	}
	return result;
}

export function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
	const result = new Uint8Array(a.length + b.length);
	result.set(a, 0);
	result.set(b, a.length);
	return result;
}
