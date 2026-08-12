type EventHandler<T extends unknown[] = unknown[]> = (...args: T) => void;
type EventMap = Record<string, unknown[]>;

/**
 * 事件总线，支持类型安全的事件订阅、发布和取消。
 *
 * @example
 * ```ts
 * // 基础用法
 * const bus = new EventBus();
 * bus.on('login', (user: string) => console.log(user));
 * bus.emit('login', 'Alice');
 *
 * // 类型安全用法
 * type Events = { login: [user: string]; logout: [] };
 * const typedBus = new EventBus<Events>();
 * typedBus.on('login', (user) => console.log(user)); // user 自动推断为 string
 * typedBus.emit('login', 'Bob');
 * ```
 */
export class EventBus<Events extends EventMap = EventMap> {
	private listeners = new Map<keyof Events, EventHandler[]>();

	/**
	 * 订阅事件
	 * @param event - 事件名
	 * @param handler - 回调函数
	 */
	on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
		const list = this.listeners.get(event);
		if (list) {
			list.push(handler as EventHandler);
		} else {
			this.listeners.set(event, [handler as EventHandler]);
		}
	}

	/**
	 * 订阅一次性事件（触发一次后自动取消）
	 * @param event - 事件名
	 * @param handler - 回调函数
	 */
	once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): void {
		const wrapper: EventHandler = ((...args: unknown[]) => {
			this.off(event, wrapper);
			(handler as EventHandler)(...args);
		}) as EventHandler;

		const list = this.listeners.get(event);
		if (list) {
			list.push(wrapper);
		} else {
			this.listeners.set(event, [wrapper]);
		}
	}

	/**
	 * 取消订阅事件
	 * @param event - 事件名
	 * @param handler - 要取消的回调函数，不传则取消该事件的所有回调
	 */
	off<K extends keyof Events>(event: K, handler?: EventHandler<Events[K]>): void {
		if (!handler) {
			this.listeners.delete(event);
			return;
		}

		const list = this.listeners.get(event);
		if (!list) return;

		const index = list.indexOf(handler as EventHandler);
		if (index > -1) {
			list.splice(index, 1);
		}
		if (list.length === 0) {
			this.listeners.delete(event);
		}
	}

	/**
	 * 发布事件
	 * @param event - 事件名
	 * @param args - 传递给回调函数的参数
	 */
	emit<K extends keyof Events>(event: K, ...args: Events[K]): void {
		const list = this.listeners.get(event);
		if (!list) return;

		const handlers = [...list];
		for (const handler of handlers) {
			handler(...args);
		}
	}

	/**
	 * 清除所有事件监听
	 */
	clear(): void {
		this.listeners.clear();
	}

	/**
	 * 获取指定事件已注册的监听数量
	 * @param event - 事件名，不传则返回总监听数量
	 */
	listenerCount(event?: keyof Events): number {
		if (event) {
			return this.listeners.get(event)?.length ?? 0;
		}
		let count = 0;
		this.listeners.forEach((list) => {
			count += list.length;
		});
		return count;
	}
}

/** 全局共享的事件总线单例 */
export const eventBus = /* @__PURE__ */ new EventBus();
