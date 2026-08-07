import type { PlatformAdapter } from '@/uniapp/types.ts';

/** uni（H5/App）showToast 支持的 icon 类型 */
const UNI_SUPPORTED_ICONS = ['success', 'error', 'loading', 'none'];
/** uni 不支持的类型降级映射 */
const UNI_ICON_FALLBACK: Record<string, string> = {
	fail: 'error',
	exception: 'none',
};

/**
 * 创建 H5 适配器（基于 uni API，参数格式与微信一致）
 * @param api - uni 全局对象
 */
export function createH5Adapter(api: Record<string, any>): PlatformAdapter {
	return {
		name: 'h5',
		api,

		// === 存储：H5 用位置参数 (key, data) ===
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

		// === Toast：H5 用 title/icon ===
		showToast(title, icon, duration, mask, image) {
			const fallbackIcon = UNI_ICON_FALLBACK[icon] || icon;
			const safeIcon = UNI_SUPPORTED_ICONS.includes(fallbackIcon) ? fallbackIcon : 'none';
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

		// === 权限：H5 无小程序权限体系，恒为已授权 ===
		async checkPermission() {
			return true;
		},
		async requestPermission() {
			return true;
		},

		// === 环境：H5 不支持环境版本/启动参数/扫码 ===
		async getEnvVersion() {
			throw new Error('env.version: H5 环境不支持获取环境版本');
		},
		getLaunchOptionsSync() {
			return null;
		},
		extractScanUrl() {
			return undefined;
		},

		// === 文件系统：H5 用 uni.getFileSystemManager + uni.env.USER_DATA_PATH ===
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
