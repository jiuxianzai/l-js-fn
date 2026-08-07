/**
 * uniapp file 模块单元测试
 * 测试文件系统封装（write / read / access / remove / getPath），覆盖微信/支付宝双平台
 */
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { registerAdapter, createWechatAdapter, createAlipayAdapter, file } from '@/uniapp';

interface MockFs {
	writeFile: jest.Mock;
	readFile: jest.Mock;
	access: jest.Mock;
	unlink: jest.Mock;
}

function createMockFs(): MockFs {
	const mockFs: MockFs = {
		writeFile: jest.fn((opts: any) => opts.success?.()),
		readFile: jest.fn((opts: any) => opts.success?.({ data: '' })),
		access: jest.fn((opts: any) => opts.success?.()),
		unlink: jest.fn((opts: any) => opts.success?.()),
	};
	return mockFs;
}

function setupWx(): MockFs {
	const mockFs = createMockFs();
	const wx = {
		getFileSystemManager: jest.fn().mockReturnValue(mockFs),
		env: { USER_DATA_PATH: 'wxfile://usr' },
	} as any;
	registerAdapter(createWechatAdapter(wx));
	return mockFs;
}

function setupAlipay(): MockFs {
	const mockFs = createMockFs();
	const my = {
		getFileSystemManager: jest.fn().mockReturnValue(mockFs),
		env: { USER_DATA_PATH: 'https://usr' },
	} as any;
	registerAdapter(createAlipayAdapter(my));
	return mockFs;
}

beforeEach(() => {
	setupWx();
});

describe('uniapp - file 模块（微信平台）', () => {
	it('getPath 应返回 USER_DATA_PATH/文件名', () => {
		setupWx();
		expect(file.getPath('a.json')).toBe('wxfile://usr/a.json');
		expect(file.getPath('/a.json')).toBe('wxfile://usr/a.json');
		expect(file.getPath('dir/b.txt')).toBe('wxfile://usr/dir/b.txt');
	});

	it('write 应写入字符串内容到完整路径', async () => {
		const mockFs = setupWx();
		await file.write('note.txt', 'hello');
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: 'wxfile://usr/note.txt',
				data: 'hello',
				encoding: 'utf8',
			})
		);
	});

	it('write 应 JSON 序列化对象', async () => {
		const mockFs = setupWx();
		await file.write('user.json', { name: 'John', age: 20 });
		expect(mockFs.writeFile).toHaveBeenCalledWith(
			expect.objectContaining({
				filePath: 'wxfile://usr/user.json',
				data: '{"name":"John","age":20}',
			})
		);
	});

	it('write 失败应 reject', async () => {
		const mockFs = setupWx();
		mockFs.writeFile.mockImplementationOnce((opts: any) => opts.fail({ errMsg: 'fail' }));
		await expect(file.write('a.txt', 'x')).rejects.toBeTruthy();
	});

	it('read 应 JSON 反序列化对象', async () => {
		const mockFs = setupWx();
		mockFs.readFile.mockImplementationOnce((opts: any) =>
			opts.success({ data: '{"name":"John","age":20}' })
		);
		const result = await file.read<{ name: string }>('user.json');
		expect(result).toEqual({ name: 'John', age: 20 });
	});

	it('read 非 JSON 内容应降级返回字符串', async () => {
		const mockFs = setupWx();
		mockFs.readFile.mockImplementationOnce((opts: any) => opts.success({ data: '纯文本' }));
		const result = await file.read('note.txt');
		expect(result).toBe('纯文本');
	});

	it('read json=false 应返回原始字符串', async () => {
		const mockFs = setupWx();
		mockFs.readFile.mockImplementationOnce((opts: any) =>
			opts.success({ data: '{"a":1}' })
		);
		const result = await file.read('raw.txt', { json: false });
		expect(result).toBe('{"a":1}');
	});

	it('read 失败应 reject', async () => {
		const mockFs = setupWx();
		mockFs.readFile.mockImplementationOnce((opts: any) => opts.fail({ errMsg: 'fail' }));
		await expect(file.read('a.txt')).rejects.toBeTruthy();
	});

	it('access 存在应返回 true，不存在返回 false', async () => {
		const mockFs = setupWx();
		mockFs.access.mockImplementationOnce((opts: any) => opts.success());
		expect(await file.access('a.json')).toBe(true);
		mockFs.access.mockImplementationOnce((opts: any) => opts.fail());
		expect(await file.access('b.json')).toBe(false);
	});

	it('remove 应调用 unlink', async () => {
		const mockFs = setupWx();
		await file.remove('a.json');
		expect(mockFs.unlink).toHaveBeenCalledWith(
			expect.objectContaining({ filePath: 'wxfile://usr/a.json' })
		);
	});

	it('remove 失败应 reject', async () => {
		const mockFs = setupWx();
		mockFs.unlink.mockImplementationOnce((opts: any) => opts.fail({ errMsg: 'fail' }));
		await expect(file.remove('a.json')).rejects.toBeTruthy();
	});
});

describe('uniapp - file 模块（支付宝平台）', () => {
	it('getPath 应使用 my.env.USER_DATA_PATH', () => {
		setupAlipay();
		expect(file.getPath('a.json')).toBe('https://usr/a.json');
	});

	it('write/read 应使用 my.getFileSystemManager（filePath + encoding）', async () => {
		const mockFs = setupAlipay();
		await file.write('user.json', { a: 1 });
		const writeArgs = mockFs.writeFile.mock.calls[0][0] as Record<string, any>;
		expect(writeArgs.filePath).toBe('https://usr/user.json');
		expect(writeArgs.data).toBe('{"a":1}');
		expect(writeArgs.encoding).toBe('utf8');

		mockFs.readFile.mockImplementationOnce((opts: any) =>
			opts.success({ data: '{"a":1}' })
		);
		expect(await file.read('user.json')).toEqual({ a: 1 });
		const readArgs = mockFs.readFile.mock.calls[0][0] as Record<string, any>;
		expect(readArgs.filePath).toBe('https://usr/user.json');
		expect(readArgs.encoding).toBe('utf8');
	});

	it('getPath 参数非法应抛错', () => {
		setupAlipay();
		expect(() => file.getPath('')).toThrow(TypeError);
	});

	it('remove 应使用 my.getFileSystemManager（filePath 参数）', async () => {
		const mockFs = setupAlipay();
		await file.remove('a.json');
		const args = mockFs.unlink.mock.calls[0][0] as Record<string, any>;
		expect(args.filePath).toBe('https://usr/a.json');
	});
});

describe('uniapp - file 模块（不支持文件系统）', () => {
	it('适配器未提供 fileWrite 应抛错', async () => {
		// 自定义适配器：有 USER_DATA_PATH 但没有文件操作方法
		registerAdapter({
			name: 'custom',
			api: {},
			getUserDataPath: () => '/tmp',
			// 故意不实现 fileWrite/fileRead/fileAccess/fileRemove
		} as any);
		let thrown = false;
		try {
			await file.write('a.txt', 'x');
		} catch (e: any) {
			thrown = true;
			expect(String(e?.message || e)).toContain('不支持文件系统');
		}
		expect(thrown).toBe(true);
	});

	it('缺少 USER_DATA_PATH 应抛错', () => {
		const mockFs = createMockFs();
		const wx = {
			getFileSystemManager: jest.fn().mockReturnValue(mockFs),
			env: {},
		} as any;
		registerAdapter(createWechatAdapter(wx));
		expect(() => file.getPath('a.txt')).toThrow('不支持 USER_DATA_PATH');
	});
});
