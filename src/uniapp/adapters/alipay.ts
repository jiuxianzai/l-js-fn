import type { PlatformAdapter } from '@/uniapp/types.ts';

const VERSION_LABEL: Record<string, string> = {
	release: '正式版',
	trial: '体验版',
	develop: '开发版',
};

/** 微信 icon → 支付宝 type 映射 */
const ALIPAY_ICON_MAP: Record<string, string> = {
	success: 'success',
	error: 'fail',
	loading: 'none',
	fail: 'fail',
	exception: 'exception',
	none: 'none',
};

/**
 * 创建支付宝小程序适配器
 * @param api - 支付宝原生 my 对象
 */
export function createAlipayAdapter(api: Record<string, any>): PlatformAdapter {
	return {
		name: 'alipay',
		api,

		// === 存储：支付宝用对象参数 { key, data } ===
		setStorageSync(key, data) {
			api.setStorageSync({ key, data });
		},
		getStorageSync(key) {
			const raw = api.getStorageSync({ key });
			const data = raw?.data;
			return typeof data === 'string' && data !== '' ? data : null;
		},
		removeStorageSync(key) {
			api.removeStorageSync({ key });
		},
		clearStorageSync() {
			api.clearStorageSync();
		},

		// === Toast：支付宝用 content/type，不支持 mask 参数 ===
		showToast(title, icon, duration, _mask, image) {
			const opts: Record<string, any> = {
				content: title,
				type: ALIPAY_ICON_MAP[icon] || 'none',
				duration,
			};
			if (image) opts.image = image;
			api.showToast(opts);
		},
		showLoading(title, _mask) {
			api.showLoading({ content: title });
		},
		hideLoading() {
			api.hideLoading();
		},

		// === 权限：支付宝先 getSetting 查状态，未授权时 authorize ===
		async checkPermission(scope) {
			if (!api.getSetting) return false;
			return new Promise((resolve) => {
				api.getSetting({
					success: (res: any) => resolve(!!res?.authSetting?.[scope]),
					fail: () => resolve(false),
				});
			});
		},
		requestPermission(scope) {
			return new Promise((resolve) => {
				if (!api.authorize) {
					resolve(false);
					return;
				}
				api.authorize({
					scope,
					success: () => resolve(true),
					fail: () => resolve(false),
				});
			});
		},

		// === 环境 ===
		async getEnvVersion() {
			if (!api.getRunScene) {
				throw new Error('env.version: 当前环境不支持 my.getRunScene');
			}
			return new Promise((resolve, reject) => {
				api.getRunScene({
					success: (res: { envVersion: string }) =>
						resolve({
							v: res.envVersion,
							d: VERSION_LABEL[res.envVersion] || '',
							s: 'alipay',
						}),
					fail: reject,
				});
			});
		},
		getLaunchOptionsSync() {
			return api.getLaunchOptionsSync?.() ?? null;
		},
		extractScanUrl(options) {
			if (!options) return undefined;
			return options.query?.qrCode || options.qrCode || undefined;
		},
	};
}
