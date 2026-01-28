/**
 * 轮询工具示例
 * 演示如何使用 Polling 类进行定时轮询
 */

import { Polling } from 'l-js-fn/polling';

// ==================== 基础用法 ====================
console.log('===== 基础轮询示例 =====');

const polling = new Polling();

// 定义一个异步方法
const fetchData = async (): Promise<void> => {
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  console.log('获取数据:', data);
};

// 启动轮询
// 参数1: 要轮询的异步方法
// 参数2: 间隔时间（毫秒），默认 1000
// 参数3: 是否立即执行，默认 true
polling.start(fetchData, 2000, true);

// 检查是否正在运行
console.log('轮询是否运行中:', polling.running); // true

// 停止轮询
// polling.stop();

// ==================== 实际场景示例 ====================

/**
 * 场景1: 轮询检查任务状态
 */
console.log('\n===== 场景1: 检查任务状态 =====');

interface TaskStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
}

class TaskChecker {
  private polling: Polling;
  private taskId: string;

  constructor(taskId: string) {
    this.taskId = taskId;
    this.polling = new Polling();
  }

  // 检查任务状态
  private async checkTaskStatus(): Promise<void> {
    try {
      const response = await fetch(`https://api.example.com/tasks/${this.taskId}`);
      const task: TaskStatus = await response.json();

      console.log(`任务 ${task.id} 状态: ${task.status}, 进度: ${task.progress}%`);

      // 如果任务完成或失败，停止轮询
      if (task.status === 'completed' || task.status === 'failed') {
        console.log('任务结束，停止轮询');
        this.stop();
      }
    } catch (error) {
      console.error('检查任务状态失败:', error);
    }
  }

  // 启动检查
  start(interval = 2000): void {
    console.log('开始检查任务状态...');
    this.polling.start(this.checkTaskStatus.bind(this), interval, true);
  }

  // 停止检查
  stop(): void {
    this.polling.stop();
  }
}

// 使用示例
const taskChecker = new TaskChecker('task-123');
taskChecker.start(2000); // 每 2 秒检查一次

/**
 * 场景2: 轮询获取通知
 */
console.log('\n===== 场景2: 获取通知 =====');

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  read: boolean;
}

class NotificationFetcher {
  private polling: Polling;
  private lastNotificationId: string | null = null;

  constructor() {
    this.polling = new Polling();
  }

  // 获取新通知
  private async fetchNotifications(): Promise<void> {
    try {
      const response = await fetch('https://api.example.com/notifications');
      const notifications: Notification[] = await response.json();

      // 过滤出未读的新通知
      const newNotifications = notifications.filter((n) => !n.read && n.id !== this.lastNotificationId);

      if (newNotifications.length > 0) {
        console.log(`收到 ${newNotifications.length} 条新通知:`);
        newNotifications.forEach((n) => {
          console.log(`- ${n.title}: ${n.content}`);
        });

        // 更新最后一条通知 ID
        this.lastNotificationId = newNotifications[newNotifications.length - 1].id;
      }
    } catch (error) {
      console.error('获取通知失败:', error);
    }
  }

  // 启动轮询
  start(interval = 10000): void {
    console.log('开始获取通知...');
    this.polling.start(this.fetchNotifications.bind(this), interval, false); // 不立即执行
  }

  // 停止轮询
  stop(): void {
    this.polling.stop();
  }
}

// 使用示例
const notificationFetcher = new NotificationFetcher();
notificationFetcher.start(10000); // 每 10 秒获取一次

/**
 * 场景3: 轮询健康检查
 */
console.log('\n===== 场景3: 健康检查 =====');

class HealthChecker {
  private polling: Polling;
  private serverUrl: string;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.polling = new Polling();
  }

  // 检查服务器健康状态
  private async checkHealth(): Promise<void> {
    try {
      const response = await fetch(`${this.serverUrl}/health`);

      if (response.ok) {
        const health = await response.json();
        console.log('服务器状态:', health.status);
      } else {
        console.error('服务器不健康，状态码:', response.status);
      }
    } catch (error) {
      console.error('健康检查失败:', error);
      // 这里可以触发告警
    }
  }

  // 启动健康检查
  start(interval = 30000): void {
    console.log('开始健康检查...');
    this.polling.start(this.checkHealth.bind(this), interval, true);
  }

  // 停止检查
  stop(): void {
    this.polling.stop();
  }
}

// 使用示例
const healthChecker = new HealthChecker('https://api.example.com');
healthChecker.start(30000); // 每 30 秒检查一次

/**
 * 场景4: 轮询处理队列任务
 */
console.log('\n===== 场景4: 处理队列任务 =====');

interface QueueTask {
  id: string;
  type: string;
  payload: any;
}

class QueueWorker {
  private polling: Polling;
  private workerId: string;

  constructor(workerId: string) {
    this.workerId = workerId;
    this.polling = new Polling();
  }

  // 从队列获取任务
  private async fetchTask(): Promise<void> {
    try {
      const response = await fetch('https://api.example.com/queue/pull', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workerId: this.workerId,
        }),
      });

      if (response.ok) {
        const task: QueueTask | null = await response.json();

        if (task) {
          console.log(`处理任务 ${task.id}, 类型: ${task.type}`);
          await this.processTask(task);
        } else {
          console.log('队列空闲');
        }
      }
    } catch (error) {
      console.error('获取任务失败:', error);
    }
  }

  // 处理任务
  private async processTask(task: QueueTask): Promise<void> {
    try {
      // 模拟处理任务
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`任务 ${task.id} 处理完成`);

      // 标记任务完成
      await fetch(`https://api.example.com/queue/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          workerId: this.workerId,
        }),
      });
    } catch (error) {
      console.error('处理任务失败:', error);
    }
  }

  // 启动工作器
  start(interval = 1000): void {
    console.log(`工作器 ${this.workerId} 启动...`);
    this.polling.start(this.fetchTask.bind(this), interval, true);
  }

  // 停止工作器
  stop(): void {
    console.log(`工作器 ${this.workerId} 停止`);
    this.polling.stop();
  }
}

// 使用示例
const worker = new QueueWorker('worker-001');
worker.start(1000); // 每 1 秒尝试获取一次任务

// 清理：在页面卸载或不需要时停止轮询
// window.addEventListener('beforeunload', () => {
//   taskChecker.stop();
//   notificationFetcher.stop();
//   healthChecker.stop();
//   worker.stop();
// });

export { TaskChecker, NotificationFetcher, HealthChecker, QueueWorker };
