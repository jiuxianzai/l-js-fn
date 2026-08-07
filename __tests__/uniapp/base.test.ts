/**
 * uniapp base 模块单元测试
 * 覆盖 autoDetect 全部分支（wx/my/uni/document/plus/抛错）
 */
import { afterEach, describe, expect, it, jest } from '@jest/globals';

/** 记录被修改的全局变量，便于恢复 */
const savedGlobals: Record<string, any> = {};

function setGlobal(key: string, value: any): void {
	if (!(key in savedGlobals)) {
		savedGlobals[key] = (global as any)[key];
	}
	// 注意：base.ts 中会直接访问 wx / my（如 wx || uni），
	// 因此不能 delete 全局属性，否则会抛出 ReferenceError: wx is not defined。
	(global as any)[key] = value;
}

afterEach(() => {
	for (const key of Object.keys(savedGlobals)) {
		(global as any)[key] = savedGlobals[key];
	}
	Object.keys(savedGlobals).forEach((k) => delete savedGlobals[k]);
});

describe('uniapp base - autoDetect', () => {
	it('存在 wx 时返回微信适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', { name: 'wx' });
			setGlobal('my', undefined);
			setGlobal('uni', undefined);
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('wechat');
	});

	it('存在 my 时返回支付宝适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', { name: 'my' });
			setGlobal('uni', undefined);
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('alipay');
	});

	it('uni.platform=mp-weixin 返回微信适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', { getSystemInfoSync: () => ({ platform: 'mp-weixin' }) });
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('wechat');
	});

	it('uni.platform=mp-alipay 返回支付宝适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', { getSystemInfoSync: () => ({ platform: 'mp-alipay' }) });
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('alipay');
	});

	it('uni 非小程序平台且有 document 时返回 H5 适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', { getSystemInfoSync: () => ({ platform: 'h5' }) });
			setGlobal('document', {});
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('h5');
	});

	it('uni 非小程序平台且有 plus 时返回 App 适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', { getSystemInfoSync: () => ({ platform: 'app' }) });
			setGlobal('document', undefined);
			setGlobal('plus', {});
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('app');
	});

	it('uni.getSystemInfoSync 抛错且有 document 时兜底 H5', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', {
				getSystemInfoSync: () => {
					throw new Error('sync fail');
				},
			});
			setGlobal('document', {});
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('h5');
	});

	it('uni.getSystemInfoSync 抛错且无 document/plus 时兜底 App', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', {
				getSystemInfoSync: () => {
					throw new Error('sync fail');
				},
			});
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('app');
	});

	it('uni 平台返回非 h5/app 且无 document 时兜底 App', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', { getSystemInfoSync: () => ({ platform: 'unknown' }) });
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('app');
	});

	it('无任何全局但有 document 时返回 H5 适配器', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', undefined);
			setGlobal('document', {});
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(base.autoDetect().name).toBe('h5');
	});

	it('无任何全局且无 document 时抛出异常', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', undefined);
			setGlobal('my', undefined);
			setGlobal('uni', undefined);
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		expect(() => base.autoDetect()).toThrow('无法自动检测平台');
	});

	it('getAdapter 缓存结果，registerAdapter 覆盖', async () => {
		let base: any;
		await jest.isolateModulesAsync(async () => {
			setGlobal('wx', {});
			setGlobal('my', undefined);
			setGlobal('uni', undefined);
			setGlobal('document', undefined);
			setGlobal('plus', undefined);
			base = await import('@/uniapp/base');
		});
		const first = base.getAdapter();
		expect(base.getAdapter()).toBe(first);
		const custom = { ...first, name: 'custom' };
		base.registerAdapter(custom);
		expect(base.getAdapter()).toBe(custom);
	});
});
