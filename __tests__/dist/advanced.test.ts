/**
 * dist 高级子模块验证 - WebSocket / Polling / IPC / EventBus
 */
const ws = require('../../dist/ws/index.cjs');
const polling = require('../../dist/polling/index.cjs');
const eventBus = require('../../dist/event-bus/index.cjs');
// ipc 模块依赖 window，在 node 环境跳过构造函数测试
const ipc = require('../../dist/ipc/index.cjs');

describe('dist 子模块 - ws (WebSocket)', () => {
	it('WebSocketManager 类存在', () => {
		expect(typeof ws.WebSocketManager).toBe('function');
		const manager = new ws.WebSocketManager('ws://localhost:9999');
		expect(manager).toBeInstanceOf(ws.WebSocketManager);
	});

	it('WebSocketManager 有核心方法', () => {
		const manager = new ws.WebSocketManager('ws://localhost:9999');
		expect(typeof manager.sendWebSocketMessage).toBe('function');
		expect(typeof manager.connect).toBe('function');
		expect(typeof manager.close).toBe('function');
	});
});

describe('dist 子模块 - polling', () => {
	it('Polling 类存在', () => {
		expect(typeof polling.Polling).toBe('function');
		const p = new polling.Polling();
		expect(p).toBeInstanceOf(polling.Polling);
	});

	it('Polling 有 start/stop/running', () => {
		const p = new polling.Polling();
		expect(typeof p.start).toBe('function');
		expect(typeof p.stop).toBe('function');
		expect(p.running).toBe(false);
	});
});

describe('dist 子模块 - ipc', () => {
	it('H5Bridge 类存在', () => {
		expect(typeof ipc.H5Bridge).toBe('function');
	});

	it('IframeBridge 类存在', () => {
		expect(typeof ipc.IframeBridge).toBe('function');
	});
});

describe('dist 子模块 - event-bus', () => {
	it('EventBus 类可实例化', () => {
		const bus = new eventBus.EventBus();
		expect(bus).toBeInstanceOf(eventBus.EventBus);
	});

	it('EventBus on/emit', () => {
		const bus = new eventBus.EventBus();
		let received = '';
		bus.on('test', (msg: string) => { received = msg; });
		bus.emit('test', 'hello');
		expect(received).toBe('hello');
	});

	it('EventBus once', () => {
		const bus = new eventBus.EventBus();
		let count = 0;
		bus.once('t', () => { count++; });
		bus.emit('t');
		bus.emit('t');
		expect(count).toBe(1);
	});

	it('EventBus off', () => {
		const bus = new eventBus.EventBus();
		let count = 0;
		const handler = () => { count++; };
		bus.on('c', handler);
		bus.emit('c');
		bus.off('c', handler);
		bus.emit('c');
		expect(count).toBe(1);
	});

	it('EventBus listenerCount', () => {
		const bus = new eventBus.EventBus();
		bus.on('a', () => {});
		bus.on('a', () => {});
		bus.on('b', () => {});
		expect(bus.listenerCount('a')).toBe(2);
		expect(bus.listenerCount()).toBe(3);
	});

	it('eventBus 全局单例', () => {
		expect(eventBus.eventBus).toBeInstanceOf(eventBus.EventBus);
	});
});
