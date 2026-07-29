/**
 * 结果类
 */
export class Result<T = unknown> {
	success: boolean;
	message: string;
	data?: T;

	private constructor(success: boolean, message: string, data?: T) {
		this.success = success;
		this.message = message;
		this.data = data;
	}

	/** 创建成功结果 */
	static ok<T = unknown>(data?: T, message = '操作成功'): Result<T> {
		return new Result<T>(true, message, data);
	}

	/** 创建失败结果 */
	static fail<T = unknown>(message = '操作失败', data?: T): Result<T> {
		return new Result<T>(false, message, data);
	}
}
