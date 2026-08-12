import { getAdapter } from '@/uniapp/base.ts';
import type { ToastOptions } from '@/uniapp/types.ts';

class Toast {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 显示普通提示
	 * @param title - 提示文字
	 * @param options - 配置选项
	 * @example
	 * toast.show('操作成功')
	 * toast.show('请稍候', { duration: 3000 })
	 */
	show(title: string, options: ToastOptions = {}): void {
		this.adapter.showToast(
			title,
			options.icon || 'none',
			options.duration || 2000,
			options.mask || false,
			options.image,
		);
	}

	/**
	 * 显示成功提示
	 * @param title - 提示文字
	 * @param options - 配置选项
	 * @example
	 * toast.success('保存成功')
	 */
	success(title: string, options: Omit<ToastOptions, 'icon'> = {}): void {
		this.show(title, { ...options, icon: 'success' });
	}

	/**
	 * 显示错误提示
	 * @param title - 提示文字
	 * @param options - 配置选项
	 * @example
	 * toast.error('网络异常')
	 */
	error(title: string, options: Omit<ToastOptions, 'icon'> = {}): void {
		this.show(title, { ...options, icon: 'error' });
	}

	/**
	 * 显示加载中
	 * @param title - 提示文字
	 * @param options - 配置选项
	 * @example
	 * toast.loading('加载中...')
	 */
	loading(title: string, options: Omit<ToastOptions, 'icon'> = {}): void {
		this.adapter.showLoading(
			title,
			options.mask !== undefined ? options.mask : true,
		);
	}

	/**
	 * 隐藏加载中
	 * @example
	 * toast.hideLoading()
	 */
	hideLoading(): void {
		this.adapter.hideLoading();
	}
}

const toast = /* @__PURE__ */ new Toast();

export { toast };
