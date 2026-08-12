import { getAdapter } from '@/uniapp/base.ts';
import type { UniStorageItem, UniStorageOptions } from '@/uniapp/types.ts';

const XOR_KEY = 0xa3;

/**
 * 固定宽度 XOR 加密
 * 每个字符编码为 4 位 hex（高字节/低字节分别 XOR），支持全 Unicode BMP 及代理对
 */
function xorEncode(str: string): string {
	let result = '';
	for (let i = 0; i < str.length; i++) {
		const code = str.charCodeAt(i);
		const hi = ((code >> 8) ^ XOR_KEY) & 0xff;
		const lo = (code ^ XOR_KEY) & 0xff;
		result += ('0' + hi.toString(16)).slice(-2) + ('0' + lo.toString(16)).slice(-2);
	}
	return result;
}

function xorDecode(hex: string): string {
	let result = '';
	for (let i = 0; i + 4 <= hex.length; i += 4) {
		const hi = (parseInt(hex.substr(i, 2), 16) ^ XOR_KEY) & 0xff;
		const lo = (parseInt(hex.substr(i + 2, 2), 16) ^ XOR_KEY) & 0xff;
		result += String.fromCharCode((hi << 8) | lo);
	}
	return result;
}

class Storage {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 设置存储（支持过期时间和加密）
	 * @param key - 键名
	 * @param value - 值
	 * @param options - 配置选项
	 * @returns 是否设置成功
	 * @example
	 * storage.set('token', 'abc123', { expire: 7200, encrypt: true })
	 * storage.set('user', { name: 'John' })
	 */
	set<T>(key: string, value: T, options: UniStorageOptions = {}): boolean {
		try {
			const { expire = -1, encrypt = false } = options;
			const item: UniStorageItem<T> = {
				value,
				expire: expire === -1 ? -1 : Date.now() + expire * 1000,
			};
			let data = JSON.stringify(item);
			if (encrypt) {
				data = xorEncode(data);
			}
			this.adapter.setStorageSync(key, data);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * 获取存储（自动处理过期和解密）
	 * @param key - 键名
	 * @param options - 配置选项（指定加密状态）
	 * @returns 值，不存在或已过期返回 null
	 * @example
	 * storage.get('token', { encrypt: true })
	 * storage.get('user')
	 */
	get<T>(key: string, options: Pick<UniStorageOptions, 'encrypt'> = {}): T | null {
		try {
			const { encrypt = false } = options;
			const raw = this.adapter.getStorageSync(key);
			if (raw === null) return null;

			let dataStr = raw;
			if (encrypt) {
				dataStr = xorDecode(raw);
			}

			const item: UniStorageItem<T> = JSON.parse(dataStr);

			if (item.expire !== -1 && Date.now() > item.expire) {
				this.remove(key);
				return null;
			}

			return item.value;
		} catch {
			return null;
		}
	}

	/**
	 * 删除存储
	 * @param key - 键名
	 * @returns 是否删除成功
	 * @example
	 * storage.remove('token')
	 */
	remove(key: string): boolean {
		try {
			this.adapter.removeStorageSync(key);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * 判断键是否存在（含已过期但未清除的项）
	 * @param key - 键名
	 * @returns 是否存在
	 * @example
	 * storage.has('token')
	 */
	has(key: string): boolean {
		try {
			return this.keys().includes(key);
		} catch {
			return false;
		}
	}

	/**
	 * 获取所有存储键名
	 * @returns 键名数组，获取失败返回空数组
	 * @example
	 * storage.keys()
	 */
	keys(): string[] {
		try {
			return this.adapter.api.getStorageInfoSync?.().keys || [];
		} catch {
			return [];
		}
	}

	/**
	 * 清除所有已过期的存储项
	 * @returns 清除的条目数量
	 * @example
	 * const removed = storage.clearExpired()
	 */
	clearExpired(): number {
		let count = 0;
		for (const key of this.keys()) {
			try {
				const raw = this.adapter.getStorageSync(key);
				if (typeof raw !== 'string' || raw === '') continue;
				const item = JSON.parse(raw) as UniStorageItem<unknown>;
				if (item && typeof item === 'object' && item.expire !== undefined && item.expire !== -1 && Date.now() > item.expire) {
					this.remove(key);
					count++;
				}
			} catch {
				// 非本模块格式的数据，跳过
			}
		}
		return count;
	}

	/**
	 * 清空所有存储
	 * @returns 是否清空成功
	 * @example
	 * storage.clear()
	 */
	clear(): boolean {
		try {
			this.adapter.clearStorageSync();
			return true;
		} catch {
			return false;
		}
	}
}

const storage = /* @__PURE__ */ new Storage();

export { storage };
