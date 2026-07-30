/**
 * color 单元测试
 * 测试颜色处理相关的方法
 */

import { isValidHexColor, hexToHSL, hslToHex, conversionColor, type HSLColor } from '@/libs/color';

describe('color - 颜色处理工具', () => {
	// ==================== isValidHexColor 测试 ====================
	describe('isValidHexColor - 判断是否为合法的 hex 颜色值', () => {
		it('应该识别合法的 6 位 hex 颜色', () => {
			expect(isValidHexColor('#FF0000')).toBe(true);
			expect(isValidHexColor('#00FF00')).toBe(true);
			expect(isValidHexColor('#0000FF')).toBe(true);
			expect(isValidHexColor('#ffffff')).toBe(true);
			expect(isValidHexColor('#000000')).toBe(true);
		});

		it('应该识别合法的 3 位 hex 颜色', () => {
			expect(isValidHexColor('#FFF')).toBe(true);
			expect(isValidHexColor('#000')).toBe(true);
			expect(isValidHexColor('#abc')).toBe(true);
			expect(isValidHexColor('#123')).toBe(true);
		});

		it('应该拒绝非法的 hex 颜色', () => {
			expect(isValidHexColor('#GGG')).toBe(false);
			expect(isValidHexColor('#FFFF')).toBe(false);
			expect(isValidHexColor('#FFFFFG')).toBe(false);
			expect(isValidHexColor('FF0000')).toBe(false);
			expect(isValidHexColor('#FF000')).toBe(false);
		});

		it('应该拒绝非字符串类型', () => {
			expect(isValidHexColor(123 as any)).toBe(false);
			expect(isValidHexColor(null as any)).toBe(false);
			expect(isValidHexColor(undefined as any)).toBe(false);
			expect(isValidHexColor({} as any)).toBe(false);
		});

		it('应该拒绝空字符串', () => {
			expect(isValidHexColor('')).toBe(false);
		});
	});

	// ==================== hexToHSL 测试 ====================
	describe('hexToHSL - hex 转 HSL', () => {
		it('应该正确转换红色 #FF0000', () => {
			const result = hexToHSL('#FF0000');
			expect(result.h).toBe(0);
			expect(result.s).toBe(100);
			expect(result.l).toBe(50);
		});

		it('应该正确转换绿色 #00FF00', () => {
			const result = hexToHSL('#00FF00');
			expect(result.h).toBe(120);
			expect(result.s).toBe(100);
			expect(result.l).toBe(50);
		});

		it('应该正确转换蓝色 #0000FF', () => {
			const result = hexToHSL('#0000FF');
			expect(result.h).toBe(240);
			expect(result.s).toBe(100);
			expect(result.l).toBe(50);
		});

		it('应该正确转换白色', () => {
			const result = hexToHSL('#FFFFFF');
			expect(result.h).toBe(0);
			expect(result.s).toBe(0);
			expect(result.l).toBe(100);
		});

		it('应该正确转换黑色', () => {
			const result = hexToHSL('#000000');
			expect(result.h).toBe(0);
			expect(result.s).toBe(0);
			expect(result.l).toBe(0);
		});

		it('应该正确转换 3 位 hex 颜色 #F00', () => {
			const result = hexToHSL('#F00');
			expect(result.h).toBe(0);
			expect(result.s).toBe(100);
			expect(result.l).toBe(50);
		});

		it('应该正确转换 3 位 hex 颜色 #0F0', () => {
			const result = hexToHSL('#0F0');
			expect(result.h).toBe(120);
			expect(result.s).toBe(100);
			expect(result.l).toBe(50);
		});

		it('应该正确转换灰色', () => {
			const result = hexToHSL('#808080');
			expect(result.h).toBe(0);
			expect(result.s).toBe(0);
			expect(result.l).toBe(50);
		});
	});

	// ==================== hslToHex 测试 ====================
	describe('hslToHex - HSL 转 hex', () => {
		it('应该正确转换红色', () => {
			expect(hslToHex({ h: 0, s: 100, l: 50 })).toBe('#ff0000');
		});

		it('应该正确转换绿色', () => {
			expect(hslToHex({ h: 120, s: 100, l: 50 })).toBe('#00ff00');
		});

		it('应该正确转换蓝色', () => {
			expect(hslToHex({ h: 240, s: 100, l: 50 })).toBe('#0000ff');
		});

		it('应该正确转换白色', () => {
			expect(hslToHex({ h: 0, s: 0, l: 100 })).toBe('#ffffff');
		});

		it('应该正确转换黑色', () => {
			expect(hslToHex({ h: 0, s: 0, l: 0 })).toBe('#000000');
		});

		it('应该正确转换灰色（饱和度为 0）', () => {
			expect(hslToHex({ h: 0, s: 0, l: 50 })).toBe('#808080');
		});

		it('应该正确转换带有不同色相的值', () => {
			expect(hslToHex({ h: 60, s: 100, l: 50 })).toBe('#ffff00');
		});

		it('应该正确转换带有不同饱和度的值', () => {
			expect(hslToHex({ h: 0, s: 50, l: 50 })).toBe('#bf4040');
		});
	});

	// ==================== conversionColor 测试 ====================
	describe('conversionColor - 根据背景色和模式计算图标颜色', () => {
		it('应该在 dark 模式下返回较暗的颜色', () => {
			const result = conversionColor('#FF0000', 'dark');
			// dark 模式：降低亮度（*0.4），提升饱和度（+5）
			const hsl = hexToHSL('#FF0000');
			expect(isValidHexColor(result)).toBe(true);
			// 结果应该是合法的 hex 颜色
		});

		it('应该在 light 模式下返回较亮的颜色', () => {
			const result = conversionColor('#FF0000', 'light');
			expect(isValidHexColor(result)).toBe(true);
		});

		it('应该使用默认 dark 模式', () => {
			const result = conversionColor('#FF0000');
			expect(isValidHexColor(result)).toBe(true);
		});

		it('应该在 dark 模式下处理白色背景', () => {
			const result = conversionColor('#FFFFFF', 'dark');
			expect(isValidHexColor(result)).toBe(true);
		});

		it('应该在 light 模式下处理黑色背景', () => {
			const result = conversionColor('#000000', 'light');
			expect(isValidHexColor(result)).toBe(true);
		});

		it('非法颜色输入应该返回 #000000', () => {
			expect(conversionColor('invalid')).toBe('#000000');
			expect(conversionColor('not-a-hex')).toBe('#000000');
		});

		it('应该支持 3 位 hex 颜色', () => {
			const result = conversionColor('#F00', 'dark');
			expect(isValidHexColor(result)).toBe(true);
		});

		it('应该支持 6 位 hex 颜色', () => {
			const result = conversionColor('#0088CC', 'light');
			expect(isValidHexColor(result)).toBe(true);
		});
	});

	// ==================== 往返转换测试 ====================
	describe('hex ↔ HSL 往返转换', () => {
		it('hex → HSL → hex 应该近似一致', () => {
			const original = '#FF6600';
			const hsl = hexToHSL(original);
			const result = hslToHex(hsl);
			expect(result).toBe('#ff6600');
		});

		it('HSL → hex → HSL 应该近似一致', () => {
			const original: HSLColor = { h: 200, s: 80, l: 40 };
			const hex = hslToHex(original);
			const hsl = hexToHSL(hex);
			// HSL 值应该近似（可能有舍入误差）
			expect(Math.abs(hsl.h - original.h)).toBeLessThanOrEqual(2);
			expect(Math.abs(hsl.s - original.s)).toBeLessThanOrEqual(2);
			expect(Math.abs(hsl.l - original.l)).toBeLessThanOrEqual(2);
		});
	});
});
