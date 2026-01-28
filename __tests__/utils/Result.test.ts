/**
 * Result 单元测试
 * 测试结果封装类
 */

import { Result } from '@/utils/Result';

describe('Result - 结果封装类', () => {
	// ==================== ok 测试 ====================
	describe('ok - 创建成功结果', () => {
		it('应该创建成功的 Result 对象', () => {
			const result = Result.ok('test data');
			expect(result.success).toBe(true);
			expect(result.message).toBe('操作成功');
			expect(result.data).toBe('test data');
		});

		it('应该使用自定义消息', () => {
			const result = Result.ok('data', '自定义成功消息');
			expect(result.success).toBe(true);
			expect(result.message).toBe('自定义成功消息');
			expect(result.data).toBe('data');
		});

		it('应该支持没有数据的成功结果', () => {
			const result = Result.ok();
			expect(result.success).toBe(true);
			expect(result.message).toBe('操作成功');
			expect(result.data).toBe(undefined);
		});

		it('应该支持只有消息没有数据', () => {
			const result = Result.ok(undefined, '只有消息');
			expect(result.success).toBe(true);
			expect(result.message).toBe('只有消息');
		});

		it('应该支持各种数据类型', () => {
			const stringResult = Result.ok('string');
			expect(stringResult.data).toBe('string');

			const numberResult = Result.ok(123);
			expect(numberResult.data).toBe(123);

			const boolResult = Result.ok(true);
			expect(boolResult.data).toBe(true);

			const objectResult = Result.ok({ key: 'value' });
			expect(objectResult.data).toEqual({ key: 'value' });

			const arrayResult = Result.ok([1, 2, 3]);
			expect(arrayResult.data).toEqual([1, 2, 3]);

			const nullResult = Result.ok(null);
			expect(nullResult.data).toBe(null);
		});
	});

	// ==================== fail 测试 ====================
	describe('fail - 创建失败结果', () => {
		it('应该创建失败的 Result 对象', () => {
			const result = Result.fail('操作失败了');
			expect(result.success).toBe(false);
			expect(result.message).toBe('操作失败了');
			expect(result.data).toBe(undefined);
		});

		it('应该使用默认消息', () => {
			const result = Result.fail();
			expect(result.success).toBe(false);
			expect(result.message).toBe('操作失败');
		});

		it('应该支持带有数据的失败结果', () => {
			const result = Result.fail('出错了', { errorCode: 500 });
			expect(result.success).toBe(false);
			expect(result.message).toBe('出错了');
			expect(result.data).toEqual({ errorCode: 500 });
		});

		it('应该支持各种数据类型作为失败数据', () => {
			const stringData = Result.fail('error', 'string data');
			expect(stringData.data).toBe('string data');

			const numberData = Result.fail('error', 404);
			expect(numberData.data).toBe(404);

			const objectData = Result.fail('error', { code: 'ERR_001' });
			expect(objectData.data).toEqual({ code: 'ERR_001' });
		});

		it('应该只有消息没有数据', () => {
			const result = Result.fail('只有错误消息');
			expect(result.success).toBe(false);
			expect(result.message).toBe('只有错误消息');
			expect(result.data).toBe(undefined);
		});
	});

	// ==================== 类型推断测试 ====================
	describe('类型推断 - TypeScript 泛型支持', () => {
		interface UserData {
			id: number;
			name: string;
		}

		it('应该正确推断成功结果的泛型类型', () => {
			const userData: UserData = { id: 1, name: 'John' };
			const result = Result.ok(userData);

			// TypeScript 应该能推断出 result.data 是 UserData 类型
			expect(result.data?.id).toBe(1);
			expect(result.data?.name).toBe('John');
		});

		it('应该正确推断失败结果的泛型类型', () => {
			interface ErrorInfo {
				code: string;
				timestamp: number;
			}
			const errorInfo: ErrorInfo = { code: 'E001', timestamp: Date.now() };
			const result = Result.fail('出错了', errorInfo);

			expect(result.data?.code).toBe('E001');
			expect(typeof result.data?.timestamp).toBe('number');
		});
	});

	// ==================== 实际使用场景测试 ====================
	describe('实际使用场景', () => {
		it('应该在 API 响应中使用', () => {
			// 模拟成功响应
			const successResponse = Result.ok({ userId: 123, userName: 'Alice' }, '获取用户成功');
			expect(successResponse.success).toBe(true);

			// 模拟失败响应
			const failResponse = Result.fail('用户不存在', { code: 'USER_NOT_FOUND' });
			expect(failResponse.success).toBe(false);
		});

		it('应该在条件判断中使用', () => {
			const isValid = true;
			const result = isValid ? Result.ok('valid') : Result.fail('invalid');

			if (result.success) {
				expect(result.data).toBe('valid');
			} else {
				// 这个分支不会执行
				expect(true).toBe(false);
			}
		});

		it('应该支持链式操作模式', () => {
			const results: Result[] = [
				Result.ok('step1', '步骤1完成'),
				Result.ok('step2', '步骤2完成'),
				Result.fail('步骤3失败'),
			];

			expect(results[0].success).toBe(true);
			expect(results[1].success).toBe(true);
			expect(results[2].success).toBe(false);
		});
	});
});
