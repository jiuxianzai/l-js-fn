import { defineConfig } from "tsup";

/**
 * 所有模块入口配置
 * 新增模块时只需在此数组中添加一项即可
 */
const modules = [
	{ entry: "src/index.ts", name: "index" }, // 主入口
	{ entry: "src/bom/index.ts", name: "bom/index" },
	{ entry: "src/config/index.ts", name: "config/index" },
	{ entry: "src/crypto/index.ts", name: "crypto/index" },
	{ entry: "src/encode/index.ts", name: "encode/index" },
	{ entry: "src/event-bus/index.ts", name: "event-bus/index" },
	{ entry: "src/file/index.ts", name: "file/index" },
	{ entry: "src/ipc/index.ts", name: "ipc/index" },
	{ entry: "src/polling/index.ts", name: "polling/index" },
	{ entry: "src/regex/index.ts", name: "regex/index" },
	{ entry: "src/storage/index.ts", name: "storage/index" },
	{ entry: "src/uniapp/index.ts", name: "uniapp/index" },
	{ entry: "src/ws/index.ts", name: "ws/index" },
] as const;

/**
 * 通用配置选项
 * 说明：
 * - ESM 产物关闭 minify：保留 /* @__PURE__ *\/ 注解，交由消费方打包器做树摇与压缩
 *   （未 minify 的 ESM 是 lodash-es 等库的通用做法，树摇效果最佳）
 * - CJS 产物开启 minify：CJS 无法树摇，保持单文件压缩
 */
const baseOptions = {
	treeshake: true,
	target: "es2020",
	outDir: "dist",
	splitting: false,
	cjsInterop: true,
	esbuildOptions(opts: any) {
		// opts.drop = ["console", "debugger"]; // 测试时注释
	},
};

export default defineConfig(() => {
	const configs: any[] = [];

	// 生成 ESM 配置（每个模块单独配置，带类型声明）
	modules.forEach((module, index) => {
		configs.push({
			entry: { [module.name]: module.entry } as Record<string, string>,
			format: ["esm"],
			dts: { entry: { [module.name]: module.entry } as Record<string, string> },
			clean: index === 0, // 只有第一个配置清理 dist 目录
			outExtension() {
				return { js: ".js" };
			},
			...baseOptions,
		});
	});

	// 生成 CJS 配置（所有模块合并为一个配置，不带类型声明避免重复）
	configs.push({
		entry: modules.reduce(
			(acc, module) => {
				acc[module.name] = module.entry;
				return acc;
			},
			{} as Record<string, string>,
		),
		format: ["cjs"],
		dts: false,
		minify: true,
		clean: false,
		outExtension() {
			return { js: ".cjs" };
		},
		...baseOptions,
	});

	return configs;
});
