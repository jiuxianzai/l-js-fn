import Request from './luch-request'
import { getAdapter } from '@/uniapp/base.ts'

interface RequestStaticConfig {
	baseURL?: string
	timeout?: number
	header?: Record<string, string>
}

interface ExtraConfig {
	retry?: number
	retryDelay?: number
	loading?: boolean
}

type FullConfig = Record<string, any> & ExtraConfig

let loadingCount = 0

function showLoading(): void {
	try {
		if (loadingCount === 0) {
			getAdapter().api.showLoading?.({ title: '加载中...', mask: true })
		}
		loadingCount++
	} catch { /* */ }
}

function hideLoading(): void {
	loadingCount = Math.max(0, loadingCount - 1)
	try {
		if (loadingCount === 0) {
			getAdapter().api.hideLoading?.()
		}
	} catch { /* */ }
}

class RequestWrapper {
	private instance: any

	constructor() {
		this.instance = new (Request as any)()
	}

	setConfig(cfg: RequestStaticConfig): void {
		this.instance.setConfig((prev: Record<string, any>) => ({ ...prev, ...cfg }))
	}

	beforeRequest(
		fulfilled: (config: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>,
		rejected?: (error: any) => any
	): number {
		return this.instance.interceptors.request.use(fulfilled as any, rejected as any)
	}

	afterResponse(
		fulfilled: (response: Record<string, any>) => Record<string, any> | Promise<Record<string, any>>,
		rejected?: (error: any) => any
	): number {
		return this.instance.interceptors.response.use(fulfilled as any, rejected as any)
	}

	get<T = any>(url: string, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.get(url, config), config)
	}

	post<T = any>(url: string, data?: any, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.post(url, data, config), config)
	}

	put<T = any>(url: string, data?: any, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.put(url, data, config), config)
	}

	delete<T = any>(url: string, data?: any, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.delete(url, data, config), config)
	}

	upload<T = any>(url: string, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.upload(url, config), config)
	}

	download<T = any>(url: string, config?: FullConfig): Promise<T> {
		return this.doRequest(() => this.instance.download(url, config), config)
	}

	private async doRequest<T>(fn: () => Promise<T>, config?: FullConfig): Promise<T> {
		const { retry = 0, retryDelay = 1000, loading = false } = config || {}

		if (loading) showLoading()

		let lastError: any
		const maxAttempts = retry + 1

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			try {
				const result = await fn()
				if (loading) hideLoading()
				return result
			} catch (err) {
				lastError = err
				if (attempt < maxAttempts - 1 && retryDelay > 0) {
					await new Promise((resolve) => setTimeout(resolve, retryDelay))
				}
			}
		}

		if (loading) hideLoading()
		throw lastError
	}
}

const request = /* @__PURE__ */ new RequestWrapper()

export { request }
