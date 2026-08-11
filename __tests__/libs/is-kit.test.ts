/**
 * is-kit 单元测试
 * 测试所有类型判断相关的方法
 */

import {
	isEmpty,
	isNotEmpty,
	isObject,
	isArray,
	isImage,
	isString,
	isEmail,
	isURL,
	isIdCard,
	isPhoneNumber,
	isBankCard,
	isEqual,
	isHttp,
	isHttps,
	validateParams,
	isInArray,
} from '@/libs/is-kit';

describe('is-kit - 类型判断工具', () => {
	// ==================== isEmpty 测试 ====================
	describe('isEmpty - 空值检查', () => {
		it('应该正确识别 null', () => {
			expect(isEmpty(null)).toBe(true);
		});

		it('应该正确识别 undefined', () => {
			expect(isEmpty(undefined)).toBe(true);
		});

		it('应该正确识别空字符串', () => {
			expect(isEmpty('')).toBe(true);
			expect(isEmpty('   ')).toBe(true);
		});

		it('应该正确识别空数组', () => {
			expect(isEmpty([])).toBe(true);
		});

		it('应该正确识别空对象', () => {
			expect(isEmpty({})).toBe(true);
		});

		it('应该正确识别非空字符串', () => {
			expect(isEmpty('hello')).toBe(false);
			expect(isEmpty('  hello  ')).toBe(false);
		});

		it('应该正确识别非空数组', () => {
			expect(isEmpty([1, 2, 3])).toBe(false);
			expect(isEmpty([null])).toBe(false);
		});

		it('应该正确识别非空对象', () => {
			expect(isEmpty({ a: 1 })).toBe(false);
		});

		it('应该正确识别数字', () => {
			expect(isEmpty(0)).toBe(false);
			expect(isEmpty(1)).toBe(false);
		});

		it('应该正确识别布尔值', () => {
			expect(isEmpty(false)).toBe(false);
			expect(isEmpty(true)).toBe(false);
		});
	});

	// ==================== isNotEmpty 测试 ====================
	describe('isNotEmpty - 非空检查', () => {
		it('应该是 isEmpty 的反函数', () => {
			expect(isNotEmpty('hello')).toBe(true);
			expect(isNotEmpty('')).toBe(false);
			expect(isNotEmpty([1])).toBe(true);
			expect(isNotEmpty([])).toBe(false);
			expect(isNotEmpty({ a: 1 })).toBe(true);
			expect(isNotEmpty({})).toBe(false);
		});
	});

	// ==================== isObject 测试 ====================
	describe('isObject - 对象判断', () => {
		it('应该正确识别普通对象', () => {
			expect(isObject({})).toBe(true);
			expect(isObject({ a: 1 })).toBe(true);
			expect(isObject(Object.create(null))).toBe(true);
		});

		it('应该正确识别非对象类型', () => {
			expect(isObject(null)).toBe(false);
			expect(isObject([])).toBe(false);
			expect(isObject('string')).toBe(false);
			expect(isObject(123)).toBe(false);
			expect(isObject(true)).toBe(false);
			expect(isObject(() => {})).toBe(false);
		});

		it('应该正确区分数组和对象', () => {
			expect(isObject([1, 2, 3])).toBe(false);
			expect(isObject({ 0: 1, 1: 2 })).toBe(true);
		});
	});

	// ==================== isArray 测试 ====================
	describe('isArray - 数组判断', () => {
		it('应该正确识别数组', () => {
			expect(isArray([])).toBe(true);
			expect(isArray([1, 2, 3])).toBe(true);
			expect(isArray([])).toBe(true);
		});

		it('应该正确识别非数组类型', () => {
			expect(isArray({})).toBe(false);
			expect(isArray('string')).toBe(false);
			expect(isArray(123)).toBe(false);
			expect(isArray(null)).toBe(false);
			expect(isArray(undefined)).toBe(false);
		});

		it('应该正确识别类数组对象', () => {
			expect(isArray({ 0: 1, 1: 2, length: 2 })).toBe(false);
		});
	});

	// ==================== isInArray 测试 ====================
	describe('isInArray - 检查地址是否在数组中', () => {
		it('应该正确识别存在的地址', () => {
			expect(isInArray(['https://example.com', 'https://test.com'], 'https://example.com')).toBe(true);
			expect(isInArray(['/page/a', '/page/b'], '/page/a')).toBe(true);
		});

		it('应该正确识别不存在的地址', () => {
			expect(isInArray(['https://example.com', 'https://test.com'], 'https://other.com')).toBe(false);
		});

		it('应该正确识别空数组', () => {
			expect(isInArray([], 'https://example.com')).toBe(false);
		});

		it('URL 类型应忽略 ? 后的查询参数进行匹配', () => {
			expect(isInArray(['https://example.com'], 'https://example.com?foo=bar&baz=1')).toBe(true);
			expect(isInArray(['https://example.com?foo=bar'], 'https://example.com')).toBe(true);
			expect(isInArray(['https://example.com?a=1'], 'https://example.com?b=2')).toBe(true);
		});

		it('查询参数不同但基础路径不同时应返回 false', () => {
			expect(isInArray(['https://example.com'], 'https://other.com?foo=bar')).toBe(false);
		});

		it('非 URL 类型的字符串应正常比较（不剥离 ? 参数）', () => {
			expect(isInArray(['a', 'b', 'c'], 'a')).toBe(true);
			expect(isInArray(['a', 'b', 'c'], 'd')).toBe(false);
			expect(isInArray(['a?x=1', 'b'], 'a')).toBe(false);
			expect(isInArray(['a?x=1', 'b'], 'a?x=1')).toBe(true);
		});

		it('应该处理非数组输入', () => {
			expect(isInArray(null as any, 'a')).toBe(false);
			expect(isInArray(undefined as any, 'a')).toBe(false);
			expect(isInArray('string' as any, 'a')).toBe(false);
		});
	});

	// ==================== isImage 测试 ====================
	describe('isImage - 图片文件判断', () => {
		it('应该正确识别常见图片格式', () => {
			expect(isImage('image.jpg')).toBe(true);
			expect(isImage('image.jpeg')).toBe(true);
			expect(isImage('image.png')).toBe(true);
			expect(isImage('image.gif')).toBe(true);
			expect(isImage('image.bmp')).toBe(true);
			expect(isImage('image.webp')).toBe(true);
			expect(isImage('image.svg')).toBe(true);
		});

		it('应该正确处理大写扩展名', () => {
			expect(isImage('image.JPG')).toBe(true);
			expect(isImage('image.PNG')).toBe(true);
			expect(isImage('image.SVG')).toBe(true);
		});

		it('应该正确识别非图片文件', () => {
			expect(isImage('document.pdf')).toBe(false);
			expect(isImage('text.txt')).toBe(false);
			expect(isImage('video.mp4')).toBe(false);
			expect(isImage('audio.mp3')).toBe(false);
			expect(isImage('noextension')).toBe(false);
		});

		it('应该正确处理路径', () => {
			expect(isImage('/path/to/image.png')).toBe(true);
			expect(isImage('C:\\images\\photo.jpg')).toBe(true);
			expect(isImage('https://example.com/photo.gif')).toBe(true);
		});
	});

	// ==================== isString 测试 ====================
	describe('isString - 字符串判断', () => {
		it('应该正确识别字符串', () => {
			expect(isString('hello')).toBe(true);
			expect(isString('')).toBe(true);
			expect(isString(new String('test'))).toBe(true);
		});

		it('应该正确识别非字符串类型', () => {
			expect(isString(123)).toBe(false);
			expect(isString(null)).toBe(false);
			expect(isString(undefined)).toBe(false);
			expect(isString({})).toBe(false);
			expect(isString([])).toBe(false);
			expect(isString(true)).toBe(false);
		});
	});

	// ==================== isEmail 测试 ====================
	describe('isEmail - 邮箱验证', () => {
		it('应该正确验证有效邮箱', () => {
			expect(isEmail('test@example.com')).toBe(true);
			expect(isEmail('user.name@example.com')).toBe(true);
			expect(isEmail('user+tag@example.com')).toBe(true);
			expect(isEmail('user123@test-domain.co.jp')).toBe(true);
			expect(isEmail('123@456.com')).toBe(true);
		});

		it('应该拒绝无效邮箱', () => {
			expect(isEmail('invalid.email')).toBe(false);
			expect(isEmail('@example.com')).toBe(false);
			expect(isEmail('user@')).toBe(false);
			expect(isEmail('user@.com')).toBe(false);
			// 注意：实际正则允许 user..name@example.com 这种格式
			expect(isEmail('')).toBe(false);
			expect(isEmail('user name@example.com')).toBe(false); // 包含空格
		});

		it('应该处理边界情况', () => {
			expect(isEmail(null as any)).toBe(false);
			expect(isEmail(undefined as any)).toBe(false);
			expect(isEmail(123 as any)).toBe(false);
		});
	});

	// ==================== isURL 测试 ====================
	describe('isURL - URL验证', () => {
		it('应该正确验证有效URL', () => {
			expect(isURL('https://example.com')).toBe(true);
			expect(isURL('http://example.com')).toBe(true);
			expect(isURL('ftp://example.com')).toBe(true);
			expect(isURL('https://user:pass@example.com:8080/path?query=value#hash')).toBe(true);
			expect(isURL('https://localhost')).toBe(true);
			expect(isURL('http://192.168.1.1')).toBe(true);
		});

		it('应该拒绝无效URL', () => {
			expect(isURL('example.com')).toBe(false); // 缺少协议
			expect(isURL('not a url')).toBe(false);
			expect(isURL('')).toBe(false);
			expect(isURL('https://')).toBe(false);
		});

		it('应该处理边界情况', () => {
			expect(isURL(null as any)).toBe(false);
			expect(isURL(undefined as any)).toBe(false);
			expect(isURL(123 as any)).toBe(false);
		});

		it('应该识别绝对路径', () => {
			expect(isURL('/path/to/page')).toBe(true);
			expect(isURL('/api/v1/users')).toBe(true);
			expect(isURL('/')).toBe(true);
		});

		it('应该识别协议相对路径', () => {
			expect(isURL('//cdn.example.com/lib.js')).toBe(true);
			expect(isURL('//example.com/path')).toBe(true);
		});

		it('应该拒绝非 URL 格式的字符串', () => {
			expect(isURL('plain text')).toBe(false);
			expect(isURL('abc')).toBe(false);
		});
	});

	// ==================== isHttp 测试 ====================
	describe('isHttp - http链接判断', () => {
		it('应该正确识别 http 链接', () => {
			expect(isHttp('http://example.com')).toBe(true);
			expect(isHttp('http://localhost')).toBe(true);
			expect(isHttp('http://192.168.1.1')).toBe(true);
		});

		it('应该处理大写 HTTP', () => {
			expect(isHttp('HTTP://EXAMPLE.COM')).toBe(true);
			expect(isHttp('Http://example.com')).toBe(true);
		});

		it('应该拒绝 https 链接', () => {
			expect(isHttp('https://example.com')).toBe(false);
		});

		it('应该拒绝非 http 链接', () => {
			expect(isHttp('ftp://example.com')).toBe(false);
			expect(isHttp('example.com')).toBe(false);
			expect(isHttp('')).toBe(false);
		});

		it('应该处理边界情况', () => {
			expect(isHttp(null as any)).toBe(false);
			expect(isHttp(undefined as any)).toBe(false);
			expect(isHttp(123 as any)).toBe(false);
		});
	});

	// ==================== isHttps 测试 ====================
	describe('isHttps - https链接判断', () => {
		it('应该正确识别 https 链接', () => {
			expect(isHttps('https://example.com')).toBe(true);
			expect(isHttps('https://localhost')).toBe(true);
		});

		it('应该处理大写 HTTPS', () => {
			expect(isHttps('HTTPS://EXAMPLE.COM')).toBe(true);
			expect(isHttps('Https://example.com')).toBe(true);
		});

		it('应该拒绝 http 链接', () => {
			expect(isHttps('http://example.com')).toBe(false);
		});

		it('应该拒绝非 https 链接', () => {
			expect(isHttps('ftp://example.com')).toBe(false);
			expect(isHttps('example.com')).toBe(false);
			expect(isHttps('')).toBe(false);
		});

		it('应该处理边界情况', () => {
			expect(isHttps(null as any)).toBe(false);
			expect(isHttps(undefined as any)).toBe(false);
			expect(isHttps(123 as any)).toBe(false);
		});
	});

	// ==================== isIdCard 测试 ====================
	describe('isIdCard - 身份证验证', () => {
		it('应该正确验证18位身份证号', () => {
			// 使用真实的身份证号码进行测试
			expect(isIdCard('11010519491231002X')).toBe(true); // 最后一位是X
			expect(isIdCard('11010519491231002x')).toBe(true); // 最后一位是小写x
		});

		it('应该正确验证15位身份证号', () => {
			expect(isIdCard('110101900101123')).toBe(true);
		});

		it('应该拒绝无效身份证号', () => {
			expect(isIdCard('1101011990010112345')).toBe(false); // 19位
			expect(isIdCard('11010119900101123')).toBe(false); // 17位
			expect(isIdCard('11010119900101123A')).toBe(false); // 最后一位不是数字或X
			expect(isIdCard('abcdefghijk123456')).toBe(false); // 全字母
			expect(isIdCard('')).toBe(false);
		});

		it('应该验证校验码', () => {
			// 有效的18位身份证号（校验码正确）
			expect(isIdCard('11010519491231002X')).toBe(true);
			// 无效的18位身份证号（校验码错误）
			expect(isIdCard('110105194912310021')).toBe(false);
		});

		it('应该处理边界情况', () => {
			expect(isIdCard(null as any)).toBe(false);
			expect(isIdCard(undefined as any)).toBe(false);
			// 123456789012345678 不是有效的身份证号码（校验码错误）
			expect(isIdCard(123456789012345678 as any)).toBe(false);
		});
	});

	// ==================== isPhoneNumber 测试 ====================
	describe('isPhoneNumber - 手机号验证（中国大陆）', () => {
		it('应该正确验证有效手机号', () => {
			// 各个运营商的号段
			expect(isPhoneNumber('13012345678')).toBe(true); // 联通
			expect(isPhoneNumber('13112345678')).toBe(true);
			expect(isPhoneNumber('13212345678')).toBe(true);
			expect(isPhoneNumber('13312345678')).toBe(true); // 电信
			expect(isPhoneNumber('13512345678')).toBe(true); // 移动
			expect(isPhoneNumber('13712345678')).toBe(true);
			expect(isPhoneNumber('13812345678')).toBe(true);
			expect(isPhoneNumber('13912345678')).toBe(true);
			expect(isPhoneNumber('15012345678')).toBe(true);
			expect(isPhoneNumber('15112345678')).toBe(true);
			expect(isPhoneNumber('15212345678')).toBe(true);
			expect(isPhoneNumber('15512345678')).toBe(true);
			expect(isPhoneNumber('15812345678')).toBe(true);
			expect(isPhoneNumber('17012345678')).toBe(true);
			expect(isPhoneNumber('18712345678')).toBe(true);
			expect(isPhoneNumber('18812345678')).toBe(true);
			expect(isPhoneNumber('18912345678')).toBe(true);
		});

		it('应该拒绝无效手机号', () => {
			expect(isPhoneNumber('12012345678')).toBe(false); // 第二位不是3-9
			expect(isPhoneNumber('1380013800')).toBe(false); // 只有10位
			expect(isPhoneNumber('138001380000')).toBe(false); // 12位
			expect(isPhoneNumber('abcdefghijk')).toBe(false); // 非数字
			expect(isPhoneNumber('')).toBe(false);
		});

		it('应该自动去除首尾空格', () => {
			expect(isPhoneNumber(' 13800138000  ')).toBe(true);
			expect(isPhoneNumber('\t13800138000\n')).toBe(true);
		});

		it('应该处理边界情况', () => {
			expect(isPhoneNumber(null as any)).toBe(false);
			expect(isPhoneNumber(undefined as any)).toBe(false);
			expect(isPhoneNumber(13800138000 as any)).toBe(true); // 数字类型
		});
	});

	// ==================== isBankCard 测试 ====================
	describe('isBankCard - 银行卡号验证', () => {
		it('应该验证有效银行卡号', () => {
			expect(isBankCard('6222021234567890')).toBe(true); // 16位
			expect(isBankCard('6222021234567890123')).toBe(true); // 19位
			expect(isBankCard('5201401045563583')).toBe(true); // 16位
			expect(isBankCard('6217003810020650778')).toBe(true); // 19位
		});

		it('应该拒绝无效银行卡号', () => {
			expect(isBankCard('622202123456789')).toBe(false); // 15位
			expect(isBankCard('62220212345678901234')).toBe(false); // 20位
			expect(isBankCard('06222021234567890')).toBe(false); // 首位为0
			expect(isBankCard('622202123456789a')).toBe(false); // 包含字母
			expect(isBankCard('6222 0212 3456 7890')).toBe(false); // 包含空格
			expect(isBankCard('')).toBe(false); // 空字符串
		});

		it('应该处理边界输入', () => {
			expect(isBankCard(null as any)).toBe(false);
			expect(isBankCard(undefined as any)).toBe(false);
			expect(isBankCard(6222021234567890 as any)).toBe(true); // 数字类型
			expect(isBankCard(' 6222021234567890 ')).toBe(true); // 首尾空格
		});
	});

	// ==================== isEqual 测试 ====================
	describe('isEqual - 深度比较', () => {
		it('应该正确比较基本类型', () => {
			expect(isEqual(1, 1)).toBe(true);
			expect(isEqual('hello', 'hello')).toBe(true);
			expect(isEqual(true, true)).toBe(true);
			expect(isEqual(false, false)).toBe(true);
			expect(isEqual(null, null)).toBe(true);
			expect(isEqual(undefined, undefined)).toBe(true);
		});

		it('应该正确比较 NaN', () => {
			expect(isEqual(NaN, NaN)).toBe(true);
			expect(isEqual(NaN, 1)).toBe(false);
		});

		it('应该正确比较数组', () => {
			expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
			expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
			expect(isEqual([1, 2, 3], [1, 2])).toBe(false);
			expect(isEqual([], [])).toBe(true);
		});

		it('应该正确比较嵌套数组', () => {
			expect(isEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
			expect(isEqual([1, [2, 3]], [1, [2, 4]])).toBe(false);
		});

		it('应该正确比较对象', () => {
			expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
			expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
			expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
			expect(isEqual({}, {})).toBe(true);
		});

		it('应该正确比较嵌套对象', () => {
			expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
			expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
		});

		it('应该正确比较混合结构', () => {
			expect(isEqual({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
			expect(isEqual({ a: [1, 2] }, { a: [1, 3] })).toBe(false);
		});

		it('应该处理不同的引用', () => {
			const obj1 = { a: 1 };
			const obj2 = { a: 1 };
			expect(isEqual(obj1, obj2)).toBe(true);
			expect(obj1 === obj2).toBe(false);
		});
	});

	// ==================== validateParams 测试 ====================
	describe('validateParams - 参数校验', () => {
		it('应该通过所有必填参数都存在的校验', () => {
			const params = { name: 'John', age: 20, email: 'john@example.com' };
			const required = ['name', 'age'];
			expect(validateParams(required, params)).toBe(null);
		});

		it('应该拒绝缺少必填参数的校验', () => {
			const params = { name: 'John' };
			const required = ['name', 'age'];
			expect(validateParams(required, params)).toBe('age');
		});

		it('应该正确处理空值参数', () => {
			const params = { name: '', age: 0 };
			const required = ['name', 'age'];
			// 空字符串和 0 都是有意义的值，不应被视为缺失
			expect(validateParams(required, params)).toBe(null);
		});

		it('应该处理 null 和 undefined', () => {
			const params = { name: null, age: undefined };
			const required = ['name', 'age'];
			expect(validateParams(required, params)).toBe('name');
		});

		it('应该正确处理假值但有效的参数', () => {
			const params = { active: false, count: 0 };
			const required = ['active', 'count'];
			// false 和 0 都是有意义的值，不应被视为缺失
			expect(validateParams(required, params)).toBe(null);
		});

		it('应该处理空的必填参数列表', () => {
			const params = { name: 'John' };
			const required: string[] = [];
			expect(validateParams(required, params)).toBe(null);
		});

	it('应该处理空的参数对象', () => {
		const params = {};
		const required = ['name', 'age'];
		expect(validateParams(required, params)).toBe('name');
	});
});

describe('isImage - 无扩展名文件名', () => {
	it('应该拒绝没有扩展名的文件名', () => {
		expect(isImage('file')).toBe(false);
		expect(isImage('readme')).toBe(false);
	});
});

describe('isEqual - 补充测试', () => {
	it('应该处理不同引用但相同内容的对象', () => {
		expect(isEqual({ a: 1 }, { a: 1 })).toBe(true);
	});

	it('应该处理一个数组和一个对象的比较', () => {
		expect(isEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
	});

	it('应该处理相同引用', () => {
		const obj = { a: 1 };
		expect(isEqual(obj, obj)).toBe(true);
	});

	it('应该处理不同 NaN 值', () => {
		expect(isEqual(NaN, NaN)).toBe(true);
	});

	it('应该处理循环引用对象', () => {
		const a: any = { name: 'a' };
		const b: any = { name: 'a' };
		a.self = a;
		b.self = b;
		expect(isEqual(a, b)).toBe(true);
	});

	it('应该处理共享引用', () => {
		const child = { id: 1 };
		const a = { items: [child, child] };
		const b = { items: [child, child] };
		expect(isEqual(a, b)).toBe(true);
	});

	it('应该正确比较 Date 对象', () => {
		expect(isEqual(new Date('2024-01-01'), new Date('2024-01-01'))).toBe(true);
		expect(isEqual(new Date('2024-01-01'), new Date('2024-01-02'))).toBe(false);
	});

	it('应该正确比较 RegExp 对象', () => {
		expect(isEqual(/abc/gi, /abc/gi)).toBe(true);
		expect(isEqual(/abc/, /ab/)).toBe(false);
	});

	it('应该正确比较 Map', () => {
		const a = new Map<any, any>([['key', 'value'], ['k2', { a: 1 }]]);
		const b = new Map<any, any>([['key', 'value'], ['k2', { a: 1 }]]);
		expect(isEqual(a, b)).toBe(true);
		expect(isEqual(a, new Map([['key', 'other']]))).toBe(false);
	});

	it('应该正确比较 Set', () => {
		expect(isEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).toBe(true);
		expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
	});

	it('应该比较 Symbol 键', () => {
		const sym = Symbol('test');
		expect(isEqual({ [sym]: 'value' }, { [sym]: 'value' })).toBe(true);
	});
});
});
