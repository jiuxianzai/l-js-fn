import {REGEXP} from '../config/regex';

/**
 * 检查值是否为空
 */
export function isEmpty<T>(value: T | null | undefined): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
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
  if (!REGEXP.ID_CARD.test(idCard)) return false;
  if (idCard.length === 15) return true;

  const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const checkMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
  const checkCode = idCard[17].toUpperCase();

  const sum = idCard
    .slice(0, 17)
    .split('')
    .reduce((acc, digit, index) => acc + Number(digit) * factors[index], 0);

  return checkCode === checkMap[sum % 11];
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

  return valueKeys.every(
    key => key in (other as object) && isEqual((value as any)[key], (other as any)[key])
  );
}
