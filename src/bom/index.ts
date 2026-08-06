import { type ScrollPosition, type CookieOptions } from '@/types';

/**
 * 平滑滚动到顶部
 * @returns {void}
 */
export function scrollTop(): void {
	if (!document || !document.documentElement || !document.body) return;
	const c = document.documentElement.scrollTop || document.body.scrollTop;
	if (c > 0) {
		window.requestAnimationFrame(scrollTop);
		window.scrollTo(0, c - c / 8);
	}
}

/**
 * 滚动到底部
 * @returns {void}
 */
export function scrollToBottom(): void {
	if (!window || !document.body) return;
	window.scrollTo(0, document.body.scrollHeight);
}

/**
 * 获取当前页面滚动位置
 * @returns 当前滚动位置 { x, y }
 */
export function getScrollPosition(): ScrollPosition {
	if (typeof window === 'undefined') {
		return { x: 0, y: 0 };
	}

	const x =
		window.pageXOffset !== undefined ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft || 0;

	const y =
		window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop || 0;

	return { x, y };
}

/**
 * 设置页面滚动位置
 * @param position 目标滚动位置
 * @param smooth 是否平滑滚动（默认 false）
 */
export function setScrollPosition(position: Partial<ScrollPosition>, smooth: boolean = false): void {
	if (typeof window === 'undefined') return;

	const { x = window.pageXOffset, y = window.pageYOffset } = position;

	if ('scrollBehavior' in document.documentElement.style) {
		// 现代浏览器支持 smooth 滚动
		window.scrollTo({
			left: x,
			top: y,
			behavior: smooth ? 'smooth' : 'auto',
		});
	} else {
		// 兼容旧浏览器
		window.scrollTo(x, y);
	}
}

/**
 * 进入全屏
 * @param element 需要进入全屏的元素
 * @returns 是否成功进入全屏
 */
export async function launchFullscreen(element: HTMLElement): Promise<boolean> {
	const anyElement = element as HTMLElement & {
		mozRequestFullScreen?: () => Promise<void> | void;
		webkitRequestFullscreen?: () => Promise<void> | void;
		msRequestFullscreen?: () => Promise<void> | void;
	};

	try {
		if (anyElement.requestFullscreen) {
			await anyElement.requestFullscreen();
		} else if (anyElement.mozRequestFullScreen) {
			await anyElement.mozRequestFullScreen();
		} else if (anyElement.webkitRequestFullscreen) {
			await anyElement.webkitRequestFullscreen();
		} else if (anyElement.msRequestFullscreen) {
			await anyElement.msRequestFullscreen();
		} else {
			console.warn('当前浏览器不支持全屏 API。');
			return false;
		}
		return true;
	} catch (err) {
		console.error('进入全屏失败：', err);
		return false;
	}
}

/**
 * 退出全屏
 * @returns 是否成功退出全屏
 */
export async function exitFullscreen(): Promise<boolean> {
	const doc = document as Document & {
		mozCancelFullScreen?: () => Promise<void> | void;
		webkitExitFullscreen?: () => Promise<void> | void;
		msExitFullscreen?: () => Promise<void> | void;
	};

	try {
		if (doc.exitFullscreen) {
			await doc.exitFullscreen();
		} else if (doc.mozCancelFullScreen) {
			await doc.mozCancelFullScreen();
		} else if (doc.webkitExitFullscreen) {
			await doc.webkitExitFullscreen();
		} else if (doc.msExitFullscreen) {
			await doc.msExitFullscreen();
		} else {
			console.warn('当前浏览器不支持退出全屏 API。');
			return false;
		}
		return true;
	} catch (err) {
		console.error('退出全屏失败：', err);
		return false;
	}
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否复制成功
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	if (!text) return false;
	if (navigator.clipboard) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return false;
		}
	} else {
		const input = document.createElement('textarea');
		input.value = text;
		document.body.appendChild(input);
		input.select();
		const success = document.execCommand('copy');
		document.body.removeChild(input);
		return success;
	}
}

