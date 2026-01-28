/**
 * config 单元测试
 * 测试配置常量
 */

import { DATE_FORMAT, HTTP_STATUS } from '@/config';

describe('config - 配置常量', () => {
	// ==================== DATE_FORMAT 测试 ====================
	describe('DATE_FORMAT - 日期格式常量', () => {
		it('应该导出完整的日期格式', () => {
			expect(DATE_FORMAT.FULL).toBe('yyyy-MM-dd HH:mm:ss');
			expect(DATE_FORMAT.FULL).toBeDefined();
			expect(typeof DATE_FORMAT.FULL).toBe('string');
		});

		it('应该导出日期部分格式', () => {
			expect(DATE_FORMAT.DATE).toBe('yyyy-MM-dd');
			expect(DATE_FORMAT.DATE).toBeDefined();
		});

		it('应该导出时间部分格式', () => {
			expect(DATE_FORMAT.TIME).toBe('HH:mm:ss');
			expect(DATE_FORMAT.TIME).toBeDefined();
		});

		it('应该导出短日期格式', () => {
			expect(DATE_FORMAT.SHORT).toBe('MM-dd');
			expect(DATE_FORMAT.SHORT).toBeDefined();
		});

		it('应该导出年月格式', () => {
			expect(DATE_FORMAT.YEAR_MONTH).toBe('yyyy-MM');
			expect(DATE_FORMAT.YEAR_MONTH).toBeDefined();
		});

		it('应该是只读常量（as const）', () => {
			// as const 确保类型为具体的字面量类型
			type DateFormatType = typeof DATE_FORMAT;
			// TypeScript 应该推断出具体的字面量类型
			const format: DateFormatType['FULL'] = 'yyyy-MM-dd HH:mm:ss';
			expect(format).toBe(DATE_FORMAT.FULL);
		});

		it('应该包含所有预期的日期格式', () => {
			const formats = Object.keys(DATE_FORMAT);
			expect(formats).toContain('FULL');
			expect(formats).toContain('DATE');
			expect(formats).toContain('TIME');
			expect(formats).toContain('SHORT');
			expect(formats).toContain('YEAR_MONTH');
			expect(formats.length).toBe(5);
		});

		it('日期格式值应该是唯一的', () => {
			const values = Object.values(DATE_FORMAT);
			const uniqueValues = new Set(values);
			expect(uniqueValues.size).toBe(values.length);
		});
	});

	// ==================== HTTP_STATUS 测试 ====================
	describe('HTTP_STATUS - HTTP状态码常量', () => {
		it('应该导出 200 OK 状态码', () => {
			expect(HTTP_STATUS.OK).toBe(200);
			expect(HTTP_STATUS.OK).toBeDefined();
			expect(typeof HTTP_STATUS.OK).toBe('number');
		});

		it('应该导出 401 UNAUTHORIZED 状态码', () => {
			expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
			expect(HTTP_STATUS.UNAUTHORIZED).toBeDefined();
		});

		it('应该导出 403 FORBIDDEN 状态码', () => {
			expect(HTTP_STATUS.FORBIDDEN).toBe(403);
			expect(HTTP_STATUS.FORBIDDEN).toBeDefined();
		});

		it('应该导出 404 NOT_FOUND 状态码', () => {
			expect(HTTP_STATUS.NOT_FOUND).toBe(404);
			expect(HTTP_STATUS.NOT_FOUND).toBeDefined();
		});

		it('应该导出 500 SERVER_ERROR 状态码', () => {
			expect(HTTP_STATUS.SERVER_ERROR).toBe(500);
			expect(HTTP_STATUS.SERVER_ERROR).toBeDefined();
		});

		it('应该导出 503 SERVER_UNAVAILABLE 状态码', () => {
			expect(HTTP_STATUS.SERVER_UNAVAILABLE).toBe(503);
			expect(HTTP_STATUS.SERVER_UNAVAILABLE).toBeDefined();
		});

		it('应该包含所有预期的状态码', () => {
			const statusKeys = Object.keys(HTTP_STATUS);
			expect(statusKeys).toContain('OK');
			expect(statusKeys).toContain('UNAUTHORIZED');
			expect(statusKeys).toContain('FORBIDDEN');
			expect(statusKeys).toContain('NOT_FOUND');
			expect(statusKeys).toContain('SERVER_ERROR');
			expect(statusKeys).toContain('SERVER_UNAVAILABLE');
			expect(statusKeys.length).toBe(6);
		});

		it('状态码应该是正确的 HTTP 标准值', () => {
			expect(HTTP_STATUS.OK).toBeGreaterThanOrEqual(200);
			expect(HTTP_STATUS.OK).toBeLessThan(300);

			expect(HTTP_STATUS.UNAUTHORIZED).toBeGreaterThanOrEqual(400);
			expect(HTTP_STATUS.UNAUTHORIZED).toBeLessThan(500);

			expect(HTTP_STATUS.FORBIDDEN).toBeGreaterThanOrEqual(400);
			expect(HTTP_STATUS.FORBIDDEN).toBeLessThan(500);

			expect(HTTP_STATUS.NOT_FOUND).toBeGreaterThanOrEqual(400);
			expect(HTTP_STATUS.NOT_FOUND).toBeLessThan(500);

			expect(HTTP_STATUS.SERVER_ERROR).toBeGreaterThanOrEqual(500);
			expect(HTTP_STATUS.SERVER_ERROR).toBeLessThan(600);

			expect(HTTP_STATUS.SERVER_UNAVAILABLE).toBeGreaterThanOrEqual(500);
			expect(HTTP_STATUS.SERVER_UNAVAILABLE).toBeLessThan(600);
		});

		it('状态码值应该是唯一的', () => {
			const values = Object.values(HTTP_STATUS);
			const uniqueValues = new Set(values);
			expect(uniqueValues.size).toBe(values.length);
		});

		it('应该是只读常量（as const）', () => {
			// as const 确保类型为具体的字面量类型
			type HttpStatusType = typeof HTTP_STATUS;
			// TypeScript 应该推断出具体的字面量类型
			const status: HttpStatusType['OK'] = 200;
			expect(status).toBe(HTTP_STATUS.OK);
		});
	});

	// ==================== 实际使用场景测试 ====================
	describe('实际使用场景', () => {
		it('应该在日期格式化中使用 DATE_FORMAT', () => {
			// 模拟使用场景
			const formatType = 'FULL';
			const format = DATE_FORMAT[formatType as keyof typeof DATE_FORMAT];
			expect(format).toBe('yyyy-MM-dd HH:mm:ss');
		});

		it('应该在 HTTP 响应处理中使用 HTTP_STATUS', () => {
			// 模拟使用场景
			const responseCode: number = 404;
			const isNotFound = responseCode === HTTP_STATUS.NOT_FOUND;
			expect(isNotFound).toBe(true);

			const isOk = responseCode === HTTP_STATUS.OK;
			expect(isOk).toBe(false);
		});

		it('应该支持常量的解构使用', () => {
			const { FULL, SHORT } = DATE_FORMAT;
			expect(FULL).toBe('yyyy-MM-dd HH:mm:ss');
			expect(SHORT).toBe('MM-dd');

			const { OK, NOT_FOUND } = HTTP_STATUS;
			expect(OK).toBe(200);
			expect(NOT_FOUND).toBe(404);
		});
	});
});
