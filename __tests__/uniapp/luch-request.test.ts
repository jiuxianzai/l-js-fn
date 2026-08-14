/**
 * luch-request 内部模块单元测试
 * 覆盖 helpers / utils / clone / mergeConfig / Request / InterceptorManager / adapters
 */
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import buildURLRaw from '@/uniapp/request/luch-request/helpers/buildURL.ts';
import combineURLsRaw from '@/uniapp/request/luch-request/helpers/combineURLs.ts';
import isAbsoluteURLRaw from '@/uniapp/request/luch-request/helpers/isAbsoluteURL.ts';
import buildFullPathRaw from '@/uniapp/request/luch-request/core/buildFullPath.ts';
import settleRaw from '@/uniapp/request/luch-request/core/settle.ts';
import mergeConfigRaw from '@/uniapp/request/luch-request/core/mergeConfig.ts';
import RequestRaw from '@/uniapp/request/luch-request/core/Request.ts';
import InterceptorManagerRaw from '@/uniapp/request/luch-request/core/InterceptorManager.ts';
import * as utilsRaw from '@/uniapp/request/luch-request/utils.ts';
import adapterRaw from '@/uniapp/request/luch-request/adapters/index.ts';
import cloneRaw from '@/uniapp/request/luch-request/utils/clone.ts';

// luch-request 内部模块均为无类型 JS（@ts-nocheck），此处放宽类型以便调用
const buildURL: any = buildURLRaw;
const combineURLs: any = combineURLsRaw;
const isAbsoluteURL: any = isAbsoluteURLRaw;
const buildFullPath: any = buildFullPathRaw;
const settle: any = settleRaw;
const mergeConfig: any = mergeConfigRaw;
const Request: any = RequestRaw;
const InterceptorManager: any = InterceptorManagerRaw;
const utils: any = utilsRaw;
const adapter: any = adapterRaw;
const clone: any = cloneRaw;

describe('luch-request helpers', () => {
	describe('buildURL', () => {
		it('无 params 时原样返回 url', () => {
			expect(buildURL('/api')).toBe('/api');
			expect(buildURL('/api', undefined)).toBe('/api');
		});

		it('支持 URLSearchParams', () => {
			const params = new URLSearchParams({ a: '1', b: '2' });
			expect(buildURL('/api', params)).toBe('/api?a=1&b=2');
		});

		it('null/undefined 参数被跳过', () => {
			expect(buildURL('/api', { a: null, b: undefined, c: 'x' })).toBe('/api?c=x');
		});

		it('数组参数拼接为 key[index]', () => {
			expect(buildURL('/api', { tag: ['a', 'b'] })).toBe('/api?tag%5B0%5D=a&tag%5B1%5D=b');
		});

		it('Date 参数转 ISO 字符串', () => {
			const d = new Date('2024-01-01T00:00:00.000Z');
			expect(buildURL('/api', { t: d })).toBe('/api?t=2024-01-01T00%3A00%3A00.000Z');
		});

		it('嵌套对象参数拼接为 key[sub]=value', () => {
			expect(buildURL('/api', { user: { id: 1 } })).toBe('/api?user%5Bid%5D=1');
		});

		it('特殊字符百分号编码', () => {
			expect(buildURL('/api', { q: 'a@b:c$d,e' })).toBe('/api?q=a%40b%3Ac%24d%2Ce');
		});

		it('剥离 hash 部分', () => {
			expect(buildURL('/api#section', { a: '1' })).toBe('/api?a=1');
		});

		it('url 已含 ? 时用 & 拼接', () => {
			expect(buildURL('/api?x=1', { a: '2' })).toBe('/api?x=1&a=2');
		});

		it('url 无 ? 时用 ? 拼接', () => {
			expect(buildURL('/api', { a: '2' })).toBe('/api?a=2');
		});
	});

	describe('combineURLs', () => {
		it('组合 baseURL 与 relativeURL 并去除多余斜杠', () => {
			expect(combineURLs('https://a.com/', '/api')).toBe('https://a.com/api');
		});

		it('relativeURL 为空返回 baseURL', () => {
			expect(combineURLs('https://a.com', '')).toBe('https://a.com');
		});
	});

	describe('isAbsoluteURL', () => {
		it('识别 http/https 绝对地址', () => {
			expect(isAbsoluteURL('http://a.com')).toBe(true);
			expect(isAbsoluteURL('https://a.com')).toBe(true);
		});

		it('识别协议相对地址', () => {
			expect(isAbsoluteURL('//a.com/path')).toBe(true);
		});

		it('识别自定义 scheme', () => {
			expect(isAbsoluteURL('wx://a.com')).toBe(true);
		});

		it('相对路径返回 false', () => {
			expect(isAbsoluteURL('/api')).toBe(false);
			expect(isAbsoluteURL('api')).toBe(false);
		});
	});

	describe('buildFullPath', () => {
		it('有 baseURL 且非绝对地址时组合', () => {
			expect(buildFullPath('https://a.com', '/api')).toBe('https://a.com/api');
		});

		it('绝对地址原样返回', () => {
			expect(buildFullPath('https://a.com', 'https://b.com/x')).toBe('https://b.com/x');
		});

		it('无 baseURL 返回 requestedURL', () => {
			expect(buildFullPath('', '/api')).toBe('/api');
		});
	});
});

