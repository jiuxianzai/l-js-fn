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

	// 覆盖率报告格式（多种格式，满足不同需求）
	coverageReporters: [
		'text',           // 终端文本输出
		'text-summary',   // 终端汇总输出
		'lcov',           // lcov.info（用于 CI/CD）
		'html',           // HTML 报告（可视化查看）
		'json'            // JSON 格式（用于其他工具分析）
	],

	// 覆盖率输出目录
	coverageDirectory: 'coverage',

	// 覆盖率报告文件名
	coverageFilename: 'coverage/coverage-final.json',

	// 自动清理模拟
	clearMocks: true,
	resetMocks: true,
	restoreMocks: true,
};
