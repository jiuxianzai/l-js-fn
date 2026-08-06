import { DATE_FORMAT } from '@/config'
type DateFormatType = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];

/**
 * 将 Date / 时间戳字符串 / 数字时间戳统一转为毫秒时间戳
 */
function toTimestamp(d: Date | string | number): number {
	if (d instanceof Date) return d.getTime();
	if (typeof d === 'number') return d < 1e11 ? d * 1000 : d;
	if (typeof d !== 'string') throw new Error(`Invalid date: ${d}`);
	// iOS/Safari 兼容：- 转 /，去 Z，替 T
	const t = Date.parse(d.replace(/-/g, '/').replace('T', ' ').replace(/Z$/, ''));
	if (isNaN(t)) throw new Error(`Invalid date string: ${d}`);
	return t;
}

/**
 * 将日期或时间戳格式化为指定格式的字符串
 * @param input - 输入,默认当前时间
 * @param format - 输出格式，默认 `'yyyy-MM-dd HH:mm:ss'`
 * @returns 格式化后的日期字符串
 */
export function dateFormat(input: Date | string | number = new Date(), format: DateFormatType = DATE_FORMAT.FULL): string {
	if (input === null || input === undefined || input === '') return '';

	let d: Date;

	if (input instanceof Date) {
		d = input;
	} else if (typeof input === 'number') {
		// 处理时间戳：秒级转毫秒
		const ts = input < 1e11 ? input * 1000 : input;
		d = new Date(ts);
	} else if (typeof input === 'string') {
		let str = input.trim();

		// iOS 兼容：将 "-" 替换为 "/"
		if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
			str = str.replace(/-/g, '/');
		}

		// 去除 ISO 尾部 Z，替换 T
		str = str.replace('T', ' ').replace(/Z$/, '');

		d = new Date(str);
	} else {
		return '';
	}

	if (isNaN(d.getTime())) return '';

	const pad = (num: number, len: number = 2) => String(num).padStart(len, '0');

	const map: Record<string, string | number> = {
		yyyy: d.getFullYear(),
		MM: pad(d.getMonth() + 1),
		dd: pad(d.getDate()),
		HH: pad(d.getHours()),
		mm: pad(d.getMinutes()),
		ss: pad(d.getSeconds()),
		SSS: pad(d.getMilliseconds(), 3),
		q: Math.floor((d.getMonth() + 3) / 3), // 季度
	};

	return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|q/g, (token) => String(map[token] ?? token));
}

/**
 * 将秒数转换为 HH:mm:ss 格式
 * @param value - 秒数
 * @returns 格式化后的字符串，例如 "00:12:34"
 */
export function dateSecond(value: number): string {
	let secondTime = Math.floor(Math.abs(value)); // 秒，取绝对值处理负数
	let minuteTime = 0; // 分
	let hourTime = 0; // 小时

	if (secondTime < 60) {
		return `00:00:${String(secondTime).padStart(2, '0')}`;
	}

	minuteTime = Math.floor(secondTime / 60);
	secondTime = secondTime % 60;

	if (minuteTime >= 60) {
		hourTime = Math.floor(minuteTime / 60);
		minuteTime = minuteTime % 60;
	}

	return `${String(hourTime).padStart(2, '0')}:${String(minuteTime).padStart(2, '0')}:${String(secondTime).padStart(2, '0')}`;
}

/**
 * 计算两个日期之间相差的天数（按整天计算，忽略时分秒）
 * @param date1 - 第一个日期，可以是 Date、时间戳或日期字符串
 * @param date2 - 第二个日期，可以是 Date、时间戳或日期字符串
 * @returns 相差的天数，始终为非负数
 */
export const diffDays = (date1: Date | string | number, date2: Date | string | number): number => {
	let time1 = toTimestamp(date1);
	let time2 = toTimestamp(date2);

	const d1 = new Date(time1);
	const d2 = new Date(time2);
	// 使用 UTC 归一化避免夏令时（DST）跨天误差
	time1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
	time2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());

	const diffMs = Math.abs(time1 - time2);
	return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

/**
 * 格式化过去时间
 * @param startTime - 需要格式化的时间，支持 Date / 时间戳 / 字符串
 * @returns 格式化后的时间字符串
 * @example
 * formatPassTime('2020-01-01 12:12:12') // "3个月前"
 * formatPassTime(new Date()) // "刚刚"
 * formatPassTime(1577836800000) // "1年前"
 */
