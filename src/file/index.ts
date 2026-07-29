/**
 * 文件大小单位枚举
 */
export enum FileSizeUnit {
	Byte = 'B',
	KiloByte = 'KB',
	MegaByte = 'MB',
	GigaByte = 'GB',
	TeraByte = 'TB',
}

/**
 * 文件大小信息
 */
export interface FileSizeInfo {
	/** 格式化后的字符串 */
	formatted: string;
	/** 数值 */
	value: number;
	/** 单位 */
	unit: FileSizeUnit;
}

/**
 * 格式化文件大小
 * @param bytes - 文件大小（字节）
 * @param options - 配置选项
 * @returns 文件大小信息对象
 * @example
 * formatFileSize(1024) // { formatted: '1 KB', value: 1, unit: 'KB' }
 * formatFileSize(1536000) // { formatted: '1.46 MB', value: 1.46, unit: 'MB' }
 * formatFileSize(1024, { precision: 0 }) // { formatted: '1 KB', value: 1, unit: 'KB' }
 */
export function formatFileSize(
	bytes: number,
	options: { precision?: number; base?: 1024 | 1000 } = {}
): FileSizeInfo {
	const { precision = 2, base = 1024 } = options;

	if (typeof bytes !== 'number' || bytes < 0) {
		throw new TypeError('formatFileSize: bytes 必须是非负数');
	}

	if (bytes === 0) {
		return {
			formatted: `0 ${FileSizeUnit.Byte}`,
			value: 0,
			unit: FileSizeUnit.Byte,
		};
	}

	const units = [FileSizeUnit.Byte, FileSizeUnit.KiloByte, FileSizeUnit.MegaByte, FileSizeUnit.GigaByte, FileSizeUnit.TeraByte];
	const thresholds = [1, base, base ** 2, base ** 3, base ** 4];

	let unitIndex = 0;
	let value = bytes;

	for (let i = 1; i < thresholds.length; i++) {
		if (bytes >= thresholds[i]) {
			unitIndex = i;
			value = bytes / thresholds[i];
		} else {
			break;
		}
	}

	// 四舍五入到指定精度
	const roundedValue = Math.round(value * 10 ** precision) / 10 ** precision;

	return {
		formatted: `${roundedValue} ${units[unitIndex]}`,
		value: roundedValue,
		unit: units[unitIndex],
	};
}

/**
 * 获取文件扩展名（包含点号）
 * @param filename - 文件名或文件路径
 * @returns 文件扩展名，如果没有扩展名返回空字符串
 * @example
 * getExtension('image.png') // '.png'
 * getExtension('/path/to/file.txt') // '.txt'
 * getExtension('filename') // ''
 * getExtension('.gitignore') // '.gitignore'
 */
export function getExtension(filename: string): string {
	if (typeof filename !== 'string') {
		throw new TypeError('getExtension: 参数必须是字符串');
	}

	// 处理以点开头的隐藏文件（如 .gitignore）
	if (filename.startsWith('.') && !filename.includes('.', 1)) {
		return filename;
	}

	// 获取最后一个点之后的内容
	const lastDotIndex = filename.lastIndexOf('.');
	if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
		return '';
	}

	// 确保不是路径中的点
	const pathSeparator = filename.includes('/') ? '/' : '\\';
	const lastPathSepIndex = filename.lastIndexOf(pathSeparator);

	// 如果最后一个点在最后一个路径分隔符之前，说明不是扩展名
	if (lastDotIndex < lastPathSepIndex) {
		return '';
	}

	return filename.slice(lastDotIndex);
}

/**
 * 获取文件名（不含路径和扩展名）
 * @param filepath - 文件路径
 * @returns 文件名
 * @example
 * getFileName('/path/to/image.png') // 'image'
 * getFileName('document.pdf') // 'document'
 */
export function getFileName(filepath: string): string {
	if (typeof filepath !== 'string') {
		throw new TypeError('getFileName: 参数必须是字符串');
	}

	// 获取路径中的最后部分
	const parts = filepath.split(/[/\\]/);
	const filename = parts[parts.length - 1];

	// 移除扩展名
	const lastDotIndex = filename.lastIndexOf('.');
	if (lastDotIndex > 0) {
		return filename.slice(0, lastDotIndex);
	}

	return filename;
}

/**
 * 触发浏览器下载文件
 * @param blob - Blob 对象或 File 对象
 * @param filename - 下载的文件名
 * @example
 * // 下载文本文件
 * const blob = new Blob(['Hello World'], { type: 'text/plain' })
 * downloadFile(blob, 'hello.txt')
 *
 * // 下载 JSON 数据
 * const data = { name: 'John', age: 20 }
 * const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
 * downloadFile(jsonBlob, 'data.json')
 */
