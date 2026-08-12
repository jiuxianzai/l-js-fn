/**
 * uniapp 平台适配器单元测试
 * 直接测试四个工厂函数（wechat/alipay/h5/app）的全量方法与分支
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { createWechatAdapter, createAlipayAdapter, createH5Adapter, createAppAdapter } from '@/uniapp';

/** 生成带全部 API 的 mock 对象 */
function createMockApi(extra: Record<string, any> = {}): Record<string, any> {
	const mockFs = {
		writeFile: jest.fn((opts: any) => opts.success?.()),
		readFile: jest.fn((opts: any) => opts.success?.({ data: 'file-content' })),
		access: jest.fn((opts: any) => opts.success?.()),
		unlink: jest.fn((opts: any) => opts.success?.()),
	};
	return {
		setStorageSync: jest.fn(),
		getStorageSync: jest.fn(),
		removeStorageSync: jest.fn(),
		clearStorageSync: jest.fn(),
		showToast: jest.fn(),
		showLoading: jest.fn(),
		hideLoading: jest.fn(),
		showModal: jest.fn(),
		authorize: jest.fn(),
		getSetting: jest.fn(),
		openSetting: jest.fn(),
		getFileSystemManager: jest.fn().mockReturnValue(mockFs),
		env: { USER_DATA_PATH: 'user://data' },
		...extra,
	};
}

