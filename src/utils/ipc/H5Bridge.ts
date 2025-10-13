import {IPC_TYPE, IPCMessage} from "@/types";
import {getUuid} from "@/libs/string-kit.ts";

/**
 * 父应用向子应用发送消息
 */
export class H5Bridge {
  private pending: Record<string, { resolve: Function, reject: Function }> = {};
  // 注册事件列表
  private eventHandlers: Record<string, Function[]> = {}
  // 消息队列,用于iframe还未准备好
  private queue: any[] = [];
  private iframeReady = false;

  constructor(private iframe: HTMLIFrameElement | null) {
    window.addEventListener('message', this._onMessage.bind(this));
    if (this.iframe) {
      // iframe 加载完成标记
      this.iframe.addEventListener('load', () => {
        this.iframeReady = true;
        this._flushPending();
      });
    }
  }

  /**
   * 调用方法
   * @param eventName - 事件名称
   * @param params - 参数(可选)
   * @returns Promise<any>
   */
  call(eventName: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const uuid = getUuid();
      const msg = {type: IPC_TYPE.REQUEST, eventName, params, id: uuid};
      // 发起请求
      if (this.iframeReady) {
        this._postMessage(msg);
      } else {
        this.queue.push(msg);
      }
      // 记录请求
      this.pending[uuid] = {resolve, reject};
    })
  }

  private _flushPending() {
    while (this.queue.length) {
      const {type, eventName, params, id} = this.queue.shift();
      this._postMessage({type, eventName, params, id});
    }
  }

  private _postMessage(msg: { type: IPC_TYPE, eventName: string, params?: any, id?: string }) {
    this.iframe?.contentWindow?.postMessage(msg, '*');
  }

  /* 接收消息 */
  private _onMessage(event: MessageEvent<IPCMessage>) {
    // 只接收this.iframe发送的消息
    if (event.source !== (this.iframe as HTMLIFrameElement).contentWindow) return;
    const {type, id, result, error, eventName, params} = event.data;
    switch (type) {
      // 获取响应结果
      case IPC_TYPE.RESPONSE:
        if (error) {
          this.pending[(id as string)].reject(error);
        } else {
          this.pending[(id as string)].resolve(result);
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
      this.eventHandlers[eventName] = this.eventHandlers[eventName].filter(item => item !== callback);
    } else {
      this.eventHandlers[eventName] = [];
    }
  }

  /* 发布事件 */
  emit(eventName: string, params?: any): void {
    this.iframe?.contentWindow?.postMessage({
      type: IPC_TYPE.EMIT,
      eventName,
      params
    }, '*');
  }
}