/**
 * 正则表达式使用示例
 * 演示如何使用 l-js-fn/regex 模块中的正则表达式常量
 */

import { REGEXP } from 'l-js-fn/regex';

// ==================== 手机号验证 ====================
console.log('===== 手机号验证 =====');

// 中国大陆手机号（1开头，第二位3-9，共11位）
console.log('REGEXP.PHONE.test("13800138000"):', REGEXP.PHONE.test('13800138000')); // true
console.log('REGEXP.PHONE.test("18888888888"):', REGEXP.PHONE.test('18888888888')); // true
console.log('REGEXP.PHONE.test("12888888888"):', REGEXP.PHONE.test('12888888888')); // false (第二位不是3-9)
console.log('REGEXP.PHONE.test("1380013800"):', REGEXP.PHONE.test('1380013800')); // false (只有10位)

// 实际应用：表单验证
function validatePhoneNumber(phone: string): boolean {
  if (!phone) {
    console.error('手机号不能为空');
    return false;
  }

  if (!REGEXP.PHONE.test(phone)) {
    console.error('手机号格式不正确');
    return false;
  }

  console.log('手机号验证通过:', phone);
  return true;
}

validatePhoneNumber('13800138000'); // 通过
validatePhoneNumber('12888888888'); // 不通过

// ==================== 座机号验证 ====================
console.log('\n===== 座机号验证 =====');

// 支持带区号的座机号（如 010-12345678）
console.log('REGEXP.LAND_LINE.test("010-12345678"):', REGEXP.LAND_LINE.test('010-12345678')); // true
console.log('REGEXP.LAND_LINE.test("0571-1234567"):', REGEXP.LAND_LINE.test('0571-1234567')); // true
console.log('REGEXP.LAND_LINE.test("021-12345678"):', REGEXP.LAND_LINE.test('021-12345678')); // true
console.log('REGEXP.LAND_LINE.test("12345678"):', REGEXP.LAND_LINE.test('12345678')); // false (没有区号)

// ==================== 邮箱验证 ====================
console.log('\n===== 邮箱验证 =====');

// 常见邮箱格式
console.log('REGEXP.EMAIL.test("test@example.com"):', REGEXP.EMAIL.test('test@example.com')); // true
console.log('REGEXP.EMAIL.test("user.name@domain.co.jp"):', REGEXP.EMAIL.test('user.name@domain.co.jp')); // true
console.log('REGEXP.EMAIL.test("user+tag@example.com"):', REGEXP.EMAIL.test('user+tag@example.com')); // true
console.log('REGEXP.EMAIL.test("invalid.email"):', REGEXP.EMAIL.test('invalid.email')); // false (没有@)
console.log('REGEXP.EMAIL.test("@example.com"):', REGEXP.EMAIL.test('@example.com')); // false (没有用户名)

// 实际应用：邮箱验证
function validateEmail(email: string): boolean {
  if (!email) {
    console.error('邮箱不能为空');
    return false;
  }

  if (!REGEXP.EMAIL.test(email)) {
    console.error('邮箱格式不正确');
    return false;
  }

  console.log('邮箱验证通过:', email);
  return true;
}

validateEmail('test@example.com'); // 通过
validateEmail('invalid.email'); // 不通过

// ==================== 密码强度验证 ====================
console.log('\n===== 密码强度验证 =====');

// 密码规则：长度 8-16，包含大小写字母、数字、特殊字符，不允许空格
console.log('REGEXP.PASSWORD.test("Pass123!"):', REGEXP.PASSWORD.test('Pass123!')); // true
console.log('REGEXP.PASSWORD.test("Pass123!@#$"):', REGEXP.PASSWORD.test('Pass123!@#$')); // false (超过16位)
console.log('REGEXP.PASSWORD.test("pass123!"):', REGEXP.PASSWORD.test('pass123!')); // false (没有大写字母)
console.log('REGEXP.PASSWORD.test("PASS123!"):', REGEXP.PASSWORD.test('PASS123!')); // false (没有小写字母)
console.log('REGEXP.PASSWORD.test("Password!"):', REGEXP.PASSWORD.test('Password!')); // false (没有数字)
console.log('REGEXP.PASSWORD.test("Pass 123!"):', REGEXP.PASSWORD.test('Pass 123!')); // false (包含空格)

// 实际应用：密码强度检查
function checkPasswordStrength(password: string): void {
  if (!password) {
    console.error('密码不能为空');
    return;
  }

  if (!REGEXP.PASSWORD.test(password)) {
    console.error(
      '密码强度不足，必须包含：\n' +
        '- 长度 8-16 位\n' +
        '- 至少一个大写字母\n' +
        '- 至少一个小写字母\n' +
        '- 至少一个数字\n' +
        '- 至少一个特殊字符\n' +
        '- 不能包含空格'
    );
    return;
  }

  console.log('密码强度验证通过');
}

