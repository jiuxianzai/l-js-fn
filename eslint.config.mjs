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
];
