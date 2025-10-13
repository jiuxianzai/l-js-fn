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
 * IPC消息体
 */
export interface IPCMessage<T = any> {
  type: IPC_TYPE; // 消息类型
  id?: string; // 消息ID
  eventName: string; // 事件名称
  params?: T; // 参数
  error?: string; // 错误信息
  result?: any; // 结果
}

export enum IPC_TYPE {
  REQUEST = 'request',
  RESPONSE = 'response',
  EMIT = 'emit',
}

export type ErrorType = "connection_create_error" | "connection_error" | "connection_close" | "connection_send_error";

interface ErrorPayload {
  type: ErrorType;
  data: unknown;
}

export type MessageCallback = (message: string) => void;
export type ErrorCallback = (error: ErrorPayload) => void;
