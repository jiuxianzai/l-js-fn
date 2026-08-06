import { MoveAction, Primitive } from "@/types";
import { Result } from "@/utils/Result";
import { isArray, isEmpty, isEqual } from "./is-kit";
/**
 * 从数组中移除指定的元素，返回一个新的数组。
 * @param arr - 需要操作的数组
 * @param target - 需要删除的目标元素
 * @param key - 可选属性名，如果传入则根据该属性匹配删除
 * @returns 新数组
 */
export function arrayDelEl<T>(
  arr: T[],
  target: T,
  key: keyof T | null = null
): T[] {
  const isPrimitive = (value: any) => value !== Object(value);

  if (isPrimitive(target)) {
    return arr.filter((item) => item !== target);
  } else {
		if (key) {
			return arr.filter((item) => item[key] !== target[key]);
		} else {
			return arr.filter((item) => !isEqual(item, target));
		}
  }
}

/**
 * 根据索引删除数组元素
 * @param arr - 原数组
 * @param index - 要删除元素的索引
 * @returns 新数组，如果索引不合法返回原数组
 * @example
 * arrayDelToIndex([1, 2, 3], 1) // [1, 3]
 */
export function arrayDelToIndex<T>(arr: T[], index: number): T[] {
  if (!isArray(arr)) return arr;
  if (typeof index !== "number" || index < 0 || index >= arr.length) return arr;
  return arr.slice(0, index).concat(arr.slice(index + 1));
}

/**
 * 根据基本类型元素删除数组元素
 * @param arr - 原数组
 * @param el - 要删除的元素
 * @returns 新数组，如果数组中不存在该元素返回原数组
 * @example
 * arrayDelToEl([1, 2, 3, 2], 2) // [1, 3]
 */
export function arrayDelToEl<T extends Primitive>(arr: T[], el: T): T[] {
  if (!isArray(arr)) return arr;
  if (!arr.includes(el)) return arr;
  return arr.filter((item) => item !== el);
}

/**
 * 根据对象数组的键值对删除元素
 * @param arr - 原数组
 * @param key - 对象的键
 * @param value - 要匹配删除的值（类型为 key 对应的字段类型）
 * @returns 新数组，如果没有匹配项返回原数组
 * @example
 * const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 * arrayDelToKey(arr, 'id', 2) // [{ id: 1, name: 'a' }]
 */
export function arrayDelToKey<T extends Record<string, any>>(
  arr: T[],
  key: keyof T,
  value: T[keyof T]
): T[] {
  if (!isArray(arr)) return arr;
  const filtered = arr.filter((item) => item[key] !== value);
  return filtered.length === arr.length ? arr : filtered;
}

/**
 * 补充数组到指定数量
 * @param originArr - 原数组
 * @param num - 补充到指定长度
 * @param obj - 补充的元素
 * @returns 新数组
 */
export function arrayFill<T>(originArr: T[], num: number, obj: T): T[] {
  if (!isArray(originArr)) throw new Error("originArr 必须是数组");
  if (!Number.isInteger(num) || num < 0) throw new Error("num 必须是非负整数");

  if (originArr.length >= num) return [...originArr];
  const emptyArr = new Array(num - originArr.length).fill(obj);
  return originArr.concat(emptyArr);
}

/**
 * 去重数组
 * @param arr - 数组
 * @returns 去重后的数组
 * @deprecated 请使用 `uniq` 替代
 */
export function arrayUnique<T>(arr: T[]): T[] {
	return uniq(arr);
}

/**
 * 分页函数
 * @param arr - 数组
 * @param page - 当前页码（>=1）
 * @param size - 每页条数（>=1）
 * @returns 当前页数据
 */
