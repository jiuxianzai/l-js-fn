/**
 * storage 单元测试
 * 测试 localStorage 和 sessionStorage 方法
 */

import {
	setStorage,
	getStorage,
	removeStorage,
	clearStorage,
	hasStorage,
	getStorageKeys,
	getStorageLength,
	clearExpiredStorage,
	setSession,
	getSession,
	removeSession,
	clearSession,
	hasSession,
	getSessionKeys,
} from '@/storage';

describe('storage - 存储操作方法', () => {
	describe('localStorage 操作', () => {
		let store: Record<string, string> = {};

		beforeEach(() => {
			// 重置存储
			store = {};

			// Mock window 和 localStorage
			global.window = global.window || {};

			// 简单的 mock 实现
			const mock = {
				getItem: (key: string) => store[key] || null,
				setItem: (key: string, value: string) => {
					store[key] = value;
				},
				removeItem: (key: string) => {
					delete store[key];
				},
				clear: () => {
					Object.keys(store).forEach((key) => delete store[key]);
				},
				get length() {
					return Object.keys(store).length;
				},
				key: (index: number) => Object.keys(store)[index] || null,
			} as Storage & { _store: Record<string, string> };

			// 直接赋值，不使用 Proxy
			global.localStorage = mock;
			// 添加内部存储引用，方便测试读取
			(mock as any)._store = store;
		});

		it('应该设置 localStorage', () => {
			const result = setStorage('test', { name: 'John', age: 20 });

			expect(result).toBe(true);
		});

		it('应该获取 localStorage', () => {
			setStorage('user', { name: 'John', age: 20 });

			const result = getStorage<{ name: string; age: number }>('user');

			expect(result).toEqual({ name: 'John', age: 20 });
		});

		it('应该支持过期时间', () => {
			jest.useFakeTimers();

			setStorage('temp', 'data', { expire: 1 }); // 1秒过期

			// 立即获取应该成功
			expect(getStorage('temp')).toBe('data');

			// 前进时间 2 秒
			jest.advanceTimersByTime(2000);

			// 应该过期返回 null
			expect(getStorage('temp')).toBe(null);

			jest.useRealTimers();
		});

		it('应该支持永不过期', () => {
			setStorage('permanent', 'data', { expire: -1 });

			jest.useFakeTimers();
			jest.advanceTimersByTime(1000000); // 前进很久

			expect(getStorage('permanent')).toBe('data');

			jest.useRealTimers();
		});

		it('应该删除 localStorage', () => {
			setStorage('test', 'value');
			expect(getStorage('test')).toBe('value');

			removeStorage('test');
			expect(getStorage('test')).toBe(null);
		});

		it('应该清空所有 localStorage', () => {
			setStorage('key1', 'value1');
			setStorage('key2', 'value2');

			expect(getStorageLength()).toBe(2);

			clearStorage();

			expect(getStorageLength()).toBe(0);
		});

		it('应该检查 localStorage 是否存在', () => {
			setStorage('test', 'value');

			expect(hasStorage('test')).toBe(true);
			expect(hasStorage('notexist')).toBe(false);
		});

		it('应该获取所有 localStorage 的键名', () => {
			setStorage('user', 'john');
			setStorage('token', 'abc123');

			// Mock Object.keys 来返回我们存储的键
			const originalKeys = Object.keys;
			jest.spyOn(Object, 'keys').mockImplementation((obj: any) => {
				if (obj === global.localStorage) {
					return ['user', 'token'];
				}
				return originalKeys(obj);
			});

			const keys = getStorageKeys();

			expect(keys).toContain('user');
			expect(keys).toContain('token');

			// 恢复 mock
			jest.restoreAllMocks();
		});

		it('应该获取 localStorage 的数量', () => {
			setStorage('key1', 'value1');
			setStorage('key2', 'value2');
			setStorage('key3', 'value3');

			expect(getStorageLength()).toBe(3);
		});

		it('应该清理所有已过期的 localStorage', () => {
			jest.useFakeTimers();

			setStorage('valid', 'data1');
			setStorage('expired', 'data2', { expire: 1 });

			jest.advanceTimersByTime(2000);

			// Mock Object.keys 来返回存储的键
			const originalKeys = Object.keys;
			jest.spyOn(Object, 'keys').mockImplementation((obj: any) => {
				if (obj === global.localStorage) {
					return ['valid', 'expired'];
				}
				return originalKeys(obj);
			});

			const clearedCount = clearExpiredStorage();

			expect(clearedCount).toBe(1);
			expect(hasStorage('valid')).toBe(true);
			expect(hasStorage('expired')).toBe(false);

			jest.restoreAllMocks();
			jest.useRealTimers();
		});

		it('应该在服务端环境下返回 false', () => {
			global.window = undefined as any;

			expect(setStorage('test', 'value')).toBe(false);
			expect(getStorage('test')).toBe(null);
			expect(removeStorage('test')).toBe(false);
			expect(clearStorage()).toBe(false);
			expect(hasStorage('test')).toBe(false);
			expect(getStorageKeys()).toEqual([]);
			expect(getStorageLength()).toBe(0);
		});
	});

	describe('sessionStorage 操作', () => {
		let store: Record<string, string> = {};

		beforeEach(() => {
			// 重置存储
			store = {};

			// Mock window 和 sessionStorage
			global.window = global.window || {};

			// 简单的 mock 实现
			const mock = {
				getItem: (key: string) => store[key] || null,
				setItem: (key: string, value: string) => {
					store[key] = value;
				},
				removeItem: (key: string) => {
					delete store[key];
				},
				clear: () => {
					Object.keys(store).forEach((key) => delete store[key]);
				},
				get length() {
					return Object.keys(store).length;
				},
				key: (index: number) => Object.keys(store)[index] || null,
			} as Storage & { _store: Record<string, string> };

			// 直接赋值，不使用 Proxy
			global.sessionStorage = mock;
			// 添加内部存储引用，方便测试读取
			(mock as any)._store = store;
		});

		it('应该设置 sessionStorage', () => {
			const result = setSession('test', { name: 'John', age: 20 });

			expect(result).toBe(true);
		});

		it('应该获取 sessionStorage', () => {
			setSession('user', { name: 'John', age: 20 });

			const result = getSession<{ name: string; age: number }>('user');

			expect(result).toEqual({ name: 'John', age: 20 });
		});

		it('应该删除 sessionStorage', () => {
			setSession('test', 'value');
			expect(getSession('test')).toBe('value');

			removeSession('test');
			expect(getSession('test')).toBe(null);
		});

		it('应该清空所有 sessionStorage', () => {
			setSession('key1', 'value1');
			setSession('key2', 'value2');

			// Mock Object.keys 来返回存储的键
			const originalKeys = Object.keys;
			jest.spyOn(Object, 'keys').mockImplementation((obj: any) => {
				if (obj === global.sessionStorage) {
					return [];
				}
				return originalKeys(obj);
			});

			clearSession();

			expect(getSessionKeys().length).toBe(0);

			jest.restoreAllMocks();
		});

		it('应该检查 sessionStorage 是否存在', () => {
			setSession('test', 'value');

			expect(hasSession('test')).toBe(true);
			expect(hasSession('notexist')).toBe(false);
		});

		it('应该获取所有 sessionStorage 的键名', () => {
			setSession('user', 'john');
			setSession('token', 'abc123');

			// Mock Object.keys 来返回我们存储的键
			const originalKeys = Object.keys;
			jest.spyOn(Object, 'keys').mockImplementation((obj: any) => {
				if (obj === global.sessionStorage) {
					return ['user', 'token'];
				}
				return originalKeys(obj);
			});

			const keys = getSessionKeys();

			expect(keys).toContain('user');
			expect(keys).toContain('token');

			jest.restoreAllMocks();
		});

		it('应该在服务端环境下返回 false', () => {
			global.window = undefined as any;

			expect(setSession('test', 'value')).toBe(false);
			expect(getSession('test')).toBe(null);
			expect(removeSession('test')).toBe(false);
			expect(clearSession()).toBe(false);
			expect(hasSession('test')).toBe(false);
			expect(getSessionKeys()).toEqual([]);
		});
	});
});
