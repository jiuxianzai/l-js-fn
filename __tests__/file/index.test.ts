import {
	formatFileSize,
	getExtension,
	getFileName,
	downloadFile,
	readAsText,
	readAsDataURL,
	readAsArrayBuffer,
	isImage,
	isVideo,
	isAudio,
	isPDF,
	FileSizeUnit,
} from '../../src/file/index';

describe('file 模块', () => {
	describe('formatFileSize', () => {
		it('应该正确格式化字节', () => {
			const result = formatFileSize(0);
			expect(result.formatted).toBe('0 B');
			expect(result.value).toBe(0);
			expect(result.unit).toBe(FileSizeUnit.Byte);
		});

		it('应该正确格式化 KB', () => {
			const result = formatFileSize(1024);
			expect(result.formatted).toBe('1 KB');
			expect(result.value).toBe(1);
			expect(result.unit).toBe(FileSizeUnit.KiloByte);
		});

		it('应该正确格式化 MB', () => {
			const result = formatFileSize(1024 * 1024);
			expect(result.formatted).toBe('1 MB');
			expect(result.value).toBe(1);
			expect(result.unit).toBe(FileSizeUnit.MegaByte);
		});

		it('应该正确格式化 GB', () => {
			const result = formatFileSize(1024 * 1024 * 1024);
			expect(result.formatted).toBe('1 GB');
			expect(result.value).toBe(1);
			expect(result.unit).toBe(FileSizeUnit.GigaByte);
		});

		it('应该正确格式化 TB', () => {
			const result = formatFileSize(1024 * 1024 * 1024 * 1024);
			expect(result.formatted).toBe('1 TB');
			expect(result.value).toBe(1);
			expect(result.unit).toBe(FileSizeUnit.TeraByte);
		});

		it('应该正确处理小数值', () => {
			const result = formatFileSize(1536000); // 1.46 MB
			expect(result.value).toBeCloseTo(1.46, 1);
			expect(result.unit).toBe(FileSizeUnit.MegaByte);
		});

		it('应该支持自定义精度', () => {
			const result = formatFileSize(1536000, { precision: 0 });
			expect(result.value).toBe(1);
			expect(result.formatted).toBe('1 MB');
		});

		it('应该支持 1000 进制', () => {
			const result = formatFileSize(1000, { base: 1000 });
			expect(result.value).toBe(1);
			expect(result.unit).toBe(FileSizeUnit.KiloByte);
		});

		it('应该对负数抛出 TypeError', () => {
			expect(() => formatFileSize(-1)).toThrow(TypeError);
		});

		it('应该对非数字参数抛出 TypeError', () => {
			expect(() => formatFileSize('1024' as any)).toThrow(TypeError);
			expect(() => formatFileSize(null as any)).toThrow(TypeError);
		});
	});

	describe('getExtension', () => {
		it('应该正确获取常见文件扩展名', () => {
			expect(getExtension('image.png')).toBe('.png');
			expect(getExtension('document.pdf')).toBe('.pdf');
			expect(getExtension('archive.zip')).toBe('.zip');
		});

		it('应该处理带路径的文件', () => {
			expect(getExtension('/path/to/file.txt')).toBe('.txt');
			expect(getExtension('C:\\Users\\file.doc')).toBe('.doc');
		});

		it('应该处理隐藏文件', () => {
			expect(getExtension('.gitignore')).toBe('.gitignore');
			expect(getExtension('.env')).toBe('.env');
		});

		it('应该对无扩展名文件返回空字符串', () => {
			expect(getExtension('filename')).toBe('');
			expect(getExtension('/path/to/folder')).toBe('');
		});

		it('应该处理以点结尾的文件名', () => {
			expect(getExtension('file.')).toBe('');
		});

		it('应该处理多重点的文件名', () => {
			expect(getExtension('archive.tar.gz')).toBe('.gz');
			expect(getExtension('file.min.js')).toBe('.js');
		});

		it('应该区分路径中的点和扩展名点', () => {
			expect(getExtension('/path.with.dots/file.txt')).toBe('.txt');
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => getExtension(null as any)).toThrow(TypeError);
			expect(() => getExtension(123 as any)).toThrow(TypeError);
		});
	});

	describe('getFileName', () => {
		it('应该正确获取文件名', () => {
			expect(getFileName('/path/to/image.png')).toBe('image');
			expect(getFileName('document.pdf')).toBe('document');
		});

		it('应该处理 Windows 路径', () => {
			expect(getFileName('C:\\Users\\test\\file.txt')).toBe('file');
		});

		it('应该处理 Unix 路径', () => {
			expect(getFileName('/home/user/document.pdf')).toBe('document');
		});

		it('应该处理带多个点的文件名', () => {
			expect(getFileName('archive.tar.gz')).toBe('archive.tar');
			expect(getFileName('file.min.js')).toBe('file.min');
		});

		it('应该处理无扩展名的文件', () => {
			expect(getFileName('filename')).toBe('filename');
			expect(getFileName('/path/to/folder/file')).toBe('file');
		});

		it('应该处理隐藏文件', () => {
			expect(getFileName('.gitignore')).toBe('.gitignore');
		});

		it('应该对非字符串参数抛出 TypeError', () => {
			expect(() => getFileName(null as any)).toThrow(TypeError);
			expect(() => getFileName(123 as any)).toThrow(TypeError);
		});
	});

	describe('isImage', () => {
		it('应该正确识别常见图片格式', () => {
			expect(isImage('image.jpg')).toBe(true);
			expect(isImage('photo.jpeg')).toBe(true);
			expect(isImage('logo.png')).toBe(true);
			expect(isImage('animation.gif')).toBe(true);
			expect(isImage('icon.svg')).toBe(true);
		});

		it('应该识别所有支持的图片格式', () => {
			const formats = [
				'.jpg',
				'.jpeg',
				'.png',
				'.gif',
				'.bmp',
				'.webp',
				'.svg',
				'.ico',
				'.tiff',
				'.psd',
				'.raw',
				'.heic',
				'.heif',
			];
			formats.forEach((ext) => {
				expect(isImage(`file${ext}`)).toBe(true);
			});
		});

		it('应该不识别非图片文件', () => {
			expect(isImage('document.pdf')).toBe(false);
			expect(isImage('video.mp4')).toBe(false);
			expect(isImage('audio.mp3')).toBe(false);
		});

		it('应该处理大写扩展名', () => {
			expect(isImage('IMAGE.PNG')).toBe(true);
			expect(isImage('photo.JPG')).toBe(true);
		});

		it('应该对非字符串参数返回 false', () => {
			expect(isImage(null as any)).toBe(false);
			expect(isImage(123 as any)).toBe(false);
		});
	});

	describe('isVideo', () => {
		it('应该正确识别常见视频格式', () => {
			expect(isVideo('movie.mp4')).toBe(true);
			expect(isVideo('clip.avi')).toBe(true);
			expect(isVideo('film.mov')).toBe(true);
		});

		it('应该识别所有支持的视频格式', () => {
			const formats = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv', '.webm', '.m4v', '.mpeg', '.mpg', '.3gp', '.ogv'];
			formats.forEach((ext) => {
				expect(isVideo(`file${ext}`)).toBe(true);
			});
		});

		it('应该不识别非视频文件', () => {
			expect(isVideo('image.png')).toBe(false);
			expect(isVideo('audio.mp3')).toBe(false);
			expect(isVideo('document.pdf')).toBe(false);
		});

		it('应该处理大写扩展名', () => {
			expect(isVideo('VIDEO.MP4')).toBe(true);
		});

		it('应该对非字符串参数返回 false', () => {
			expect(isVideo(null as any)).toBe(false);
			expect(isVideo(123 as any)).toBe(false);
		});
	});

	describe('isAudio', () => {
		it('应该正确识别常见音频格式', () => {
			expect(isAudio('music.mp3')).toBe(true);
			expect(isAudio('sound.wav')).toBe(true);
			expect(isAudio('track.ogg')).toBe(true);
		});

		it('应该识别所有支持的音频格式', () => {
			const formats = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.wma', '.m4a', '.opus'];
			formats.forEach((ext) => {
				expect(isAudio(`file${ext}`)).toBe(true);
			});
		});

		it('应该不识别非音频文件', () => {
			expect(isAudio('image.png')).toBe(false);
			expect(isAudio('video.mp4')).toBe(false);
			expect(isAudio('document.pdf')).toBe(false);
		});

		it('应该处理大写扩展名', () => {
			expect(isAudio('AUDIO.MP3')).toBe(true);
		});

		it('应该对非字符串参数返回 false', () => {
			expect(isAudio(null as any)).toBe(false);
			expect(isAudio(123 as any)).toBe(false);
		});
	});

	describe('isPDF', () => {
		it('应该正确识别 PDF 文件', () => {
			expect(isPDF('document.pdf')).toBe(true);
			expect(isPDF('/path/to/file.pdf')).toBe(true);
		});

		it('应该不识别非 PDF 文件', () => {
			expect(isPDF('image.png')).toBe(false);
			expect(isPDF('video.mp4')).toBe(false);
			expect(isPDF('audio.mp3')).toBe(false);
		});

		it('应该处理大写扩展名', () => {
			expect(isPDF('DOCUMENT.PDF')).toBe(true);
		});

		it('应该对非字符串参数返回 false', () => {
			expect(isPDF(null as any)).toBe(false);
			expect(isPDF(123 as any)).toBe(false);
		});
	});
});

