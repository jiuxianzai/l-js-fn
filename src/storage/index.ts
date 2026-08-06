/**
 * 存储项（带过期时间）
 */
interface StorageItem<T> {
	/** 存储的值 */
	value: T;
	/** 过期时间戳（毫秒），-1 表示永不过期 */
	expire: number;
}

/**
 * Storage 配置选项
 */
export interface StorageOptions {
	/** 过期时间（秒），默认 -1（永不过期） */
	expire?: number;
}

/**
 * 设置 localStorage（支持过期时间）
 * @param key 键名
 * @param value 值（支持对象、数组等 JSON 可序列化的类型）
 * @param options 配置选项
 * @returns 是否设置成功
 * @example
 * setStorage('user', { name: 'John', age: 20 })
 * setStorage('token', 'abc123', { expire: 3600 }) // 1小时后过期
 */
export function setStorage<T>(key: string, value: T, options: StorageOptions = {}): boolean {
	if (typeof localStorage === 'undefined') {
		console.warn('setStorage: 当前环境不支持 localStorage');
		return false;
	}

	try {
		const { expire = -1 } = options;
		const item: StorageItem<T> = {
			value,
			expire: expire === -1 ? -1 : Date.now() + expire * 1000,
		};
		localStorage.setItem(key, JSON.stringify(item));
		return true;
	} catch (error) {
		console.error('setStorage error:', error);
		return false;
	}
}

/**
 * 获取 localStorage（自动处理过期）
 * @param key 键名
 * @returns 值，如果不存在或已过期返回 null
 * @example
 * getStorage('user') // { name: 'John', age: 20 }
 * getStorage('expired') // null（已过期）
 * getStorage('notexist') // null（不存在）
 */
export function getStorage<T>(key: string): T | null {
	if (typeof localStorage === 'undefined') {
		console.warn('getStorage: 当前环境不支持 localStorage');
		return null;
	}

	try {
		const itemStr = localStorage.getItem(key);
		if (!itemStr) return null;

		const item: StorageItem<T> = JSON.parse(itemStr);

		// 检查是否过期
		if (item.expire !== -1 && Date.now() > item.expire) {
			removeStorage(key); // 自动清理过期数据
			return null;
		}

		return item.value;
	} catch (error) {
		console.error('getStorage error:', error);
		return null;
	}
}

/**
 * 删除 localStorage
 * @param key 键名
 * @returns 是否删除成功
 * @example
 * removeStorage('user')
 */
export function removeStorage(key: string): boolean {
	if (typeof localStorage === 'undefined') {
		console.warn('removeStorage: 当前环境不支持 localStorage');
		return false;
	}

	try {
		localStorage.removeItem(key);
		return true;
	} catch (error) {
		console.error('removeStorage error:', error);
		return false;
	}
}

/**
 * 清空所有 localStorage
 * @returns 是否清空成功
 * @example
 * clearStorage()
 */
export function clearStorage(): boolean {
	if (typeof localStorage === 'undefined') {
		console.warn('clearStorage: 当前环境不支持 localStorage');
		return false;
	}

	try {
		localStorage.clear();
		return true;
	} catch (error) {
		console.error('clearStorage error:', error);
		return false;
	}
}

/**
 * 检查 localStorage 是否存在且未过期
 * @param key 键名
 * @returns 是否存在
 * @example
 * hasStorage('user') // true
 * hasStorage('notexist') // false
 */
export function hasStorage(key: string): boolean {
	return getStorage(key) !== null;
}

/**
 * 获取所有 localStorage 的键名
 * @returns 键名数组
 * @example
 * getStorageKeys() // ['user', 'token', 'settings']
 */
export function getStorageKeys(): string[] {
	if (typeof localStorage === 'undefined') {
		console.warn('getStorageKeys: 当前环境不支持 localStorage');
		return [];
	}

	try {
		return Object.keys(localStorage);
	} catch (error) {
		console.error('getStorageKeys error:', error);
		return [];
	}
}

/**
 * 获取 localStorage 的数量
 * @returns 数量
 * @example
 * getStorageLength() // 3
 */
