/**
 * 合并两个对象，后一个对象的属性优先。递归合并嵌套对象，数组会直接复制。
 * 如果属性不是对象，则源对象的值会覆盖目标对象的值。
 *
 * @param target - 目标对象，合并结果会存储在该对象中，且该对象会被修改。
 * @param source - 源对象或数组，源对象的属性会覆盖目标对象中的同名属性。
 * @param mergeType - 合并类型：'hard' 硬合并(包含2者所有属性)、'soft' 软合并(只包含 target 对象的属性)。默认 'hard'
 * @returns 合并后的目标对象
 */
export function objMerge<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S,
  mergeType: 'hard' | 'soft' = 'hard'
): T & S {
  if (typeof target !== 'object' || target === null) {
    target = {} as T;
  }
  if (Array.isArray(source)) {
    // 如果 source 是数组，直接返回副本
    return source.slice() as any;
  }

  Object.keys(source).forEach(property => {
    const sourceProperty = source[property];

    // 软合并模式下，若 target 不包含此属性，则跳过
    if (mergeType === 'soft' && !target.hasOwnProperty(property)) {
      return;
    }

    if (
      typeof sourceProperty === 'object' &&
      sourceProperty !== null &&
      !Array.isArray(sourceProperty)
    ) {
      (target as Record<string, any>)[property] = objMerge(
        (target as Record<string, any>)[property] || {},
        sourceProperty,
        mergeType
      );
    } else {
      (target as T & S)[property as keyof (T & S)] = sourceProperty as any;
    }
  });

  return target as T & S;
}

/**
 * 过滤对象中不需要的 key，返回过滤后的新对象
 * @param obj - 源对象
 * @param keys - 需要过滤的 key 数组
 * @returns 新对象
 */
export function filterProperties<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K))
  ) as Omit<T, K>;
}

/**
 * 过滤对象中的空值 (null 或 undefined)
 * @param obj - 源对象
 * @returns 新对象，过滤掉值为 null 或 undefined 的属性
 */
export function filterNull<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj)
    .filter(([_, value]) => value !== null && value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key as keyof T] = value;
      return acc;
    }, {} as Partial<T>);
}
