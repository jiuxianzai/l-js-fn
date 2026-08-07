export { getAdapter, registerAdapter, autoDetect } from './base';
export { env } from './env';
export { model } from './model';
export { permission } from './permission';
export { request } from './request';
export { router } from './router';
export { storage } from './storage';
export { toast } from './toast';

// 平台适配器工厂函数（供手动注册 / 扩展新平台使用）
export { createWechatAdapter } from './adapters/wechat';
export { createAlipayAdapter } from './adapters/alipay';
export { createH5Adapter } from './adapters/h5';
export { createAppAdapter } from './adapters/app';
export type { PlatformAdapter } from './types';
