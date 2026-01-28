/**
 * 浏览器对象模型 (BOM) 使用示例
 * 演示如何使用 l-js-fn/bom 模块中的浏览器方法
 *
 * 注意：这些方法只能在浏览器环境中使用
 */

import {
  scrollTop,
  scrollToBottom,
  getScrollPosition,
  setScrollPosition,
  launchFullscreen,
  exitFullscreen,
  copyToClipboard,
} from 'l-js-fn/bom';

// ==================== 滚动控制 ====================
console.log('===== 滚动控制 =====');

/**
 * 平滑滚动到页面顶部
 *
 * 使用场景：
 * - 返回顶部按钮
 * - 页面加载后滚动到顶部
 * - 表单提交后滚动到顶部
 */
document.getElementById('back-to-top')?.addEventListener('click', () => {
  scrollTop();
});

/**
 * 滚动到页面底部
 *
 * 使用场景：
 * - 加载更多按钮
 * - 聊天窗口滚动到底部
 * - 日志窗口滚动到底部
 */
document.getElementById('load-more')?.addEventListener('click', () => {
  scrollToBottom();
});

/**
 * 获取当前滚动位置
 *
 * 使用场景：
 * - 记录用户阅读进度
 * - 懒加载触发
 * - 滚动位置保存
 */
document.addEventListener('scroll', () => {
  const position = getScrollPosition();
  console.log(`当前位置: x=${position.x}, y=${position.y}`);

  // 保存滚动位置到 localStorage
  localStorage.setItem('scrollPosition', JSON.stringify(position));
});

/**
 * 设置滚动位置
 *
 * 使用场景：
 * - 恢复滚动位置
 * - 跳转到指定位置
 * - 锚点跳转
 */
// 恢复上次滚动位置
const savedPosition = localStorage.getItem('scrollPosition');
if (savedPosition) {
  const position = JSON.parse(savedPosition);
  setScrollPosition(position, true); // true 表示平滑滚动
}

// 平滑滚动到指定位置
setScrollPosition({ x: 0, y: 500 }, true);

// ==================== 全屏控制 ====================
console.log('\n===== 全屏控制 =====');

/**
 * 进入全屏
 *
 * 使用场景：
 * - 图片查看器
 * - 视频播放器
 * - 演示文稿
 * - 游戏
 */
document.getElementById('enter-fullscreen')?.addEventListener('click', async () => {
  const element = document.documentElement; // 整个页面
  // 或者指定某个元素：document.getElementById('video-container')

  const success = await launchFullscreen(element);

  if (success) {
    console.log('已进入全屏');
  } else {
    console.error('进入全屏失败');
  }
});

/**
 * 退出全屏
 *
 * 使用场景：
 * - 按 ESC 键退出
 * - 点击退出按钮
 */
document.getElementById('exit-fullscreen')?.addEventListener('click', async () => {
  const success = await exitFullscreen();

  if (success) {
    console.log('已退出全屏');
  } else {
    console.error('退出全屏失败');
  }
});

/**
 * 监听全屏状态变化
 */
document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    console.log('已进入全屏模式');
  } else {
    console.log('已退出全屏模式');
  }
});

// ==================== 剪贴板操作 ====================
console.log('\n===== 剪贴板操作 =====');

/**
 * 复制文本到剪贴板
 *
 * 使用场景：
 * - 复制按钮
 * - 分享链接
 * - 复制代码
 */
document.getElementById('copy-button')?.addEventListener('click', async () => {
  const text = 'https://example.com/share-link';

  try {
    const success = await copyToClipboard(text);

    if (success) {
      // 显示成功提示
      alert('链接已复制到剪贴板！');
      console.log('复制成功:', text);
    }
  } catch (error) {
    console.error('复制失败:', error);
    alert('复制失败，请手动复制');
  }
});

/**
 * 复制输入框的值
 */
document.getElementById('copy-input-button')?.addEventListener('click', async () => {
  const input = document.getElementById('my-input') as HTMLInputElement;
  const text = input?.value;

  if (text) {
    const success = await copyToClipboard(text);

    if (success) {
      console.log('输入框内容已复制');
    }
  }
});

/**
 * 复制代码块
 */