describe('luch-request utils', () => {
	it('isArray / isObject / isDate / isBoolean / isPlainObject / isUndefined', () => {
		expect(utils.isArray([])).toBe(true);
		expect(utils.isArray({})).toBe(false);
		expect(utils.isObject(null)).toBe(false);
		expect(utils.isObject({})).toBe(true);
		expect(utils.isDate(new Date())).toBe(true);
		expect(utils.isDate('2024')).toBe(false);
		expect(utils.isBoolean(true)).toBe(true);
		expect(utils.isBoolean(1)).toBe(false);
		expect(utils.isPlainObject({})).toBe(true);
		expect(utils.isPlainObject([])).toBe(false);
		expect(utils.isUndefined(undefined)).toBe(true);
		expect(utils.isUndefined(null)).toBe(false);
	});

	it('isURLSearchParams 识别 URLSearchParams', () => {
		expect(utils.isURLSearchParams(new URLSearchParams('a=1'))).toBe(true);
		expect(utils.isURLSearchParams('a=1')).toBe(false);
	});

	it('forEach null 直接返回', () => {
		const fn = jest.fn();
		utils.forEach(null, fn);
		utils.forEach(undefined, fn);
		expect(fn).not.toHaveBeenCalled();
	});

	it('forEach 原始值包装为数组', () => {
		const fn = jest.fn();
		utils.forEach('x', fn);
		expect(fn).toHaveBeenCalledWith('x', 0, ['x']);
	});

	it('forEach 遍历数组', () => {
		const fn = jest.fn();
		utils.forEach([1, 2], fn);
		expect(fn).toHaveBeenNthCalledWith(1, 1, 0, [1, 2]);
		expect(fn).toHaveBeenNthCalledWith(2, 2, 1, [1, 2]);
	});

	it('forEach 遍历对象（仅自有属性）', () => {
		const fn = jest.fn();
		const obj: any = { a: 1 };
		utils.forEach(obj, fn);
		expect(fn).toHaveBeenCalledWith(1, 'a', obj);
	});

	it('deepMerge 递归合并嵌套对象与覆盖基本值', () => {
		const result = utils.deepMerge({ a: { b: 1 }, c: 'x' }, { a: { d: 2 }, c: 'y' });
		expect(result).toEqual({ a: { b: 1, d: 2 }, c: 'y' });
	});

	it('deepMerge 处理多层参数与纯对象子值', () => {
		const result = utils.deepMerge({ a: { b: { c: 1 } } }, { a: { b: { e: 2 }, f: 3 } });
		expect(result).toEqual({ a: { b: { c: 1, e: 2 }, f: 3 } });
	});
});

