/**
 * bom 单元测试
 * 测试浏览器对象模型方法
 */

import {
	scrollTop,
	scrollToBottom,
	getScrollPosition,
	setScrollPosition,
	launchFullscreen,
	exitFullscreen,
	copyToClipboard,
	setCookie,
	getCookie,
	removeCookie,
	getAllCookies,
	hasCookie,
} from '@/bom';

describe('bom - 浏览器对象模型方法', () => {
	// ==================== scrollTop 测试 ====================
	describe('scrollTop - 平滑滚动到顶部', () => {
		beforeEach(() => {
			// Mock document 和 window
			global.document = {
				documentElement: { scrollTop: 100 },
				body: { scrollTop: 100 },
			} as any;
			global.window = {
				requestAnimationFrame: jest.fn((cb) => setTimeout(cb, 0)),
				scrollTo: jest.fn(),
			} as any;
		});

		afterEach(() => {
			// 清理 mock
			jest.clearAllMocks();
		});

		it('应该在有滚动时调用 requestAnimationFrame 和 scrollTo', (done) => {
			scrollTop();

			setTimeout(() => {
				expect(window.requestAnimationFrame).toHaveBeenCalled();
				done();
			}, 50);
		});

		it('应该在滚动到顶部后停止', () => {
			global.document.documentElement.scrollTop = 0;
			global.document.body.scrollTop = 0;

			scrollTop();

			// 滚动为 0 时不应再调用 requestAnimationFrame
			expect(window.requestAnimationFrame).not.toHaveBeenCalled();
		});

		it('应该在缺少 document 时正常退出', () => {
			global.document = undefined as any;

			expect(() => scrollTop()).not.toThrow();
		});
	});

	// ==================== scrollToBottom 测试 ====================
	describe('scrollToBottom - 滚动到底部', () => {
		beforeEach(() => {
			global.window = {
				scrollTo: jest.fn(),
			} as any;
			global.document = {
				body: { scrollHeight: 1000 },
			} as any;
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('应该滚动到页面底部', () => {
			scrollToBottom();

			expect(window.scrollTo).toHaveBeenCalledWith(0, 1000);
		});

		it('应该在缺少 window 时正常退出', () => {
			global.window = undefined as any;

			expect(() => scrollToBottom()).not.toThrow();
		});
	});

	// ==================== getScrollPosition 测试 ====================
	describe('getScrollPosition - 获取滚动位置', () => {
		beforeEach(() => {
			global.window = {
				pageXOffset: 100,
				pageYOffset: 200,
			} as any;
			global.document = {
				documentElement: { scrollLeft: 100, scrollTop: 200 },
				body: { parentNode: { scrollLeft: 0, scrollTop: 0 } },
			} as any;
		});

		it('应该返回正确的滚动位置', () => {
			const position = getScrollPosition();

			expect(position).toEqual({ x: 100, y: 200 });
		});

		it('应该在服务端环境下返回默认值', () => {
			global.window = undefined as any;

			const position = getScrollPosition();

			expect(position).toEqual({ x: 0, y: 0 });
		});

		it('应该使用 documentElement 作为回退', () => {
			global.window = {} as any;
			global.document.documentElement.scrollLeft = 50;
			global.document.documentElement.scrollTop = 100;

			const position = getScrollPosition();

			expect(position).toEqual({ x: 50, y: 100 });
		});
	});

	// ==================== setScrollPosition 测试 ====================
	describe('setScrollPosition - 设置滚动位置', () => {
		beforeEach(() => {
			global.window = {
				pageXOffset: 0,
				pageYOffset: 0,
				scrollTo: jest.fn(),
			} as any;
			global.document = {
				documentElement: { style: { scrollBehavior: 'smooth' } },
			} as any;
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('应该设置滚动位置（不使用平滑滚动）', () => {
			setScrollPosition({ x: 100, y: 200 }, false);

			expect(window.scrollTo).toHaveBeenCalledWith({
				left: 100,
				top: 200,
				behavior: 'auto',
			});
		});

		it('应该使用平滑滚动', () => {
			setScrollPosition({ x: 100, y: 200 }, true);

			expect(window.scrollTo).toHaveBeenCalledWith({
				left: 100,
				top: 200,
				behavior: 'smooth',
			});
		});

		it('应该支持只设置 x 坐标', () => {
			global.window.pageYOffset = 100;
			setScrollPosition({ x: 50 });

			expect(window.scrollTo).toHaveBeenCalledWith({
				left: 50,
				top: 100,
				behavior: 'auto',
			});
		});

		it('应该支持只设置 y 坐标', () => {
			global.window.pageXOffset = 100;
			setScrollPosition({ y: 50 });

			expect(window.scrollTo).toHaveBeenCalledWith({
				left: 100,
				top: 50,
				behavior: 'auto',
			});
		});

		it('应该在服务端环境下正常退出', () => {
			global.window = undefined as any;

			expect(() => setScrollPosition({ x: 100, y: 200 })).not.toThrow();
		});

		it('应该在不支持 scrollBehavior 时使用回退方式', () => {
			global.document.documentElement.style = {} as any;

			setScrollPosition({ x: 100, y: 200 });

			expect(window.scrollTo).toHaveBeenCalledWith(100, 200);
		});
	});

	// ==================== launchFullscreen 测试 ====================
	describe('launchFullscreen - 进入全屏', () => {
		const mockElement = {
			requestFullscreen: jest.fn(() => Promise.resolve()),
		} as any;

		it('应该成功进入全屏（标准 API）', async () => {
			const result = await launchFullscreen(mockElement);

			expect(result).toBe(true);
			expect(mockElement.requestFullscreen).toHaveBeenCalled();
		});

		it('应该处理 Firefox 前缀 API', async () => {
			const element = {
				mozRequestFullScreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await launchFullscreen(element);

			expect(result).toBe(true);
		});

		it('应该处理 Webkit 前缀 API', async () => {
			const element = {
				webkitRequestFullscreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await launchFullscreen(element);

			expect(result).toBe(true);
		});

		it('应该处理 IE 前缀 API', async () => {
			const element = {
				msRequestFullscreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await launchFullscreen(element);

			expect(result).toBe(true);
		});

		it('应该在浏览器不支持时返回 false', async () => {
			const element = {} as any;

			const result = await launchFullscreen(element);

			expect(result).toBe(false);
		});

		it('应该处理错误情况', async () => {
			const element = {
				requestFullscreen: jest.fn(() => Promise.reject(new Error('Error'))),
			} as any;

			const result = await launchFullscreen(element);

			expect(result).toBe(false);
		});
	});

	// ==================== exitFullscreen 测试 ====================
	describe('exitFullscreen - 退出全屏', () => {
		beforeEach(() => {
			global.document = {
				exitFullscreen: jest.fn(() => Promise.resolve()),
			} as any;
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('应该成功退出全屏（标准 API）', async () => {
			const result = await exitFullscreen();

			expect(result).toBe(true);
			expect(document.exitFullscreen).toHaveBeenCalled();
		});

		it('应该处理 Firefox 前缀 API', async () => {
			global.document = {
				mozCancelFullScreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await exitFullscreen();

			expect(result).toBe(true);
		});

		it('应该处理 Webkit 前缀 API', async () => {
			global.document = {
				webkitExitFullscreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await exitFullscreen();

			expect(result).toBe(true);
		});

		it('应该处理 IE 前缀 API', async () => {
			global.document = {
				msExitFullscreen: jest.fn(() => Promise.resolve()),
			} as any;

			const result = await exitFullscreen();

			expect(result).toBe(true);
		});

		it('应该在浏览器不支持时返回 false', async () => {
			global.document = {} as any;

			const result = await exitFullscreen();

			expect(result).toBe(false);
		});

		it('应该处理错误情况', async () => {
			global.document = {
				exitFullscreen: jest.fn(() => Promise.reject(new Error('Error'))),
			} as any;

			const result = await exitFullscreen();

			expect(result).toBe(false);
		});
	});

	// ==================== copyToClipboard 测试 ====================
	describe('copyToClipboard - 复制到剪贴板', () => {
		beforeEach(() => {
			global.document = {
				createElement: jest.fn((tag) => {
					if (tag === 'textarea') {
						return {
							value: '',
							select: jest.fn(),
						} as any;
					}
					return {} as any;
				}),
				body: {
					appendChild: jest.fn(),
					removeChild: jest.fn(),
				},
				execCommand: jest.fn(() => true),
			} as any;
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('应该使用现代 Clipboard API', async () => {
			global.navigator = {
				clipboard: {
					writeText: jest.fn(() => Promise.resolve()),
				},
			} as any;

			const result = await copyToClipboard('test text');

			expect(result).toBe(true);
			expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
		});

		it('应该在缺少文本时正常退出', async () => {
			global.navigator = {
				clipboard: {
					writeText: jest.fn(() => Promise.resolve()),
				},
			} as any;

			const result = await copyToClipboard('');

			expect(result).toBe(false);
		});

		it('应该使用 execCommand 作为回退', async () => {
			global.navigator = {} as any;

			const textarea = {
				value: '',
				select: jest.fn(),
			};
			(document.createElement as jest.Mock).mockReturnValue(textarea);

			const result = await copyToClipboard('test text');

			expect(result).toBe(true);
			expect(textarea.value).toBe('test text');
			expect(textarea.select).toHaveBeenCalled();
			expect(document.execCommand).toHaveBeenCalledWith('copy');
		});

		it('应该清理临时 textarea 元素', async () => {
			global.navigator = {} as any;

			const textarea = {
				value: '',
				select: jest.fn(),
			};
			(document.createElement as jest.Mock).mockReturnValue(textarea);

			await copyToClipboard('test');

			expect(document.body.appendChild).toHaveBeenCalledWith(textarea);
			expect(document.body.removeChild).toHaveBeenCalledWith(textarea);
		});
	});

	// ==================== Cookie 测试 ====================
	describe('Cookie 操作', () => {
		beforeEach(() => {
			// Mock document.cookie
			let cookieStorage: Record<string, string> = {};

			Object.defineProperty(global.document, 'cookie', {
				get: () => {
					return Object.entries(cookieStorage)
						.map(([k, v]) => `${k}=${v}`)
						.join('; ');
				},
				set: (value: string) => {
					const [cookiePair] = value.split(';');
					const [key, val] = cookiePair.split('=');
					if (val && val !== 'Thu, 01 Jan 1970 00:00:00 GMT') {
						// 不是删除操作
						cookieStorage[key] = val;
					} else {
						// 删除操作
						delete cookieStorage[key];
					}
				},
				configurable: true,
			});

			// 清空存储
			cookieStorage = {};
		});

		it('应该设置 Cookie', () => {
			const result = setCookie('test', 'value');

			expect(result).toBe(true);
			expect(document.cookie).toContain('test=value');
		});

		it('应该获取 Cookie', () => {
			setCookie('test', 'value');

			const result = getCookie('test');

			expect(result).toBe('value');
		});

		it('应该在不存在的 Cookie 时返回 null', () => {
			const result = getCookie('notexist');

			expect(result).toBe(null);
		});

		it('应该删除 Cookie', () => {
			setCookie('test', 'value');
			expect(getCookie('test')).toBe('value');

			removeCookie('test');
			expect(getCookie('test')).toBe(null);
		});

		it('应该支持带路径删除 Cookie', () => {
			setCookie('test', 'value', { path: '/api' });

			const result = removeCookie('test', { path: '/api' });

			expect(result).toBe(true);
		});

		it('应该检查 Cookie 是否存在', () => {
			setCookie('test', 'value');

			expect(hasCookie('test')).toBe(true);
			expect(hasCookie('notexist')).toBe(false);
		});

		it('应该获取所有 Cookie', () => {
			setCookie('user', 'john');
			setCookie('token', 'abc123');

			const cookies = getAllCookies();

			expect(cookies).toEqual({
				user: 'john',
				token: 'abc123',
			});
		});

		it('应该处理特殊字符编码', () => {
			setCookie('test name', 'test value');

			const result = getCookie('test name');

			expect(result).toBe('test value');
		});

		it('应该在服务端环境下返回 false', () => {
			global.document = undefined as any;

			expect(setCookie('test', 'value')).toBe(false);
			expect(getCookie('test')).toBe(null);
			expect(removeCookie('test')).toBe(false);
			expect(getAllCookies()).toEqual({});
		});
	});
});