// 测试浏览器相关的函数（在 Node.js 环境中需要 mock）
describe('file 模块 - 浏览器环境函数', () => {
	// Mock window 和 document
	let mockFileReader: any;

	beforeEach(() => {
		// 模拟浏览器环境
		(global as any).window = {};
		(global as any).document = {
			createElement: jest.fn(),
			body: {
				appendChild: jest.fn(),
				removeChild: jest.fn(),
			},
		};
		(global as any).URL = {
			createObjectURL: jest.fn(),
			revokeObjectURL: jest.fn(),
		};
		// 模拟 FileReader
		mockFileReader = jest.fn().mockImplementation(() => ({
			onload: null,
			onerror: null,
			result: null,
			readAsText: jest.fn(function (this: any, file: File) {
				Promise.resolve().then(() => {
					// 模拟异步读取
					this.result = 'Mock file content';
					if (this.onload) this.onload({ target: this } as any);
				});
			}),
			readAsDataURL: jest.fn(function (this: any) {
				Promise.resolve().then(() => {
					this.result = 'data:text/plain;base64,SGVsbG8=';
					if (this.onload) this.onload({ target: this } as any);
				});
			}),
			readAsArrayBuffer: jest.fn(function (this: any) {
				Promise.resolve().then(() => {
					this.result = new ArrayBuffer(8);
					if (this.onload) this.onload({ target: this } as any);
				});
			}),
		}));
		(global as any).FileReader = mockFileReader;
	});

	afterEach(() => {
		delete (global as any).window;
		delete (global as any).document;
		delete (global as any).URL;
		delete (global as any).FileReader;
	});

	describe('downloadFile', () => {
		it('应该创建下载链接并触发下载', () => {
			const blob = new Blob(['Hello World'], { type: 'text/plain' });
			const mockLink = {
				href: '',
				download: '',
				style: { display: '' },
				click: jest.fn(),
			};

			(document.createElement as jest.Mock).mockReturnValue(mockLink);
			(URL.createObjectURL as jest.Mock).mockReturnValue('blob:test-url');

			downloadFile(blob, 'test.txt');

			expect(document.createElement).toHaveBeenCalledWith('a');
			expect(URL.createObjectURL).toHaveBeenCalledWith(blob);
			expect(mockLink.href).toBe('blob:test-url');
			expect(mockLink.download).toBe('test.txt');
			expect(mockLink.click).toHaveBeenCalled();
			expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
			expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
			expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-url');
		});

		it('应该对非 Blob/File 参数抛出 TypeError', () => {
			expect(() => downloadFile(null as any, 'test.txt')).toThrow(TypeError);
			expect(() => downloadFile('not a blob' as any, 'test.txt')).toThrow(TypeError);
		});

		it('应该对无效的 filename 抛出 TypeError', () => {
			const blob = new Blob(['test']);
			expect(() => downloadFile(blob, null as any)).toThrow(TypeError);
			expect(() => downloadFile(blob, 123 as any)).toThrow(TypeError);
		});
	});

	describe('readAsText', () => {
		it('应该读取文件为文本', async () => {
			const mockFile = new File(['Hello World'], 'test.txt');
			const result = await readAsText(mockFile);
			expect(result).toBeTruthy();
			expect(typeof result).toBe('string');
		});

		it('应该支持指定编码', async () => {
			const mockFile = new File(['测试'], 'test.txt');
			const result = await readAsText(mockFile, 'utf-8');
			expect(result).toBeTruthy();
		});

		it('应该对非 File 参数抛出错误', async () => {
			await expect(readAsText(null as any)).rejects.toThrow();
			await expect(readAsText('not a file' as any)).rejects.toThrow();
		});
	});

	describe('readAsDataURL', () => {
		it('应该读取文件为 Data URL', async () => {
			const mockFile = new File(['Hello'], 'test.txt');
			const result = await readAsDataURL(mockFile);
			expect(result).toMatch(/^data:text\/plain;base64,/);
		});

		it('应该对非 File 参数抛出错误', async () => {
			await expect(readAsDataURL(null as any)).rejects.toThrow();
			await expect(readAsDataURL('not a file' as any)).rejects.toThrow();
		});
	});

	describe('readAsArrayBuffer', () => {
		it('应该读取文件为 ArrayBuffer', async () => {
			const mockFile = new File([new Uint8Array([1, 2, 3])], 'test.bin');
			const result = await readAsArrayBuffer(mockFile);
			expect(result).toBeInstanceOf(ArrayBuffer);
		});

		it('应该对非 File 参数抛出错误', async () => {
			await expect(readAsArrayBuffer(null as any)).rejects.toThrow();
			await expect(readAsArrayBuffer('not a file' as any)).rejects.toThrow();
		});
	});
});

