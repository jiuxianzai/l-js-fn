/**
 * number-kit 单元测试
 * 测试所有数字处理相关的方法
 */

import {
	formatNumber,
	toPercent,
	random,
	getUniqueRandomIndexes,
} from '@/libs/number-kit';

describe('number-kit - 数字处理工具', () => {
	// ==================== formatNumber 测试 ====================
	describe('formatNumber - 数字格式化', () => {
		it('应该使用千分位分隔符格式化数字', () => {
			expect(formatNumber(1234567)).toBe('1,234,567');
			expect(formatNumber(1234567890)).toBe('1,234,567,890');
		});

		it('应该格式化小数', () => {
			expect(formatNumber(1234.56)).toBe('1,234.56');
			expect(formatNumber(1234567.89)).toBe('1,234,567.89');
		});

		it('应该处理小数字（不需要千分位）', () => {
			expect(formatNumber(123)).toBe('123');
			expect(formatNumber(99)).toBe('99');
			expect(formatNumber(0)).toBe('0');
		});

		it('应该处理负数', () => {
			expect(formatNumber(-1234567)).toBe('-1,234,567');
			expect(formatNumber(-1234.56)).toBe('-1,234.56');
		});

		it('应该处理字符串数字', () => {
			expect(formatNumber('1234567')).toBe('1,234,567');
			expect(formatNumber('1234.56')).toBe('1,234.56');
		});

		it('应该原样返回非数字字符串', () => {
			expect(formatNumber('abc')).toBe('abc');
			expect(formatNumber('12abc')).toBe('12abc');
		});

		it('应该处理 NaN', () => {
			expect(formatNumber(NaN)).toBe('NaN');
		});

		it('应该处理 Infinity', () => {
			expect(formatNumber(Infinity)).toBe('Infinity');
		});

		describe('中文单位模式', () => {
			it('应该使用"万"单位', () => {
				expect(formatNumber(10000, true)).toBe('1万');
				expect(formatNumber(12345, true)).toBe('1.23万');
				expect(formatNumber(99999, true)).toBe('10万');
			});

			it('应该使用"亿"单位', () => {
				expect(formatNumber(100000000, true)).toBe('1亿');
				expect(formatNumber(123456789, true)).toBe('1.23亿');
				expect(formatNumber(999999999, true)).toBe('10亿');
			});

			it('应该去除小数点后的 .00', () => {
				expect(formatNumber(10000, true)).toBe('1万');
				expect(formatNumber(100000000, true)).toBe('1亿');
				expect(formatNumber(12300, true)).toBe('1.23万');
			});

			it('应该保留小数位如果有的', () => {
				expect(formatNumber(12345, true)).toBe('1.23万');
				expect(formatNumber(123456789, true)).toBe('1.23亿');
			});

			it('应该小于1万时不加单位', () => {
				expect(formatNumber(9999, true)).toBe('9999');
				expect(formatNumber(123, true)).toBe('123');
				expect(formatNumber(0, true)).toBe('0');
			});

			it('应该处理负数', () => {
				expect(formatNumber(-10000, true)).toBe('-1万');
				expect(formatNumber(-12345, true)).toBe('-1.23万');
			});
		});
	});

	// ==================== toPercent 测试 ====================
	describe('toPercent - 小数转百分比', () => {
		it('应该将小数转换为百分比', () => {
			expect(toPercent(0.5)).toBe('50.00%');
			expect(toPercent(0.123)).toBe('12.30%');
			expect(toPercent(1)).toBe('100.00%');
		});

		it('应该使用指定的小数位数', () => {
			expect(toPercent(0.12345, 3)).toBe('12.345%');
			expect(toPercent(0.5, 0)).toBe('50%');
			expect(toPercent(0.5, 1)).toBe('50.0%');
		});

		it('应该四舍五入（默认）', () => {
			expect(toPercent(0.5555, 2)).toBe('55.55%');
			expect(toPercent(0.5556, 2)).toBe('55.56%');
		});

		it('应该向下取整如果 round=false', () => {
			expect(toPercent(0.5559, 2, false)).toBe('55.55%');
			expect(toPercent(0.9999, 2, false)).toBe('99.99%');
		});

		it('应该返回 0% 如果值为 null', () => {
			expect(toPercent(null)).toBe('0%');
		});

		it('应该返回 0% 如果值为 undefined', () => {
			expect(toPercent(undefined)).toBe('0%');
		});

		it('应该返回 0% 如果值为 NaN', () => {
			expect(toPercent(NaN)).toBe('0%');
		});

		it('应该处理百分比字符串', () => {
			expect(toPercent('0.5')).toBe('50.00%');
			expect(toPercent('0.123')).toBe('12.30%');
		});

		it('应该处理大于1的数字', () => {
			expect(toPercent(1.5)).toBe('150.00%');
			expect(toPercent(2)).toBe('200.00%');
		});

		it('应该处理负数', () => {
			expect(toPercent(-0.5)).toBe('-50.00%');
			expect(toPercent(-0.123)).toBe('-12.30%');
		});

		it('应该处理非常小的数字', () => {
			expect(toPercent(0.0001, 4)).toBe('0.0100%');
		});

		it('应该处理零', () => {
			expect(toPercent(0)).toBe('0.00%');
		});
	});

	// ==================== random 测试 ====================
	describe('random - 生成随机数', () => {
		it('应该生成指定范围内的随机整数', () => {
			const result = random(10);
			expect(result).toBeGreaterThanOrEqual(0);
			expect(result).toBeLessThan(10);
			expect(Number.isInteger(result)).toBe(true);
		});

		it('应该生成指定最小值和最大值之间的随机整数', () => {
			const result = random(5, 10);
			expect(result).toBeGreaterThanOrEqual(5);
			expect(result).toBeLessThan(10);
			expect(Number.isInteger(result)).toBe(true);
		});

		it('应该生成随机浮点数（float=true）', () => {
			const result = random(5, 10, { float: true });
			expect(result).toBeGreaterThanOrEqual(5);
			expect(result).toBeLessThan(10);
		});

		it('应该支持负数范围', () => {
			const result = random(-10, -5);
			expect(result).toBeGreaterThanOrEqual(-10);
			expect(result).toBeLessThan(-5);
		});

		it('应该支持从负数到正数的范围', () => {
			const result = random(-5, 5);
			expect(result).toBeGreaterThanOrEqual(-5);
			expect(result).toBeLessThan(5);
		});

		it('应该抛出错误如果最小值大于最大值', () => {
			expect(() => random(10, 5)).toThrow('最小值不能大于最大值');
		});

		it('应该抛出错误如果单参数且小于等于0', () => {
			expect(() => random(0)).toThrow('当只有一个参数时，最大值必须大于 0');
			expect(() => random(-5)).toThrow('当只有一个参数时，最大值必须大于 0');
		});

		it('应该包含最小值但不包含最大值', () => {
			const results = new Set();
			for (let i = 0; i < 100; i++) {
				results.add(random(1, 3));
			}
			// 应该只包含 1 和 2
			expect(results.has(1)).toBe(true);
			expect(results.has(2)).toBe(true);
			expect(results.has(3)).toBe(false);
			expect(results.has(0)).toBe(false);
		});

		it('应该生成不同的随机数（高概率）', () => {
			const results = new Set();
			for (let i = 0; i < 100; i++) {
				results.add(random(1, 100));
			}
			// 100次生成1-100的随机数，应该有多个不同的值
			expect(results.size).toBeGreaterThan(10);
		});
	});

	// ==================== getUniqueRandomIndexes 测试 ====================
	describe('getUniqueRandomIndexes - 生成不重复随机索引', () => {
		it('应该生成指定数量的不重复索引', () => {
			const result = getUniqueRandomIndexes(10, 5);
			expect(result).toHaveLength(5);
			expect(new Set(result).size).toBe(5); // 无重复
		});

		it('应该所有索引都在有效范围内', () => {
			const len = 10;
			const result = getUniqueRandomIndexes(len, 5);
			result.forEach(index => {
				expect(index).toBeGreaterThanOrEqual(0);
				expect(index).toBeLessThan(len);
			});
		});

		it('应该处理 count 等于 len 的情况', () => {
			const len = 5;
			const result = getUniqueRandomIndexes(len, len);
			expect(result).toHaveLength(len);
			expect(new Set(result).size).toBe(len);
			expect(result.sort()).toEqual([0, 1, 2, 3, 4]);
		});

		it('应该处理 count 大于 len 的情况（自动限制为 len）', () => {
			const len = 5;
			const result = getUniqueRandomIndexes(len, 10);
			expect(result).toHaveLength(len);
		});

		it('应该返回空数组如果 len <= 0', () => {
			expect(getUniqueRandomIndexes(0, 5)).toEqual([]);
			expect(getUniqueRandomIndexes(-1, 5)).toEqual([]);
		});

		it('应该处理 count 为 0 的情况', () => {
			const result = getUniqueRandomIndexes(10, 0);
			expect(result).toHaveLength(0);
		});

		it('应该处理 count 为 1 的情况', () => {
			const result = getUniqueRandomIndexes(10, 1);
			expect(result).toHaveLength(1);
			expect(result[0]).toBeGreaterThanOrEqual(0);
			expect(result[0]).toBeLessThan(10);
		});

		it('应该多次调用生成不同的索引序列（高概率）', () => {
			const result1 = getUniqueRandomIndexes(100, 50);
			const result2 = getUniqueRandomIndexes(100, 50);
			// 两次生成50个不重复索引，完全相同的概率极低
			expect(result1).not.toEqual(result2);
		});

		it('应该处理小范围的索引', () => {
			const result = getUniqueRandomIndexes(2, 2);
			expect(result).toHaveLength(2);
			expect(result.sort()).toEqual([0, 1]);
		});

		it('应该处理单元素范围', () => {
			const result = getUniqueRandomIndexes(1, 1);
			expect(result).toEqual([0]);
		});
	});
});
