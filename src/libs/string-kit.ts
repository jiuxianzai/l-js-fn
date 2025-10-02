/**
 * 对字符串脱敏处理
 * @param str - 要处理的字符串
 * @param start - 从哪个位置开始脱敏，基于 0 的索引
 * @param count - 需要脱敏的字符数，默认为 3
 * @returns 脱敏后的字符串
 * @throws Error - 如果 start 或 count 无效
 */
export function desensitization(str: string, start: number, count = 3): string {
  if (!str || str.length === 0) return "";

  if (start < 0 || start >= str.length) {
    throw new Error("start 参数不能大于等于字符串的长度");
  }

  if (count < 0 || start + count > str.length) {
    throw new Error("count 参数超出了字符串的有效范围");
  }

  const end = start + count;
  const masked = "*".repeat(count);

  return str.slice(0, start) + masked + str.slice(end);
}

/**
 * 去除空格
 * @param str - 需要去除的字符串
 * @param pos - 去除的空格类型，默认 'both'
 * @returns 去除空格后的字符串
 */
export function trim(str: string, pos: "both" | "left" | "right" | "all" = "both"): string {
  str = String(str);
  switch (pos) {
    case "both":
      return str.replace(/^\s+|\s+$/g, "");
    case "left":
      return str.replace(/^\s*/, "");
    case "right":
      return str.replace(/\s*$/g, "");
    case "all":
      return str.replace(/\s+/g, "");
    default:
      return str;
  }
}

/**
 * 随机生成手机号
 * @returns 随机手机号码
 */
export function getMobile(): string {
  const prefixArray = ["130", "131", "132", "133", "135", "137", "138", "155", "158", "170", "187", "188", "189"];
  const prefix = prefixArray[Math.floor(Math.random() * prefixArray.length)];
  const suffix = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + suffix;
}

/**
 * 随机生成 UUID
 * @returns 生成的 UUID 字符串
 */
export function getUuid(): string {
  let d = new Date().getTime();
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
