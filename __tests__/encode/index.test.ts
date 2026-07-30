import {
	base64Encode,
	base64Decode,
	escapeHTML,
	unescapeHTML,
	urlEncode,
	urlDecode,
	querystringify,
	parseQueryString,
} from '../../src/encode/index';

describe('encode 模块', () => {
	describe('base64Encode', () => {
		it('应该正确编码英文字符串', () => {
			expect(base64Encode('Hello World')).toBe('SGVsbG8gV29ybGQ=');
			expect(base64Encode('test')).toBe('dGVzdA==');
		});

		it('应该正确编码中文字符串', () => {
			expect(base64Encode('你好')).toBe('5L2g5aW9');
			expect(base64Encode('世界')).toBe('5LiW55WM');
		});

		it('应该正确编码特殊字符', () => {
			expect(base64Encode('!@#$%')).toBe('IUAjJCU=');
		});

		it('应该处理空字符串', () => {
			expect(base64Encode('')).toBe('');
		});

		it('应该处理包含空格的字符串', () => {
			expect(base64Encode('a b c')).toBe('YSBiIGM=');
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => base64Encode(null as any)).toThrow(TypeError);
			expect(() => base64Encode(undefined as any)).toThrow(TypeError);
			expect(() => base64Encode(123 as any)).toThrow(TypeError);
			expect(() => base64Encode({} as any)).toThrow(TypeError);
		});
	});

	describe('base64Decode', () => {
		it('应该正确解码英文字符串', () => {
			expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World');
			expect(base64Decode('dGVzdA==')).toBe('test');
		});

		it('应该正确解码中文字符串', () => {
			expect(base64Decode('5L2g5aW9')).toBe('你好');
			expect(base64Decode('5LiW55WM')).toBe('世界');
		});

		it('应该处理空字符串', () => {
			expect(base64Decode('')).toBe('');
		});

		it('应该能够往返编码解码', () => {
			const original = 'Hello 你好 World 世界！';
			const encoded = base64Encode(original);
			const decoded = base64Decode(encoded);
			expect(decoded).toBe(original);
		});

		it('应该对无效的 Base64 字符串抛出错误', () => {
			expect(() => base64Decode('Invalid@Base64')).toThrow();
			expect(() => base64Decode('not valid!')).toThrow();
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => base64Decode(null as any)).toThrow(TypeError);
			expect(() => base64Decode(undefined as any)).toThrow(TypeError);
			expect(() => base64Decode(123 as any)).toThrow(TypeError);
		});
	});

	describe('escapeHTML', () => {
		it('应该转义 HTML 特殊字符', () => {
			expect(escapeHTML('<div>')).toBe('&lt;div&gt;');
			expect(escapeHTML('<script>alert("XSS")</script>')).toBe(
				'&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'
			);
		});

		it('应该转义所有特殊字符', () => {
			expect(escapeHTML('<>&"\'`=/')).toBe('&lt;&gt;&amp;&quot;&apos;&#96;&#x3D;&#x2F;');
		});

		it('应该转义双引号', () => {
			expect(escapeHTML('"Hello"')).toBe('&quot;Hello&quot;');
		});

		it('应该转义单引号', () => {
			expect(escapeHTML("'Hello'")).toBe('&apos;Hello&apos;');
		});

		it('应该转义和号 &', () => {
			expect(escapeHTML('A & B')).toBe('A &amp; B');
		});

		it('应该处理空字符串', () => {
			expect(escapeHTML('')).toBe('');
		});

		it('应该不转义普通字符', () => {
			expect(escapeHTML('Hello World 123')).toBe('Hello World 123');
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => escapeHTML(null as any)).toThrow(TypeError);
			expect(() => escapeHTML(123 as any)).toThrow(TypeError);
		});
	});

	describe('unescapeHTML', () => {
		it('应该反转义 HTML 实体', () => {
			expect(unescapeHTML('&lt;div&gt;')).toBe('<div>');
			expect(unescapeHTML('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;')).toBe(
				'<script>alert("XSS")</script>'
			);
		});

		it('应该反转义所有实体', () => {
			expect(unescapeHTML('&lt;&gt;&amp;&quot;&apos;')).toBe('<>&"\'');
		});

		it('应该反转义数字实体引用', () => {
			expect(unescapeHTML('&#60;')).toBe('<');
			expect(unescapeHTML('&#62;')).toBe('>');
			expect(unescapeHTML('&#34;')).toBe('"');
			expect(unescapeHTML('&#39;')).toBe("'");
			expect(unescapeHTML('&#38;')).toBe('&');
		});

		it('应该处理空字符串', () => {
			expect(unescapeHTML('')).toBe('');
		});

		it('应该能够往返转义反转义', () => {
			const original = '<script>alert("XSS")</script>';
			const escaped = escapeHTML(original);
			const unescaped = unescapeHTML(escaped);
			expect(unescaped).toBe(original);
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => unescapeHTML(null as any)).toThrow(TypeError);
			expect(() => unescapeHTML(123 as any)).toThrow(TypeError);
		});
	});

	describe('urlEncode', () => {
		it('应该默认使用 encodeURIComponent 编码', () => {
			expect(urlEncode('Hello World!')).toBe('Hello%20World!');
			expect(urlEncode('你好世界')).toBe('%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C');
		});

		it('应该使用 component 选项时编码', () => {
			expect(urlEncode('Hello World!', { component: true })).toBe('Hello%20World!');
		});

		it('应该使用 uri 选项时保留 URL 结构字符', () => {
			expect(urlEncode('https://example.com/path?query=value', { uri: true })).toBe(
				'https://example.com/path?query=value'
			);
		});

		it('应该处理空字符串', () => {
			expect(urlEncode('')).toBe('');
		});

		it('应该编码特殊字符', () => {
			expect(urlEncode('a b c')).toBe('a%20b%20c');
			expect(urlEncode('&')).toBe('%26');
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => urlEncode(null as any)).toThrow(TypeError);
			expect(() => urlEncode(123 as any)).toThrow(TypeError);
		});
	});

	describe('urlDecode', () => {
		it('应该正确解码 URL 编码字符串', () => {
			expect(urlDecode('Hello%20World%21')).toBe('Hello World!');
			expect(urlDecode('%E4%BD%A0%E5%A5%BD')).toBe('你好');
		});

		it('应该处理空字符串', () => {
			expect(urlDecode('')).toBe('');
		});

		it('应该能够往返编码解码', () => {
			const original = 'Hello 你好 World!';
			const encoded = urlEncode(original);
			const decoded = urlDecode(encoded);
			expect(decoded).toBe(original);
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => urlDecode(null as any)).toThrow(TypeError);
			expect(() => urlDecode(123 as any)).toThrow(TypeError);
		});
	});

	describe('querystringify', () => {
		it('应该正确转换简单对象', () => {
			expect(querystringify({ name: 'John', age: '20' })).toBe('name=John&age=20');
		});

		it('应该正确转换数字值', () => {
			expect(querystringify({ a: 1, b: 2 })).toBe('a=1&b=2');
		});

		it('应该正确处理数组值', () => {
			const result = querystringify({ a: [1, 2, 3] });
			expect(result).toContain('a=1');
			expect(result).toContain('a=2');
			expect(result).toContain('a=3');
			expect(result).toMatch(/^a=1&a=2&a=3$/);
		});

		it('应该跳过 null 和 undefined 值', () => {
			expect(querystringify({ a: 1, b: null, c: undefined })).toBe('a=1');
		});

		it('应该编码特殊字符', () => {
			expect(querystringify({ name: 'Hello World' })).toBe('name=Hello%20World');
		});

		it('应该处理中文字符', () => {
			expect(querystringify({ name: '你好' })).toContain('name=');
			expect(querystringify({ name: '你好' })).not.toBe('name=你好');
		});

		it('应该处理空对象', () => {
			expect(querystringify({})).toBe('');
		});

		it('应该对非对象参数抛出 TypeError', () => {
			expect(() => querystringify(null as any)).toThrow(TypeError);
			expect(() => querystringify(undefined as any)).toThrow(TypeError);
			expect(() => querystringify('string' as any)).toThrow(TypeError);
		});
	});

	describe('parseQueryString', () => {
		it('应该正确解析查询字符串', () => {
			expect(parseQueryString('name=John&age=20')).toEqual({ name: 'John', age: '20' });
		});

		it('应该处理带 ? 前缀的字符串', () => {
			expect(parseQueryString('?name=John&age=20')).toEqual({ name: 'John', age: '20' });
		});

		it('应该处理空字符串', () => {
			expect(parseQueryString('')).toEqual({});
			expect(parseQueryString('?')).toEqual({});
		});

		it('应该正确解码 URL 编码字符', () => {
			expect(parseQueryString('name=Hello%20World')).toEqual({ name: 'Hello World' });
			expect(parseQueryString('name=%E4%BD%A0%E5%A5%BD')).toEqual({ name: '你好' });
		});

		it('应该处理无值的参数', () => {
			expect(parseQueryString('key')).toEqual({ key: '' });
			expect(parseQueryString('a=1&b&c=3')).toEqual({ a: '1', b: '', c: '3' });
		});

		it('应该将重复的 key 转为数组', () => {
			expect(parseQueryString('a=1&a=2&a=3')).toEqual({ a: ['1', '2', '3'] });
		});

		it('应该处理混合的单值和数组值', () => {
			expect(parseQueryString('a=1&a=2&b=3')).toEqual({
				a: ['1', '2'],
				b: '3',
			});
		});

		it('应该能够往返转换', () => {
			const original = { name: 'John', age: '20' };
			const stringified = querystringify(original);
			const parsed = parseQueryString(stringified);
			expect(parsed).toEqual({ name: 'John', age: '20' });
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => parseQueryString(null as any)).toThrow(TypeError);
			expect(() => parseQueryString(123 as any)).toThrow(TypeError);
		});

		it('应该处理特殊字符', () => {
			expect(parseQueryString('a=b+c')).toEqual({ a: 'b c' });
		});

		it('应该处理空的 key（&=value 格式）', () => {
			expect(parseQueryString('=value')).toEqual({});
		});
	});

	describe('querystringify - 原型链上有属性', () => {
		it('应该跳过继承的属性', () => {
			const proto = { inherited: 'value' };
			const obj = Object.create(proto);
			obj.ownProp = 'own';
			const result = querystringify(obj);
			expect(result).toBe('ownProp=own');
		});
	});
});
