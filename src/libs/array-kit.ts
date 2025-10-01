/**
 * 从数组中移除指定的元素，返回一个新的数组。
 * @param arr - 需要操作的数组
 * @param target - 需要删除的目标元素
 * @param key - 可选属性名，如果传入则根据该属性匹配删除
 * @returns 新数组
 */
export function arrayDelEl<T>(arr: T[], target: T, key: keyof T | null = null): T[] {
  const isPrimitive = (value: any) => value !== Object(value);

  if (isPrimitive(target)) {
    return arr.filter(item => item !== target);
  } else {
    if (key) {
      return arr.filter(item => item[key] !== target[key]);
    } else {
      return arr.filter(item => JSON.stringify(item) !== JSON.stringify(target));
    }
  }
}

/**
 * 补充数组到指定数量
 * @param originArr - 原数组
 * @param num - 补充到指定长度
 * @param obj - 补充的元素
 * @returns 新数组
 */
export function arrayFill<T>(originArr: T[], num: number, obj: T): T[] {
  if (!Array.isArray(originArr)) throw new Error('originArr 必须是数组');
  if (!Number.isInteger(num) || num < 0) throw new Error('num 必须是非负整数');

  if (originArr.length >= num) return [...originArr];
  const emptyArr = new Array(num - originArr.length).fill(obj);
  return originArr.concat(emptyArr);
}

/**
 * 去重数组
 * @param arr - 数组
 * @returns 去重后的数组
 */
export function arrayUnique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * 分页函数
 * @param arr - 数组
 * @param page - 当前页码（>=1）
 * @param size - 每页条数（>=1）
 * @returns 当前页数据
 */
export function arrayPaginate<T>(arr: T[], page: number, size: number): T[] {
  if (!Array.isArray(arr) || page < 1 || size < 1) return [];

  const totalPages = Math.ceil(arr.length / size);
  if (page > totalPages) return [];

  const startIdx = (page - 1) * size;
  const endIdx = startIdx + size;
  return arr.slice(startIdx, endIdx);
}

/**
 * 把数组对象进行分组，每 groupSize 个一组，返回对象
 * @param array - 需要分组的数组
 * @param groupSize - 每组的大小，默认为 10
 * @returns 返回分组后的对象，键为组号，值为数组
 */
export function arraySplitToGroups<T>(array: T[], groupSize: number = 10): Record<number, T[]> {
  if (!Array.isArray(array)) {
    throw new Error('参数必须是数组');
  }

  if (groupSize < 1 || !Number.isInteger(groupSize)) {
    throw new Error('groupSize 必须是大于 0 的整数');
  }

  const result: Record<number, T[]> = {};

  for (let i = 0; i < array.length; i++) {
    const groupIndex = Math.floor(i / groupSize) + 1; // 计算组号
    if (!result[groupIndex]) {
      result[groupIndex] = []; // 初始化组
    }
    result[groupIndex].push(array[i]);
  }

  return result;
}
