import { MoveAction } from '@/types';
import { Result } from '@/utils/Result';
import { isArray, isEmpty } from './is-kit';
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

type Recordable = Record<string, any>;
type Fn<T> = (item: T, index: number, array: T[]) => boolean;
/**
 * 查找数组对象的某个下标
 * @param ary 查找的数组
 * @param fn 判断的方法，返回 true 表示找到
 * @returns 找到的索引，如果未找到返回 -1
 * @example
 * const users: User[] = [
 * { id: 1, name: "Alice" },
 * { id: 2, name: "Bob" },
 * { id: 3, name: "Charlie" }
 * ];
 *
 * const index = findIndex(users, user => user.name === "Bob");
 * console.log(index); // 输出 1
 */
export const findIndex = <T = Recordable>(ary: T[], fn: Fn<T>): number => {
  if (typeof ary.findIndex === 'function') {
    return ary.findIndex(fn);
  }

  let index = -1;
  ary.some((item, i, array) => {
    if (fn(item, i, array)) {
      index = i;
      return true; // some 会停止迭代
    }
    return false;
  });
  return index;
};

/**
 * 移动数组元素
 * @param list - 数组
 * @param idx - 需要移动的元素索引
 * @param action - 移动类型，默认置顶up
 */
export function moveElement<T>(list: T[], idx: number, action: MoveAction = 'up'): Result<T[]> {
  if (!isArray(list)) {
    return Result.fail('参数不是数组', []);
  }

  if (isEmpty(list)) {
    return Result.fail('数组为空', []);
  }

  if (idx < 0 || idx >= list.length) {
    return Result.fail('索引超出范围', [...list]);
  }

  const newList = [...list];
  // 需要移动的元素
  const item = newList[idx];

  switch (action) {
    case 'up':
      if (idx === 0) return Result.fail('已经是第一个元素', newList);
      [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
      break;

    case 'down':
      if (idx === list.length - 1) return Result.fail('已经是最后一个元素', newList);
      [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
      break;

    case 'top':
      if (idx === 0) return Result.fail('已经是第一个元素', newList);
      newList.splice(idx, 1);
      newList.unshift(item);
      break;

    case 'bottom':
      if (idx === list.length - 1) return Result.fail('已经是最后一个元素', newList);
      newList.splice(idx, 1);
      newList.push(item);
      break;

    default:
      return Result.fail('无效的操作', newList);
  }

  return Result.ok(newList);
}
