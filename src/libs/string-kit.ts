import { escapeHTML } from '@/encode/index.ts';

/**
 * 对字符串脱敏处理
 * @param str - 要处理的字符串
 * @param start - 从哪个位置开始脱敏，基于 0 的索引
 * @param count - 需要脱敏的字符数，默认为 3
 * @returns 脱敏后的字符串
 * @throws Error - 如果 start 或 count 无效
 */
export function desensitization(str: string, start: number, count = 3): string {
	if (!str || str.length === 0) return '';

	if (start < 0 || start >= str.length) {
		throw new Error('start 参数不能大于等于字符串的长度');
	}

	if (count < 0 || start + count > str.length) {
		throw new Error('count 参数超出了字符串的有效范围');
	}

	const end = start + count;
	const masked = '*'.repeat(count);

	return str.slice(0, start) + masked + str.slice(end);
}

/**
 * 对姓名进行脱敏处理，支持中间脱敏、姓氏脱敏和末位脱敏三种模式
 * @param name - 姓名
 * @param mode - 脱敏模式，`'middle'` 中间脱敏（默认），`'surname'` 姓氏脱敏，`'last'` 仅保留最后一个字
 * @returns 脱敏后的姓名
 * @example
 * desensitizeName('张')        // '*'
 * desensitizeName('张三')       // '张*'
 * desensitizeName('张三丰')     // '张*丰'
 * desensitizeName('欧阳飞飞')   // '欧**飞'
 * desensitizeName('张三', 'surname') // '*三'
 * desensitizeName('张三丰', 'last')  // '**丰'
 */
export function desensitizeName(name: string, mode: 'middle' | 'surname' | 'last' = 'middle'): string {
	if (!name || name.length === 0) return '';

	const len = name.length;

	if (mode === 'surname') {
		if (len === 1) return '*';
		return '*' + name.slice(1);
	}

	if (mode === 'last') {
		if (len === 1) return '*';
		return '*'.repeat(len - 1) + name[len - 1];
	}

	// middle 模式
	if (len === 1) return '*';
	if (len === 2) return name[0] + '*';

	const middleLen = len - 2;
	return name[0] + '*'.repeat(middleLen) + name[len - 1];
}

/**
 * 去除空格
 * @param str - 需要去除的字符串
 * @param pos - 去除的空格类型，默认 'both'
 * @returns 去除空格后的字符串
 */
export function trim(str: string, pos: 'both' | 'left' | 'right' | 'all' = 'both'): string {
	str = String(str);
	switch (pos) {
		case 'both':
			return str.replace(/^\s+|\s+$/g, '');
		case 'left':
			return str.replace(/^\s*/, '');
		case 'right':
			return str.replace(/\s*$/g, '');
		case 'all':
			return str.replace(/\s+/g, '');
		default:
			return str;
	}
}

/**
 * 随机生成手机号
 * @returns 随机手机号码
 */
export function getMobile(): string {
	const prefixArray = ['130', '131', '132', '133', '135', '137', '138', '155', '158', '170', '187', '188', '189'];
	const prefix = prefixArray[Math.floor(Math.random() * prefixArray.length)];
	const suffix = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
	return prefix + suffix;
}

/**
 * 随机生成 UUID
 * @param {number} [length=36] - 指定返回的 UUID 长度，默认为完整长度 36 位（含连字符）
 * @returns 生成的 UUID 字符串
 */
export function getUuid(length = 36): string {
	let d = new Date().getTime();
	let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		let r = Math.random() * 16;
		if (d > 0) {
			r = (d + r) % 16 | 0;
			d = Math.floor(d / 16);
		} else {
			r = (d2 + r) % 16 | 0;
			d2 = Math.floor(d2 / 16);
		}
		return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
	}).slice(0, length);
}

/**
 * 根据数组索引生成序号标识（支持多种格式）
 * @param {number} index - 从0开始的索引
 * @param {'upper'|'lower'|'number'|'chinese'} [type='upper'] - 格式类型，upper大写 | lower小写 | number数字 | chinese中文
 * @returns {string} 转换后的序号
 */
