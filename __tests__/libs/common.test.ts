/**
 * common 单元测试
 * 测试通用工具方法
 */

import {
	sleep,
	debounce,
	throttle,
	getType,
	deepClone,
	syntaxHighlight,
	syntaxHtmlToJson,
	getDevice,
	retry,
	once,
	memoize,
} from '@/libs/common';

describe('common - 通用工具方法', () => {
	// ==================== sleep 测试 ====================
	describe('sleep - 睡眠函数', () => {
		it('应该在指定时间后 resolve', async () => {
			const start = Date.now();
			await sleep(100);
			const end = Date.now();
			expect(end - start).toBeGreaterThanOrEqual(100);
		});

		it('应该支持不同的时间参数', async () => {
			const start = Date.now();
			await sleep(50);
			const end = Date.now();
			expect(end - start).toBeGreaterThanOrEqual(50);
		});

		it('应该返回 void', async () => {
			const result = await sleep(10);
			expect(result).toBe(undefined);
		});
	});

	// ==================== debounce 测试 ====================
	describe('debounce - 防抖函数', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('应该在等待时间内只执行一次', () => {
			const fn = jest.fn();
			const debouncedFn = debounce(fn, 300);

			debouncedFn();
			debouncedFn();
			debouncedFn();

			jest.advanceTimersByTime(300);

			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('应该支持立即执行模式', () => {
			const fn = jest.fn();
			const debouncedFn = debounce(fn, 300, true);

			debouncedFn();

			expect(fn).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(300);

			debouncedFn();
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it('应该重置计时器', () => {
			const fn = jest.fn();
			const debouncedFn = debounce(fn, 300);

			debouncedFn();
			jest.advanceTimersByTime(200);

			debouncedFn();
			jest.advanceTimersByTime(200);

			expect(fn).not.toHaveBeenCalled();

			jest.advanceTimersByTime(100);
			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('应该传递正确的参数和上下文', () => {
			const fn = jest.fn();
			const debouncedFn = debounce(fn, 300);
			const context = { value: 'test' };

			debouncedFn.call(context, 'arg1', 'arg2');
			jest.advanceTimersByTime(300);

			expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
		});
	});

	// ==================== throttle 测试 ====================
	describe('throttle - 节流函数', () => {
		beforeEach(() => {
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.runOnlyPendingTimers();
			jest.useRealTimers();
		});

		it('应该在指定时间间隔内最多执行一次', () => {
			const fn = jest.fn();
			const throttledFn = throttle(fn, 300);

			throttledFn();
			throttledFn();
			throttledFn();

			expect(fn).toHaveBeenCalledTimes(1);
		});

		it('应该在等待时间后允许再次执行', () => {
			const fn = jest.fn();
			const throttledFn = throttle(fn, 300);

			throttledFn();
			expect(fn).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(300);

			throttledFn();
			expect(fn).toHaveBeenCalledTimes(2);
		});

		it('应该传递正确的参数和上下文', () => {
			const fn = jest.fn();
			const throttledFn = throttle(fn, 300);
			const context = { value: 'test' };

			throttledFn.call(context, 'arg1', 'arg2');

			expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
		});

		it('应该在间隔期内忽略调用', () => {
			const fn = jest.fn();
			const throttledFn = throttle(fn, 300);

			throttledFn();
			jest.advanceTimersByTime(100);
			throttledFn();
			jest.advanceTimersByTime(100);
			throttledFn();

			expect(fn).toHaveBeenCalledTimes(1);
		});
	});

	// ==================== getType 测试 ====================
	describe('getType - 获取详细类型', () => {
		it('应该正确识别基本类型', () => {
			expect(getType('string')).toBe('string');
			expect(getType(123)).toBe('number');
			expect(getType(true)).toBe('boolean');
			expect(getType(false)).toBe('boolean');
		});

		it('应该正确识别 null 和 undefined', () => {
			expect(getType(null)).toBe('null');
			expect(getType(undefined)).toBe('undefined');
		});

		it('应该正确识别数组', () => {
			expect(getType([])).toBe('array');
			expect(getType([1, 2, 3])).toBe('array');
			expect(getType(new Array())).toBe('array');
		});

		it('应该正确识别对象', () => {
			expect(getType({})).toBe('object');
			expect(getType({ a: 1 })).toBe('object');
		});

		it('应该正确识别 Date', () => {
			expect(getType(new Date())).toBe('date');
		});

		it('应该正确识别 RegExp', () => {
			expect(getType(/test/)).toBe('regexp');
			expect(getType(new RegExp('test'))).toBe('regexp');
		});

		it('应该正确识别函数', () => {
			expect(getType(function () {})).toBe('function');
			expect(getType(() => {})).toBe('function');
			expect(getType(async () => {})).toBe('function');
		});
	});

	// ==================== deepClone 测试 ====================
	describe('deepClone - 深拷贝', () => {
		it('应该正确拷贝基本类型', () => {
			expect(deepClone(null)).toBe(null);
			expect(deepClone(undefined)).toBe(undefined);
			expect(deepClone('string')).toBe('string');
			expect(deepClone(123)).toBe(123);
			expect(deepClone(true)).toBe(true);
			expect(deepClone(false)).toBe(false);
		});

		it('应该正确拷贝普通对象', () => {
			const obj = { a: 1, b: 'string', c: true };
			const cloned = deepClone(obj);

			expect(cloned).toEqual(obj);
			expect(cloned).not.toBe(obj);
		});

		it('应该正确拷贝数组', () => {
			const arr = [1, 2, 3, { a: 4 }];
			const cloned = deepClone(arr);

			expect(cloned).toEqual(arr);
			expect(cloned).not.toBe(arr);
			expect(cloned[3]).not.toBe(arr[3]);
		});

		it('应该正确拷贝嵌套对象', () => {
			const obj = {
				a: {
					b: {
						c: 1,
					},
				},
			};
			const cloned = deepClone(obj);

			expect(cloned).toEqual(obj);
			expect(cloned.a.b).not.toBe(obj.a.b);
		});

		it('应该正确拷贝 Date 对象', () => {
			const date = new Date('2024-01-01');
			const cloned = deepClone(date);

			expect(cloned).toEqual(date);
			expect(cloned).not.toBe(date);
			expect(cloned instanceof Date).toBe(true);
		});

		it('应该正确拷贝 RegExp 对象', () => {
			const regex = /test/gi;
			const cloned = deepClone(regex);

			expect(cloned).toEqual(regex);
			expect(cloned).not.toBe(regex);
			expect(cloned instanceof RegExp).toBe(true);
		});

		it('应该正确拷贝 Map', () => {
			const map = new Map<string, any>([
				['key1', 'value1'],
				['key2', { a: 1 }],
			]);
			const cloned = deepClone(map);

			expect(cloned).toEqual(map);
			expect(cloned).not.toBe(map);
			expect(cloned.get('key2')).not.toBe(map.get('key2'));
		});

		it('应该正确拷贝 Set', () => {
			const set = new Set([1, 2, { a: 3 }]);
			const cloned = deepClone(set);

			expect(cloned).toEqual(set);
			expect(cloned).not.toBe(set);
		});

		it('应该正确处理循环引用', () => {
			const obj: any = { a: 1 };
			obj.self = obj;

			const cloned = deepClone(obj);

			expect(cloned.a).toBe(1);
			expect(cloned.self).toBe(cloned);
		});

		it('应该正确拷贝 Symbol 键', () => {
			const sym = Symbol('test');
			const obj: any = {};
			obj[sym] = 'value';

			const cloned = deepClone(obj);
			expect(cloned[sym]).toBe('value');
		});
	});

	// ==================== syntaxHighlight 测试 ====================
	describe('syntaxHighlight - 语法高亮', () => {
		it('应该正确高亮字符串', () => {
			const result = syntaxHighlight('test');
			expect(result).toContain('test');
			expect(result).toContain('style=');
			expect(result).toContain('#2aa198'); // 字符串颜色
		});

		it('应该正确高亮数字', () => {
			const result = syntaxHighlight(123);
			expect(result).toContain('123');
			expect(result).toContain('#6c71c4'); // 数字颜色
		});

		it('应该正确高亮布尔值', () => {
			const result1 = syntaxHighlight(true);
			expect(result1).toContain('true');
			expect(result1).toContain('#6c71c4');

			const result2 = syntaxHighlight(false);
			expect(result2).toContain('false');
			expect(result2).toContain('#6c71c4');
		});

		it('应该正确高亮 null', () => {
			const result = syntaxHighlight(null);
			expect(result).toContain('null');
			expect(result).toContain('#6c71c4');
		});

		it('应该正确高亮数组', () => {
			const result = syntaxHighlight([1, 2, 3]);
			expect(result).toContain('[');
			expect(result).toContain(']');
			expect(result).toContain('1');
			expect(result).toContain('<br>');
		});

		it('应该正确高亮对象', () => {
			const result = syntaxHighlight({ a: 1, b: 2 });
			expect(result).toContain('{');
			expect(result).toContain('}');
			expect(result).toContain('"a"');
			expect(result).toContain('#b58900'); // 键名颜色
		});

		it('应该正确处理嵌套结构', () => {
			const result = syntaxHighlight({ a: [1, 2] });
			expect(result).toContain('{');
			expect(result).toContain('[');
			expect(result).toContain('<br>');
		});
	});

	// ==================== syntaxHtmlToJson 测试 ====================
	describe('syntaxHtmlToJson - HTML转JSON', () => {
		it('应该正确解析简单的 HTML JSON', () => {
			const html = '<span style="color: #2aa198">"test"</span>';
			const result = syntaxHtmlToJson(html);
			expect(result).toBe('test');
		});

		it('应该正确解析对象结构', () => {
			const html = '{<br>&nbsp;&nbsp;<span style="color: #b58900">"a"</span>: 1<br>}';
			const result = syntaxHtmlToJson(html);
			expect(result).toEqual({ a: 1 });
		});

		it('应该正确解析数组结构', () => {
			const html = '[<br>&nbsp;&nbsp;1,<br>&nbsp;&nbsp;2<br>]';
			const result = syntaxHtmlToJson(html);
			expect(result).toEqual([1, 2]);
		});

		it('应该在解析失败时返回原始字符串', () => {
			const html = 'invalid json {{{';
			const result = syntaxHtmlToJson(html);
			expect(result).toBe('invalid json {{{');
		});

		it('应该处理带换行的 HTML', () => {
			const html = '{\n  "a": 1\n}';
			const result = syntaxHtmlToJson(html);
			expect(result).toEqual({ a: 1 });
		});

		it('应该处理带 &nbsp; 的 HTML', () => {
			const html = '{&nbsp;&nbsp;"a":&nbsp;1}';
			const result = syntaxHtmlToJson(html);
			expect(result).toEqual({ a: 1 });
		});
	});

	// ==================== getDevice 测试 ====================
	describe('getDevice - 获取设备类型', () => {
		// 保存原始的 navigator 和 globalThis
		const originalNavigator = global.navigator;
		const originalGlobalThis = global.globalThis as any;

		beforeEach(() => {
			// 每次测试前清理全局对象
			delete (global.globalThis as any).wx;
			delete (global.globalThis as any).my;
		});

		afterEach(() => {
			// 恢复原始值
			global.navigator = originalNavigator;
			(global.globalThis as any) = originalGlobalThis;
		});

		it('应该返回 unknown 当没有 userAgent 时', () => {
			(global as any).navigator = {};
			expect(getDevice()).toBe('unknown');
		});

		it('应该正确识别 iOS', () => {
			(global as any).navigator = { userAgent: 'iPhone' };
			expect(getDevice()).toBe('ios');

			(global as any).navigator = { userAgent: 'iPad' };
			expect(getDevice()).toBe('ios');

			(global as any).navigator = { userAgent: 'iPod' };
			expect(getDevice()).toBe('ios');
		});

		it('应该正确识别 Android', () => {
			(global as any).navigator = { userAgent: 'Android' };
			expect(getDevice()).toBe('android');

			(global as any).navigator = { userAgent: 'Adr' };
			expect(getDevice()).toBe('android');
		});

		it('应该正确识别 HarmonyOS', () => {
			(global as any).navigator = { userAgent: 'HarmonyOS' };
			expect(getDevice()).toBe('harmony');
		});

		it('应该正确识别 Windows', () => {
			(global as any).navigator = { userAgent: 'Windows' };
			expect(getDevice()).toBe('windows');
		});

		it('应该正确识别 macOS', () => {
			(global as any).navigator = { userAgent: 'Macintosh' };
			expect(getDevice()).toBe('macos');
		});

		it('应该正确识别 Linux', () => {
			(global as any).navigator = { userAgent: 'Linux' };
			expect(getDevice()).toBe('linux');
		});

		it('应该正确识别微信浏览器', () => {
			(global as any).navigator = { userAgent: 'MicroMessenger' };
			expect(getDevice()).toBe('wechat');
		});

		it('应该正确识别支付宝浏览器', () => {
			(global as any).navigator = { userAgent: 'AlipayClient' };
			expect(getDevice()).toBe('alipay');
		});

		it('应该正确识别微信小程序', () => {
			(global.globalThis as any).wx = { getSystemInfo: () => {} };
			expect(getDevice()).toBe('miniProgram');
		});

		it('应该正确识别支付宝小程序', () => {
			(global.globalThis as any).my = { getSystemInfo: () => {} };
			expect(getDevice()).toBe('alipayMiniProgram');
		});
	});

	// ==================== retry 测试 ====================
	describe('retry - 异步重试', () => {
		it('应该在成功时直接返回', async () => {
			const fn = retry(async () => 'success', { times: 3, delay: 50 });
			const result = await fn();
			expect(result).toBe('success');
		});

		it('应该在失败后重试', async () => {
			let count = 0;
			const fn = retry(async () => {
				count++;
				if (count < 3) throw new Error('fail');
				return 'ok';
			}, { times: 3, delay: 50 });

			const result = await fn();
			expect(result).toBe('ok');
			expect(count).toBe(3);
		});

		it('应该在超过重试次数后抛出错误', async () => {
			const fn = retry(async () => {
				throw new Error('always fail');
			}, { times: 2, delay: 50 });

			await expect(fn()).rejects.toThrow('always fail');
		});
	});

	// ==================== once 测试 ====================
	describe('once - 只执行一次', () => {
		it('应该只执行一次', () => {
			let count = 0;
			const fn = once(() => {
				count++;
				return count;
			});

			expect(fn()).toBe(1);
			expect(fn()).toBe(1);
			expect(count).toBe(1);
		});

		it('应该支持带参数的函数', () => {
			const fn = once((a: number, b: number) => a + b);
			expect(fn(1, 2)).toBe(3);
			expect(fn(3, 4)).toBe(3);
		});
	});

	// ==================== memoize 测试 ====================
	describe('memoize - 缓存计算结果', () => {
		it('应该缓存结果', () => {
			let count = 0;
			const fn = memoize((a: number, b: number) => {
				count++;
				return a + b;
			});

			expect(fn(1, 2)).toBe(3);
			expect(fn(1, 2)).toBe(3);
			expect(count).toBe(1);
		});

		it('应该对不同参数分别缓存', () => {
			let count = 0;
			const fn = memoize((a: number) => {
				count++;
				return a * 2;
			});

			expect(fn(1)).toBe(2);
			expect(fn(2)).toBe(4);
			expect(fn(1)).toBe(2);
			expect(count).toBe(2);
		});
	});
});
