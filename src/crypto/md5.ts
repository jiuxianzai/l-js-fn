import crypto from 'crypto';
import { stringToBytes } from '@/crypto/utils';

/**
 * MD5 哈希算法
 * @param input - 待哈希的字符串
 * @param options - 配置选项
 * @returns 32 位十六进制哈希字符串
 */
export function md5(input: string, options?: { salt?: string }): string {
	const text = options?.salt ? input + options.salt : input;
	return crypto.createHash('md5').update(text, 'utf-8').digest('hex');
}