export function indexToLabel(index: number, type: 'upper' | 'lower' | 'number' | 'chinese' = 'upper'): string {
	if (index < 0) return '';

	// 中文数字表
	const chineseNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
	const chineseUnits = ['', '十', '百', '千'];

	// 将数字转中文函数（支持到9999）
	const toChineseNumber = (num: number) => {
		if (num === 0) return chineseNums[0];
		let str = '';
		const digits = String(num).split('').reverse();
		for (let i = 0; i < digits.length; i++) {
			const n = parseInt(digits[i]);
			if (n === 0) {
				if (!str.startsWith(chineseNums[0])) str = chineseNums[0] + str;
			} else {
				str = chineseNums[n] + chineseUnits[i] + str;
			}
		}
		// 清理"零十""零百"等情况
		str = str
			.replace(/零[十百千]/g, '零')
			.replace(/零+/g, '零')
			.replace(/零$/g, '');
		return str;
	};

	switch (type) {
		case 'upper': {
			// A, B, C, ..., Z, AA, AB...
			const A = 'A'.charCodeAt(0);
			let label = '';
			let n = index;
			do {
				label = String.fromCharCode(A + (n % 26)) + label;
				n = Math.floor(n / 26) - 1;
			} while (n >= 0);
			return label;
		}

		case 'lower': {
			const a = 'a'.charCodeAt(0);
			let label = '';
			let n = index;
			do {
				label = String.fromCharCode(a + (n % 26)) + label;
				n = Math.floor(n / 26) - 1;
			} while (n >= 0);
			return label;
		}

		case 'number':
			return (index + 1).toString();

		case 'chinese':
			return toChineseNumber(index + 1);

		default:
			return (index + 1).toString();
	}
}

/**
 * 匹配文字变色（搜索时）
 * @param val 当前值字符串
 * @param text 要处理的字符串值
 * @param color 搜索到时字体高亮颜色
 * @returns {string} 返回处理后的字符串
 */
export function searchTextColor(val: string, text = '', color = 'red'): string {
	// 转义正则特殊字符，防止正则注入
	const escaped = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	// 转义 color 参数，防止 HTML 属性注入
	const safeColor = color.replace(/['"\\<>]/g, '');
	// 返回内容，添加颜色
	let v = text.replace(new RegExp(escaped, 'gi'), `<span style='color: ${safeColor}'>${escapeHTML(val)}</span>`);
	// 返回结果
	return v;
}

/**
 * 禁止输入空格
 * @param val 当前值字符串
 * @returns {string} 返回处理后的字符串
 */
export function filterSpace(val: string): string {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 返回结果
	return v;
}

/** 将字符串转换为帕斯卡命名法 */
export function toPascalCase(str: string): string {
  if (!str) return ''; // 空字符串处理

  return String(str)
      .replace(/[-_]/g, ' ') // 替换连字符和下划线为空格
      .replace(/\s+(.)/g, (_, c) => c.toUpperCase()) // 空格后字符转大写
      .replace(/^(.)/, (_, c) => c.toUpperCase()) // 首字符转大写
      .replace(/\s/g, ''); // 移除所有空格
}

/**
 * 短横线/下划线/空格命名 → 驼峰命名
 * @param str - 输入字符串
 * @returns 驼峰格式字符串
 * @example
 * toCamelCase('hello-world') // 'helloWorld'
 * toCamelCase('hello_world') // 'helloWorld'
 * toCamelCase('Hello World') // 'helloWorld'
 */
export function toCamelCase(str: string): string {
	if (!str) return '';
	return str
		.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
		.replace(/^(.)/, (_, c) => c.toLowerCase());
}

/**
 * 驼峰/帕斯卡/下划线 → 短横线命名
 * @param str - 输入字符串
 * @returns 短横线格式字符串
 * @example
 * toKebabCase('helloWorld') // 'hello-world'
 * toKebabCase('HelloWorld') // 'hello-world'
 * toKebabCase('hello_world') // 'hello-world'
 */
export function toKebabCase(str: string): string {
	if (!str) return '';
	return str
		.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())
		.replace(/[\s_]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-+/g, '-');
}

/**
 * 将字符串首字母转为大写
 * @param str - 输入字符串
 * @returns 首字母大写后的字符串
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1);
}
