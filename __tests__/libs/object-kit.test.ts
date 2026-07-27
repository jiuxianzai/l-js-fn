/**
 * object-kit 单元测试
 * 测试所有对象操作相关的方法
 */

import {
	objMerge,
	objFilterProp,
	objFilterNull,
	isHasProperties,
	jsonToFormData,
	formDataToObject,
	pick,
	get,
	deepMerge,
} from '@/libs/object-kit';

describe('object-kit - 对象操作工具', () => {
	// ==================== objMerge 测试 ====================
	describe('objMerge - 对象合并', () => {
		it('应该合并两个简单对象', () => {
			const target = { a: 1, b: 2 };
			const source = { c: 3, d: 4 };
			const result = objMerge(target, source);
			expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
		});

		it('source 的属性应该覆盖 target 的同名属性', () => {
			const target = { a: 1, b: 2 };
			const source = { b: 3, c: 4 };
			const result = objMerge(target, source);
			expect(result).toEqual({ a: 1, b: 3, c: 4 });
		});

		it('应该递归合并嵌套对象', () => {
			const target = { a: { x: 1, y: 2 } };
			const source = { a: { y: 3, z: 4 } };
			const result = objMerge(target, source);
			expect(result).toEqual({ a: { x: 1, y: 3, z: 4 } });
		});

		it('应该直接复制数组', () => {
			const target = { arr: [1, 2] };
			const source = { arr: [3, 4] };
			const result = objMerge(target, source);
			expect(result).toEqual({ arr: [3, 4] });
		});

		it('应该修改 target 对象（硬合并）', () => {
			const target = { a: 1 };
			const source = { b: 2 };
			const result = objMerge(target, source, 'hard');
			expect(result).toBe(target);
		});

		it('软合并时应该只保留 target 的属性', () => {
			const target = { a: 1 };
			const source = { b: 2 };
			const result = objMerge(target, source, 'soft');
			expect(result).toEqual({ a: 1 });
		});

		it('软合并时应该更新 target 中存在的属性', () => {
			const target = { a: 1, b: 2 };
			const source = { b: 3, c: 4 };
			const result = objMerge(target, source, 'soft');
			expect(result).toEqual({ a: 1, b: 3 });
		});

		it('应该处理 null target', () => {
			const result = objMerge(null as any, { a: 1 });
			expect(result).toEqual({ a: 1 });
		});

		it('应该处理数组 source', () => {
			const result = objMerge({ a: 1 }, [2, 3, 4] as any);
			expect(result).toEqual([2, 3, 4]);
		});
	});

	// ==================== objFilterProp 测试 ====================
	describe('objFilterProp - 过滤对象属性', () => {
		it('应该过滤指定的属性', () => {
			const obj = { a: 1, b: 2, c: 3, d: 4 };
			const result = objFilterProp(obj, ['b', 'd']);
			expect(result).toEqual({ a: 1, c: 3 });
		});

		it('应该返回新对象', () => {
			const obj = { a: 1, b: 2 };
			const result = objFilterProp(obj, ['b']);
			expect(result).not.toBe(obj);
			expect(obj).toEqual({ a: 1, b: 2 });
		});

		it('应该处理空数组（不过滤任何属性）', () => {
			const obj = { a: 1, b: 2 };
			const result = objFilterProp(obj, []);
			expect(result).toEqual({ a: 1, b: 2 });
		});

		it('应该过滤所有属性', () => {
			const obj = { a: 1, b: 2 };
			const result = objFilterProp(obj, ['a', 'b']);
			expect(result).toEqual({});
		});

		it('应该处理不存在的属性键', () => {
			const obj = { a: 1, b: 2 };
			const result = objFilterProp(obj, ['b', 'c', 'd'] as any);
			expect(result).toEqual({ a: 1 });
		});

		it('应该保留类型信息', () => {
			interface TestObj {
				a: number;
				b: string;
				c: boolean;
			}
			const obj: TestObj = { a: 1, b: 'test', c: true };
			const result = objFilterProp(obj, ['b']);
			expect(result).toEqual({ a: 1, c: true });
		});
	});

	// ==================== objFilterNull 测试 ====================
	describe('objFilterNull - 过滤空值', () => {
		it('应该过滤 null 值', () => {
			const obj = { a: 1, b: null, c: 3 };
			const result = objFilterNull(obj);
			expect(result).toEqual({ a: 1, c: 3 });
		});

		it('应该过滤 undefined 值', () => {
			const obj = { a: 1, b: undefined, c: 3 };
			const result = objFilterNull(obj);
			expect(result).toEqual({ a: 1, c: 3 });
		});

		it('应该同时过滤 null 和 undefined', () => {
			const obj = { a: 1, b: null, c: undefined, d: 4 };
			const result = objFilterNull(obj);
			expect(result).toEqual({ a: 1, d: 4 });
		});

		it('应该保留 0 和 false', () => {
			const obj = { a: 0, b: false, c: '', d: null };
			const result = objFilterNull(obj);
			expect(result).toEqual({ a: 0, b: false, c: '' });
		});

		it('应该返回新对象', () => {
			const obj = { a: 1, b: null };
			const result = objFilterNull(obj);
			expect(result).not.toBe(obj);
		});

		it('应该处理空对象', () => {
			const result = objFilterNull({});
			expect(result).toEqual({});
		});

		it('应该处理全是空值的对象', () => {
			const obj = { a: null, b: undefined, c: null };
			const result = objFilterNull(obj);
			expect(result).toEqual({});
		});
	});

	// ==================== isHasProperties 测试 ====================
	describe('isHasProperties - 检查对象属性', () => {
		it('应该返回 true 对于对象自身的属性', () => {
			const obj = { a: 1, b: 2 };
			expect(isHasProperties(obj, 'a')).toBe(true);
			expect(isHasProperties(obj, 'b')).toBe(true);
		});

		it('应该返回 false 对于不存在的属性', () => {
			const obj = { a: 1 };
			expect(isHasProperties(obj, 'b')).toBe(false);
		});

		it('应该不检查继承的属性', () => {
			const obj = Object.create({ inherited: 'value' });
			obj.own = 'value';
			expect(isHasProperties(obj, 'own')).toBe(true);
			expect(isHasProperties(obj, 'inherited')).toBe(false);
		});

		it('应该处理 toString 等继承方法', () => {
			const obj = {};
			expect(isHasProperties(obj, 'toString')).toBe(false);
		});

		it('应该处理 null 和 undefined', () => {
			expect(isHasProperties({} as any, 'a')).toBe(false);
		});
	});

	// ==================== jsonToFormData 测试 ====================
	describe('jsonToFormData - JSON 转 FormData', () => {
		it('应该转换简单对象', () => {
			const data = { name: 'John', age: '30' };
			const formData = jsonToFormData(data);
			expect(formData.get('name')).toBe('John');
			expect(formData.get('age')).toBe('30');
		});

		it('应该转换嵌套对象', () => {
			const data = { user: { name: 'John', age: '30' } };
			const formData = jsonToFormData(data);
			expect(formData.get('user[name]')).toBe('John');
			expect(formData.get('user[age]')).toBe('30');
		});

		it('应该转换数组', () => {
			const data = { tags: ['javascript', 'typescript'] };
			const formData = jsonToFormData(data);
			expect(formData.get('tags[0]')).toBe('javascript');
			expect(formData.get('tags[1]')).toBe('typescript');
		});

		it('应该转换嵌套数组中的对象', () => {
			const data = { users: [{ name: 'John' }, { name: 'Jane' }] };
			const formData = jsonToFormData(data);
			expect(formData.get('users[0][name]')).toBe('John');
			expect(formData.get('users[1][name]')).toBe('Jane');
		});

		it('应该忽略 null 和 undefined 值', () => {
			const data = { a: 1, b: null, c: undefined };
			const formData = jsonToFormData(data);
			expect(formData.get('a')).toBe('1');
			expect(formData.get('b')).toBeNull();
			expect(formData.get('c')).toBeNull();
		});

		it('应该转换 Date 对象为 ISO 字符串', () => {
			const date = new Date('2024-01-01');
			const data = { date };
			const formData = jsonToFormData(data);
			expect(formData.get('date')).toBe(date.toISOString());
		});

		it('应该处理 File 对象', () => {
			const file = new File(['content'], 'test.txt', { type: 'text/plain' });
			const data = { file };
			const formData = jsonToFormData(data);
			expect(formData.get('file')).toBe(file);
		});

		it('应该处理 Blob 对象', () => {
			const blob = new Blob(['content'], { type: 'text/plain' });
			const data = { blob: blob as any };
			const formData = jsonToFormData(data);
			// Blob 对象应该被正确添加到 FormData
			expect(formData.get('blob') instanceof Blob).toBe(true);
		});

		it('应该追加到已有的 FormData', () => {
			const existingFormData = new FormData();
			existingFormData.append('existing', 'value');
			const data = { new: 'data' };
			const result = jsonToFormData(data, existingFormData);
			expect(result.get('existing')).toBe('value');
			expect(result.get('new')).toBe('data');
		});

		it('应该抛出错误如果 data 不是对象', () => {
			expect(() => jsonToFormData('not object' as any)).toThrow(TypeError);
		});
	});

	// ==================== formDataToObject 测试 ====================
	describe('formDataToObject - FormData 转 JSON', () => {
		it('应该转换简单的 FormData', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			formData.append('age', '30');
			const result = formDataToObject(formData);
			expect(result).toEqual({ name: 'John', age: 30 });
		});

		it('应该将数字字符串转换为数字', () => {
			const formData = new FormData();
			formData.append('count', '123');
			const result = formDataToObject(formData);
			expect(result).toEqual({ count: 123 });
		});

		it('应该保留非数字字符串', () => {
			const formData = new FormData();
			formData.append('name', 'John');
			const result = formDataToObject(formData);
			expect(result).toEqual({ name: 'John' });
		});

		it('应该处理多个值（只保留最后一个）', () => {
			const formData = new FormData();
			formData.append('tags', 'javascript');
			formData.append('tags', 'typescript');
			const result = formDataToObject(formData);
			expect(result).toEqual({ tags: 'typescript' });
		});

		it('应该处理空 FormData', () => {
			const formData = new FormData();
			const result = formDataToObject(formData);
			expect(result).toEqual({});
		});
	});

	// ==================== pick 测试 ====================
	describe('pick - 选取对象属性', () => {
		it('应该选取指定属性', () => {
			expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
		});

		it('应该忽略不存在的属性', () => {
			expect(pick({ a: 1 }, ['a', 'b'] as any)).toEqual({ a: 1 });
		});

		it('应该处理空 keys', () => {
			expect(pick({ a: 1 }, [])).toEqual({});
		});
	});

	// ==================== get 测试 ====================
	describe('get - 安全深层取值', () => {
		const obj = { a: { b: { c: 1 } } };

		it('应该获取深层值', () => {
			expect(get(obj, 'a.b.c')).toBe(1);
		});

		it('应该在路径不存在时返回默认值', () => {
			expect(get(obj, 'a.b.d', 'default')).toBe('default');
		});

		it('应该处理数组索引', () => {
			expect(get({ list: [1, 2, 3] }, 'list[1]')).toBe(2);
		});

		it('应该处理 null 输入', () => {
			expect(get(null, 'a.b', 'default')).toBe('default');
		});
	});

	// ==================== deepMerge 测试 ====================
	describe('deepMerge - 深度合并', () => {
		it('应该深度合并对象', () => {
			const result = deepMerge({ a: { b: 1 } }, { a: { c: 2 } });
			expect(result).toEqual({ a: { b: 1, c: 2 } });
		});

		it('应该合并多个对象', () => {
			const result = deepMerge({ a: 1 }, { b: 2 }, { c: 3 });
			expect(result).toEqual({ a: 1, b: 2, c: 3 });
		});

		it('应该覆盖相同的值', () => {
			const result = deepMerge({ a: 1 }, { a: 2 });
			expect(result).toEqual({ a: 2 });
		});

		it('应该处理空对象', () => {
			const result = deepMerge({ a: 1 }, {}, { b: 2 });
			expect(result).toEqual({ a: 1, b: 2 });
		});
	});
});
