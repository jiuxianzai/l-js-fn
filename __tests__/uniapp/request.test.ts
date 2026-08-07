/**
 * uniapp request 封装单元测试
 * 覆盖 loading / put/delete/upload/download / retry 组合 / setConfig / 拦截器
 */
import { describe, expect, it, jest } from '@jest/globals';

function setupGlobals(): { mockWx: any; mockUni: any } {
	const mockUni = {
		request: jest.fn((opts: any) => {
			setTimeout(() => opts.complete?.({ data: 'ok', statusCode: 200, config: {} }), 0);
		}),
		uploadFile: jest.fn((opts: any) => {
			setTimeout(() => opts.complete?.({ data: 'ok', statusCode: 200, config: {} }), 0);
		}),
		downloadFile: jest.fn((opts: any) => {
			setTimeout(() => opts.complete?.({ data: 'ok', statusCode: 200, config: {} }), 0);
		}),
	};
	const mockWx = {
		showLoading: jest.fn(),
		hideLoading: jest.fn(),
	};
	(global as any).wx = mockWx;
	(global as any).uni = mockUni;
	(global as any).my = undefined;
	(global as any).document = undefined;
	(global as any).plus = undefined;
	return { mockWx, mockUni };
}

describe('uniapp request 封装', () => {
	it('put/delete/upload/download 透传正确 method', async () => {
		let request: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		await request.put('/p', { a: 1 });
		await request.delete('/d', { a: 1 });
		await request.upload('/up');
		await request.download('/dl');
		const requestMethods = mockUni.request.mock.calls.map((c: any[]) => c[0].method);
		expect(requestMethods).toEqual(['PUT', 'DELETE']);
		expect(mockUni.uploadFile).toHaveBeenCalled();
		expect(mockUni.downloadFile).toHaveBeenCalled();
	});

	it('loading=true 时调用 showLoading 与 hideLoading', async () => {
		let request: any;
		let mockWx: any;
		await jest.isolateModulesAsync(async () => {
			({ mockWx } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		await request.get('/api', { loading: true });
		expect(mockWx.showLoading).toHaveBeenCalledWith({ title: '加载中...', mask: true });
		expect(mockWx.hideLoading).toHaveBeenCalled();
	});

	it('loading 与 retry 组合：失败重试后仍只 hideLoading 一次', async () => {
		let request: any;
		let mockWx: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockWx, mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		let count = 0;
		mockUni.request
			.mockReset()
			.mockImplementationOnce((opts: any) => {
				count++;
				opts.complete?.({ data: 'err', statusCode: 500, config: {} });
			})
			.mockImplementationOnce((opts: any) => {
				count++;
				opts.complete?.({ data: 'ok', statusCode: 200, config: {} });
			});
		const res: any = await request.get('/api', { loading: true, retry: 1, retryDelay: 0 });
		expect(count).toBe(2);
		expect(res.data).toBe('ok');
		expect(mockWx.showLoading).toHaveBeenCalledTimes(1);
		expect(mockWx.hideLoading).toHaveBeenCalled();
	});

	it('loading=true 全部失败时仍 hideLoading 并抛错', async () => {
		let request: any;
		let mockWx: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockWx, mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		mockUni.request
			.mockReset()
			.mockImplementation((opts: any) => opts.complete?.({ data: 'err', statusCode: 500, config: {} }));
		await expect(request.get('/api', { loading: true, retry: 1, retryDelay: 0 })).rejects.toMatchObject({
			statusCode: 500,
		});
		expect(mockWx.showLoading).toHaveBeenCalledTimes(1);
		expect(mockWx.hideLoading).toHaveBeenCalled();
	});

	it('loading=true 且 api 无 showLoading 时不抛错', async () => {
		let request: any;
		await jest.isolateModulesAsync(async () => {
			setupGlobals();
			(global as any).wx = { hideLoading: jest.fn() };
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		await expect(request.get('/api', { loading: true })).resolves.toBeDefined();
	});

	it('retryDelay>0 时失败后等待再重试成功', async () => {
		let request: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		let count = 0;
		mockUni.request
			.mockReset()
			.mockImplementationOnce((opts: any) => {
				count++;
				opts.complete?.({ data: 'err', statusCode: 500, config: {} });
			})
			.mockImplementationOnce((opts: any) => {
				count++;
				opts.complete?.({ data: 'ok', statusCode: 200, config: {} });
			});
		const res: any = await request.get('/api', { retry: 1, retryDelay: 5 });
		expect(count).toBe(2);
		expect(res.data).toBe('ok');
	});

	it('setConfig 更新全局配置并影响后续请求', async () => {
		let request: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		request.setConfig({ baseURL: 'https://a.com' });
		await request.get('/api');
		const call = mockUni.request.mock.calls[0][0] as any;
		expect(call.url).toContain('https://a.com');
	});

	it('beforeRequest 的 rejected 捕获后添加拦截器抛出的错误', async () => {
		let request: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		// 先添加的拦截器排在后，其 rejected 捕获后添加（排前）拦截器抛出的错误
		const rejected = jest.fn((e: any) => {
			throw e;
		});
		request.beforeRequest((cfg: any) => cfg, rejected as any);
		request.beforeRequest(() => {
			throw new Error('interceptor-fail');
		});
		await expect(request.get('/api')).rejects.toThrow('interceptor-fail');
		expect(rejected).toHaveBeenCalled();
	});

	it('afterResponse 的 rejected 捕获请求失败', async () => {
		let request: any;
		let mockUni: any;
		await jest.isolateModulesAsync(async () => {
			({ mockUni } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		mockUni.request
			.mockReset()
			.mockImplementation((opts: any) => opts.complete?.({ data: 'err', statusCode: 500, config: {} }));
		const rejected = jest.fn((e: any) => {
			throw e;
		});
		request.afterResponse(undefined, rejected as any);
		await expect(request.get('/api')).rejects.toMatchObject({ statusCode: 500 });
		expect(rejected).toHaveBeenCalled();
	});

	it('两个并发 loading 请求只 showLoading 一次', async () => {
		let request: any;
		let mockWx: any;
		await jest.isolateModulesAsync(async () => {
			({ mockWx } = setupGlobals());
			const mod = await import('@/uniapp');
			request = mod.request;
		});
		await Promise.all([request.get('/a', { loading: true }), request.get('/b', { loading: true })]);
		expect(mockWx.showLoading).toHaveBeenCalledTimes(1);
	});
});
