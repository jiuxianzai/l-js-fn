import { IPC_TYPE, IPCMessage } from '@/types';

/**
 * 子应用向主应用发送消息
 */
type RpcHandler = (...args: unknown[]) => unknown | Promise<unknown>;
type EventHandler = (...args: unknown[]) => void;

export class IframeBridge {
	private handles: Record<string, RpcHandler> = {};
	// 注册事件列表
	private eventHandlers: Record<string, EventHandler[]> = {};

	constructor() {
		this._onMessage = this._onMessage.bind(this);
		window.addEventListener('message', this._onMessage);
	}

	/**
	 * 注册事件处理函数
	 * @param eventName - 事件名称
	 * @param {(...args: unknown[]) => (unknown | Promise<unknown>)} callback - 处理函数
	 * @returns {void}
	 */
	register(eventName: string, callback: RpcHandler): void {
		this.handles[eventName] = callback;
	}

	private async _onMessage(event: MessageEvent<IPCMessage>) {
		const { type, id, eventName, params } = event.data;
		switch (type) {
			case IPC_TYPE.REQUEST:
			try {
				const handler = this.handles[eventName];
				if (!handler) return;
				const result = await handler(params);
					window.parent.postMessage(
						{
							type: IPC_TYPE.RESPONSE,
							result,
							id,
						},
						'*'
					);
				} catch (err) {
					window.parent.postMessage(
						{
							type: IPC_TYPE.RESPONSE,
							error: JSON.stringify(err),
							id,
						},
						'*'
					);
				}
				break;
			case IPC_TYPE.EMIT:
				// 进行事件注册
				const fnList = this.eventHandlers[eventName] || [];
				for (const fn of fnList) {
					fn(params);
				}
				break;
			default:
				break;
		}
	}

	/**
	 * 监听事件
	 * @param eventName - 事件名称
	 * @param {(...args: unknown[]) => void} callback - 处理函数
	 * @returns {void}
	 * @private
	 */
	on(eventName: string, callback: EventHandler): void {
		if (this.eventHandlers[eventName]) {
			this.eventHandlers[eventName].push(callback);
		} else {
			this.eventHandlers[eventName] = [callback];
		}
	}

	/**
	 * 移除监听事件
	 * @param eventName - 事件名称
	 * @param {(...args: unknown[]) => void} [callback] - 移除特定函数的监听(为空默认删除该事件所有监听)
	 * @returns {void}
	 */
	off(eventName: string, callback?: EventHandler): void {
		if (callback) {
			this.eventHandlers[eventName] = (this.eventHandlers[eventName] || []).filter((item) => item !== callback);
		} else {
			this.eventHandlers[eventName] = [];
		}
	}

	/**
	 * 发布事件
	 * @param {string} eventName - 事件名称
	 * @param {unknown} [params] - 参数
	 * @returns {void}
	 * @private
	 */
	emit(eventName: string, params?: unknown): void {
		window.parent.postMessage(
			{
				type: IPC_TYPE.EMIT,
				eventName,
				params,
			},
			'*'
		);
	}

	destroy() {
		window.removeEventListener('message', this._onMessage);
		this.handles = {};
		this.eventHandlers = {};
	}
}
