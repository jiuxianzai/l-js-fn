/**
 * polling 模块 —— 轮询工具
 * @remark 依赖浏览器 setTimeout，通常用于浏览器环境；Node 环境也可运行（全局 setTimeout 存在），Jest/FakeTimers 友好。
 */
/**
 * 轮询工具类（Jest / FakeTimers 友好）
 */
export class Polling {
	private timer: ReturnType<typeof setTimeout> | null = null;
	private isPolling = false;
	private pendingResolve: (() => void) | null = null;

	/** 启动轮询 */
	public start(
		asyncMethod: () => Promise<unknown>,
		interval = 1000,
		immediate = true
	): void {
		if (this.isPolling) {
			console.log('Polling is already running.');
			return;
		}

		this.isPolling = true;

		if (immediate) {
			void this.loop(asyncMethod, interval);
		} else {
			this.timer = setTimeout(() => {
				void this.loop(asyncMethod, interval);
			}, interval);
		}
	}

	/** 轮询主循环（核心） */
	private async loop(
		asyncMethod: () => Promise<unknown>,
		interval: number
	): Promise<void> {
		while (this.isPolling) {
			try {
				await asyncMethod();
			} catch (error) {
				console.error('Error during polling:', error);
			}

			if (!this.isPolling) break;

			await new Promise<void>(resolve => {
				this.pendingResolve = resolve;
				this.timer = setTimeout(resolve, interval);
			});
		}

		this.clearTimer();
	}

	/** 停止轮询 */
	public stop(): void {
		if (!this.isPolling) {
			console.log('Polling is not running.');
			return;
		}

		this.isPolling = false;
		this.clearTimer();

		console.log('Polling has been stopped.');
	}

	private clearTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (this.pendingResolve) {
			this.pendingResolve();
			this.pendingResolve = null;
		}
	}

	/** 是否正在轮询 */
	public get running(): boolean {
		return this.isPolling;
	}
}
