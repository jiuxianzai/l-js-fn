/**
 * array-kit 单元测试
 * 测试所有数组操作相关的方法
 */

import {
	arrayRemove,
	arrayRemoveAt,
	arrayRemoveBy,
	arrayFill,
	arrayUnique,
	arrayPaginate,
	arraySplitToGroups,
	arrayMove,
	arrayGroupBy,
	arraySample,
	arraySampleSize,
	arrayFlatten,
	arrayRange,
	arrayShuffle,
	arrayUniqueBy,
	arrayCompact,
	arraySum,
	arrayLast,
	arrayPluck,
	arraySortBy,
	arraySumBy,
	arrayToString,
} from '@/libs/array-kit';

describe('array-kit - 数组操作工具', () => {
	// ==================== arrayRemove 测试 ====================
	describe('arrayRemove - 删除数组元素', () => {
		it('应该删除指定的基本类型元素', () => {
			const arr = [1, 2, 3, 2, 4];
			const result = arrayRemove(arr, 2);
			expect(result).toEqual([1, 3, 4]);
		});

		it('应该删除所有匹配的元素', () => {
			const arr = [1, 2, 2, 2, 3];
			const result = arrayRemove(arr, 2);
			expect(result).toEqual([1, 3]);
		});

		it('应该删除对象元素（通过 key 匹配）', () => {
			const arr = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 3, name: 'Charlie' },
			];
			const result = arrayRemove(arr, { id: 2, name: 'Bob' }, 'id');
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
			const result = arrayRemove(arr, { id: 2, name: '' }, 'id');
			expect(result).toEqual([{ id: 1, name: 'Alice' }]);
		});

		it('当没有 key 时应该通过深比较匹配对象', () => {
			const arr = [
				{ id: 1, name: 'Alice' },
				{ id: 2, name: 'Bob' },
				{ id: 1, name: 'Alice' },
			];
			const result = arrayRemove(arr, { id: 1, name: 'Alice' });
			expect(result).toEqual([{ id: 2, name: 'Bob' }]);
		});

		it('应该删除字符串元素', () => {
			const arr = ['a', 'b', 'c', 'b', 'd'];
			const result = arrayRemove(arr, 'b');
			expect(result).toEqual(['a', 'c', 'd']);
		});

		it('应该删除 null 元素', () => {
			const arr = [1, null, 2, null, 3];
			const result = arrayRemove(arr, null);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [1, 2, 3];
			const result = arrayRemove(arr, 2);
			expect(arr).toEqual([1, 2, 3]); // 原数组不变
			expect(result).not.toBe(arr);
		});

		it('应该处理元素不存在的情况', () => {
			const arr = [1, 2, 3];
			const result = arrayRemove(arr, 4);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理空数组', () => {
			const result = arrayRemove([], 1);
			expect(result).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayRemove('not array' as any, 1)).toBe('not array');
		});
	});

	// ==================== arrayRemoveAt 测试 ====================
	describe('arrayRemoveAt - 根据索引删除元素', () => {
		it('应该删除指定索引的元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arrayRemoveAt(arr, 2);
			expect(result).toEqual([1, 2, 4, 5]);
		});

		it('应该删除第一个元素（索引0）', () => {
			const arr = [1, 2, 3];
			const result = arrayRemoveAt(arr, 0);
			expect(result).toEqual([2, 3]);
		});

		it('应该删除最后一个元素', () => {
			const arr = [1, 2, 3];
			const result = arrayRemoveAt(arr, 2);
			expect(result).toEqual([1, 2]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [1, 2, 3];
			const result = arrayRemoveAt(arr, 1);
			expect(arr).toEqual([1, 2, 3]);
			expect(result).not.toBe(arr);
		});

		it('应该处理无效索引（负数）', () => {
			const arr = [1, 2, 3];
			const result = arrayRemoveAt(arr, -1);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理超出范围的索引', () => {
			const arr = [1, 2, 3];
			const result = arrayRemoveAt(arr, 10);
			expect(result).toEqual([1, 2, 3]);
		});

		it('应该处理非数组输入', () => {
			const result = arrayRemoveAt('not array' as any, 0);
			expect(result).toEqual('not array');
		});
	});

	// ==================== arrayRemoveBy 测试 ====================
	describe('arrayRemoveBy - 根据条件删除元素', () => {
		const users = [
			{ id: 1, name: 'Alice' },
			{ id: 2, name: 'Bob' },
			{ id: 3, name: 'Charlie' },
			{ id: 2, name: 'David' },
		];

		it('应该删除匹配谓词的所有元素', () => {
			const result = arrayRemoveBy(users, (user) => user.id === 2);
			expect(result).toEqual([
				{ id: 1, name: 'Alice' },
				{ id: 3, name: 'Charlie' },
			]);
		});

		it('应该根据 name 键删除元素', () => {
			const result = arrayRemoveBy(users, (user) => user.name === 'Alice');
			expect(result).toEqual([
				{ id: 2, name: 'Bob' },
				{ id: 3, name: 'Charlie' },
				{ id: 2, name: 'David' },
			]);
		});

		it('应该支持索引与数组参数', () => {
			const result = arrayRemoveBy([1, 2, 3, 4], (_, index) => index % 2 === 0);
			expect(result).toEqual([2, 4]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const arr = [{ id: 1 }, { id: 2 }];
			const result = arrayRemoveBy(arr, (item) => item.id === 1);
			expect(arr).toEqual([{ id: 1 }, { id: 2 }]);
			expect(result).not.toBe(arr);
		});

		it('应该处理没有匹配项的情况', () => {
			const result = arrayRemoveBy(users, (user) => user.id === 99);
			expect(result).toEqual(users);
		});

		it('应该处理空数组', () => {
			const result = arrayRemoveBy<{ id: number }>([], () => true);
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

		it('非数组输入返回空数组', () => {
			expect(arrayFill('not array' as any, 5, 0)).toEqual([]);
		});

		it('num 无效时返回原数组拷贝', () => {
			expect(arrayFill([1], -1, 0)).toEqual([1]);
			expect(arrayFill([1], 1.5, 0)).toEqual([1]);
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

		it('非数组输入返回空数组', () => {
			expect(arrayUnique(null as any)).toEqual([]);
		});

		it('单元素数组返回原值', () => {
			expect(arrayUnique([42])).toEqual([42]);
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

		it('非数组输入返回空对象', () => {
			expect(arraySplitToGroups('not array' as any, 3)).toEqual({});
		});

		it('groupSize 无效时返回空对象', () => {
			expect(arraySplitToGroups([1, 2, 3], 0)).toEqual({});
			expect(arraySplitToGroups([1, 2, 3], -1)).toEqual({});
			expect(arraySplitToGroups([1, 2, 3], 1.5)).toEqual({});
		});
	});

	// ==================== arrayMove 测试 ====================
	describe('arrayMove - 移动数组元素', () => {
		const arr = [1, 2, 3, 4, 5];

		it('应该向上移动元素', () => {
			const result = arrayMove(arr, 2, 'up');
			expect(result).toEqual([1, 3, 2, 4, 5]);
		});

		it('应该向下移动元素', () => {
			const result = arrayMove(arr, 2, 'down');
			expect(result).toEqual([1, 2, 4, 3, 5]);
		});

		it('应该将元素移到顶部', () => {
			const result = arrayMove(arr, 4, 'top');
			expect(result).toEqual([5, 1, 2, 3, 4]);
		});

		it('应该将元素移到底部', () => {
			const result = arrayMove(arr, 0, 'bottom');
			expect(result).toEqual([2, 3, 4, 5, 1]);
		});

		it('已经是第一个元素时上移返回原数组拷贝', () => {
			const result = arrayMove(arr, 0, 'up');
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('已经是最后一个元素时下移返回原数组拷贝', () => {
			const result = arrayMove(arr, 4, 'down');
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('已经是第一个元素时置顶返回原数组拷贝', () => {
			const result = arrayMove(arr, 0, 'top');
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('已经是最后一个元素时置底返回原数组拷贝', () => {
			const result = arrayMove(arr, 4, 'bottom');
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该返回新数组而不修改原数组', () => {
			const result = arrayMove(arr, 2, 'up');
			expect(arr).toEqual([1, 2, 3, 4, 5]);
			expect(result).not.toBe(arr);
		});

		it('应该处理空数组', () => {
			expect(arrayMove([], 0, 'up')).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayMove('not array' as any, 0, 'up')).toEqual([]);
		});

		it('应该处理超出范围的索引', () => {
			const result = arrayMove(arr, 10, 'up');
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该处理无效的操作类型', () => {
			const result = arrayMove(arr, 2, 'invalid' as any);
			expect(result).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该连续移动元素', () => {
			let result = arrayMove(arr, 4, 'up');
			result = arrayMove(result, 3, 'up');
			result = arrayMove(result, 2, 'up');
			result = arrayMove(result, 1, 'up');
			expect(result).toEqual([5, 1, 2, 3, 4]);
		});
	});

	// ==================== arrayGroupBy 测试 ====================
	describe('arrayGroupBy - 按字段对数组对象进行分组', () => {
		const users = [
			{ id: 1, name: 'Alice', age: 20, city: 'Beijing' },
			{ id: 2, name: 'Bob', age: 25, city: 'Shanghai' },
			{ id: 3, name: 'Charlie', age: 20, city: 'Beijing' },
			{ id: 4, name: 'David', age: 25, city: 'Shanghai' },
		];

		it('应该按数字字段分组', () => {
			const result = arrayGroupBy(users, 'age');
			expect(result[20]).toHaveLength(2);
			expect(result[25]).toHaveLength(2);
			expect(result[20]).toEqual([
				{ id: 1, name: 'Alice', age: 20, city: 'Beijing' },
				{ id: 3, name: 'Charlie', age: 20, city: 'Beijing' },
			]);
		});

		it('应该按字符串字段分组', () => {
			const result = arrayGroupBy(users, 'city');
			expect(result['Beijing']).toHaveLength(2);
			expect(result['Shanghai']).toHaveLength(2);
		});

		it('应该处理嵌套属性路径', () => {
			const data = [
				{ user: { id: 1, name: 'Alice' } },
				{ user: { id: 2, name: 'Bob' } },
				{ user: { id: 1, name: 'Charlie' } },
			];
			const result = arrayGroupBy(data, 'user.id');
			expect(result[1]).toHaveLength(2);
		});

		it('应该处理 undefined 或 null 的字段值', () => {
			const data = [
				{ id: 1, category: 'A' },
				{ id: 2, category: null },
				{ id: 3, category: undefined },
			];
			const result = arrayGroupBy(data, 'category');
			expect(result['__undefined__']).toHaveLength(2);
		});

		it('应该处理空数组', () => {
			const result = arrayGroupBy([], 'id');
			expect(result).toEqual({});
		});

		it('非数组输入返回空对象', () => {
			expect(arrayGroupBy('not array' as any, 'id')).toEqual({});
		});
	});

	// ==================== arraySample 测试 ====================
	describe('arraySample - 随机获取数组中的一个元素', () => {
		it('应该返回数组中的一个元素', () => {
			const arr = ['red', 'green', 'blue', 'yellow'];
			const result = arraySample(arr);
			expect(arr).toContain(result);
		});

		it('应该返回数字数组中的一个元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arraySample(arr);
			expect(arr).toContain(result);
			expect(typeof result).toBe('number');
		});

		it('应该处理空数组', () => {
			const result = arraySample([]);
			expect(result).toBeUndefined();
		});

		it('应该处理非数组输入', () => {
			const result = arraySample('not array' as any);
			expect(result).toBeUndefined();
		});

		it('应该返回数组中的唯一元素', () => {
			const arr = ['only'];
			const result = arraySample(arr);
			expect(result).toBe('only');
		});
	});

	// ==================== arraySampleSize 测试 ====================
	describe('arraySampleSize - 随机获取数组中的 n 个元素', () => {
		it('应该返回指定数量的不重复元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arraySampleSize(arr, 2);
			expect(result).toHaveLength(2);
			expect(new Set(result).size).toBe(2); // 不重复
			expect(arr).toContain(result[0]);
			expect(arr).toContain(result[1]);
		});

		it('应该使用默认参数 n=1', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arraySampleSize(arr);
			expect(result).toHaveLength(1);
			expect(arr).toContain(result[0]);
		});

		it('当 n 大于数组长度时应返回乱序的全部元素', () => {
			const arr = [1, 2, 3];
			const result = arraySampleSize(arr, 10);
			expect(result).toHaveLength(3);
			expect(new Set(result).size).toBe(3);
		});

		it('当 n 等于数组长度时应返回乱序的全部元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arraySampleSize(arr, 5);
			expect(result).toHaveLength(5);
			expect(new Set(result).size).toBe(5);
		});

		it('应该处理空数组', () => {
			const result = arraySampleSize([], 3);
			expect(result).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			const result = arraySampleSize('not array' as any, 3);
			expect(result).toEqual([]);
		});

		it('应该处理 n=0', () => {
			const arr = [1, 2, 3];
			const result = arraySampleSize(arr, 0);
			expect(result).toEqual([]);
		});

		it('随机结果应该不总是相同（多次测试）', () => {
			const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			const results = new Set();

			for (let i = 0; i < 20; i++) {
				const result = arraySampleSize(arr, 3);
				results.add(result.join(','));
			}

			// 至少应该有几种不同的随机结果
			expect(results.size).toBeGreaterThan(1);
		});
	});

	// ==================== arrayFlatten 测试 ====================
	describe('arrayFlatten - 数组扁平化', () => {
		it('应该完全扁平化嵌套数组', () => {
			expect(arrayFlatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
		});

		it('应该支持指定深度', () => {
			expect(arrayFlatten([1, [2, [3, 4]], 5], 1)).toEqual([1, 2, [3, 4], 5]);
		});

		it('应该处理已扁平的数组', () => {
			expect(arrayFlatten([1, 2, 3])).toEqual([1, 2, 3]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayFlatten(123 as any)).toEqual([]);
		});
	});

	// ==================== arrayRange 测试 ====================
	describe('arrayRange - 范围数组生成', () => {
		it('应该生成正序范围', () => {
			expect(arrayRange(0, 5)).toEqual([0, 1, 2, 3, 4, 5]);
		});

		it('应该生成倒序范围', () => {
			expect(arrayRange(5, 0, -1)).toEqual([5, 4, 3, 2, 1, 0]);
		});

		it('应该支持步长', () => {
			expect(arrayRange(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
		});

		it('应该在步长为0时返回空数组', () => {
			expect(arrayRange(0, 5, 0)).toEqual([]);
		});
	});

	// ==================== arrayShuffle 测试 ====================
	describe('arrayShuffle - 数组打乱', () => {
		it('应该返回相同长度的数组', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arrayShuffle(arr);
			expect(result).toHaveLength(arr.length);
		});

		it('应该包含所有原始元素', () => {
			const arr = [1, 2, 3, 4, 5];
			const result = arrayShuffle(arr);
			expect(result.sort()).toEqual(arr.sort());
		});

		it('应该返回新数组（不修改原数组）', () => {
			const arr = [1, 2, 3];
			const result = arrayShuffle(arr);
			expect(result).not.toBe(arr);
		});

		it('应该处理非数组输入', () => {
			expect(arrayShuffle(123 as any)).toEqual([]);
		});
	});

	// ==================== arrayUniqueBy 测试 ====================
	describe('arrayUniqueBy - 按字段去重', () => {
		it('应该按字段去重', () => {
			const arr = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }, { id: 1, name: 'c' }];
			expect(arrayUniqueBy(arr, 'id')).toEqual([{ id: 1, name: 'a' }, { id: 2, name: 'b' }]);
		});

		it('应该处理没有重复的数组', () => {
			const arr = [{ id: 1 }, { id: 2 }];
			expect(arrayUniqueBy(arr, 'id')).toEqual([{ id: 1 }, { id: 2 }]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayUniqueBy(null as any, 'id')).toEqual([]);
		});
	});

	// ==================== arrayCompact 测试 ====================
	describe('arrayCompact - 过滤 falsy 值', () => {
		it('应该过滤 falsy 值', () => {
			expect(arrayCompact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
		});

		it('应该保留 truthy 值', () => {
			expect(arrayCompact([1, 'hello', true, {}, []])).toEqual([1, 'hello', true, {}, []]);
		});

		it('应该处理全 falsy 数组', () => {
			expect(arrayCompact([0, false, '', null])).toEqual([]);
		});

		it('应该处理非数组输入', () => {
			expect(arrayCompact(123 as any)).toEqual([]);
		});
	});

	// ==================== arraySum 测试 ====================
	describe('arraySum - 数组求和', () => {
		it('应该计算数组总和', () => {
			expect(arraySum([1, 2, 3, 4, 5])).toBe(15);
		});

		it('应该处理空数组', () => {
			expect(arraySum([])).toBe(0);
		});

		it('应该处理负数', () => {
			expect(arraySum([-1, 2, -3, 4])).toBe(2);
		});

		it('应该处理非数组输入', () => {
			expect(arraySum(123 as any)).toBe(0);
		});
	});

	// ==================== arrayLast 测试 ====================
	describe('arrayLast - 获取最后一个元素', () => {
		it('应该返回最后一个元素', () => {
			expect(arrayLast([1, 2, 3])).toBe(3);
		});

		it('应该处理单元素数组', () => {
			expect(arrayLast([1])).toBe(1);
		});

		it('应该处理空数组', () => {
			expect(arrayLast([])).toBeUndefined();
		});

		it('应该处理非数组输入', () => {
			expect(arrayLast(123 as any)).toBeUndefined();
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

		it('应该处理循环引用', () => {
			const obj: any = { name: 'a', child: null };
			obj.child = obj; // 循环引用
			expect(arrayPluck([obj], 'name')).toEqual(['a']);
		});
	});

	// ==================== arraySortBy 测试 ====================
	describe('arraySortBy - 按字段排序', () => {
		it('应该按数字字段升序排序（默认）', () => {
			const result = arraySortBy([{ id: 3 }, { id: 1 }, { id: 2 }], 'id');
			expect(result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
		});

		it('应该按数字字段降序排序', () => {
			const result = arraySortBy([{ id: 1 }, { id: 3 }, { id: 2 }], 'id', 'desc');
			expect(result).toEqual([{ id: 3 }, { id: 2 }, { id: 1 }]);
		});

		it('应该按字符串字段排序', () => {
			const result = arraySortBy([{ name: 'c' }, { name: 'a' }, { name: 'b' }], 'name');
			expect(result).toEqual([{ name: 'a' }, { name: 'b' }, { name: 'c' }]);
		});

		it('应该按字符串字段降序排序', () => {
			const result = arraySortBy([{ name: 'a' }, { name: 'c' }, { name: 'b' }], 'name', 'desc');
			expect(result).toEqual([{ name: 'c' }, { name: 'b' }, { name: 'a' }]);
		});

		it('原数组不应被修改', () => {
			const arr = [{ id: 2 }, { id: 1 }];
			arraySortBy(arr, 'id');
			expect(arr).toEqual([{ id: 2 }, { id: 1 }]);
		});

		it('非数组输入返回空数组', () => {
			expect(arraySortBy(null as any, 'id')).toEqual([]);
		});

		it('空数组返回空数组', () => {
			expect(arraySortBy([], 'id')).toEqual([]);
		});
	});

	// ==================== arraySumBy 测试 ====================
	describe('arraySumBy - 按字段求和', () => {
		it('应该计算对象数组指定字段的和', () => {
			const items = [{ price: 10 }, { price: 20 }, { price: 30 }];
			expect(arraySumBy(items, 'price')).toBe(60);
		});

		it('空数组返回 0', () => {
			expect(arraySumBy([], 'price')).toBe(0);
		});

		it('非数组输入返回 0', () => {
			expect(arraySumBy(null as any, 'price')).toBe(0);
		});

		it('应该忽略非数字值（当作 0）', () => {
			const items = [{ price: 10 }, { price: 'abc' as any }];
			expect(arraySumBy(items, 'price')).toBe(10);
		});

		it('单元素数组返回该元素值', () => {
			expect(arraySumBy([{ val: 5 }], 'val')).toBe(5);
		});
	});

	// ==================== arrayToString 测试 ====================
	describe('arrayToString - 过滤空值后拼接字符串', () => {
		it('应该过滤 null、undefined、空字符串后按顺序拼接', () => {
			const result = arrayToString(['a', null, 'b', undefined, '', 'c']);
			expect(result).toBe('abc');
		});

		it('应该保留 0 和 false（非空值）', () => {
			const result = arrayToString([1, 0, false, null, '', 2]);
			expect(result).toBe('10false2');
		});

		it('应该将数字隐式转换为字符串拼接', () => {
			const result = arrayToString([1, 2, 3]);
			expect(result).toBe('123');
		});

		it('应该支持自定义分隔符', () => {
			const result = arrayToString(['a', 'b', 'c'], '&');
			expect(result).toBe('a&b&c');
		});

		it('使用分隔符时应过滤空值', () => {
			const result = arrayToString(['a', null, '', 'b'], '-');
			expect(result).toBe('a-b');
		});

		it('应保持原数组顺序拼接', () => {
			const result = arrayToString(['b', 'a', 'c']);
			expect(result).toBe('bac');
		});

		it('对象元素应拼接为 [object Object]', () => {
			const result = arrayToString([{ id: 1 }, null, { id: 2 }]);
			expect(result).toBe('[object Object][object Object]');
		});

		it('仅含空值的数组返回空字符串', () => {
			expect(arrayToString([null, undefined, ''])).toBe('');
		});

		it('空数组返回空字符串', () => {
			expect(arrayToString([])).toBe('');
		});

		it('非数组输入返回空字符串', () => {
			expect(arrayToString(123 as any)).toBe('');
			expect(arrayToString(null as any)).toBe('');
			expect(arrayToString(undefined as any)).toBe('');
			expect(arrayToString({} as any)).toBe('');
		});

		it('单元素数组返回该元素字符串', () => {
			expect(arrayToString(['hello'])).toBe('hello');
		});

		it('签名拼接典型场景（signStr）', () => {
			const signStr = arrayToString(['admin', '123456', '', null, '13800138000']);
			expect(signStr).toBe('admin12345613800138000');
		});
	});
});
