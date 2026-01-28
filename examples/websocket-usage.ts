/**
 * WebSocket 管理示例
 * 演示如何使用 WebSocketManager 类
 */

import { WebSocketManager } from 'l-js-fn/ws';

// 创建 WebSocket 管理器实例
const ws = new WebSocketManager(
  // WebSocket 服务器地址
  'ws://localhost:8080',

  // 消息回调
  (message) => {
    console.log('收到消息:', message);
    const data = JSON.parse(message);
    console.log('解析后的数据:', data);
  },

  // 错误回调
  (error) => {
    console.error('WebSocket 错误:', error.type, error.data);
  }
);

// ==================== 发送消息 ====================
// 发送文本消息
ws.sendWebSocketMessage('Hello WebSocket!');

// 发送 JSON 对象
ws.sendWebSocketMessage({
  type: 'chat',
  data: {
    user: 'John',
    message: 'Hello World',
  },
});

// ==================== 定时发送消息 ====================
// 每隔 10 秒发送一次心跳
ws.checkConnection(
  {
    type: 'heartbeat',
    timestamp: Date.now(),
  },
  10000
);

// ==================== 重新连接 ====================
// 5 秒后重新连接
ws.reconnect(5000);

// ==================== 获取 WebSocket 实例 ====================
const socket = ws.getWebSocket();
console.log('WebSocket 实例:', socket);
console.log('连接状态:', socket?.readyState); // 0=连接中, 1=已连接, 2=关闭中, 3=已关闭

// ==================== 关闭连接 ====================
// 当不需要使用时，关闭连接
// ws.close();

// ==================== 完整示例 ====================
/**
 * 以下是一个完整的聊天室示例
 */

interface ChatMessage {
  type: 'chat' | 'system' | 'heartbeat';
  data: {
    user?: string;
    message?: string;
    timestamp?: number;
  };
}

class ChatRoom {
  private ws: WebSocketManager;

  constructor(url: string) {
    this.ws = new WebSocketManager(
      url,
      this.handleMessage.bind(this),
      this.handleError.bind(this)
    );
  }

  // 处理收到的消息
  private handleMessage(message: string) {
    try {
      const data: ChatMessage = JSON.parse(message);

      switch (data.type) {
        case 'chat':
          console.log(`${data.data.user}: ${data.data.message}`);
          break;
        case 'system':
          console.log('系统消息:', data.data.message);
          break;
        case 'heartbeat':
          // 心跳消息，可以忽略或用于更新在线状态
          break;
      }
    } catch (error) {
      console.error('解析消息失败:', error);
    }
  }

  // 处理错误
  private handleError(error: { type: string; data: unknown }) {
    console.error('WebSocket 错误:', error);

    switch (error.type) {
      case 'connection_create_error':
        console.error('创建连接失败');
        break;
      case 'connection_error':
        console.error('连接错误');
        // 尝试重新连接
        this.ws.reconnect(5000);
        break;
      case 'connection_close':
        console.error('连接已关闭');
        // 尝试重新连接
        this.ws.reconnect(5000);
        break;
      case 'connection_send_error':
        console.error('发送消息失败');
        break;
    }
  }

  // 发送聊天消息
  sendMessage(user: string, message: string) {
    this.ws.sendWebSocketMessage({
      type: 'chat',
      data: {
        user,
        message,
        timestamp: Date.now(),
      },
    });
  }

  // 开始心跳
  startHeartbeat(interval = 30000) {
    this.ws.checkConnection(
      {
        type: 'heartbeat',
        data: {
          timestamp: Date.now(),
        },
      },
      interval
    );
  }

  // 关闭连接
  close() {
    this.ws.close();
  }
}

// 使用示例
const chatRoom = new ChatRoom('ws://localhost:8080');

// 开始心跳（每 30 秒）
chatRoom.startHeartbeat(30000);

// 发送消息
chatRoom.sendMessage('John', 'Hello World!');

// 关闭连接（当不需要时）
// chatRoom.close();

export { ChatRoom };