export const formatPassTime = (startTime?: string | number | Date): string => {
	const now = Date.now();
	const start = startTime ? new Date(startTime).getTime() : now;

	if (isNaN(start)) return 'Invalid date';

	const diff = now - start;

	if (diff < 0) return '刚刚'; // 未来时间也显示刚刚

	const SECOND = 1000;
	const MINUTE = 60 * SECOND;
	const HOUR = 60 * MINUTE;
	const DAY = 24 * HOUR;
	const MONTH = 30 * DAY;
	const YEAR = 365 * DAY;

	if (diff >= YEAR) {
		const years = Math.floor(diff / YEAR);
		return years + '年前';
	}

	if (diff >= MONTH) {
		const months = Math.floor(diff / MONTH);
		return months + '个月前';
	}

	if (diff >= DAY) {
		const days = Math.floor(diff / DAY);
		return days + '天前';
	}

	if (diff >= HOUR) {
		const hours = Math.floor(diff / HOUR);
		return hours + '小时前';
	}

	if (diff >= MINUTE) {
		const minutes = Math.floor(diff / MINUTE);
		return minutes + '分钟前';
	}

	if (diff >= SECOND) {
		const seconds = Math.floor(diff / SECOND);
		return seconds + '秒前';
	}

	return '刚刚';
};

/**
 * 获取指定日期月份的总天数
 * @param time - Date 对象或可被 Date 构造的字符串/数字
 * @returns 当月的天数
 */
export const monthDays = (time: Date | string | number): number => {
	const date = new Date(time);
	if (isNaN(date.getTime())) throw new Error(`Invalid date: ${time}`);
	const year = date.getFullYear();
	const month = date.getMonth() + 1; // 下一个月
	return new Date(year, month, 0).getDate();
};

/**
 * 计算两个时间的间隔（单位：毫秒）
 * @param {Date|string|number} start - 开始时间（Date、字符串、时间戳）
 * @param {Date|string|number} end - 结束时间（Date、字符串、时间戳）
 * @returns {number} 两个时间的间隔（毫秒）
 */
export function getTimeDiff(start: Date | string | number, end: Date | string | number): number {
	const startTime = toTimestamp(start);
	const endTime = toTimestamp(end);

	if (isNaN(startTime) || isNaN(endTime)) {
		throw new Error('无效的时间值，请检查输入格式。');
	}

	return endTime - startTime;
}

/**
 * 计算两个时间的差值，返回日/时/分/秒的分解结果
 * @param date1 - 第一个日期，可以是 Date、时间戳或日期字符串
 * @param date2 - 第二个日期，可以是 Date、时间戳或日期字符串
 * @returns 包含 days / hours / minutes / seconds 的对象，各分量均为非负数
 * @example
 * diffTime('2024-01-01 10:00:00', '2024-01-02 12:30:45')
 * // { days: 1, hours: 2, minutes: 30, seconds: 45 }
 * diffTime(new Date('2024-01-01'), new Date('2024-01-01 01:02:03'))
 * // { days: 0, hours: 1, minutes: 2, seconds: 3 }
 */
export function diffTime(
	date1: Date | string | number,
	date2: Date | string | number
): { days: number; hours: number; minutes: number; seconds: number } {
	const t1 = toTimestamp(date1);
	const t2 = toTimestamp(date2);

	const diffMs = Math.abs(t2 - t1);

	const seconds = Math.floor(diffMs / 1000) % 60;
	const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
	const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
	const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	return { days, hours, minutes, seconds };
}

/**
 * 在当前日期基础上增加或减少天数，返回新日期
 * @param date - 基准日期
 * @param days - 要添加的天数（负数表示减少）
 * @returns 新日期
 * @example
 * addDays(new Date('2024-01-01'), 1) // 2024-01-02
 * addDays(new Date('2024-01-01'), -1) // 2023-12-31
 */
export function addDays(date: Date | string | number, days: number): Date {
	const d = new Date(date);
	if (isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
	d.setDate(d.getDate() + days);
	return d;
}

/**
 * 判断指定年份是否为闰年
 * @param year - 年份（如 2024）
 * @returns 是否闰年
 * @example
 * isLeapYear(2024) // true
 * isLeapYear(2023) // false
 */
export function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * 获取指定日期的中文星期几
 * @param date - 日期（默认今天）
 * @returns 中文星期
 * @example
 * getWeekDay(new Date('2024-01-01')) // '星期一'
 */
export function getWeekDay(date: Date | string | number = new Date()): string {
	const d = new Date(date);
	if (isNaN(d.getTime())) throw new Error(`Invalid date: ${date}`);
	const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
	return days[d.getDay()];
}
