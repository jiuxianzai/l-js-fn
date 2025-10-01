type ErrorType = "connection_create_error" | "connection_error" | "connection_close" | "connection_send_error";

interface ErrorPayload {
  type: ErrorType;
  data: unknown;
}

type MessageCallback = (message: string) => void;
type ErrorCallback = (error: ErrorPayload) => void;

export class WebSocketManager {
  private url: string;
  private onMessageCallback: MessageCallback | null;
  private onErrorCallback: ErrorCallback | null;
  private webSocket: WebSocket | null;
  private timer: ReturnType<typeof setInterval> | null;

  constructor(url: string, onMessageCallback?: MessageCallback, onErrorCallback?: ErrorCallback) {
    if (typeof url !== "string") {
      throw new TypeError("url 参数必须是字符串类型");
    }

    this.url = url;
    this.onMessageCallback = onMessageCallback || null;
    this.onErrorCallback = onErrorCallback || null;
    this.webSocket = null;
    this.timer = null;

    this.connect(); // 初始化连接
  }

  /** 建立 WebSocket 连接 */
  private connect() {
    if (typeof WebSocket === "undefined") {
      this.handleError("connection_create_error", "当前环境不支持 WebSocket");
      return;
    }

    if (this.webSocket && (this.webSocket.readyState === WebSocket.OPEN || this.webSocket.readyState === WebSocket.CONNECTING)) {
      this.handleError("connection_create_error", "WebSocket 已处于连接或正在连接中");
      return;
    }

    try {
      this.webSocket = new WebSocket(this.url);
      this.webSocket.onopen = this.onWebSocketOpen.bind(this);
      this.webSocket.onmessage = this.onWebSocketMessage.bind(this);
      this.webSocket.onerror = this.onWebSocketError.bind(this);
      this.webSocket.onclose = this.onWebSocketClose.bind(this);
    } catch (error) {
      this.handleError("connection_create_error", error);
    }
  }

  /** 检查 WebSocket 连接状态并发送消息 */
  public checkConnection(body: object | string, setTime: number = 10000) {
    if (typeof setTime !== "number" || setTime <= 0) {
      this.handleError("connection_send_error", "setTime 参数必须是正数");
      return;
    }

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(() => {
      this.sendWebSocketMessage(body);
    }, setTime);
  }

  /** 获取 WebSocket 实例 */
  public getWebSocket(): WebSocket | null {
    return this.webSocket;
  }

  /** 尝试重新连接 */
  public reconnect(delay: number = 5000) {
    if (typeof delay !== "number" || delay <= 0) {
      this.handleError("connection_send_error", "delay 参数必须是正数");
      return;
    }

    setTimeout(() => {
      this.close();
      this.connect();
    }, delay);
  }

  /** WebSocket 连接打开 */
  private onWebSocketOpen(event: Event) {
    console.log("WebSocket 已连接:", event);
  }

  /** 收到消息 */
  private onWebSocketMessage(event: MessageEvent) {
    console.log('接收消息:', event.data);
    if (this.onMessageCallback) {
      this.onMessageCallback(event.data);
    }
  }

  /** 出现错误 */
  private onWebSocketError(error: Event) {
    this.handleError("connection_error", error);
  }

  /** 连接关闭 */
  private onWebSocketClose(event: CloseEvent) {
    this.handleError("connection_close", event);
  }

  /** 发送消息 */
  public sendWebSocketMessage(message: object | string) {
    if (!this.webSocket || this.webSocket.readyState !== WebSocket.OPEN) {
      this.handleError("connection_send_error", "WebSocket 未打开，无法发送消息");
      return;
    }

    try {
      const data = typeof message === "object" ? JSON.stringify(message) : String(message);
      this.webSocket.send(data);
    } catch (error) {
      this.handleError("connection_send_error", error);
    }
  }

  /** 关闭连接 */
  public close() {
    if (this.webSocket) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      this.webSocket.close();
      this.webSocket = null;
    }
  }

  /** 统一错误处理 */
  private handleError(type: ErrorType, data: unknown) {
    if (this.onErrorCallback) {
      this.onErrorCallback({ type, data });
    } else {
      console.error(type, data);
    }
  }
}
