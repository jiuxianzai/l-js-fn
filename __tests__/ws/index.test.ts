/**
 * WebSocketManager 单元测试
 * 测试 WebSocket 管理类
 */

import { WebSocketManager } from '@/ws';

describe('WebSocketManager - WebSocket 管理类', () => {
	let mockWebSocket: any;
	let wsManager: WebSocketManager;

	beforeEach(() => {
		// Mock WebSocket 常量
		global.WebSocket = {
			CONNECTING: 0,
			OPEN: 1,
			CLOSING: 2,
			CLOSED: 3,
		} as any;

		// Mock WebSocket
		mockWebSocket = {
			readyState: WebSocket.CONNECTING,
			send: jest.fn(),
			close: jest.fn(),
			onopen: null,
			onmessage: null,
			onerror: null,
			onclose: null,
		};

		global.WebSocket = jest.fn(() => mockWebSocket) as any;

		// 模拟 WebSocket 连接成功
		setTimeout(() => {
			if (mockWebSocket.onopen) {
				mockWebSocket.onopen({ type: 'open' });
			}
			mockWebSocket.readyState = (global.WebSocket as any).OPEN;
		}, 0);
	});

	afterEach(() => {
		if (wsManager) {
			wsManager.close();
		}
		jest.clearAllMocks();
	});

	// ==================== 初始化测试 ====================
	describe('初始化', () => {
		it('应该创建 WebSocket 连接', () => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			expect(WebSocket).toHaveBeenCalledWith('ws://localhost:8080');
		});

		it('应该设置消息回调', (done) => {
			const onMessage = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', onMessage);

			setTimeout(() => {
				if (mockWebSocket.onmessage) {
					mockWebSocket.onmessage({ data: 'test message' });
				}
				expect(onMessage).toHaveBeenCalledWith('test message');
				done();
			}, 10);
		});

		it('应该设置错误回调', (done) => {
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			setTimeout(() => {
				if (mockWebSocket.onerror) {
					mockWebSocket.onerror({ type: 'error' });
				}
				expect(onError).toHaveBeenCalled();
				done();
			}, 10);
		});

		it('应该在 WebSocket 不支持时处理错误', () => {
			global.WebSocket = undefined as any;

			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			expect(onError).toHaveBeenCalledWith({
				type: 'connection_create_error',
				data: '当前环境不支持 WebSocket',
			});
		});
	});

	// ==================== getWebSocket 测试 ====================
	describe('getWebSocket - 获取 WebSocket 实例', () => {
		it('应该返回 WebSocket 实例', () => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			const ws = wsManager['getWebSocket']();
			expect(ws).toBe(mockWebSocket);
		});
	});

	// ==================== sendWebSocketMessage 测试 ====================
	describe('sendWebSocketMessage - 发送消息', () => {
		beforeEach((done) => {
			wsManager = new WebSocketManager('ws://localhost:8080');
			setTimeout(done, 10);
		});

		it('应该发送字符串消息', () => {
			wsManager['sendWebSocketMessage']('test message');

			expect(mockWebSocket.send).toHaveBeenCalledWith('test message');
		});

		it('应该发送对象消息（自动 JSON 序列化）', () => {
			const message = { type: 'test', data: 'value' };
			wsManager['sendWebSocketMessage'](message);

			expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify(message));
		});

		it('应该在未连接时返回错误', () => {
			const onError = jest.fn();

			// 创建一个新的 WebSocketManager
			const ws = new WebSocketManager('ws://test', undefined, onError);
			// 模拟 WebSocket 处于关闭状态
			(ws as any).webSocket = null;

			ws['sendWebSocketMessage']('test');

			expect(onError).toHaveBeenCalledWith({
				type: 'connection_send_error',
				data: 'WebSocket 未打开，无法发送消息',
			});
		});

		it('应该处理发送错误', () => {
			mockWebSocket.send = jest.fn(() => {
				throw new Error('Send error');
			});
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			wsManager['sendWebSocketMessage']('test');

			expect(onError).toHaveBeenCalledWith({
				type: 'connection_send_error',
				data: new Error('Send error'),
			});
		});
	});

	// ==================== checkConnection 测试 ====================
	describe('checkConnection - 定时检查连接', () => {
		beforeEach(() => {
			wsManager = new WebSocketManager('ws://localhost:8080');
			jest.useFakeTimers();
		});

		afterEach(() => {
			jest.useRealTimers();
		});

		it('应该定时发送消息', () => {
			const sendSpy = jest.spyOn(wsManager as any, 'sendWebSocketMessage');

			wsManager['checkConnection']({ type: 'ping' }, 1000);

			jest.advanceTimersByTime(1000);
			expect(sendSpy).toHaveBeenCalledTimes(1);

			jest.advanceTimersByTime(1000);
			expect(sendSpy).toHaveBeenCalledTimes(2);

			sendSpy.mockRestore();
		});

		it('应该在 setTime <= 0 时返回错误', () => {
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			wsManager['checkConnection']({ type: 'ping' }, 0);

			expect(onError).toHaveBeenCalledWith({
				type: 'connection_send_error',
				data: 'setTime 参数必须是正数',
			});
		});

		it('应该清除之前的定时器', () => {
			const sendSpy = jest.spyOn(wsManager as any, 'sendWebSocketMessage');

			wsManager['checkConnection']({ type: 'ping1' }, 1000);
			jest.advanceTimersByTime(500);

			wsManager['checkConnection']({ type: 'ping2' }, 2000);
			jest.advanceTimersByTime(500);

			// 第一次定时器应该被清除，只应该有第二次的消息
			expect(sendSpy).not.toHaveBeenCalledWith({ type: 'ping1' });

			sendSpy.mockRestore();
		});
	});

	// ==================== reconnect 测试 ====================
	describe('reconnect - 重新连接', () => {
		it('应该在延迟后重新连接', (done) => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			wsManager['reconnect'](1000);

			setTimeout(() => {
				expect(WebSocket).toHaveBeenCalledTimes(2);
				done();
			}, 1100);
		});

		it('应该在 delay <= 0 时返回错误', () => {
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			wsManager['reconnect'](0);

			expect(onError).toHaveBeenCalledWith({
				type: 'connection_send_error',
				data: 'delay 参数必须是正数',
			});
		});

		it('应该先关闭现有连接再重新连接', (done) => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			wsManager['reconnect'](100);

			setTimeout(() => {
				expect(mockWebSocket.close).toHaveBeenCalled();
				expect(WebSocket).toHaveBeenCalledTimes(2);
				done();
			}, 150);
		});
	});

	// ==================== close 测试 ====================
	describe('close - 关闭连接', () => {
		it('应该关闭 WebSocket 连接并清除定时器', () => {
			jest.useFakeTimers();
			wsManager = new WebSocketManager('ws://localhost:8080');

			wsManager['checkConnection']({ type: 'ping' }, 1000);
			wsManager.close();

			expect(mockWebSocket.close).toHaveBeenCalled();
			expect(wsManager['getWebSocket']()).toBe(null);

			jest.useRealTimers();
		});

		it('应该在多次调用时不会报错', () => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			expect(() => {
				wsManager.close();
				wsManager.close();
			}).not.toThrow();
		});

		it('应该将 WebSocket 实例设为 null', () => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			wsManager.close();

			expect(wsManager['getWebSocket']()).toBe(null);
		});
	});

	// ==================== WebSocket 事件处理 ====================
	describe('WebSocket 事件处理', () => {
		it('应该在连接打开时触发 onopen', (done) => {
			const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
			wsManager = new WebSocketManager('ws://localhost:8080');

			setTimeout(() => {
				expect(consoleSpy).toHaveBeenCalledWith(
					'WebSocket 已连接:',
					expect.any(Object)
				);
				consoleSpy.mockRestore();
				done();
			}, 10);
		});

		it('应该在收到消息时触发回调', (done) => {
			const onMessage = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', onMessage);

			setTimeout(() => {
				if (mockWebSocket.onmessage) {
					mockWebSocket.onmessage({ data: 'test message' });
				}
				expect(onMessage).toHaveBeenCalledWith('test message');
				done();
			}, 10);
		});

		it('应该在出错时触发错误回调', (done) => {
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			setTimeout(() => {
				if (mockWebSocket.onerror) {
					mockWebSocket.onerror({ type: 'error' });
				}
				expect(onError).toHaveBeenCalledWith({
					type: 'connection_error',
					data: { type: 'error' },
				});
				done();
			}, 10);
		});

		it('应该在连接关闭时触发错误回调', (done) => {
			const onError = jest.fn();
			wsManager = new WebSocketManager('ws://localhost:8080', undefined, onError);

			setTimeout(() => {
				if (mockWebSocket.onclose) {
					mockWebSocket.onclose({ type: 'close', code: 1000 });
				}
				expect(onError).toHaveBeenCalledWith({
					type: 'connection_close',
					data: { type: 'close', code: 1000 },
				});
				done();
			}, 10);
		});
	});

	// ==================== 重复连接测试 ====================
	describe('重复连接处理', () => {
		it('应该在已连接或正在连接时不创建新连接', () => {
			wsManager = new WebSocketManager('ws://localhost:8080');

			// 模拟已连接状态
			mockWebSocket.readyState = WebSocket.OPEN;

			wsManager['connect']();

			// WebSocket 应该只被调用一次（在构造函数中）
			expect(WebSocket).toHaveBeenCalledTimes(1);
		});
	});

	// ==================== 无错误回调时的默认处理 ====================
	describe('默认错误处理', () => {
		it('应该在无错误回调时使用 console.error', (done) => {
			const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
			wsManager = new WebSocketManager('ws://localhost:8080');

			setTimeout(() => {
				if (mockWebSocket.onerror) {
					mockWebSocket.onerror({ type: 'error' });
				}
				expect(consoleSpy).toHaveBeenCalledWith(
					'connection_error',
					{ type: 'error' }
				);
				consoleSpy.mockRestore();
				done();
			}, 10);
		});
	});
});
