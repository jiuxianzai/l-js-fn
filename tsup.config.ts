import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  minify: true,
  treeshake: true,
  target: "es2020",
  outDir: "dist",
  clean: true,
  outExtension({ format }) {
    if (format === "cjs") return { js: ".cjs" };
    return { js: ".js" };
  },
  esbuildOptions(options) {
    // 删除 console/debugger
    options.drop = ["console", "debugger"];
  }
});
