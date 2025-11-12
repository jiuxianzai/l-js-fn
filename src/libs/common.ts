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

	return function (this: any, ...args: Parameters<T>) {
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

	return function (this: any, ...args: Parameters<T>) {
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
	const visited = new WeakMap<any, any>();

	const cloneHelper = (value: any): any => {
		if (visited.has(value)) return visited.get(value);

		if (value === null || typeof value !== 'object') {
			if (typeof value === 'function' && cloneFunctions) {
				return value.bind({});
			}
			return value;
		}

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

		const result: any = Array.isArray(value) ? [] : {};
		visited.set(value, result);

		const keys = Reflect.ownKeys(value);
		for (const key of keys) {
			result[key] = cloneHelper(value[key]);
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
			const valueHtml = syntaxHighlight((obj as any)[key], indent + 1);
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
 * 动态加载外部 js 文件
 * @param {string | null} src js文件路径
 * @returns {Promise<HTMLScriptElement>}
 */
export function loadScript(src: string | null): Promise<HTMLScriptElement> | undefined {
	if (!src) return;
	// 如果已经加载过，则直接返回
	const existing = document.querySelector(`script[src="${src}"]`);
	if (existing) {
		return;
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
 */
export function removeScript(src: string) {
	const script = document.querySelector(`script[src="${src}"]`);
	if (script && script.parentNode) {
		script.parentNode.removeChild(script);
	}
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
	if (typeof (globalThis as any).wx !== 'undefined' && typeof (globalThis as any).wx.getSystemInfo === 'function') {
		return 'miniProgram'; // 微信小程序
	}
	if (typeof (globalThis as any).my !== 'undefined' && typeof (globalThis as any).my.getSystemInfo === 'function') {
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
 */
export function imageToBase64(
	input: File | Blob | string | null,
	type: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/png',
	quality: number = 1
): Promise<Result> {
	return new Promise((resolve, reject) => {
		if (!input) return;
		if (input instanceof File || input instanceof Blob) {
			const reader = new FileReader();
			reader.onload = () => resolve(Result.ok(reader.result as string));
			reader.onerror = () => reject(Result.fail('读取文件失败'));
			reader.readAsDataURL(input);
			return;
		}

		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.src = input;
		img.onload = () => {
			try {
				const canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext('2d');
				if (!ctx) throw new Error('Canvas 不可用');
				ctx.drawImage(img, 0, 0);
				resolve(Result.ok(canvas.toDataURL(type, quality)));
			} catch (err) {
				reject(err);
			}
		};
		img.onerror = () => reject(Result.fail('图片加载失败'));
		return;
	});
}
