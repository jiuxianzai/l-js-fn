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

## 新增函数的标准工作流

### 1. 源码编写

- 通用工具 → `src/libs/<kit>.ts`（如 `is-kit.ts`、`array-kit.ts`）
- 独立子模块（如 bom, ws, storage）→ `src/<module>/index.ts`
- 类型定义 → `src/types/index.ts`
- 函数必须包含完整的 TypeScript 类型声明
- JSDoc 注释使用中文，包含 `@param`、`@returns`、`@example`
- 优先复用项目中已有的函数

### 2. 导出配置

- 主包函数通过 `src/index.ts` 的 `export *` 自动导出，无需额外配置
- 子模块需在 `tsup.config.ts` 的 `modules` 数组中注册入口，并在 `package.json` 的 `exports` 字段中添加路径映射

### 3. 测试编写

- 测试文件放在 `__tests__/` 下，路径与源码对应
- 覆盖率阈值：**80%**（分支/函数/行/语句）
- 使用 `@/` 别名导入被测模块
- 覆盖正常场景、边界情况、异常输入

### 4. 文档更新

- **VitePress 文档**: 在 `docs/guide/<module>.md` 中按序号添加函数说明
  - 包含参数表格、返回值说明、TypeScript/ESM/CJS 三栏代码示例
- **README.md**: 在对应模块的导入语句和示例中补充新函数

### 5. 验证与部署

- 运行 `npm run test` 确认全部测试通过
- 运行 `npx tsc --noEmit` 确认类型检查通过
- 运行 `npm run build` 确认构建成功
- 运行 `npm run docs:deploy` 部署文档到 GitHub Pages

### 6. Git 提交

- 使用 conventional commits 前缀（`feat:` `fix:` `docs:` 等）
- **提交信息使用中文撰写**
- Commit message 需通过 commitlint 校验（husky hook）

## 代码与文档风格

- Prettier: `tabWidth: 2`, `useTabs: true`, `singleQuote: true`, `printWidth: 150`
- TypeScript: 严格模式（`strict: true`）
- **文档和注释一律使用中文**，包括 JSDoc 注释、README、VitePress 文档
- **Git 提交信息使用中文**（保留 conventional commit 前缀）

## 构建配置要点

- **tsup** (`tsup.config.ts`): 生成 ESM + CJS 双格式，自动 `treeshake`
- **ESM 产物不 `minify`**：保留 `/* @__PURE__ */` 注解，交由消费方打包器树摇与压缩（lodash-es 同款做法）；CJS 产物 `minify` 单文件压缩
- **不 `drop` console**：库内有意的 `console.warn`/`console.error` 诊断日志（如 `setCookie` 环境不支持提示）需保留，且部分测试断言了 console 输出；仅避免在源码中写会泄漏业务数据的 `console.log`
- **类型声明** 只生成在 ESM 配置中，CJS 配置关闭 `dts` 避免重复
- `package.json` 中 `"type": "module"`，测试用 Jest + ts-jest 处理

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
| event-bus | `l-js-fn/event-bus` | EventBus 事件总线 |
| crypto | `l-js-fn/crypto` | 国密 SM4、SM2 等 |
