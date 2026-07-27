/**
 * 合并两个对象，后一个对象的属性优先。递归合并嵌套对象，数组会直接复制。
 * 如果属性不是对象，则源对象的值会覆盖目标对象的值。
 *
 * @param target - 目标对象，合并结果会存储在该对象中，且该对象会被修改。
 * @param source - 源对象或数组，源对象的属性会覆盖目标对象中的同名属性。
 * @param mergeType - 合并类型：'hard' 硬合并(包含2者所有属性)、'soft' 软合并(只包含 target 对象的属性)。默认 'hard'
 * @returns 合并后的目标对象
 */
export function objMerge<T extends Record<string, any>, S extends Record<string, any>>(
	target: T,
	source: S,
	mergeType: 'hard' | 'soft' = 'hard'
): T & S {
	if (typeof target !== 'object' || target === null) {
		target = {} as T;
	}
	if (Array.isArray(source)) {
		// 如果 source 是数组，直接返回副本
		return source.slice() as any;
	}

	Object.keys(source).forEach((property) => {
		const sourceProperty = source[property];

		// 软合并模式下，若 target 不包含此属性，则跳过
		if (mergeType === 'soft' && !target.hasOwnProperty(property)) {
			return;
		}

		if (typeof sourceProperty === 'object' && sourceProperty !== null && !Array.isArray(sourceProperty)) {
			(target as Record<string, any>)[property] = objMerge((target as Record<string, any>)[property] || {}, sourceProperty, mergeType);
		} else {
			(target as T & S)[property as keyof (T & S)] = sourceProperty as any;
		}
	});

	return target as T & S;
}

/**
 * 过滤对象中不需要的 key，返回过滤后的新对象
 * @param obj - 源对象
 * @param keys - 需要过滤的 key 数组
 * @returns 新对象
 */
export function objFilterProp<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keys.includes(key as K))) as Omit<T, K>;
}

/**
 * 过滤对象中的空值 (null 或 undefined)
 * @param obj - 源对象
 * @returns 新对象，过滤掉值为 null 或 undefined 的属性
 */
export function objFilterNull<T extends Record<string, any>>(obj: T): Partial<T> {
	return Object.entries(obj)
		.filter(([_, value]) => value !== null && value !== undefined)
		.reduce((acc, [key, value]) => {
			acc[key as keyof T] = value;
			return acc;
		}, {} as Partial<T>);
}

/**
 * 判断对象是否存在属性
 * @param obj - 对象
 * @param key - 属性键
 */
export function isHasProperties(obj: Record<string, any>, key: string): boolean {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 将 JSON 对象转换为 FormData
 * @param data JSON 数据对象
 * @param formData 可选：已有 FormData 实例（用于递归）
 * @param parentKey 可选：父级键名前缀
 * @returns FormData
 */
export function jsonToFormData(data: Record<string, any>, formData: FormData = new FormData(), parentKey: string = ''): FormData {
	if (!data || typeof data !== 'object') {
		throw new TypeError('jsonToFormData: 参数 data 必须是对象');
	}

	Object.keys(data).forEach((key) => {
		const value = data[key];
		if (value === undefined || value === null) return;

		// 构造完整键名
		const fullKey = parentKey ? `${parentKey}[${key}]` : key;

		if (value instanceof Date) {
			formData.append(fullKey, value.toISOString());
		} else if (value instanceof File || value instanceof Blob) {
			formData.append(fullKey, value);
		} else if (Array.isArray(value)) {
			value.forEach((item, index) => {
				const arrayKey = `${fullKey}[${index}]`;
				if (typeof item === 'object' && !(item instanceof File)) {
					jsonToFormData(item, formData, arrayKey);
				} else {
					formData.append(arrayKey, item);
				}
			});
		} else if (typeof value === 'object') {
			// 递归嵌套对象
			jsonToFormData(value, formData, fullKey);
		} else {
			formData.append(fullKey, value);
		}
	});

	return formData;
}

/**
 * formData 转 json
 * @param formData
 */
export function formDataToObject(formData: FormData): Record<string, any> {
	const obj: Record<string, any> = {};
	for (const [key, value] of formData.entries()) {
		const strValue = value.toString();
		// 如果全是数字字符串，就转成 number
		obj[key] = /^\d+$/.test(strValue) ? Number(strValue) : strValue;
	}
	return obj;
}

/**
 * 从对象中选取指定属性，返回新对象
 * @param obj - 源对象
 * @param keys - 需要选取的属性名数组
 * @returns 只包含指定属性的新对象
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	return keys.reduce((acc, key) => {
		if (key in obj) {
			acc[key] = obj[key];
		}
		return acc;
	}, {} as Pick<T, K>);
}

/**
 * 从对象中安全获取深层属性值
 * @param obj - 目标对象
 * @param path - 属性路径，如 'a.b.c' 或 'a[0].b'
 * @param defaultValue - 当路径不存在时的默认返回值
 * @returns 属性值或默认值
 * @example
 * get({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 * get({ a: 1 }, 'b.c', 'default') // 'default'
 */
export function get<T = any>(obj: any, path: string, defaultValue?: T): T | undefined {
	if (obj === null || obj === undefined) return defaultValue;

	const keys = path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean);

	let result: any = obj;
	for (const key of keys) {
		if (result === null || result === undefined) return defaultValue;
		result = result[key];
	}

	return result !== undefined ? result : defaultValue;
}

/**
 * 深度合并多个对象，后一个对象的属性会覆盖前一个对象
 * @param sources - 需要合并的对象数组
 * @returns 深度合并后的新对象
 * @example
 * deepMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 */
export function deepMerge<T extends Record<string, any>>(...sources: T[]): T {
	const result: Record<string, any> = {};

	for (const source of sources) {
		if (!source || typeof source !== 'object') continue;

		for (const key of Object.keys(source)) {
			const val = source[key];
			if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date) && !(val instanceof RegExp)) {
				result[key] = deepMerge(result[key] || {}, val);
			} else {
				result[key] = val;
			}
		}
	}

	return result as T;
}
