/**
 * 将日期或时间戳格式化为指定格式的字符串
 * @param date - 要格式化的日期对象或时间戳（毫秒）
 * @param format - 输出格式，默认 `'yyyy-MM-dd HH:mm:ss'`
 * @returns 格式化后的日期字符串
 */
export function dateFormat(date: Date | number, format: string = "yyyy-MM-dd HH:mm:ss"): string {
  const d = typeof date === "number" ? new Date(date) : date;

  const map: Record<string, number> = {
    "M+": d.getMonth() + 1,
    "d+": d.getDate(),
    "H+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  };

  let fmt = format;

  // 年份替代，不用 $1 和 substr
  fmt = fmt.replace(/y+/g, match => d.getFullYear().toString().slice(-match.length));

  // 其他字段替代
  for (const k in map) {
    fmt = fmt.replace(new RegExp(`${k}`), match => {
      const val = map[k].toString();
      return match.length === 1 ? val : val.padStart(match.length, "0");
    });
  }

  return fmt;
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
  let result = "";

  if (secondTime < 60) {
    const secStr = secondTime >= 10 ? secondTime : "0" + secondTime;
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

    const secStr = secondTime >= 10 ? secondTime : "0" + secondTime;
    const minStr = minuteTime >= 10 ? minuteTime : "0" + minuteTime;
    const hourStr = hourTime >= 10 ? hourTime : "0" + hourTime;

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
export const diffDays = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  const parseDate = (d: Date | string | number): number => {
    if (d instanceof Date) return d.getTime();
    if (typeof d === "number") return d;

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

  if (isNaN(start)) return "Invalid date";

  let diff = now - start;

  if (diff < 0) return "刚刚"; // 未来时间也显示刚刚

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  if (diff >= YEAR) {
    const years = Math.floor(diff / YEAR);
    return years + "年前";
  }

  if (diff >= MONTH) {
    const months = Math.floor(diff / MONTH);
    return months + "个月前";
  }

  if (diff >= DAY) {
    const days = Math.floor(diff / DAY);
    return days + "天前";
  }

  if (diff >= HOUR) {
    const hours = Math.floor(diff / HOUR);
    return hours + "小时前";
  }

  if (diff >= MINUTE) {
    const minutes = Math.floor(diff / MINUTE);
    return minutes + "分钟前";
  }

  if (diff >= SECOND) {
    const seconds = Math.floor(diff / SECOND);
    return seconds + "秒前";
  }

  return "刚刚";
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
}
