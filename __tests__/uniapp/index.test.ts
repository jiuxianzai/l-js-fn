/**
 * uniapp 单元测试
 * 测试 storage、model、toast、base 模块
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockWx = {
	setStorageSync: jest.fn(),
	getStorageSync: jest.fn(),
	removeStorageSync: jest.fn(),
	clearStorageSync: jest.fn(),
	getStorageInfoSync: jest.fn().mockReturnValue({ keys: ['key1'] }),
	showModal: jest.fn(),
	showToast: jest.fn(),
	showLoading: jest.fn(),
	hideLoading: jest.fn(),
	showActionSheet: jest.fn(),
	navigateTo: jest.fn(),
	redirectTo: jest.fn(),
	navigateBack: jest.fn(),
	switchTab: jest.fn(),
	reLaunch: jest.fn(),
	authorize: jest.fn(),
	getLocation: jest.fn(),
	getEnterOptionsSync: jest.fn().mockReturnValue({}),
	getSystemInfoSync: jest.fn().mockReturnValue({ platform: 'ios' }),
	getFileSystemManager: jest.fn().mockReturnValue({
		writeFile: jest.fn(),
		readFile: jest.fn(),
		access: jest.fn(),
		unlink: jest.fn(),
	}),
	env: { USER_DATA_PATH: 'wxfile://usr' },
};

(global as any).wx = mockWx;
(global as any).uni = {
	request: jest.fn(),
	uploadFile: jest.fn(),
	downloadFile: jest.fn(),
};

import { storage, model, toast, router, permission, env, request, getAdapter, registerAdapter, autoDetect, createWechatAdapter } from '@/uniapp';

describe('uniapp 模块', () => {
	describe('storage', () => {
		describe('存储', () => {
			describe('set', () => {
				it('应该设置存储值', () => {
					storage.set('key1', 'value1');
					expect(mockWx.setStorageSync).toHaveBeenCalledWith('key1', expect.any(String));
				});

				it('应该支持对象类型', () => {
					const obj = { name: 'John', age: 20 };
					storage.set('user', obj);
					const callArg = mockWx.setStorageSync.mock.calls[0][1] as string;
					const parsed = JSON.parse(callArg);
					expect(parsed.value).toEqual(obj);
					expect(parsed.expire).toBe(-1);
				});

				it('应该设置过期时间', () => {
					storage.set('key2', 'value2', { expire: 3600 });
					const callArg = mockWx.setStorageSync.mock.calls[0][1] as string;
					const parsed = JSON.parse(callArg);
					expect(parsed.expire).toBeGreaterThan(Date.now());
				});

				it('应该支持加密存储', () => {
					storage.set('key3', 'secret', { encrypt: true });
					const callArg = mockWx.setStorageSync.mock.calls[0][1] as string;
					expect(() => JSON.parse(callArg)).toThrow();
				});

				it('异常时应返回 false', () => {
					mockWx.setStorageSync.mockImplementationOnce(() => {
						throw new Error('mock error');
					});
					const result = storage.set('key4', 'value4');
					expect(result).toBe(false);
				});
			});

			describe('get', () => {
				it('应该获取存储值', () => {
					const item = { value: 'hello', expire: -1 };
					mockWx.getStorageSync.mockReturnValueOnce(JSON.stringify(item));
					const result = storage.get<string>('key1');
					expect(result).toBe('hello');
				});

				it('应该支持解密读取', () => {
					const item = { value: 'secret', expire: -1 };
					mockWx.getStorageSync.mockReturnValueOnce(JSON.stringify(item));
					mockWx.setStorageSync.mockReturnValueOnce(undefined);
					// 设置时加密
					storage.set('encKey', 'secret', { encrypt: true });
					const encrypted = mockWx.setStorageSync.mock.calls[0][1] as string;
					mockWx.getStorageSync.mockReset();
					mockWx.getStorageSync.mockReturnValueOnce(encrypted);
					const result = storage.get<string>('encKey', { encrypt: true });
					expect(result).toBe('secret');
				});

				it('加密存储应支持中文字符完整往返', () => {
					const chinese = { name: '张三', desc: '这是测试内容👍' };
					storage.set('cnKey', chinese, { encrypt: true });
					const encrypted = mockWx.setStorageSync.mock.calls[0][1] as string;
					mockWx.getStorageSync.mockReturnValueOnce(encrypted);
					const result = storage.get<typeof chinese>('cnKey', { encrypt: true });
					expect(result).toEqual(chinese);
				});

				it('过期数据应返回 null 并自动删除', () => {
					const item = { value: 'expired', expire: Date.now() - 1000 };
					mockWx.getStorageSync.mockReturnValueOnce(JSON.stringify(item));
					const result = storage.get<string>('expiredKey');
					expect(result).toBeNull();
					expect(mockWx.removeStorageSync).toHaveBeenCalledWith('expiredKey');
				});

				it('不存在时应返回 null', () => {
					mockWx.getStorageSync.mockReturnValueOnce('');
					const result = storage.get<string>('notexist');
					expect(result).toBeNull();
				});

				it('解析异常时应返回 null', () => {
					mockWx.getStorageSync.mockReturnValueOnce('invalid json {{{');
					const result = storage.get<string>('badKey');
					expect(result).toBeNull();
				});
			});

			describe('remove', () => {
				it('应该删除指定 key', () => {
					storage.remove('key1');
					expect(mockWx.removeStorageSync).toHaveBeenCalledWith('key1');
				});

				it('异常时应返回 false', () => {
					mockWx.removeStorageSync.mockImplementationOnce(() => {
						throw new Error('mock error');
					});
					const result = storage.remove('key2');
					expect(result).toBe(false);
				});
			});

			describe('clear', () => {
				it('应该清空所有存储', () => {
					storage.clear();
					expect(mockWx.clearStorageSync).toHaveBeenCalled();
				});

				it('异常时应返回 false', () => {
					mockWx.clearStorageSync.mockImplementationOnce(() => {
						throw new Error('mock error');
					});
					const result = storage.clear();
					expect(result).toBe(false);
				});
			});

			describe('has', () => {
				it('键存在时应返回 true', () => {
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: ['key1', 'key2'] });
					expect(storage.has('key1')).toBe(true);
				});

				it('键不存在时应返回 false', () => {
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: ['key1'] });
					expect(storage.has('other')).toBe(false);
				});

				it('getStorageInfoSync 异常时应返回 false', () => {
					mockWx.getStorageInfoSync.mockImplementationOnce(() => {
						throw new Error('fail');
					});
					expect(storage.has('key1')).toBe(false);
				});
			});

			describe('keys', () => {
				it('应返回所有键名', () => {
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: ['a', 'b'] });
					expect(storage.keys()).toEqual(['a', 'b']);
				});

				it('异常时应返回空数组', () => {
					mockWx.getStorageInfoSync.mockImplementationOnce(() => {
						throw new Error('fail');
					});
					expect(storage.keys()).toEqual([]);
				});

				it('缺 API 时应返回空数组', async () => {
					let s: any;
					const api = { setClipboardData: jest.fn(), getClipboardData: jest.fn() };
					await jest.isolateModulesAsync(async () => {
						const mod = await import('@/uniapp');
						mod.registerAdapter(mod.createWechatAdapter(api));
						s = mod.storage;
					});
					expect(s.keys()).toEqual([]);
				});
			});

			describe('clearExpired', () => {
				it('应清除已过期项并返回数量', () => {
					const expired = JSON.stringify({ value: 'old', expire: Date.now() - 1000 });
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: ['expired', 'valid'] });
					mockWx.getStorageSync
						.mockReturnValueOnce(expired)
						.mockReturnValueOnce(JSON.stringify({ value: 'ok', expire: -1 }));
					const count = storage.clearExpired();
					expect(count).toBe(1);
					expect(mockWx.removeStorageSync).toHaveBeenCalledWith('expired');
				});

				it('非本模块格式数据应跳过', () => {
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: ['raw', 'invalid'] });
					mockWx.getStorageSync
						.mockReturnValueOnce('plain-string')
						.mockReturnValueOnce('{{{invalid json');
					const count = storage.clearExpired();
					expect(count).toBe(0);
					expect(mockWx.removeStorageSync).not.toHaveBeenCalled();
				});

				it('空键列表应返回 0', () => {
					mockWx.getStorageInfoSync.mockReturnValueOnce({ keys: [] });
					expect(storage.clearExpired()).toBe(0);
				});
			});
		});
	});

	describe('model', () => {
		describe('confirm', () => {
			it('应该显示确认对话框', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.success({ confirm: true, cancel: false });
				});
				const result = await model.confirm('确定删除？');
				expect(result).toEqual({ confirm: true, cancel: false });
				expect(mockWx.showModal).toHaveBeenCalledWith(
					expect.objectContaining({
						title: '温馨提示',
						content: '确定删除？',
						confirmText: '确认',
						cancelText: '取消',
						showCancel: true,
					})
				);
			});

			it('应该处理取消操作', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.success({ confirm: false, cancel: true });
				});
				const result = await model.confirm('确定？');
				expect(result).toEqual({ confirm: false, cancel: true });
			});

			it('应该支持自定义配置', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.success({ confirm: true, cancel: false });
				});
				await model.confirm('自定义', {
					title: '标题',
					confirmText: '好的',
					cancelText: '不了',
				});
				expect(mockWx.showModal).toHaveBeenCalledWith(
					expect.objectContaining({
						title: '标题',
						confirmText: '好的',
						cancelText: '不了',
					})
				);
			});

			it('应该处理 fail 回调', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.fail(new Error('调用失败'));
				});
				await expect(model.confirm('测试')).rejects.toThrow('调用失败');
			});
		});

		describe('alert', () => {
			it('应该显示无取消按钮的对话框', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.success({ confirm: true, cancel: false });
				});
				await model.alert('操作成功');
				expect(mockWx.showModal).toHaveBeenCalledWith(
					expect.objectContaining({
						showCancel: false,
					})
				);
			});

			it('应该支持自定义标题', async () => {
				mockWx.showModal.mockImplementationOnce((options: any) => {
					options.success({ confirm: true, cancel: false });
				});
				await model.alert('消息', { title: '通知' });
				expect(mockWx.showModal).toHaveBeenCalledWith(
					expect.objectContaining({
						title: '通知',
						showCancel: false,
					})
				);
			});
		});

		describe('actionSheet', () => {
			it('应该显示操作菜单并返回选中索引', async () => {
				mockWx.showActionSheet.mockImplementationOnce((options: any) => {
					options.success({ tapIndex: 1 });
				});
				const result = await model.actionSheet({ itemList: ['编辑', '删除'] });
				expect(result).toBe(1);
				expect(mockWx.showActionSheet).toHaveBeenCalledWith(
					expect.objectContaining({ itemList: ['编辑', '删除'] })
				);
			});

			it('应该透传 title 和 itemColor', async () => {
				mockWx.showActionSheet.mockImplementationOnce((options: any) => {
					options.success({ tapIndex: 0 });
				});
				await model.actionSheet({ itemList: ['a'], title: '选择', itemColor: '#ff0000' });
				expect(mockWx.showActionSheet).toHaveBeenCalledWith(
					expect.objectContaining({ itemList: ['a'], title: '选择', itemColor: '#ff0000' })
				);
			});

			it('取消时应返回 null', async () => {
				mockWx.showActionSheet.mockImplementationOnce((options: any) => options.fail?.());
				await expect(model.actionSheet({ itemList: ['a'] })).resolves.toBeNull();
			});

			it('空列表时应返回 null 且不调用 API', async () => {
				await expect(model.actionSheet({ itemList: [] })).resolves.toBeNull();
				await expect(model.actionSheet({ itemList: undefined as any })).resolves.toBeNull();
				expect(mockWx.showActionSheet).not.toHaveBeenCalled();
			});

			it('适配器未实现 showActionSheet 时应走 uni 兜底调用', async () => {
				const original = getAdapter();
				const custom: any = { ...original };
				delete custom.showActionSheet;
				registerAdapter(custom);
				mockWx.showActionSheet.mockImplementationOnce((options: any) => options.success({ tapIndex: 1 }));
				const result = await model.actionSheet({ itemList: ['a', 'b'] });
				expect(result).toBe(1);
				expect(mockWx.showActionSheet).toHaveBeenCalledWith(expect.objectContaining({ itemList: ['a', 'b'] }));
				registerAdapter(original);
			});
		});
	});

	describe('toast', () => {
		describe('show', () => {
			it('应该显示普通提示', () => {
				toast.show('操作成功');
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '操作成功',
					icon: 'none',
					duration: 2000,
					mask: false,
				});
			});

			it('应该支持自定义 duration 和 mask', () => {
				toast.show('请稍候', { duration: 3000, mask: true });
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '请稍候',
					icon: 'none',
					duration: 3000,
					mask: true,
				});
			});
		});

		describe('success', () => {
			it('应该显示成功提示', () => {
				toast.success('保存成功');
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '保存成功',
					icon: 'success',
					duration: 2000,
					mask: false,
				});
			});

			it('应该支持自定义配置', () => {
				toast.success('成功', { duration: 1000 });
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '成功',
					icon: 'success',
					duration: 1000,
					mask: false,
				});
			});
		});

		describe('error', () => {
			it('应该显示错误提示', () => {
				toast.error('网络异常');
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '网络异常',
					icon: 'error',
					duration: 2000,
					mask: false,
				});
			});
		});

		describe('icon 降级', () => {
			it('微信端 fail 图标应降级为 error', () => {
				toast.show('支付宝专属图标', { icon: 'fail' });
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '支付宝专属图标',
					icon: 'error',
					duration: 2000,
					mask: false,
				});
			});

			it('微信端 exception 图标应降级为 none', () => {
				toast.show('异常', { icon: 'exception' });
				expect(mockWx.showToast).toHaveBeenCalledWith({
					title: '异常',
					icon: 'none',
					duration: 2000,
					mask: false,
				});
			});
		});

		describe('loading', () => {
			it('应该显示加载中', () => {
				toast.loading('加载中...');
				expect(mockWx.showLoading).toHaveBeenCalledWith({
					title: '加载中...',
					mask: true,
				});
			});

			it('应该支持禁用 mask', () => {
				toast.loading('加载中...', { mask: false });
				expect(mockWx.showLoading).toHaveBeenCalledWith({
					title: '加载中...',
					mask: false,
				});
			});
		});

		describe('hideLoading', () => {
			it('应该隐藏加载中', () => {
				toast.hideLoading();
				expect(mockWx.hideLoading).toHaveBeenCalled();
			});
		});
	});

	describe('base', () => {
		it('getAdapter 应自动检测微信平台并返回适配器', () => {
			expect(getAdapter().name).toBe('wechat');
			expect(getAdapter().api).toBe(mockWx);
		});

		it('autoDetect 应返回当前平台适配器', () => {
			expect(autoDetect().name).toBe('wechat');
		});

		it('registerAdapter 应覆盖默认适配器', () => {
			const original = getAdapter();
			const customAdapter = { ...original, name: 'custom' };
			registerAdapter(customAdapter);
			expect(getAdapter().name).toBe('custom');
			registerAdapter(original);
		});
	});

	describe('router', () => {
		beforeEach(() => {
			mockWx.navigateTo.mockImplementation((opts: any) => opts.success?.());
			mockWx.redirectTo.mockImplementation((opts: any) => opts.success?.());
			mockWx.navigateBack.mockImplementation((opts: any) => opts.success?.());
			mockWx.switchTab.mockImplementation((opts: any) => opts.success?.());
			mockWx.reLaunch.mockImplementation((opts: any) => opts.success?.());
		});

		describe('push', () => {
			it('应该调用 navigateTo', async () => {
				await router.push('/pages/detail/index');
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index' })
				);
			});

			it('应该拼接 query 参数', async () => {
				await router.push('/pages/detail/index', { query: { id: '1', name: 'test' } });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?id=1&name=test' })
				);
			});

			it('应该对 query 值进行 URL 编码', async () => {
				await router.push('/pages/detail/index', { query: { name: 'hello world' } });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?name=hello%20world' })
				);
			});

			it('encode=false 时不应编码', async () => {
				await router.push('/pages/detail/index', { query: { name: 'hello world' }, encode: false });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?name=hello world' })
				);
			});

			it('params 对象值应序列化为 JSON', async () => {
				await router.push('/pages/detail/index', { params: { user: { name: 'John' } } });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?user=%7B%22name%22%3A%22John%22%7D' })
				);
			});

			it('应合并 query 和 params', async () => {
				await router.push('/pages/detail/index', { query: { id: '1' }, params: { type: 'A' } });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?id=1&type=A' })
				);
			});

			it('路径已含 ? 时应使用 & 拼接', async () => {
				await router.push('/pages/detail/index?from=list', { query: { id: '1' } });
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/detail/index?from=list&id=1' })
				);
			});

			it('navigateTo 失败时应 reject', async () => {
				mockWx.navigateTo.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
				await expect(router.push('/pages/detail/index')).rejects.toThrow('fail');
			});
		});

		describe('replace', () => {
			it('应该调用 redirectTo', async () => {
				await router.replace('/pages/home/index');
				expect(mockWx.redirectTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/home/index' })
				);
			});

			it('应该支持 query 参数', async () => {
				await router.replace('/pages/home/index', { query: { type: 'B' } });
				expect(mockWx.redirectTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/home/index?type=B' })
				);
			});
		});

		describe('back', () => {
			it('默认 delta=1', async () => {
				await router.back();
				expect(mockWx.navigateBack).toHaveBeenCalledWith(
					expect.objectContaining({ delta: 1 })
				);
			});

			it('应该支持自定义 delta', async () => {
				await router.back(3);
				expect(mockWx.navigateBack).toHaveBeenCalledWith(
					expect.objectContaining({ delta: 3 })
				);
			});

			it('失败时应 reject', async () => {
				mockWx.navigateBack.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
				await expect(router.back()).rejects.toThrow('fail');
			});
		});

		describe('switchTab', () => {
			it('应该调用 switchTab', async () => {
				await router.switchTab('/pages/home/index');
				expect(mockWx.switchTab).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/home/index' })
				);
			});

			it('switchTab 失败时应 reject', async () => {
				mockWx.switchTab.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
				await expect(router.switchTab('/pages/home/index')).rejects.toThrow('fail');
			});
		});

		describe('reLaunch', () => {
			it('应该调用 reLaunch', async () => {
				await router.reLaunch('/pages/index/index');
				expect(mockWx.reLaunch).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/index/index' })
				);
			});

			it('应该支持 query 参数', async () => {
				await router.reLaunch('/pages/index/index', { query: { tab: '1' } });
				expect(mockWx.reLaunch).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/index/index?tab=1' })
				);
			});
		});

		describe('防重复跳转', () => {
			it('300ms 内重复跳转应被忽略', async () => {
				let r: any;
				await jest.isolateModulesAsync(async () => {
					jest.useFakeTimers();
					jest.setSystemTime(1000000);
					const mod = await import('@/uniapp');
					r = mod.router;
					const p1 = r.push('/pages/detail/index');
					const p2 = r.push('/pages/detail/index');
					await Promise.all([p1, p2]);
				});
				expect(mockWx.navigateTo).toHaveBeenCalledTimes(1);
				jest.useRealTimers();
			});

			it('超过 300ms 后允许再次跳转', async () => {
				await jest.isolateModulesAsync(async () => {
					jest.useFakeTimers();
					jest.setSystemTime(1000000);
					const mod = await import('@/uniapp');
					const r = mod.router;
					await r.push('/pages/detail/index');
					jest.setSystemTime(1000400);
					await r.push('/pages/detail/index');
				});
				expect(mockWx.navigateTo).toHaveBeenCalledTimes(2);
				jest.useRealTimers();
			});

			it('不同路径不触发防重复', async () => {
				await jest.isolateModulesAsync(async () => {
					jest.useFakeTimers();
					jest.setSystemTime(1000000);
					const mod = await import('@/uniapp');
					const r = mod.router;
					const p1 = r.push('/pages/a/index');
					const p2 = r.push('/pages/b/index');
					await Promise.all([p1, p2]);
				});
				expect(mockWx.navigateTo).toHaveBeenCalledTimes(2);
				jest.useRealTimers();
			});

			it('导航失败后应立即允许重试同一路径', async () => {
				await jest.isolateModulesAsync(async () => {
					jest.useFakeTimers();
					jest.setSystemTime(1000000);
					const mod = await import('@/uniapp');
					const r = mod.router;
					mockWx.navigateTo.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
					mockWx.navigateTo.mockImplementation((opts: any) => opts.success?.());
					await expect(r.push('/pages/detail/index')).rejects.toThrow('fail');
					await r.push('/pages/detail/index');
				});
				expect(mockWx.navigateTo).toHaveBeenCalledTimes(2);
				jest.useRealTimers();
			});
		});

		describe('路由守卫', () => {
			let r: any;

			beforeEach(async () => {
				await jest.isolateModulesAsync(async () => {
					const mod = await import('@/uniapp');
					r = mod.router;
				});
			});

			it('next() 无参数时应放行', async () => {
				const guard = jest.fn((_to: string, _from: string, next: any) => next());
				r.beforeEach(guard);
				await r.push('/pages/detail/index');
				expect(guard).toHaveBeenCalled();
				expect(mockWx.navigateTo).toHaveBeenCalled();
			});

			it('守卫应接收 to 和 from 参数', async () => {
				const guard = jest.fn((_to: string, _from: string, next: any) => next());
				r.beforeEach(guard);
				await r.push('/pages/detail/index', { query: { id: '1' } });
				expect(guard).toHaveBeenCalledWith(
					expect.stringContaining('/pages/detail/index?id=1'),
					'',
					expect.any(Function)
				);
			});

			it('next("/path") 应重定向', async () => {
				r.beforeEach((_to: any, _from: any, next: any) => next('/pages/redirect/index'));
				await r.push('/pages/original/index');
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/redirect/index' })
				);
			});

			it('守卫不调用 next 超时后应阻塞', async () => {
				jest.useFakeTimers();
				r.beforeEach(() => { /* 不调用 next */ });
				const p = r.push('/pages/detail/index');
				jest.advanceTimersByTime(6000);
				await p;
				expect(mockWx.navigateTo).not.toHaveBeenCalled();
				jest.useRealTimers();
			});

			it('守卫失败后导航应 reject', async () => {
				mockWx.navigateTo.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
				r.beforeEach((_to: any, _from: any, next: any) => next());
				await expect(r.push('/pages/detail/index')).rejects.toThrow('fail');
			});

			it('守卫多次调用 next 时只生效一次', async () => {
				let r2: any;
				await jest.isolateModulesAsync(async () => {
					const mod = await import('@/uniapp');
					r2 = mod.router;
				});
				r2.beforeEach((_to: any, _from: any, next: any) => {
					next();
					next('/pages/redirect/index');
				});
				await r2.push('/pages/original/index');
				expect(mockWx.navigateTo).toHaveBeenCalledWith(
					expect.objectContaining({ url: '/pages/original/index' })
				);
			});
		});
	});

	describe('router 边界', () => {
		let r: any;

		beforeEach(async () => {
			mockWx.navigateTo.mockImplementation((opts: any) => opts.success?.());
			await jest.isolateModulesAsync(async () => {
				const mod = await import('@/uniapp');
				r = mod.router;
			});
		});

		it('传空 query/params 时走 entries.length === 0 分支', async () => {
			await r.push('/pages/detail/index', { query: {}, params: {} });
			expect(mockWx.navigateTo).toHaveBeenCalledWith(
				expect.objectContaining({ url: '/pages/detail/index' })
			);
		});

		it('并发导航失败时 clearDuplicate 不误清其他导航标记', async () => {
			mockWx.navigateTo.mockImplementation((opts: any) => {
				if (opts.url.includes('/a')) {
					opts.fail?.(new Error('fail-a'));
				} else {
					opts.success?.();
				}
			});
			const p1 = r.push('/pages/a/index');
			const p2 = r.push('/pages/b/index');
			await expect(p1).rejects.toThrow('fail-a');
			await p2;
			// lastNavUrl 被 /b 覆盖，/a 的清除不生效，/b 标记保留
			expect((r as any).lastNavUrl).toBe('/pages/b/index');
		});
	});

	describe('permission', () => {
		describe('camera', () => {
			it('微信授权成功应返回 true', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.success());
				const result = await permission.camera();
				expect(result).toBe(true);
				expect(mockWx.authorize).toHaveBeenCalledWith(
					expect.objectContaining({ scope: 'scope.camera' })
				);
			});

			it('微信授权失败应返回 false', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.fail());
				const result = await permission.camera();
				expect(result).toBe(false);
			});
		});

		describe('album', () => {
			it('微信应调用 scope.writePhotosAlbum', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.success());
				await permission.album();
				expect(mockWx.authorize).toHaveBeenCalledWith(
					expect.objectContaining({ scope: 'scope.writePhotosAlbum' })
				);
			});
		});

		describe('location', () => {
			it('微信应通过 authorize 检查', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.success());
				const result = await permission.location();
				expect(result).toBe(true);
				expect(mockWx.authorize).toHaveBeenCalledWith(
					expect.objectContaining({ scope: 'scope.userLocation' })
				);
			});

			it('微信授权失败应返回 false', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.fail());
				const result = await permission.location();
				expect(result).toBe(false);
			});
		});

		describe('microphone', () => {
			it('微信应调用 scope.record', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.success());
				await permission.microphone();
				expect(mockWx.authorize).toHaveBeenCalledWith(
					expect.objectContaining({ scope: 'scope.record' })
				);
			});
		});

		describe('authorize', () => {
			it('应透传 scope 到微信 authorize', async () => {
				mockWx.authorize.mockImplementationOnce((opts: any) => opts.success());
				const result = await permission.authorize('scope.camera');
				expect(result).toBe(true);
				expect(mockWx.authorize).toHaveBeenCalledWith(
					expect.objectContaining({ scope: 'scope.camera' })
				);
			});
		});
	});

	describe('env', () => {
		describe('platform', () => {
			it('微信环境应返回正确平台信息', () => {
				const info = env.platform();
				expect(info.isWechat).toBe(true);
				expect(info.isAlipay).toBe(false);
				expect(info.platformName).toBe('wechat');
			});
		});

		describe('version', () => {
			it('微信环境应返回版本信息', async () => {
				(global as any).__wxConfig = { envVersion: 'develop' };
				const ver = await env.version();
				expect(ver).toEqual({ v: 'develop', d: '开发版', s: 'wechat' });
				delete (global as any).__wxConfig;
			});

			it('微信环境缺省时返回 release', async () => {
				const ver = await env.version();
				expect(ver).toEqual({ v: 'release', d: '正式版', s: 'wechat' });
			});
		});

		describe('launchOptions', () => {
			it('微信环境应返回完整启动参数对象', () => {
				const origWx = (global as any).wx;
				(global as any).wx = {
					...origWx,
					getLaunchOptionsSync: jest.fn().mockReturnValue({ query: { id: '1' } }),
				};
				registerAdapter(createWechatAdapter((global as any).wx));
				const result = env.launchOptions();
				expect(result).toEqual({ query: { id: '1' } });
				(global as any).wx = origWx;
				registerAdapter(createWechatAdapter(origWx));
			});

			it('getLaunchOptionsSync 不存在应返回 null', () => {
				const result = env.launchOptions();
				expect(result).toBeNull();
			});

			it('getLaunchOptionsSync 抛错时应返回 null', () => {
				const origWx = (global as any).wx;
				(global as any).wx = {
					...origWx,
					getLaunchOptionsSync: jest.fn(() => {
						throw new Error('fail');
					}),
				};
				registerAdapter(createWechatAdapter((global as any).wx));
				const result = env.launchOptions();
				expect(result).toBeNull();
				(global as any).wx = origWx;
				registerAdapter(createWechatAdapter(origWx));
			});
		});

		describe('enterOptions', () => {
			it('应返回 query 参数', () => {
				mockWx.getEnterOptionsSync.mockReturnValueOnce({ scene: 1001, query: { id: '1' } });
				const result = env.enterOptions();
				expect(result).toEqual({ id: '1' });
			});

			it('无 query 时应返回空对象', () => {
				mockWx.getEnterOptionsSync.mockReturnValueOnce({ scene: 1001 });
				const result = env.enterOptions();
				expect(result).toEqual({});
			});

			it('异常时应返回 undefined', () => {
				mockWx.getEnterOptionsSync.mockImplementationOnce(() => {
					throw new Error('fail');
				});
				const result = env.enterOptions();
				expect(result).toBeUndefined();
			});
		});

		describe('scanParams', () => {
			it('微信扫码应解析 q 参数', () => {
				const cb = jest.fn();
				env.scanParams({ q: encodeURIComponent('https://example.com?a=1&b=2') }, cb);
				expect(cb).toHaveBeenCalledWith('https://example.com?a=1&b=2', { a: '1', b: '2' });
			});

			it('options 为空时应直接返回', () => {
				const cb = jest.fn();
				env.scanParams(undefined, cb);
				expect(cb).not.toHaveBeenCalled();
			});

			it('无扫码参数时不应回调', () => {
				const cb = jest.fn();
				env.scanParams({ other: 'data' }, cb);
				expect(cb).not.toHaveBeenCalled();
			});

			it('有扫码 URL 但未传回调时不报错', () => {
				expect(() => env.scanParams({ q: encodeURIComponent('https://example.com') })).not.toThrow();
			});
		});
	});

	describe('request', () => {
		const mockUni = (global as any).uni;

		beforeEach(() => {
			mockUni.request.mockImplementation((opts: any) => {
				setTimeout(() => {
					opts.complete?.({
						data: { code: 0, msg: 'ok' },
						statusCode: 200,
						config: opts,
					})
				}, 0)
			})
		});

		describe('基本请求', () => {
			it('get 应返回响应数据', async () => {
				const res = await request.get('/api/test')
				expect(res).toBeDefined()
				expect(res.data.code).toBe(0)
			})

			it('post 应携带 data', async () => {
				await request.post('/api/test', { name: 'John' })
				expect(mockUni.request).toHaveBeenCalledWith(
					expect.objectContaining({
						method: 'POST',
					})
				)
			})
		});

		describe('拦截器', () => {
			it('beforeRequest 应在请求前修改 config', async () => {
				request.beforeRequest((cfg: any) => {
					cfg.header = { ...cfg.header, 'X-Custom': '1' }
					return cfg
				})
				await request.get('/api/test')
				const call = mockUni.request.mock.lastCall[0] as any
				expect(call.header['X-Custom']).toBe('1')
			})

			it('afterResponse 应在响应后处理数据', async () => {
				request.afterResponse((res: any) => {
					return { ...res, handled: true }
				})
				const res: any = await request.get('/api/test')
				expect(res.handled).toBe(true)
			})
		});

		describe('重试', () => {
			it('retry=2 时失败应重试 2 次后抛出', async () => {
				let callCount = 0
				mockUni.request
					.mockReset()
					.mockImplementationOnce(() => { callCount++; throw new Error('fail1') })
					.mockImplementationOnce(() => { callCount++; throw new Error('fail2') })
					.mockImplementationOnce(() => { callCount++; throw new Error('fail3') })

				await expect(request.get('/api/test', { retry: 2, retryDelay: 0 })).rejects.toThrow('fail3')
				expect(callCount).toBe(3)
			})

			it('retry=1 时第一次失败第二次成功应返回', async () => {
				let callCount = 0
				mockUni.request
					.mockReset()
					.mockImplementationOnce(() => { callCount++; throw new Error('fail') })
					.mockImplementationOnce((opts: any) => {
						callCount++
						opts.complete?.({ data: { code: 0 }, statusCode: 200 })
					})

				const res = await request.get('/api/test', { retry: 1, retryDelay: 0 })
				expect(callCount).toBe(2)
				expect(res.data.code).toBe(0)
			})
		});
	});
});

