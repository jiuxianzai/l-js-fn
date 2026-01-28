export default {
	// 测试环境
	testEnvironment: 'node',

	// 支持 TypeScript
	preset: 'ts-jest',

	// 测试文件匹配模式
	testMatch: [
		'**/__tests__/**/*.test.ts',
		'**/?(*.)+(spec|test).ts'
	],

	// 模块路径别名
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1'
	},

	// 覆盖率配置
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/**/*.d.ts',
		'!src/types/**',
	],

	// 覆盖率阈值
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},

	// 覆盖率报告格式
	coverageReporters: ['text', 'lcov', 'html'],

	// 自动清理模拟
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
