/**
 * array-kit 单元测试
 * 测试所有数组操作相关的方法
 */

import {
	arrayDelEl,
	arrayDelToIndex,
	arrayDelToEl,
	arrayDelToKey,
	arrayFill,
	arrayUnique,
	arrayPaginate,
	arraySplitToGroups,
	findIndex,
	moveElement,
	groupBy,
	sample,
	sampleSize,
	flatten,
	range,
	shuffle,
	uniqueBy,
	compact,
	sum,
	last,
	arrayPluck,
	sortBy,
	uniq,
	sumBy,
} from '@/libs/array-kit';

describe('array-kit - 数组操作工具', () => {
	// ==================== arrayDelEl 测试 ====================
	describe('arrayDelEl - 删除数组元素', () => {
		it('应该删除指定的基本类型元素', () => {
			const arr = [1, 2, 3, 2, 4];
			const result = arrayDelEl(arr, 2);
			expect(result).toEqual([1, 3, 4]);
		});

		it('应该删除所有匹配的元素', () => {
			const arr = [1, 2, 2, 2, 3];
			const result = arrayDelEl(arr, 2);
			expect(result).toEqual([1, 3]);
		});

		it('应该删除对象元素（通过 key 匹配）', () => {
			const arr = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 3, name: 'Charlie' },
			];
			const result = arrayDelEl(arr, { id: 2, name: 'Bob' }, 'id');
			expect(result).toEqual([
				{ id: 1, name: 'Alice' },
				{ id: 3, name: 'Charlie' },
			]);
		});

		it('应该删除所有匹配 key 的对象', () => {
			const arr = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 2, name: 'Charlie' },
			];
			const result = arrayDelEl(arr, { id: 2, name: '' }, 'id');
			expect(result).toEqual([{ id: 1, name: 'Alice' }]);
		});

		it('当没有 key 时应该通过 JSON 序列化匹配对象', () => {
			const arr = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 1, name: 'Alice' },
			];
			const result = arrayDelEl(arr, { id: 1, name: 'Alice' });
			expect(result).toEqual([{ id: 2, name: 'Bob' }]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [1, 2, 3];
			const result = arrayDelEl(arr, 2);
			expect(arr).toEqual([1, 2, 3]); // 原数组不变
			expect(result).not.toBe(arr);
		});

		it('应该处理元素不存在的情况', () => {
			const arr = [1, 2, 3];
			const result = arrayDelEl(arr, 4);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理空数组', () => {
			const result = arrayDelEl([], 1);
			expect(result).toEqual([]);
		});
	});

	// ==================== arrayDelToIndex 测试 ====================
	describe('arrayDelToIndex - 根据索引删除元素', () => {
		it('应该删除指定索引的元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arrayDelToIndex(arr, 2);
			expect(result).toEqual([1, 2, 4, 5]);
		});

		it('应该删除第一个元素（索引0）', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToIndex(arr, 0);
			expect(result).toEqual([2, 3]);
		});

		it('应该删除最后一个元素', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToIndex(arr, 2);
			expect(result).toEqual([1, 2]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToIndex(arr, 1);
			expect(arr).toEqual([1, 2, 3]);
			expect(result).not.toBe(arr);
		});

		it('应该处理无效索引（负数）', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToIndex(arr, -1);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理超出范围的索引', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToIndex(arr, 10);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理非数组输入', () => {
			const result = arrayDelToIndex('not array' as any, 0);
			expect(result).toEqual('not array');
		});
	});

	// ==================== arrayDelToEl 测试 ====================
	describe('arrayDelToEl - 删除基本类型元素', () => {
		it('应该删除指定元素的所有出现', () => {
			const arr = [1, 2, 3, 2, 4, 2];
			const result = arrayDelToEl(arr, 2);
			expect(result).toEqual([1, 3, 4]);
		});

		it('应该删除字符串元素', () => {
			const arr = ['a', 'b', 'c', 'b', 'd'];
			const result = arrayDelToEl(arr, 'b');
			expect(result).toEqual(['a', 'c', 'd']);
		});

		it('应该删除布尔值元素', () => {
			const arr = [true, false, true, true];
			const result = arrayDelToEl(arr, true);
			expect(result).toEqual([false]);
		});

		it('应该删除 null 元素', () => {
			const arr = [1, null, 2, null, 3];
			const result = arrayDelToEl(arr, null);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToEl(arr, 2);
			expect(arr).toEqual([1, 2, 3]);
		});

		it('应该处理元素不存在的情况', () => {
			const arr = [1, 2, 3];
			const result = arrayDelToEl(arr, 4);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理空数组', () => {
			const result = arrayDelToEl([], 1);
			expect(result).toEqual([]);
		});
	});

	// ==================== arrayDelToKey 测试 ====================
	describe('arrayDelToKey - 根据对象键值删除元素', () => {
		const users = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
			{ id: 2, name: 'David' },
		];

		it('应该删除匹配指定键值的所有元素', () => {
			const result = arrayDelToKey(users, 'id', 2);
			expect(result).toEqual([
				{ id: 1, name: 'Alice' },
				{ id: 3, name: 'Charlie' },
			]);
		});

		it('应该根据 name 键删除元素', () => {
			const result = arrayDelToKey(users, 'name', 'Alice');
			expect(result).toEqual([
				{ id: 2, name: 'Bob' },
				{ id: 3, name: 'Charlie' },
				{ id: 2, name: 'David' },
			]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [{ id: 1 }, { id: 2 }];
			const result = arrayDelToKey(arr, 'id', 1);
			expect(arr).toEqual([{ id: 1 }, { id: 2 }]);
		});

		it('应该处理键值不存在的情况', () => {
			const result = arrayDelToKey(users, 'id', 99);
			expect(result).toEqual(users);
		});

		it('应该处理空数组', () => {
			const result = arrayDelToKey<{ id: number }>([], 'id', 1);
			expect(result).toEqual([]);
		});
	});

	// ==================== arrayFill 测试 ====================
	describe('arrayFill - 补充数组到指定数量', () => {
		it('应该补充数组到指定长度', () => {
			const arr = [1, 2];
			const result = arrayFill(arr, 5, 0);
			expect(result).toEqual([1, 2, 0, 0, 0]);
		});

		it('应该使用指定的填充元素', () => {
			const arr = [1, 2];
			const result = arrayFill(arr, 5, 0);
			expect(result).toEqual([1, 2, 0, 0, 0]);
		});

		it('应该使用对象作为填充元素', () => {
			const arr = [1];
			const result = arrayFill(arr, 3, null);
			expect(result).toEqual([1, null, null]);
		});

		it('当数组长度已满足时应该返回原数组的副本', () => {
			const arr = [1, 2, 3];
			const result = arrayFill(arr, 3, 0);
			expect(result).toEqual([1, 2, 3]);
			expect(result).not.toBe(arr);
		});

		it('当数组长度超过目标长度时应该返回副本', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arrayFill(arr, 3, 0);
			expect(result).toEqual([1, 2, 3, 4, 5]);
			expect(result).not.toBe(arr);
		});

		it('应该抛出错误如果第一个参数不是数组', () => {
			expect(() => arrayFill('not array' as any, 5, 0)).toThrow('originArr 必须是数组');
		});

		it('应该抛出错误如果 num 不是非负整数', () => {
			expect(() => arrayFill([1], -1, 0)).toThrow('num 必须是非负整数');
			expect(() => arrayFill([1], 1.5, 0)).toThrow('num 必须是非负整数');
		});

		it('应该处理空数组', () => {
			const result = arrayFill([], 3, 0);
			expect(result).toEqual([0, 0, 0]);
		});
	});

	// ==================== arrayUnique 测试 ====================
	describe('arrayUnique - 数组去重', () => {
		it('应该对数字数组去重', () => {
			const arr = [1, 2, 2, 3, 3, 3, 4];
			const result = arrayUnique(arr);
			expect(result).toEqual([1, 2, 3, 4]);
		});

		it('应该对字符串数组去重', () => {
			const arr = ['a', 'b', 'a', 'c', 'b'];
			const result = arrayUnique(arr);
			expect(result).toEqual(['a', 'b', 'c']);
		});

		it('应该对混合数组去重', () => {
			const arr = [1, '1', 2, '2', 1, '1'];
			const result = arrayUnique(arr);
			expect(result).toEqual([1, '1', 2, '2']);
		});

		it('应该保留元素的顺序', () => {
			const arr = [3, 1, 2, 1, 3, 2];
			const result = arrayUnique(arr);
			expect(result).toEqual([3, 1, 2]);
		});

		it('应该处理空数组', () => {
			const result = arrayUnique([]);
			expect(result).toEqual([]);
		});

		it('应该处理没有重复元素的数组', () => {
			const arr = [1, 2, 3, 4];
			const result = arrayUnique(arr);
			expect(result).toEqual([1, 2, 3, 4]);
		});

		it('应该对对象数组去重（引用相等）', () => {
			const obj1 = { id: 1 };
			const obj2 = { id: 2 };
			const arr = [obj1, obj2, obj1];
			const result = arrayUnique(arr);
			expect(result).toEqual([obj1, obj2]);
		});
	});

	// ==================== arrayPaginate 测试 ====================
	describe('arrayPaginate - 数组分页', () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

		it('应该正确获取第一页', () => {
			const result = arrayPaginate(arr, 1, 3);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该正确获取中间页', () => {
			const result = arrayPaginate(arr, 2, 3);
			expect(result).toEqual([4, 5, 6]);
		});

		it('应该正确获取最后一页', () => {
			const result = arrayPaginate(arr, 4, 3);
			expect(result).toEqual([10]);
		});

		it('应该处理页码超出范围', () => {
			const result = arrayPaginate(arr, 5, 3);
			expect(result).toEqual([]);
		});

		it('应该处理页码为0或负数', () => {
			expect(arrayPaginate(arr, 0, 3)).toEqual([]);
			expect(arrayPaginate(arr, -1, 3)).toEqual([]);
		});

		it('应该处理每页数量为0或负数', () => {
			expect(arrayPaginate(arr, 1, 0)).toEqual([]);
			expect(arrayPaginate(arr, 1, -1)).toEqual([]);
		});

		it('应该处理空数组', () => {
			const result = arrayPaginate([], 1, 3);
			expect(result).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			const result = arrayPaginate('not array' as any, 1, 3);
			expect(result).toEqual([]);
		});

		it('应该正确计算总页数', () => {
			expect(arrayPaginate(arr, 3, 3)).toEqual([7, 8, 9]);
			expect(arrayPaginate(arr, 4, 3)).toEqual([10]);
		});
	});

	// ==================== arraySplitToGroups 测试 ====================
	describe('arraySplitToGroups - 数组分组', () => {
		it('应该将数组按指定大小分组', () => {
			const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			const result = arraySplitToGroups(arr, 3);
			expect(result).toEqual({
				1: [1, 2, 3],
				2: [4, 5, 6],
				3: [7, 8, 9],
				4: [10],
			});
		});

		it('应该使用默认分组大小（10）', () => {
			const arr = Array.from({ length: 25 }, (_, i) => i + 1);
			const result = arraySplitToGroups(arr);
			expect(result[1]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
			expect(result[2]).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
			expect(result[3]).toEqual([21, 22, 23, 24, 25]);
		});

		it('应该处理数组长度正好是分组大小的倍数', () => {
			const arr = [1, 2, 3, 4, 5, 6];
			const result = arraySplitToGroups(arr, 3);
			expect(result).toEqual({
				1: [1, 2, 3],
				2: [4, 5, 6],
			});
		});

		it('应该处理空数组', () => {
			const result = arraySplitToGroups([], 3);
			expect(result).toEqual({});
		});

		it('应该处理单元素数组', () => {
			const result = arraySplitToGroups([1], 3);
			expect(result).toEqual({ 1: [1] });
		});

		it('应该抛出错误如果参数不是数组', () => {
			expect(() => arraySplitToGroups('not array' as any, 3)).toThrow('参数必须是数组');
		});

		it('应该抛出错误如果 groupSize 无效', () => {
			expect(() => arraySplitToGroups([1, 2, 3], 0)).toThrow('groupSize 必须是大于 0 的整数');
			expect(() => arraySplitToGroups([1, 2, 3], -1)).toThrow('groupSize 必须是大于 0 的整数');
			expect(() => arraySplitToGroups([1, 2, 3], 1.5)).toThrow('groupSize 必须是大于 0 的整数');
		});
	});

	// ==================== findIndex 测试 ====================
	describe('findIndex - 查找数组元素的索引', () => {
		const users = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
		];

		it('应该返回匹配元素的索引', () => {
			const index = findIndex(users, (user) => user.name === 'Bob');
			expect(index).toBe(1);
		});

		it('应该返回第一个匹配元素的索引', () => {
			const arr = [1, 2, 3, 2, 4];
			const index = findIndex(arr, (item) => item === 2);
			expect(index).toBe(1);
		});

		it('应该返回 -1 如果没有找到匹配元素', () => {
			const index = findIndex(users, (user) => user.name === 'David');
			expect(index).toBe(-1);
		});

		it('应该支持索引参数', () => {
			const arr = [1, 2, 3, 4, 5];
			const index = findIndex(arr, (item, i) => i === 3);
			expect(index).toBe(3);
		});

		it('应该支持数组参数', () => {
			const arr = [1, 2, 3];
			const index = findIndex(arr, (item, i, array) => array.length === 3);
			expect(index).toBe(0);
		});

		it('应该处理空数组', () => {
			const index = findIndex([], (item) => item === 1);
			expect(index).toBe(-1);
		});
	});

	// ==================== moveElement 测试 ====================
	describe('moveElement - 移动数组元素', () => {
		const arr = [1, 2, 3, 4, 5];

		it('应该向上移动元素', () => {
			const result = moveElement(arr, 2, 'up');
			expect(result.success).toBe(true);
			expect(result.data).toEqual([1, 3, 2, 4, 5]);
		});

		it('应该向下移动元素', () => {
			const result = moveElement(arr, 2, 'down');
			expect(result.success).toBe(true);
			expect(result.data).toEqual([1, 2, 4, 3, 5]);
		});

		it('应该将元素移到顶部', () => {
			const result = moveElement(arr, 4, 'top');
			expect(result.success).toBe(true);
			expect(result.data).toEqual([5, 1, 2, 3, 4]);
		});

		it('应该将元素移到底部', () => {
			const result = moveElement(arr, 0, 'bottom');
			expect(result.success).toBe(true);
			expect(result.data).toEqual([2, 3, 4, 5, 1]);
		});

		it('应该在已经是第一个元素时返回失败（上移）', () => {
			const result = moveElement(arr, 0, 'up');
			expect(result.success).toBe(false);
			expect(result.message).toBe('已经是第一个元素');
			expect(result.data).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该在已经是最后一个元素时返回失败（下移）', () => {
			const result = moveElement(arr, 4, 'down');
			expect(result.success).toBe(false);
			expect(result.message).toBe('已经是最后一个元素');
			expect(result.data).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该在已经是第一个元素时返回失败（置顶）', () => {
			const result = moveElement(arr, 0, 'top');
			expect(result.success).toBe(false);
			expect(result.message).toBe('已经是第一个元素');
		});

		it('应该在已经是最后一个元素时返回失败（置底）', () => {
			const result = moveElement(arr, 4, 'bottom');
			expect(result.success).toBe(false);
			expect(result.message).toBe('已经是最后一个元素');
		});

		it('应该返回新数组而不修改原数组', () => {
			const result = moveElement(arr, 2, 'up');
			expect(arr).toEqual([1, 2, 3, 4, 5]);
			expect(result.data).not.toBe(arr);
		});

		it('应该处理空数组', () => {
			const result = moveElement([], 0, 'up');
			expect(result.success).toBe(false);
			expect(result.message).toBe('数组为空');
		});

		it('应该处理非数组输入', () => {
			const result = moveElement('not array' as any, 0, 'up');
			expect(result.success).toBe(false);
			expect(result.message).toBe('参数不是数组');
		});

		it('应该处理超出范围的索引', () => {
			const result = moveElement(arr, 10, 'up');
			expect(result.success).toBe(false);
			expect(result.message).toBe('索引超出范围');
		});

		it('应该处理无效的操作类型', () => {
			const result = moveElement(arr, 2, 'invalid' as any);
			expect(result.success).toBe(false);
			expect(result.message).toBe('无效的操作');
		});

		it('应该连续移动元素', () => {
			let result = moveElement(arr, 4, 'up');
			if (result.data) {
				result = moveElement(result.data, 3, 'up');
				if (result.data) {
					result = moveElement(result.data, 2, 'up');
					if (result.data) {
						result = moveElement(result.data, 1, 'up');
						expect(result.data).toEqual([5, 1, 2, 3, 4]);
					}
				}
			}
		});
	});

	// ==================== groupBy 测试 ====================
	describe('groupBy - 按字段对数组对象进行分组', () => {
		const users = [
			{ id: 1, name: 'Alice', age: 20, city: 'Beijing' },
			{ id: 2, name: 'Bob', age: 25, city: 'Shanghai' },
			{ id: 3, name: 'Charlie', age: 20, city: 'Beijing' },
			{ id: 4, name: 'David', age: 25, city: 'Shanghai' },
		];

		it('应该按数字字段分组', () => {
			const result = groupBy(users, 'age');
			expect(result[20]).toHaveLength(2);
			expect(result[25]).toHaveLength(2);
			expect(result[20]).toEqual([
				{ id: 1, name: 'Alice', age: 20, city: 'Beijing' },
				{ id: 3, name: 'Charlie', age: 20, city: 'Beijing' },
			]);
		});

		it('应该按字符串字段分组', () => {
			const result = groupBy(users, 'city');
			expect(result['Beijing']).toHaveLength(2);
			expect(result['Shanghai']).toHaveLength(2);
		});

		it('应该处理嵌套属性路径', () => {
			const data = [
				{ user: { id: 1, name: 'Alice' } },
				{ user: { id: 2, name: 'Bob' } },
				{ user: { id: 1, name: 'Charlie' } },
			];
			const result = groupBy(data, 'user.id');
			expect(result[1]).toHaveLength(2);
		});

		it('应该处理 undefined 或 null 的字段值', () => {
			const data = [
				{ id: 1, category: 'A' },
				{ id: 2, category: null },
				{ id: 3, category: undefined },
			];
			const result = groupBy(data, 'category');
			expect(result['__undefined__']).toHaveLength(2);
		});

		it('应该处理空数组', () => {
			const result = groupBy([], 'id');
			expect(result).toEqual({});
		});

		it('应该抛出错误如果参数不是数组', () => {
			expect(() => groupBy('not array' as any, 'id')).toThrow('参数必须是数组');
		});
	});

	// ==================== sample 测试 ====================
	describe('sample - 随机获取数组中的一个元素', () => {
		it('应该返回数组中的一个元素', () => {
			const arr = ['red', 'green', 'blue', 'yellow'];
			const result = sample(arr);
			expect(arr).toContain(result);
		});

		it('应该返回数字数组中的一个元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = sample(arr);
			expect(arr).toContain(result);
			expect(typeof result).toBe('number');
		});

		it('应该处理空数组', () => {
			const result = sample([]);
			expect(result).toBeUndefined();
		});

		it('应该处理非数组输入', () => {
			const result = sample('not array' as any);
			expect(result).toBeUndefined();
		});

		it('应该返回数组中的唯一元素', () => {
			const arr = ['only'];
			const result = sample(arr);
			expect(result).toBe('only');
		});
	});

	// ==================== sampleSize 测试 ====================
	describe('sampleSize - 随机获取数组中的 n 个元素', () => {
		it('应该返回指定数量的不重复元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = sampleSize(arr, 2);
			expect(result).toHaveLength(2);
			expect(new Set(result).size).toBe(2); // 不重复
			expect(arr).toContain(result[0]);
			expect(arr).toContain(result[1]);
		});

		it('应该使用默认参数 n=1', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = sampleSize(arr);
			expect(result).toHaveLength(1);
			expect(arr).toContain(result[0]);
		});

		it('当 n 大于数组长度时应返回乱序的全部元素', () => {
			const arr = [1, 2, 3];
			const result = sampleSize(arr, 10);
			expect(result).toHaveLength(3);
			expect(new Set(result).size).toBe(3);
			});

		it('当 n 等于数组长度时应返回乱序的全部元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = sampleSize(arr, 5);
			expect(result).toHaveLength(5);
			expect(new Set(result).size).toBe(5);
		});

		it('应该处理空数组', () => {
			const result = sampleSize([], 3);
			expect(result).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			const result = sampleSize('not array' as any, 3);
			expect(result).toEqual([]);
		});

		it('应该处理 n=0', () => {
			const arr = [1, 2, 3];
			const result = sampleSize(arr, 0);
			expect(result).toEqual([]);
		});

		it('随机结果应该不总是相同（多次测试）', () => {
			const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			const results = new Set();

			for (let i = 0; i < 20; i++) {
				const result = sampleSize(arr, 3);
				results.add(result.join(','));
			}

			// 至少应该有几种不同的随机结果
			expect(results.size).toBeGreaterThan(1);
		});
	});

	// ==================== flatten 测试 ====================
	describe('flatten - 数组扁平化', () => {
		it('应该完全扁平化嵌套数组', () => {
			expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该支持指定深度', () => {
			expect(flatten([1, [2, [3, 4]], 5], 1)).toEqual([1, 2, [3, 4], 5]);
		});

		it('应该处理已扁平的数组', () => {
			expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
		});

		it('应该处理非数组输入', () => {
			expect(flatten(123 as any)).toEqual([]);
		});
	});

	// ==================== range 测试 ====================
	describe('range - 范围数组生成', () => {
		it('应该生成正序范围', () => {
			expect(range(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
		});

		it('应该生成倒序范围', () => {
			expect(range(5, 0, -1)).toEqual([5, 4, 3, 2, 1, 0]);
		});

		it('应该支持步长', () => {
			expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
		});

		it('应该在步长为0时返回空数组', () => {
			expect(range(0, 5, 0)).toEqual([]);
		});
	});

	// ==================== shuffle 测试 ====================
	describe('shuffle - 数组打乱', () => {
		it('应该返回相同长度的数组', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = shuffle(arr);
			expect(result).toHaveLength(arr.length);
		});

		it('应该包含所有原始元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = shuffle(arr);
			expect(result.sort()).toEqual(arr.sort());
		});

		it('应该返回新数组（不修改原数组）', () => {
			const arr = [1, 2, 3];
			const result = shuffle(arr);
			expect(result).not.toBe(arr);
		});

		it('应该处理非数组输入', () => {
			expect(shuffle(123 as any)).toEqual([]);
		});
	});

	// ==================== uniqueBy 测试 ====================
	describe('uniqueBy - 按字段去重', () => {
		it('应该按字段去重', () => {
			const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
			expect(uniqueBy(arr, 'id')).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
		});

		it('应该处理没有重复的数组', () => {
			const arr = [{ id: 1 }, { id: 2 }];
			expect(uniqueBy(arr, 'id')).toEqual([{ id: 1 }, { id: 2 }]);
		});

		it('应该处理非数组输入', () => {
			expect(uniqueBy(null as any, 'id')).toEqual([]);
		});
	});

	// ==================== compact 测试 ====================
	describe('compact - 过滤 falsy 值', () => {
		it('应该过滤 falsy 值', () => {
			expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
		});

		it('应该保留 truthy 值', () => {
			expect(compact([1, 'hello', true, {}, []])).toEqual([1, 'hello', true, {}, []]);
		});

		it('应该处理全 falsy 数组', () => {
			expect(compact([0, false, '', null])).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			expect(compact(123 as any)).toEqual([]);
		});
	});

	// ==================== sum 测试 ====================
	describe('sum - 数组求和', () => {
		it('应该计算数组总和', () => {
			expect(sum([1, 2, 3, 4, 5])).toBe(15);
		});

		it('应该处理空数组', () => {
			expect(sum([])).toBe(0);
		});

		it('应该处理负数', () => {
			expect(sum([-1, 2, -3, 4])).toBe(2);
		});

		it('应该处理非数组输入', () => {
			expect(sum(123 as any)).toBe(0);
		});
	});

	// ==================== last 测试 ====================
	describe('last - 获取最后一个元素', () => {
		it('应该返回最后一个元素', () => {
			expect(last([1, 2, 3])).toBe(3);
		});

		it('应该处理单元素数组', () => {
			expect(last([1])).toBe(1);
		});

		it('应该处理空数组', () => {
			expect(last([])).toBeUndefined();
		});

		it('应该处理非数组输入', () => {
			expect(last(123 as any)).toBeUndefined();
		});
	});

	// ==================== arrayPluck 测试 ====================
	describe('arrayPluck - 提取对象数组指定字段', () => {
		it('应该提取指定字段的值组成数组', () => {
			const arr = [{ name: 'zz' }, { name: 'yy' }];
			expect(arrayPluck(arr, 'name')).toEqual(['zz', 'yy']);
		});

		it('应该提取数字字段', () => {
			const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
			expect(arrayPluck(arr, 'id')).toEqual([1, 2, 3]);
		});

		it('应该处理空数组', () => {
			expect(arrayPluck([], 'name' as any)).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayPluck(null as any, 'name')).toEqual([]);
			expect(arrayPluck(undefined as any, 'name')).toEqual([]);
		});

		it('应该处理字段不存在的情况（过滤 null/undefined）', () => {
			const arr = [{ name: 'zz' }, { name: 'yy' }] as any[];
			expect(arrayPluck(arr, 'age')).toEqual([]);
		});

		it('应该递归提取深层嵌套对象中的字段值', () => {
			const arr = [
				{ name: 'zz', children: [{ name: 'yy' }, { name: null }] },
				{ name: 'xx' },
			];
			expect(arrayPluck(arr, 'name' as any)).toEqual(['zz', 'yy', 'xx']);
		});

		it('应该过滤掉 null 和 undefined 值', () => {
			const arr = [{ name: 'a' }, { name: null as any }, { name: undefined as any }, { name: 'b' }];
			expect(arrayPluck(arr, 'name')).toEqual(['a', 'b']);
		});

	it('应该递归处理嵌套数组中的对象', () => {
		const arr = [
			{ items: [{ value: 1 }, { value: 2 }] },
			{ value: 3 },
		];
		expect(arrayPluck(arr, 'value' as any)).toEqual([1, 2, 3]);
	});
});