describe('luch-request clone', () => {
	it('基本类型与 null', () => {
		expect(clone(null)).toBeNull();
		expect(clone(1)).toBe(1);
		expect(clone('str')).toBe('str');
		expect(clone(undefined)).toBe(undefined);
	});

	it('depth=0 时原样返回', () => {
		const obj = { a: 1 };
		expect(clone(obj, true, 0)).toBe(obj);
	});

	it('克隆普通对象与数组', () => {
		const obj = { a: [1, 2], b: { c: 3 } };
		const copy = clone(obj);
		expect(copy).toEqual(obj);
		expect(copy).not.toBe(obj);
		expect(copy.a).not.toBe(obj.a);
	});

	it('支持循环引用', () => {
		const obj: any = { name: 'root' };
		obj.self = obj;
		const copy = clone(obj);
		expect(copy.self).toBe(copy);
	});

	it('支持 options 对象参数', () => {
		const obj: any = { a: { b: { c: 1 } } };
		const copy = clone(obj, { circular: true, depth: 2 });
		expect(copy).toEqual(obj);
	});

	it('克隆 Map', () => {
		const m = new Map([['k', { v: 1 }]]);
		const copy = clone(m);
		expect(copy).toBeInstanceOf(Map);
		expect(copy.get('k')).toEqual({ v: 1 });
		expect(copy.get('k')).not.toBe(m.get('k'));
	});

	it('克隆 Set', () => {
		const s = new Set([{ v: 1 }]);
		const copy = clone(s);
		expect(copy).toBeInstanceOf(Set);
		expect(copy.has({ v: 1 })).toBe(false);
		expect(copy.size).toBe(1);
	});

	it('克隆 Promise 并沿用值', async () => {
		const p = Promise.resolve({ v: 1 });
		const copy = clone(p);
		await expect(copy).resolves.toEqual({ v: 1 });
	});

	it('克隆 Promise 拒绝并沿用错误', async () => {
		const p = Promise.reject(new Error('boom'));
		const copy = clone(p);
		await expect(copy).rejects.toThrow('boom');
	});

	it('克隆 RegExp 保留 flags 与 lastIndex', () => {
		const re = /abc/gi;
		re.lastIndex = 3;
		const copy = clone(re);
		expect(copy).toBeInstanceOf(RegExp);
		expect(copy.source).toBe('abc');
		expect(copy.global).toBe(true);
		expect(copy.ignoreCase).toBe(true);
		expect(copy.lastIndex).toBe(3);
	});

	it('克隆 RegExp 无 flags 与 lastIndex 0', () => {
		const copy = clone(/abc/);
		expect(copy.source).toBe('abc');
		expect(copy.lastIndex).toBe(0);
	});

	it('克隆 Date', () => {
		const d = new Date('2024-01-01T00:00:00Z');
		const copy = clone(d);
		expect(copy).toBeInstanceOf(Date);
		expect(copy.getTime()).toBe(d.getTime());
		expect(copy).not.toBe(d);
	});

	it('克隆 Buffer', () => {
		const b = Buffer.from('hello');
		const copy = clone(b);
		expect(Buffer.isBuffer(copy)).toBe(true);
		expect(copy.toString()).toBe('hello');
	});

	it('克隆 Error 保留属性', () => {
		const err: any = new Error('boom');
		err.extra = 1;
		const copy = clone(err);
		expect(copy).toBeInstanceOf(Error);
		expect(copy.message).toBe('boom');
		expect(copy.extra).toBe(1);
	});

	it('克隆 symbol 属性（可枚举）', () => {
		const sym = Symbol('s');
		const obj: any = { [sym]: 1 };
		const copy = clone(obj);
		expect(copy[sym]).toBe(1);
	});

	it('克隆跳过不可枚举 symbol（includeNonEnumerable=false）', () => {
		const sym = Symbol('hidden');
		const obj: any = {};
		Object.defineProperty(obj, sym, { value: 1, enumerable: false });
		const copy = clone(obj);
		expect(copy[sym]).toBeUndefined();
	});

	it('克隆支持自定义 prototype', () => {
		const proto = { kind: 'custom' };
		const obj = { a: 1 };
		const copy = clone(obj, true, Infinity, proto);
		expect(copy).toEqual({ a: 1 });
		expect(Object.getPrototypeOf(copy)).toBe(proto);
	});

	it('includeNonEnumerable 复制不可枚举属性', () => {
		const obj: any = { a: 1 };
		Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false, writable: true });
		const copy = clone(obj, true, Infinity, undefined, true);
		expect(copy.hidden).toBe(2);
	});

	it('克隆只带 getter 的属性时跳过（TypeError 分支）', () => {
		const obj: any = {};
		Object.defineProperty(obj, 'readonly', { get: () => 42, enumerable: true });
		expect(() => clone(obj)).not.toThrow();
	});

	it('clonePrototype 以父对象为原型', () => {
		const proto = { greet() { return 'hi'; } };
		const c: any = clone.clonePrototype(proto);
		expect(c.greet()).toBe('hi');
		expect(Object.getPrototypeOf(c)).toBe(proto);
	});

	it('clonePrototype null 返回 null', () => {
		expect(clone.clonePrototype(null)).toBeNull();
	});

	it('Map/Set/Promise 缺失时克隆回退为普通函数', () => {
		const origMap = (global as any).Map;
		const origSet = (global as any).Set;
		const origPromise = (global as any).Promise;
		delete (global as any).Map;
		delete (global as any).Set;
		delete (global as any).Promise;
		let cloned: any;
		jest.isolateModules(() => {
			const c: any = jest.requireActual('@/uniapp/request/luch-request/utils/clone.ts');
			cloned = c.default({ a: [1, 2] });
		});
		(global as any).Map = origMap;
		(global as any).Set = origSet;
		(global as any).Promise = origPromise;
		expect(cloned).toEqual({ a: [1, 2] });
	});
});

