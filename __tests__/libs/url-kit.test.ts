/**
 * url-kit 单元测试
 * 测试所有 URL 处理相关的方法
 */

import {
	getUrlParams,
	getUrlParam,
	appendUrlParam,
	appendUrlParams,
	transUrlParams,
	getFileInfoToUrl,
} from '@/libs/url-kit';

describe('url-kit - URL 处理工具', () => {
	// ==================== getUrlParams 测试 ====================
	describe('getUrlParams - 解析 URL 查询参数', () => {
		it('应该解析简单的查询参数', () => {
			const url = 'https://example.com?name=John&age=30';
			const result = getUrlParams(url);
			expect(result).toEqual({ name: 'John', age: '30' });
		});

		it('应该处理没有查询参数的 URL', () => {
			const url = 'https://example.com';
			const result = getUrlParams(url);
			expect(result).toEqual({});
		});

		it('应该处理空字符串', () => {
			// 空字符串会被当作没有 URL，在非浏览器环境抛出错误
			expect(() => getUrlParams('')).toThrow('URL must be provided in a non-browser environment.');
		});

		it('应该处理编码的参数值', () => {
			const url = 'https://example.com?name=John%20Doe&email=john%40example.com';
			const result = getUrlParams(url);
			expect(result).toEqual({ name: 'John Doe', email: 'john@example.com' });
		});

		it('应该将 + 解码为空格', () => {
			const url = 'https://example.com?name=John+Doe';
			const result = getUrlParams(url);
			expect(result).toEqual({ name: 'John Doe' });
		});

		it('应该处理数组参数（重复的键）', () => {
			const url = 'https://example.com?tags=javascript&tags=typescript';
			const result = getUrlParams(url);
			expect(result).toEqual({ tags: ['javascript', 'typescript'] });
		});

		it('应该处理嵌套对象参数', () => {
			const url = 'https://example.com?user[name]=John&user[age]=30';
			const result = getUrlParams(url);
			expect(result).toEqual({ user: { name: 'John', age: '30' } });
		});

		it('应该处理混合的数组和对象参数', () => {
			const url = 'https://example.com?tags[]=a&tags[]=b&user[name]=John';
			const result = getUrlParams(url);
			// 注意：实现会去掉空的 []，所以 'tags[]' 变成 'tags'
			expect(result).toEqual({ tags: ['a', 'b'], user: { name: 'John' } });
		});

		it('应该处理没有值的参数（空字符串）', () => {
			const url = 'https://example.com?name=&age=30';
			const result = getUrlParams(url);
			expect(result).toEqual({ name: '', age: '30' });
		});

		it('应该抛出错误如果在非浏览器环境且没有 URL', () => {
			// 在 Node.js 环境中测试
			expect(() => getUrlParams()).toThrow('URL must be provided in a non-browser environment.');
		});

		it('应该处理特殊字符', () => {
			const url = 'https://example.com?text=Hello%20World%21';
			const result = getUrlParams(url);
			expect(result).toEqual({ text: 'Hello World!' });
		});
	});

	// ==================== getUrlParam 测试 ====================
	describe('getUrlParam - 获取指定查询参数', () => {
		it('应该返回指定参数的值', () => {
			const url = 'https://example.com?name=John&age=30';
			expect(getUrlParam(url, 'name')).toBe('John');
			expect(getUrlParam(url, 'age')).toBe('30');
		});

		it('应该返回 null 如果参数不存在', () => {
			const url = 'https://example.com?name=John';
			expect(getUrlParam(url, 'age')).toBeNull();
		});

		it('应该处理编码的参数值', () => {
			const url = 'https://example.com?email=john%40example.com';
			expect(getUrlParam(url, 'email')).toBe('john@example.com');
		});

		it('应该处理嵌套参数', () => {
			const url = 'https://example.com?user[name]=John';
			const result = getUrlParam<any>(url, 'user');
			expect(result).toEqual({ name: 'John' });
		});

		it('应该处理数组参数', () => {
			const url = 'https://example.com?tags=javascript&tags=typescript';
			const result = getUrlParam<string[]>(url, 'tags');
			expect(result).toEqual(['javascript', 'typescript']);
		});

		it('应该处理空 URL', () => {
			expect(() => getUrlParam('', 'name')).toThrow('URL must be provided in a non-browser environment.');
		});
	});

	// ==================== appendUrlParam 测试 ====================
	describe('appendUrlParam - 向 URL 添加参数', () => {
		it('应该向没有参数的 URL 添加参数', () => {
			const result = appendUrlParam('https://example.com', 'name', 'John');
			expect(result).toBe('https://example.com?name=John');
		});

		it('应该向已有参数的 URL 添加参数', () => {
			const result = appendUrlParam('https://example.com?age=30', 'name', 'John');
			expect(result).toBe('https://example.com?age=30&name=John');
		});

		it('应该编码参数值', () => {
			const result = appendUrlParam('https://example.com', 'email', 'john@example.com');
			expect(result).toBe('https://example.com?email=john%40example.com');
		});

		it('应该处理空字符串参数值', () => {
			const result = appendUrlParam('https://example.com', 'name', '');
			// 空字符串被编码为 ''，实现会省略 = 号
			expect(result).toBe('https://example.com?name');
		});

		it('应该处理 undefined 参数值', () => {
			const result = appendUrlParam('https://example.com', 'name', undefined);
			expect(result).toBe('https://example.com?name');
		});

		it('应该处理数字参数值', () => {
			const result = appendUrlParam('https://example.com', 'age', 30);
			expect(result).toBe('https://example.com?age=30');
		});

		it('应该处理特殊字符', () => {
			const result = appendUrlParam('https://example.com', 'text', 'Hello World!');
			expect(result).toBe('https://example.com?text=Hello%20World!');
		});

		it('应该返回 null 如果 URL 为空', () => {
			expect(appendUrlParam('', 'name', 'John')).toBeNull();
		});

		it('应该返回 null 如果参数名为空', () => {
			expect(appendUrlParam('https://example.com', '', 'John')).toBeNull();
		});

		it('应该处理包含 hash 的 URL', () => {
			const result = appendUrlParam('https://example.com#section', 'name', 'John');
			expect(result).toBe('https://example.com#section?name=John');
		});

		it('应该处理包含 hash 和参数的 URL', () => {
			const result = appendUrlParam('https://example.com?age=30#section', 'name', 'John');
			expect(result).toBe('https://example.com?age=30#section?name=John');
		});

		// ===== position: 'before' =====
		it('position=before：应该将参数追加到 # 前面', () => {
			const result = appendUrlParam('https://example.com/#/home', 'id', '1', { position: 'before' });
			expect(result).toBe('https://example.com/?id=1#/home');
		});

		it('position=before：应该处理参数追加到 # 前面已有参数的情况', () => {
			const result = appendUrlParam('https://example.com/?page=1#/home', 'id', '1', { position: 'before' });
			expect(result).toBe('https://example.com/?page=1&id=1#/home');
		});

		it('position=before：无 hash 时退化为默认行为', () => {
			const result = appendUrlParam('https://example.com', 'name', 'yyp', { position: 'before' });
			expect(result).toBe('https://example.com?name=yyp');
		});
	});

	// ==================== appendUrlParams 测试 ====================
	describe('appendUrlParams - 批量向 URL 添加查询参数', () => {
		it('应该向无参数的 URL 添加多个参数', () => {
			const result = appendUrlParams('https://example.com', { name: 'zs', age: '1' });
			expect(result).toBe('https://example.com?name=zs&age=1');
		});

		it('应该向已有参数的 URL 添加参数（使用 &）', () => {
			const result = appendUrlParams('https://example.com?id=1', { name: 'zs', age: '1' });
			expect(result).toBe('https://example.com?id=1&name=zs&age=1');
		});

		it('应该编码参数名和参数值', () => {
			const result = appendUrlParams('https://example.com', { 'user name': 'John Doe', email: 'john@example.com' });
			expect(result).toBe('https://example.com?user%20name=John%20Doe&email=john%40example.com');
		});

		it('应该跳过 null 值', () => {
			const result = appendUrlParams('https://example.com', { name: 'zs', age: null });
			expect(result).toBe('https://example.com?name=zs');
		});

		it('应该跳过空字符串', () => {
			const result = appendUrlParams('https://example.com', { name: 'zs', age: '' });
			expect(result).toBe('https://example.com?name=zs');
		});

		it('应该跳过 undefined 值', () => {
			const result = appendUrlParams('https://example.com', { name: 'zs', age: undefined as any });
			expect(result).toBe('https://example.com?name=zs');
		});

		it('应该保留 0 和 false', () => {
			const result = appendUrlParams('https://example.com', { count: 0 as any, active: false as any });
			expect(result).toBe('https://example.com?count=0&active=false');
		});

		it('应该处理数字值', () => {
			const result = appendUrlParams('https://example.com', { count: 100, price: 99.99 } as any);
			expect(result).toBe('https://example.com?count=100&price=99.99');
		});

		it('应该返回 null 如果 URL 为空', () => {
			expect(appendUrlParams('', { name: 'zs' })).toBeNull();
		});

		it('应该返回 null 如果参数对象为空', () => {
			expect(appendUrlParams('https://example.com', {})).toBeNull();
		});

		it('应该返回原 URL 如果所有参数值都是空的', () => {
			const result = appendUrlParams('https://example.com', { name: null as any, age: '' });
			expect(result).toBe('https://example.com');
		});

		it('应该处理包含 hash 的 URL', () => {
			const result = appendUrlParams('https://example.com#section', { name: 'zs' });
			expect(result).toBe('https://example.com#section?name=zs');
		});

		it('应该处理包含参数和 hash 的 URL', () => {
			const result = appendUrlParams('https://example.com?id=1#section', { name: 'zs', age: '1' });
			expect(result).toBe('https://example.com?id=1#section?name=zs&age=1');
		});

		it('应该处理 hash 路由模式（/）', () => {
			const result = appendUrlParams('https://example.com/#/path', { name: 'zs' });
			expect(result).toBe('https://example.com/#/path?name=zs');
		});

		it('应该处理 hash 路由模式下已有参数的情况', () => {
			const result = appendUrlParams('https://example.com/?id=1#/path', { name: 'zs' });
			expect(result).toBe('https://example.com/?id=1#/path?name=zs');
		});

		it('应该处理 history 路由模式', () => {
			const result = appendUrlParams('https://example.com/user/list', { name: 'zs' });
			expect(result).toBe('https://example.com/user/list?name=zs');
		});

		it('应该处理 history 路由模式下已有参数的情况', () => {
			const result = appendUrlParams('https://example.com/user/list?id=1', { name: 'zs' });
			expect(result).toBe('https://example.com/user/list?id=1&name=zs');
		});

		it('应该处理包含端口号的 URL', () => {
			const result = appendUrlParams('https://example.com:8080', { name: 'zs' });
			expect(result).toBe('https://example.com:8080?name=zs');
		});

		it('应该处理包含路径、参数和 hash 的完整 URL', () => {
			const result = appendUrlParams('https://example.com/path/to?page=1#top', { name: 'zs' });
			expect(result).toBe('https://example.com/path/to?page=1#top?name=zs');
		});

		// ===== position: 'before' =====
		it('position=before：应该将参数追加到 # 前面', () => {
			const result = appendUrlParams('https://example.com/#/home', { id: '1', name: 'yyp' }, { position: 'before' });
			expect(result).toBe('https://example.com/?id=1&name=yyp#/home');
		});

		it('position=before：应该处理 # 前已有参数的情况', () => {
			const result = appendUrlParams('https://example.com/?page=1#/home', { id: '2' }, { position: 'before' });
			expect(result).toBe('https://example.com/?page=1&id=2#/home');
		});

		it('position=before：应该处理 hash 后纯锚点的情况', () => {
			const result = appendUrlParams('https://example.com#section', { name: 'zs' }, { position: 'before' });
			expect(result).toBe('https://example.com?name=zs#section');
		});

		it('position=before：无 hash 时退化为默认行为', () => {
			const result = appendUrlParams('https://example.com', { name: 'yyp' }, { position: 'before' });
			expect(result).toBe('https://example.com?name=yyp');
		});

		it('position=before：无 hash 已有参数时正确拼接', () => {
			const result = appendUrlParams('https://example.com?id=1', { name: 'yyp' }, { position: 'before' });
			expect(result).toBe('https://example.com?id=1&name=yyp');
		});

		it('position=before：应该保留 # 后面的已有参数', () => {
			const result = appendUrlParams('https://example.com/?name=zs#/path?id=1', { page: '2' }, { position: 'before' });
			expect(result).toBe('https://example.com/?name=zs&page=2#/path?id=1');
		});

		it('position=before：应该编码参数', () => {
			const result = appendUrlParams('https://example.com/#/home', { 'user name': 'John Doe' }, { position: 'before' });
			expect(result).toBe('https://example.com/?user%20name=John%20Doe#/home');
		});

		it('position=before：应该跳过 null、空字符串和 undefined 值', () => {
			const result = appendUrlParams('https://example.com/#/home', { name: 'zs', age: null, foo: '', bar: undefined as any }, { position: 'before' });
			expect(result).toBe('https://example.com/?name=zs#/home');
		});
	});

	// ==================== transUrlParams 测试 ====================
	describe('transUrlParams - 将对象转换为 URL 查询字符串', () => {
		it('应该转换简单对象', () => {
			const params = { name: 'John', age: '30' };
			const result = transUrlParams(params);
			expect(result).toBe('name=John&age=30');
		});

		it('应该编码参数名和值', () => {
			const params = { 'user name': 'John Doe' };
			const result = transUrlParams(params);
			expect(result).toBe('user%20name=John%20Doe');
		});

		it('应该处理嵌套对象', () => {
			const params = { user: { name: 'John', age: '30' } };
			const result = transUrlParams(params);
			// 实现会对整个参数键进行编码，包括 []
			expect(result).toBe('user%5Bname%5D=John&user%5Bage%5D=30');
		});

		it('应该跳过 null 值', () => {
			const params = { name: 'John', age: null };
			const result = transUrlParams(params);
			expect(result).toBe('name=John');
		});

		it('应该跳过空字符串', () => {
			const params = { name: 'John', age: '' };
			const result = transUrlParams(params);
			expect(result).toBe('name=John');
		});

		it('应该跳过 undefined 值', () => {
			const params = { name: 'John', age: undefined };
			const result = transUrlParams(params);
			expect(result).toBe('name=John');
		});

		it('应该保留 0 和 false', () => {
			const params = { count: 0, active: false };
			const result = transUrlParams(params);
			expect(result).toBe('count=0&active=false');
		});

		it('应该处理空对象', () => {
			const result = transUrlParams({});
			expect(result).toBe('');
		});

		it('应该处理嵌套对象中的空值', () => {
			const params = { user: { name: 'John', age: null } };
			const result = transUrlParams(params);
			// 实现会对整个参数键进行编码，包括 []
			expect(result).toBe('user%5Bname%5D=John');
		});

		it('应该处理数字值', () => {
			const params = { count: 100, price: 99.99 };
			const result = transUrlParams(params);
			expect(result).toBe('count=100&price=99.99');
		});
	});

	// ==================== getFileInfoToUrl 测试 ====================
	describe('getFileInfoToUrl - 从 URL 提取文件信息', () => {
		it('应该提取文件名和扩展名', () => {
			const url = 'https://example.com/path/to/file.txt';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: 'file.txt', extension: '.txt' });
		});

		it('应该处理没有扩展名的文件', () => {
			const url = 'https://example.com/path/to/file';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: 'file', extension: '' });
		});

		it('应该处理多个扩展名（如 .tar.gz）', () => {
			const url = 'https://example.com/path/to/archive.tar.gz';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: 'archive.tar.gz', extension: '.gz' });
		});

		it('应该处理以点开头的文件名', () => {
			const url = 'https://example.com/path/to/.gitignore';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: '.gitignore', extension: '' });
		});

		it('应该处理编码的文件名', () => {
			const url = 'https://example.com/path/to/%E6%96%87%E4%BB%B6.txt';
			const result = getFileInfoToUrl(url);
			expect(result.fileName).toBe('文件.txt');
			expect(result.extension).toBe('.txt');
		});

		it('应该处理只有文件名的 URL', () => {
			const url = 'https://example.com/file.txt';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: 'file.txt', extension: '.txt' });
		});

		it('应该处理没有路径的 URL', () => {
			const url = 'https://example.com';
			const result = getFileInfoToUrl(url);
			expect(result.fileName).toBe('unknown');
		});

		it('应该处理以 / 结尾的 URL', () => {
			const url = 'https://example.com/path/';
			const result = getFileInfoToUrl(url);
			expect(result.fileName).toBe('unknown');
		});

		it('应该处理查询参数和 hash', () => {
			const url = 'https://example.com/path/to/file.txt?download=true#section';
			const result = getFileInfoToUrl(url);
			expect(result).toEqual({ fileName: 'file.txt', extension: '.txt' });
		});

		it('应该处理无效的 URL', () => {
			const url = 'not-a-valid-url';
			const result = getFileInfoToUrl(url);
			expect(result.fileName).toBe('not-a-valid-url');
		});

		it('应该处理空字符串', () => {
			const result = getFileInfoToUrl('');
			expect(result.fileName).toBe('unknown');
		});
	});
});
