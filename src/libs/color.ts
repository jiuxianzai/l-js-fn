/** 颜色处理工具 - 老王统一封装 */

import { REGEXP } from '@/regex';

/** HSL颜色结构定义 */
export type HSLColor = { h: number; s: number; l: number };

/** 枚举：颜色模式选择 */
export type ColorMode = 'dark' | 'light';

/** 判断是否为合法的hex颜色值 */
export function isValidHexColor(color: string): boolean {
  if (typeof color !== 'string') return false;
  return REGEXP.HEX_COLOR.test(color);
}

/** hex转HSL */
export function hexToHSL(hex: string): HSLColor {
  let h = hex.replace('#', '');
  if (h.length === 3) { // 处理#RGB格式扩展为#RRGGBB
    h = `${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }

  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const light = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: hue = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: hue = ((b - r) / d + 2) / 6; break;
      case b: hue = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(hue * 360), s: Math.round(sat * 100), l: Math.round(light * 100) };
}

/** HSL转hex */
export function hslToHex({ h, s, l }: HSLColor): string {
  const _h = h / 360; const _s = s / 100; const _l = l / 100;
  let r, g, b;

  if (_s === 0) { r = g = b = _l; }
  else {
    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = _l < 0.5 ? _l * (1 + _s) : _l + _s - _l * _s;
    const p = 2 * _l - q;
    r = hue2rgb(p, q, _h + 1 / 3);
    g = hue2rgb(p, q, _h);
    b = hue2rgb(p, q, _h - 1 / 3);
  }

  const toHex = (x: number): string => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** 生成目标模式颜色 (深色:降亮增饱, 浅色:提亮减饱) */
function generateTargetColor(hsl: HSLColor, mode: ColorMode): HSLColor {
  if (mode === 'dark') {
    return { h: hsl.h, s: Math.min(hsl.s + 5, 100), l: hsl.l * 0.4 };
  }
  // 浅色模式：提升亮度，略微降低饱和度避免过曝
  return { h: hsl.h, s: Math.max(hsl.s - 10, 0), l: hsl.l * 1.4 + 2 };
}

/** 核心入口：根据背景色和模式计算图标颜色 */
export function conversionColor(hexColor: string, mode: ColorMode = "dark"): string {
  if (!isValidHexColor(hexColor)) return '#000000'; // 异常兜底
  const hsl = hexToHSL(hexColor);
  const targetHsl = generateTargetColor(hsl, mode);
  return hslToHex(targetHsl);
}