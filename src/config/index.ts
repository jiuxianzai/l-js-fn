/**
 * 常见日期格式
 */
export const DATE_FORMAT = {
	FULL: 'yyyy-MM-dd HH:mm:ss', // 完整时间
	DATE: 'yyyy-MM-dd', // 年月日
	TIME: 'HH:mm:ss', // 时分秒
	SHORT: 'MM-dd', // 月日
	YEAR_MONTH: 'yyyy-MM', // 年月
} as const;

/**
 * HTTP状态码
 */
export const HTTP_STATUS = {
	OK: 200,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	SERVER_ERROR: 500,
	SERVER_UNAVAILABLE: 503,
} as const;
