import tseslint from 'typescript-eslint';

export default [
	{ ignores: ['dist/', 'docs/', 'coverage/'] },
	...tseslint.configs.recommended,
	{
		files: ['**/*.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
	{
		files: ['**/*.test.ts', '__tests__/**/*.ts'],
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	{
		// 内嵌三方库 luch-request：保留 @ts-nocheck，不做类型化改造
		files: ['src/uniapp/request/luch-request/**/*.ts'],
		rules: {
			'@typescript-eslint/ban-ts-comment': 'off',
			'prefer-rest-params': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
		},
		linterOptions: { reportUnusedDisableDirectives: 'off' },
	},
	{
		// dist/crypto 测试需 require CJS 构建产物验证，require 是必要用法
		files: ['__tests__/dist/**/*.ts', '__tests__/crypto/dist.test.ts', '__tests__/crypto/index.test.ts'],
		rules: {
			'@typescript-eslint/no-require-imports': 'off',
		},
	},
];
