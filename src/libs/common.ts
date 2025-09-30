/**
 * 睡眠函数
 * @param time - 睡眠时间，毫秒
 * @returns Promise<void>
 */
export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * 创建防抖函数
 * @param func - 要防抖的函数
 * @param wait - 等待时间（毫秒）
 * @param immediate - 是否立即执行
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null;

  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/**
 * 创建节流函数
 * @param func - 要节流的函数
 * @param wait - 等待时间（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let lastTime = 0;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}

/**
 * 获取参数的详细类型
 * @param value - 要检查类型的值
 * @returns 类型字符串
 */
export function getType<T>(value: T): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  if (value instanceof RegExp) return 'regexp';
  if (typeof value === 'function') return 'function';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'object') {
    if (value.constructor === Object) return 'object';
    return (value.constructor.name || '').toLowerCase();
  }
  return typeof value;
}

/**
 * 深拷贝函数，支持循环引用
 * @param obj - 要深拷贝的对象
 * @param options - 配置选项
 * @param options.cloneFunctions - 是否克隆函数
 * @param options.cloneSpecialObjects - 是否克隆特殊对象（如 DOM 节点）
 */
export function deepClone<T>(
  obj: T,
  options?: { cloneFunctions?: boolean; cloneSpecialObjects?: boolean }
): T {
  const { cloneFunctions = false, cloneSpecialObjects = false } = options || {};
  const visited = new WeakMap<any, any>();

  const cloneHelper = (value: any): any => {
    if (visited.has(value)) return visited.get(value);

    if (value === null || typeof value !== 'object') {
      if (typeof value === 'function' && cloneFunctions) {
        return value.bind({});
      }
      return value;
    }

    if (value instanceof Date) return new Date(value.getTime());
    if (value instanceof RegExp) return new RegExp(value);

    if (value instanceof Map) {
      const result = new Map();
      visited.set(value, result);
      value.forEach((val, key) => {
        result.set(cloneHelper(key), cloneHelper(val));
      });
      return result;
    }

    if (value instanceof Set) {
      const result = new Set();
      visited.set(value, result);
      value.forEach(val => result.add(cloneHelper(val)));
      return result;
    }

    if (cloneSpecialObjects && typeof Node !== 'undefined' && value instanceof Node) {
      return value.cloneNode(true);
    }

    const result: any = Array.isArray(value) ? [] : {};
    visited.set(value, result);

    const keys = Reflect.ownKeys(value);
    for (const key of keys) {
      result[key] = cloneHelper(value[key]);
    }

    return result;
  };

  return cloneHelper(obj) as T;
}