document.querySelectorAll('.copy-code-button').forEach((button) => {
  button.addEventListener('click', async (event) => {
    const codeBlock = (event.target as HTMLElement).previousElementSibling as HTMLElement;
    const code = codeBlock?.textContent;

    if (code) {
      const success = await copyToClipboard(code);

      if (success) {
        (event.target as HTMLElement).textContent = '已复制！';

        setTimeout(() => {
          (event.target as HTMLElement).textContent = '复制';
        }, 2000);
      }
    }
  });
});

// ==================== 实际应用示例 ====================

/**
 * 示例1: 返回顶部按钮
 */
class BackToTopButton {
  private button: HTMLElement;
  private showThreshold = 300; // 滚动超过 300px 显示按钮

  constructor(buttonId: string) {
    this.button = document.getElementById(buttonId) as HTMLElement;

    if (!this.button) {
      console.error('按钮元素未找到');
      return;
    }

    this.init();
  }

  private init(): void {
    // 监听滚动事件
    document.addEventListener('scroll', this.handleScroll.bind(this));

    // 点击事件
    this.button.addEventListener('click', this.handleClick.bind(this));

    // 初始隐藏按钮
    this.button.style.display = 'none';
  }

  private handleScroll(): void {
    const position = getScrollPosition();

    if (position.y > this.showThreshold) {
      this.button.style.display = 'block';
    } else {
      this.button.style.display = 'none';
    }
  }

  private handleClick(): void {
    scrollTop();
  }
}

// 使用示例
const backToTop = new BackToTopButton('back-to-top');

/**
 * 示例2: 阅读进度保存和恢复
 */
class ReadingProgress {
  private saveInterval = 1000; // 每 1 秒保存一次
  private saveTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    // 恢复上次阅读位置
    this.restorePosition();

    // 开始保存位置
    this.startSaving();

    // 页面卸载前保存位置
    window.addEventListener('beforeunload', () => {
      this.savePosition();
    });
  }

  private restorePosition(): void {
    const savedPosition = localStorage.getItem('readingPosition');

    if (savedPosition) {
      const position = JSON.parse(savedPosition);

      // 延迟恢复，避免页面加载时的跳动
      setTimeout(() => {
        setScrollPosition(position, true);
      }, 100);
    }
  }

  private savePosition(): void {
    const position = getScrollPosition();
    localStorage.setItem('readingPosition', JSON.stringify(position));
  }

  private startSaving(): void {
    this.saveTimer = setInterval(() => {
      this.savePosition();
    }, this.saveInterval);
  }

  private stopSaving(): void {
    if (this.saveTimer) {
      clearInterval(this.saveTimer);
      this.saveTimer = null;
    }
  }

  destroy(): void {
    this.stopSaving();
    this.savePosition();
  }
}

// 使用示例
const readingProgress = new ReadingProgress();

/**
 * 示例3: 图片全屏查看器
 */
class ImageViewer {
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;

    if (!this.container) {
      console.error('容器元素未找到');
      return;
    }

    this.init();
  }

  private init(): void {
    this.container.addEventListener('click', this.handleImageClick.bind(this));
  }

  private async handleImageClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement;

    if (target.tagName === 'IMG') {
      const isFullscreen = document.fullscreenElement !== null;

      if (isFullscreen) {
        await exitFullscreen();
      } else {
        await launchFullscreen(target);
      }
    }
  }
}

// 使用示例
const imageViewer = new ImageViewer('image-gallery');

/**
 * 示例4: 一键复制功能
 */
class OneClickCopy {
  constructor() {
    this.init();
  }

  private init(): void {
    // 为所有带有 data-copy 属性的元素添加点击事件
    document.querySelectorAll('[data-copy]').forEach((element) => {
      element.addEventListener('click', this.handleCopy.bind(this));
    });
  }

  private async handleCopy(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    const text = target.getAttribute('data-copy') || target.textContent;

    if (text) {
      const success = await copyToClipboard(text);

      if (success) {
        this.showFeedback(target, '已复制！');
      }
    }
  }

  private showFeedback(element: HTMLElement, message: string): void {
    const feedback = document.createElement('span');
    feedback.textContent = message;
    feedback.className = 'copy-feedback';
    feedback.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
    `;

    element.style.position = 'relative';
    element.appendChild(feedback);

    setTimeout(() => {
      feedback.remove();
    }, 2000);
  }
}

// 使用示例
new OneClickCopy();

export { BackToTopButton, ReadingProgress, ImageViewer, OneClickCopy };
