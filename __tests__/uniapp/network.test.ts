/**
 * uniapp network 网络状态单元测试
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { network, registerAdapter, createWechatAdapter } from '@/uniapp';

function createMock() {
	return {
		getNetworkType: jest.fn((opts: any) => opts.success?.({ networkType: 'wifi' })),
		onNetworkStatusChange: jest.fn(),
		offNetworkStatusChange: jest.fn(),
	};
}

let mockWx: ReturnType<typeof createMock>;

beforeEach(() => {
	mockWx = createMock();
	registerAdapter(createWechatAdapter(mockWx as any));
});

describe('uniapp network', () => {
	describe('type', () => {
		it('应返回网络类型', async () => {
			await expect(network.type()).resolves.toBe('wifi');
		});

		it('getNetworkType fail 时应返回 unknown', async () => {
			mockWx.getNetworkType.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
			await expect(network.type()).resolves.toBe('unknown');
		});

		it('缺 getNetworkType 时走 H5 兜底', async () => {
			registerAdapter(createWechatAdapter({} as any));
			// navigator 未定义（node 环境）→ 视为离线
			await expect(network.type()).resolves.toBe('none');
		});

		it('缺 getNetworkType 且有 navigator.onLine 时返回 unknown', async () => {
			(global as any).navigator = { onLine: true };
			registerAdapter(createWechatAdapter({} as any));
			await expect(network.type()).resolves.toBe('unknown');
			delete (global as any).navigator;
		});
	});

	describe('isOnline', () => {
		it('wifi 时应返回 true', async () => {
			await expect(network.isOnline()).resolves.toBe(true);
		});

		it('none 时应返回 false', async () => {
			mockWx.getNetworkType.mockImplementationOnce((opts: any) => opts.success?.({ networkType: 'none' }));
			await expect(network.isOnline()).resolves.toBe(false);
		});
	});

	describe('watch / off', () => {
		it('应注册 onNetworkStatusChange 监听', () => {
			const cb = jest.fn();
			network.watch(cb);
			expect(mockWx.onNetworkStatusChange).toHaveBeenCalledWith(expect.any(Function));
			const handler = mockWx.onNetworkStatusChange.mock.calls[0][0] as (res: any) => void;
			handler({ isConnected: false, networkType: 'none' });
			expect(cb).toHaveBeenCalledWith(false, 'none');
		});

		it('off 应调用 offNetworkStatusChange', () => {
			network.off();
			expect(mockWx.offNetworkStatusChange).toHaveBeenCalled();
		});

		it('缺 onNetworkStatusChange 时走浏览器事件兜底', () => {
			const addEventListener = jest.fn();
			(global as any).window = { addEventListener };
			registerAdapter(createWechatAdapter({} as any));
			network.watch(jest.fn());
			expect(addEventListener).toHaveBeenCalledWith('online', expect.any(Function));
			expect(addEventListener).toHaveBeenCalledWith('offline', expect.any(Function));
			delete (global as any).window;
		});
	});
});
