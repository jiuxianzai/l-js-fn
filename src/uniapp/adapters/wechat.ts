import type { PlatformAdapter } from '@/uniapp/types.ts';

declare const __wxConfig: { envVersion?: string } | undefined;

const VERSION_LABEL: Record<string, string> = {
	release: '正式版',
	trial: '体验版',
	develop: '开发版',
};

/** 微信 showToast 支持的 icon 类型 */
const WECHAT_SUPPORTED_ICONS = ['success', 'error', 'loading', 'none'];
/** 微信不支持的类型降级映射 */
const WECHAT_ICON_FALLBACK: Record<string, string> = {
	fail: 'error',
	exception: 'none',
};

/**
 * 创建微信小程序适配器
 * @param api - 微信原生 wx 对象
 */
export function createWechatAdapter(api: Record<string, any>): PlatformAdapter {
	return {
		name: 'wechat',
		api,

		// === 存储：微信用位置参数 (key, data) ===
		setStorageSync(key, data) {
			api.setStorageSync(key, data);
		},
		getStorageSync(key) {
			const raw = api.getStorageSync(key);
			return typeof raw === 'string' && raw !== '' ? raw : null;
		},
		removeStorageSync(key) {
			api.removeStorageSync(key);
		},
		clearStorageSync() {
			api.clearStorageSync();
		},

		// === Toast：微信用 title/icon ===
		showToast(title, icon, duration, mask, image) {
			const fallbackIcon = WECHAT_ICON_FALLBACK[icon] || icon;
			const safeIcon = WECHAT_SUPPORTED_ICONS.includes(fallbackIcon) ? fallbackIcon : 'none';
			const opts: Record<string, any> = { title, icon: safeIcon, duration, mask };
			if (image) opts.image = image;
			api.showToast(opts);
		},
		showLoading(title, mask) {
			api.showLoading({ title, mask });
		},
		hideLoading() {
			api.hideLoading();
		},

		// === 权限：微信先 getSetting 预检，再 authorize，被拒后可 openSetting ===
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
		openSetting() {
			return new Promise((resolve) => {
				if (!api.openSetting) {
					resolve(false);
					return;
				}
				api.openSetting({
					success: () => resolve(true),
					fail: () => resolve(false),
				});
			});
		},

		// === 环境 ===
		async getEnvVersion() {
			const cfg = typeof __wxConfig !== 'undefined' ? __wxConfig : undefined;
			const v = cfg?.envVersion || 'release';
			return { v, d: VERSION_LABEL[v] || '', s: 'wechat' };
		},
		getLaunchOptionsSync() {
			return api.getLaunchOptionsSync?.() ?? null;
		},
		extractScanUrl(options) {
			if (options && options.q) {
				try {
					return decodeURIComponent(options.q as string);
				} catch {
					return options.q as string;
				}
			}
			return undefined;
		},

		// === 文件系统：微信用 uni.getFileSystemManager + wx.env.USER_DATA_PATH ===
		getFileSystemManager() {
			return api.getFileSystemManager?.() ?? null;
		},
		getUserDataPath() {
			return api.env?.USER_DATA_PATH || '';
		},
		fileWrite(filePath, data) {
			return new Promise((resolve, reject) => {
				api.getFileSystemManager().writeFile({
					filePath,
					data,
					encoding: 'utf8',
					success: () => resolve(),
					fail: (err: any) => reject(err),
				});
			});
		},
		fileRead(filePath) {
			return new Promise((resolve, reject) => {
				api.getFileSystemManager().readFile({
					filePath,
					encoding: 'utf8',
					success: (res: any) => resolve(res?.data ?? ''),
					fail: (err: any) => reject(err),
				});
			});
		},
		fileAccess(filePath) {
			return new Promise((resolve) => {
				api.getFileSystemManager().access({
					path: filePath,
					success: () => resolve(true),
					fail: () => resolve(false),
				});
			});
		},
		fileRemove(filePath) {
			return new Promise((resolve, reject) => {
				api.getFileSystemManager().unlink({
					filePath,
					success: () => resolve(),
					fail: (err: any) => reject(err),
				});
			});
		},
	};
}
