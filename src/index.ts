export * from '@/libs/is-kit.ts';
export * from '@/libs/url-kit.ts';
export * from '@/libs/array-kit.ts';
export * from '@/libs/object-kit.ts';
export * from '@/libs/common.ts';
export * from '@/libs/string-kit.ts';
export * from '@/libs/date-kit.ts';
export * from '@/libs/number-kit.ts';
export * from '@/libs/color.ts';
// 类
export * from '@/utils/Result.ts';
// 子模块全量平铺（子路径 l-js-fn/<module> 仍保留，向后兼容）
export { isImage } from '@/libs/is-kit.ts'; // 显式导出，消除与 file 模块 star 导出的歧义
export * from '@/bom/index.ts';
export * from '@/config/index.ts';
export * from '@/encode/index.ts';
export * from '@/event-bus/index.ts';
export * from '@/file/index.ts';
export * from '@/ipc/index.ts';
export * from '@/polling/index.ts';
export * from '@/regex/index.ts';
export * from '@/storage/index.ts';
// uniapp 模块：主包内统一加 uni 前缀，避免与通用命名（env/file/request 等）冲突；子路径 l-js-fn/uniapp 仍保留原始命名
export {
	env as uniEnv,
	file as uniFile,
	model as uniModel,
	permission as uniPermission,
	request as uniRequest,
	router as uniRouter,
	storage as uniStorage,
	toast as uniToast,
	clipboard as uniClipboard,
	device as uniDevice,
	network as uniNetwork,
	getAdapter as uniGetAdapter,
	registerAdapter as uniRegisterAdapter,
	autoDetect as uniAutoDetect,
	createWechatAdapter as uniCreateWechatAdapter,
	createAlipayAdapter as uniCreateAlipayAdapter,
	createH5Adapter as uniCreateH5Adapter,
	createAppAdapter as uniCreateAppAdapter,
} from '@/uniapp/index.ts';
export type { PlatformAdapter as UniPlatformAdapter } from '@/uniapp/index.ts';
export * from '@/ws/index.ts';
// crypto 模块依赖 Node 内置 crypto，仅在 Node 环境可用，保留为子路径导入（l-js-fn/crypto），不参与主包平铺