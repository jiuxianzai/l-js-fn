/**
 * Bug 修复验证测试
 * 验证所有修复的 bug 不会回归
 */

import { isEqual, isImage } from '@/libs/is-kit';
import { searchTextColor } from '@/libs/string-kit';
import { dateSecond } from '@/libs/date-kit';
import { imageToBase64 } from '@/libs/common';
import { urlDecode } from '@/encode';
import { loadScript } from '@/libs/common';

describe('Bug 修复验证', () => {

	// ==================== isEqual null 处理修复 ====================
	describe('isEqual - null 与对象比较不再抛异常', () => {
		it('isEqual(null, {}) 应该返回 false 而不抛异常', () => {
			expect(() => isEqual(null, {})).not.toThrow();
			expect(isEqual(null, {})).toBe(false);
		});

		it('isEqual({}, null) 应该返回 false 而不抛异常', () => {
			expect(() => isEqual({}, null)).not.toThrow();
			expect(isEqual({}, null)).toBe(false);
		});

		it('isEqual(null, []) 应该返回 false 而不抛异常', () => {
			expect(() => isEqual(null, [])).not.toThrow();
			expect(isEqual(null, [])).toBe(false);
		});

		it('isEqual([], null) 应该返回 false 而不抛异常', () => {
			expect(() => isEqual([], null)).not.toThrow();
			expect(isEqual([], null)).toBe(false);
		});

		it('isEqual(null, null) 应该返回 true', () => {
			expect(isEqual(null, null)).toBe(true);
		});
	});

	// ==================== isImage 格式统一修复 ====================
	describe('isImage - 扩展格式支持', () => {
		it('应该支持原有的常见格式', () => {
			expect(isImage('image.jpg')).toBe(true);
			expect(isImage('image.png')).toBe(true);
			expect(isImage('image.gif')).toBe(true);
			expect(isImage('image.svg')).toBe(true);
		});

		it('应该支持新增的格式', () => {
			expect(isImage('image.ico')).toBe(true);
			expect(isImage('image.tiff')).toBe(true);
			expect(isImage('image.heic')).toBe(true);
			expect(isImage('image.heif')).toBe(true);
			expect(isImage('image.psd')).toBe(true);
			expect(isImage('image.raw')).toBe(true);
		});

		it('应该正确处理大写扩展名', () => {
			expect(isImage('image.ICO')).toBe(true);
			expect(isImage('image.HEIC')).toBe(true);
		});
	});

	// ==================== searchTextColor 正则注入修复 ====================
	describe('searchTextColor - 正则特殊字符转义', () => {
		it('应该正确处理包含正则特殊字符的搜索词', () => {
			expect(() => searchTextColor('.*', 'hello world')).not.toThrow();
			expect(() => searchTextColor('(test)', 'hello (test) world')).not.toThrow();
			expect(() => searchTextColor('a+b', 'a+b=c')).not.toThrow();
			expect(() => searchTextColor('$100', 'price $100')).not.toThrow();
			expect(() => searchTextColor('[abc]', 'test [abc] value')).not.toThrow();
		});

		it('应该正确高亮包含特殊字符的文本', () => {
			const result = searchTextColor('.', 'a.b.c');
			// 应该只匹配真正的 "." 字符，不是任意字符
			expect(result).toContain("<span style='color: red'>.</span>");
		});

		it('不应该将正则特殊字符当作模式匹配', () => {
			const result = searchTextColor('.*', 'hello world');
			// 如果没有转义，".*" 会匹配整个字符串
			// 转义后，应该匹配不到 ".*" 字面量
			expect(result).toBe('hello world');
		});
	});

	// ==================== dateSecond 负数修复 ====================
	describe('dateSecond - 负数输入处理', () => {
		it('应该正确处理负数', () => {
			expect(dateSecond(-1)).toBe('00:00:01');
			expect(dateSecond(-59)).toBe('00:00:59');
			expect(dateSecond(-3661)).toBe('01:01:01');
		});

		it('正数行为不应改变', () => {
			expect(dateSecond(0)).toBe('00:00:00');
			expect(dateSecond(59)).toBe('00:00:59');
			expect(dateSecond(3661)).toBe('01:01:01');
		});
	});

	// ==================== imageToBase64 null 输入修复 ====================
	describe('imageToBase64 - null 输入处理', () => {
		it('应该返回失败的 Result 而不是 undefined', async () => {
			const result = await imageToBase64(null);
			expect(result).toBeDefined();
			expect(result.success).toBe(false);
			expect(result.message).toBe('输入不能为空');
		});
	});

	// ==================== urlDecode component 参数修复 ====================
	describe('urlDecode - component 参数支持', () => {
		it('默认应该使用 decodeURI', () => {
			// decodeURI 保留 : / ? # [ ] @ 等字符
			const encoded = encodeURI('hello world/foo?bar=baz');
			expect(urlDecode(encoded)).toBe('hello world/foo?bar=baz');
		});

		it('component=true 应该使用 decodeURIComponent', () => {
			// decodeURIComponent 解码更多字符
			const encoded = encodeURIComponent('hello world/foo?bar=baz');
			expect(urlDecode(encoded, { component: true })).toBe('hello world/foo?bar=baz');
		});
	});

	// ==================== loadScript 返回值修复 ====================
	describe('loadScript - 返回值一致性', () => {
		it('src 为空时应该返回 rejected Promise', async () => {
			await expect(loadScript(null)).rejects.toThrow('src 不能为空');
		});
	});
});