checkPasswordStrength('Pass123!'); // 通过
checkPasswordStrength('weak'); // 不通过

// ==================== URL 验证 ====================
console.log('\n===== URL 验证 =====');

console.log('REGEXP.URL.test("https://example.com"):', REGEXP.URL.test('https://example.com')); // true
console.log('REGEXP.URL.test("http://example.com"):', REGEXP.URL.test('http://example.com')); // true
console.log('REGEXP.URL.test("ftp://example.com"):', REGEXP.URL.test('ftp://example.com')); // true
console.log('REGEXP.URL.test("https://user:pass@example.com:8080/path?query=value#hash"):', REGEXP.URL.test('https://user:pass@example.com:8080/path?query=value#hash')); // true
console.log('REGEXP.URL.test("example.com"):', REGEXP.URL.test('example.com')); // false (没有协议)
console.log('REGEXP.URL.test("not a url"):', REGEXP.URL.test('not a url')); // false

// 实际应用：URL 验证
function validateUrl(url: string): boolean {
  if (!url) {
    console.error('URL 不能为空');
    return false;
  }

  if (!REGEXP.URL.test(url)) {
    console.error('URL 格式不正确');
    return false;
  }

  console.log('URL 验证通过:', url);
  return true;
}

validateUrl('https://example.com'); // 通过
validateUrl('not a url'); // 不通过

// ==================== 身份证验证 ====================
console.log('\n===== 身份证验证 =====');

// 支持 15 位和 18 位身份证号
console.log('REGEXP.ID_CARD.test("110101199001011234"):', REGEXP.ID_CARD.test('110101199001011234')); // true (18位)
console.log('REGEXP.ID_CARD.test("110101900101123"):', REGEXP.ID_CARD.test('110101900101123')); // true (15位)
console.log('REGEXP.ID_CARD.test("11010119900101123X"):', REGEXP.ID_CARD.test('11010119900101123X')); // true (18位，最后一位是X)
console.log('REGEXP.ID_CARD.test("1101011990010112345"):', REGEXP.ID_CARD.test('1101011990010112345')); // false (19位)

// 实际应用：身份证验证
function validateIdCard(idCard: string): void {
  if (!idCard) {
    console.error('身份证号不能为空');
    return;
  }

  if (!REGEXP.ID_CARD.test(idCard)) {
    console.error('身份证号格式不正确');
    return;
  }

  console.log('身份证号验证通过:', idCard);
}

validateIdCard('110101199001011234'); // 通过
validateIdCard('1101011990010112345'); // 不通过

// ==================== 内容类型验证 ====================
console.log('\n===== 内容类型验证 =====');

// 只允许中文
console.log('REGEXP.CHINESE.test("中文"):', REGEXP.CHINESE.test('中文')); // true
console.log('REGEXP.CHINESE.test("中文测试"):', REGEXP.CHINESE.test('中文测试')); // true
console.log('REGEXP.CHINESE.test("中文123"):', REGEXP.CHINESE.test('中文123')); // false (包含数字)
console.log('REGEXP.CHINESE.test("English"):', REGEXP.CHINESE.test('English')); // false (英文)

// 只允许英文
console.log('REGEXP.ENGLISH.test("English"):', REGEXP.ENGLISH.test('English')); // true
console.log('REGEXP.ENGLISH.test("english"):', REGEXP.ENGLISH.test('english')); // true
console.log('REGEXP.ENGLISH.test("English123"):', REGEXP.ENGLISH.test('English123')); // false (包含数字)
console.log('REGEXP.ENGLISH.test("英文"):', REGEXP.ENGLISH.test('英文')); // false (中文)

// 只允许数字
console.log('REGEXP.NUMBER.test("123456"):', REGEXP.NUMBER.test('123456')); // true
console.log('REGEXP.NUMBER.test("0"):', REGEXP.NUMBER.test('0')); // true
console.log('REGEXP.NUMBER.test("123.456"):', REGEXP.NUMBER.test('123.456')); // false (包含小数点)
console.log('REGEXP.NUMBER.test("abc"):', REGEXP.NUMBER.test('abc')); // false (字母)

// 只允许正整数
console.log('REGEXP.POSITIVE_NUMBER.test("123"):', REGEXP.POSITIVE_NUMBER.test('123')); // true
console.log('REGEXP.POSITIVE_NUMBER.test("0"):', REGEXP.POSITIVE_NUMBER.test('0')); // false (0不是正整数)
console.log('REGEXP.POSITIVE_NUMBER.test("-123"):', REGEXP.POSITIVE_NUMBER.test('-123')); // false (负数)

