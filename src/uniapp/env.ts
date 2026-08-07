import { getAdapter } from '@/uniapp/base.ts';
import { isEmpty, isNotEmpty } from '@/libs/is-kit';
import { getUrlParams } from '@/libs/url-kit';
import type { EnvVersion, PlatformInfo } from '@/uniapp/types.ts';

class Env {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 获取当前平台信息
	 * @returns 平台信息对象
	 * @example
	 * const { isWechat, isAlipay } = env.platform()
	 */
	platform(): PlatformInfo {
		const name = this.adapter.name;
		return {
			isWechat: name === 'wechat',
			isAlipay: name === 'alipay',
			isH5: name === 'h5',
			isApp: name === 'app',
			platformName: name,
		};
	}

	/**
	 * 获取当前小程序环境版本
	 * @returns 环境版本信息 { v, d, s }
	 * @example
	 * const { v, d } = await env.version()
	 * // v: 'release', d: '正式版', s: 'wechat'
	 */
	async version(): Promise<EnvVersion> {
		return this.adapter.getEnvVersion();
	}

	/**
	 * 获取小程序启动参数（含扫码参数）
	 * @returns 启动参数完整对象，获取失败返回 null
	 * @example
	 * const opts = env.launchOptions()
	 * // 微信/支付宝统一返回 getLaunchOptionsSync 的完整对象，如 { query, scene, ... }
	 */
	launchOptions(): Record<string, any> | null {
		try {
			return this.adapter.getLaunchOptionsSync();
		} catch {
			return null;
		}
	}

	/**
	 * 获取进入小程序的参数
	 * @returns 进入参数，获取失败返回 undefined
	 * @example
	 * const opts = env.enterOptions()
	 */
	enterOptions(): Record<string, string> | undefined {
		try {
			const enter = this.adapter.api.getEnterOptionsSync();
			return enter.query || {};
		} catch {
			return undefined;
		}
	}

	/**
	 * 解析微信/支付宝扫码参数，提取 URL 和 query 对象
	 * @param options - 小程序页面 onLoad(options) 中的参数对象
	 * @param callback - 解析后的回调函数
	 * @example
	 * env.scanParams(options, (url, paramsObj) => {
	 *   console.log(url, paramsObj)
	 * })
	 */
	scanParams(options: Record<string, any> | undefined, callback?: (url: string, paramsObj: Record<string, any>) => void): void {
		if (isEmpty(options)) return;

		const url = this.adapter.extractScanUrl(options!);

		if (isNotEmpty(url)) {
			const paramsObj = getUrlParams(url);
			if (callback) callback(url!, paramsObj);
		}
	}
}

let env = new Env();

export { env };