describe('uniapp 平台适配器', () => {
	describe('createH5Adapter', () => {
		let api: any;
		let adapter: any;

		beforeEach(() => {
			api = createMockApi();
			adapter = createH5Adapter(api);
		});

		it('应标识为 h5 平台并持有 api', () => {
			expect(adapter.name).toBe('h5');
			expect(adapter.api).toBe(api);
		});

		describe('存储', () => {
			it('setStorageSync 透传位置参数', () => {
				adapter.setStorageSync('k', 'v');
				expect(api.setStorageSync).toHaveBeenCalledWith('k', 'v');
			});

			it('getStorageSync 字符串返回原值', () => {
				api.getStorageSync.mockReturnValue('value');
				expect(adapter.getStorageSync('k')).toBe('value');
			});

			it('getStorageSync 空字符串返回 null', () => {
				api.getStorageSync.mockReturnValue('');
				expect(adapter.getStorageSync('k')).toBeNull();
			});

			it('getStorageSync 非字符串返回 null', () => {
				api.getStorageSync.mockReturnValue(123);
				expect(adapter.getStorageSync('k')).toBeNull();
			});

			it('removeStorageSync 与 clearStorageSync 透传', () => {
				adapter.removeStorageSync('k');
				adapter.clearStorageSync();
				expect(api.removeStorageSync).toHaveBeenCalledWith('k');
				expect(api.clearStorageSync).toHaveBeenCalled();
			});
		});

		describe('toast', () => {
			it('showToast 支持图标降级（fail→error）', () => {
				adapter.showToast('标题', 'fail', 2000, true);
				expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'error', duration: 2000, mask: true });
			});

			it('showToast 不支持图标降级为 none', () => {
				adapter.showToast('标题', 'weird', 2000, false);
				expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'none', duration: 2000, mask: false });
			});

			it('showToast 支持 image 透传', () => {
				adapter.showToast('标题', 'none', 2000, false, 'https://img.png');
				expect(api.showToast).toHaveBeenCalledWith({
					title: '标题',
					icon: 'none',
					duration: 2000,
					mask: false,
					image: 'https://img.png',
				});
			});

			it('showToast 支持 exception→none 降级', () => {
				adapter.showToast('标题', 'exception', 2000, false);
				expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'none', duration: 2000, mask: false });
			});

			it('showLoading / hideLoading 透传', () => {
				adapter.showLoading('加载中', true);
				adapter.hideLoading();
				expect(api.showLoading).toHaveBeenCalledWith({ title: '加载中', mask: true });
				expect(api.hideLoading).toHaveBeenCalled();
			});
		});

		describe('权限', () => {
			it('checkPermission 恒为 true', async () => {
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(true);
			});

			it('requestPermission 恒为 true', async () => {
				await expect(adapter.requestPermission('scope.camera')).resolves.toBe(true);
			});
		});

		describe('环境', () => {
			it('getEnvVersion 抛出不支持异常', async () => {
				await expect(adapter.getEnvVersion()).rejects.toThrow('H5 环境不支持获取环境版本');
			});

			it('getLaunchOptionsSync 返回 null', () => {
				expect(adapter.getLaunchOptionsSync()).toBeNull();
			});

			it('extractScanUrl 返回 undefined', () => {
				expect(adapter.extractScanUrl({ q: 'x' })).toBeUndefined();
			});
		});

		describe('文件系统', () => {
			it('getFileSystemManager 返回管理器', () => {
				expect(adapter.getFileSystemManager()).toBe(api.getFileSystemManager());
			});

			it('getFileSystemManager 缺失时返回 null', () => {
				const a: any = createH5Adapter(createMockApi({ getFileSystemManager: undefined }));
				expect(a.getFileSystemManager()).toBeNull();
			});

			it('getUserDataPath 返回路径', () => {
				expect(adapter.getUserDataPath()).toBe('user://data');
			});

			it('getUserDataPath 缺失返回空字符串', () => {
				const a: any = createH5Adapter(createMockApi({ env: {} }));
				expect(a.getUserDataPath()).toBe('');
			});

			it('fileWrite 成功 resolve', async () => {
				await expect(adapter.fileWrite('/a.txt', 'hi')).resolves.toBeUndefined();
			});

			it('fileWrite 失败 reject', async () => {
				const a: any = createH5Adapter(createMockApi());
				a.api.getFileSystemManager().writeFile.mockImplementationOnce((opts: any) => opts.fail?.(new Error('w')));
				await expect(a.fileWrite('/a.txt', 'hi')).rejects.toThrow('w');
			});

			it('fileRead 返回内容', async () => {
				await expect(adapter.fileRead('/a.txt')).resolves.toBe('file-content');
			});

			it('fileRead 无 data 时返回空字符串', async () => {
				const a: any = createH5Adapter(createMockApi());
				a.api.getFileSystemManager().readFile.mockImplementationOnce((opts: any) => opts.success?.({}));
				await expect(a.fileRead('/a.txt')).resolves.toBe('');
			});

			it('fileRead 失败 reject', async () => {
				const a: any = createH5Adapter(createMockApi());
				a.api.getFileSystemManager().readFile.mockImplementationOnce((opts: any) => opts.fail?.(new Error('r')));
				await expect(a.fileRead('/a.txt')).rejects.toThrow('r');
			});

			it('fileAccess 成功 resolve true', async () => {
				await expect(adapter.fileAccess('/a.txt')).resolves.toBe(true);
			});

			it('fileAccess 失败 resolve false', async () => {
				const a: any = createH5Adapter(createMockApi());
				a.api.getFileSystemManager().access.mockImplementationOnce((opts: any) => opts.fail?.());
				await expect(a.fileAccess('/a.txt')).resolves.toBe(false);
			});

			it('fileRemove 成功 resolve', async () => {
				await expect(adapter.fileRemove('/a.txt')).resolves.toBeUndefined();
			});

			it('fileRemove 失败 reject', async () => {
				const a: any = createH5Adapter(createMockApi());
				a.api.getFileSystemManager().unlink.mockImplementationOnce((opts: any) => opts.fail?.(new Error('d')));
				await expect(a.fileRemove('/a.txt')).rejects.toThrow('d');
			});
		});
	});

	describe('createAppAdapter', () => {
		let api: any;
		let adapter: any;

		beforeEach(() => {
			api = createMockApi();
			adapter = createAppAdapter(api);
		});

		it('应标识为 app 平台', () => {
			expect(adapter.name).toBe('app');
			expect(adapter.api).toBe(api);
		});

		it('setStorageSync 透传', () => {
			adapter.setStorageSync('k', 'v');
			expect(api.setStorageSync).toHaveBeenCalledWith('k', 'v');
		});

		it('getStorageSync 返回字符串', () => {
			api.getStorageSync.mockReturnValue('v');
			expect(adapter.getStorageSync('k')).toBe('v');
		});

		it('getStorageSync 空返回 null', () => {
			api.getStorageSync.mockReturnValue('');
			expect(adapter.getStorageSync('k')).toBeNull();
		});

		it('getStorageSync 非字符串返回 null', () => {
			api.getStorageSync.mockReturnValue(123);
			expect(adapter.getStorageSync('k')).toBeNull();
		});

		it('removeStorageSync / clearStorageSync 透传', () => {
			adapter.removeStorageSync('k');
			adapter.clearStorageSync();
			expect(api.removeStorageSync).toHaveBeenCalledWith('k');
			expect(api.clearStorageSync).toHaveBeenCalled();
		});

		it('showToast 图标降级', () => {
			adapter.showToast('标题', 'fail', 1500, true, undefined);
			expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'error', duration: 1500, mask: true });
		});

		it('showToast 不支持图标降级为 none 并透传 image', () => {
			adapter.showToast('标题', 'unknown', 1500, false, 'img');
			expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'none', duration: 1500, mask: false, image: 'img' });
		});

		it('showLoading / hideLoading 透传', () => {
			adapter.showLoading('加载中', false);
			adapter.hideLoading();
			expect(api.showLoading).toHaveBeenCalledWith({ title: '加载中', mask: false });
			expect(api.hideLoading).toHaveBeenCalled();
		});

		it('checkPermission / requestPermission 恒为 true', async () => {
			await expect(adapter.checkPermission('scope.camera')).resolves.toBe(true);
			await expect(adapter.requestPermission('scope.camera')).resolves.toBe(true);
		});

		it('getEnvVersion 抛出不支持异常', async () => {
			await expect(adapter.getEnvVersion()).rejects.toThrow('App 环境不支持获取环境版本');
		});

		it('getLaunchOptionsSync 返回 null，extractScanUrl 返回 undefined', () => {
			expect(adapter.getLaunchOptionsSync()).toBeNull();
			expect(adapter.extractScanUrl({})).toBeUndefined();
		});

		it('文件系统方法全链路', async () => {
			expect(adapter.getFileSystemManager()).toBe(api.getFileSystemManager());
			expect(adapter.getUserDataPath()).toBe('user://data');
			await expect(adapter.fileWrite('/a', 'x')).resolves.toBeUndefined();
			await expect(adapter.fileRead('/a')).resolves.toBe('file-content');
			await expect(adapter.fileAccess('/a')).resolves.toBe(true);
			await expect(adapter.fileRemove('/a')).resolves.toBeUndefined();
		});

		it('fileRead 无 data 时返回空字符串', async () => {
			api.getFileSystemManager().readFile.mockImplementationOnce((o: any) => o.success?.({}));
			await expect(adapter.fileRead('/a')).resolves.toBe('');
		});

		it('文件方法失败分支', async () => {
			const fs = api.getFileSystemManager();
			fs.writeFile.mockImplementationOnce((o: any) => o.fail?.(new Error('w')));
			fs.readFile.mockImplementationOnce((o: any) => o.fail?.(new Error('r')));
			fs.access.mockImplementationOnce((o: any) => o.fail?.());
			fs.unlink.mockImplementationOnce((o: any) => o.fail?.(new Error('d')));
			await expect(adapter.fileWrite('/a', 'x')).rejects.toThrow('w');
			await expect(adapter.fileRead('/a')).rejects.toThrow('r');
			await expect(adapter.fileAccess('/a')).resolves.toBe(false);
			await expect(adapter.fileRemove('/a')).rejects.toThrow('d');
		});

		it('getFileSystemManager 缺失返回 null，getUserDataPath 缺失返回空', () => {
			const a: any = createAppAdapter(createMockApi({ getFileSystemManager: undefined, env: {} }));
			expect(a.getFileSystemManager()).toBeNull();
			expect(a.getUserDataPath()).toBe('');
		});
	});

	describe('createWechatAdapter', () => {
		let api: any;
		let adapter: any;

		beforeEach(() => {
			api = createMockApi();
			adapter = createWechatAdapter(api);
		});

		it('应标识为 wechat 平台', () => {
			expect(adapter.name).toBe('wechat');
			expect(adapter.api).toBe(api);
		});

		describe('存储', () => {
			it('setStorageSync 透传位置参数', () => {
				adapter.setStorageSync('k', 'v');
				expect(api.setStorageSync).toHaveBeenCalledWith('k', 'v');
			});

			it('getStorageSync 字符串返回原值，空返回 null', () => {
				api.getStorageSync.mockReturnValue('value');
				expect(adapter.getStorageSync('k')).toBe('value');
				api.getStorageSync.mockReturnValue('');
				expect(adapter.getStorageSync('k')).toBeNull();
			});

			it('removeStorageSync / clearStorageSync 透传', () => {
				adapter.removeStorageSync('k');
				adapter.clearStorageSync();
				expect(api.removeStorageSync).toHaveBeenCalledWith('k');
				expect(api.clearStorageSync).toHaveBeenCalled();
			});
		});

		describe('toast', () => {
			it('showToast 图标降级 fail→error', () => {
				adapter.showToast('标题', 'fail', 2000, true);
				expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'error', duration: 2000, mask: true });
			});

			it('showToast 未知图标降级 none 并透传 image', () => {
				adapter.showToast('标题', 'unknown', 2000, false, 'img');
				expect(api.showToast).toHaveBeenCalledWith({ title: '标题', icon: 'none', duration: 2000, mask: false, image: 'img' });
			});

			it('showLoading / hideLoading 透传', () => {
				adapter.showLoading('加载中', true);
				adapter.hideLoading();
				expect(api.showLoading).toHaveBeenCalledWith({ title: '加载中', mask: true });
				expect(api.hideLoading).toHaveBeenCalled();
			});
		});

		describe('文件系统', () => {
			it('getFileSystemManager / getUserDataPath', () => {
				expect(adapter.getFileSystemManager()).toBe(api.getFileSystemManager());
				expect(adapter.getUserDataPath()).toBe('user://data');
			});

			it('wechat 缺失分支：fs 返回 null、路径返回空', () => {
				const a: any = createWechatAdapter(createMockApi({ getFileSystemManager: undefined, env: {} }));
				expect(a.getFileSystemManager()).toBeNull();
				expect(a.getUserDataPath()).toBe('');
			});

			it('fileWrite / fileRead / fileAccess / fileRemove 成功分支', async () => {
				await expect(adapter.fileWrite('/a', 'x')).resolves.toBeUndefined();
				await expect(adapter.fileRead('/a')).resolves.toBe('file-content');
				await expect(adapter.fileAccess('/a')).resolves.toBe(true);
				await expect(adapter.fileRemove('/a')).resolves.toBeUndefined();
			});

			it('文件方法失败分支', async () => {
				const fs = api.getFileSystemManager();
				fs.writeFile.mockImplementationOnce((o: any) => o.fail?.(new Error('w')));
				fs.readFile.mockImplementationOnce((o: any) => o.fail?.(new Error('r')));
				fs.access.mockImplementationOnce((o: any) => o.fail?.());
				fs.unlink.mockImplementationOnce((o: any) => o.fail?.(new Error('d')));
				await expect(adapter.fileWrite('/a', 'x')).rejects.toThrow('w');
				await expect(adapter.fileRead('/a')).rejects.toThrow('r');
				await expect(adapter.fileAccess('/a')).resolves.toBe(false);
				await expect(adapter.fileRemove('/a')).rejects.toThrow('d');
			});

			it('fileRead 无 data 时返回空字符串', async () => {
				api.getFileSystemManager().readFile.mockImplementationOnce((o: any) => o.success?.({}));
				await expect(adapter.fileRead('/a')).resolves.toBe('');
			});
		});

		describe('权限', () => {
			it('checkPermission 已授权返回 true', async () => {
				api.getSetting.mockImplementation((o: any) => o.success({ authSetting: { 'scope.camera': true } }));
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(true);
			});

			it('checkPermission 未授权返回 false', async () => {
				api.getSetting.mockImplementation((o: any) => o.success({ authSetting: { 'scope.camera': false } }));
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(false);
			});

			it('checkPermission getSetting fail 返回 false', async () => {
				api.getSetting.mockImplementation((o: any) => o.fail?.(new Error('e')));
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(false);
			});

			it('checkPermission 缺 getSetting 返回 false', async () => {
				const a: any = createWechatAdapter(createMockApi({ getSetting: undefined }));
				await expect(a.checkPermission('scope.camera')).resolves.toBe(false);
			});

			it('requestPermission 成功返回 true', async () => {
				api.authorize.mockImplementation((o: any) => o.success());
				await expect(adapter.requestPermission('scope.camera')).resolves.toBe(true);
			});

			it('requestPermission 拒绝返回 false', async () => {
				api.authorize.mockImplementation((o: any) => o.fail?.());
				await expect(adapter.requestPermission('scope.camera')).resolves.toBe(false);
			});

			it('requestPermission 缺 authorize 返回 false', async () => {
				const a: any = createWechatAdapter(createMockApi({ authorize: undefined }));
				await expect(a.requestPermission('scope.camera')).resolves.toBe(false);
			});

			it('openSetting 成功返回 true', async () => {
				api.openSetting.mockImplementation((o: any) => o.success());
				await expect(adapter.openSetting()).resolves.toBe(true);
			});

			it('openSetting 失败返回 false', async () => {
				api.openSetting.mockImplementation((o: any) => o.fail?.());
				await expect(adapter.openSetting()).resolves.toBe(false);
			});

			it('openSetting 缺 api 返回 false', async () => {
				const a: any = createWechatAdapter(createMockApi({ openSetting: undefined }));
				await expect(a.openSetting()).resolves.toBe(false);
			});
		});

		describe('环境', () => {
			it('getEnvVersion 缺省返回 release', async () => {
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'release', d: '正式版', s: 'wechat' });
			});

			it('getEnvVersion 支持 __wxConfig develop', async () => {
				(global as any).__wxConfig = { envVersion: 'develop' };
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'develop', d: '开发版', s: 'wechat' });
				delete (global as any).__wxConfig;
			});

			it('getEnvVersion 支持 trial', async () => {
				(global as any).__wxConfig = { envVersion: 'trial' };
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'trial', d: '体验版', s: 'wechat' });
				delete (global as any).__wxConfig;
			});

			it('getEnvVersion 未知版本 d 为空', async () => {
				(global as any).__wxConfig = { envVersion: 'unknown' };
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'unknown', d: '', s: 'wechat' });
				delete (global as any).__wxConfig;
			});

			it('getLaunchOptionsSync 返回启动参数', () => {
				api.getLaunchOptionsSync = jest.fn().mockReturnValue({ scene: 1001 });
				expect(adapter.getLaunchOptionsSync()).toEqual({ scene: 1001 });
			});

			it('getLaunchOptionsSync 缺失返回 null', () => {
				expect(adapter.getLaunchOptionsSync()).toBeNull();
			});

			it('extractScanUrl 解码 q 参数', () => {
				expect(adapter.extractScanUrl({ q: encodeURIComponent('https://a.com?x=1') })).toBe('https://a.com?x=1');
			});

			it('extractScanUrl 解码失败原样返回', () => {
				expect(adapter.extractScanUrl({ q: '%E0%A4%A' })).toBe('%E0%A4%A');
			});

			it('extractScanUrl 无 q 返回 undefined', () => {
				expect(adapter.extractScanUrl({})).toBeUndefined();
				expect(adapter.extractScanUrl(undefined)).toBeUndefined();
			});
		});
	});

	describe('createAlipayAdapter', () => {
		let api: any;
		let adapter: any;

		beforeEach(() => {
			api = createMockApi();
			adapter = createAlipayAdapter(api);
		});

		it('应标识为 alipay 平台', () => {
			expect(adapter.name).toBe('alipay');
			expect(adapter.api).toBe(api);
		});

		describe('存储', () => {
			it('setStorageSync 使用对象参数', () => {
				adapter.setStorageSync('k', 'v');
				expect(api.setStorageSync).toHaveBeenCalledWith({ key: 'k', data: 'v' });
			});

			it('getStorageSync 解构 data', () => {
				api.getStorageSync.mockReturnValue({ data: 'v' });
				expect(adapter.getStorageSync('k')).toBe('v');
			});

			it('getStorageSync data 为空返回 null', () => {
				api.getStorageSync.mockReturnValue({ data: '' });
				expect(adapter.getStorageSync('k')).toBeNull();
			});

			it('getStorageSync 无 data 返回 null', () => {
				api.getStorageSync.mockReturnValue({});
				expect(adapter.getStorageSync('k')).toBeNull();
			});

			it('removeStorageSync 使用对象参数', () => {
				adapter.removeStorageSync('k');
				expect(api.removeStorageSync).toHaveBeenCalledWith({ key: 'k' });
			});

			it('clearStorageSync 透传', () => {
				adapter.clearStorageSync();
				expect(api.clearStorageSync).toHaveBeenCalled();
			});
		});

		describe('toast', () => {
			it('showToast 映射 error→fail', () => {
				adapter.showToast('标题', 'error', 2000);
				expect(api.showToast).toHaveBeenCalledWith({ content: '标题', type: 'fail', duration: 2000 });
			});

			it('showToast 未知图标降级 none 并透传 image', () => {
				adapter.showToast('标题', 'unknown', 2000, true, 'img');
				expect(api.showToast).toHaveBeenCalledWith({ content: '标题', type: 'none', duration: 2000, image: 'img' });
			});

			it('showToast exception 映射 exception', () => {
				adapter.showToast('标题', 'exception', 2000);
				expect(api.showToast).toHaveBeenCalledWith({ content: '标题', type: 'exception', duration: 2000 });
			});

			it('showLoading 使用 content', () => {
				adapter.showLoading('加载中', true);
				expect(api.showLoading).toHaveBeenCalledWith({ content: '加载中' });
			});

			it('hideLoading 透传', () => {
				adapter.hideLoading();
				expect(api.hideLoading).toHaveBeenCalled();
			});
		});

		describe('文件系统', () => {
			it('getFileSystemManager / getUserDataPath', () => {
				expect(adapter.getFileSystemManager()).toBe(api.getFileSystemManager());
				expect(adapter.getUserDataPath()).toBe('user://data');
			});

			it('alipay 缺失分支：fs 返回 null、路径返回空', () => {
				const a: any = createAlipayAdapter(createMockApi({ getFileSystemManager: undefined, env: {} }));
				expect(a.getFileSystemManager()).toBeNull();
				expect(a.getUserDataPath()).toBe('');
			});

			it('fileWrite / fileRead / fileAccess / fileRemove 成功分支', async () => {
				await expect(adapter.fileWrite('/a', 'x')).resolves.toBeUndefined();
				await expect(adapter.fileRead('/a')).resolves.toBe('file-content');
				await expect(adapter.fileAccess('/a')).resolves.toBe(true);
				await expect(adapter.fileRemove('/a')).resolves.toBeUndefined();
			});

			it('文件方法失败分支', async () => {
				const fs = api.getFileSystemManager();
				fs.writeFile.mockImplementationOnce((o: any) => o.fail?.(new Error('w')));
				fs.readFile.mockImplementationOnce((o: any) => o.fail?.(new Error('r')));
				fs.access.mockImplementationOnce((o: any) => o.fail?.());
				fs.unlink.mockImplementationOnce((o: any) => o.fail?.(new Error('d')));
				await expect(adapter.fileWrite('/a', 'x')).rejects.toThrow('w');
				await expect(adapter.fileRead('/a')).rejects.toThrow('r');
				await expect(adapter.fileAccess('/a')).resolves.toBe(false);
				await expect(adapter.fileRemove('/a')).rejects.toThrow('d');
			});

			it('fileRead 无 data 时返回空字符串', async () => {
				api.getFileSystemManager().readFile.mockImplementationOnce((o: any) => o.success?.({}));
				await expect(adapter.fileRead('/a')).resolves.toBe('');
			});
		});

		describe('权限', () => {
			it('checkPermission 已授权返回 true', async () => {
				api.getSetting.mockImplementation((o: any) => o.success({ authSetting: { 'scope.camera': true } }));
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(true);
			});

			it('checkPermission getSetting fail 返回 false', async () => {
				api.getSetting.mockImplementation((o: any) => o.fail?.(new Error('e')));
				await expect(adapter.checkPermission('scope.camera')).resolves.toBe(false);
			});

			it('checkPermission 缺 getSetting 返回 false', async () => {
				const a: any = createAlipayAdapter(createMockApi({ getSetting: undefined }));
				await expect(a.checkPermission('scope.camera')).resolves.toBe(false);
			});

			it('requestPermission 成功返回 true', async () => {
				api.authorize.mockImplementation((o: any) => o.success());
				await expect(adapter.requestPermission('scope.camera')).resolves.toBe(true);
			});

			it('requestPermission 拒绝返回 false', async () => {
				api.authorize.mockImplementation((o: any) => o.fail?.());
				await expect(adapter.requestPermission('scope.camera')).resolves.toBe(false);
			});

			it('requestPermission 缺 authorize 返回 false', async () => {
				const a: any = createAlipayAdapter(createMockApi({ authorize: undefined }));
				await expect(a.requestPermission('scope.camera')).resolves.toBe(false);
			});
		});

		describe('环境', () => {
			it('getEnvVersion 返回版本信息', async () => {
				api.getRunScene = jest.fn().mockImplementation((o: any) => o.success({ envVersion: 'release' }));
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'release', d: '正式版', s: 'alipay' });
			});

			it('getEnvVersion trial', async () => {
				api.getRunScene = jest.fn().mockImplementation((o: any) => o.success({ envVersion: 'trial' }));
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'trial', d: '体验版', s: 'alipay' });
			});

			it('getEnvVersion 未知版本 d 为空', async () => {
				api.getRunScene = jest.fn().mockImplementation((o: any) => o.success({ envVersion: 'unknown' }));
				await expect(adapter.getEnvVersion()).resolves.toEqual({ v: 'unknown', d: '', s: 'alipay' });
			});

			it('getEnvVersion fail 时 reject', async () => {
				api.getRunScene = jest.fn().mockImplementation((o: any) => o.fail?.(new Error('f')));
				await expect(adapter.getEnvVersion()).rejects.toThrow('f');
			});

			it('getEnvVersion 缺 getRunScene 抛出异常', async () => {
				await expect(adapter.getEnvVersion()).rejects.toThrow('env.version');
			});

			it('getLaunchOptionsSync 返回启动参数', () => {
				api.getLaunchOptionsSync = jest.fn().mockReturnValue({ scene: 1001 });
				expect(adapter.getLaunchOptionsSync()).toEqual({ scene: 1001 });
			});

			it('getLaunchOptionsSync 缺失返回 null', () => {
				expect(adapter.getLaunchOptionsSync()).toBeNull();
			});

			it('extractScanUrl 取 qrCode', () => {
				expect(adapter.extractScanUrl({ query: { qrCode: 'https://a.com' } })).toBe('https://a.com');
			});

			it('extractScanUrl 取顶层 qrCode', () => {
				expect(adapter.extractScanUrl({ qrCode: 'https://a.com' })).toBe('https://a.com');
			});

			it('extractScanUrl 无参数返回 undefined', () => {
				expect(adapter.extractScanUrl(undefined)).toBeUndefined();
				expect(adapter.extractScanUrl({})).toBeUndefined();
			});
		});
	});
});

