export class Polling {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isPolling = false;

  /** 启动轮询 */
  public start<T>(
    asyncMethod: () => Promise<T>,
    interval: number = 1000,
    immediate: boolean = true
  ): void {
    if (this.isPolling) {
      console.warn('Polling is already running.');
      return;
    }

    if (typeof asyncMethod !== 'function' || typeof interval !== 'number') {
      throw new Error(
        'Invalid arguments: asyncMethod must be a function and interval must be a number.'
      );
    }

    this.isPolling = true;

    const poll = async () => {
      try {
        await asyncMethod();
      } catch (error) {
        console.error('Error during polling:', error);
      } finally {
        if (this.isPolling) {
          this.timer = setTimeout(poll, interval);
        }
      }
    };

    if (immediate) {
      poll();
    } else {
      this.timer = setTimeout(poll, interval);
    }
  }

  /** 停止轮询 */
  public stop(): void {
    if (!this.isPolling) {
      console.warn('Polling is not running.');
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.isPolling = false;
    console.log('Polling has been stopped.');
  }

  /** 是否正在轮询 */
  public get running(): boolean {
    return this.isPolling;
  }
}
