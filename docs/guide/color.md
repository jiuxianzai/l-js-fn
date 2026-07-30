# color — 颜色处理

颜色处理工具集，提供 HEX 与 HSL 互转、图标颜色适配等功能。

## HSLColor

HSL 颜色结构类型定义。

```ts
type HSLColor = { h: number; s: number; l: number };
```

- `h`：色相（0-360）
- `s`：饱和度（0-100）
- `l`：亮度（0-100）

## ColorMode

颜色模式枚举类型。

```ts
type ColorMode = 'dark' | 'light';
```

## isValidHexColor 验证十六进制颜色

判断是否为合法的 HEX 颜色值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| color | `string` | 是 | 颜色字符串 |

**返回值：** `boolean`

**示例：**

::: code-group
```ts [TypeScript]
import { isValidHexColor } from 'l-js-fn';

isValidHexColor('#FF5733');  // true
isValidHexColor('#F53');     // true（3位简写）
isValidHexColor('FF5733');   // false（缺少#）
isValidHexColor('#GGGGGG');  // false
```

```js [JavaScript (ESM)]
import { isValidHexColor } from 'l-js-fn';

isValidHexColor('#FF5733');  // true
isValidHexColor('#F53');     // true（3位简写）
isValidHexColor('FF5733');   // false（缺少#）
isValidHexColor('#GGGGGG');  // false
```

```js [JavaScript (CJS)]
const { isValidHexColor } = require('l-js-fn');

isValidHexColor('#FF5733');  // true
isValidHexColor('#F53');     // true（3位简写）
isValidHexColor('FF5733');   // false（缺少#）
isValidHexColor('#GGGGGG');  // false
```
:::

## hexToHSL 十六进制转HSL

将 HEX 颜色转换为 HSL。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hex | `string` | 是 | HEX 颜色值（如 `#FF5733`） |

**返回值：** `HSLColor`

**示例：**

::: code-group
```ts [TypeScript]
import { hexToHSL } from 'l-js-fn';

hexToHSL('#FF5733');
// { h: 9, s: 100, l: 60 }

hexToHSL('#F53');
// { h: 9, s: 100, l: 60 }
```

```js [JavaScript (ESM)]
import { hexToHSL } from 'l-js-fn';

hexToHSL('#FF5733');
// { h: 9, s: 100, l: 60 }

hexToHSL('#F53');
// { h: 9, s: 100, l: 60 }
```

```js [JavaScript (CJS)]
const { hexToHSL } = require('l-js-fn');

hexToHSL('#FF5733');
// { h: 9, s: 100, l: 60 }

hexToHSL('#F53');
// { h: 9, s: 100, l: 60 }
```
:::

## hslToHex HSL转十六进制

将 HSL 转换为 HEX 颜色值。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hsl | `HSLColor` | 是 | HSL 颜色对象 |

**返回值：** `string` — HEX 颜色值（如 `#FF5733`）

**示例：**

::: code-group
```ts [TypeScript]
import { hslToHex } from 'l-js-fn';

hslToHex({ h: 9, s: 100, l: 60 });
// '#FF5733'
```

```js [JavaScript (ESM)]
import { hslToHex } from 'l-js-fn';

hslToHex({ h: 9, s: 100, l: 60 });
// '#FF5733'
```

```js [JavaScript (CJS)]
const { hslToHex } = require('l-js-fn');

hslToHex({ h: 9, s: 100, l: 60 });
// '#FF5733'
```
:::

## conversionColor 颜色明暗转换

根据背景色和模式计算适配的图标颜色。

**参数说明：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| hexColor | `string` | 是 | 背景色的 HEX 值 |
| mode | `ColorMode` | 否 | 颜色模式：`'dark'` 或 `'light'`，默认 `'dark'` |

**返回值：** `string` — 适配的 HEX 颜色值

**算法说明：**
- `dark` 模式：降低亮度、增加饱和度，生成深色
- `light` 模式：提升亮度、降低饱和度，生成浅色

**示例：**

::: code-group
```ts [TypeScript]
import { conversionColor } from 'l-js-fn';

// 深色模式（降低亮度）
conversionColor('#FF5733', 'dark');
// '#993300'

// 浅色模式（提升亮度）
conversionColor('#FF5733', 'light');
// '#FF9980'

// 非法颜色兜底
conversionColor('invalid');
// '#000000'
```

```js [JavaScript (ESM)]
import { conversionColor } from 'l-js-fn';

// 深色模式（降低亮度）
conversionColor('#FF5733', 'dark');
// '#993300'

// 浅色模式（提升亮度）
conversionColor('#FF5733', 'light');
// '#FF9980'

// 非法颜色兜底
conversionColor('invalid');
// '#000000'
```

```js [JavaScript (CJS)]
const { conversionColor } = require('l-js-fn');

// 深色模式（降低亮度）
conversionColor('#FF5733', 'dark');
// '#993300'

// 浅色模式（提升亮度）
conversionColor('#FF5733', 'light');
// '#FF9980'

// 非法颜色兜底
conversionColor('invalid');
// '#000000'
```
:::
