import { defineConfig } from "tsup";

/**
 * 所有模块入口配置
 * 新增模块时只需在此数组中添加一项即可
 */
const modules = [
	{ entry: "src/index.ts", name: "index" }, // 主入口
	{ entry: "src/bom/index.ts", name: "bom/index" },
	{ entry: "src/config/index.ts", name: "config/index" },
	{ entry: "src/encode/index.ts", name: "encode/index" },
	{ entry: "src/file/index.ts", name: "file/index" },
	{ entry: "src/ipc/index.ts", name: "ipc/index" },
	{ entry: "src/polling/index.ts", name: "polling/index" },
	{ entry: "src/regex/index.ts", name: "regex/index" },
	{ entry: "src/storage/index.ts", name: "storage/index" },
	{ entry: "src/ws/index.ts", name: "ws/index" },
] as const;

/**
 * 通用配置选项
 */
const baseOptions = {
	minify: true,
	treeshake: true,
	target: "es2020",
	outDir: "dist",
	splitting: false,
	cjsInterop: true,
	esbuildOptions(opts: any) {
		opts.drop = ["console", "debugger"];
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
		clean: false,
		outExtension() {
			return { js: ".cjs" };
		},
		...baseOptions,
	});

	return configs;
});
