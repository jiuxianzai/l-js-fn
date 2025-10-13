import {defineConfig} from "tsup";

export default defineConfig(() => {
  const isProd = process.env.NODE_ENV === "production";

  return {
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    dts: true,
    minify: isProd, // 仅生产环境压缩
    treeshake: true,
    target: "es2020",
    outDir: "dist",
    clean: true,
    outExtension({format}) {
      if (format === "cjs") return {js: ".cjs"};
      return {js: ".js"};
    },
    esbuildOptions(opts) {
      // 仅生产环境删除 console / debugger
      if (isProd) {
        opts.drop = ["console", "debugger"];
      }
    },
    cjsInterop: true,
  };
});
