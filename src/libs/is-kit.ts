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
export function isObject<T>(value: T): value is T & Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 是否为数组
 */
export function isArray<T>(value: T): value is T & unknown[] {
  return Array.isArray(value) || Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * 是否为图片
 */
export const isImage = (filename: string): boolean => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tiff', '.psd', '.raw', '.heic', '.heif'].includes('.' + ext);
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
 * 是否为合法 URL
 */
export function isURL(value: string): boolean {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
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
	return String(value).toLowerCase().startsWith('http://');
}

/**
 * 判断是否合法 https 链接
 */
export function isHttps(value: string): boolean {
	if (!value) return false;
	return String(value).toLowerCase().startsWith('https://');
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
 * 深度比较两个值是否相等
 */
export function isEqual<T>(value: T, other: T): boolean {
  if (typeof value !== 'object' && typeof other !== 'object') {
    if (Number.isNaN(value) && Number.isNaN(other)) return true;
    return value === other;
  }

  if (value === null && other === null) return true;
  if (value === null || other === null) return false;
  if (typeof value !== typeof other) return false;
  if (value === other) return true;

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false;
    return value.every((v, i) => isEqual(v, (other as unknown[])[i]));
  }

  if (Array.isArray(value) || Array.isArray(other)) return false;

  const valueKeys = Object.keys(value as object);
  const otherKeys = Object.keys(other as object);
  if (valueKeys.length !== otherKeys.length) return false;

  return valueKeys.every((key) => key in (other as object) && isEqual((value as any)[key], (other as any)[key]));
}

/**
 * 校验参数中必填选项是否为空
 * @param required - 必填字段数组
 * @param params - 需校验的参数
 * @return {string | null} - 未通过返回该字段，通过则返回null
 */
export function validateParams(required: string[], params: Record<string, any>): string | null {
  for (const key of required) {
    if (!params[key]) {
      return key;
    }
  }
  return null;
}