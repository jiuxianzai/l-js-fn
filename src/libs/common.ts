import { Result } from '@/utils/Result.ts';

/**
 * 睡眠函数
 * @param time - 睡眠时间，毫秒
 * @returns Promise<void>
 */
export function sleep(time: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 创建防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @param immediate - 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait = 300, immediate = false): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout> | null;

	return function (this: unknown, ...args: Parameters<T>) {
		const context = this;
		const later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		const callNow = immediate && !timeout;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

/**
 * 创建节流函数
 * @param func - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait = 300): (...args: Parameters<T>) => void {
	let lastTime = 0;

	return function (this: unknown, ...args: Parameters<T>) {
		const now = Date.now();
		if (now - lastTime >= wait) {
			func.apply(this, args);
			lastTime = now;
		}
	};
}

/**
 * 获取参数的详细类型
 * @param value - 要检查类型的值
 * @returns 类型字符串
 */
export function getType<T>(value: T): string {
	if (value === null) return 'null';
	if (value === undefined) return 'undefined';
	if (Array.isArray(value)) return 'array';
	if (value instanceof Date) return 'date';
	if (value instanceof RegExp) return 'regexp';
	if (typeof value === 'function') return 'function';
	if (typeof value === 'string') return 'string';
	if (typeof value === 'number') return 'number';
	if (typeof value === 'object') {
		if (value.constructor === Object) return 'object';
		return (value.constructor.name || '').toLowerCase();
	}
	return typeof value;
}

/**
 * 深拷贝函数，支持循环引用
 * @param obj - 要深拷贝的对象
 * @param options - 配置选项
 * @param options.cloneFunctions - 是否克隆函数
 * @param options.cloneSpecialObjects - 是否克隆特殊对象（如 DOM 节点）
 */
export function deepClone<T>(obj: T, options?: { cloneFunctions?: boolean; cloneSpecialObjects?: boolean }): T {
	const { cloneFunctions = false, cloneSpecialObjects = false } = options || {};
	const visited = new WeakMap<object, object>();

	const cloneHelper = (value: unknown): unknown => {
		if (value === null || typeof value !== 'object') {
			if (typeof value === 'function' && cloneFunctions) {
				return (value as Function).bind({});
			}
			return value;
		}

		if (visited.has(value)) return visited.get(value);

		if (value instanceof Date) return new Date(value.getTime());
		if (value instanceof RegExp) return new RegExp(value);

		if (value instanceof Map) {
			const result = new Map();
			visited.set(value, result);
			value.forEach((val, key) => {
				result.set(cloneHelper(key), cloneHelper(val));
			});
			return result;
		}

		if (value instanceof Set) {
			const result = new Set();
			visited.set(value, result);
			value.forEach((val) => result.add(cloneHelper(val)));
			return result;
		}

		if (cloneSpecialObjects && typeof Node !== 'undefined' && value instanceof Node) {
			return value.cloneNode(true);
		}

		const result: Record<string, unknown> | unknown[] = Array.isArray(value) ? [] : {};
		visited.set(value, result);

		const keys = Reflect.ownKeys(value);
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i] as string;
			const val = (value as Record<string, unknown>)[key];
			(result as Record<string, unknown>)[key] = cloneHelper(val);
		}

		return result;
	};

	return cloneHelper(obj) as T;
}

/**
 * 将 JavaScript 对象格式化为带 HTML 颜色高亮的字符串（保留缩进结构）。
 * 主要用于在 Vue/HTML 页面中以美观、结构化方式展示 JSON 数据。
 *
 * @param obj - 需要格式化的 JavaScript 对象或数组
 * @param indent - 当前缩进层级（默认从 0 开始，递归使用）
 * @returns 返回已 HTML 格式化并高亮的字符串（可直接赋值给 `v-html` 渲染）
 */
