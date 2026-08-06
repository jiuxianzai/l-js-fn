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
export interface IPCMessage<T = unknown> {
	type: IPC_TYPE; // 消息类型
	id?: string; // 消息ID
	eventName: string; // 事件名称
	params?: T; // 参数
	error?: string; // 错误信息
	result?: unknown; // 结果
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
export type ErrorType = 'connection_create_error' | 'connection_error' | 'connection_close' | 'connection_send_error';

export interface ErrorPayload {
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

/**
 * 数组元素类型
 */
export type Primitive = string | number | boolean | null | undefined;

/**
 * URL 参数追加配置
 */
export interface AppendUrlOptions {
	/** 参数追加位置：'after' - 在 # 之后（默认），'before' - 在 # 之前 */
	position?: 'before' | 'after';
}

/**
 * 文件大小单位枚举
 */
export enum FileSizeUnit {
	Byte = 'B',
	KiloByte = 'KB',
	MegaByte = 'MB',
	GigaByte = 'GB',
	TeraByte = 'TB',
}

/**
 * 文件大小信息
 */
export interface FileSizeInfo {
	formatted: string;
	value: number;
	unit: FileSizeUnit;
}

/**
 * Cookie 配置选项
 */
export interface CookieOptions {
	expires?: number;
	path?: string;
	domain?: string;
	secure?: boolean;
	httpOnly?: boolean;
	sameSite?: 'strict' | 'lax' | 'none';
}
