/**
 * 轮询类
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
      console.log("Polling is already running.");
      return;
    }

    this.isPolling = true;

    const poll = async () => {
      try {
        await asyncMethod();
      } catch (error) {
        console.error("Error during polling:", error);
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
      console.log("Polling is not running.");
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.isPolling = false;
    console.log("Polling has been stopped.");
  }

  /** 是否正在轮询 */
  public get running(): boolean {
    return this.isPolling;
  }
}
