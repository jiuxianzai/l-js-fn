import type { PlatformAdapter } from '@/uniapp/types.ts';
import { createWechatAdapter } from '@/uniapp/adapters/wechat.ts';
import { createAlipayAdapter } from '@/uniapp/adapters/alipay.ts';
import { createH5Adapter } from '@/uniapp/adapters/h5.ts';
import { createAppAdapter } from '@/uniapp/adapters/app.ts';

declare const wx: Record<string, any> | undefined;
declare const my: Record<string, any> | undefined;
declare const uni: Record<string, any> | undefined;
declare const plus: Record<string, any> | undefined;

let _adapter: PlatformAdapter | undefined;

/**
 * 自动检测当前平台并创建对应适配器
 *
 * 检测优先级：
 * 1. 存在微信全局对象 wx → WechatAdapter
 * 2. 存在支付宝全局对象 my → AlipayAdapter
 * 3. 存在 uni 对象 → 通过 getSystemInfoSync().platform 二次确认
 * 4. 兜底：浏览器环境 → H5Adapter，否则抛错提示手动注册
 *
 * @returns 平台适配器
 * @throws 无法识别平台且未手动注册时抛出异常
 */
export function autoDetect(): PlatformAdapter {
	if (typeof wx !== 'undefined') {
		return createWechatAdapter(wx);
	}
	if (typeof my !== 'undefined') {
		return createAlipayAdapter(my);
	}
	if (typeof uni !== 'undefined') {
		try {
			const info = uni.getSystemInfoSync();
			if (info?.platform === 'mp-weixin') return createWechatAdapter(wx || uni);
			if (info?.platform === 'mp-alipay') return createAlipayAdapter(my || uni);
			if (typeof document !== 'undefined') return createH5Adapter(uni);
			if (typeof plus !== 'undefined') return createAppAdapter(uni);
		} catch {
			// 忽略检测异常，走下方兜底
		}
		if (typeof document !== 'undefined') return createH5Adapter(uni);
		return createAppAdapter(uni);
	}
	if (typeof document !== 'undefined') {
		return createH5Adapter(({} as Record<string, any>));
	}
	throw new Error('[l-js-fn/uniapp] 无法自动检测平台，请调用 registerAdapter() 手动注册适配器');
}

/**
 * 获取当前平台的适配器，未注册时自动检测
 * @returns 平台适配器
 */
export function getAdapter(): PlatformAdapter {
	if (!_adapter) {
		_adapter = autoDetect();
	}
	return _adapter;
}

/**
 * 手动注册平台适配器（用于扩展新平台或覆盖自动检测结果）
 * @param adapter - 平台适配器实例
 * @example
 * import { registerAdapter, createWechatAdapter } from 'l-js-fn/uniapp'
 * registerAdapter(createWechatAdapter(wx))
 */
export function registerAdapter(adapter: PlatformAdapter): void {
	_adapter = adapter;
}
