import { getAdapter } from '@/uniapp/base.ts';
import type { CapsuleInfo, DeviceInfo, SafeAreaInsets } from '@/uniapp/types.ts';

class Device {
	private _info: DeviceInfo | null = null;

	private get adapter() {
		return getAdapter();
	}

	/**
	 * 获取设备/系统信息（首次调用缓存，可通过 refresh() 强制刷新）
	 * @returns 设备信息对象（含状态栏高度、安全区、屏幕尺寸等常用字段）
	 * @example
	 * const info = device.info()
	 * console.log(info.statusBarHeight, info.screenWidth)
	 */
	info(): DeviceInfo {
		if (this._info) return this._info;

		const sys = this.adapter.api.getSystemInfoSync?.() || {};
		const safeArea = sys.safeArea as DeviceInfo['safeArea'];

		const safeAreaInsets: SafeAreaInsets = safeArea
			? {
					top: safeArea.top,
					right: (sys.screenWidth || 0) - safeArea.right,
					bottom: (sys.screenHeight || 0) - safeArea.bottom,
					left: safeArea.left,
				}
			: {
					top: sys.statusBarHeight || 0,
					right: 0,
					bottom: 0,
					left: 0,
				};

		this._info = {
			brand: sys.brand || '',
			model: sys.model || '',
			system: sys.system || '',
			platform: sys.platform || '',
			statusBarHeight: sys.statusBarHeight || 0,
			screenWidth: sys.screenWidth || 0,
			screenHeight: sys.screenHeight || 0,
			windowWidth: sys.windowWidth || 0,
			windowHeight: sys.windowHeight || 0,
			pixelRatio: sys.pixelRatio || 1,
			safeArea: safeArea ? { ...safeArea } : undefined,
			safeAreaInsets,
		};

		return this._info;
	}

	/**
	 * 强制刷新设备信息（横竖屏切换、onResize 时调用）
	 * @returns 刷新后的设备信息
	 * @example
	 * device.refresh()
	 */
	refresh(): DeviceInfo {
		this._info = null;
		return this.info();
	}

	/**
	 * 获取状态栏高度
	 * @returns 状态栏高度（px），获取失败返回 0
	 * @example
	 * const barHeight = device.statusBarHeight()
	 */
	statusBarHeight(): number {
		return this.info().statusBarHeight;
	}

	/**
	 * 获取安全区内边距
	 * @returns 安全区内边距 { top, right, bottom, left }（px）
	 * @example
	 * const { bottom } = device.safeAreaInsets()
	 * // bottom > 0 表示底部有 Home 指示条（iPhone X 系）
	 */
	safeAreaInsets(): SafeAreaInsets {
		return this.info().safeAreaInsets;
	}

	/**
	 * 获取小程序右上角胶囊按钮位置（微信/支付宝支持，其余平台返回 null）
	 * @returns 胶囊按钮位置信息或 null
	 * @example
	 * const capsule = device.capsule()
	 * if (capsule) { /* 自定义右上角按钮对齐胶囊 *\/ }
	 */
	capsule(): CapsuleInfo | null {
		const info = this.adapter.getMenuButtonInfo?.();
		return info ? (info as CapsuleInfo) : null;
	}

	/**
	 * 判断底部是否在安全区内（用于 iPhone X 系刘海屏底部操作栏适配）
	 * @param bottom - 底部偏移阈值（px），默认 0
	 * @returns 底部存在安全区（Home 指示条）时为 true
	 * @example
	 * if (device.isInSafeArea()) {
	 *   /* 底部按钮加上 safeAreaInsets().bottom 的内边距 *\/ 
	 * }
	 */
	isInSafeArea(bottom = 0): boolean {
		return this.safeAreaInsets().bottom > bottom;
	}
}

const device = /* @__PURE__ */ new Device();

export { device };
