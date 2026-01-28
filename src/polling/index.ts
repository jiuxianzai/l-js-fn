/**
 * 轮询工具类（Jest / FakeTimers 友好）
 */
export class Polling {
	private timer: ReturnType<typeof setTimeout> | null = null;
	private isPolling = false;

	/** 启动轮询 */
	public start<T>(
		asyncMethod: () => Promise<T>,
		interval = 1000,
		immediate = true
	): void {
		if (this.isPolling) {
			console.log('Polling is already running.');
			return;
		}

		this.isPolling = true;

		if (immediate) {
			// 不阻塞调用方
			void this.loop(asyncMethod, interval);
		} else {
			this.timer = setTimeout(() => {
				void this.loop(asyncMethod, interval);
			}, interval);
		}
	}

	/** 轮询主循环（核心） */
	private async loop<T>(
		asyncMethod: () => Promise<T>,
		interval: number
	): Promise<void> {
		while (this.isPolling) {
			try {
				await asyncMethod();
			} catch (error) {
				console.error('Error during polling:', error);
			}

			// stop 可能发生在 await 期间
			if (!this.isPolling) break;

			// interval = 0 也安全
			await new Promise<void>(resolve => {
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
	}

	/** 是否正在轮询 */
	public get running(): boolean {
		return this.isPolling;
	}
}
