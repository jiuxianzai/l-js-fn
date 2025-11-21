import {defineConfig} from "tsup";

export default defineConfig(() => {
  return [
    {
      entry: {index: "src/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {index: "src/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: true,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"bom/index": "src/bom/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"bom/index": "src/bom/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"config/index": "src/config/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"config/index": "src/config/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"ipc/index": "src/ipc/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"ipc/index": "src/ipc/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"polling/index": "src/polling/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"polling/index": "src/polling/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"regex/index": "src/regex/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"regex/index": "src/regex/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"ws/index": "src/ws/index.ts"} as Record<string, string>,
      format: ["esm"],
      dts: {entry: {"ws/index": "src/ws/index.ts"} as Record<string, string>},
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".js"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    // ----------------- cjs -----------------
    {
      entry: {index: "src/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"bom/index": "src/bom/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"config/index": "src/config/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"ipc/index": "src/ipc/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"polling/index": "src/polling/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"regex/index": "src/regex/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
    {
      entry: {"ws/index": "src/ws/index.ts"} as Record<string, string>,
      format: ["cjs"],
      dts: false,
      minify: true,
      treeshake: true,
      target: "es2020",
      outDir: "dist",
      clean: false,
      splitting: false,
      outExtension() {
        return {js: ".cjs"};
      },
      esbuildOptions(opts) {
        opts.drop = ["console", "debugger"];
      },
      cjsInterop: true,
    },
  ];
});
