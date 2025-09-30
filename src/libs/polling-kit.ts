let timer: ReturnType<typeof setTimeout> | null = null;
let isPolling = false;

/**
 * 启动轮询
 * @param asyncMethod - 需要轮询的异步方法（必须返回 Promise<T>）
 * @param interval - 每次轮询的间隔时间（毫秒），默认 1000
 * @param immediate - 是否立即执行第一次请求，默认 true
 */
export function start<T>(asyncMethod: () => Promise<T>, interval = 1000, immediate = true): void {
  if (isPolling) {
    console.warn('Polling is already running.');
  }

  if (typeof asyncMethod !== 'function' || typeof interval !== 'number') {
    throw new Error(
      'Invalid arguments: asyncMethod must be a function and interval must be a number.'
    );
  }

  isPolling = true;

  const poll = async () => {
    try {
      await asyncMethod(); // 执行传入的异步方法
    } catch (error) {
      console.error('Error during polling:', error);
    } finally {
      if (isPolling) {
        timer = setTimeout(poll, interval); // 设置下一次轮询
      }
    }
  };

  if (immediate) {
    poll();
  } else {
    timer = setTimeout(poll, interval);
  }
}

/**
 * 停止轮询
 */
export function stop(): void {
  if (!isPolling) {
    console.warn('Polling is not running.');
    return;
  }

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  isPolling = false;
  console.log('Polling has been stopped.');
}
