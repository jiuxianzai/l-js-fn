/**
 * dist 主包验证 - 测试打包后的主入口
 */
const dist = require('../../dist/index.cjs');

describe('dist 主包 - 类型判断 (is-kit)', () => {
	it('isEmpty', () => {
		expect(dist.isEmpty('')).toBe(true);
		expect(dist.isEmpty(null)).toBe(true);
		expect(dist.isEmpty([])).toBe(true);
		expect(dist.isEmpty({})).toBe(true);
		expect(dist.isEmpty('hello')).toBe(false);
	});

	it('isNotEmpty', () => {
		expect(dist.isNotEmpty('hello')).toBe(true);
		expect(dist.isNotEmpty('')).toBe(false);
	});

	it('isObject', () => {
		expect(dist.isObject({})).toBe(true);
		expect(dist.isObject([])).toBe(false);
		expect(dist.isObject(null)).toBe(false);
	});

	it('isArray', () => {
		expect(dist.isArray([])).toBe(true);
		expect(dist.isArray({})).toBe(false);
	});

	it('isString', () => {
		expect(dist.isString('hello')).toBe(true);
		expect(dist.isString(123)).toBe(false);
	});

	it('isEmail', () => {
		expect(dist.isEmail('test@example.com')).toBe(true);
		expect(dist.isEmail('invalid')).toBe(false);
	});

	it('isPhoneNumber', () => {
		expect(dist.isPhoneNumber('13800138000')).toBe(true);
		expect(dist.isPhoneNumber('12345')).toBe(false);
	});

	it('isURL', () => {
		expect(dist.isURL('https://example.com')).toBe(true);
		expect(dist.isURL('not a url')).toBe(false);
	});

	it('isIdCard', () => {
		expect(typeof dist.isIdCard).toBe('function');
	});

	it('isEqual - 深度比较', () => {
		expect(dist.isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
		expect(dist.isEqual({ a: 1 }, { a: 2 })).toBe(false);
	});
});

describe('dist 主包 - 数组操作 (array-kit)', () => {
	it('arrayDelEl - 删除元素', () => {
		expect(dist.arrayDelEl([1, 2, 3, 2], 2)).toEqual([1, 3]);
	});

	it('arrayUnique - 去重', () => {
		expect(dist.arrayUnique([1, 2, 2, 3])).toEqual([1, 2, 3]);
	});

	it('flatten - 扁平化', () => {
		expect(dist.flatten([1, [2, [3]]])).toEqual([1, 2, 3]);
	});

	it('range - 范围数组', () => {
		expect(dist.range(0, 3)).toEqual([0, 1, 2, 3]);
	});

	it('sum - 求和', () => {
		expect(dist.sum([1, 2, 3])).toBe(6);
	});

	it('last - 取最后一个', () => {
		expect(dist.last([1, 2, 3])).toBe(3);
	});

	it('compact - 过滤 falsy', () => {
		expect(dist.compact([0, 1, false, 2, '', 3])).toEqual([1, 2, 3]);
	});

	it('shuffle - 洗牌', () => {
		const arr = [1, 2, 3, 4, 5];
		const shuffled = dist.shuffle([...arr]);
		expect(shuffled.sort()).toEqual(arr);
	});

	it('groupBy - 对象数组分组', () => {
		const data = [{ name: 'a', age: 1 }, { name: 'b', age: 1 }, { name: 'c', age: 2 }];
		const grouped = dist.groupBy(data, 'age');
		expect(grouped['1']).toHaveLength(2);
		expect(grouped['2']).toHaveLength(1);
	});
});

describe('dist 主包 - 字符串处理 (string-kit)', () => {
	it('desensitization - 脱敏', () => {
		expect(dist.desensitization('13800138000', 3, 4)).toBe('138****8000');
	});

	it('trim - 去除空格', () => {
		expect(dist.trim('  hello  ')).toBe('hello');
	});

	it('getUuid - 生成 UUID', () => {
		const uuid = dist.getUuid();
		expect(uuid).toHaveLength(36);
		expect(uuid[14]).toBe('4');
	});

	it('toCamelCase - 驼峰命名', () => {
		expect(dist.toCamelCase('hello-world')).toBe('helloWorld');
	});

	it('toPascalCase - 帕斯卡命名', () => {
		expect(dist.toPascalCase('hello-world')).toBe('HelloWorld');
	});

	it('toKebabCase - 短横线命名', () => {
		expect(dist.toKebabCase('helloWorld')).toBe('hello-world');
	});

	it('indexToLabel - 索引转标签', () => {
		expect(dist.indexToLabel(0, 'upper')).toBe('A');
		expect(dist.indexToLabel(1, 'lower')).toBe('b');
	});
});

describe('dist 主包 - 对象操作 (object-kit)', () => {
	it('objMerge - 对象合并', () => {
		expect(dist.objMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
	});

	it('pick - 选取属性', () => {
		expect(dist.pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
	});

	it('get - 安全深层取值', () => {
		expect(dist.get({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1);
		expect(dist.get({ a: 1 }, 'b.c', 'default')).toBe('default');
	});

	it('objFilterNull - 过滤空值', () => {
		expect(dist.objFilterNull({ a: 1, b: null })).toEqual({ a: 1 });
	});

	it('deepMerge - 深度合并', () => {
		expect(dist.deepMerge({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({ a: { b: 1, c: 2 } });
	});
});

describe('dist 主包 - 通用工具 (common)', () => {
	it('getType - 获取类型', () => {
		expect(dist.getType([])).toBe('array');
		expect(dist.getType({})).toBe('object');
		expect(dist.getType('')).toBe('string');
		expect(dist.getType(123)).toBe('number');
	});

	it('deepClone - 深拷贝', () => {
		const obj = { a: 1, b: { c: 2 } };
		const cloned = dist.deepClone(obj);
		expect(cloned).toEqual(obj);
		expect(cloned).not.toBe(obj);
	});

	it('debounce - 防抖', () => {
		expect(typeof dist.debounce).toBe('function');
		const fn = dist.debounce(() => {}, 100);
		expect(typeof fn).toBe('function');
	});

	it('throttle - 节流', () => {
		expect(typeof dist.throttle).toBe('function');
		const fn = dist.throttle(() => {}, 100);
		expect(typeof fn).toBe('function');
	});

	it('once - 只执行一次', () => {
		let count = 0;
		const fn = dist.once(() => { count++; });
		fn();
		fn();
		expect(count).toBe(1);
	});

	it('memoize - 缓存结果', () => {
		let calls = 0;
		const fn = dist.memoize((a: number, b: number) => { calls++; return a + b; });
		expect(fn(1, 2)).toBe(3);
		expect(fn(1, 2)).toBe(3);
		expect(calls).toBe(1);
	});
});

describe('dist 主包 - 日期处理 (date-kit)', () => {
	it('dateFormat - 日期格式化', () => {
		const date = new Date('2024-01-15 10:30:00');
		expect(dist.dateFormat(date, 'yyyy-MM-dd')).toBe('2024-01-15');
		expect(dist.dateFormat(date, 'HH:mm:ss')).toBe('10:30:00');
	});

	it('isLeapYear - 闰年判断', () => {
		expect(dist.isLeapYear(2024)).toBe(true);
		expect(dist.isLeapYear(2023)).toBe(false);
	});

	it('addDays - 日期加减', () => {
		const d = dist.addDays(new Date('2024-01-01'), 1);
		expect(dist.dateFormat(d, 'yyyy-MM-dd')).toBe('2024-01-02');
	});
});

describe('dist 主包 - 数字处理 (number-kit)', () => {
	it('formatNumber - 数字格式化', () => {
		expect(dist.formatNumber(1234567)).toBe('1,234,567');
	});

	it('clamp - 限制范围', () => {
		expect(dist.clamp(5, 0, 10)).toBe(5);
		expect(dist.clamp(-1, 0, 10)).toBe(0);
		expect(dist.clamp(15, 0, 10)).toBe(10);
	});

	it('round - 四舍五入', () => {
		expect(dist.round(3.14159, 2)).toBe(3.14);
	});
});

describe('dist 主包 - url 处理 (url-kit)', () => {
	it('getUrlParams - 解析参数', () => {
		const params = dist.getUrlParams('https://example.com?id=1&name=John');
		expect(params.id).toBe('1');
		expect(params.name).toBe('John');
	});

	it('appendUrlParam - 添加参数', () => {
		const url = dist.appendUrlParam('https://example.com', 'id', 1);
		expect(url).toContain('id=1');
	});
});

describe('dist 主包 - color', () => {
	it('hexToHSL - 转换', () => {
		expect(typeof dist.hexToHSL).toBe('function');
		const result = dist.hexToHSL('#ff0000');
		expect(result.h).toBe(0);
	});

	it('hslToHex - 转回 hex', () => {
		expect(typeof dist.hslToHex).toBe('function');
	});

	it('conversionColor - 颜色转换', () => {
		expect(typeof dist.conversionColor).toBe('function');
	});
});

describe('dist 主包 - Result', () => {
	it('Result.ok 创建成功结果', () => {
		const r = dist.Result.ok('data');
		expect(r.success).toBe(true);
		expect(r.data).toBe('data');
	});

	it('Result.ok 无数据', () => {
		const r = dist.Result.ok();
		expect(r.success).toBe(true);
		expect(r.message).toBe('操作成功');
	});

	it('Result.fail 创建失败结果', () => {
		const r = dist.Result.fail('error message');
		expect(r.success).toBe(false);
		expect(r.message).toBe('error message');
	});
});
