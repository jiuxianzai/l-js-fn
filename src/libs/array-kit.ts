import { MoveAction } from "@/types";
import { isArray, isEqual } from "./is-kit";

/**
 * 从数组中移除指定的元素，返回一个新的数组。
 * @param arr - 需要操作的数组
 * @param target - 需要删除的目标元素
 * @param key - 可选属性名，如果传入则根据该属性匹配删除
 * @returns 新数组，非数组或没有匹配项时返回原数组
 * @example
 * arrayRemove([1, 2, 3, 2], 2) // [1, 3]
 * arrayRemove([{ id: 1 }, { id: 2 }], { id: 2 }) // [{ id: 1 }]（深比较）
 * arrayRemove([{ id: 1 }, { id: 2 }], { id: 2 }, 'id') // [{ id: 1 }]
 */
export function arrayRemove<T>(arr: T[], target: T, key?: keyof T): T[] {
	if (!isArray(arr)) return arr;
	if (key) {
		return arr.filter((item) => item[key] !== target[key]);
	}
	if (typeof target === 'object' && target !== null) {
		return arr.filter((item) => !isEqual(item, target));
	}
	return arr.filter((item) => item !== target);
}

/**
 * 根据索引删除数组元素
 * @param arr - 原数组
 * @param index - 要删除元素的索引
 * @returns 新数组，如果索引不合法返回原数组
 * @example
 * arrayRemoveAt([1, 2, 3], 1) // [1, 3]
 */
export function arrayRemoveAt<T>(arr: T[], index: number): T[] {
	if (!isArray(arr)) return arr;
	if (!Number.isInteger(index) || index < 0 || index >= arr.length) return arr;
	return arr.slice(0, index).concat(arr.slice(index + 1));
}

/**
 * 根据条件函数删除数组元素
 * @param arr - 原数组
 * @param fn - 判断函数，返回 true 表示删除该元素
 * @returns 新数组，非数组返回原数组
 * @example
 * arrayRemoveBy([1, 2, 3, 4], (n) => n % 2 === 0) // [1, 3]
 * arrayRemoveBy([{ id: 1 }, { id: 2 }], (item) => item.id === 2) // [{ id: 1 }]
 */
export function arrayRemoveBy<T>(arr: T[], fn: (item: T, index: number, array: T[]) => boolean): T[] {
	if (!isArray(arr)) return arr;
	return arr.filter((item, index, array) => !fn(item, index, array));
}

/**
 * 补充数组到指定数量
 * @param originArr - 原数组
 * @param num - 补充到指定长度
 * @param obj - 补充的元素
 * @returns 新数组，非数组或 num 无效时返回原数组的拷贝
 */
export function arrayFill<T>(originArr: T[], num: number, obj: T): T[] {
	if (!isArray(originArr)) return [];
	if (!Number.isInteger(num) || num < 0) return [...originArr];

	if (originArr.length >= num) return [...originArr];
	const emptyArr = new Array(num - originArr.length).fill(obj);
	return originArr.concat(emptyArr);
}

/**
 * 去重数组
 * @param arr - 数组
 * @returns 去重后的新数组
 * @example
 * arrayUnique([1, 2, 2, 3]) // [1, 2, 3]
 */
export function arrayUnique<T>(arr: T[]): T[] {
	if (!isArray(arr)) return [];
	return [...new Set(arr)];
}

/**
 * 分页函数
 * @param arr - 数组
 * @param page - 当前页码（>=1）
 * @param size - 每页条数（>=1）
 * @returns 当前页数据，参数不合法时返回空数组
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
 * @returns 返回分组后的对象，键为组号，值为数组；参数不合法时返回空对象
 */