describe('uniapp - 支付宝平台', () => {
	it('toast.show 应使用 content 和 type 参数', async () => {
		let toast: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
			};
			const mod = await import('@/uniapp');
			toast = mod.toast;

			toast.show('支付宝测试');
		});
		const myApi = (global as any).my;
		expect(myApi.showToast).toHaveBeenCalledWith({
			content: '支付宝测试',
			type: 'none',
			duration: 2000,
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('toast.success 应使用 type=success', async () => {
		let toast: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
			};
			const mod = await import('@/uniapp');
			toast = mod.toast;

			toast.success('成功');
		});
		expect((global as any).my.showToast).toHaveBeenCalledWith({
			content: '成功',
			type: 'success',
			duration: 2000,
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('toast.error 应使用 type=fail', async () => {
		let toast: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
			};
			const mod = await import('@/uniapp');
			toast = mod.toast;

			toast.error('错误');
		});
		expect((global as any).my.showToast).toHaveBeenCalledWith({
			content: '错误',
			type: 'fail',
			duration: 2000,
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('toast.loading 应使用 content 参数', async () => {
		let toast: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
			};
			const mod = await import('@/uniapp');
			toast = mod.toast;

			toast.loading('加载中...');
		});
		expect((global as any).my.showLoading).toHaveBeenCalledWith({
			content: '加载中...',
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('storage.set 应使用对象参数 { key, data }', async () => {
		let storage: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
			};
			const mod = await import('@/uniapp');
			storage = mod.storage;

			storage.set('key1', 'hello');
		});
		expect((global as any).my.setStorageSync).toHaveBeenCalledWith({
			key: 'key1',
			data: expect.any(String),
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('storage.get 应使用对象参数 { key } 并解构 data', async () => {
		let storage: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn().mockReturnValue({ data: JSON.stringify({ value: 'hello', expire: -1 }) }),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
			};
			const mod = await import('@/uniapp');
			storage = mod.storage;

			const result = storage.get('key1');
			expect(result).toBe('hello');
		});
		expect((global as any).my.getStorageSync).toHaveBeenCalledWith({ key: 'key1' });
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('storage.remove 应使用对象参数 { key }', async () => {
		let storage: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				setStorageSync: jest.fn(),
				getStorageSync: jest.fn(),
				removeStorageSync: jest.fn(),
				clearStorageSync: jest.fn(),
				showToast: jest.fn(),
				showLoading: jest.fn(),
				hideLoading: jest.fn(),
				showModal: jest.fn(),
			};
			const mod = await import('@/uniapp');
			storage = mod.storage;

			storage.remove('key1');
		});
		expect((global as any).my.removeStorageSync).toHaveBeenCalledWith({ key: 'key1' });
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('permission.camera 支付宝已授权应通过 getSetting 返回 true', async () => {
		let permission: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				getSetting: jest.fn().mockImplementation((opts: any) => opts.success({ authSetting: { 'scope.camera': true } })),
				authorize: jest.fn(),
			};
			const mod = await import('@/uniapp');
			permission = mod.permission;

			const result = await permission.camera();
			expect(result).toBe(true);
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('permission.camera 支付宝未授权应调 authorize 弹框', async () => {
		let permission: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				getSetting: jest.fn().mockImplementation((opts: any) => opts.success({ authSetting: { 'scope.camera': false } })),
				authorize: jest.fn().mockImplementation((opts: any) => opts.success()),
			};
			const mod = await import('@/uniapp');
			permission = mod.permission;

			const result = await permission.camera();
			expect(result).toBe(true);
			expect((global as any).my.authorize).toHaveBeenCalledWith(
				expect.objectContaining({ scope: 'scope.camera' })
			);
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('permission.camera 支付宝 authorize 拒绝应返回 false', async () => {
		let permission: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				getSetting: jest.fn().mockImplementation((opts: any) => opts.success({ authSetting: { 'scope.camera': false } })),
				authorize: jest.fn().mockImplementation((opts: any) => opts.fail()),
			};
			const mod = await import('@/uniapp');
			permission = mod.permission;

			const result = await permission.camera();
			expect(result).toBe(false);
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('env.platform 支付宝应返回正确信息', async () => {
		let envModule: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {};
			const mod = await import('@/uniapp');
			envModule = mod.env;

			const info = envModule.platform();
			expect(info.isAlipay).toBe(true);
			expect(info.isWechat).toBe(false);
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('env.version 支付宝应调用 getRunScene', async () => {
		let envModule: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				getRunScene: jest.fn().mockImplementation((opts: any) => opts.success({ envVersion: 'release' })),
			};
			const mod = await import('@/uniapp');
			envModule = mod.env;

			const ver = await envModule.version();
			expect(ver).toEqual({ v: 'release', d: '正式版', s: 'alipay' });
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('env.launchOptions 支付宝应调用 getLaunchOptionsSync', async () => {
		let envModule: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {
				getLaunchOptionsSync: jest.fn().mockReturnValue({ query: { id: '1' } }),
			};
			const mod = await import('@/uniapp');
			envModule = mod.env;

			const result = envModule.launchOptions();
			expect(result).toEqual({ query: { id: '1' } });
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});

	it('env.scanParams 支付宝应解析 qrCode', async () => {
		let envModule: any;
		await jest.isolateModulesAsync(async () => {
			delete (global as any).wx;
			(global as any).my = {};
			const mod = await import('@/uniapp');
			envModule = mod.env;

			const cb = jest.fn();
			envModule.scanParams({ query: { qrCode: 'https://example.com?a=1' } }, cb);
			expect(cb).toHaveBeenCalledWith('https://example.com?a=1', { a: '1' });
		});
		delete (global as any).my;
		(global as any).wx = mockWx;
	});
});