describe('uniapp 平台适配器 - 剪贴板与设备', () => {
	function clipboardApi(extra: Record<string, any> = {}): { api: any; adapter: any } {
		const api = createMockApi({
			setClipboardData: jest.fn((o: any) => o.success?.()),
			getClipboardData: jest.fn((o: any) => o.success?.({ data: 'clip', text: 'clip' })),
			...extra,
		});
		return { api, adapter: createWechatAdapter(api) as any };
	}

	describe('createWechatAdapter 剪贴板', () => {
		let api: any;
		let adapter: any;

		beforeEach(() => {
			const ctx = clipboardApi();
			api = ctx.api;
			adapter = ctx.adapter;
		});

		it('copyToClipboard 成功 resolve true', async () => {
			await expect(adapter.copyToClipboard('hello')).resolves.toBe(true);
			expect(api.setClipboardData).toHaveBeenCalledWith(expect.objectContaining({ data: 'hello' }));
		});

		it('copyToClipboard 失败 resolve false', async () => {
			api.setClipboardData.mockImplementationOnce((o: any) => o.fail?.(new Error('e')));
			await expect(adapter.copyToClipboard('hello')).resolves.toBe(false);
		});

		it('copyToClipboard 缺 api 返回 false', async () => {
			const a: any = createWechatAdapter(createMockApi({ setClipboardData: undefined }));
			await expect(a.copyToClipboard('hello')).resolves.toBe(false);
		});

		it('readClipboard 返回 data', async () => {
			await expect(adapter.readClipboard()).resolves.toBe('clip');
		});

		it('readClipboard 缺 api 返回空字符串', async () => {
			const a: any = createWechatAdapter(createMockApi({ getClipboardData: undefined }));
			await expect(a.readClipboard()).resolves.toBe('');
		});

		it('readClipboard 失败 reject', async () => {
			api.getClipboardData.mockImplementationOnce((o: any) => o.fail?.(new Error('r')));
			await expect(adapter.readClipboard()).rejects.toThrow('r');
		});

		it('getMenuButtonInfo 返回胶囊位置', () => {
			const rect = { left: 278, top: 25, width: 87, height: 32 };
			api.getMenuButtonBoundingClientRect = jest.fn().mockReturnValue(rect);
			expect(adapter.getMenuButtonInfo()).toEqual(rect);
		});

		it('getMenuButtonInfo 缺失返回 null', () => {
			expect(adapter.getMenuButtonInfo()).toBeNull();
		});
	});

	describe('createAlipayAdapter 剪贴板', () => {
		it('copyToClipboard 使用 text 参数并调用 my.setClipboard', async () => {
			const api = createMockApi({ setClipboard: jest.fn((o: any) => o.success?.()) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.copyToClipboard('hello')).resolves.toBe(true);
			expect(api.setClipboard).toHaveBeenCalledWith(expect.objectContaining({ text: 'hello' }));
		});

		it('copyToClipboard 失败 resolve false', async () => {
			const api = createMockApi({ setClipboard: jest.fn((o: any) => o.fail?.()) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.copyToClipboard('hello')).resolves.toBe(false);
		});

		it('copyToClipboard 缺 api 返回 false', async () => {
			const adapter = createAlipayAdapter(createMockApi({ setClipboard: undefined })) as any;
			await expect(adapter.copyToClipboard('hello')).resolves.toBe(false);
		});

		it('readClipboard 取 text 字段并调用 my.getClipboard', async () => {
			const api = createMockApi({ getClipboard: jest.fn((o: any) => o.success?.({ text: 'ali' })) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.readClipboard()).resolves.toBe('ali');
			expect(api.getClipboard).toHaveBeenCalled();
		});

		it('readClipboard 缺 api 返回空字符串', async () => {
			const adapter = createAlipayAdapter(createMockApi({ getClipboard: undefined })) as any;
			await expect(adapter.readClipboard()).resolves.toBe('');
		});

		it('readClipboard 失败 reject', async () => {
			const api = createMockApi({ getClipboard: jest.fn((o: any) => o.fail?.(new Error('r'))) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.readClipboard()).rejects.toThrow('r');
		});
	});

	describe('createAlipayAdapter 设备', () => {
		it('getMenuButtonInfo 返回胶囊位置', () => {
			const rect = { left: 268, top: 26, width: 90, height: 30 };
			const api = createMockApi({ getMenuButtonBoundingClientRect: jest.fn().mockReturnValue(rect) });
			const adapter = createAlipayAdapter(api) as any;
			expect(adapter.getMenuButtonInfo()).toEqual(rect);
		});

		it('getMenuButtonInfo 缺失返回 null', () => {
			const adapter = createAlipayAdapter(createMockApi()) as any;
			expect(adapter.getMenuButtonInfo()).toBeNull();
		});
	});

	describe('createH5Adapter / createAppAdapter 剪贴板', () => {
		for (const [label, factory] of [
			['h5', createH5Adapter],
			['app', createAppAdapter],
		] as const) {
			it(`${label} copyToClipboard 成功 resolve true`, async () => {
				const api = createMockApi({ setClipboardData: jest.fn((o: any) => o.success?.()) });
				const adapter = factory(api) as any;
				await expect(adapter.copyToClipboard('hello')).resolves.toBe(true);
				expect(api.setClipboardData).toHaveBeenCalledWith(expect.objectContaining({ data: 'hello' }));
			});

			it(`${label} copyToClipboard 缺 api 返回 false`, async () => {
				const adapter = factory(createMockApi({ setClipboardData: undefined })) as any;
				await expect(adapter.copyToClipboard('hello')).resolves.toBe(false);
			});

			it(`${label} readClipboard 返回 data`, async () => {
				const api = createMockApi({ getClipboardData: jest.fn((o: any) => o.success?.({ data: 'clip' })) });
				const adapter = factory(api) as any;
				await expect(adapter.readClipboard()).resolves.toBe('clip');
			});

			it(`${label} readClipboard 失败 reject`, async () => {
				const api = createMockApi({ getClipboardData: jest.fn((o: any) => o.fail?.(new Error('r'))) });
				const adapter = factory(api) as any;
				await expect(adapter.readClipboard()).rejects.toThrow('r');
			});
		}
	});
});

describe('uniapp 平台适配器 - showActionSheet 操作菜单', () => {
	function sheetApi(extra: Record<string, any> = {}): { api: any; adapter: any } {
		const api = createMockApi({ showActionSheet: jest.fn((o: any) => o.success?.({ tapIndex: 1 })), ...extra });
		return { api, adapter: createH5Adapter(api) as any };
	}

	describe('微信 / H5 / App（itemList + tapIndex）', () => {
		for (const [label, factory] of [
			['wechat', createWechatAdapter],
			['h5', createH5Adapter],
			['app', createAppAdapter],
		] as const) {
			let api: any;
			let adapter: any;

			beforeEach(() => {
				const ctx = sheetApi();
				api = ctx.api;
				adapter = factory(api) as any;
			});

			it(`${label} 返回 tapIndex 并透传 title/itemColor`, async () => {
				await expect(adapter.showActionSheet({ itemList: ['a', 'b'], title: '标题', itemColor: '#ff0000' })).resolves.toBe(1);
				expect(api.showActionSheet).toHaveBeenCalledWith(
					expect.objectContaining({ itemList: ['a', 'b'], title: '标题', itemColor: '#ff0000' })
				);
			});

			it(`${label} 取消返回 null`, async () => {
				api.showActionSheet.mockImplementationOnce((o: any) => o.fail?.());
				await expect(adapter.showActionSheet({ itemList: ['a'] })).resolves.toBeNull();
			});

			it(`${label} 缺 api 返回 null`, async () => {
				const a: any = factory(createMockApi({ showActionSheet: undefined }));
				await expect(a.showActionSheet({ itemList: ['a'] })).resolves.toBeNull();
			});
		}
	});

	describe('支付宝（items + index）', () => {
		it('应使用 items 参数并读取 index', async () => {
			const api = createMockApi({ showActionSheet: jest.fn((o: any) => o.success?.({ index: 2 })) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.showActionSheet({ itemList: ['a', 'b', 'c'], title: '选择' })).resolves.toBe(2);
			expect(api.showActionSheet).toHaveBeenCalledWith(expect.objectContaining({ items: ['a', 'b', 'c'], title: '选择' }));
		});

		it('取消返回 null', async () => {
			const api = createMockApi({ showActionSheet: jest.fn((o: any) => o.fail?.()) });
			const adapter = createAlipayAdapter(api) as any;
			await expect(adapter.showActionSheet({ itemList: ['a'] })).resolves.toBeNull();
		});

		it('缺 api 返回 null', async () => {
			const adapter = createAlipayAdapter(createMockApi({ showActionSheet: undefined })) as any;
			await expect(adapter.showActionSheet({ itemList: ['a'] })).resolves.toBeNull();
		});
	});
});
