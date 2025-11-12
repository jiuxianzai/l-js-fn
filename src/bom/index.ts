import { ScrollPosition } from '@/types';

/**
 * 平滑滚动到顶部
 */
export function scrollTop() {
	if (!document || !document.documentElement || !document.body) return;
	const c = document.documentElement.scrollTop || document.body.scrollTop;
	if (c > 0) {
		window.requestAnimationFrame(scrollTop);
		window.scrollTo(0, c - c / 8);
	}
}

/**
 * 滚动到底部
 */
export function scrollToBottom() {
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
 */
export async function copyToClipboard(text: string) {
	if (!text) return;
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(text);
		return true;
	} else {
		const input = document.createElement('textarea');
		input.value = text;
		document.body.appendChild(input);
		input.select();
		document.execCommand('copy');
		document.body.removeChild(input);
		return true;
	}
}
