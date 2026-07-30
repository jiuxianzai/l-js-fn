/**
 * dist 子模块验证 - 各子模块打包输出
 */
const bom = require('../../dist/bom/index.cjs');
const encode = require('../../dist/encode/index.cjs');
const file = require('../../dist/file/index.cjs');
const storage = require('../../dist/storage/index.cjs');
const config = require('../../dist/config/index.cjs');
const regex = require('../../dist/regex/index.cjs');

describe('dist 子模块 - bom', () => {
	it('导出 scrollTop', () => {
		expect(typeof bom.scrollTop).toBe('function');
	});

	it('导出 getScrollPosition', () => {
		expect(typeof bom.getScrollPosition).toBe('function');
	});

	it('导出 copyToClipboard', () => {
		expect(typeof bom.copyToClipboard).toBe('function');
	});

	it('导出 setCookie / getCookie', () => {
		expect(typeof bom.setCookie).toBe('function');
		expect(typeof bom.getCookie).toBe('function');
	});

	it('导出 launchFullscreen / exitFullscreen', () => {
		expect(typeof bom.launchFullscreen).toBe('function');
		expect(typeof bom.exitFullscreen).toBe('function');
	});
});

describe('dist 子模块 - encode', () => {
	it('base64Encode / base64Decode', () => {
		const enc = encode.base64Encode('Hello World');
		expect(enc).toBe('SGVsbG8gV29ybGQ=');
		expect(encode.base64Decode(enc)).toBe('Hello World');
	});

	it('escapeHTML / unescapeHTML', () => {
		const escaped = encode.escapeHTML('<script>alert("xss")</script>');
		expect(escaped).toContain('&lt;');
		expect(encode.unescapeHTML(escaped)).toContain('<script>');
	});

	it('urlEncode / urlDecode', () => {
		expect(encode.urlEncode('Hello World!')).toBe('Hello%20World!');
		expect(encode.urlDecode('Hello%20World')).toBe('Hello World');
	});

	it('querystringify', () => {
		expect(encode.querystringify({ name: 'John', age: 20 })).toBe('name=John&age=20');
	});

	it('parseQueryString', () => {
		expect(encode.parseQueryString('name=John&age=20')).toEqual({ name: 'John', age: '20' });
	});
});

describe('dist 子模块 - file', () => {
	it('formatFileSize', () => {
		const result = file.formatFileSize(1024);
		expect(result.formatted).toBe('1 KB');
		expect(result.value).toBe(1);
		expect(result.unit).toBe('KB');
	});

	it('getExtension', () => {
		expect(file.getExtension('image.png')).toBe('.png');
		expect(file.getExtension('filename')).toBe('');
	});

	it('getFileName', () => {
		expect(file.getFileName('/path/to/image.png')).toBe('image');
	});

	it('isImage / isVideo / isAudio / isPDF', () => {
		expect(file.isImage('photo.jpg')).toBe(true);
		expect(file.isVideo('movie.mp4')).toBe(true);
		expect(file.isAudio('music.mp3')).toBe(true);
		expect(file.isPDF('doc.pdf')).toBe(true);
		expect(file.isImage('doc.pdf')).toBe(false);
	});

	it('FileSizeUnit 枚举', () => {
		expect(file.FileSizeUnit.Byte).toBe('B');
		expect(file.FileSizeUnit.KiloByte).toBe('KB');
	});
});

describe('dist 子模块 - config', () => {
	it('DATE_FORMAT', () => {
		expect(config.DATE_FORMAT.FULL).toBe('yyyy-MM-dd HH:mm:ss');
		expect(config.DATE_FORMAT.DATE).toBe('yyyy-MM-dd');
		expect(config.DATE_FORMAT.TIME).toBe('HH:mm:ss');
	});

	it('HTTP_STATUS', () => {
		expect(config.HTTP_STATUS.OK).toBe(200);
		expect(config.HTTP_STATUS.UNAUTHORIZED).toBe(401);
		expect(config.HTTP_STATUS.NOT_FOUND).toBe(404);
	});
});

describe('dist 子模块 - regex', () => {
	it('REGEXP 常量存在', () => {
		expect(regex.REGEXP).toBeDefined();
		expect(typeof regex.REGEXP.PHONE).toBe('object');
		expect(typeof regex.REGEXP.EMAIL).toBe('object');
	});

	it('PHONE 验证', () => {
		expect(regex.REGEXP.PHONE.test('13800138000')).toBe(true);
		expect(regex.REGEXP.PHONE.test('12345')).toBe(false);
	});

	it('EMAIL 验证', () => {
		expect(regex.REGEXP.EMAIL.test('test@example.com')).toBe(true);
		expect(regex.REGEXP.EMAIL.test('invalid')).toBe(false);
	});
});

describe('dist 子模块 - storage', () => {
	it('setStorage / getStorage', () => {
		// 在 node 环境会返回 false / null（不支持 localStorage），但不报错
		expect(typeof storage.setStorage).toBe('function');
		expect(typeof storage.getStorage).toBe('function');
		expect(typeof storage.removeStorage).toBe('function');
		expect(typeof storage.setSession).toBe('function');
		expect(typeof storage.getSession).toBe('function');
	});
});
