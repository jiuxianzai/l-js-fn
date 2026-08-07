import { getAdapter } from '@/uniapp/base.ts';
import type { RouterGuardFn, RouterNextFn, RouterOptions } from '@/uniapp/types.ts';

/** 防重复跳转间隔（毫秒） */
const DUPLICATE_THRESHOLD = 300;
/** 路由守卫超时时间（毫秒） */
const GUARD_TIMEOUT = 5000;

class Router {
	private currentPath = '';
	private lastNavUrl = '';
	private lastNavTime = 0;
	private guards: RouterGuardFn[] = [];

	private get uni(): Record<string, any> {
		return getAdapter().api;
	}

	/**
	 * 注册全局前置路由守卫
	 * @param guard - 守卫函数，调用 next() 放行，next('/path') 重定向，不调用则超时后阻塞
	 * @example
	 * router.beforeEach((to, from, next) => {
	 *   if (!isLogin) next('/pages/login/index')
	 *   else next()
	 * })
	 */
	beforeEach(guard: RouterGuardFn): void {
		this.guards.push(guard);
	}

	/**
	 * 导航到新页面（保留当前页）
	 * @param path - 目标页面路径
	 * @param options - 配置选项（query、params、encode）
	 * @example
	 * router.push('/pages/detail/index', { query: { id: 1 } })
	 */
	push(path: string, options?: RouterOptions): Promise<void> {
		return this.navigate('navigateTo', path, options);
	}

	/**
	 * 重定向到新页面（关闭当前页）
	 * @param path - 目标页面路径
	 * @param options - 配置选项（query、params、encode）
	 * @example
	 * router.replace('/pages/home/index')
	 */
	replace(path: string, options?: RouterOptions): Promise<void> {
		return this.navigate('redirectTo', path, options);
	}

	/**
	 * 返回上一页或多级页面
	 * @param delta - 返回的页面数，默认 1
	 * @example
	 * router.back()
	 * router.back(2)
	 */
	back(delta = 1): Promise<void> {
		return new Promise((resolve, reject) => {
			this.uni.navigateBack({
				delta,
				success: () => resolve(),
				fail: (err: any) => reject(err),
			});
		});
	}

	/**
	 * 跳转到 tabBar 页面
	 * @param path - tabBar 页面路径（不可携带参数）
	 * @example
	 * router.switchTab('/pages/home/index')
	 */
	switchTab(path: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this.uni.switchTab({
				url: path,
				success: () => {
					this.currentPath = path;
					resolve();
				},
				fail: (err: any) => reject(err),
			});
		});
	}

	/**
	 * 关闭所有页面，重新打开指定页面
	 * @param path - 目标页面路径
	 * @param options - 配置选项（query、params、encode）
	 * @example
	 * router.reLaunch('/pages/index/index')
	 */
	reLaunch(path: string, options?: RouterOptions): Promise<void> {
		return this.navigate('reLaunch', path, options);
	}

	/**
	 * 构建带 query / params 的完整 URL
	 */
	private buildUrl(path: string, options?: RouterOptions): string {
		if (!options) return path;

		const { query = {}, params = {}, encode = true } = options;
		const entries: [string, string][] = [
			...Object.entries(query).map(([k, v]): [string, string] => [k, String(v)]),
			...Object.entries(params).map(([k, v]): [string, string] => {
				const val = typeof v === 'object' ? JSON.stringify(v) : String(v);
				return [k, val];
			}),
		];

		if (entries.length === 0) return path;

		const qs = entries
			.map(([k, v]) => `${k}=${encode ? encodeURIComponent(v) : v}`)
			.join('&');

		return path + (path.includes('?') ? '&' : '?') + qs;
	}

	/**
	 * 防重复跳转检测
	 * 同步检查并标记，防止并发双击穿透；导航失败时调用 clearDuplicate 清除标记以允许重试
	 */
	private isDuplicate(url: string): boolean {
		const now = Date.now();
		if (url === this.lastNavUrl && now - this.lastNavTime < DUPLICATE_THRESHOLD) {
			return true;
		}
		this.lastNavUrl = url;
		this.lastNavTime = now;
		return false;
	}

	/**
	 * 清除防重复标记（导航失败时调用，允许立即重试同一路径）
	 */
	private clearDuplicate(url: string): void {
		if (url === this.lastNavUrl) {
			this.lastNavUrl = '';
			this.lastNavTime = 0;
		}
	}

	/**
	 * 依次执行路由守卫链
	 * @returns 最终目标路径，null 表示被阻塞
	 */
	private async runGuards(to: string, from: string): Promise<string | null> {
		if (this.guards.length === 0) return to;

		for (const guard of this.guards) {
			const result = await new Promise<string | undefined | null>((resolve) => {
				let settled = false;

				const timer = setTimeout(() => {
					if (!settled) {
						settled = true;
						resolve(null);
					}
				}, GUARD_TIMEOUT);

				const next: RouterNextFn = (redirectPath?: string) => {
					if (settled) return;
					settled = true;
					clearTimeout(timer);
					if (redirectPath === undefined) {
						resolve(undefined);
					} else {
						resolve(redirectPath);
					}
				};

				guard(to, from, next);
			});

			if (result === null) return null;
			if (result !== undefined) return result;
		}

		return to;
	}

	/**
	 * 统一的导航方法
	 */
	private async navigate(apiMethod: string, path: string, options?: RouterOptions): Promise<void> {
		const url = this.buildUrl(path, options);
		const from = this.currentPath;

		if (this.isDuplicate(url)) return;

		const finalUrl = await this.runGuards(url, from);
		if (finalUrl === null) return;

		return new Promise((resolve, reject) => {
			this.uni[apiMethod]({
				url: finalUrl,
				success: () => {
					this.currentPath = finalUrl;
					resolve();
				},
				fail: (err: any) => {
					this.clearDuplicate(url);
					reject(err);
				},
			});
		});
	}
}

const router = new Router();

export { router };
