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

export function base64ToBytes(base64: string): Uint8Array {
	const binaryStr = typeof atob === 'function' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
	const bytes = new Uint8Array(binaryStr.length);
	for (let i = 0; i < binaryStr.length; i++) {
		bytes[i] = binaryStr.charCodeAt(i);
	}
	return bytes;
}

export function bytesToBase64(bytes: Uint8Array): string {
	if (typeof Buffer !== 'undefined') {
		return Buffer.from(bytes).toString('base64');
	}
	const binaryStr = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
	return typeof btoa === 'function' ? btoa(binaryStr) : '';
}

export function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
	const result = new Uint8Array(a.length + b.length);
	result.set(a, 0);
	result.set(b, a.length);
	return result;
}
