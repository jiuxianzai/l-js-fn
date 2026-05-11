# Agent 工作指南

## 项目概述

`l-js-fn` 是一个零依赖的 TypeScript 工具函数库，支持模块化按需导入和 Tree-shaking。

- **源码入口**: `src/index.ts` (主包), `src/<module>/index.ts` (子模块)
- **构建输出**: `dist/` — ESM (`.js` + `.d.ts`) 和 CJS (`.cjs`)
- **模块别名**: `@/` 映射到 `src/`

## 关键命令

```bash
# 开发（watch 模式）
npm run dev

# 构建（先清理，再 tsup 打包）
npm run build

# 测试
npm run test                          # 运行全部测试
npm run test:coverage                 # 覆盖率报告（阈值 80%）
npm run test:watch                    # watch 模式
NODE_NO_WARNINGS=1 NODE_OPTIONS=--experimental-vm-modules npx jest __tests__/libs/array-kit.test.ts   # 单文件测试

# 发布
npm run publish:fix    # patch
npm run publish:feat   # minor
npm run publish:major  # major
npm run publish:pre    # prerelease (beta)
```

## 新增模块/函数的规范

1. **源码位置**:
   - 通用工具 → `src/libs/<kit>.ts`
   - 独立子模块（如 bom, ws, storage）→ `src/<module>/index.ts`
   - 类型定义 → `src/types/index.ts`

2. **导出要求**:
   - 主包统一在 `src/index.ts` 中 `export * from '@/libs/xxx.ts'`
   - 子模块需同时在 `tsup.config.ts` 的 `modules` 数组中注册入口
   - 并在 `package.json` 的 `exports` 字段中添加对应路径映射

3. **测试要求**:
   - 测试文件放在 `__tests__/` 下，路径与源码对应
   - 覆盖率阈值：**80%**（分支/函数/行/语句）
   - 使用 `@/` 别名导入被测模块

## 构建配置要点

- **tsup** (`tsup.config.ts`): 生成 ESM + CJS 双格式，自动 `minify` 和 `treeshake`
- **构建时自动移除** `console` 和 `debugger`（`esbuildOptions.drop`）
- **类型声明** 只生成在 ESM 配置中，CJS 配置关闭 `dts` 避免重复
- `package.json` 中 `"type": "module"`，但测试用 Jest + ts-jest 处理

## 代码风格

- Prettier: `tabWidth: 2`, `useTabs: true`, `singleQuote: true`, `printWidth: 150`
- Commit message: 使用 conventional commits，需通过 commitlint 校验（husky hook）
- 类型: 严格模式（`strict: true`）

## 子模块列表

| 模块 | 路径 | 说明 |
|------|------|------|
| 主包 | `l-js-fn` | is-kit, array-kit, string-kit, object-kit, common, date-kit, number-kit, url-kit, color, Result |
| bom | `l-js-fn/bom` | 浏览器对象模型（滚动、全屏、剪贴板、Cookie） |
| ws | `l-js-fn/ws` | WebSocketManager |
| storage | `l-js-fn/storage` | localStorage/sessionStorage（支持过期时间） |
| polling | `l-js-fn/polling` | Polling 轮询工具 |
| ipc | `l-js-fn/ipc` | H5Bridge, IframeBridge |
| regex | `l-js-fn/regex` | REGEXP 常量 |
| config | `l-js-fn/config` | DATE_FORMAT, HTTP_STATUS |
| encode | `l-js-fn/encode` | Base64, HTML 转义, URL 编码 |
| file | `l-js-fn/file` | 文件大小格式化、类型判断、下载 |
