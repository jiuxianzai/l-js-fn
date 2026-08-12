import { getAdapter } from '@/uniapp/base.ts';
import type { FileOptions } from '@/uniapp/types.ts';

class File {
	private get adapter() {
		return getAdapter();
	}

	/** 获取用户数据根路径，不存在时抛错 */
	private getRootPath(): string {
		const root = this.adapter.getUserDataPath?.();
		if (!root) {
			throw new Error('[l-js-fn/uniapp] file: 当前平台不支持 USER_DATA_PATH');
		}
		return root;
	}

	/** 检查平台是否支持文件系统操作 */
	private ensureFileSupport(): void {
		if (!this.adapter.fileWrite) {
			throw new Error('[l-js-fn/uniapp] file: 当前平台不支持文件系统');
		}
	}

	/**
	 * 拼接完整文件路径（USER_DATA_PATH/文件名）
	 * @param fileName - 文件名（可含子路径，如 'dir/a.json'）
	 * @returns 完整路径
	 * @example
	 * file.getPath('a.json') // 'wxfile://usr/a.json'（平台相关）
	 */
	getPath(fileName: string): string {
		if (typeof fileName !== 'string' || !fileName.trim()) {
			throw new TypeError('file.getPath: fileName 必须是合法字符串');
		}
		return `${this.getRootPath()}/${fileName.replace(/^\/+/, '')}`;
	}

	/**
	 * 写入文件（对象自动 JSON 序列化）
	 * @param fileName - 文件名
	 * @param data - 内容（字符串或 JSON 可序列化对象）
	 * @param options - 配置选项
	 * @returns Promise，成功 resolve，失败 reject
	 * @example
	 * await file.write('user.json', { name: 'John', age: 20 })
	 * await file.write('note.txt', '纯文本内容')
	 */
	write(fileName: string, data: string | object, options: FileOptions = {}): Promise<void> {
		const { json = true } = options;
		this.ensureFileSupport();
		const filePath = this.getPath(fileName);
		const content = json && typeof data === 'object' ? JSON.stringify(data) : String(data);
		return this.adapter.fileWrite!(filePath, content);
	}

	/**
	 * 读取文件（JSON 内容自动反序列化）
	 * @param fileName - 文件名
	 * @param options - 配置选项
	 * @returns Promise<T | string>，json=true 时优先反序列化为对象，失败降级返回字符串
	 * @example
	 * const user = await file.read('user.json') // { name: 'John', age: 20 }
	 * const text = await file.read('note.txt', { json: false }) // 纯文本
	 */
	async read<T = any>(fileName: string, options: FileOptions = {}): Promise<T | string> {
		const { json = true } = options;
		this.ensureFileSupport();
		const filePath = this.getPath(fileName);
		const raw = await this.adapter.fileRead!(filePath);
		if (json && typeof raw === 'string') {
			try {
				return JSON.parse(raw) as T;
			} catch {
				// 非 JSON 内容，降级返回字符串
			}
		}
		return raw as T | string;
	}

	/**
	 * 检查文件是否存在
	 * @param fileName - 文件名
	 * @returns Promise<boolean>
	 * @example
	 * const exists = await file.access('user.json')
	 */
	access(fileName: string): Promise<boolean> {
		this.ensureFileSupport();
		const filePath = this.getPath(fileName);
		return this.adapter.fileAccess!(filePath);
	}

	/**
	 * 删除文件
	 * @param fileName - 文件名
	 * @returns Promise，成功 resolve，失败 reject
	 * @example
	 * await file.remove('user.json')
	 */
	remove(fileName: string): Promise<void> {
		this.ensureFileSupport();
		const filePath = this.getPath(fileName);
		return this.adapter.fileRemove!(filePath);
	}
}

const file = /* @__PURE__ */ new File();

export { file };