export function getStorageLength(): number {
	if (typeof localStorage === 'undefined') {
		console.warn('getStorageLength: 当前环境不支持 localStorage');
		return 0;
	}

	try {
		return localStorage.length;
	} catch (error) {
		console.error('getStorageLength error:', error);
		return 0;
	}
}

/**
 * 清理所有已过期的 localStorage
 * @returns 清理的数量
 * @example
 * clearExpiredStorage() // 2（清理了2个过期项）
 */
export function clearExpiredStorage(): number {
	if (typeof localStorage === 'undefined') {
		console.warn('clearExpiredStorage: 当前环境不支持 localStorage');
		return 0;
	}

	let clearedCount = 0;
	const keys = getStorageKeys();

	for (const key of keys) {
		try {
			const itemStr = localStorage.getItem(key);
			if (!itemStr) continue;

			const item: StorageItem<unknown> = JSON.parse(itemStr);

			// 如果有过期时间且已过期
			if (item.expire !== -1 && Date.now() > item.expire) {
				localStorage.removeItem(key);
				clearedCount++;
			}
		} catch {
			// 解析失败的项也清理掉
			localStorage.removeItem(key);
			clearedCount++;
		}
	}

	return clearedCount;
}

/**
 * 设置 sessionStorage
 * @param key 键名
 * @param value 值（支持对象、数组等 JSON 可序列化的类型）
 * @returns 是否设置成功
 * @example
 * setSession('tabData', { id: 1, name: 'test' })
 */
export function setSession<T>(key: string, value: T): boolean {
	if (typeof sessionStorage === 'undefined') {
		console.warn('setSession: 当前环境不支持 sessionStorage');
		return false;
	}

	try {
		sessionStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch (error) {
		console.error('setSession error:', error);
		return false;
	}
}

/**
 * 获取 sessionStorage
 * @param key 键名
 * @returns 值，如果不存在返回 null
 * @example
 * getSession('tabData') // { id: 1, name: 'test' }
 */
export function getSession<T>(key: string): T | null {
	if (typeof sessionStorage === 'undefined') {
		console.warn('getSession: 当前环境不支持 sessionStorage');
		return null;
	}

	try {
		const itemStr = sessionStorage.getItem(key);
		if (!itemStr) return null;
		return JSON.parse(itemStr) as T;
	} catch (error) {
		console.error('getSession error:', error);
		return null;
	}
}

/**
 * 删除 sessionStorage
 * @param key 键名
 * @returns 是否删除成功
 * @example
 * removeSession('tabData')
 */
export function removeSession(key: string): boolean {
	if (typeof sessionStorage === 'undefined') {
		console.warn('removeSession: 当前环境不支持 sessionStorage');
		return false;
	}

	try {
		sessionStorage.removeItem(key);
		return true;
	} catch (error) {
		console.error('removeSession error:', error);
		return false;
	}
}

/**
 * 清空所有 sessionStorage
 * @returns 是否清空成功
 * @example
 * clearSession()
 */
export function clearSession(): boolean {
	if (typeof sessionStorage === 'undefined') {
		console.warn('clearSession: 当前环境不支持 sessionStorage');
		return false;
	}

	try {
		sessionStorage.clear();
		return true;
	} catch (error) {
		console.error('clearSession error:', error);
		return false;
	}
}

/**
 * 检查 sessionStorage 是否存在
 * @param key 键名
 * @returns 是否存在
 * @example
 * hasSession('tabData') // true
 */
export function hasSession(key: string): boolean {
	return getSession(key) !== null;
}

/**
 * 获取所有 sessionStorage 的键名
 * @returns 键名数组
 * @example
 * getSessionKeys() // ['tabData', 'formState']
 */
export function getSessionKeys(): string[] {
	if (typeof sessionStorage === 'undefined') {
		console.warn('getSessionKeys: 当前环境不支持 sessionStorage');
		return [];
	}

	try {
		return Object.keys(sessionStorage);
	} catch (error) {
		console.error('getSessionKeys error:', error);
		return [];
	}
}
