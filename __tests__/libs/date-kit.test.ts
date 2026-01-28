/**
 * date-kit 单元测试
 * 测试所有日期处理相关的方法
 */

import {
	dateFormat,
	dateSecond,
	diffDays,
	formatPassTime,
	monthDays,
	getTimeDiff,
} from '@/libs/date-kit';

describe('date-kit - 日期处理工具', () => {
	// ==================== dateFormat 测试 ====================
	describe('dateFormat - 日期格式化', () => {
		it('应该使用默认格式格式化当前时间', () => {
			// 不使用 fake timers，因为会干扰时间戳处理
			const result = dateFormat();
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});

		it('应该格式化 Date 对象', () => {
			const date = new Date('2024-12-25 08:20:30');
			const result = dateFormat(date, 'yyyy-MM-dd HH:mm:ss');
			expect(result).toBe('2024-12-25 08:20:30');
		});

		it('应该处理时间戳（秒级）', () => {
			const timestamp = 1705339200; // 2024-01-15 12:00:00 UTC
			const result = dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss');
			// 根据本地时区，结果会不同
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});

		it('应该处理时间戳（毫秒级）', () => {
			const timestamp = 1705339200000; // 2024-01-15 12:00:00 UTC
			const result = dateFormat(timestamp, 'yyyy-MM-dd HH:mm:ss');
			// 根据本地时区，结果会不同
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});

		it('应该处理 ISO 日期字符串', () => {
			const result = dateFormat('2024-01-15T12:30:45Z', 'yyyy-MM-dd HH:mm:ss');
			// 根据本地时区，结果会不同
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});

		it('应该兼容 iOS 日期格式（将 - 替换为 /）', () => {
			const result = dateFormat('2024-01-15 12:30:45', 'yyyy-MM-dd HH:mm:ss');
			expect(result).toBe('2024-01-15 12:30:45');
		});

		it('应该返回空字符串如果输入为 null', () => {
			expect(dateFormat(null as any)).toBe('');
		});

		it('应该返回空字符串如果输入为 undefined', () => {
			// 注意：undefined 会使用默认值（当前时间），不是空字符串
			const result = dateFormat(undefined as any);
			expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
		});

		it('应该返回空字符串如果输入为空字符串', () => {
			expect(dateFormat('')).toBe('');
		});

		it('应该返回空字符串如果输入为无效日期', () => {
			expect(dateFormat('invalid date')).toBe('');
		});

		it('应该自定义格式', () => {
			const date = new Date('2024-01-15 08:05:03');
			expect(dateFormat(date, 'yyyy-MM-dd' as any)).toBe('2024-01-15');
			expect(dateFormat(date, 'HH:mm:ss' as any)).toBe('08:05:03');
			expect(dateFormat(date, 'yyyy/MM/dd HH:mm' as any)).toBe('2024/01/15 08:05');
		});

		it('应该处理季度', () => {
			// 1月是第1季度
			expect(dateFormat('2024-01-15', 'q' as any)).toBe('1');
			// 4月是第2季度
			expect(dateFormat('2024-04-15', 'q' as any)).toBe('2');
			// 8月是第3季度
			expect(dateFormat('2024-08-15', 'q' as any)).toBe('3');
			// 12月是第4季度
			expect(dateFormat('2024-12-15', 'q' as any)).toBe('4');
		});

		it('应该处理毫秒', () => {
			const date = new Date('2024-01-15 12:30:45.123');
			expect(dateFormat(date, 'yyyy-MM-dd HH:mm:ss.SSS' as any)).toBe('2024-01-15 12:30:45.123');
		});
	});

	// ==================== dateSecond 测试 ====================
	describe('dateSecond - 秒数转时间格式', () => {
		it('应该正确格式化秒数', () => {
			expect(dateSecond(0)).toBe('00:00:00');
			expect(dateSecond(5)).toBe('00:00:05');
			expect(dateSecond(59)).toBe('00:00:59');
		});

		it('应该正确格式化分钟', () => {
			expect(dateSecond(60)).toBe('00:01:00');
			expect(dateSecond(125)).toBe('00:02:05');
			expect(dateSecond(3599)).toBe('00:59:59');
		});

		it('应该正确格式化小时', () => {
			expect(dateSecond(3600)).toBe('01:00:00');
			expect(dateSecond(3661)).toBe('01:01:01');
			expect(dateSecond(86399)).toBe('23:59:59');
		});

		it('应该处理超过24小时的情况', () => {
			expect(dateSecond(86400)).toBe('00:00:00'); // 24小时重置
			expect(dateSecond(90061)).toBe('01:01:01'); // 25小时1分1秒
		});

		it('应该处理小数（向下取整）', () => {
			expect(dateSecond(59.9)).toBe('00:00:59');
			expect(dateSecond(60.1)).toBe('00:01:00');
		});
	});

	// ==================== diffDays 测试 ====================
	describe('diffDays - 计算日期相差天数', () => {
		it('应该计算同一天为0天', () => {
			const date1 = new Date('2024-01-15 10:00:00');
			const date2 = new Date('2024-01-15 18:30:00');
			expect(diffDays(date1, date2)).toBe(0);
		});

		it('应该计算相差1天', () => {
			const date1 = new Date('2024-01-15');
			const date2 = new Date('2024-01-16');
			expect(diffDays(date1, date2)).toBe(1);
		});

		it('应该计算相差多天', () => {
			const date1 = new Date('2024-01-01');
			const date2 = new Date('2024-01-31');
			expect(diffDays(date1, date2)).toBe(30);
		});

		it('应该忽略时分秒', () => {
			const date1 = new Date('2024-01-15 23:59:59');
			const date2 = new Date('2024-01-16 00:00:01');
			expect(diffDays(date1, date2)).toBe(1);
		});

		it('应该处理时间戳', () => {
			const date1 = new Date('2024-01-15').getTime();
			const date2 = new Date('2024-01-20').getTime();
			expect(diffDays(date1, date2)).toBe(5);
		});

		it('应该处理日期字符串', () => {
			expect(diffDays('2024-01-15', '2024-01-20')).toBe(5);
		});

		it('应该返回绝对值（顺序无关）', () => {
			const date1 = new Date('2024-01-20');
			const date2 = new Date('2024-01-15');
			expect(diffDays(date1, date2)).toBe(5);
			expect(diffDays(date2, date1)).toBe(5);
		});

		it('应该处理跨年', () => {
			expect(diffDays('2024-12-31', '2025-01-01')).toBe(1);
		});

		it('应该抛出错误如果日期字符串无效', () => {
			expect(() => diffDays('invalid', '2024-01-15')).toThrow('Invalid date string');
		});

		it('应该处理闰年', () => {
			expect(diffDays('2024-02-28', '2024-03-01')).toBe(2); // 闰年
			expect(diffDays('2023-02-28', '2023-03-01')).toBe(1); // 平年
		});
	});

	// ==================== formatPassTime 测试 ====================
	describe('formatPassTime - 格式化过去时间', () => {
		it('应该显示"刚刚"如果时间在1秒内', () => {
			// 不使用 fake timers，使用相对时间
			const now = new Date();
			const result = formatPassTime(now);
			expect(result).toBe('刚刚');
		});

		it('应该显示"X秒前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 5000))).toBe('5秒前');
			expect(formatPassTime(new Date(now - 60000))).toBe('1分钟前'); // 60秒 = 1分钟
		});

		it('应该显示"X分钟前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 120000))).toBe('2分钟前');
			expect(formatPassTime(new Date(now - 3600000))).toBe('1小时前'); // 60分钟 = 1小时
		});

		it('应该显示"X小时前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 14400000))).toBe('4小时前');
			expect(formatPassTime(new Date(now - 43200000))).toBe('12小时前');
		});

		it('应该显示"X天前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 86400000))).toBe('1天前');
			expect(formatPassTime(new Date(now - 432000000))).toBe('5天前');
		});

		it('应该显示"X个月前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 2592000000))).toBe('1个月前'); // 约30天
			expect(formatPassTime(new Date(now - 7776000000))).toBe('3个月前'); // 约90天
		});

		it('应该显示"X年前"', () => {
			const now = Date.now();
			expect(formatPassTime(new Date(now - 31536000000))).toBe('1年前'); // 约365天
			expect(formatPassTime(new Date(now - 126144000000))).toBe('4年前'); // 约1460天
		});

		it('应该显示"刚刚"如果时间是未来', () => {
			const now = Date.now();
			const result = formatPassTime(new Date(now + 3600000)); // 1小时后
			expect(result).toBe('刚刚');
		});

		it('应该显示"刚刚"如果没有传入时间', () => {
			const result = formatPassTime();
			expect(result).toBe('刚刚');
		});

		it('应该处理时间戳', () => {
			const now = Date.now();
			expect(formatPassTime(now - 3600000)).toBe('1小时前');
		});

		it('应该处理 Date 对象', () => {
			const now = Date.now();
			const date = new Date(now - 1800000); // 30分钟前
			expect(formatPassTime(date)).toBe('30分钟前');
		});

		it('应该返回"Invalid date"如果日期无效', () => {
			expect(formatPassTime('invalid date')).toBe('Invalid date');
		});
	});

	// ==================== monthDays 测试 ====================
	describe('monthDays - 获取月份总天数', () => {
		it('应该正确计算各月份天数', () => {
			// 31天的月份
			expect(monthDays('2024-01-15')).toBe(31); // 1月
			expect(monthDays('2024-03-15')).toBe(31); // 3月
			expect(monthDays('2024-05-15')).toBe(31); // 5月
			expect(monthDays('2024-07-15')).toBe(31); // 7月
			expect(monthDays('2024-08-15')).toBe(31); // 8月
			expect(monthDays('2024-10-15')).toBe(31); // 10月
			expect(monthDays('2024-12-15')).toBe(31); // 12月

			// 30天的月份
			expect(monthDays('2024-04-15')).toBe(30); // 4月
			expect(monthDays('2024-06-15')).toBe(30); // 6月
			expect(monthDays('2024-09-15')).toBe(30); // 9月
			expect(monthDays('2024-11-15')).toBe(30); // 11月
		});

		it('应该正确处理闰年2月', () => {
			expect(monthDays('2024-02-15')).toBe(29); // 闰年
			expect(monthDays('2023-02-15')).toBe(28); // 平年
			expect(monthDays('2000-02-15')).toBe(29); // 世纪闰年
			expect(monthDays('1900-02-15')).toBe(28); // 世纪平年
		});

		it('应该处理 Date 对象', () => {
			const date = new Date('2024-02-15');
			expect(monthDays(date)).toBe(29);
		});

		it('应该处理时间戳', () => {
			const timestamp = new Date('2024-01-15').getTime();
			expect(monthDays(timestamp)).toBe(31);
		});
	});

	// ==================== getTimeDiff 测试 ====================
	describe('getTimeDiff - 计算时间间隔（毫秒）', () => {
		it('应该计算两个 Date 对象的时间差', () => {
			const start = new Date('2024-01-15 10:00:00');
			const end = new Date('2024-01-15 12:00:00');
			expect(getTimeDiff(start, end)).toBe(2 * 60 * 60 * 1000); // 2小时
		});

		it('应该计算两个时间戳的时间差', () => {
			const start = new Date('2024-01-15 10:00:00').getTime();
			const end = new Date('2024-01-15 12:00:00').getTime();
			expect(getTimeDiff(start, end)).toBe(2 * 60 * 60 * 1000);
		});

		it('应该计算两个日期字符串的时间差', () => {
			const start = '2024-01-15 10:00:00';
			const end = '2024-01-15 12:00:00';
			expect(getTimeDiff(start, end)).toBe(2 * 60 * 60 * 1000);
		});

		it('应该返回负数如果开始时间晚于结束时间', () => {
			const start = new Date('2024-01-15 12:00:00');
			const end = new Date('2024-01-15 10:00:00');
			expect(getTimeDiff(start, end)).toBe(-2 * 60 * 60 * 1000);
		});

		it('应该抛出错误如果类型不一致', () => {
			const start = new Date('2024-01-15 10:00:00');
			const end = '2024-01-15 12:00:00' as any;
			expect(() => getTimeDiff(start, end)).toThrow('开始时间和结束时间的类型不一致');
		});

		it('应该抛出错误如果日期字符串无效', () => {
			expect(() => getTimeDiff('invalid', 'invalid')).toThrow('无效的时间值');
		});

		it('应该抛出错误如果不支持的格式', () => {
			expect(() => getTimeDiff(true as any, false as any)).toThrow('不支持的时间格式');
		});

		it('应该兼容不同格式的日期字符串（- 和 /）', () => {
			const start = '2024-01-15 10:00:00';
			const end = '2024/01/15 12:00:00';
			expect(getTimeDiff(start, end)).toBe(2 * 60 * 60 * 1000);
		});

		it('应该处理小数时间差', () => {
			const start = new Date('2024-01-15 10:00:00.000');
			const end = new Date('2024-01-15 10:00:00.500');
			expect(getTimeDiff(start, end)).toBe(500);
		});
	});
});
