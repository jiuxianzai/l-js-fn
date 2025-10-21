import { DATE_FORMAT } from '@/config/constant';
type DateFormatType = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];

/**
 * 将日期或时间戳格式化为指定格式的字符串
 * @param input - 输入,默认当前时间
 * @param format - 输出格式，默认 `'yyyy-MM-dd HH:mm:ss'`
 * @returns 格式化后的日期字符串
 */
export function dateFormat(
  input: Date | string | number = new Date(),
  format: DateFormatType = DATE_FORMAT.FULL
): string {
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

    // iOS 兼容：将 “-” 替换为 “/”
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

  return format.replace(/yyyy|MM|dd|HH|mm|ss|SSS|q/g, token => String(map[token] ?? token));
}

/**
 * 将秒数转换为 HH:mm:ss 格式
 * @param value - 秒数
 * @returns 格式化后的字符串，例如 "00:12:34"
 */
export function dateSecond(value: number): string {
  let secondTime = Math.floor(value); // 秒
  let minuteTime = 0; // 分
  let hourTime = 0; // 小时
  let dayTime = 0; // 天
  let result = '';

  if (secondTime < 60) {
    const secStr = secondTime >= 10 ? secondTime : '0' + secondTime;
    result = `00:00:${secStr}`;
  } else {
    minuteTime = Math.floor(secondTime / 60);
    secondTime = secondTime % 60;

    if (minuteTime >= 60) {
      hourTime = Math.floor(minuteTime / 60);
      minuteTime = minuteTime % 60;

      if (hourTime >= 24) {
        dayTime = Math.floor(hourTime / 24);
        hourTime = hourTime % 24;
      }
    }

    const secStr = secondTime >= 10 ? secondTime : '0' + secondTime;
    const minStr = minuteTime >= 10 ? minuteTime : '0' + minuteTime;
    const hourStr = hourTime >= 10 ? hourTime : '0' + hourTime;

    result = `${hourStr}:${minStr}:${secStr}`;
    // 如果想显示天数，可以加上：
    // if (dayTime > 0) result = `${dayTime}天 ${result}`;
  }

  return result;
}

/**
 * 计算两个日期之间相差的天数（按整天计算，忽略时分秒）
 * @param date1 - 第一个日期，可以是 Date、时间戳或日期字符串
 * @param date2 - 第二个日期，可以是 Date、时间戳或日期字符串
 * @returns 相差的天数，始终为非负数
 */
export const diffDays = (date1: Date | string | number, date2: Date | string | number): number => {
  const parseDate = (d: Date | string | number): number => {
    if (d instanceof Date) return d.getTime();
    if (typeof d === 'number') return d;

    // 此时剩下的一定是 string
    const t = Date.parse(d);
    if (isNaN(t)) throw new Error(`Invalid date string: ${d}`);
    return t;
  };

  let time1 = parseDate(date1);
  let time2 = parseDate(date2);

  // 忽略时分秒，只保留日期
  const d1 = new Date(time1);
  const d2 = new Date(time2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  time1 = d1.getTime();
  time2 = d2.getTime();

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

  let diff = now - start;

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
  // 判断类型
  const typeOfStart = Object.prototype.toString.call(start);
  const typeOfEnd = Object.prototype.toString.call(end);

  // 类型不一致时报错
  if (typeOfStart !== typeOfEnd) {
    throw new Error('开始时间和结束时间的类型不一致！请确保两者都为 Date、字符串或数字。');
  }

  // 显式声明类型为 number
  let startTime: number = 0;
  let endTime: number = 0;

  if (typeOfStart === '[object Date]') {
    startTime = (start as Date).getTime();
    endTime = (end as Date).getTime();
  } else if (typeOfStart === '[object String]') {
    // 统一替换格式以避免 Safari 无法识别 'YYYY-MM-DD HH:mm:ss' 的问题
    startTime = new Date((start as string).replace(/-/g, '/')).getTime();
    endTime = new Date((end as string).replace(/-/g, '/')).getTime();
  } else if (typeOfStart === '[object Number]') {
    startTime = start as number;
    endTime = end as number;
  } else {
    throw new Error('不支持的时间格式，请使用 Date、字符串或数字类型。');
  }

  // 检查是否为有效时间
  if (isNaN(startTime) || isNaN(endTime)) {
    throw new Error('无效的时间值，请检查输入格式。');
  }

  // 明确返回 number 类型
  return endTime - startTime;
}
