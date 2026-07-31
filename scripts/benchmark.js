/**
 * l-js-fn 性能基准测试
 * 用法: NODE_NO_WARNINGS=1 node scripts/benchmark.js
 */
import { performance } from 'perf_hooks';
import { deepClone } from '../dist/index.cjs';
import { isEqual } from '../dist/index.cjs';
import { flatten } from '../dist/index.cjs';
import { shuffle } from '../dist/index.cjs';
import { arrayUnique } from '../dist/index.cjs';
import { dateFormat } from '../dist/index.cjs';
import { groupBy } from '../dist/index.cjs';
import { deepMerge } from '../dist/index.cjs';
import { formatNumber } from '../dist/index.cjs';
import { toCamelCase, toPascalCase } from '../dist/index.cjs';

const ITERATIONS = 10000;
const WARMUP = 1000;

function bench(name, fn, setup) {
	const data = setup();

	// 预热
	for (let i = 0; i < WARMUP; i++) fn(data);

	const start = performance.now();
	for (let i = 0; i < ITERATIONS; i++) fn(data);
	const elapsed = performance.now() - start;

	const opsPerSec = (ITERATIONS / (elapsed / 1000)).toFixed(0);
	const avgUs = ((elapsed / ITERATIONS) * 1000).toFixed(2);

	console.log(`  ${name.padEnd(26)} ${String(opsPerSec).padStart(8)} ops/s  (${avgUs} µs/op)`);
}

console.log(`\n=== l-js-fn Benchmark (${ITERATIONS.toLocaleString()} iterations) ===\n`);

// ── deepClone ──
console.log('deepClone:');
const bigObj = () => {
	const obj = {};
	for (let i = 0; i < 100; i++) obj[`key${i}`] = { a: i, b: `str${i}`, c: [i, i * 2] };
	return obj;
};
const circularObj = () => {
	const obj = { name: 'root', children: [] };
	obj.children.push({ parent: obj, value: 42 });
	return obj;
};

bench('  large object (100 keys)', (d) => deepClone(d), bigObj);
bench('  circular reference', (d) => deepClone(d), circularObj);
bench('  small object', (d) => deepClone(d), () => ({ a: 1, b: 'hello', c: true }));

// ── isEqual ──
console.log('\nisEqual:');
const eqData1 = () => ({ obj1: bigObj(), obj2: bigObj() });
const eqData2 = () => {
	const a = {};
	for (let i = 0; i < 100; i++) a[`key${i}`] = { a: i, b: `str${i}`, c: [i, i * 2] };
	const b = {};
	for (let i = 0; i < 100; i++) b[`key${i}`] = { a: i, b: `str${i}`, c: [i, i * 2] };
	return { a, b };
};

bench('  large object (100 keys)', ({ a, b }) => isEqual(a, b), eqData2);
bench('  same reference', (d) => isEqual(d, d), bigObj);
bench('  primitives', () => isEqual(42, 42), () => null);

// ── flatten ──
console.log('\nflatten:');
const nestedArr = () => {
	const arr = [];
	for (let i = 0; i < 5; i++) {
		arr.push([i, [i * 2, [i * 3, [i * 4]]]]);
	}
	return arr;
};

bench('  deeply nested (4 levels)', (d) => flatten(d), nestedArr);
bench('  flat array', (d) => flatten(d), () => [1, 2, 3, 4, 5]);

// ── shuffle ──
console.log('\nshuffle:');
const bigArr = () => Array.from({ length: 1000 }, (_, i) => i);

bench('  1,000 elements', (d) => shuffle(d), bigArr);

// ── arrayUnique ──
console.log('\narrayUnique:');
const dupArr = () => {
	const arr = [];
	for (let i = 0; i < 500; i++) {
		arr.push(i, i); // each value appears twice
	}
	return arr;
};

bench('  1,000 elements (50% dup)', (d) => arrayUnique(d), dupArr);

// ── dateFormat ──
console.log('\ndateFormat:');
const now = new Date();
bench('  Date → yyyy-MM-dd HH:mm:ss', (d) => dateFormat(d), () => now);

// ── groupBy ──
console.log('\ngroupBy:');
const groupData = () => Array.from({ length: 1000 }, (_, i) => ({ name: `item${i}`, type: String(i % 10) }));

bench('  1,000 items, 10 groups', (d) => groupBy(d, 'type'), groupData);

// ── deepMerge ──
console.log('\ndeepMerge:');
const mergeData = () => ({
	base: { a: 1, b: { c: 2, d: { e: 3 } } },
	other: { b: { d: { f: 4 } }, g: 5 },
});

bench('  nested objects', ({ base, other }) => deepMerge(base, other), mergeData);

// ── formatNumber ──
console.log('\nformatNumber:');
bench('  comma style (1000000)', () => formatNumber(1000000, { decimals: 2 }), () => null);
bench('  chinese (12345.67)', () => formatNumber(12345.67, { type: 'chinese' }), () => null);

// ── toCamelCase / toPascalCase ──
console.log('\nstring transforms:');
bench('  toCamelCase', (d) => toCamelCase(d), () => 'hello-world-foo-bar');
bench('  toPascalCase', (d) => toPascalCase(d), () => 'hello-world-foo-bar');

console.log('\nDone.\n');
