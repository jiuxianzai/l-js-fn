/**
 * uniapp clipboard 剪贴板单元测试
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { clipboard, registerAdapter, createWechatAdapter } from '@/uniapp';

function createMock() {
	return {
		setClipboardData: jest.fn((opts: any) => opts.success?.()),
		getClipboardData: jest.fn((opts: any) => opts.success?.({ data: 'clipboard-content' })),
	};
}

let mockWx: ReturnType<typeof createMock>;

beforeEach(() => {
	mockWx = createMock();
	registerAdapter(createWechatAdapter(mockWx as any));
});

describe('uniapp clipboard', () => {
	describe('copy', () => {
		it('应复制文本并返回 true', async () => {
			const ok = await clipboard.copy('hello');
			expect(ok).toBe(true);
			expect(mockWx.setClipboardData).toHaveBeenCalledWith(expect.objectContaining({ data: 'hello' }));
		});

		it('非字符串入参应返回 false', async () => {
			await expect(clipboard.copy(123 as any)).resolves.toBe(false);
			expect(mockWx.setClipboardData).not.toHaveBeenCalled();
		});

		it('复制失败应返回 false', async () => {
			mockWx.setClipboardData.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
			await expect(clipboard.copy('hello')).resolves.toBe(false);
		});
	});

	describe('read', () => {
		it('应返回剪贴板文本', async () => {
			await expect(clipboard.read()).resolves.toBe('clipboard-content');
		});

		it('读取失败应 reject', async () => {
			mockWx.getClipboardData.mockImplementationOnce((opts: any) => opts.fail?.(new Error('fail')));
			await expect(clipboard.read()).rejects.toThrow('fail');
		});
	});
});
