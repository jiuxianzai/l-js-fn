/**
 * 将日期或时间戳格式化为指定格式的字符串
 * @param date - 要格式化的日期对象或时间戳（毫秒）
 * @param format - 输出格式，默认 `'yyyy-MM-dd HH:mm:ss'`
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number, format: string = 'yyyy-MM-dd HH:mm:ss'): string {
  const d = typeof date === 'number' ? new Date(date) : date;

  const map: Record<string, number> = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'H+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds(),
  };

  let fmt = format;

  // 年份替代，不用 $1 和 substr
  fmt = fmt.replace(/y+/g, match => d.getFullYear().toString().slice(-match.length));

  // 其他字段替代
  for (const k in map) {
    fmt = fmt.replace(new RegExp(`${k}`), match => {
      const val = map[k].toString();
      return match.length === 1 ? val : val.padStart(match.length, '0');
    });
  }

  return fmt;
}

/**
 * 将秒数转换为 HH:mm:ss 格式
 * @param value - 秒数
 * @returns 格式化后的字符串，例如 "00:12:34"
 */
export function getSecond(value: number): string {
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
