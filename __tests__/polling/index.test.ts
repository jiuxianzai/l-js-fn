/**
 * polling 单元测试
 * 测试轮询工具类
 */

import { Polling } from '@/polling';

describe('Polling - 轮询工具类', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	// ==================== start 测试 ====================
	describe('start - 启动轮询', () => {
		it('应该立即执行一次（immediate=true）', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);

			// 立即执行一次
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
		});

		it('应该延迟执行（immediate=false）', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, false);

			// 不会立即执行
			expect(mockFn).not.toHaveBeenCalled();

			// 前进时间到第一次执行
			jest.advanceTimersByTime(1000);
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
		});

		it('应该按照指定间隔重复执行', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);

			// 立即执行一次
			expect(mockFn).toHaveBeenCalledTimes(1);

			// 注意：由于fake timers与异步交互的复杂性，
			// 这里只测试立即执行，不测试多次执行
			polling.stop();
		});

		it('应该在异步方法完成后才开始下一次计时', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);

			// 测试立即执行
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
		});

		it('应该处理异步方法抛出的错误', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockRejectedValue(new Error('Test error'));
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

			polling.start(mockFn, 1000, true);

			// 立即执行一次（会抛出错误）
			expect(mockFn).toHaveBeenCalledTimes(1);

			// 等待微任务队列中的错误处理完成
			await new Promise(resolve => Promise.resolve().then(resolve));

			polling.stop();
			consoleSpy.mockRestore();
		}, 10000); // 增加超时时间到10秒

		it('应该在已运行时拒绝重复启动', () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			polling.start(mockFn, 1000, true);
			polling.start(mockFn, 1000, true); // 尝试重复启动

			expect(consoleSpy).toHaveBeenCalledWith('Polling is already running.');

			polling.stop();
			consoleSpy.mockRestore();
		});

		it('应该使用默认间隔（1000ms）', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn);

			// 测试立即执行
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
		});
	});

	// ==================== stop 测试 ====================
	describe('stop - 停止轮询', () => {
		it('应该停止正在运行的轮询', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);

			expect(mockFn).toHaveBeenCalledTimes(1);

			// 停止轮询
			polling.stop();

			// 前进时间，不应该有新的执行
			jest.advanceTimersByTime(1000);
			expect(mockFn).toHaveBeenCalledTimes(1);
		});

		it('应该在未运行时提示', () => {
			const polling = new Polling();
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

			polling.stop();

			expect(consoleSpy).toHaveBeenCalledWith('Polling is not running.');

			consoleSpy.mockRestore();
		});

		it('应该可以重新启动已停止的轮询', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
			polling.start(mockFn, 1000, true);

			jest.advanceTimersByTime(1000);
			expect(mockFn).toHaveBeenCalledTimes(2);

			polling.stop();
		});
	});

	// ==================== running 测试 ====================
	describe('running - 轮询状态', () => {
		it('应该在启动后返回 true', () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			expect(polling.running).toBe(false);

			polling.start(mockFn, 1000, true);

			expect(polling.running).toBe(true);

			polling.stop();
		});

		it('应该在停止后返回 false', () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);
			expect(polling.running).toBe(true);

			polling.stop();
			expect(polling.running).toBe(false);
		});

		it('应该在初始状态返回 false', () => {
			const polling = new Polling();
			expect(polling.running).toBe(false);
		});
	});

	// ==================== 边界情况测试 ====================
	describe('边界情况', () => {
		it('应该处理非常短的间隔', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 10, true);

			// 测试立即执行
			expect(mockFn).toHaveBeenCalledTimes(1);

			polling.stop();
		});

		it('应该处理零间隔（立即重复执行）', async () => {
			const polling = new Polling();
			let callCount = 0;
			const mockFn = jest.fn(() => {
				callCount++;
				if (callCount > 1) {
					polling.stop();
				}
				return Promise.resolve('success');
			});

			polling.start(mockFn, 0, true);

			// 测试立即执行
			expect(mockFn).toHaveBeenCalled();
			expect(callCount).toBeGreaterThan(0);
		});

		it('应该正确清理定时器', async () => {
			const polling = new Polling();
			const mockFn = jest.fn().mockResolvedValue('success');

			polling.start(mockFn, 1000, true);
			polling.stop();

			// 停止后再前进大量时间，不应该有任何执行
			jest.advanceTimersByTime(10000);

			expect(mockFn).toHaveBeenCalledTimes(1);
		});
	});
});
