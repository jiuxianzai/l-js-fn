/**
 * 常用正则表达式常量集合
 *
 * 提供开箱即用的正则常量，可直接通过 `REGEXP.XXX.test(str)` 使用。
 */
export const REGEXP = {
	/**
	 * 中国大陆手机号
	 * 规则：1 开头，第二位为 3-9，共 11 位数字
	 * @example REGEXP.PHONE.test('13800138000') // true
	 */
	PHONE: /^1[3-9]\d{9}$/,

	/**
	 * 座机号码（支持带区号）
	 * 规则：0 开头，区号 2-3 位（可省略连接符），号码 7-8 位
	 * @example REGEXP.LAND_LINE.test('010-12345678') // true
	 */
	LAND_LINE: /^0\d{2,3}-?\d{7,8}$/,

	/**
	 * 邮箱地址
	 * @example REGEXP.EMAIL.test('test@example.com') // true
	 */
	EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

	/**
	 * 强密码（长度 8-16，包含大小写字母、数字、特殊字符，不允许空格）
	 * @example REGEXP.PASSWORD.test('Pass123!') // true
	 */
	PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9\s])\S{8,16}$/,

	/**
	 * URL 地址（支持协议、用户名密码、域名/IP、端口、路径，不支持 IPv6）
	 * @warning 此正则包含嵌套量词，恶意长输入可能触发 ReDoS。生产环境建议使用 `new URL()` 替代
	 * @example REGEXP.URL.test('https://example.com') // true
	 */
	URL: /^((https?|ftp|rtsp|mms):\/\/)(([0-9a-zA-Z_!~*'().&=+$%-]+:)?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+\.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\.[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)$/,

	/**
	 * 身份证号（15 位或 18 位，18 位最后一位可能为 X/x）
	 * @example REGEXP.ID_CARD.test('110101199001011234') // true
	 */
	ID_CARD: /^(?:\d{15}|\d{17}[\dXx])$/,

	/**
	 * 只允许中文
	 * @example REGEXP.CHINESE.test('中文') // true
	 */
	CHINESE: /^[\u4e00-\u9fa5]+$/,

	/**
	 * 只允许英文
	 * @example REGEXP.ENGLISH.test('Hello') // true
	 */
	ENGLISH: /^[A-Za-z]+$/,

	/**
	 * 只允许数字
	 * @example REGEXP.NUMBER.test('12345') // true
	 */
	NUMBER: /^\d+$/,

	/**
	 * 只允许正整数
	 * @example REGEXP.POSITIVE_NUMBER.test('123') // true
	 */
	POSITIVE_NUMBER: /^[1-9]\d*$/,

	/**
	 * 整数（含正负号）
	 * @example REGEXP.INTEGER.test('-123') // true
	 */
	INTEGER: /^(-|\+)?\d+$/,

	/**
	 * 英文 + 数字（常用账号规则）
	 * @example REGEXP.EN_OR_NUM.test('abc123') // true
	 */
	EN_OR_NUM: /^[A-Za-z0-9]+$/,

	/**
	 * 英文 + 数字 + 下划线
	 * @example REGEXP.EN_NUM_UNDER_LINE.test('abc_123') // true
	 */
	EN_NUM_UNDER_LINE: /^\w+$/,

	/**
	 * 不包含特殊字符（仅中英文、数字）
	 * @example REGEXP.NO_SPECIAL.test('中文abc123') // true
	 */
	NO_SPECIAL: /^[\u4e00-\u9fa5A-Za-z0-9]+$/,

	/**
	 * 金额，支持两位小数
	 * @example REGEXP.MONEY.test('123.45') // true
	 */
	MONEY: /^(0|[1-9]\d*)(\.\d{1,2})?$/,

	/**
	 * IPv4 地址
	 * @example REGEXP.IPV4.test('192.168.1.1') // true
	 */
	IPV4: /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/,

	/**
	 * 十六进制颜色值（#fff / #ffffff）
	 * @example REGEXP.HEX_COLOR.test('#fff') // true
	 */
	HEX_COLOR: /^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,

	/**
	 * 中国邮政编码（6 位数字，首位非 0）
	 * @example REGEXP.POSTAL_CODE.test('100000') // true
	 */
	POSTAL_CODE: /^[1-9]\d{5}$/,

	/**
	 * 中国车牌号（含新能源，8 位）
	 * @example REGEXP.PLATE_NUMBER.test('京A12345') // true
	 */
	PLATE_NUMBER: /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青川藏宁琼][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警]$/,

	/**
	 * 小数/浮点数（支持正负）
	 * @example REGEXP.DECIMAL.test('-1.5') // true
	 */
	DECIMAL: /^-?(0|[1-9]\d*)\.\d+$/,

	/**
	 * 日期格式 yyyy-MM-dd
	 * @example REGEXP.DATE.test('2024-01-01') // true
	 */
	DATE: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,

	/**
	 * 时间格式 HH:mm:ss（秒可选）
	 * @example REGEXP.TIME.test('12:30:00') // true
	 */
	TIME: /^(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/,

	/**
	 * 域名（不含协议和路径）
	 * @example REGEXP.DOMAIN.test('example.com') // true
	 */
	DOMAIN: /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,

	/**
	 * 统一社会信用代码（18 位）
	 * @example REGEXP.TAX_ID.test('91110108551111111A') // true
	 */
	TAX_ID: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,

	/**
	 * 银行卡号（16-19 位，首位非 0）
	 * @example REGEXP.BANK_CARD.test('6222021234567890') // true
	 */
	BANK_CARD: /^[1-9]\d{15,18}$/,
} as const;
