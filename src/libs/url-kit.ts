import type { AppendUrlOptions, FileInfo } from '@/types/index.ts';

function decodeSafe(str: string): string {
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}

/**
 * 解析 URL 查询参数，支持数组参数、嵌套对象参数，也支持裸查询字符串。
 * @param url - 要解析的 URL 或查询字符串（如 `'a=1&b=2'` / `'?a=1'`）。不提供时使用当前页面的 URL（仅在浏览器环境下有效）
 * @returns 包含查询参数的对象
 * @example
 * getUrlParams('https://example.com?id=1&name=John') // { id: '1', name: 'John' }
 * getUrlParams('a=1&b=2') // { a: '1', b: '2' }
 * getUrlParams('?a=1&a=2') // { a: ['1', '2'] }
 */
export function getUrlParams<T = Record<string, any>>(url?: string): T {
	const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';

	let queryString: string;

	if (url === undefined || url === '') {
		if (!isBrowser) {
			throw new Error('URL must be provided in a non-browser environment.');
		}
		queryString = window.location.search.replace(/^\?/, '');
	} else if (url.startsWith('?')) {
		// 裸查询字符串（带 ? 前缀）
		queryString = url.slice(1);
	} else if (/^[a-z][a-z0-9+.-]*:\/\//i.test(url) || url.startsWith('//') || url.startsWith('/') || !url.includes('=')) {
		// 完整 URL 形态（含协议/协议相对/绝对路径/无查询参数）：取 ? 后的查询部分
		const qIndex = url.indexOf('?');
		queryString = qIndex === -1 ? '' : url.slice(qIndex + 1);
	} else {
		// 裸查询字符串
		queryString = url;
	}

	const params: Record<string, any> = {};

	if (!queryString) return params as T;

	queryString.split('&').forEach((param) => {
		const eqIdx = param.indexOf('=');
		const rawKey = eqIdx === -1 ? param : param.slice(0, eqIdx);
		const rawValueStr = eqIdx === -1 ? '' : param.slice(eqIdx + 1).replace(/\+/g, ' ');
		if (!rawKey) return;

		const keys = rawKey.split(/[\[\]]/).filter((k) => k).map(decodeSafe);
		const value = decodeSafe(rawValueStr);
		let current: Record<string, any> = params;

		keys.forEach((key, index) => {
			if (index === keys.length - 1) {
				if (key in current) {
					if (!Array.isArray(current[key])) {
						current[key] = [current[key]];
					}
					current[key].push(value || '');
				} else {
					current[key] = value || '';
				}
			} else {
				if (!(key in current)) {
					current[key] = {};
				}
				current = current[key];
			}
		});
	});

	return params as T;
}

/**
 * 获取指定查询参数的值
 * @param url - 要解析的 URL 或查询字符串，如果不提供则使用当前页面的 URL
 * @param key - 查询参数的键
 * @returns 对应的参数值或 null
 */
export function getUrlParam<T = unknown>(url: string | undefined, key: string): T | null {
	const params = getUrlParams<Record<string, any>>(url);
	return key in params ? (params[key] as T) : null;
}

/**
 * 向 URL 追加查询字符串（处理 hash 拆分拼接逻辑）
 */
function appendQueryString(url: string, paramString: string, position: string): string {
	if (position === 'after') {
		const hashIndex = url.indexOf('#');
		if (hashIndex === -1) {
			const hasParams = url.includes('?');
			const separator = hasParams ? '&' : '?';
			return `${url}${separator}${paramString}`;
		}

		const baseUrl = url.substring(0, hashIndex);
		const hashFragment = url.substring(hashIndex);
		const hashQueryIndex = hashFragment.indexOf('?');
		const newHashFragment = hashQueryIndex !== -1 ? `${hashFragment}&${paramString}` : `${hashFragment}?${paramString}`;
		return `${baseUrl}${newHashFragment}`;
	}

	const hashIndex = url.indexOf('#');
	const baseWithoutHash = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
	const hash = hashIndex !== -1 ? url.substring(hashIndex) : '';
	const hasParams = baseWithoutHash.includes('?');
	const separator = hasParams ? '&' : '?';
	return `${baseWithoutHash}${separator}${paramString}${hash}`;
}

/**
 * 向 URL 添加参数
 * @param url - URL 地址
 * @param paramName - 参数名
 * @param paramValue - 参数值
 * @param options - 可选配置，position 为 'before' 时参数追加到 # 前面（默认 # 后）
 * @returns 新的 URL 或 null（如果参数无效）
 */