/**
 * 设置 Cookie
 * @param name Cookie 名称
 * @param value Cookie 值
 * @param options 配置选项
 * @example
 * setCookie('token', 'abc123', { expires: 30, secure: true })
 * setCookie('user', 'john', { expires: 7, path: '/' })
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): boolean {
	if (typeof document === 'undefined') {
		console.warn('setCookie: 当前环境不支持 Cookie');
		return false;
	}

	const { expires = 7, path = '/', domain, secure, httpOnly = false, sameSite = 'lax' } = options;

	let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

	// 过期时间
	if (expires) {
		const date = new Date();
		date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
		cookie += `; expires=${date.toUTCString()}`;
	}

	// 路径
	if (path) {
		cookie += `; path=${path}`;
	}

	// 域名
	if (domain) {
		cookie += `; domain=${domain}`;
	}

	// 仅 HTTPS
	if (secure) {
		cookie += '; secure';
	}

	// 注意：httpOnly 只能由服务端设置，客户端设置无效
	if (httpOnly) {
		console.warn('setCookie: httpOnly 只能由服务端设置，客户端设置无效');
	}

	// SameSite
	if (sameSite) {
		cookie += `; samesite=${sameSite}`;
	}

	document.cookie = cookie;
	return true;
}

/**
 * 获取 Cookie
 * @param name Cookie 名称
 * @returns Cookie 值，不存在返回 null
 * @example
 * getCookie('token') // 'abc123'
 * getCookie('notexist') // null
 */
export function getCookie(name: string): string | null {
	if (typeof document === 'undefined') {
		console.warn('getCookie: 当前环境不支持 Cookie');
		return null;
	}

	const encodedName = `${encodeURIComponent(name)}=`;
	const cookies = document.cookie.split(';');

	for (const cookie of cookies) {
		let trimmedCookie = cookie;
		while (trimmedCookie.charAt(0) === ' ') {
			trimmedCookie = trimmedCookie.slice(1);
		}

		if (trimmedCookie.indexOf(encodedName) === 0) {
			return decodeURIComponent(trimmedCookie.slice(encodedName.length));
		}
	}

	return null;
}

/**
 * 删除 Cookie
 * @param name Cookie 名称
 * @param options 配置选项（需与设置时保持一致的 path 和 domain）
 * @example
 * removeCookie('token')
 * removeCookie('user', { path: '/', domain: '.example.com' })
 */
export function removeCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): boolean {
	if (typeof document === 'undefined') {
		console.warn('removeCookie: 当前环境不支持 Cookie');
		return false;
	}

	const { path = '/', domain } = options;

	let cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

	if (path) {
		cookie += `; path=${path}`;
	}

	if (domain) {
		cookie += `; domain=${domain}`;
	}

	document.cookie = cookie;
	return true;
}

/**
 * 获取所有 Cookie
 * @returns 键值对对象
 * @example
 * getAllCookies() // { token: 'abc123', user: 'john' }
 */
export function getAllCookies(): Record<string, string> {
	if (typeof document === 'undefined') {
		console.warn('getAllCookies: 当前环境不支持 Cookie');
		return {};
	}

	const cookies: Record<string, string> = {};
	const cookieStrings = document.cookie.split(';');

	for (const cookie of cookieStrings) {
		const [key, ...valueParts] = cookie.split('=');
		if (key) {
			const trimmedKey = key.trim();
			cookies[decodeURIComponent(trimmedKey)] = decodeURIComponent(valueParts.join('='));
		}
	}

	return cookies;
}

/**
 * 检查 Cookie 是否存在
 * @param name Cookie 名称
 * @returns 是否存在
 * @example
 * hasCookie('token') // true
 */
export function hasCookie(name: string): boolean {
	return getCookie(name) !== null;
}
