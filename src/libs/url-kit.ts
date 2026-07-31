import type { AppendUrlOptions, FileInfo } from '@/types/index.ts';

/**
 * 解析 URL 查询参数，支持数组参数和嵌套对象参数
 * @param url - 要解析的 URL，如果不提供则使用当前页面的 URL（仅在浏览器环境下有效）
 * @returns 包含查询参数的对象
 */
export function getUrlParams<T = Record<string, any>>(url?: string): T {
	const isBrowser = typeof window !== 'undefined' && typeof window.location !== 'undefined';

	if (!url && !isBrowser) {
		throw new Error('URL must be provided in a non-browser environment.');
	}

	const queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	const params: Record<string, any> = {};

	if (!queryString) return params as T;

	queryString.split('&').forEach((param) => {
		const [rawKey, value] = param.split('=').map((part) => decodeURIComponent(part.replace(/\+/g, ' ')));
		if (!rawKey) return;

		const keys = rawKey.split(/[\[\]]/).filter((k) => k);
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
 * @param url - 要解析的 URL，如果不提供则使用当前页面的 URL
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
		const paramString = encodedValue ? `${paramName}=${encodedValue}` : paramName;
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
 * 将对象转换为 URL 查询字符串，支持嵌套对象
 * @param params - 要转换的对象
 * @returns 查询字符串
 */
export function transUrlParams<T extends Record<string, any>>(params: T): string {
	let result = '';

	for (const propName of Object.keys(params)) {
		const value = params[propName];
		const part = encodeURIComponent(propName) + '=';

		if (value !== null && value !== '' && typeof value !== 'undefined') {
			if (typeof value === 'object') {
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
export const getFileInfoToUrl = (url: string): FileInfo => {
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
