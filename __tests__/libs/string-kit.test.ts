/**
 * string-kit 单元测试
 * 测试所有字符串处理相关的方法
 */

import {
	desensitization,
	desensitizeName,
	trim,
	getMobile,
	getUuid,
	indexToLabel,
	searchTextColor,
	filterSpace,
	toPascalCase,
	toCamelCase,
	toKebabCase,
	capitalize,
} from '@/libs/string-kit';

describe('string-kit - 字符串处理工具', () => {
	// ==================== desensitization 测试 ====================
	describe('desensitization - 字符串脱敏', () => {
		it('应该从指定位置开始脱敏指定数量的字符', () => {
			expect(desensitization('13800138000', 3, 4)).toBe('138****8000');
			expect(desensitization('hello world', 6, 5)).toBe('hello *****');
		});

		it('应该从位置0开始脱敏', () => {
			expect(desensitization('123456', 0, 3)).toBe('***456');
		});

		it('应该脱敏到字符串末尾', () => {
			expect(desensitization('abcdef', 4, 2)).toBe('abcd**');
		});

		it('应该使用默认脱敏数量（3）', () => {
			expect(desensitization('13800138000', 3)).toBe('138***38000');
		});

		it('应该脱敏整个字符串', () => {
			expect(desensitization('123456', 0, 6)).toBe('******');
		});

		it('应该处理空字符串', () => {
			expect(desensitization('', 0, 3)).toBe('');
		});

		it('应该抛出错误如果 start 超出范围', () => {
			expect(() => desensitization('hello', 10, 3)).toThrow('start 参数不能大于等于字符串的长度');
		});

		it('应该抛出错误如果 count 超出范围', () => {
			expect(() => desensitization('hello', 0, 10)).toThrow('count 参数超出了字符串的有效范围');
		});

		it('应该抛出错误如果 start 为负数', () => {
			expect(() => desensitization('hello', -1, 3)).toThrow('start 参数不能大于等于字符串的长度');
		});

		it('应该处理单字符字符串', () => {
			expect(desensitization('a', 0, 1)).toBe('*');
		});

		it('应该处理中文脱敏', () => {
			expect(desensitization('张三李四', 1, 2)).toBe('张**四');
		});
	});

	// ==================== desensitizeName 测试 ====================
	describe('desensitizeName - 姓名脱敏', () => {
		describe('middle 模式（中间脱敏）', () => {
			it('单字姓名：返回 *', () => {
				expect(desensitizeName('张')).toBe('*');
			});

			it('两字姓名：x*', () => {
				expect(desensitizeName('张三')).toBe('张*');
			});

			it('三字姓名：x*x', () => {
				expect(desensitizeName('张三丰')).toBe('张*丰');
			});

			it('四字姓名：x**x', () => {
				expect(desensitizeName('欧阳飞飞')).toBe('欧**飞');
			});

			it('五字姓名：x***x', () => {
				expect(desensitizeName('阿不都拉木')).toBe('阿***木');
			});

			it('六字姓名：x****x', () => {
				expect(desensitizeName('很长很长名字')).toBe('很****字');
			});

			it('应该默认使用 middle 模式', () => {
				expect(desensitizeName('张三')).toBe('张*');
			});
		});

		describe('surname 模式（姓氏脱敏）', () => {
			it('单字姓名：返回 *', () => {
				expect(desensitizeName('李', 'surname')).toBe('*');
			});

			it('两字姓名：*x', () => {
				expect(desensitizeName('张三', 'surname')).toBe('*三');
			});

			it('三字姓名：*xx', () => {
				expect(desensitizeName('张三四', 'surname')).toBe('*三四');
			});

			it('四字姓名：*xxx', () => {
				expect(desensitizeName('欧阳飞飞', 'surname')).toBe('*阳飞飞');
			});
		});

		describe('last 模式（仅保留最后一个字）', () => {
			it('单字姓名：返回 *', () => {
				expect(desensitizeName('王', 'last')).toBe('*');
			});

			it('两字姓名：*x', () => {
				expect(desensitizeName('张三', 'last')).toBe('*三');
			});

			it('三字姓名：**x', () => {
				expect(desensitizeName('张三丰', 'last')).toBe('**丰');
			});

			it('四字姓名：***x', () => {
				expect(desensitizeName('欧阳飞飞', 'last')).toBe('***飞');
			});
		});

		describe('边界情况', () => {
			it('空字符串返回空字符串', () => {
				expect(desensitizeName('')).toBe('');
			});

			it('空字符串 surname 模式返回空字符串', () => {
				expect(desensitizeName('', 'surname')).toBe('');
			});
		});
	});

	// ==================== trim 测试 ====================
	describe('trim - 去除空格', () => {
		it('应该去除两端空格（both）', () => {
			expect(trim('  hello  ')).toBe('hello');
			expect(trim('  hello')).toBe('hello');
			expect(trim('hello  ')).toBe('hello');
			expect(trim('hello')).toBe('hello');
		});

		it('应该去除左侧空格（left）', () => {
			expect(trim('  hello  ', 'left')).toBe('hello  ');
			expect(trim('  hello', 'left')).toBe('hello');
		});

		it('应该去除右侧空格（right）', () => {
			expect(trim('  hello  ', 'right')).toBe('  hello');
			expect(trim('hello  ', 'right')).toBe('hello');
		});

		it('应该去除所有空格（all）', () => {
			expect(trim('  h e l l o  ', 'all')).toBe('hello');
			expect(trim('h e l l o', 'all')).toBe('hello');
			expect(trim('hello', 'all')).toBe('hello');
		});

		it('应该处理多个连续空格', () => {
			expect(trim('    hello    ', 'both')).toBe('hello');
			expect(trim('h   e   l   l   o', 'all')).toBe('hello');
		});

		it('应该处理制表符和换行符', () => {
			expect(trim('\t\thello\t\t', 'both')).toBe('hello');
			expect(trim('\n\nhello\n\n', 'both')).toBe('hello');
		});

		it('应该处理只有空格的字符串', () => {
			expect(trim('     ', 'both')).toBe('');
			expect(trim('     ', 'all')).toBe('');
		});

		it('应该处理空字符串', () => {
			expect(trim('', 'both')).toBe('');
		});

		it('应该将非字符串参数转换为字符串', () => {
			expect(trim(12345 as any)).toBe('12345');
			expect(trim(true as any)).toBe('true');
		});

		it('应该在无效的 pos 参数时返回原字符串', () => {
			expect(trim('  hello  ', 'invalid' as any)).toBe('  hello  ');
		});
	});

	// ==================== getMobile 测试 ====================
	describe('getMobile - 生成随机手机号', () => {
		it('应该生成11位手机号', () => {
			const mobile = getMobile();
			expect(mobile).toHaveLength(11);
		});

		it('应该生成以有效号段开头的手机号', () => {
			const prefixes = ['130', '131', '132', '133', '135', '137', '138', '155', '158', '170', '187', '188', '189'];
			const mobile = getMobile();
			const prefix = mobile.substring(0, 3);
			expect(prefixes).toContain(prefix);
		});

		it('应该生成的手机号都是数字', () => {
			const mobile = getMobile();
			expect(/^\d{11}$/.test(mobile)).toBe(true);
		});

		it('应该每次生成不同的手机号（高概率）', () => {
			const mobile1 = getMobile();
			const mobile2 = getMobile();
			// 由于随机性，极小概率可能相同
			expect(mobile1).not.toBe(mobile2);
		});

		it('应该生成有效的手机号格式', () => {
			const mobile = getMobile();
			expect(/^1[3-9]\d{9}$/.test(mobile)).toBe(true);
		});
	});

	// ==================== getUuid 测试 ====================
	describe('getUuid - 生成 UUID', () => {
		it('应该生成符合 UUID 格式的字符串', () => {
			const uuid = getUuid();
			expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)).toBe(true);
		});

		it('应该生成36位字符（包含连字符）', () => {
			const uuid = getUuid();
			expect(uuid).toHaveLength(36);
		});

		it('应该包含4个连字符', () => {
			const uuid = getUuid();
			const matches = uuid.match(/-/g);
			expect(matches?.length).toBe(4);
		});

		it('应该在正确位置包含连字符', () => {
			const uuid = getUuid();
			expect(uuid[8]).toBe('-');
			expect(uuid[13]).toBe('-');
			expect(uuid[18]).toBe('-');
			expect(uuid[23]).toBe('-');
		});

		it('应该每次生成不同的 UUID', () => {
			const uuid1 = getUuid();
			const uuid2 = getUuid();
			expect(uuid1).not.toBe(uuid2);
		});

		it('第13位应该是4（UUID版本）', () => {
			const uuid = getUuid();
			expect(uuid[14]).toBe('4');
		});
	});

	// ==================== indexToLabel 测试 ====================
	describe('indexToLabel - 索引转标签', () => {
		describe('upper - 大写字母', () => {
			it('应该正确转换索引为大写字母', () => {
				expect(indexToLabel(0, 'upper')).toBe('A');
				expect(indexToLabel(1, 'upper')).toBe('B');
				expect(indexToLabel(25, 'upper')).toBe('Z');
			});

			it('应该处理超过26的情况（AA, AB, AC...）', () => {
				expect(indexToLabel(26, 'upper')).toBe('AA');
				expect(indexToLabel(27, 'upper')).toBe('AB');
				expect(indexToLabel(51, 'upper')).toBe('AZ');
				expect(indexToLabel(52, 'upper')).toBe('BA');
			});

			it('应该处理更大的数字', () => {
				expect(indexToLabel(701, 'upper')).toBe('ZZ');
				expect(indexToLabel(702, 'upper')).toBe('AAA');
			});
		});

		describe('lower - 小写字母', () => {
			it('应该正确转换索引为小写字母', () => {
				expect(indexToLabel(0, 'lower')).toBe('a');
				expect(indexToLabel(1, 'lower')).toBe('b');
				expect(indexToLabel(25, 'lower')).toBe('z');
			});

			it('应该处理超过26的情况', () => {
				expect(indexToLabel(26, 'lower')).toBe('aa');
				expect(indexToLabel(27, 'lower')).toBe('ab');
			});
		});

		describe('number - 数字', () => {
			it('应该返回索引加1的数字字符串', () => {
				expect(indexToLabel(0, 'number')).toBe('1');
				expect(indexToLabel(1, 'number')).toBe('2');
				expect(indexToLabel(99, 'number')).toBe('100');
			});
		});

		describe('chinese - 中文数字', () => {
			it('应该正确转换索引为中文数字', () => {
				expect(indexToLabel(0, 'chinese')).toBe('一');
				expect(indexToLabel(1, 'chinese')).toBe('二');
				expect(indexToLabel(9, 'chinese')).toBe('一十'); // 10
				expect(indexToLabel(10, 'chinese')).toBe('一十一'); // 11
				expect(indexToLabel(99, 'chinese')).toBe('一百'); // 100
			});

			it('应该正确处理十位数字', () => {
				expect(indexToLabel(20, 'chinese')).toBe('二十一');
				expect(indexToLabel(30, 'chinese')).toBe('三十一');
			});

			it('应该正确处理百位数字', () => {
				expect(indexToLabel(100, 'chinese')).toBe('一百零一');
				expect(indexToLabel(999, 'chinese')).toBe('一千');
			});
		});

		describe('边界情况', () => {
			it('应该处理负数索引', () => {
				expect(indexToLabel(-1, 'upper')).toBe('');
				expect(indexToLabel(-1, 'number')).toBe('');
			});

			it('应该使用默认类型（upper）', () => {
				expect(indexToLabel(0)).toBe('A');
				expect(indexToLabel(25)).toBe('Z');
			});

			it('应该在无效的 type 参数时返回数字字符串', () => {
				expect(indexToLabel(0, 'invalid' as any)).toBe('1');
				expect(indexToLabel(5, 'invalid' as any)).toBe('6');
			});
		});
	});

	// ==================== searchTextColor 测试 ====================
	describe('searchTextColor - 搜索文字变色', () => {
		it('应该将匹配的文字用指定颜色包裹', () => {
			const text = 'hello world';
			const val = 'world';
			const result = searchTextColor(val, text, 'red');
			expect(result).toContain('<span style=\'color: red\'>');
			expect(result).toContain('</span>');
		});

		it('应该使用默认颜色 red', () => {
			const result = searchTextColor('hello', 'hello world');
			expect(result).toContain('color: red');
		});

		it('应该自定义颜色', () => {
			const result = searchTextColor('hello', 'hello world', 'blue');
			expect(result).toContain('color: blue');
		});

		it('应该处理不匹配的情况', () => {
			const result = searchTextColor('xyz', 'hello world');
			expect(result).toBe('hello world');
		});

		it('应该处理空字符串', () => {
			// 注意：当前实现在 val 为空时会匹配每个位置，插入空span
			const result = searchTextColor('', 'hello world');
			// 空字符串会匹配每个位置（包括开头和结尾），在每处插入 <span></span>
			// 'hello world' 有11个字符，会有12个匹配位置（开头+每两个字符之间+结尾）
			const spanCount = (result.match(/<span/g) || []).length;
			expect(spanCount).toBe(12);
			// 检查原始字符是否都被保留
			expect(result.replace(/<span[^>]*><\/span>/g, '')).toBe('hello world');
		});

		it('应该处理空文本', () => {
			const result = searchTextColor('hello', '');
			expect(result).toBe('');
		});

		it('应该处理多个匹配（全局替换）', () => {
			const result = searchTextColor('o', 'hello world');
			// 应该有多个 span 标签
			const matches = result.match(/<span/g);
			expect(matches?.length).toBeGreaterThan(0);
		});

		it('应该忽略大小写（默认）', () => {
			const result = searchTextColor('HELLO', 'hello world', 'red');
			expect(result).toContain('<span');
		});
	});

	// ==================== filterSpace 测试 ====================
	describe('filterSpace - 过滤空格', () => {
		it('应该去除首尾空格', () => {
			expect(filterSpace('  hello  ')).toBe('hello');
			expect(filterSpace('\t\thello\t\t')).toBe('hello');
		});

		it('应该只去除首尾空格，不处理中间空格', () => {
			expect(filterSpace('  h e l l o  ')).toBe('h e l l o');
			expect(filterSpace('hello world')).toBe('hello world');
		});

		it('应该处理只有空格的字符串', () => {
			expect(filterSpace('     ')).toBe('');
			expect(filterSpace('\t\t')).toBe('');
		});

		it('应该处理空字符串', () => {
			expect(filterSpace('')).toBe('');
		});

		it('应该处理没有空格的字符串', () => {
			expect(filterSpace('hello')).toBe('hello');
		});

		it('应该处理中间有空格的字符串', () => {
			expect(filterSpace('hello world test')).toBe('hello world test');
		});
	});

	// ==================== toPascalCase 测试 ====================
	describe('toPascalCase - 转帕斯卡命名', () => {
		it('应该转换短横线命名', () => {
			expect(toPascalCase('hello-world')).toBe('HelloWorld');
		});

		it('应该转换下划线命名', () => {
			expect(toPascalCase('hello_world')).toBe('HelloWorld');
		});

		it('应该转换空格命名', () => {
			expect(toPascalCase('hello world')).toBe('HelloWorld');
		});

		it('应该正确处理已大写的首字母', () => {
			expect(toPascalCase('Hello-World')).toBe('HelloWorld');
		});

		it('应该处理空字符串', () => {
			expect(toPascalCase('')).toBe('');
		});

		it('应该处理单字符输入', () => {
			expect(toPascalCase('a')).toBe('A');
		});

		it('应该处理混合分隔符', () => {
			expect(toPascalCase('hello_world-foo bar')).toBe('HelloWorldFooBar');
		});
	});

	// ==================== toCamelCase 测试 ====================
	describe('toCamelCase - 转驼峰命名', () => {
		it('应该转换短横线命名', () => {
			expect(toCamelCase('hello-world')).toBe('helloWorld');
		});

		it('应该转换下划线命名', () => {
			expect(toCamelCase('hello_world')).toBe('helloWorld');
		});

		it('应该转换空格命名', () => {
			expect(toCamelCase('Hello World')).toBe('helloWorld');
		});

		it('应该处理空字符串', () => {
			expect(toCamelCase('')).toBe('');
		});
	});

	// ==================== toKebabCase 测试 ====================
	describe('toKebabCase - 转短横线命名', () => {
		it('应该转换驼峰命名', () => {
			expect(toKebabCase('helloWorld')).toBe('hello-world');
		});

		it('应该转换帕斯卡命名', () => {
			expect(toKebabCase('HelloWorld')).toBe('hello-world');
		});

		it('应该转换下划线命名', () => {
			expect(toKebabCase('hello_world')).toBe('hello-world');
		});

		it('应该处理空字符串', () => {
			expect(toKebabCase('')).toBe('');
		});
	});

	// ==================== capitalize 测试 ====================
	describe('capitalize - 首字母大写', () => {
		it('应该将首字母大写', () => {
			expect(capitalize('hello')).toBe('Hello');
		});

		it('应该仅首字母大写', () => {
			expect(capitalize('hello world')).toBe('Hello world');
		});

		it('应该处理已大写的字符串', () => {
			expect(capitalize('Hello')).toBe('Hello');
		});

		it('应该处理空字符串', () => {
			expect(capitalize('')).toBe('');
		});
	});
});