describe('findIndex - 无原生 findIndex 回退', () => {
	it('应该在没有原生 findIndex 时使用 some 回退', () => {
		const originalFindIndex = Array.prototype.findIndex;
		delete (Array.prototype as any).findIndex;

		const arr = [1, 2, 3, 4, 5];
		const result = findIndex(arr, (item) => item > 3);
		expect(result).toBe(3);

		(Array.prototype as any).findIndex = originalFindIndex;
	});

	it('应该在没有原生 findIndex 且找不到时返回 -1', () => {
		const originalFindIndex = Array.prototype.findIndex;
		delete (Array.prototype as any).findIndex;

		const arr = [1, 2, 3];
		const result = findIndex(arr, (item) => item > 5);
		expect(result).toBe(-1);

		(Array.prototype as any).findIndex = originalFindIndex;
	});
});

// ==================== sortBy 测试 ====================
describe('sortBy - 按字段排序', () => {
	it('应该按数字字段升序排序（默认）', () => {
		const result = sortBy([{ id: 3 }, { id: 1 }, { id: 2 }], 'id');
		expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
	});

	it('应该按数字字段降序排序', () => {
		const result = sortBy([{ id: 1 }, { id: 3 }, { id: 2 }], 'id', 'desc');
		expect(result).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
	});

	it('应该按字符串字段排序', () => {
		const result = sortBy([{ name: 'c' }, { name: 'a' }, { name: 'b' }], 'name');
		expect(result).toEqual([{ name: 'a' }, { name: 'b' }, { name: 'c' }]);
	});

	it('应该按字符串字段降序排序', () => {
		const result = sortBy([{ name: 'a' }, { name: 'c' }, { name: 'b' }], 'name', 'desc');
		expect(result).toEqual([{ name: 'c' }, { name: 'b' }, { name: 'a' }]);
	});

	it('原数组不应被修改', () => {
		const arr = [{ id: 2 }, { id: 1 }];
		sortBy(arr, 'id');
		expect(arr).toEqual([{ id: 2 }, { id: 1 }]);
	});

	it('非数组输入返回空数组', () => {
		expect(sortBy(null as any, 'id')).toEqual([]);
	});

	it('空数组返回空数组', () => {
		expect(sortBy([], 'id')).toEqual([]);
	});
});