export function arraySplitToGroups<T>(array: T[], groupSize: number = 10): Record<number, T[]> {
	if (!isArray(array) || array.length === 0) return {};
	if (groupSize < 1 || !Number.isInteger(groupSize)) return {};

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

/**
 * 移动数组元素
 * @param arr - 数组
 * @param index - 需要移动的元素索引
 * @param action - 移动类型：up 上移一位 | down 下移一位 | top 置顶 | bottom 置底，默认 'up'
 * @returns 移动后的新数组，参数不合法时返回原数组的拷贝
 * @example
 * arrayMove([1, 2, 3], 1, 'up') // [2, 1, 3]
 * arrayMove([1, 2, 3], 2, 'top') // [3, 1, 2]
 */
export function arrayMove<T>(arr: T[], index: number, action: MoveAction = 'up'): T[] {
	if (!isArray(arr) || arr.length === 0) return isArray(arr) ? [...arr] : [];
	if (index < 0 || index >= arr.length) return [...arr];

	const newList = [...arr];
	const item = newList[index];

	switch (action) {
		case 'up':
			if (index === 0) return newList;
			[newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
			break;
		case 'down':
			if (index === arr.length - 1) return newList;
			[newList[index + 1], newList[index]] = [newList[index], newList[index + 1]];
			break;
		case 'top':
			if (index === 0) return newList;
			newList.splice(index, 1);
			newList.unshift(item);
			break;
		case 'bottom':
			if (index === arr.length - 1) return newList;
			newList.splice(index, 1);
			newList.push(item);
			break;
		default:
			return newList;
	}

	return newList;
}

/**
 * 按字段对数组对象进行分组
 * @param array - 需要分组的数组
 * @param key - 分组依据的键名（支持嵌套路径，如 'user.id'）
 * @returns 分组后的对象，键为字段值，值为对应的数组；参数不合法时返回空对象
 * @example
 * const users = [
 *   { name: 'Alice', age: 20, city: 'Beijing' },
 *   { name: 'Bob', age: 25, city: 'Shanghai' },
 *   { name: 'Charlie', age: 20, city: 'Beijing' }
 * ]
 * arrayGroupBy(users, 'age') // { 20: [{...}, {...}], 25: [{...}] }
 * arrayGroupBy(users, 'city') // { Beijing: [{...}, {...}], Shanghai: [{...}] }
 */
export function arrayGroupBy<T extends Record<string, any>>(array: T[], key: string): Record<string, T[]> {
	if (!isArray(array) || array.length === 0) return {};

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
 * arraySample(colors) // 'blue' (随机)
 */
export function arraySample<T>(array: T[]): T | undefined {
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
 * arraySampleSize(numbers, 2) // [3, 1] (随机，不重复)
 * arraySampleSize(numbers, 10) // [2, 5, 1, 4, 3] (返回全部乱序)
 */
export function arraySampleSize<T>(array: T[], n: number = 1): T[] {
	if (!isArray(array) || array.length === 0) {
		return [];
	}

	if (n >= array.length) {
		return arrayShuffle(array);
	}

	return arrayShuffle([...array]).slice(0, n);
}

/**
 * 数组扁平化，将多层嵌套数组展开，支持指定展开深度
 * @param arr - 需要扁平化的数组
 * @param depth - 展开深度，默认为 Infinity（完全展开）
 * @returns 扁平化后的新数组
 * @example
 * arrayFlatten([1, [2, [3, 4]], 5]) // [1, 2, 3, 4, 5]
 * arrayFlatten([1, [2, [3, 4]], 5], 1) // [1, 2, [3, 4], 5]
 */
export function arrayFlatten<T>(arr: readonly unknown[], depth: number = Infinity): T[] {
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
 * arrayRange(0, 5) // [0, 1, 2, 3, 4, 5]
 * arrayRange(5, 0, -1) // [5, 4, 3, 2, 1, 0]
 * arrayRange(0, 10, 2) // [0, 2, 4, 6, 8, 10]
 */
export function arrayRange(start: number, end: number, step: number = 1): number[] {
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
 * arrayShuffle([1, 2, 3, 4, 5]) // [3, 1, 5, 2, 4]（随机）
 */
export function arrayShuffle<T>(arr: T[]): T[] {
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
 * arrayUniqueBy(arr, 'id') // [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
 */
export function arrayUniqueBy<T extends Record<string, any>>(arr: T[], key: keyof T): T[] {
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
 * arrayCompact([0, 1, false, 2, '', 3, null, undefined, NaN]) // [1, 2, 3]
 */
export function arrayCompact<T>(arr: T[]): T[] {
	if (!isArray(arr)) return [];
	return arr.filter(Boolean);
}

/**
 * 计算数组中所有元素的总和
 * @param arr - 数字数组
 * @returns 总和，空数组返回 0
 * @example
 * arraySum([1, 2, 3, 4, 5]) // 15
 */
export function arraySum(arr: number[]): number {
	if (!isArray(arr)) return 0;
	return arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
}

/**
 * 获取数组的最后一个元素
 * @param arr - 数组
 * @returns 最后一个元素，空数组返回 undefined
 * @example
 * arrayLast([1, 2, 3]) // 3
 */
export function arrayLast<T>(arr: T[]): T | undefined {
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
 * arraySortBy([{ id: 2 }, { id: 1 }], 'id')          // [{ id: 1 }, { id: 2 }]
 * arraySortBy([{ age: 20 }, { age: 30 }], 'age', 'desc') // [{ age: 30 }, { age: 20 }]
 */
export function arraySortBy<T extends Record<string, any>>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
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
 * 计算对象数组中指定字段数值的总和
 * @param arr - 对象数组
 * @param key - 需要求和的数字字段名
 * @returns 总和，空数组返回 0
 * @example
 * const items = [{ name: 'a', price: 10 }, { name: 'b', price: 20 }]
 * arraySumBy(items, 'price') // 30
 */
export function arraySumBy<T extends Record<string, any>>(arr: T[], key: keyof T): number {
	if (!isArray(arr) || arr.length === 0) return 0;
	let total = 0;
	for (let i = 0; i < arr.length; i++) {
		total += Number(arr[i][key]) || 0;
	}
	return total;
}

/**
 * 过滤掉数组中的空值（null、undefined、空字符串 ''）后，按顺序拼接为字符串
 * @param arr - 需要处理的数组
 * @param separator - 分隔符，默认为空字符串 ''，与 join 的语义一致
 * @returns 拼接后的字符串，非数组或空数组返回 ''
 * @example
 * arrayToString(['a', null, 'b', '', 'c']) // 'abc'
 * arrayToString([1, 0, false, null, '', 2]) // '10false2'
 * arrayToString(['a', 'b', 'c'], '&') // 'a&b&c'
 */
export function arrayToString<T>(arr: T[], separator = ''): string {
	if (!isArray(arr)) return '';
	return arr
		.filter((v) => v !== undefined && v !== null && v !== '')
		.join(separator);
}