export function syntaxHighlight<T>(obj: T, indent: number = 0): string {
	const indentStr = '&nbsp;&nbsp;'.repeat(indent);
	const nextIndentStr = '&nbsp;&nbsp;'.repeat(indent + 1);
	let html = '';

	if (Array.isArray(obj)) {
		html += '[<br>';
		obj.forEach((item, i) => {
			html += nextIndentStr + syntaxHighlight(item, indent + 1);
			if (i < obj.length - 1) html += ',';
			html += '<br>';
		});
		html += indentStr + ']';
	} else if (obj !== null && typeof obj === 'object') {
		html += '{<br>';
		const keys = Object.keys(obj) as (keyof T)[];
		keys.forEach((key, index) => {
			const keyHtml = `<span style="color: #b58900">"${String(key)}"</span>`;
			const valueHtml = syntaxHighlight((obj as Record<string, unknown>)[key as string], indent + 1);
			html += `${nextIndentStr}${keyHtml}: ${valueHtml}`;
			if (index < keys.length - 1) html += ',';
			html += '<br>';
		});
		html += indentStr + '}';
	} else if (typeof obj === 'string') {
		html += `<span style="color: #2aa198">"${obj}"</span>`;
	} else if (typeof obj === 'number') {
		html += `<span style="color: #6c71c4">${obj}</span>`;
	} else if (typeof obj === 'boolean') {
		html += `<span style="color: #6c71c4">${obj}</span>`;
	} else if (obj === null) {
		html += `<span style="color: #6c71c4">null</span>`;
	}

	return html;
}

/**
 * 将带语法高亮的 HTML 转换为 JSON 对象或纯字符串
 * 成功解析 JSON ⇒ 返回 object/array
 * 解析失败 ⇒ 返回未解析的字符串（继续编辑用）
 */
export function syntaxHtmlToJson(html: string): Record<string, unknown> | unknown[] | string {
	const jsonString = html
		.replace(/<span[^>]*>/g, '')
		.replace(/<\/span>/g, '')
		.replace(/<\/?pre>/g, '')
		.replace(/<br\s*\/?>/gi, '\n')
		.replace(/&nbsp;/g, ' ')
		.trim();

	try {
		return JSON.parse(jsonString);
	} catch (_) {
		return jsonString;
	}
}


/**
 * 动态加载外部 js 文件
 * @param {string | null} src js文件路径
 * @returns {Promise<HTMLScriptElement>}
 */
export function loadScript(src: string | null): Promise<HTMLScriptElement> {
	if (!src) return Promise.reject(new Error('src 不能为空'));
	// 如果已经加载过，则直接返回已存在的 script 元素
	const existing = document.querySelector(`script[src="${src}"]`);
	if (existing) {
		return Promise.resolve(existing as HTMLScriptElement);
	}
	return new Promise((resolve, reject) => {
		// 创建 script 元素
		const script = document.createElement('script');
		script.src = src;
		script.async = true;
		script.onload = () => resolve(script);
		script.onerror = (err) => reject(err);
		document.head.appendChild(script);
	});
}

/**
 * 移除已加载的 js 文件
 * @param {string} src js文件路径
 * @returns {void}
 */
export function removeScript(src: string): void {
	const script = document.querySelector(`script[src="${src}"]`);
	if (script && script.parentNode) {
		script.parentNode.removeChild(script);
	}
}

interface MiniProgramGlobal {
	wx?: { getSystemInfo?: (...args: unknown[]) => unknown };
	my?: { getSystemInfo?: (...args: unknown[]) => unknown };
}

/**
 * 获取设备类型
 * @returns 设备类型
 */
export const getDevice = ():
	| 'miniProgram'
	| 'alipayMiniProgram'
	| 'alipay'
	| 'wechat'
	| 'android'
	| 'ios'
	| 'harmony'
	| 'windows'
	| 'macos'
	| 'linux'
	| 'unknown' => {
	const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
	const lowerUA = ua.toLowerCase();

	// 小程序环境
	if (typeof (globalThis as MiniProgramGlobal).wx !== 'undefined' && typeof (globalThis as MiniProgramGlobal).wx!.getSystemInfo === 'function') {
		return 'miniProgram'; // 微信小程序
	}
	if (typeof (globalThis as MiniProgramGlobal).my !== 'undefined' && typeof (globalThis as MiniProgramGlobal).my!.getSystemInfo === 'function') {
		return 'alipayMiniProgram'; // 支付宝小程序
	}

	// 浏览器内置环境
	if (/micromessenger/.test(lowerUA)) return 'wechat'; // 微信浏览器
	if (/alipayclient/.test(lowerUA)) return 'alipay'; // 支付宝浏览器

	// 手机系统
	if (/android|adr/.test(lowerUA)) return 'android';
	if (/iphone|ipad|ipod/.test(lowerUA)) return 'ios';
	if (/harmonyos/.test(lowerUA)) return 'harmony';

	// 桌面系统
	if (/windows/.test(lowerUA)) return 'windows';
	if (/macintosh/.test(lowerUA)) return 'macos';
	if (/linux/.test(lowerUA)) return 'linux';

	return 'unknown';
};

