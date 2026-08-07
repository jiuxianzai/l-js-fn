import { getAdapter } from '@/uniapp/base.ts';
import type { ShowModalOptions } from '@/uniapp/types.ts';

class Model {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 显示确认对话框（带取消按钮）
	 * @param content - 提示内容
	 * @param options - 配置选项
	 * @returns Promise，resolve 时返回 { confirm, cancel }
	 * @example
	 * const { confirm } = await model.confirm('确定删除？')
	 * if (confirm) { /* 执行删除 *\/ }
	 */
	confirm(content: string, options: ShowModalOptions = {}): Promise<{ confirm: boolean; cancel: boolean }> {
		return new Promise((resolve, reject) => {
			this.adapter.api.showModal({
				title: options.title || '温馨提示',
				content,
				confirmText: options.confirmText || '确认',
				cancelText: options.cancelText || '取消',
				showCancel: options.showCancel !== undefined ? options.showCancel : true,
				success: resolve,
				fail: reject,
			});
		});
	}

	/**
	 * 显示提示对话框（仅确认按钮）
	 * @param content - 提示内容
	 * @param options - 配置选项
	 * @returns Promise，resolve 时返回 { confirm, cancel }
	 * @example
	 * await model.alert('操作成功')
	 */
	alert(content: string, options: Omit<ShowModalOptions, 'showCancel'> = {}): Promise<{ confirm: boolean; cancel: boolean }> {
		return this.confirm(content, { ...options, showCancel: false });
	}
}

const model = new Model();

export { model };