// ==================== uniq 测试 ====================
describe('uniq - 基础类型数组去重', () => {
	it('应该去除重复数字', () => {
		expect(uniq([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
	});

	it('应该去除重复字符串', () => {
		expect(uniq(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
	});

	it('应该保留无重复的数组', () => {
		expect(uniq([1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('空数组返回空数组', () => {
		expect(uniq([])).toEqual([]);
	});

	it('非数组输入返回空数组', () => {
		expect(uniq(null as any)).toEqual([]);
	});

	it('单元素数组返回原值', () => {
		expect(uniq([42])).toEqual([42]);
	});
});

// ==================== sumBy 测试 ====================
describe('sumBy - 按字段求和', () => {
	it('应该计算对象数组指定字段的和', () => {
		const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
		expect(sumBy(items, 'price')).toBe(60);
	});

	it('空数组返回 0', () => {
		expect(sumBy([], 'price')).toBe(0);
	});

	it('非数组输入返回 0', () => {
		expect(sumBy(null as any, 'price')).toBe(0);
	});

	it('应该忽略非数字值（当作 0）', () => {
		const items = [{ price: 10 }, { price: 'abc' as any }];
		expect(sumBy(items, 'price')).toBe(10);
	});

	it('单元素数组返回该元素值', () => {
		expect(sumBy([{ val: 5 }], 'val')).toBe(5);
	});
});
});
