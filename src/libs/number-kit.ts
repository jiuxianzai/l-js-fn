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
  let num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) return String(value);

  if (useUnit) {
    // 中文单位
    if (num >= 1e8) {
      return `${(num / 1e8).toFixed(2).replace(/\.00$/, "")}亿`;
    }
    if (num >= 1e4) {
      return `${(num / 1e4).toFixed(2).replace(/\.00$/, "")}万`;
    }
    return String(num);
  } else {
    // 千分位分割
    return num.toLocaleString("en-US");
  }
};

/**
 * 数字转百分比
 * @param num - 数字
 * @param fixed - 保留小数位数，默认 2
 * @returns 返回百分比字符串，例如 "12.35%"
 * @example
 * numberToPercent(0.123456) // "12.35%"
 * numberToPercent(0.5, 0)   // "50%"
 */
export const numberToPercent = (num: number, fixed = 2): string => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new TypeError(`Invalid number: ${num}`);
  }

  return (num * 100).toFixed(fixed) + "%";
};

/**
 * 随机获得一个整数（支持负数）
 * @param min - 最小值（必填参数），可以是负数；
 *              如果只传入一个参数，则该值会作为最大值，最小值默认是 0。
 * @param max - 最大值（可选参数），必须大于 0。
 *              如果不传，则函数会将 min 视为最大值，最小值默认是 0。
 * @returns 返回一个在指定范围内的随机整数。
 */
export function random(min: number, max?: number): number {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  if (typeof min !== "number" || typeof max !== "number") {
    throw new Error("参数必须是数字");
  }

  if (max <= 0 && arguments.length === 1) {
    throw new Error("当只有一个参数时，最大值必须大于 0");
  }

  if (min > max) {
    throw new Error("最小值不能大于最大值");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
