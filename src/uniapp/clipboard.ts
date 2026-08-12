import { getAdapter } from '@/uniapp/base.ts';

class Clipboard {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 复制文本到剪贴板
	 * @param text - 待复制的文本
	 * @returns Promise<boolean>，复制成功返回 true，平台不支持或失败返回 false
	 * @example
	 * const ok = await clipboard.copy('hello world')
	 * if (ok) { /* 复制成功 *\/ }
	 */
	copy(text: string): Promise<boolean> {
		if (typeof text !== 'string') {
			return Promise.resolve(false);
		}
		return this.adapter.copyToClipboard(text);
	}

	/**
	 * 读取剪贴板文本
	 * @returns Promise<string>，读取失败或平台不支持时返回空字符串
	 * @example
	 * const text = await clipboard.read()
	 * console.log(text)
	 */
	read(): Promise<string> {
		return this.adapter.readClipboard();
	}
}

const clipboard = /* @__PURE__ */ new Clipboard();

export { clipboard };