export function downloadFile(blob: Blob | File, filename: string): void {
	if (typeof window === 'undefined') {
		console.warn('downloadFile: 当前环境不支持');
		return;
	}

	// 检查是否为 Blob 或 File 对象（File 继承自 Blob）
	if (!(blob instanceof Blob)) {
		throw new TypeError('downloadFile: 第一个参数必须是 Blob 或 File 对象');
	}

	if (typeof filename !== 'string') {
		throw new TypeError('downloadFile: filename 必须是字符串');
	}

	// 创建临时下载链接
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.style.display = 'none';

	// 触发下载
	document.body.appendChild(link);
	link.click();

	// 清理
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

/**
 * 读取文本文件内容
 * @param file - File 对象
 * @param encoding - 文本编码，默认 'utf-8'
 * @returns Promise<string> 文件内容
 * @example
 * const input = document.querySelector('input[type="file"]')
 * input.addEventListener('change', async (e) => {
 *   const file = e.target.files[0]
 *   const content = await readAsText(file)
 *   console.log(content)
 * })
 */
export function readAsText(file: File, encoding: string = 'utf-8'): Promise<string> {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined') {
			reject(new Error('readAsText: 当前环境不支持'));
			return;
		}

		if (!(file instanceof File)) {
			reject(new TypeError('readAsText: 参数必须是 File 对象'));
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			resolve(typeof reader.result === 'string' ? reader.result : '');
		};

		reader.onerror = () => {
			reject(new Error('readAsText: 文件读取失败'));
		};

		reader.readAsText(file, encoding);
	});
}

/**
 * 读取文件为 Data URL
 * @param file - File 对象
 * @returns Promise<string> Data URL 字符串
 * @example
 * const input = document.querySelector('input[type="file"]')
 * input.addEventListener('change', async (e) => {
 *   const file = e.target.files[0]
 *   const dataUrl = await readAsDataURL(file)
 *   img.src = dataUrl
 * })
 */
export function readAsDataURL(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined') {
			reject(new Error('readAsDataURL: 当前环境不支持'));
			return;
		}

		if (!(file instanceof File)) {
			reject(new TypeError('readAsDataURL: 参数必须是 File 对象'));
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			resolve(typeof reader.result === 'string' ? reader.result : '');
		};

		reader.onerror = () => {
			reject(new Error('readAsDataURL: 文件读取失败'));
		};

		reader.readAsDataURL(file);
	});
}

/**
 * 读取文件为 ArrayBuffer
 * @param file - File 对象
 * @returns Promise<ArrayBuffer> 文件二进制数据
 * @example
 * const input = document.querySelector('input[type="file"]')
 * input.addEventListener('change', async (e) => {
 *   const file = e.target.files[0]
 *   const buffer = await readAsArrayBuffer(file)
 *   console.log(new Uint8Array(buffer))
 * })
 */
export function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		if (typeof window === 'undefined') {
			reject(new Error('readAsArrayBuffer: 当前环境不支持'));
			return;
		}

		if (!(file instanceof File)) {
			reject(new TypeError('readAsArrayBuffer: 参数必须是 File 对象'));
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result instanceof ArrayBuffer ? reader.result : new ArrayBuffer(0));
		};

		reader.onerror = () => {
			reject(new Error('readAsArrayBuffer: 文件读取失败'));
		};

		reader.readAsArrayBuffer(file);
	});
}

/**
 * 判断是否为图片文件
 * @param filename - 文件名或扩展名
 * @returns 是否为图片文件
 * @example
 * isImage('image.png') // true
 * isImage('photo.jpg') // true
 * isImage('document.pdf') // false
 */
export function isImage(filename: string): boolean {
	if (typeof filename !== 'string') {
		return false;
	}

	const ext = getExtension(filename).toLowerCase();
	const imageExtensions = [
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

	return imageExtensions.includes(ext);
}

/**
 * 判断是否为视频文件
 * @param filename - 文件名或扩展名
 * @returns 是否为视频文件
 * @example
 * isVideo('movie.mp4') // true
 * isVideo('clip.avi') // true
 * isVideo('audio.mp3') // false
 */
export function isVideo(filename: string): boolean {
	if (typeof filename !== 'string') {
		return false;
	}

	const ext = getExtension(filename).toLowerCase();
	const videoExtensions = [
		'.mp4',
		'.avi',
		'.mov',
		'.wmv',
		'.flv',
		'.mkv',
		'.webm',
		'.m4v',
		'.mpeg',
		'.mpg',
		'.3gp',
		'.ogv',
	];

	return videoExtensions.includes(ext);
}

/**
 * 判断是否为音频文件
 * @param filename - 文件名或扩展名
 * @returns 是否为音频文件
 * @example
 * isAudio('music.mp3') // true
 * isAudio('sound.wav') // true
 * isAudio('video.mp4') // false
 */
export function isAudio(filename: string): boolean {
	if (typeof filename !== 'string') {
		return false;
	}

	const ext = getExtension(filename).toLowerCase();
	const audioExtensions = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.wma', '.m4a', '.opus'];

	return audioExtensions.includes(ext);
}

/**
 * 判断是否为 PDF 文件
 * @param filename - 文件名或扩展名
 * @returns 是否为 PDF 文件
 * @example
 * isPDF('document.pdf') // true
 * isPDF('file.txt') // false
 */
export function isPDF(filename: string): boolean {
	if (typeof filename !== 'string') {
		return false;
	}

	return getExtension(filename).toLowerCase() === '.pdf';
}