export function appendUrlParam<T = unknown>(url: string, paramName: string, paramValue?: T, options?: AppendUrlOptions): string | null {
	if (!url || !paramName) return null;

	try {
		const encodedValue = paramValue !== undefined ? encodeURIComponent(String(paramValue)) : '';
		const paramString = paramValue !== undefined ? `${paramName}=${encodedValue}` : paramName;
		const position = options?.position || 'after';

		return appendQueryString(url, paramString, position);
	} catch {
		return null;
	}
}

/**
 * 批量向 URL 添加查询参数，兼容 hash 和 history 模式
 * @param url - URL 地址
 * @param params - 参数键值对对象
 * @param options - 可选配置，position 为 'before' 时参数追加到 # 前面（默认 # 后）
 * @returns 新的 URL 字符串，如果 URL 无效则返回 null
 * @example
 * // 默认（参数在 # 后）
 * appendUrlParams('https://example.com', { name: 'zs', age: '1' })
 * // => 'https://example.com?name=zs&age=1'
 * @example
 * appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' })
 * // => 'https://example.com?id=1&name=zs&age=1'
 * @example
 * appendUrlParams('https://example.com/#/path', { name: 'zs' })
 * // => 'https://example.com/#/path?name=zs'
 * @example
 * // 参数在 # 前
 * appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' }, { position: 'before' })
 * // => 'https://example.com/?id=1&name=yyp#/home'
 */
export function appendUrlParams<T extends Record<string, any>>(url: string, params: T, options?: AppendUrlOptions): string | null {
	if (!url || !params || Object.keys(params).length === 0) return null;

	try {
		const paramString = Object.entries(params)
			.filter(([_, value]) => value !== null && value !== '' && typeof value !== 'undefined')
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
			.join('&');

		if (!paramString) return url;

		return appendQueryString(url, paramString, options?.position || 'after');
	} catch {
		return null;
	}
}

/**
 * 将对象转换为 URL 查询字符串，支持嵌套对象和数组（数组参数以 `key[index]` 形式输出）
 * @param params - 要转换的对象
 * @returns 查询字符串
 * @example
 * transUrlParams({ id: 1, name: 'John' }) // 'id=1&name=John'
 * transUrlParams({ a: [1, 2, 3] }) // 'a%5B0%5D=1&a%5B1%5D=2&a%5B2%5D=3'
 * transUrlParams({ user: { id: 1 } }) // 'user%5Bid%5D=1'
 */
export function transUrlParams<T extends Record<string, any>>(params: T): string {
	let result = '';

	for (const propName of Object.keys(params)) {
		const value = params[propName];
		const part = encodeURIComponent(propName) + '=';

		if (value !== null && value !== '' && typeof value !== 'undefined') {
			if (Array.isArray(value)) {
				// 数组参数：key[0]=value0&key[1]=value1
				value.forEach((item, index) => {
					if (item !== null && item !== '' && typeof item !== 'undefined') {
						const paramKey = `${propName}[${index}]`;
						result += encodeURIComponent(paramKey) + '=' + encodeURIComponent(String(item)) + '&';
					}
				});
			} else if (typeof value === 'object') {
				for (const key of Object.keys(value)) {
					const subValue = value[key];
					if (subValue !== null && subValue !== '' && typeof subValue !== 'undefined') {
						const paramKey = `${propName}[${key}]`;
						result += encodeURIComponent(paramKey) + '=' + encodeURIComponent(subValue) + '&';
					}
				}
			} else {
				result += part + encodeURIComponent(value) + '&';
			}
		}
	}

	if (result.endsWith('&')) {
		result = result.slice(0, -1);
	}

	return result;
}

/**
 * 从 URL 中提取文件名及后缀
 * @param url 文件 URL
 * @returns 文件信息
 * @example
 * ```js
 * getFileInfoFromUrl("https://example.com/path/to/file.txt")
 * // => { fileName: "file.txt", extension: ".txt" }
 * ```
 */
export const getFileInfoFromUrl = (url: string): FileInfo => {
	let fileName = 'unknown';

	try {
		const urlObj = new URL(url);
		const pathname = urlObj.pathname;
		fileName = decodeURIComponent(pathname.split('/').pop() || 'unknown');
	} catch {
		const parts = url.split('/');
		fileName = parts[parts.length - 1] || 'unknown';
	}

	// 提取后缀
	const lastDotIndex = fileName.lastIndexOf('.');
	let extension = '';
	if (lastDotIndex > 0 && lastDotIndex < fileName.length - 1) {
		extension = fileName.slice(lastDotIndex);
	}

	return { fileName, extension };
};
