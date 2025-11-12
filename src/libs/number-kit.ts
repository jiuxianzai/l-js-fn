/**
 * 数字格式化
 * @param value - 数字或数字字符串
 * @param useUnit - 是否使用中文单位（万/亿）
 * @returns 格式化后的字符串
 * @example
 * console.log(formatNumber(1234567));       // "1,234,567"
 * console.log(formatNumber("1234567"));     // "1,234,567"
 * console.log(formatNumber(1234567, true)); // "123万"
 * console.log(formatNumber("abc"));         // "abc" (非数字原样返回)
 */
export const formatNumber = (value: string | number, useUnit: boolean = false): string => {
	let num = typeof value === 'string' ? parseFloat(value) : value;

	if (isNaN(num)) return String(value);

	if (useUnit) {
		// 中文单位
		if (num >= 1e8) {
			return `${(num / 1e8).toFixed(2).replace(/\.00$/, '')}亿`;
		}
		if (num >= 1e4) {
			return `${(num / 1e4).toFixed(2).replace(/\.00$/, '')}万`;
		}
		return String(num);
	} else {
		// 千分位分割
		return num.toLocaleString('en-US');
	}
};

/**
 * 将小数转为百分比字符串
 * @param {number|string} value - 输入的小数值（如 0.533234）
 * @param {number} [decimals=2] - 小数点位数（默认保留2位）
 * @param {boolean} [round=true] - 是否四舍五入（默认true）
 * @returns {string} - 格式化后的百分比字符串，如 "53.32%"
 */
export function toPercent(value: any, decimals = 2, round = true) {
	if (value === null || value === undefined || isNaN(value)) return '0%';

	let num = Number(value) * 100;

	if (round) {
		num = Number(num.toFixed(decimals));
	} else {
		const factor = Math.pow(10, decimals);
		num = Math.floor(num * factor) / factor;
	}

	return `${num.toFixed(decimals)}%`;
}

/**
 * 生成一个随机数（支持负数、整数或浮点数）
 * @param min - 最小值（必填参数），可以是负数。
 *              如果只传入一个参数，则该值会作为最大值，最小值默认为 0。
 * @param max - 最大值（可选参数），必须大于 0。
 *              如果不传，则函数会将 min 视为最大值，最小值默认是 0。
 * @param options - 配置项
 * @param options.float - 是否返回浮点数，默认为 false（返回整数）
 * @returns 在指定范围内的随机数
 */
export function random(min: number, max?: number, options: { float?: boolean } = {}): number {
	if (max === undefined) {
		max = min;
		min = 0;
	}

	if (max <= 0 && arguments.length === 1) {
		throw new Error('当只有一个参数时，最大值必须大于 0');
	}

	if (min > max) {
		throw new Error('最小值不能大于最大值');
	}

	const rand = Math.random() * (max - min) + min;
	return options.float ? rand : Math.floor(rand);
}

/**
 * 生成指定数量的不重复随机索引
 * @param len - 最大索引（一般为数组长度）
 * @param count - 需要生成的随机索引数量
 * @returns 不重复的随机索引数组
 */
export function getUniqueRandomIndexes(len: number, count: number): number[] {
	if (len <= 0) return [];
	if (count > len) count = len;

	const indexes = new Set<number>();
	while (indexes.size < count) {
		indexes.add(random(0, len - 1));
	}
	return Array.from(indexes);
}