// 整数（包括正整数和负整数）
console.log('REGEXP.INTEGER.test("123"):', REGEXP.INTEGER.test('123')); // true
console.log('REGEXP.INTEGER.test("-123"):', REGEXP.INTEGER.test('-123')); // true
console.log('REGEXP.INTEGER.test("+123"):', REGEXP.INTEGER.test('+123')); // true
console.log('REGEXP.INTEGER.test("12.3"):', REGEXP.INTEGER.test('12.3')); // false (小数)

// 英文 + 数字（常用账号规则）
console.log('REGEXP.EN_OR_NUM.test("abc123"):', REGEXP.EN_OR_NUM.test('abc123')); // true
console.log('REGEXP.EN_OR_NUM.test("ABC123"):', REGEXP.EN_OR_NUM.test('ABC123')); // true
console.log('REGEXP.EN_OR_NUM.test("abc_123"):', REGEXP.EN_OR_NUM.test('abc_123')); // false (包含下划线)

// 英文 + 数字 + 下划线
console.log('REGEXP.EN_NUM_UNDER_LINE.test("abc_123"):', REGEXP.EN_NUM_UNDER_LINE.test('abc_123')); // true
console.log('REGEXP.EN_NUM_UNDER_LINE.test("abc-123"):', REGEXP.EN_NUM_UNDER_LINE.test('abc-123')); // false (包含连字符)

// 不包含特殊字符（仅中英文、数字）
console.log('REGEXP.NO_SPECIAL.test("中文abc123"):', REGEXP.NO_SPECIAL.test('中文abc123')); // true
console.log('REGEXP.NO_SPECIAL.test("abc@123"):', REGEXP.NO_SPECIAL.test('abc@123')); // false (包含@)

// ==================== 金额验证 ====================
console.log('\n===== 金额验证 =====');

// 支持两位小数
console.log('REGEXP.MONEY.test("100"):', REGEXP.MONEY.test('100')); // true
console.log('REGEXP.MONEY.test("100.5"):', REGEXP.MONEY.test('100.5')); // true
console.log('REGEXP.MONEY.test("100.55"):', REGEXP.MONEY.test('100.55')); // true
console.log('REGEXP.MONEY.test("0.99"):', REGEXP.MONEY.test('0.99')); // true
console.log('REGEXP.MONEY.test("100.555"):', REGEXP.MONEY.test('100.555')); // false (超过两位小数)
console.log('REGEXP.MONEY.test("-100"):', REGEXP.MONEY.test('-100')); // false (负数)

// 实际应用：金额输入验证
function validateMoney(amount: string): void {
  if (!amount) {
    console.error('金额不能为空');
    return;
  }

  if (!REGEXP.MONEY.test(amount)) {
    console.error('金额格式不正确，请输入有效的金额（最多两位小数）');
    return;
  }

  const numAmount = parseFloat(amount);
  console.log('金额验证通过:', numAmount);
}

validateMoney('100'); // 通过
validateMoney('100.55'); // 通过
validateMoney('100.555'); // 不通过

// ==================== 实际应用示例 ====================

/**
 * 表单验证类
 */
class FormValidator {
  // 验证用户名（英文、数字、下划线，4-20位）
  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;
    return usernameRegex.test(username);
  }

  // 验证密码（使用 REGEXP.PASSWORD）
  static validatePassword(password: string): boolean {
    return REGEXP.PASSWORD.test(password);
  }

  // 验证手机号（使用 REGEXP.PHONE）
  static validatePhone(phone: string): boolean {
    return REGEXP.PHONE.test(phone);
  }

  // 验证邮箱（使用 REGEXP.EMAIL）
  static validateEmail(email: string): boolean {
    return REGEXP.EMAIL.test(email);
  }

  // 验证身份证号（使用 REGEXP.ID_CARD）
  static validateIdCard(idCard: string): boolean {
    return REGEXP.ID_CARD.test(idCard);
  }

  // 验证 URL（使用 REGEXP.URL）
  static validateUrl(url: string): boolean {
    return REGEXP.URL.test(url);
  }

  // 验证金额（使用 REGEXP.MONEY）
  static validateMoney(amount: string): boolean {
    return REGEXP.MONEY.test(amount);
  }

  // 综合验证
  static validate(formData: Record<string, string>): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.validateUsername(formData.username)) {
      errors.push('用户名格式不正确（4-20位英文、数字或下划线）');
    }

    if (!this.validatePassword(formData.password)) {
      errors.push('密码强度不足');
    }

    if (formData.phone && !this.validatePhone(formData.phone)) {
      errors.push('手机号格式不正确');
    }

    if (formData.email && !this.validateEmail(formData.email)) {
      errors.push('邮箱格式不正确');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// 使用示例
const formData = {
  username: 'test_user',
  password: 'Pass123!',
  phone: '13800138000',
  email: 'test@example.com',
};

const result = FormValidator.validate(formData);
console.log('\n表单验证结果:', result);

export { FormValidator };
