async function loadSmCrypto(): Promise<any> {
	try {
		// sm-crypto 是 CJS 包，Node ESM 动态导入返回 { default: {sm2,sm3,sm4}, sm2 }，sm3 只在 default 上
		const mod = await import('sm-crypto');
		return mod.default ?? mod;
	} catch {
		throw new Error('SM3 requires the "sm-crypto" package.\nInstall it: npm install sm-crypto');
	}
}

/**
 * SM3 哈希算法（国密），返回 64 位十六进制字符串
 * @param data - 待哈希的字符串
 * @returns SM3 哈希结果（64 位 hex 字符串）
 * @example
 * ```ts
 * const hash = await sm3('abc');
 * // '66c7f0f462eeedd9d1f2d46bdc10e4e24167c4875cf2f7a2297da02b8f4ba8e0'
 * ```
 */
export async function sm3(data: string): Promise<string> {
	const smCrypto = await loadSmCrypto();
	return smCrypto.sm3(data);
}
