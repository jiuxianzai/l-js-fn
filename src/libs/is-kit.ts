import {REGEXP} from '@/regex';

/**
 * 检查值是否为空
 */
export function isEmpty<T>(value: T | null | undefined): boolean {
  // 1. 处理真正的 null 和 undefined
  if (value === null || value === undefined) return true;

  // 2. 处理字符串类型
  if (typeof value === 'string') {
    const trimmed = value.trim();
    // 检查是否为空字符串，或者是否是字符串形式的 "null" 或 "undefined"
    return trimmed === '' || trimmed.toLowerCase() === 'null' || trimmed.toLowerCase() === 'undefined';
  }

  // 3. 处理数组
  if (Array.isArray(value)) return value.length === 0;

  // 4. 处理对象 (注意：null 已经在第一步过滤掉了，所以这里一定是真正的对象)
  if (typeof value === 'object') return Object.keys(value).length === 0;

  return false;
}

/**
 * 检查值是否非空
 */
export function isNotEmpty<T>(value: T | null | undefined): boolean {
  return !isEmpty(value);
}

/**
 * 是否为对象
 */
export function isObject<T>(value: T): value is T & Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 是否为数组
 */
export function isArray<T>(value: T): value is T & unknown[] {
	return Array.isArray(value);
}

/**
 * 去除 URL 地址中 ? 后面的查询参数
 */
function stripQueryParam(str: string): string {
	const idx = str.indexOf('?');
	return idx === -1 ? str : str.slice(0, idx);
}

/**
 * 检查指定地址是否存在于地址数组中（忽略 ? 后的查询参数）
 * @param arr - 地址数组
 * @param value - 需要检查的地址字符串
 * @returns true 表示存在，false 表示不存在或数组为空
 * @example
 * isInArray(['https://example.com', 'https://test.com'], 'https://example.com?foo=bar') // true
 * isInArray(['a', 'b'], 'a') // true
 * isInArray([], 'https://example.com') // false
 */
export function isInArray(arr: string[], value: string): boolean {
	if (!isArray(arr)) return false;

	const isUrl = isURL(value) || arr.some((item) => isURL(String(item)));
	if (isUrl) {
		const strippedValue = stripQueryParam(value);
		return arr.some((item) => stripQueryParam(String(item)) === strippedValue);
	}

	return arr.includes(value);
}

/**
 * 是否为图片
 */
export const isImage = (filename: string): boolean => {
	if (typeof filename !== 'string') return false;
	const lastDot = filename.lastIndexOf('.');
	const ext = lastDot > 0 ? filename.slice(lastDot).toLowerCase() : '';
	return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff', '.psd', '.raw', '.heic', '.heif'].includes(ext);
};

/**
 * 是否为字符串
 */
export function isString<T>(value: T): value is T & string {
  return typeof value === 'string' || value instanceof String;
}

/**
 * 是否为有效邮箱
 */
export function isEmail(value: string): boolean {
  return REGEXP.EMAIL.test(value);
}

/**
 * 是否为合法 URL（含协议地址或绝对路径如 /path、//example.com）
 */
export function isURL(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    // new URL 失败时，再匹配绝对路径（/xxx）或协议相对路径（//xxx）
    return /^(\/\/|\/)/.test(value);
  }
}

/**
 * 是否为中国大陆身份证号码
 */
export function isIdCard(idCard: string): boolean {
  // 转为字符串，支持数字类型输入
  const str = String(idCard);

  if (!REGEXP.ID_CARD.test(str)) return false;
  if (str.length === 15) return true;

  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  const checkCode = str[17].toUpperCase();

  const sum = str
    .slice(0, 17)
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * factors[index], 0);

  return checkCode === checkMap[sum % 11];
}

/**
 * 判断是否合法 http 链接
 */
export function isHttp(value: string): boolean {
	if (!value) return false;
	try {
		return new URL(value).protocol === 'http:';
	} catch {
		return false;
	}
}

/**
 * 判断是否合法 https 链接
 */
export function isHttps(value: string): boolean {
	if (!value) return false;
	try {
		return new URL(value).protocol === 'https:';
	} catch {
		return false;
	}
}

/**
 * 判断是否为合法手机号码（中国大陆）
 * @param {string} phone - 待校验的手机号
 * @returns {boolean} 是否为手机号
 */
export function isPhoneNumber(phone: string): boolean {
  // 去掉首尾空格
  const str = String(phone).trim();

  // 中国大陆手机号正则：1开头，第二位3-9，后面9位数字
  const regex = REGEXP.PHONE;

  return regex.test(str);
}

/**
 * 深度比较两个值是否相等（支持循环引用检测、Date/RegExp/Map/Set/Symbol）
 */
export function isEqual<T>(value: T, other: T): boolean {
	const compared = new WeakMap<object, Set<object>>();

	function deepEqual(a: unknown, b: unknown): boolean {
		if (typeof a !== 'object' && typeof b !== 'object') {
			if (Number.isNaN(a) && Number.isNaN(b)) return true;
			return a === b;
		}

		if (a === null && b === null) return true;
		if (a === null || b === null) return false;
		if (typeof a !== typeof b) return false;

		// Date
		if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
		if (a instanceof Date || b instanceof Date) return false;

		// RegExp
		if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
		if (a instanceof RegExp || b instanceof RegExp) return false;

		if (a === b) return true;

		// 循环引用检测
		let aSet = compared.get(a as object);
		if (!aSet) {
			aSet = new Set();
			compared.set(a as object, aSet);
		}
		if (aSet.has(b as object)) return true;
		aSet.add(b as object);

		// Map
		if (a instanceof Map && b instanceof Map) {
			if (a.size !== b.size) return false;
			for (const [key, val] of a) {
				if (!b.has(key) || !deepEqual(val, b.get(key))) return false;
			}
			return true;
		}
		if (a instanceof Map || b instanceof Map) return false;

		// Set
		if (a instanceof Set && b instanceof Set) {
			if (a.size !== b.size) return false;
			const bArr = [...b];
			for (const val of a) {
				const found = bArr.findIndex((item) => deepEqual(val, item));
				if (found === -1) return false;
				bArr.splice(found, 1);
			}
			return true;
		}
		if (a instanceof Set || b instanceof Set) return false;

		if (Array.isArray(a) && Array.isArray(b)) {
			if (a.length !== b.length) return false;
			for (let i = 0; i < a.length; i++) {
				if (!deepEqual(a[i], b[i])) return false;
			}
			return true;
		}

		if (Array.isArray(a) || Array.isArray(b)) return false;

		// 使用 Reflect.ownKeys 捕获 Symbol 键
		const aKeys = Reflect.ownKeys(a as object);
		const bKeys = Reflect.ownKeys(b as object);
		if (aKeys.length !== bKeys.length) return false;

		for (let i = 0; i < aKeys.length; i++) {
			const key = aKeys[i];
			if (!Reflect.has(b as object, key)) return false;
			if (!deepEqual((a as Record<string, unknown>)[key as string], (b as Record<string, unknown>)[key as string])) return false;
		}

		return true;
	}

	return deepEqual(value, other);
}

/**
 * 校验参数中必填选项是否为空
 * @param required - 必填字段数组
 * @param params - 需校验的参数
 * @return {string | null} - 未通过返回该字段，通过则返回null
 */
export function validateParams(required: string[], params: Record<string, unknown>): string | null {
  for (const key of required) {
    if (!(key in params) || params[key] === null || params[key] === undefined) {
      return key;
    }
  }
  return null;
}