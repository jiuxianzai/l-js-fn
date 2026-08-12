/**
 * uniapp device 设备/UI 适配单元测试
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { device, registerAdapter, createWechatAdapter } from '@/uniapp';

const systemInfo = {
	brand: 'iPhone',
	model: 'iPhone 15 Pro',
	system: 'iOS 17.0',
	platform: 'ios',
	statusBarHeight: 47,
	screenWidth: 390,
	screenHeight: 844,
	windowWidth: 390,
	windowHeight: 720,
	pixelRatio: 3,
	safeArea: { top: 47, right: 390, bottom: 770, left: 0, width: 390, height: 723 },
};

function createMock() {
	return {
		getSystemInfoSync: jest.fn().mockReturnValue({ ...systemInfo }),
		getMenuButtonBoundingClientRect: jest.fn().mockReturnValue({ left: 278, top: 25, right: 365, bottom: 57, width: 87, height: 32 }),
	};
}

let mockWx: ReturnType<typeof createMock>;

beforeEach(() => {
	mockWx = createMock();
	registerAdapter(createWechatAdapter(mockWx as any));
	device.refresh();
});

describe('uniapp device', () => {
	describe('info', () => {
		it('应返回完整的设备信息', () => {
			const info = device.info();
			expect(info.brand).toBe('iPhone');
			expect(info.model).toBe('iPhone 15 Pro');
			expect(info.system).toBe('iOS 17.0');
			expect(info.platform).toBe('ios');
			expect(info.statusBarHeight).toBe(47);
			expect(info.screenWidth).toBe(390);
			expect(info.screenHeight).toBe(844);
			expect(info.pixelRatio).toBe(3);
			expect(info.safeArea).toBeDefined();
		});

		it('应缓存结果，多次调用只读取一次系统信息', () => {
			device.info();
			device.info();
			expect(mockWx.getSystemInfoSync).toHaveBeenCalledTimes(1);
		});

		it('safeArea 存在时应计算安全区内边距', () => {
			const insets = device.info().safeAreaInsets;
			expect(insets).toEqual({ top: 47, right: 0, bottom: 74, left: 0 });
		});

		it('safeArea 缺失时应以 statusBarHeight 兜底', () => {
			mockWx.getSystemInfoSync.mockReturnValue({ ...systemInfo, safeArea: undefined });
			device.refresh();
			const info = device.info();
			expect(info.safeAreaInsets).toEqual({ top: 47, right: 0, bottom: 0, left: 0 });
			expect(info.safeArea).toBeUndefined();
		});

		it('系统信息缺失时应返回默认值', () => {
			mockWx.getSystemInfoSync.mockReturnValue(undefined);
			device.refresh();
			const info = device.info();
			expect(info.statusBarHeight).toBe(0);
			expect(info.pixelRatio).toBe(1);
		});
	});

	describe('refresh', () => {
		it('应清除缓存并重新读取', () => {
			device.info();
			const before = mockWx.getSystemInfoSync.mock.calls.length;
			device.refresh();
			const after = mockWx.getSystemInfoSync.mock.calls.length;
			expect(after).toBe(before + 1);
		});
	});

	describe('statusBarHeight', () => {
		it('应返回状态栏高度', () => {
			expect(device.statusBarHeight()).toBe(47);
		});
	});

	describe('safeAreaInsets', () => {
		it('应返回安全区内边距', () => {
			expect(device.safeAreaInsets().bottom).toBe(74);
		});
	});

	describe('capsule', () => {
		it('微信环境应返回胶囊位置', () => {
			const capsule = device.capsule();
			expect(capsule).toEqual({ left: 278, top: 25, right: 365, bottom: 57, width: 87, height: 32 });
		});

		it('无胶囊 API 时应返回 null', () => {
			mockWx.getMenuButtonBoundingClientRect = undefined as any;
			expect(device.capsule()).toBeNull();
		});
	});

	describe('isInSafeArea', () => {
		it('底部存在安全区时应返回 true', () => {
			expect(device.isInSafeArea()).toBe(true);
		});

		it('超出阈值时应返回 false', () => {
			expect(device.isInSafeArea(100)).toBe(false);
		});
	});
});
