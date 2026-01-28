/**
 * 基础用法示例
 * 演示 l-js-fn 主包中的常用工具函数
 */

import {
  // 类型判断
  isEmpty,
  isArray,
  isEmail,
  isPhoneNumber,

  // 数组操作
  arrayDelEl,
  arrayUnique,
  arrayPaginate,

  // 字符串处理
  desensitization,
  trim,
  getUuid,

  // 对象操作
  objMerge,
  objFilterNull,

  // 日期处理
  dateFormat,
  formatPassTime,

  // 数字处理
  formatNumber,
  toPercent,

  // URL 处理
  getUrlParams,
  appendUrlParam,

  // 通用工具
  debounce,
  throttle,
  deepClone,
} from 'l-js-fn';

// ==================== 类型判断 ====================
console.log('===== 类型判断 =====');

// 空值检查
console.log('isEmpty(""):', isEmpty('')); // true
console.log('isEmpty([]):', isEmpty([])); // true
console.log('isEmpty(null):', isEmpty(null)); // true
console.log('isEmpty({}):', isEmpty({})); // true
console.log('isEmpty("hello"):', isEmpty('hello')); // false

// 类型检查
console.log('isArray([1, 2, 3]):', isArray([1, 2, 3])); // true
console.log('isEmail("test@example.com"):', isEmail('test@example.com')); // true
console.log('isPhoneNumber("13800138000"):', isPhoneNumber('13800138000')); // true

// ==================== 数组操作 ====================
console.log('\n===== 数组操作 =====');

// 删除元素
const arr1 = [1, 2, 3, 2, 4];
console.log('原数组:', arr1);
console.log('arrayDelEl([1,2,3,2,4], 2):', arrayDelEl(arr1, 2)); // [1, 3, 4]

// 数组去重
const arr2 = [1, 2, 2, 3, 3, 4];
console.log('arrayUnique([1,2,2,3,3,4]):', arrayUnique(arr2)); // [1, 2, 3, 4]

// 数组分页
const arr3 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log('arrayPaginate([1..10], 2, 3):', arrayPaginate(arr3, 2, 3)); // [4, 5, 6]

// ==================== 字符串处理 ====================
console.log('\n===== 字符串处理 =====');

// 字符串脱敏
console.log('desensitization("13800138000", 3, 4):', desensitization('13800138000', 3, 4)); // "138****8000"

// 去除空格
console.log('trim("  hello  "):', trim('  hello  ')); // "hello"
console.log('trim("  hello  ", "all"):', trim('  hello  ', 'all')); // "hello"

// 生成 UUID
console.log('getUuid():', getUuid()); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"

// ==================== 对象操作 ====================
console.log('\n===== 对象操作 =====');

// 对象合并
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
console.log('objMerge({a:1,b:2}, {b:3,c:4}):', objMerge(obj1, obj2)); // { a: 1, b: 3, c: 4 }

// 过滤空值
const obj3 = { a: 1, b: null, c: undefined, d: 4 };
console.log('objFilterNull({a:1,b:null,c:undefined,d:4}):', objFilterNull(obj3)); // { a: 1, d: 4 }

// ==================== 日期处理 ====================
console.log('\n===== 日期处理 =====');

// 日期格式化
console.log('dateFormat(new Date()):', dateFormat(new Date())); // "2024-01-01 12:00:00"
console.log('dateFormat(new Date(), "yyyy-MM-dd"):', dateFormat(new Date(), 'yyyy-MM-dd' as any)); // "2024-01-01"

// 格式化过去时间
const pastDate = new Date(Date.now() - 3600000); // 1小时前
console.log('formatPassTime(1小时前):', formatPassTime(pastDate)); // "1小时前"

// ==================== 数字处理 ====================
console.log('\n===== 数字处理 =====');

// 数字格式化
console.log('formatNumber(1234567):', formatNumber(1234567)); // "1,234,567"
console.log('formatNumber(1234567, true):', formatNumber(1234567, true)); // "123万"

// 转百分比
console.log('toPercent(0.5332):', toPercent(0.5332)); // "53.32%"

// ==================== URL 处理 ====================
console.log('\n===== URL 处理 =====');

// 解析 URL 参数
const url = 'https://example.com?id=1&name=John';
console.log('getUrlParams(url):', getUrlParams(url)); // { id: '1', name: 'John' }

// 添加 URL 参数
console.log('appendUrlParam(url, "age", 20):', appendUrlParam(url, 'age', 20)); // "https://example.com?id=1&name=John&age=20"

// ==================== 通用工具 ====================
console.log('\n===== 通用工具 =====');

// 深拷贝
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
console.log('deepClone({a:1,b:{c:2}}):', cloned);
cloned.b.c = 999;
console.log('原对象不受影响:', original.b.c); // 2

// 防抖和节流示例
const debouncedFn = debounce(() => {
  console.log('防抖函数执行');
}, 300);

const throttledFn = throttle(() => {
  console.log('节流函数执行');
}, 300);

// 模拟多次调用
debouncedFn();
debouncedFn();
debouncedFn();
// 只有最后一次调用会在 300ms 后执行

throttledFn();
throttledFn();
throttledFn();
// 只有第一次调用会执行，后续调用被节流