describe('luch-request mergeConfig', () => {
	it('默认 GET 合并基础字段', () => {
		const config: any = mergeConfig({ baseURL: 'https://a.com', custom: { a: 1 }, header: { 'x-a': '1' } }, {
			url: '/api',
			custom: { b: 2 },
			header: { 'x-b': '2' },
		});
		expect(config.method).toBe('GET');
		expect(config.baseURL).toBe('https://a.com');
		expect(config.url).toBe('/api');
		expect(config.custom).toEqual({ a: 1, b: 2 });
		expect(config.header).toEqual({ 'x-a': '1', 'x-b': '2' });
	});

	it('局部 method 覆盖全局', () => {
		const config: any = mergeConfig({ method: 'GET' }, { method: 'POST', data: { a: 1 } });
		expect(config.method).toBe('POST');
		expect(config.data).toEqual({ a: 1 });
	});

	it('mergeKeys 处理 getTask / validateStatus', () => {
		const getTask = jest.fn();
		const config: any = mergeConfig({ validateStatus: () => true }, { getTask });
		expect(config.getTask).toBe(getTask);
		expect(typeof config.validateStatus).toBe('function');
	});

	it('DOWNLOAD 分支：timeout 优先取局部', () => {
		const config: any = mergeConfig({ timeout: 1000 }, { method: 'DOWNLOAD', timeout: 2000 });
		expect(config.timeout).toBe(2000);
	});

	it('DOWNLOAD 分支：timeout 回退全局', () => {
		const config: any = mergeConfig({ timeout: 1000 }, { method: 'DOWNLOAD' });
		expect(config.timeout).toBe(1000);
	});

	it('UPLOAD 分支：删除 content-type 并收集上传字段', () => {
		const config: any = mergeConfig({ timeout: 1000, header: { 'content-type': 'x', 'Content-Type': 'y' } }, {
			method: 'UPLOAD',
			files: ['a'],
			fileType: 'image',
			file: 'f',
			filePath: '/p',
			name: 'n',
			formData: { k: 'v' },
			timeout: 3000,
		});
		expect(config.header['content-type']).toBeUndefined();
		expect(config.header['Content-Type']).toBeUndefined();
		expect(config.files).toEqual(['a']);
		expect(config.fileType).toBe('image');
		expect(config.file).toBe('f');
		expect(config.filePath).toBe('/p');
		expect(config.name).toBe('n');
		expect(config.formData).toEqual({ k: 'v' });
		expect(config.timeout).toBe(3000);
	});

	it('UPLOAD 分支：timeout 回退全局', () => {
		const config: any = mergeConfig({ timeout: 1000, header: {} }, { method: 'UPLOAD' });
		expect(config.timeout).toBe(1000);
	});

	it('默认分支合并 defaultsKeys（部分缺失时用全局）', () => {
		const config: any = mergeConfig({ timeout: 1000, dataType: 'json' }, { method: 'GET', timeout: 2000 });
		expect(config.timeout).toBe(2000);
		expect(config.dataType).toBe('json');
	});
});