/**
 * 图片转 Base64
 * @param input 图片 URL 或 File/Blob
 * @param type 输出类型，默认 image/png
 * @param quality 压缩质量 (0-1，仅对 jpeg/webp 有效)
 * @returns {Promise<Result<string>>} Base64 数据字符串
 */
export function imageToBase64(
	input: File | Blob | string | null,
	type: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
	quality: number = 1
): Promise<Result<string>> {
	return new Promise((resolve, reject) => {
		if (!input) {
			resolve(Result.fail('输入不能为空'));
			return;
		}
		if (input instanceof File || input instanceof Blob) {
			const reader = new FileReader();
			reader.onload = () => resolve(Result.ok(typeof reader.result === 'string' ? reader.result : ''));
			reader.onerror = () => reject(Result.fail('读取文件失败'));
			reader.readAsDataURL(input);
			return;
		}

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = input;
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				reject(Result.fail('Canvas 不可用'));
				return;
			}
			ctx.drawImage(img, 0, 0);
			resolve(Result.ok(canvas.toDataURL(type, quality)));
		};
		img.onerror = () => reject(Result.fail('图片加载失败'));
		return;
	});
}

/**
 * 异步函数失败重试
 * @param fn - 需要重试的异步函数
 * @param options - 配置项
 * @param options.times - 最大重试次数，默认 3
 * @param options.delay - 每次重试间隔（毫秒），默认 1000
 * @returns 包装后的函数，返回 Promise
 * @example
 * const fn = retry(async () => fetch('/api'), { times: 3, delay: 1000 })
 * fn().then(res => console.log(res))
 */
export function retry<T extends (...args: any[]) => Promise<any>>(
	fn: T,
	options: { times?: number; delay?: number } = {}
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
	const { times = 3, delay = 1000 } = options;

	return async function (...args: Parameters<T>): Promise<ReturnType<T>> {
		let lastError: unknown;

		for (let i = 0; i <= times; i++) {
			try {
				return await fn(...args);
			} catch (error) {
				lastError = error;
				if (i < times) {
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		}

		throw lastError;
	};
}

/**
 * 包装函数使其只执行一次，多次调用返回首次执行的结果
 * @param fn - 需要包装的函数
 * @returns 包装后的函数
 * @example
 * const init = once(() => console.log('init'))
 * init() // 输出 'init'
 * init() // 无输出
 */
export function once<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T> {
	let called = false;
	let result: ReturnType<T>;

	return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
		if (!called) {
			called = true;
			result = fn.apply(this, args);
		}
		return result;
	};
}

/**
 * 缓存函数计算结果，相同参数只计算一次（基于 Map 缓存）
 * @param fn - 需要缓存结果的函数
 * @param maxSize - 最大缓存条目数，默认 200，设为 0 则不限制
 * @returns 包装后的缓存函数
 * @example
 * const add = memoize((a: number, b: number) => { console.log('calling'); return a + b })
 * add(1, 2) // 输出 calling → 3
 * add(1, 2) // 直接返回 3（无输出）
 */
export function memoize<T extends (...args: any[]) => any>(fn: T, maxSize: number = 200): (...args: Parameters<T>) => ReturnType<T> {
	const cache = new Map<string, ReturnType<T>>();
	const keys: string[] = [];

	return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
		let key: string;
		try {
			key = JSON.stringify(args);
		} catch {
			return fn.apply(this, args);
		}

		if (cache.has(key)) return cache.get(key)!;

		const result = fn.apply(this, args);
		cache.set(key, result);
		keys.push(key);

		if (maxSize > 0 && keys.length > maxSize) {
			const oldest = keys.shift()!;
			cache.delete(oldest);
		}

		return result;
	};
}