// 测试非浏览器环境下的行为
describe('file 模块 - 非浏览器环境', () => {
	beforeEach(() => {
		// 确保 window 不存在
		delete (global as any).window;
	});

	describe('downloadFile - SSR 环境', () => {
		it('应该在 SSR 环境下返回而不执行下载', () => {
			const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

			// 模拟 File 构造函数
			const MockBlob = class Blob {};
			const blob = new MockBlob();

			downloadFile(blob as any, 'test.txt');

			expect(consoleWarnSpy).toHaveBeenCalledWith('downloadFile: 当前环境不支持');

			consoleWarnSpy.mockRestore();
		});
	});

	describe('readAsText - SSR 环境', () => {
		it('应该在 SSR 环境下抛出错误', async () => {
			const MockFile = class File {};
			const file = new MockFile() as any;

			await expect(readAsText(file)).rejects.toThrow('当前环境不支持');
		});
	});

	describe('readAsDataURL - SSR 环境', () => {
		it('应该在 SSR 环境下抛出错误', async () => {
			const MockFile = class File {};
			const file = new MockFile() as any;

			await expect(readAsDataURL(file)).rejects.toThrow('当前环境不支持');
		});
	});

	describe('readAsArrayBuffer - SSR 环境', () => {
		it('应该在 SSR 环境下抛出错误', async () => {
			const MockFile = class File {};
			const file = new MockFile() as any;

			await expect(readAsArrayBuffer(file)).rejects.toThrow('当前环境不支持');
		});
	});
});
