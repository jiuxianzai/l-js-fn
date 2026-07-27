# file — 文件处理

文件处理工具集，提供文件大小格式化、类型判断、下载、读取等功能。

**导入方式：**

```typescript
import {
  formatFileSize, getExtension, getFileName,
  downloadFile, readAsText, readAsDataURL, readAsArrayBuffer,
  isImage, isVideo, isAudio, isPDF
} from 'l-js-fn/file';
```

## FileSizeUnit

文件大小单位枚举：

```typescript
enum FileSizeUnit {
  Byte = 'B',
  KiloByte = 'KB',
  MegaByte = 'MB',
  GigaByte = 'GB',
  TeraByte = 'TB'
}
```

## FileSizeInfo

文件大小信息接口：

```typescript
interface FileSizeInfo {
  formatted: string;  // 格式化后的字符串
  value: number;      // 数值
  unit: FileSizeUnit; // 单位
}
```

## formatFileSize 格式化文件大小

格式化文件大小。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bytes | `number` | 是 | 文件大小（字节） |
| options | `object` | 否 | 配置选项 |
| options.precision | `number` | 否 | 小数精度，默认 `2` |
| options.base | `1024 \| 1000` | 否 | 进制基数，默认 `1024` |

**返回值：** `FileSizeInfo`

**异常：** 参数非法时抛出 `TypeError`

**示例：**

```typescript
import { formatFileSize } from 'l-js-fn/file';

formatFileSize(1024);
// { formatted: '1 KB', value: 1, unit: 'KB' }

formatFileSize(1536000);
// { formatted: '1.46 MB', value: 1.46, unit: 'MB' }

formatFileSize(1024, { precision: 0 });
// { formatted: '1 KB', value: 1, unit: 'KB' }

formatFileSize(1000, { base: 1000 });
// { formatted: '1 KB', value: 1, unit: 'KB' }
```

## getExtension 获取文件后缀

获取文件扩展名（包含点号）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名或文件路径 |

**返回值：** `string` — 文件扩展名，无扩展名返回 `''`

**示例：**

```typescript
import { getExtension } from 'l-js-fn/file';

getExtension('image.png');          // '.png'
getExtension('/path/to/file.txt');  // '.txt'
getExtension('filename');           // ''
getExtension('.gitignore');         // '.gitignore'
```

## getFileName 获取文件名

获取文件名（不含路径和扩展名）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filepath | `string` | 是 | 文件路径 |

**返回值：** `string`

**示例：**

```typescript
import { getFileName } from 'l-js-fn/file';

getFileName('/path/to/image.png');  // 'image'
getFileName('document.pdf');        // 'document'
```

## downloadFile 下载文件

触发浏览器下载文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| blob | `Blob \| File` | 是 | Blob 或 File 对象 |
| filename | `string` | 是 | 下载的文件名 |

**返回值：** `void`

**示例：**

```typescript
import { downloadFile } from 'l-js-fn/file';

// 下载文本文件
const blob = new Blob(['Hello World'], { type: 'text/plain' });
downloadFile(blob, 'hello.txt');

// 下载 JSON 数据
const data = { name: 'John', age: 20 };
const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
downloadFile(jsonBlob, 'data.json');
```

## readAsText 读取为文本

读取文本文件内容。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | `File` | 是 | File 对象 |
| encoding | `string` | 否 | 文本编码，默认 `'utf-8'` |

**返回值：** `Promise<string>`

**示例：**

```typescript
import { readAsText } from 'l-js-fn/file';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const content = await readAsText(file);
  console.log(content);
});
```

## readAsDataURL 读取为DataURL

读取文件为 Data URL（Base64）。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | `File` | 是 | File 对象 |

**返回值：** `Promise<string>` — Data URL 字符串

**示例：**

```typescript
import { readAsDataURL } from 'l-js-fn/file';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const dataUrl = await readAsDataURL(file);
  img.src = dataUrl; // 直接显示图片
});
```

## readAsArrayBuffer 读取为ArrayBuffer

读取文件为 ArrayBuffer。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | `File` | 是 | File 对象 |

**返回值：** `Promise<ArrayBuffer>`

**示例：**

```typescript
import { readAsArrayBuffer } from 'l-js-fn/file';

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const buffer = await readAsArrayBuffer(file);
  console.log(new Uint8Array(buffer));
});
```

## 文件类型判断

### isImage 判断图片文件

判断是否为图片文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名或扩展名 |

**返回值：** `boolean`

**支持的格式：** `jpg`、`jpeg`、`png`、`gif`、`bmp`、`webp`、`svg`、`ico`、`tiff`、`psd`、`raw`、`heic`、`heif`

**示例：**

```typescript
import { isImage } from 'l-js-fn/file';

isImage('photo.jpg');    // true
isImage('image.png');    // true
isImage('document.pdf'); // false
```

### isVideo 判断视频文件

判断是否为视频文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名或扩展名 |

**返回值：** `boolean`

**支持的格式：** `mp4`、`avi`、`mov`、`wmv`、`flv`、`mkv`、`webm`、`m4v`、`mpeg`、`mpg`、`3gp`、`ogv`

**示例：**

```typescript
import { isVideo } from 'l-js-fn/file';

isVideo('movie.mp4');   // true
isVideo('clip.avi');    // true
isVideo('audio.mp3');   // false
```

### isAudio 判断音频文件

判断是否为音频文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名或扩展名 |

**返回值：** `boolean`

**支持的格式：** `mp3`、`wav`、`ogg`、`flac`、`aac`、`wma`、`m4a`、`opus`

**示例：**

```typescript
import { isAudio } from 'l-js-fn/file';

isAudio('music.mp3');   // true
isAudio('sound.wav');   // true
isVideo('video.mp4');   // false
```

### isPDF 判断PDF文件

判断是否为 PDF 文件。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| filename | `string` | 是 | 文件名或扩展名 |

**返回值：** `boolean`

**示例：**

```typescript
import { isPDF } from 'l-js-fn/file';

isPDF('document.pdf');  // true
isPDF('file.txt');      // false
```
