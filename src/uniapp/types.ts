export interface ShowModalOptions {
	title?: string;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
}

export interface ToastOptions {
	duration?: number;
	mask?: boolean;
	icon?: 'success' | 'error' | 'loading' | 'none' | 'fail' | 'exception';
	image?: string;
}

export interface UniStorageOptions {
	expire?: number;
	encrypt?: boolean;
}

export interface UniStorageItem<T> {
	value: T;
	expire: number;
}

export interface UniAppApi {
	getStorageSync(key: string): any;
	setStorageSync(key: string, value: any): void;
	removeStorageSync(key: string): void;
	clearStorageSync(): void;
	getStorageInfoSync(): { keys: string[] };
	getSystemInfoSync(): UniSystemInfo;
	getSystemInfo(options: { success: (res: UniSystemInfo) => void; fail?: (err: any) => void }): void;
	showModal(options: {
		title?: string;
		content?: string;
		confirmText?: string;
		cancelText?: string;
		showCancel?: boolean;
		success?: (res: { confirm: boolean; cancel: boolean }) => void;
		fail?: (err: any) => void;
	}): void;
	showToast(options: { title: string; icon?: string; image?: string; duration?: number; mask?: boolean; success?: () => void; fail?: (err: any) => void }): void;
	showLoading(options: { title: string; mask?: boolean; success?: () => void; fail?: (err: any) => void }): void;
	hideLoading(options?: { success?: () => void; fail?: (err: any) => void }): void;
}

export interface UniSystemInfo {
	platform: string;
	[key: string]: any;
}

export type PlatformType = 'wechat' | 'alipay' | 'h5' | 'app';

export interface RouterOptions {
	query?: Record<string, string | number | boolean>;
	params?: Record<string, any>;
	encode?: boolean;
}

export type RouterNextFn = (path?: string) => void;

export type RouterGuardFn = (to: string, from: string, next: RouterNextFn) => void;

export interface PlatformInfo {
	isWechat: boolean;
	isAlipay: boolean;
	isH5: boolean;
	isApp: boolean;
	platformName: string;
}

export interface EnvVersion {
	v: string;
	d: string;
	s: string;
}

export interface RequestExtraConfig {
	retry?: number;
	retryDelay?: number;
	loading?: boolean;
}

/**
 * 平台适配器接口
 * 封装各平台（微信/支付宝/H5/App）在存储、Toast、权限、环境信息上的行为差异。
 * 新增平台只需实现该接口并通过 registerAdapter 注册。
 */
export interface PlatformAdapter {
	/** 平台标识：'wechat' | 'alipay' | 'h5' | 'app' 或自定义 */
	name: string;
	/** 平台原生 API 对象（wx / my / uni），供平台无关的操作直接调用 */
	api: Record<string, any>;

	// === 存储 ===
	setStorageSync(key: string, data: string): void;
	getStorageSync(key: string): string | null;
	removeStorageSync(key: string): void;
	clearStorageSync(): void;

	// === Toast ===
	showToast(title: string, icon: string, duration: number, mask: boolean, image?: string): void;
	showLoading(title: string, mask: boolean): void;
	hideLoading(): void;

	// === 权限 ===
	/** 检查权限是否已授权 */
	checkPermission(scope: string): Promise<boolean>;
	/** 请求授权（弹授权框） */
	requestPermission(scope: string): Promise<boolean>;
	/** 打开设置页引导用户授权（可选，H5/App 无此能力） */
	openSetting?(): Promise<boolean>;

	// === 环境 ===
	getEnvVersion(): Promise<EnvVersion>;
	/** 获取启动参数完整对象（含 query 子属性），不支持返回 null */
	getLaunchOptionsSync(): Record<string, any> | null;
	/** 从页面 onLoad options 中提取扫码 URL，不支持返回 undefined */
	extractScanUrl(options: Record<string, any>): string | undefined;
}
