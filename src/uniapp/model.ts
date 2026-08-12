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

	/**
	 * 显示操作菜单（底部弹出选择列表）
	 * @param options - 配置选项（itemList 必填）
	 * @returns Promise<number | null>，选中项索引，取消或失败返回 null
	 * @example
	 * const index = await model.actionSheet({
	 *   title: '选择操作',
	 *   itemList: ['编辑', '删除'],
	 * })
	 * if (index !== null) { /* 执行对应操作 *\/ }
	 */
	actionSheet(options: { itemList: string[]; itemColor?: string; title?: string }): Promise<number | null> {
		const { itemList, itemColor, title } = options;
		if (!Array.isArray(itemList) || itemList.length === 0) {
			return Promise.resolve(null);
		}

		// 优先使用适配器实现（微信 tapIndex / 支付宝 index 参数差异已在适配层封装）
		if (typeof this.adapter.showActionSheet === 'function') {
			return this.adapter.showActionSheet({ itemList, title, itemColor });
		}

		// 兜底：按 uni 统一 API 直接调用（itemList + tapIndex）
		return new Promise((resolve) => {
			this.adapter.api.showActionSheet({
				itemList,
				...(itemColor ? { itemColor } : {}),
				...(title ? { title } : {}),
				success: (res: { tapIndex: number }) => resolve(res?.tapIndex ?? null),
				fail: () => resolve(null),
			});
		});
	}
}

const model = /* @__PURE__ */ new Model();

export { model };
