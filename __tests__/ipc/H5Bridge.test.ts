/**
 * H5Bridge 单元测试
 * 测试 H5 与 iframe 通信桥接
 */

import { H5Bridge } from '@/ipc/H5Bridge';
import { IPC_TYPE } from '@/types';

describe('H5Bridge - H5 与 iframe 通信桥接', () => {
	let mockIframe: any;
	let mockContentWindow: any;
	let h5Bridge: H5Bridge;

	beforeEach(() => {
		// Mock iframe
		mockContentWindow = {
			postMessage: jest.fn(),
		};
		mockIframe = {
			contentWindow: mockContentWindow,
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		};

		// Mock window
		global.window = {
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
		} as any;

		// 创建 H5Bridge 实例
		h5Bridge = new H5Bridge(mockIframe as HTMLIFrameElement);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	// ==================== 初始化测试 ====================
	describe('初始化', () => {
		it('应该注册 message 事件监听', () => {
			expect(window.addEventListener).toHaveBeenCalledWith(
				'message',
				expect.any(Function)
			);
		});

		it('应该注册 iframe load 事件监听', () => {
			expect(mockIframe.addEventListener).toHaveBeenCalledWith(
				'load',
				expect.any(Function)
			);
		});

		it('应该在 iframe 为 null 时也能创建', () => {
			expect(() => new H5Bridge(null)).not.toThrow();
		});
	});

	// ==================== call 测试 ====================
	describe('call - 调用方法', () => {
		it('应该发送正确格式的消息', async () => {
			// 模拟 iframe 已加载
			(h5Bridge as any).iframeReady = true;

			const promise = h5Bridge.call('testEvent', { data: 'test' });

			// 验证消息被发送
			expect(mockContentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.REQUEST,
				eventName: 'testEvent',
				params: { data: 'test' },
				id: expect.any(String),
			}, '*');

			// 模拟响应
			const pendingKeys = Object.keys((h5Bridge as any).pending);
			const mockMessageEvent = {
				source: mockContentWindow,
				data: {
					type: IPC_TYPE.RESPONSE,
					id: pendingKeys[0],
					result: 'success',
				},
			};

			// 触发消息处理
			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			onMessageHandler(mockMessageEvent);

			const result = await promise;
			expect(result).toBe('success');
		});

		it('应该在 iframe 未就绪时将消息加入队列', () => {
			(h5Bridge as any).iframeReady = false;

			h5Bridge.call('testEvent', { data: 'test' });

			expect((h5Bridge as any).queue).toHaveLength(1);
			expect(mockContentWindow.postMessage).not.toHaveBeenCalled();
		});

		it('应该返回 reject 当响应包含错误', async () => {
			(h5Bridge as any).iframeReady = true;

			const promise = h5Bridge.call('testEvent');

			// 模拟错误响应
			const pendingKeys = Object.keys((h5Bridge as any).pending);
			const mockMessageEvent = {
				source: mockContentWindow,
				data: {
					type: IPC_TYPE.RESPONSE,
					id: pendingKeys[0],
					error: 'Test error',
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			onMessageHandler(mockMessageEvent);

			await expect(promise).rejects.toBe('Test error');
		});
	});

	// ==================== iframe 加载处理测试 ====================
	describe('iframe 加载处理', () => {
		it('应该在 iframe 加载完成后刷新队列', () => {
			(h5Bridge as any).queue = [
				{ type: IPC_TYPE.REQUEST, eventName: 'test1', params: {}, id: 'id1' },
				{ type: IPC_TYPE.REQUEST, eventName: 'test2', params: {}, id: 'id2' },
			];

			const onLoadHandler = (mockIframe.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'load'
			)[1];

			onLoadHandler();

			expect((h5Bridge as any).iframeReady).toBe(true);
			expect((h5Bridge as any).queue).toHaveLength(0);
			expect(mockContentWindow.postMessage).toHaveBeenCalledTimes(2);
		});
	});

	// ==================== on 测试 ====================
	describe('on - 监听事件', () => {
		it('应该注册事件监听器', () => {
			const callback = jest.fn();
			h5Bridge.on('testEvent', callback);

			expect((h5Bridge as any).eventHandlers['testEvent']).toContain(callback);
		});

		it('应该支持同一事件的多个监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			h5Bridge.on('testEvent', callback1);
			h5Bridge.on('testEvent', callback2);

			expect((h5Bridge as any).eventHandlers['testEvent']).toHaveLength(2);
		});

		it('应该在收到 EMIT 消息时触发监听器', () => {
			const callback = jest.fn();
			h5Bridge.on('testEvent', callback);

			const mockMessageEvent = {
				source: mockContentWindow,
				data: {
					type: IPC_TYPE.EMIT,
					eventName: 'testEvent',
					params: { data: 'test' },
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			onMessageHandler(mockMessageEvent);

			expect(callback).toHaveBeenCalledWith({ data: 'test' });
		});
	});

	// ==================== off 测试 ====================
	describe('off - 移除监听事件', () => {
		it('应该移除特定的事件监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			h5Bridge.on('testEvent', callback1);
			h5Bridge.on('testEvent', callback2);
			h5Bridge.off('testEvent', callback1);

			expect((h5Bridge as any).eventHandlers['testEvent']).not.toContain(callback1);
			expect((h5Bridge as any).eventHandlers['testEvent']).toContain(callback2);
		});

		it('应该移除所有指定事件的监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			h5Bridge.on('testEvent', callback1);
			h5Bridge.on('testEvent', callback2);
			h5Bridge.off('testEvent');

			expect((h5Bridge as any).eventHandlers['testEvent']).toHaveLength(0);
		});
	});

	// ==================== emit 测试 ====================
	describe('emit - 发布事件', () => {
		it('应该发送 EMIT 类型的消息', () => {
			h5Bridge.emit('testEvent', { data: 'test' });

			expect(mockContentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'testEvent',
				params: { data: 'test' },
			}, '*');
		});

		it('应该支持不带参数的事件', () => {
			h5Bridge.emit('testEvent');

			expect(mockContentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'testEvent',
				params: undefined,
			}, '*');
		});
	});

	// ==================== destroy 测试 ====================
	describe('destroy - 销毁实例', () => {
		it('应该移除所有事件监听', () => {
			h5Bridge.destroy();

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'message',
				expect.any(Function)
			);
			expect(mockIframe.removeEventListener).toHaveBeenCalledWith(
				'load',
				expect.any(Function)
			);
		});

		it('应该拒绝所有未完成的 Promise', async () => {
			(h5Bridge as any).iframeReady = true;
			const promise = h5Bridge.call('testEvent');

			h5Bridge.destroy();

			await expect(promise).rejects.toThrow('Bridge destroyed');
		});

		it('应该清空所有数据', () => {
			h5Bridge.on('testEvent', jest.fn());
			(h5Bridge as any).queue.push({ test: 'data' });

			h5Bridge.destroy();

			expect((h5Bridge as any).pending).toEqual({});
			expect((h5Bridge as any).queue).toEqual([]);
			expect((h5Bridge as any).eventHandlers).toEqual({});
			expect((h5Bridge as any).iframeReady).toBe(false);
		});
	});

	// ==================== 消息来源验证 ====================
	describe('消息来源验证', () => {
		it('应该只接收来自 iframe 的消息', () => {
			const callback = jest.fn();
			h5Bridge.on('testEvent', callback);

			// 来自其他来源的消息
			const otherSourceEvent = {
				source: {},
				data: {
					type: IPC_TYPE.EMIT,
					eventName: 'testEvent',
					params: { data: 'test' },
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			onMessageHandler(otherSourceEvent);

			expect(callback).not.toHaveBeenCalled();
		});
	});
});
