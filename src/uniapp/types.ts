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

export type NetworkType = 'wifi' | '2g' | '3g' | '4g' | '5g' | 'ethernet' | 'unknown' | 'none';

export interface NetworkStatusChangeResult {
	isConnected: boolean;
	networkType: NetworkType;
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
	showActionSheet(options: {
		itemList: string[];
		itemColor?: string;
		title?: string;
		success?: (res: { tapIndex: number }) => void;
		fail?: (err: any) => void;
	}): void;
	getNetworkType(options: { success: (res: { networkType: NetworkType }) => void; fail?: (err: any) => void }): void;
	onNetworkStatusChange(callback: (res: NetworkStatusChangeResult) => void): void;
	offNetworkStatusChange(callback?: (res: NetworkStatusChangeResult) => void): void;
}

export interface UniSystemInfo {
	platform: string;
	[key: string]: any;
}

export interface SafeAreaInsets {
	top: number;
	right: number;
	bottom: number;
	left: number;
}

export interface DeviceInfo {
	/** 设备品牌，如 'iPhone' / 'HUAWEI' */
	brand: string;
	/** 设备型号，如 'iPhone 15 Pro' */
	model: string;
	/** 操作系统版本，如 'iOS 17.0' / 'Android 14' */
	system: string;
	/** 平台标识，如 'ios' / 'android' / 'mp-weixin' / 'mp-alipay' */
	platform: string;
	/** 状态栏高度（px） */
	statusBarHeight: number;
	/** 屏幕宽度（px） */
	screenWidth: number;
	/** 屏幕高度（px） */
	screenHeight: number;
	/** 可使用窗口宽度（px） */
	windowWidth: number;
	/** 可使用窗口高度（px） */
	windowHeight: number;
	/** 像素比 */
	pixelRatio: number;
	/** 安全区域（原样透传，可能为 undefined） */
	safeArea?: { top: number; right: number; bottom: number; left: number; width: number; height: number };
	/** 安全区内边距（由 safeArea 计算得出） */
	safeAreaInsets: SafeAreaInsets;
}

export interface CapsuleInfo {
	left: number;
	top: number;
	right: number;
	bottom: number;
	width: number;
	height: number;
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

	// === 弹窗 ===
	/** 显示底部操作菜单，返回选中项索引，取消/失败返回 null（可选，缺省时 model 内部按 uni 统一 API 兜底） */
	showActionSheet?(options: { itemList: string[]; title?: string; itemColor?: string }): Promise<number | null>;

	// === 剪贴板 ===
	/** 复制文本到剪贴板，返回是否成功 */
	copyToClipboard(text: string): Promise<boolean>;
	/** 读取剪贴板文本 */
	readClipboard(): Promise<string>;

	// === 设备 ===
	/** 获取胶囊按钮（微信/支付宝右上角菜单）位置信息，不支持返回 null */
	getMenuButtonInfo?(): Record<string, any> | null;

	// === 文件系统 ===
	/** 获取文件系统管理器（FileSystemManager），不支持返回 null */
	getFileSystemManager?(): any;
	/** 获取用户数据根路径（USER_DATA_PATH），不支持返回空字符串 */
	getUserDataPath?(): string;
	/** 写入文件（参数差异已封装：微信 filePath / 支付宝 path） */
	fileWrite?(filePath: string, data: string): Promise<void>;
	/** 读取文件，返回内容字符串 */
	fileRead?(filePath: string): Promise<string>;
	/** 检查文件是否存在 */
	fileAccess?(filePath: string): Promise<boolean>;
	/** 删除文件 */
	fileRemove?(filePath: string): Promise<void>;
}

/** 文件读写选项 */
export interface FileOptions {
	/** 是否将结果按 JSON 解析（写入时对象自动序列化，读取时自动反序列化），默认 true */
	json?: boolean;
}