describe('luch-request InterceptorManager', () => {
	it('use 返回下标，eject 置空，forEach 跳过空位', () => {
		const im: any = new (InterceptorManager as any)();
		const f1 = jest.fn();
		const f2 = jest.fn();
		const id1 = im.use(f1);
		const id2 = im.use(f2);
		expect(id1).toBe(0);
		expect(id2).toBe(1);
		im.eject(id1);
		const seen: any[] = [];
		im.forEach((h: any) => seen.push(h));
		expect(seen).toHaveLength(1);
		expect(seen[0].fulfilled).toBe(f2);
	});

	it('eject 不存在的下标不报错', () => {
		const im: any = new (InterceptorManager as any)();
		expect(() => im.eject(99)).not.toThrow();
	});
});

describe('luch-request adapter', () => {
	let mockUni: any;

	beforeEach(() => {
		mockUni = {
			request: jest.fn((opts: any) => opts.complete?.({ data: { code: 0 }, statusCode: 200, config: {} })),
			uploadFile: jest.fn((opts: any) => opts.complete?.({ data: 'ok', statusCode: 200, config: {} })),
			downloadFile: jest.fn((opts: any) => opts.complete?.({ data: 'ok', statusCode: 200, config: {} })),
		};
		(global as any).uni = mockUni;
	});

	afterEach(() => {
		delete (global as any).uni;
		delete (global as any).my;
	});

	it('普通请求走 uni.request', async () => {
		const config = { url: '/api', method: 'GET', header: {}, baseURL: '' };
		const res: any = await adapter(config);
		expect(mockUni.request).toHaveBeenCalled();
		expect(res.statusCode).toBe(200);
	});

	it('UPLOAD 走 uni.uploadFile 并删除 content-type', async () => {
		const config = {
			url: '/up',
			method: 'UPLOAD',
			header: { 'content-type': 'x', 'Content-Type': 'y' },
			baseURL: '',
			fileType: 'image',
			filePath: '/p',
			name: 'n',
			files: ['a'],
			file: 'f',
			timeout: 100,
			formData: { k: 'v' },
		};
		await adapter(config);
		expect(mockUni.uploadFile).toHaveBeenCalled();
		const callOpts = mockUni.uploadFile.mock.calls[0][0];
		expect(callOpts.header['content-type']).toBeUndefined();
		expect(callOpts.fileType).toBe('image');
		expect(callOpts.name).toBe('n');
		expect(callOpts.files).toEqual(['a']);
		expect(callOpts.formData).toEqual({ k: 'v' });
	});

	it('DOWNLOAD 走 uni.downloadFile 并携带 timeout', async () => {
		await adapter({ url: '/dl', method: 'DOWNLOAD', header: {}, baseURL: '', timeout: 500 });
		expect(mockUni.downloadFile).toHaveBeenCalled();
		expect(mockUni.downloadFile.mock.calls[0][0].timeout).toBe(500);
	});

	it('DOWNLOAD 无 timeout 时不携带', async () => {
		await adapter({ url: '/dl', method: 'DOWNLOAD', header: {}, baseURL: '' });
		expect(mockUni.downloadFile.mock.calls[0][0].timeout).toBeUndefined();
	});

	it('request 响应 data 为字符串时尝试 JSON.parse', async () => {
		mockUni.request.mockImplementationOnce((opts: any) =>
			opts.complete?.({ data: '{"code":1}', statusCode: 200, config: {} })
		);
		const res: any = await adapter({ url: '/api', method: 'GET', header: {}, baseURL: '' });
		expect(res.data).toEqual({ code: 1 });
	});

	it('request 响应 data 非法 JSON 时保持原样', async () => {
		mockUni.request.mockImplementationOnce((opts: any) =>
			opts.complete?.({ data: 'not-json', statusCode: 200, config: {} })
		);
		const res: any = await adapter({ url: '/api', method: 'GET', header: {}, baseURL: '' });
		expect(res.data).toBe('not-json');
	});

	it('非 2xx 状态码时 reject', async () => {
		mockUni.request.mockImplementationOnce((opts: any) =>
			opts.complete?.({ data: 'err', statusCode: 500, config: {} })
		);
		await expect(
			adapter({
				url: '/api',
				method: 'GET',
				header: {},
				baseURL: '',
				validateStatus: (status: number) => status >= 200 && status < 300,
			})
		).rejects.toMatchObject({ statusCode: 500 });
	});

	it('定义 my 时不携带 responseType', async () => {
		(global as any).my = {};
		await adapter({ url: '/api', method: 'GET', header: {}, baseURL: '', responseType: 'text' });
		expect(mockUni.request.mock.calls[0][0].responseType).toBeUndefined();
	});

	it('getTask 回调拿到 requestTask', async () => {
		const task = { abort: jest.fn() };
		mockUni.request.mockImplementationOnce((opts: any) => {
			opts.complete?.({ data: 'ok', statusCode: 200, config: {} });
			return task;
		});
		const getTask = jest.fn();
		await adapter({ url: '/api', method: 'GET', header: {}, baseURL: '', getTask });
		expect(getTask).toHaveBeenCalledWith(task, expect.anything());
	});
});

