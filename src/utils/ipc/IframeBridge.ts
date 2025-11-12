import { IPC_TYPE, IPCMessage } from '@/types';

/**
 * 子应用向主应用发送消息
 */
export class IframeBridge {
	private handles: Record<string, Function> = {};
	// 注册事件列表
	private eventHandlers: Record<string, Function[]> = {};

	constructor() {
		this._onMessage = this._onMessage.bind(this);
		window.addEventListener('message', this._onMessage);
	}

	/**
	 * 注册事件处理函数
	 * @param eventName - 事件名称
	 * @param callback - 处理函数
	 */
	register(eventName: string, callback: Function) {
		this.handles[eventName] = callback;
	}

	private async _onMessage(event: MessageEvent<IPCMessage>) {
		const { type, id, eventName, params } = event.data;
		switch (type) {
			case IPC_TYPE.REQUEST:
				// 进行请求响应
				try {
					const result = await this.handles[eventName](params);
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
	 * @param callback - 处理函数
	 * @private
	 */
	on(eventName: string, callback: Function) {
		if (this.eventHandlers[eventName]) {
			this.eventHandlers[eventName].push(callback);
		} else {
			this.eventHandlers[eventName] = [callback];
		}
	}

	/**
	 * 移除监听事件
	 * @param eventName - 事件名称
	 * @param callback - 移除特定函数的监听(为空默认删除该事件所有监听)
	 */
	off(eventName: string, callback?: Function) {
		if (callback) {
			this.eventHandlers[eventName] = this.eventHandlers[eventName].filter((item) => item !== callback);
		} else {
			this.eventHandlers[eventName] = [];
		}
	}

	/**
	 * 发布事件
	 * @param eventName - 事件名称
	 * @param params - 参数
	 * @private
	 */
	emit(eventName: string, params?: any) {
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
