/** 格式化选项 */
interface FormatNumberOptions {
	/** 输出类型：'comma' 千分位逗号分隔（默认），'number' 纯数字，'chinese' 中文大写金额 */
	type?: 'comma' | 'number' | 'chinese';
	/** 保留小数位数（仅 type 为 'comma'/'number' 时生效，默认保留原始小数位；chinese 模式固定为金额角分格式） */
	decimals?: number;
	/** 是否使用中文单位（万/亿），仅 type 为 'comma'/'number' 时生效 */
	useUnit?: boolean;
}

/** 中文大写数字映射 */
const CHINESE_DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const CHINESE_UNITS = ['', '拾', '佰', '仟'];
const CHINESE_BIG_UNITS = ['', '万', '亿'];

/**
 * 将整数部分转为中文大写（四位一组）
 */
function sectionToChinese(section: string): string {
	if (section === '0000') return '';
	const len = section.length;
	let result = '';
	let hasZero = false;
	for (let i = 0; i < len; i++) {
		const digit = parseInt(section[i]);
		const pos = len - i - 1; // 从右往左 0=个位, 1=拾, 2=佰, 3=仟
		if (digit === 0) {
			hasZero = true;
		} else {
			if (hasZero && result !== '') {
				result += '零';
			}
			result += CHINESE_DIGITS[digit] + CHINESE_UNITS[pos];
			hasZero = false;
		}
	}
	return result;
}

/**
 * 将数字的整数部分按四位一组分别拆分，每组转为中文大写
 * @param originalSections 原始分组的字符串数组（高位在前）
 * @returns 中文大写字符串
 */
function integerToChinese(sections: string[]): string {
	const len = sections.length;
	let result = '';
	let needZero = false;

	for (let i = 0; i < len; i++) {
		const sectionStr = sectionToChinese(sections[i].padStart(4, '0'));

		if (sectionStr === '') {
			if (result !== '') needZero = true;
			if (i === len - 1 && result === '') return CHINESE_DIGITS[0];
			continue;
		}

		if (needZero) {
			result += CHINESE_DIGITS[0];
			needZero = false;
		}

		// 当前段非首个段且该段值 < 1000，说明高位有缺，补零
		if (i > 0 && parseInt(sections[i]) < 1000) {
			if (!result.endsWith(CHINESE_DIGITS[0])) {
				result += CHINESE_DIGITS[0];
			}
		}

		const bigUnitIndex = len - i - 1;
		result += sectionStr + CHINESE_BIG_UNITS[bigUnitIndex];
	}

	return result;
}

/**
 * 数字格式化
 * @param value - 数字或数字字符串
 * @param options - 配置项，可配置 type/decimals/useUnit
 * @returns 格式化后的字符串
 * @example
 * // 基本用法
 * formatNumber(1234567)                          // "1,234,567"
 * formatNumber(1234567, { useUnit: true })       // "123.47万"
 *
 * // 控制小数位
 * formatNumber(1234567, { decimals: 2 })         // "1,234,567.00"
 * formatNumber(1234.5, { decimals: 2 })          // "1,234.50"
 *
 * // 纯数字模式
 * formatNumber(1234567, { type: 'number', decimals: 2 }) // "1234567.00"
 *
 * // 中文大写金额
 * formatNumber(123.45, { type: 'chinese' })      // "壹佰贰拾叁元肆角伍分"
 * formatNumber(100.00, { type: 'chinese' })      // "壹佰元整"
 * formatNumber(1000000, { type: 'chinese' })     // "壹佰万元整"
 *
 * // 中文单位 + 小数
 * formatNumber(12345, { useUnit: true, decimals: 2 })  // "1.23万"
 */
export const formatNumber = (value: string | number, options: FormatNumberOptions = {}): string => {
	/** 提取符号和绝对值 */
	const signAndAbs = (num: number, negSign: string = '-') => ({
		sign: num < 0 ? negSign : '',
		abs: Math.abs(num),
	});

	const { type = 'comma', decimals, useUnit } = options;

	// 检查是否为有限数字
	if (!isFinite(value as number)) {
		if (value === Infinity || value === -Infinity) return String(value);
		return String(value);
	}

	const num = typeof value === 'string' ? parseFloat(value) : value;
	if (isNaN(num)) return String(value);

	// 中文大写金额模式
	if (type === 'chinese') {
		const { abs, sign } = signAndAbs(num, '负');

		const intPart = Math.floor(abs);
		const decPart = Math.round((abs - intPart) * 100);

		const jiao = Math.floor(decPart / 10);
		const fen = decPart % 10;

		// 整数部分
		let result = sign;
		if (intPart === 0) {
			if (jiao === 0 && fen === 0) {
				return result + CHINESE_DIGITS[0] + '元整';
			}
		} else {
			const str = String(Math.floor(intPart));
			const sections: string[] = [];
			for (let i = str.length; i > 0; i -= 4) {
				sections.unshift(str.substring(Math.max(0, i - 4), i));
			}
			result += integerToChinese(sections) + '元';
		}

		if (jiao === 0 && fen === 0) {
			result += '整';
		} else {
			if (jiao > 0) result += CHINESE_DIGITS[jiao] + '角';
			if (fen > 0) result += CHINESE_DIGITS[fen] + '分';
		}

		return result;
	}

	// 中文单位模式（万/亿）
	if (useUnit) {
		const { abs, sign } = signAndAbs(num);
		const d = decimals !== undefined ? decimals : 2;
		const factor = Math.pow(10, d);
		if (abs >= 1e8) {
			const raw = Math.round((abs * factor) / 1e8) / factor;
			return `${sign}${raw.toFixed(d).replace(new RegExp(`\\.${'0'.repeat(d)}$`), '')}亿`;
		}
		if (abs >= 1e4) {
			const raw = Math.round((abs * factor) / 1e4) / factor;
			return `${sign}${raw.toFixed(d).replace(new RegExp(`\\.${'0'.repeat(d)}$`), '')}万`;
		}
		// 小于 1 万：按原值输出（不追加单位，也不加千分位）
		if (decimals !== undefined) return `${sign}${num.toFixed(decimals)}`;
		return String(num);
	}

	// number / comma 模式
	let formatted: string;
	if (decimals !== undefined) {
		formatted = num.toFixed(decimals);
	} else {
		formatted = String(num);
	}

	if (type === 'number') return formatted;

	// comma 千分位
	const parts = formatted.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
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

	const num = Number(value) * 100;

	if (round) {
		return `${num.toFixed(decimals)}%`;
	}
	// 不四舍五入：算术截断
	const factor = 10 ** decimals;
	const truncated = Math.trunc(num * factor) / factor;
	return `${truncated.toFixed(decimals)}%`;
}

/**
 * 生成一个随机数（支持负数、整数或浮点数）
 * @param min - 最小值（必填参数），可以是负数。
 *              如果只传入一个参数，则该值会作为最大值，最小值默认为 0。
 * @param max - 最大值（可选参数）。
 *              如果不传，则函数会将 min 视为最大值，最小值默认是 0。
 *              若 min > max 会自动交换边界。
 * @param options - 配置项
 * @param options.float - 是否返回浮点数，默认为 false（返回整数）
 * @returns 在指定范围内的随机数
 */
export function random(min: number, max?: number, options: { float?: boolean } = {}): number {
	if (max === undefined) {
		// 只传入一个参数时，该值作为最大值，最小值默认为 0（若为负数会自动交换）
		max = min;
		min = 0;
	}

	if (min > max) {
		// 自动交换边界，避免抛错
		[min, max] = [max, min];
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