export function arrayPaginate<T>(arr: T[], page: number, size: number): T[] {
  if (!isArray(arr) || page < 1 || size < 1) return [];

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
export function arraySplitToGroups<T>(
  array: T[],
  groupSize: number = 10
): Record<number, T[]> {
  if (!isArray(array)) {
    throw new Error("参数必须是数组");
  }

  if (groupSize < 1 || !Number.isInteger(groupSize)) {
    throw new Error("groupSize 必须是大于 0 的整数");
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
export const findIndex = <T = Recordable>(arr: T[], fn: Fn<T>): number => {
	return arr.findIndex(fn);
};

/**
 * 移动数组元素
 * @param list - 数组
 * @param idx - 需要移动的元素索引
 * @param action - 移动类型，默认置顶up
 */
export function moveElement<T>(
  list: T[],
  idx: number,
  action: MoveAction = "up"
): Result<T[]> {
  if (!isArray(list)) {
    return Result.fail("参数不是数组", []);
  }

  if (isEmpty(list)) {
    return Result.fail("数组为空", []);
  }

  if (idx < 0 || idx >= list.length) {
    return Result.fail("索引超出范围", [...list]);
  }

  const newList = [...list];
  // 需要移动的元素
  const item = newList[idx];

  switch (action) {
    case "up":
      if (idx === 0) return Result.fail("已经是第一个元素", newList);
      [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
      break;

    case "down":
      if (idx === list.length - 1)
        return Result.fail("已经是最后一个元素", newList);
      [newList[idx + 1], newList[idx]] = [newList[idx], newList[idx + 1]];
      break;

    case "top":
      if (idx === 0) return Result.fail("已经是第一个元素", newList);
      newList.splice(idx, 1);
      newList.unshift(item);
      break;

    case "bottom":
      if (idx === list.length - 1)
        return Result.fail("已经是最后一个元素", newList);
      newList.splice(idx, 1);
      newList.push(item);
      break;

    default:
      return Result.fail("无效的操作", newList);
  }

  return Result.ok(newList);
}

/**
 * 按字段对数组对象进行分组
 * @param array - 需要分组的数组
 * @param key - 分组依据的键名（支持嵌套路径，如 'user.id'）
 * @returns 分组后的对象，键为字段值，值为对应的数组
 * @example
 * const users = [
 *   { name: 'Alice', age: 20, city: 'Beijing' },
 *   { name: 'Bob', age: 25, city: 'Shanghai' },
 *   { name: 'Charlie', age: 20, city: 'Beijing' }
 * ]
 * groupBy(users, 'age') // { 20: [{...}, {...}], 25: [{...}] }
 * groupBy(users, 'city') // { Beijing: [{...}, {...}], Shanghai: [{...}] }
 */
export function groupBy<T extends Record<string, any>>(
  array: T[],
  key: string
): Record<string, T[]> {
  if (!isArray(array)) {
    throw new Error("groupBy: 参数必须是数组");
  }

  const result: Record<string, T[]> = {};

  for (const item of array) {
    // 支持嵌套路径，如 'user.id'
    const groupKey = (key.split('.').reduce((obj: unknown, k) => (obj as Record<string, unknown>)?.[k], item as unknown) ?? '__undefined__') as string;

    if (!result[groupKey]) {
      result[groupKey] = [];
    }

    result[groupKey].push(item);
  }

  return result;
}

/**
 * 随机获取数组中的一个元素
 * @param array - 数组
 * @returns 随机的一个元素，数组为空时返回 undefined
 * @example
 * const colors = ['red', 'green', 'blue', 'yellow']
 * sample(colors) // 'blue' (随机)
 */
export function sample<T>(array: T[]): T | undefined {
  if (!isArray(array) || array.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

/**
 * 随机获取数组中的 n 个元素（不重复）
 * @param array - 数组
 * @param n - 要获取的元素数量，默认为 1
 * @returns 随机选取的元素数组，如果 n 大于数组长度则返回整个数组的乱序结果
 * @example
 * const numbers = [1, 2, 3, 4, 5]
 * sampleSize(numbers, 2) // [3, 1] (随机，不重复)
 * sampleSize(numbers, 10) // [2, 5, 1, 4, 3] (返回全部乱序)
 */
export function sampleSize<T>(array: T[], n: number = 1): T[] {
	if (!isArray(array) || array.length === 0) {
		return [];
	}

	if (n >= array.length) {
		return shuffle(array);
	}

	return shuffle([...array]).slice(0, n);
}

/**
 * 数组扁平化，将多层嵌套数组展开，支持指定展开深度
 * @param arr - 需要扁平化的数组
 * @param depth - 展开深度，默认为 Infinity（完全展开）
 * @returns 扁平化后的新数组
 * @example
 * flatten([1, [2, [3, 4]], 5]) // [1, 2, 3, 4, 5]
 * flatten([1, [2, [3, 4]], 5], 1) // [1, 2, [3, 4], 5]
 */
export function flatten<T>(arr: readonly unknown[], depth: number = Infinity): T[] {
	if (!isArray(arr)) return [];
	return arr.flat(depth) as T[];
}

/**
 * 生成一个数字范围数组
 * @param start - 起始值（包含）
 * @param end - 结束值（包含）
 * @param step - 步长，默认为 1
 * @returns 数字数组
 * @example
 * range(0, 5) // [0, 1, 2, 3, 4, 5]
 * range(5, 0, -1) // [5, 4, 3, 2, 1, 0]
 * range(0, 10, 2) // [0, 2, 4, 6, 8, 10]
 */
export function range(start: number, end: number, step: number = 1): number[] {
	const result: number[] = [];
	if (step === 0) return result;

	const ascending = start <= end;
	const actualStep = Math.abs(step);

	if (ascending) {
		for (let i = start; i <= end; i += actualStep) {
			result.push(i);
		}
	} else {
		for (let i = start; i >= end; i -= actualStep) {
			result.push(i);
		}
	}

	return result;
}

/**
 * 使用 Fisher-Yates 洗牌算法打乱数组
 * @param arr - 需要打乱的数组
 * @returns 打乱后的新数组
 * @example
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]（随机）
 */
export function shuffle<T>(arr: T[]): T[] {
	if (!isArray(arr)) return [];
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/**
 * 根据对象数组中指定字段的值进行去重（保留第一个出现的元素）
 * @param arr - 对象数组
 * @param key - 用于比较的键名
 * @returns 去重后的新数组
 * @example
 * const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }]
 * uniqueBy(arr, 'id') // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 */
export function uniqueBy<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
	if (!isArray(arr)) return [];
	const seen = new Set();
	return arr.filter((item) => {
		const val = item[key];
		if (seen.has(val)) return false;
		seen.add(val);
		return true;
	});
}

/**
 * 过滤数组中的 falsy 值（null, undefined, false, 0, NaN, ''）
 * @param arr - 需要处理的数组
 * @returns 去除 falsy 值后的新数组
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]) // [1, 2, 3]
 */
export function compact<T>(arr: T[]): T[] {
	if (!isArray(arr)) return [];
	return arr.filter(Boolean);
}

/**
 * 计算数组中所有元素的总和
 * @param arr - 数字数组
 * @returns 总和，空数组返回 0
 * @example
 * sum([1, 2, 3, 4, 5]) // 15
 */
export function sum(arr: number[]): number {
	if (!isArray(arr)) return 0;
	return arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
}

/**
 * 获取数组的最后一个元素
 * @param arr - 数组
 * @returns 最后一个元素，空数组返回 undefined
 * @example
 * last([1, 2, 3]) // 3
 */
export function last<T>(arr: T[]): T | undefined {
	if (!isArray(arr) || arr.length === 0) return undefined;
	return arr[arr.length - 1];
}

/**
 * 递归提取对象/数组中指定字段的值，返回扁平数组（过滤掉 null 和 undefined）
 * @param arr - 对象数组
 * @param key - 要提取的字段名
 * @returns 字段值组成的数组
 * @example
 * arrayPluck([{ name: 'zz' }, { name: 'yy' }], 'name') // ['zz', 'yy']
 * arrayPluck([{ name: 'zz', children: [{ name: 'yy' }, { name: null }] }], 'name') // ['zz', 'yy']
 */
export function arrayPluck<T extends Record<string, any>>(arr: T[], key: keyof T): T[keyof T][] {
	if (!isArray(arr)) return [];
	const result: T[keyof T][] = [];
	const seen = new WeakSet<object>();

	const collect = (obj: unknown): void => {
		if (obj === null || obj === undefined) return;
		if (isArray(obj)) {
			for (const item of obj) {
				collect(item);
			}
			return;
		}
		if (typeof obj === 'object') {
			if (seen.has(obj as object)) return;
			seen.add(obj as object);

			const record = obj as Record<string, any>;
			if (key in record) {
				const val = record[key as string];
				if (val !== null && val !== undefined) {
					result.push(val);
				}
			}
			for (const v of Object.values(record)) {
				collect(v);
			}
		}
	};

	for (const item of arr) {
		collect(item);
	}
	return result;
}

/**
 * 根据指定字段对对象数组排序
 * @param arr - 对象数组
 * @param key - 排序字段
 * @param order - 排序方向，默认 'asc'
 * @returns 排序后的新数组
 * @example
 * sortBy([{ id: 2 }, { id: 1 }], 'id')          // [{ id: 1 }, { id: 2 }]
 * sortBy([{ age: 20 }, { age: 30 }], 'age', 'desc') // [{ age: 30 }, { age: 20 }]
 */
export function sortBy<T extends Record<string, any>>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
	if (!isArray(arr)) return [];
	const copy = [...arr];
	const factor = order === 'desc' ? -1 : 1;
	return copy.sort((a, b) => {
		const va = a[key];
		const vb = b[key];
		if (typeof va === 'string' && typeof vb === 'string') return factor * va.localeCompare(vb);
		return factor * (Number(va) - Number(vb));
	});
}

/**
 * 对基础类型数组去重（使用 Set 实现）
 * @param arr - 基础类型数组
 * @returns 去重后的新数组
 * @example
 * uniq([1, 2, 2, 3])        // [1, 2, 3]
 * uniq(['a', 'b', 'a'])      // ['a', 'b']
 */
export function uniq<T>(arr: T[]): T[] {
	if (!isArray(arr)) return [];
	return [...new Set(arr)];
}

/**
 * 计算对象数组中指定字段数值的总和
 * @param arr - 对象数组
 * @param key - 需要求和的数字字段名
 * @returns 总和，空数组返回 0
 * @example
 * const items = [{ name: 'a', price: 10 }, { name: 'b', price: 20 }]
 * sumBy(items, 'price') // 30
 */
export function sumBy<T extends Record<string, any>>(arr: T[], key: keyof T): number {
	if (!isArray(arr) || arr.length === 0) return 0;
	let total = 0;
	for (let i = 0; i < arr.length; i++) {
		total += Number(arr[i][key]) || 0;
	}
	return total;
}
