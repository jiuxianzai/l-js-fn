import { isObject } from './is-kit.ts';

/**
 * 深度合并两个对象（非破坏性），后一个对象的属性优先，返回新对象，不修改入参。
 * 递归合并嵌套对象；数组或非对象属性直接以源对象值覆盖。
 *
 * @param target - 目标对象，合并的基准（不会被修改）
 * @param source - 源对象，其属性会覆盖目标对象中的同名属性
 * @param mergeType - 合并类型：'hard' 硬合并(包含两者所有属性)、'soft' 软合并(只包含 target 已有的属性)。默认 'hard'
 * @returns 合并后的新对象
 * @example
 * objMerge({ a: 1 }, { b: 2 }) // { a: 1, b: 2 }
 * objMerge({ a: { b: 1 } }, { a: { c: 2 } }) // { a: { b: 1, c: 2 } }
 * objMerge({ a: 1 }, { a: 2, b: 3 }, 'soft') // { a: 2 }
 */
export function objMerge<T extends Record<string, any>, S extends Record<string, any>>(
	target: T,
	source: S,
	mergeType: 'hard' | 'soft' = 'hard'
): T & S {
	if (Array.isArray(source)) {
		return source.slice() as unknown as T & S;
	}

	// 循环引用检测：已访问过的源对象不再递归
	const visited = new WeakSet<object>();

	const merge = <A extends Record<string, any>, B extends Record<string, any>>(t: A, s: B): A & B => {
		const base = isObject(t) ? ({ ...t } as Record<string, any>) : ({} as Record<string, any>);
		if (!isObject(s) || visited.has(s as object)) {
			return base as A & B;
		}
		visited.add(s as object);

		Object.keys(s).forEach((property) => {
			const sourceProperty = s[property];

			if (mergeType === 'soft' && !Object.prototype.hasOwnProperty.call(base, property)) {
				return;
			}

			if (isObject(sourceProperty)) {
				base[property] = merge(base[property] ?? ({} as Record<string, any>), sourceProperty);
			} else {
				base[property] = sourceProperty;
			}
		});

		return base as A & B;
	};

	return merge(target, source) as T & S;
}

/**
 * 过滤对象中不需要的 key，返回过滤后的新对象
 * @param obj - 源对象
 * @param keys - 需要过滤的 key 数组
 * @returns 新对象
 */
export function objFilterProp<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const keySet = new Set(keys as string[]);
	return Object.fromEntries(Object.entries(obj).filter(([key]) => !keySet.has(key))) as Omit<T, K>;
}

/**
 * 过滤对象中的空值 (null 或 undefined)
 * @param obj - 源对象
 * @param options - 过滤选项，默认都过滤
 * @param options.null - 是否过滤 null，默认 true
 * @param options.undefined - 是否过滤 undefined，默认 true
 * @returns 新对象
 * @example
 * objFilterNull({ a: 1, b: null, c: undefined }) // { a: 1 }
 * objFilterNull({ a: 1, b: null, c: undefined }, { null: true, undefined: false }) // { a: 1, c: undefined }
 */
export function objFilterNull<T extends Record<string, any>>(obj: T, options: { null?: boolean; undefined?: boolean } = {}): Partial<T> {
	const { null: filterNull = true, undefined: filterUndefined = true } = options;

	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => {
			if (filterNull && value === null) return false;
			if (filterUndefined && value === undefined) return false;
			return true;
		})
	) as Partial<T>;
}

/**
 * 将 JSON 对象转换为 FormData
 * @param data JSON 数据对象
 * @param formData 可选：已有 FormData 实例（用于递归）
 * @param parentKey 可选：父级键名前缀（用于递归）
 * @returns FormData
 */
export function objToFormData(data: Record<string, unknown>, formData: FormData = new FormData(), parentKey: string = ''): FormData {
	if (!data || typeof data !== 'object') {
		return formData;
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
			value.forEach((item: unknown, index) => {
				const arrayKey = `${fullKey}[${index}]`;
				if (typeof item === 'object' && !(item instanceof File)) {
					objToFormData(item as Record<string, unknown>, formData, arrayKey);
				} else {
					formData.append(arrayKey, item as string | Blob);
				}
			});
		} else if (typeof value === 'object') {
			// 递归嵌套对象
			objToFormData(value as Record<string, unknown>, formData, fullKey);
		} else {
			formData.append(fullKey, value as string | Blob);
		}
	});

	return formData;
}

/**
 * formData 转 json
 * @param formData - FormData 实例
 * @returns 普通对象
 */
export function objFromFormData(formData: FormData): Record<string, string | number> {
	const obj: Record<string, string | number> = {};
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
 * objPick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // { a: 1, c: 3 }
 */
export function objPick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
	return keys.reduce((acc, key) => {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			acc[key] = obj[key];
		}
		return acc;
	}, {} as Pick<T, K>);
}

/**
 * 排除对象中指定 key 的属性，返回一个新对象
 * @param obj - 源对象
 * @param keys - 需要排除的键名数组
 * @returns 排除指定属性后的新对象
 * @example
 * objOmit({ a: 1, b: 2, c: 3 }, ['b']) // { a: 1, c: 3 }
 * objOmit({ a: 1, b: 2 }, [])           // { a: 1, b: 2 }
 */
export function objOmit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
	const keySet = new Set(keys as string[]);
	const result = {} as Record<string, any>;
	const ownKeys = Object.keys(obj);
	for (let i = 0; i < ownKeys.length; i++) {
		const key = ownKeys[i];
		if (!keySet.has(key)) {
			result[key] = obj[key];
		}
	}
	return result as Omit<T, K>;
}

/**
 * 从对象中安全获取深层属性值
 * @param obj - 目标对象
 * @param path - 属性路径，如 'a.b.c' 或 'a[0].b'
 * @param defaultValue - 当路径不存在时的默认返回值
 * @returns 属性值或默认值
 * @example
 * objGet({ a: { b: { c: 1 } } }, 'a.b.c') // 1
 * objGet({ a: 1 }, 'b.c', 'default') // 'default'
 */
export function objGet<T = unknown>(obj: unknown, path: string, defaultValue?: T): T | undefined {
	if (obj === null || obj === undefined) return defaultValue;

	const keys = path
		.replace(/\[(\d+)\]/g, '.$1')
		.split('.')
		.filter(Boolean);

	let result: unknown = obj;
	for (const key of keys) {
		if (result === null || result === undefined) return defaultValue;
		result = (result as Record<string, unknown>)[key];
	}

	return (result !== undefined ? result : defaultValue) as T | undefined;
}
