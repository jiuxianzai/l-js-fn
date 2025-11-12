import { defineConfig } from 'tsup';

export default defineConfig(() => {
	const isProd = process.env.NODE_ENV === 'production';

	return {
		entry: ['src/index.ts'],
		format: ['esm', 'cjs'],
		dts: {
			// 设置为 true 或者指定输出路径
			entry: ['src/index.ts'], // 仅对 ESM 输出生成 .d.ts
			only: true, // 仅生成 .d.ts，不重复生成 .d.cts
		},
		minify: isProd, // 仅生产环境压缩
		treeshake: true,
		target: 'es2020',
		outDir: 'dist',
		clean: true,
		outExtension({ format }) {
			if (format === 'cjs') return { js: '.cjs' };
			return { js: '.js' };
		},
		esbuildOptions(opts) {
			// 仅生产环境删除 console / debugger
			if (isProd) {
				opts.drop = ['console', 'debugger'];
			}
		},
		cjsInterop: true,
	};
});
