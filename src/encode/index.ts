/**
 * 将字符串编码为 Base64
 * @param str - 要编码的字符串
 * @returns Base64 编码后的字符串
 * @example
 * base64Encode('Hello World') // 'SGVsbG8gV29ybGQ='
 * base64Encode('你好') // '5L2g5aW9'
 */
export function base64Encode(str: string): string {
	if (typeof str !== 'string') {
		throw new TypeError('base64Encode: 参数必须是字符串');
	}

	// 使用 TextEncoder 处理 Unicode 字符
	const encoder = new TextEncoder();
	const data = encoder.encode(str);
	const binaryString = Array.from(data, (byte) => String.fromCharCode(byte)).join('');
	return btoa(binaryString);
}

/**
 * 将 Base64 字符串解码
 * @param str - Base64 编码的字符串
 * @returns 解码后的原始字符串
 * @example
 * base64Decode('SGVsbG8gV29ybGQ=') // 'Hello World'
 * base64Decode('5L2g5aW9') // '你好'
 */
export function base64Decode(str: string): string {
	if (typeof str !== 'string') {
		throw new TypeError('base64Decode: 参数必须是字符串');
	}

	try {
		const binaryString = atob(str);
		const bytes = new Uint8Array(binaryString.length);
		for (let i = 0; i < binaryString.length; i++) {
			bytes[i] = binaryString.charCodeAt(i);
		}
		const decoder = new TextDecoder();
		return decoder.decode(bytes);
	} catch (error) {
		throw new Error('base64Decode: 无效的 Base64 字符串');
	}
}

/**
 * HTML 转义（防 XSS 攻击）
 * @param str - 要转义的字符串
 * @returns 转义后的字符串
 * @example
 * escapeHTML('<script>alert("XSS")</script>')
 * // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
 * escapeHTML('"Hello" & \'Goodbye\'') // '&quot;Hello&quot; &amp; &apos;Goodbye&apos;'
 */
export function escapeHTML(str: string): string {
	if (typeof str !== 'string') {
		throw new TypeError('escapeHTML: 参数必须是字符串');
	}

	const htmlEntities: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&apos;',
		'`': '&#96;',
		'/': '&#x2F;',
		'=': '&#x3D;',
	};

	return str.replace(/[&<>"'`=/]/g, (char) => htmlEntities[char] ?? char);
}

/**
 * HTML 反转义
 * @param str - 要反转义的字符串
 * @returns 反转义后的字符串
 * @example
 * unescapeHTML('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')
 * // '<script>alert("XSS")</script>'
 * unescapeHTML('&quot;Hello&quot; &amp; &apos;Goodbye&apos;')
 * // '"Hello" & \'Goodbye\''
 */
export function unescapeHTML(str: string): string {
	if (typeof str !== 'string') {
		throw new TypeError('unescapeHTML: 参数必须是字符串');
	}

	const htmlEntities: Record<string, string> = {
		'&amp;': '&',
		'&lt;': '<',
		'&gt;': '>',
		'&quot;': '"',
		'&apos;': "'",
		'&#96;': '`',
		'&#x2F;': '/',
		'&#x3D;': '=',
		'&#60;': '<',
		'&#62;': '>',
		'&#34;': '"',
		'&#39;': "'",
		'&#38;': '&',
	};

	return str.replace(
		/&(#?[\w\d]+;|amp;|lt;|gt;|quot;|apos;)/g,
		(entity) => htmlEntities[entity] ?? entity
	);
}

/**
 * URL 编码
 * @param str - 要编码的字符串
 * @param options - 配置选项
 * @returns URL 编码后的字符串
 * @example
 * urlEncode('Hello World!') // 'Hello%20World%21'
 * urlEncode('你好世界') // '%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C'
 */
export function urlEncode(
	str: string,
	options: { component?: boolean; uri?: boolean } = {}
): string {
	if (typeof str !== 'string') {
		throw new TypeError('urlEncode: 参数必须是字符串');
	}

	const { component = false, uri = false } = options;

	if (component) {
		// 编码 URL 组件（保留 / ? : @ & = + $ 等字符）
		return encodeURIComponent(str);
	}

	if (uri) {
		// 编码完整 URI（保留 : / ? # [ ] @ ! $ & \' ( ) * + , ; =）
		return encodeURI(str);
	}

	// 默认使用 encodeURIComponent
	return encodeURIComponent(str);
}

/**
 * URL 解码
 * @param str - 要解码的字符串
 * @param options - 配置选项
 * @returns URL 解码后的字符串
 * @example
 * urlDecode('Hello%20World%21') // 'Hello World!'
 * urlDecode('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C') // '你好世界'
 */
export function urlDecode(
	str: string,
	options: { component?: boolean } = {}
): string {
	if (typeof str !== 'string') {
		throw new TypeError('urlDecode: 参数必须是字符串');
	}

	const { component = false } = options;

	if (component) {
		return decodeURIComponent(str);
	}

	// 默认使用 decodeURI（与 encodeURI 对称，保留 : / ? # [ ] @ 等字符）
	return decodeURI(str);
}

/**
 * 将数据转换为 URL 查询字符串格式
 * @param data - 要转换的对象
 * @returns URL 查询字符串
 * @example
 * querystringify({ name: 'John', age: 20 }) // 'name=John&age=20'
 * querystringify({ a: [1, 2, 3] }) // 'a=1&a=2&a=3'
 */
export function querystringify(data: Record<string, any>): string {
	if (!data || typeof data !== 'object') {
		throw new TypeError('querystringify: 参数必须是对象');
	}

	const params: string[] = [];

	for (const key in data) {
		if (Object.prototype.hasOwnProperty.call(data, key)) {
			const value = data[key];

			if (value === null || value === undefined) {
				continue;
			}

			if (Array.isArray(value)) {
				// 数组参数：key=value1&key=value2
				value.forEach((item) => {
					params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
				});
			} else {
				params.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
			}
		}
	}

	return params.join('&');
}

/**
 * 解析 URL 查询字符串为对象
 * @param str - URL 查询字符串（可以包含或不包含开头的 ?）
 * @returns 解析后的对象
 * @example
 * parseQueryString('name=John&age=20') // { name: 'John', age: '20' }
 * parseQueryString('?a=1&b=2') // { a: '1', b: '2' }
 */
export function parseQueryString(str: string): Record<string, string | string[]> {
	if (typeof str !== 'string') {
		throw new TypeError('parseQueryString: 参数必须是字符串');
	}

	// 移除开头的 ?
	const queryString = str.startsWith('?') ? str.slice(1) : str;
	const result: Record<string, string | string[]> = {};

	if (!queryString) {
		return result;
	}

	queryString.split('&').forEach((pair) => {
		const [rawKey, rawValue] = pair.split('=');

		if (!rawKey) return;

		const key = decodeURIComponent(rawKey);
		const value = rawValue !== undefined ? decodeURIComponent(rawValue.replace(/\+/g, ' ')) : '';

		// 处理重复的 key（转为数组）
		if (key in result) {
			const existing = result[key];
			if (Array.isArray(existing)) {
				existing.push(value);
			} else {
				result[key] = [existing, value];
			}
		} else {
			result[key] = value;
		}
	});

	return result;
}
