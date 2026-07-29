import { IPC_TYPE, IPCMessage } from '@/types';
import { getUuid } from '@/libs/string-kit.ts';

/**
 * 父应用向子应用发送消息
 */
type Resolver = (value: unknown) => void;
type Rejecter = (reason?: unknown) => void;
type EventHandler = (...args: unknown[]) => void;
type QueueMessage = { type: IPC_TYPE; eventName: string; params?: unknown; id?: string };

export class H5Bridge {
	private pending: Record<string, { resolve: Resolver; reject: Rejecter }> = {};
	// 注册事件列表
	private eventHandlers: Record<string, EventHandler[]> = {};
	// 消息队列,用于iframe还未准备好
	private queue: QueueMessage[] = [];
	private iframeReady = false;

	constructor(private iframe: HTMLIFrameElement | null) {
		this._onMessage = this._onMessage.bind(this);
		this._onIframeLoad = this._onIframeLoad.bind(this);
		window.addEventListener('message', this._onMessage);
		if (this.iframe) {
			this.iframe.addEventListener('load', this._onIframeLoad);
		}
	}

	/**
	 * 调用方法
	 * @param eventName - 事件名称
	 * @param {unknown} [params] - 参数(可选)
	 * @returns {Promise<unknown>}
	 */
	call<T = unknown>(eventName: string, params?: unknown): Promise<T> {
		return new Promise((resolve, reject) => {
			const uuid = getUuid();
			const msg = { type: IPC_TYPE.REQUEST, eventName, params, id: uuid };
			// 发起请求
			if (this.iframeReady) {
				this._postMessage(msg);
			} else {
				this.queue.push(msg);
			}
			// 记录请求
			this.pending[uuid] = { resolve: resolve as Resolver, reject };
		});
	}

	/** iframe 加载完成时触发 */
	private _onIframeLoad() {
		this.iframeReady = true;
		this._flushPending();
	}

	private _flushPending() {
		while (this.queue.length) {
			const msg = this.queue.shift()!;
			const { type, eventName, params, id } = msg;
			this._postMessage({ type, eventName, params, id });
		}
	}

	private _postMessage(msg: { type: IPC_TYPE; eventName: string; params?: unknown; id?: string }) {
		this.iframe?.contentWindow?.postMessage(msg, '*');
	}

	/* 接收消息 */
	private _onMessage(event: MessageEvent<IPCMessage>) {
		// 只接收this.iframe发送的消息
		if (!this.iframe || event.source !== this.iframe.contentWindow) return;
		const { type, id, result, error, eventName, params } = event.data;
		switch (type) {
			// 获取响应结果
			case IPC_TYPE.RESPONSE:
				if (error) {
					this.pending[id as string].reject(error);
				} else {
					this.pending[id as string].resolve(result);
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
			this.eventHandlers[eventName] = this.eventHandlers[eventName].filter((item) => item !== callback);
		} else {
			this.eventHandlers[eventName] = [];
		}
	}

	/**
	 * 发布事件
	 * @param {string} eventName - 事件名称
	 * @param {unknown} [params] - 参数
	 * @returns {void}
	 */
	emit(eventName: string, params?: unknown): void {
		this.iframe?.contentWindow?.postMessage(
			{
				type: IPC_TYPE.EMIT,
				eventName,
				params,
			},
			'*'
		);
	}

	destroy() {
		// 移除 window 监听
		window.removeEventListener('message', this._onMessage);

		// 移除 iframe load 监听
		if (this.iframe) {
			this.iframe.removeEventListener('load', this._onIframeLoad);
		}

		// 拒绝所有未完成的 Promise
		Object.values(this.pending).forEach(({ reject }) => reject(new Error('Bridge destroyed')));

		// 清空数据
		this.pending = {};
		this.queue = [];
		this.eventHandlers = {};
		this.iframeReady = false;
	}
}
