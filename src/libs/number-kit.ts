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
	// 检查是否为有限数字
	if (!isFinite(value as number)) {
		// 处理 Infinity 和 -Infinity
		if (value === Infinity || value === -Infinity) return String(value);
		// 非数字字符串原样返回
		return String(value);
	}

	let num = typeof value === 'string' ? parseFloat(value) : value;

	if (isNaN(num)) return String(value);

	if (useUnit) {
		// 中文单位
		const absNum = Math.abs(num);
		const sign = num < 0 ? '-' : '';
		if (absNum >= 1e8) {
			return `${sign}${(absNum / 1e8).toFixed(2).replace(/\.00$/, '')}亿`;
		}
		if (absNum >= 1e4) {
			return `${sign}${(absNum / 1e4).toFixed(2).replace(/\.00$/, '')}万`;
		}
		return String(num);
	} else {
		// 千分位分割
		return num.toLocaleString('en-US');
	}
};

/**
 * 将小数转为百分比字符串
 * @param {string | number | null | undefined} value - 输入的小数值（如 0.533234）
 * @param {number} [decimals=2] - 小数点位数（默认保留2位）
 * @param {boolean} [round=true] - 是否四舍五入（默认true）
 * @returns {string} - 格式化后的百分比字符串，如 "53.32%"
 */
export function toPercent(value: string | number | null | undefined, decimals: number = 2, round: boolean = true): string {
	if (value === null || value === undefined || isNaN(value as unknown as number)) return '0%';

	if (round) {
		const num = Number(value) * 100;
		return `${num.toFixed(decimals)}%`;
	} else {
		// 向下取整（截断）：先截断原值，再转百分比
		const valueStr = value.toString();
		const dotIndex = valueStr.indexOf('.');

		if (dotIndex === -1) {
			// 没有小数点，如 123 -> "12300.00%"
			return `${valueStr}00.${'0'.repeat(decimals)}%`;
		}

		// 有小数点，先截断到指定小数位，再转百分比
		const integerPart = valueStr.substring(0, dotIndex); // "0"
		let decimalPart = valueStr.substring(dotIndex + 1); // "5559"

		// 截断到足够的小数位（百分比需要两位小数，所以原值需要 2 + decimals 位）
		const requiredDecimals = 2 + decimals;
		if (decimalPart.length > requiredDecimals) {
			decimalPart = decimalPart.substring(0, requiredDecimals);
		} else {
			// 补零
			decimalPart = decimalPart.padEnd(requiredDecimals, '0');
		}

		// 移动小数点两位："0" + "5559" = "05559"
		// 整数部分：取到倒数第2位前（小数点前所有数字）
		// 小数部分：从倒数第(decimals+2)位到倒数第2位（截断，不四舍五入）
		const shiftedStr = integerPart + decimalPart;
		const shiftedInteger = shiftedStr.substring(0, shiftedStr.length - 2); // "055" -> "55"
		const shiftedDecimal = shiftedStr.substring(shiftedStr.length - decimals - 2, shiftedStr.length - 2); // "55" (截断)

		// 去掉前导零并返回
		const result = `${String(Number(shiftedInteger))}.${shiftedDecimal}%`;
		return result;
	}
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
		indexes.add(random(0, len));
	}
	return Array.from(indexes);
}

/**
 * 将数值限制在指定范围内
 * @param value - 输入值
 * @param min - 最小值
 * @param max - 最大值
 * @returns 限制后的值
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-1, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

/**
 * 将数字四舍五入到指定小数位
 * @param value - 输入数字
 * @param precision - 保留的小数位数，默认为 0
 * @returns 四舍五入后的数字
 * @example
 * round(3.14159, 2) // 3.14
 * round(3.14159) // 3
 * round(3.5) // 4
 */
export function round(value: number, precision: number = 0): number {
	const factor = Math.pow(10, precision);
	return Math.round(value * factor) / factor;
}
