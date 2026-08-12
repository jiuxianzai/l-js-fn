import { getAdapter } from '@/uniapp/base.ts';
import type { NetworkStatusChangeResult, NetworkType } from '@/uniapp/types.ts';

class Network {
	private get adapter() {
		return getAdapter();
	}

	private get api() {
		return this.adapter.api;
	}

	/** H5 兜底：通过 navigator.onLine 判断网络是否在线 */
	private static navigatorOnline(): boolean {
		return typeof navigator !== 'undefined' ? navigator.onLine : false;
	}

	/**
	 * 获取当前网络类型
	 * @returns 网络类型，如 'wifi' / '4g' / 'none' / 'unknown'
	 * @example
	 * const type = await network.type()
	 * if (type === 'none') { /* 无网络 *\/ }
	 */
	type(): Promise<NetworkType> {
		return new Promise((resolve) => {
			const api = this.api;
			if (!api.getNetworkType) {
				resolve(Network.navigatorOnline() ? 'unknown' : 'none');
				return;
			}
			api.getNetworkType({
				success: (res: { networkType: NetworkType }) => resolve(res?.networkType || 'unknown'),
				fail: () => resolve('unknown'),
			});
		});
	}

	/**
	 * 判断当前是否联网
	 * @returns 是否在线
	 * @example
	 * const online = await network.isOnline()
	 */
	async isOnline(): Promise<boolean> {
		const t = await this.type();
		return t !== 'none';
	}

	/**
	 * 监听网络状态变化（可通过 network.off() 移除）
	 * @param callback - 变化回调 (isConnected, networkType)
	 * @example
	 * network.watch((online, type) => {
	 *   console.log(online, type)
	 * })
	 */
	watch(callback: (isConnected: boolean, networkType: NetworkType) => void): void {
		const api = this.api;
		if (!api.onNetworkStatusChange) {
			// H5 不支持监听时，注册浏览器事件兜底
			if (typeof window !== 'undefined') {
				const handler = () => callback(Network.navigatorOnline(), 'unknown');
				window.addEventListener('online', handler);
				window.addEventListener('offline', handler);
			}
			return;
		}
		api.onNetworkStatusChange((res: NetworkStatusChangeResult) => {
			callback(res.isConnected, res.networkType);
		});
	}

	/**
	 * 移除网络状态监听
	 * @example
	 * network.off()
	 */
	off(): void {
		const api = this.api;
		if (api.offNetworkStatusChange) {
			api.offNetworkStatusChange();
		}
	}
}

const network = /* @__PURE__ */ new Network();

export { network };
