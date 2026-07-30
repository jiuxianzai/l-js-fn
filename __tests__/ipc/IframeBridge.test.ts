/**
 * IframeBridge 单元测试
 * 测试 iframe 与父窗口通信桥接
 */

import { IframeBridge } from '@/ipc/IframeBridge';
import { IPC_TYPE } from '@/types';

describe('IframeBridge - iframe 与父窗口通信桥接', () => {
	let mockParentWindow: any;
	let iframeBridge: IframeBridge;

	beforeEach(() => {
		// Mock window.parent
		mockParentWindow = {
			postMessage: jest.fn(),
		};

		global.window = {
			addEventListener: jest.fn(),
			removeEventListener: jest.fn(),
			parent: mockParentWindow,
		} as any;

		// 创建 IframeBridge 实例
		iframeBridge = new IframeBridge();
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
	});

	// ==================== register 测试 ====================
	describe('register - 注册事件处理函数', () => {
		it('应该注册事件处理函数', () => {
			const handler = jest.fn(() => 'result');
			iframeBridge.register('testEvent', handler);

			expect((iframeBridge as any).handles['testEvent']).toBe(handler);
		});

		it('应该覆盖已存在的处理函数', () => {
			const handler1 = jest.fn(() => 'result1');
			const handler2 = jest.fn(() => 'result2');

			iframeBridge.register('testEvent', handler1);
			iframeBridge.register('testEvent', handler2);

			expect((iframeBridge as any).handles['testEvent']).toBe(handler2);
		});

		it('应该在收到 REQUEST 消息时调用处理函数并返回结果', async () => {
			const handler = jest.fn().mockResolvedValue('test result');
			iframeBridge.register('testEvent', handler);

			const mockMessageEvent = {
				data: {
					type: IPC_TYPE.REQUEST,
					eventName: 'testEvent',
					params: { data: 'input' },
					id: 'test-id',
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];

			await onMessageHandler(mockMessageEvent);

			expect(handler).toHaveBeenCalledWith({ data: 'input' });
			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.RESPONSE,
				result: 'test result',
				id: 'test-id',
			}, '*');
		});

		it('应该在处理函数出错时返回错误信息', async () => {
			const handler = jest.fn().mockRejectedValue(new Error('Test error'));
			iframeBridge.register('testEvent', handler);

			const mockMessageEvent = {
				data: {
					type: IPC_TYPE.REQUEST,
					eventName: 'testEvent',
					params: {},
					id: 'test-id',
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];

			await onMessageHandler(mockMessageEvent);

			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.RESPONSE,
				error: expect.any(String), // JSON.stringify(Error) 返回 "{}"
				id: 'test-id',
			}, '*');
		});
	});

	// ==================== on 测试 ====================
	describe('on - 监听事件', () => {
		it('应该注册事件监听器', () => {
			const callback = jest.fn();
			iframeBridge.on('testEvent', callback);

			expect((iframeBridge as any).eventHandlers['testEvent']).toContain(callback);
		});

		it('应该支持同一事件的多个监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			iframeBridge.on('testEvent', callback1);
			iframeBridge.on('testEvent', callback2);

			expect((iframeBridge as any).eventHandlers['testEvent']).toHaveLength(2);
		});

		it('应该在收到 EMIT 消息时触发监听器', () => {
			const callback = jest.fn();
			iframeBridge.on('testEvent', callback);

			const mockMessageEvent = {
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

		it('应该触发所有注册的监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			iframeBridge.on('testEvent', callback1);
			iframeBridge.on('testEvent', callback2);

			const mockMessageEvent = {
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

			expect(callback1).toHaveBeenCalledWith({ data: 'test' });
			expect(callback2).toHaveBeenCalledWith({ data: 'test' });
		});
	});

	// ==================== off 测试 ====================
	describe('off - 移除监听事件', () => {
		it('应该移除特定的事件监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			iframeBridge.on('testEvent', callback1);
			iframeBridge.on('testEvent', callback2);
			iframeBridge.off('testEvent', callback1);

			expect((iframeBridge as any).eventHandlers['testEvent']).not.toContain(callback1);
			expect((iframeBridge as any).eventHandlers['testEvent']).toContain(callback2);
		});

		it('应该移除所有指定事件的监听器', () => {
			const callback1 = jest.fn();
			const callback2 = jest.fn();

			iframeBridge.on('testEvent', callback1);
			iframeBridge.on('testEvent', callback2);
			iframeBridge.off('testEvent');

			expect((iframeBridge as any).eventHandlers['testEvent']).toHaveLength(0);
		});

		it('应该处理空监听器列表的情况', () => {
			expect(() => iframeBridge.off('nonExistentEvent')).not.toThrow();
		});
	});

	// ==================== emit 测试 ====================
	describe('emit - 发布事件', () => {
		it('应该向父窗口发送 EMIT 类型的消息', () => {
			iframeBridge.emit('testEvent', { data: 'test' });

			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'testEvent',
				params: { data: 'test' },
			}, '*');
		});

		it('应该支持不带参数的事件', () => {
			iframeBridge.emit('testEvent');

			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'testEvent',
				params: undefined,
			}, '*');
		});

		it('应该支持各种参数类型', () => {
			iframeBridge.emit('stringEvent', 'string');
			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'stringEvent',
				params: 'string',
			}, '*');

			iframeBridge.emit('numberEvent', 123);
			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'numberEvent',
				params: 123,
			}, '*');

			iframeBridge.emit('objectEvent', { key: 'value' });
			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.EMIT,
				eventName: 'objectEvent',
				params: { key: 'value' },
			}, '*');
		});
	});

	// ==================== destroy 测试 ====================
	describe('destroy - 销毁实例', () => {
		it('应该移除消息事件监听', () => {
			iframeBridge.destroy();

			expect(window.removeEventListener).toHaveBeenCalledWith(
				'message',
				expect.any(Function)
			);
		});

		it('应该清空所有数据', () => {
			iframeBridge.register('testEvent', jest.fn());
			iframeBridge.on('event1', jest.fn());
			iframeBridge.on('event2', jest.fn());

			iframeBridge.destroy();

			expect((iframeBridge as any).handles).toEqual({});
			expect((iframeBridge as any).eventHandlers).toEqual({});
		});

		it('应该允许多次调用 destroy', () => {
			expect(() => {
				iframeBridge.destroy();
				iframeBridge.destroy();
			}).not.toThrow();
		});
	});

	// ==================== 消息类型处理 ====================
	describe('消息类型处理', () => {
		it('应该忽略未知类型的消息', () => {
			const callback = jest.fn();
			iframeBridge.on('testEvent', callback);
			iframeBridge.register('handleRequest', jest.fn());

			const mockMessageEvent = {
				data: {
					type: 'unknown_type',
					eventName: 'testEvent',
					params: { data: 'test' },
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			onMessageHandler(mockMessageEvent);

			expect(callback).not.toHaveBeenCalled();
			expect(mockParentWindow.postMessage).not.toHaveBeenCalled();
		});

		it('应该处理 EMIT 类型的消息并调用注册的事件处理函数', () => {
			const callback = jest.fn();
			iframeBridge.on('testEvent', callback);

			const mockMessageEvent = {
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

		it('EMIT 类型未注册的事件不应该报错', () => {
			const mockMessageEvent = {
				data: {
					type: IPC_TYPE.EMIT,
					eventName: 'nonExistentEvent',
					params: {},
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];
			expect(() => onMessageHandler(mockMessageEvent)).not.toThrow();
		});
	});

	// ==================== 异步处理测试 ====================
	describe('异步处理', () => {
		it('应该正确处理异步请求处理函数', async () => {
			const asyncHandler = jest.fn(async () => {
				await new Promise((resolve) => setTimeout(resolve, 10));
				return 'async result';
			});
			iframeBridge.register('asyncEvent', asyncHandler);

			const mockMessageEvent = {
				data: {
					type: IPC_TYPE.REQUEST,
					eventName: 'asyncEvent',
					params: {},
					id: 'async-id',
				},
			};

			const onMessageHandler = (window.addEventListener as jest.Mock).mock.calls.find(
				(call) => call[0] === 'message'
			)[1];

			await onMessageHandler(mockMessageEvent);

			expect(asyncHandler).toHaveBeenCalled();
			expect(mockParentWindow.postMessage).toHaveBeenCalledWith({
				type: IPC_TYPE.RESPONSE,
				result: 'async result',
				id: 'async-id',
			}, '*');
		});
	});
});
