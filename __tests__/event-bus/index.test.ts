/**
 * event-bus 单元测试
 * 测试 EventBus 类的所有方法
 */

import { EventBus, eventBus } from '@/event-bus';

describe('EventBus - 事件总线', () => {
	// ==================== 构造函数 ====================
	describe('构造函数', () => {
		it('应该创建一个新的 EventBus 实例', () => {
			const bus = new EventBus();
			expect(bus).toBeInstanceOf(EventBus);
		});

		it('多个实例应该互不影响', () => {
			const bus1 = new EventBus();
			const bus2 = new EventBus();
			const handler = jest.fn();

			bus1.on('test', handler);
			bus2.emit('test', 'data');

			expect(handler).not.toHaveBeenCalled();
		});
	});

	// ==================== on + emit ====================
	describe('on + emit - 订阅与发布', () => {
		it('应该触发订阅的回调', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.on('login', handler);
			bus.emit('login', 'Alice');

			expect(handler).toHaveBeenCalledTimes(1);
			expect(handler).toHaveBeenCalledWith('Alice');
		});

		it('应该支持多个参数', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.on('data', handler);
			bus.emit('data', 1, 'hello', true);

			expect(handler).toHaveBeenCalledWith(1, 'hello', true);
		});

		it('应该支持同一事件的多个回调', () => {
			const bus = new EventBus();
			const h1 = jest.fn();
			const h2 = jest.fn();

			bus.on('click', h1);
			bus.on('click', h2);
			bus.emit('click');

			expect(h1).toHaveBeenCalledTimes(1);
			expect(h2).toHaveBeenCalledTimes(1);
		});

		it('发布无监听者的事件不应该报错', () => {
			const bus = new EventBus();
			expect(() => bus.emit('no-exist', 'data')).not.toThrow();
		});

		it('回调执行顺序应该与注册顺序一致', () => {
			const bus = new EventBus();
			const order: number[] = [];

			bus.on('test', () => order.push(1));
			bus.on('test', () => order.push(2));
			bus.on('test', () => order.push(3));
			bus.emit('test');

			expect(order).toEqual([1, 2, 3]);
		});
	});

	// ==================== once ====================
	describe('once - 一次性订阅', () => {
		it('应该只触发一次', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.once('init', handler);
			bus.emit('init', 'first');
			bus.emit('init', 'second');
			bus.emit('init', 'third');

			expect(handler).toHaveBeenCalledTimes(1);
			expect(handler).toHaveBeenCalledWith('first');
		});

		it('多个 once 回调应该各自独立触发', () => {
			const bus = new EventBus();
			const h1 = jest.fn();
			const h2 = jest.fn();

			bus.once('load', h1);
			bus.once('load', h2);
			bus.emit('load');
			bus.emit('load');

			expect(h1).toHaveBeenCalledTimes(1);
			expect(h2).toHaveBeenCalledTimes(1);
		});

		it('once 回调触发后不再响应', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.once('ready', handler);
			bus.emit('ready');
			bus.emit('ready');

			expect(handler).toHaveBeenCalledTimes(1);
			expect(bus.listenerCount('ready')).toBe(0);
		});
	});

	// ==================== off ====================
	describe('off - 取消订阅', () => {
		it('应该取消指定回调', () => {
			const bus = new EventBus();
			const h1 = jest.fn();
			const h2 = jest.fn();

			bus.on('test', h1);
			bus.on('test', h2);
			bus.off('test', h1);
			bus.emit('test');

			expect(h1).not.toHaveBeenCalled();
			expect(h2).toHaveBeenCalledTimes(1);
		});

		it('不带 handler 参数应该取消该事件的所有回调', () => {
			const bus = new EventBus();
			const h1 = jest.fn();
			const h2 = jest.fn();

			bus.on('test', h1);
			bus.on('test', h2);
			bus.off('test');
			bus.emit('test');

			expect(h1).not.toHaveBeenCalled();
			expect(h2).not.toHaveBeenCalled();
		});

		it('取消未注册的事件不应该报错', () => {
			const bus = new EventBus();
			expect(() => bus.off('no-exist')).not.toThrow();
		});

		it('取消未注册的回调不应该影响其他回调', () => {
			const bus = new EventBus();
			const handler = jest.fn();
			const otherFn = jest.fn();

			bus.on('test', handler);
			bus.off('test', otherFn);
			bus.emit('test');

			expect(handler).toHaveBeenCalledTimes(1);
		});
	});

	// ==================== clear ====================
	describe('clear - 清除所有监听', () => {
		it('应该清除所有事件', () => {
			const bus = new EventBus();
			const h1 = jest.fn();
			const h2 = jest.fn();

			bus.on('a', h1);
			bus.on('b', h2);
			bus.clear();
			bus.emit('a');
			bus.emit('b');

			expect(h1).not.toHaveBeenCalled();
			expect(h2).not.toHaveBeenCalled();
		});

		it('clear 后 listenerCount 应该为 0', () => {
			const bus = new EventBus();
			bus.on('test', () => {});
			bus.clear();

			expect(bus.listenerCount()).toBe(0);
		});
	});

	// ==================== listenerCount ====================
	describe('listenerCount - 监听数量', () => {
		it('应该返回指定事件的监听数量', () => {
			const bus = new EventBus();
			bus.on('test', () => {});
			bus.on('test', () => {});

			expect(bus.listenerCount('test')).toBe(2);
		});

		it('应该返回总监听数量', () => {
			const bus = new EventBus();
			bus.on('a', () => {});
			bus.on('a', () => {});
			bus.on('b', () => {});

			expect(bus.listenerCount()).toBe(3);
		});

		it('未注册的事件应该返回 0', () => {
			const bus = new EventBus();
			expect(bus.listenerCount('no-exist')).toBe(0);
		});

		it('空实例应该返回 0', () => {
			const bus = new EventBus();
			expect(bus.listenerCount()).toBe(0);
		});
	});

	// ==================== 类型安全 ====================
	describe('类型安全', () => {
		it('应该支持类型化事件 map', () => {
			type Events = {
				login: [user: string];
				logout: [];
				score: [name: string, points: number];
			};
			const bus = new EventBus<Events>();
			const handler = jest.fn();

			bus.on('login', handler);
			bus.emit('login', 'Alice');

			expect(handler).toHaveBeenCalledWith('Alice');
		});

		it('应该支持零参数事件', () => {
			type Events = { ready: [] };
			const bus = new EventBus<Events>();
			const handler = jest.fn();

			bus.on('ready', handler);
			bus.emit('ready');

			expect(handler).toHaveBeenCalledWith();
		});
	});

	// ==================== 全局单例 ====================
	describe('eventBus - 全局单例', () => {
		it('应该导出一个全局共享的 EventBus 实例', () => {
			expect(eventBus).toBeInstanceOf(EventBus);
		});

		it('不同引用应该指向同一个实例', () => {
			expect(eventBus).toBe(eventBus);
		});

		it('应该支持实际的 on/emit 使用', () => {
			const handler = jest.fn();

			eventBus.on('__test__', handler);
			eventBus.emit('__test__', 'data');
			eventBus.off('__test__');

			expect(handler).toHaveBeenCalledWith('data');
		});
	});

	// ==================== 边界情况 ====================
	describe('边界情况', () => {
		it('emit 遍历期间 off 不应该影响当前发射', () => {
			const bus = new EventBus();
			const order: number[] = [];

			bus.on('test', () => {
				order.push(1);
				bus.off('test');
			});
			bus.on('test', () => order.push(2));
			bus.emit('test');

			expect(order).toEqual([1, 2]);
		});

		it('emit 遍历期间 once 取消自身不应该影响当前发射', () => {
			const bus = new EventBus();
			const order: number[] = [];
			let called = false;

			bus.once('test', () => {
				called = true;
				order.push(1);
			});
			bus.on('test', () => order.push(2));
			bus.emit('test');

			expect(called).toBe(true);
			expect(order).toEqual([1, 2]);
			expect(bus.listenerCount('test')).toBe(1);
		});

		it('不应该将事件名转为字符串（区分字符串和 Symbol 不适用）', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.on('test', handler);
			bus.emit('test');

			expect(handler).toHaveBeenCalledTimes(1);
		});

		it('传入 undefined 作为参数', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.on('test', handler);
			bus.emit('test', undefined);

			expect(handler).toHaveBeenCalledWith(undefined);
		});

		it('传入 null 作为参数', () => {
			const bus = new EventBus();
			const handler = jest.fn();

			bus.on('test', handler);
			bus.emit('test', null);

			expect(handler).toHaveBeenCalledWith(null);
		});
	});

	describe('off - 取消不存在事件的监听器', () => {
		it('off 不存在的 handler 不应该报错', () => {
			const bus = new EventBus();
			const handler = jest.fn();
			// 先注册一个事件，再用不存在的 handler 取消
			bus.on('test', () => {});
			expect(() => bus.off('test', handler)).not.toThrow();
		});
	});
});
