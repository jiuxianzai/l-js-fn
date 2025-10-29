/**
 * 文件信息
 */
export interface FileInfo {
  // 文件名
  fileName: string;
  // 文件后缀名
  extension: string;
}

/**
 * 定义IPC消息体
 */
export interface IPCMessage<T = any> {
  type: IPC_TYPE; // 消息类型
  id?: string; // 消息ID
  eventName: string; // 事件名称
  params?: T; // 参数
  error?: string; // 错误信息
  result?: any; // 结果
}

/**
 * 定义 IPC 通讯类型
 */
export enum IPC_TYPE {
  REQUEST = 'request',
  RESPONSE = 'response',
  EMIT = 'emit',
}

/**
 * 定义ws的错误类型
 */
export type ErrorType = "connection_create_error" | "connection_error" | "connection_close" | "connection_send_error";

interface ErrorPayload {
  type: ErrorType;
  data: unknown;
}

export type MessageCallback = (message: string) => void;
export type ErrorCallback = (error: ErrorPayload) => void;

/**
 * 定义滚动位置类型
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * 数组移动操作类型
 */
export type MoveAction = 'up' | 'down' | 'top' | 'bottom';