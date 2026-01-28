# 贡献指南

感谢你对 `l-js-fn` 的关注！我们欢迎任何形式的贡献，包括但不限于：

- 🐛 报告 Bug
- 💡 提出新功能建议
- 📖 改进文档
- 🔧 提交代码修复或新功能

在贡献之前，请仔细阅读以下指南。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境搭建](#开发环境搭建)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)

## 🤝 行为准则

- 尊重所有贡献者
- 保持友好和建设性的讨论
- 接受不同观点和意见
- 专注于对项目最有利的事情

## 🚀 如何贡献

### 报告 Bug

如果你发现了 Bug，请：

1. 检查 [Issues](https://github.com/jiuxianzai/l-js-fn/issues) 中是否已有人报告
2. 如果没有，创建一个新的 Issue，包含以下信息：
   - 清晰的标题
   - 问题描述
   - 复现步骤
   - 期望行为
   - 实际行为
   - 环境信息（Node 版本、浏览器等）
   - 代码示例或错误截图

### 提出新功能

如果你有好的想法：

1. 先检查 [Issues](https://github.com/jiuxianzai/l-js-fn/issues) 是否已有人提出
2. 如果没有，创建一个 Feature Request Issue，包含：
   - 功能描述
   - 使用场景
   - 预期的 API 设计
   - 示例代码

### 提交代码

如果你想直接贡献代码：

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 🛠 开发环境搭建

### 前置要求

- Node.js >= 18
- npm / yarn / pnpm
- Git

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/jiuxianzai/l-js-fn.git
cd l-js-fn

# 安装依赖
npm install
```

### 开发命令

```bash
# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 运行测试
npm test

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 📐 代码规范

### TypeScript 规范

- 使用 TypeScript 编写所有代码
- 所有函数必须有类型定义
- 导出的函数必须有 JSDoc 注释
- 使用 `const` 和 `let`，避免使用 `var`

### 命名规范

- **文件名**：使用 kebab-case（如 `array-kit.ts`）
- **变量名/函数名**：使用 camelCase（如 `formatNumber`）
- **类名**：使用 PascalCase（如 `WebSocketManager`）
- **常量**：使用 UPPER_SNAKE_CASE（如 `REGEXP`）
- **类型/接口**：使用 PascalCase（如 `FileInfo`）

### 代码风格

本项目使用 Prettier 进行代码格式化，配置如下：

```javascript
{
  "printWidth": 150,
  "useTabs": true,
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "endOfLine": "lf"
}
```

在提交代码前，请运行：

```bash
npm run format
```

### 注释规范

所有导出的函数和方法必须包含 JSDoc 注释：

```typescript
/**
 * 函数的简短描述
 *
 * @param param1 - 参数1的描述
 * @param param2 - 参数2的描述
 * @returns 返回值的描述
 *
 * @example
 * ```typescript
 * const result = functionName('test');
 * console.log(result); // 输出结果
 * ```
 */
export function functionName(param1: string, param2?: number): boolean {
  // 实现
}
```

## 📝 提交信息规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 提交格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 Bug
- `bug`: 针对 bug 号的修改
- `docs`: 文档变更
- `style`: 代码格式调整（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `test`: 增加测试
- `build`: 构建相关
- `chore`: 辅助工具的变动
- `ci`: 自动化构建配置变更
- `types`: 类型定义变更
- `revert`: 撤销之前的 commit

### 示例

```bash
# 新功能
git commit -m "feat(string-kit): 新增字符串脱敏方法"

# 修复 Bug
git commit -m "fix(date-format): 修复时间戳超出位数误判问题"

# 文档更新
git commit -m "docs(readme): 更新安装说明"

# 重构
git commit -m "refactor(core): 优化数组操作性能"
```

## 🔄 Pull Request 流程

### PR 标题格式

请使用与提交信息相同的格式：

```
feat(string-kit): 新增字符串脱敏方法
fix(date-format): 修复时间戳超出位数误判问题
```

### PR 描述模板

创建 PR 时，请填写以下信息：

```markdown
## 变更类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新
- [ ] 其他（请说明）

## 变更说明
<!-- 描述你的变更内容 -->

## 相关 Issue
<!-- 关联的 Issue，如 Closes #123 -->

## 测试
- [ ] 已添加测试
- [ ] 已通过现有测试
- [ ] 已手动测试

## 截图（如果适用）
<!-- 添加截图或 GIF -->

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已添加必要的注释和文档
- [ ] 已运行 `npm run format` 格式化代码
- [ ] 已通过所有测试
- [ ] 已更新相关文档
```

### PR 审查

1. 所有 PR 需要至少一位维护者审查通过
2. 如有需要修改的地方，请及时响应
3. 确保所有 CI 检查通过
4. 合并后，维护者会删除分支

## 📦 发布流程

维护者发布流程：

1. 更新 CHANGELOG.md
2. 更新版本号
   - `npm run publish:major` - 主版本升级
   - `npm run publish:feat` - 次版本升级
   - `npm run publish:fix` - 修订版升级
   - `npm run publish:pre` - 预发布版本
3. 构建并发布到 npm
4. 创建 Git Tag

## 🧪 测试要求

- 新功能必须包含单元测试
- 测试覆盖率至少达到 80%
- 所有测试必须通过

### 测试命令

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test array-kit.test.ts

# 查看测试覆盖率
npm test -- --coverage
```

## 💬 讨论

如果你有任何疑问，可以：

- 在 Issue 中讨论
- 在 PR 中提出问题
- 联系维护者

## 📄 许可证

贡献的代码将遵循本项目的 [ISC 许可证](LICENSE)。

---

**再次感谢你的贡献！** 🎉