describe('luch-request Request', () => {
	let mockUni: any;

	beforeEach(() => {
		mockUni = {
			request: jest.fn((opts: any) => opts.complete?.({ data: 'ok', statusCode: 200, config: {} })),
			uploadFile: jest.fn((opts: any) => opts.complete?.({ data: 'ok', statusCode: 200, config: {} })),
			downloadFile: jest.fn((opts: any) => opts.complete?.({ data: 'ok', statusCode: 200, config: {} })),
		};
		(global as any).uni = mockUni;
	});

	afterEach(() => {
		delete (global as any).uni;
		jest.restoreAllMocks();
	});

	it('构造函数支持设置全局配置', () => {
		const r: any = new Request({ baseURL: 'https://a.com', timeout: 5000 } as any);
		expect(r.config.baseURL).toBe('https://a.com');
		expect(r.config.timeout).toBe(5000);
	});

	it('构造函数接收非对象参数时告警并回退空配置', () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const r: any = new Request('bad' as any);
		expect(warn).toHaveBeenCalled();
		expect(r.config).toBeDefined();
	});

	it('setConfig 通过回调更新配置', () => {
		const r = new Request() as any;
		r.setConfig((prev: any) => ({ ...prev, timeout: 123 }));
		expect(r.config.timeout).toBe(123);
	});

	it('request 与 get/post/put/delete 方法', async () => {
		const r = new Request({ baseURL: 'https://a.com' } as any) as any;
		await expect(r.request({ url: '/api' })).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.get('/g')).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.post('/p', { a: 1 })).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.put('/u', { a: 1 })).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.delete('/d', { a: 1 })).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.connect('/c', {})).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.head('/h', {})).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.options('/o', {})).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.trace('/t', {})).resolves.toMatchObject({ statusCode: 200 });
		const methods = mockUni.request.mock.calls.map((c: any[]) => c[0].method);
		expect(methods).toEqual(['GET', 'GET', 'POST', 'PUT', 'DELETE', 'CONNECT', 'HEAD', 'OPTIONS', 'TRACE']);
	});

	it('upload 与 download 方法', async () => {
		const r = new Request() as any;
		await expect(r.upload('/up')).resolves.toMatchObject({ statusCode: 200 });
		await expect(r.download('/dl')).resolves.toMatchObject({ statusCode: 200 });
		expect(mockUni.uploadFile).toHaveBeenCalled();
		expect(mockUni.downloadFile).toHaveBeenCalled();
	});

	it('请求拦截器可修改 config，响应拦截器可改写响应', async () => {
		const r = new Request() as any;
		r.interceptors.request.use((cfg: any) => ({ ...cfg, header: { ...cfg.header, 'X': '1' } }));
		r.interceptors.response.use((res: any) => ({ ...res, handled: true }));
		const res: any = await r.get('/api');
		expect(res.handled).toBe(true);
		expect(mockUni.request.mock.calls[0][0].header['X']).toBe('1');
	});

	it('请求失败时响应拦截器 rejected 分支生效', async () => {
		mockUni.request.mockImplementationOnce((opts: any) => opts.complete?.({ data: 'err', statusCode: 500, config: {} }));
		const r = new Request() as any;
		const rejected = jest.fn((err: any) => {
			throw err;
		});
		r.interceptors.response.use(undefined, rejected);
		await expect(r.get('/api')).rejects.toMatchObject({ statusCode: 500 });
		expect(rejected).toHaveBeenCalled();
	});
});
