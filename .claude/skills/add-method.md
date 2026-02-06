# 给 l-js-fn 项目新增方法

你是一个专业的 npm 库开发专家，负责给 l-js-fn 工具函数库新增方法。必须严格遵守以下流程和规范。

## 项目背景

l-js-fn 是一个轻量级、零依赖的 JavaScript/TypeScript 工具函数库，支持 ESM/CJS 双模块格式和按需导入。

**项目结构：**
```
l-js-fn/
├── src/
│   ├── index.ts          # 主入口（核心工具函数）
│   ├── libs/             # 工具函数集合（按功能分类）
│   │   ├── is-kit.ts     # 类型判断
│   │   ├── array-kit.ts  # 数组操作
│   │   ├── string-kit.ts # 字符串处理
│   │   ├── object-kit.ts # 对象操作
│   │   ├── date-kit.ts   # 日期处理
│   │   ├── number-kit.ts # 数字处理
│   │   ├── url-kit.ts    # URL 处理
│   │   └── common.ts     # 通用方法
│   ├── utils/            # 工具类
│   │   └── Result.ts     # Result 类型处理类
│   ├── bom/              # 浏览器对象模型（滚动、全屏、Cookie 等）
│   ├── config/           # 配置常量
│   ├── ipc/              # IPC 通信
│   ├── polling/          # 轮询工具类
│   ├── regex/            # 正则表达式常量
│   ├── storage/          # 本地存储（localStorage/sessionStorage）
│   ├── types/            # TypeScript 类型定义
│   └── ws/               # WebSocket 管理类
├── __tests__/            # 测试文件（与 src 结构对应）
├── tsup.config.ts        # 打包配置
├── package.json          # 项目配置（包含 exports）
├── jest.config.js        # Jest 测试配置
├── commitlint.config.js  # 提交信息规范
├── CLAUDE.md             # 项目指南
└── README.md             # 项目说明
```

## 新增方法完整流程

### 第 1 步：确定方法位置（模块化设计）

**原则：**
- 单一功能的小工具函数 → 主入口（`src/libs/` 下的对应文件）
- 需要多个方法配合的功能 → 新建子模块（`/bom`、`/storage`、`/ws` 等）
- 常量定义 → `/config`
- 正则表达式 → `/regex`

**决策检查清单：**
1. 检查现有模块是否已有类似功能（避免重复，遵循 DRY）
2. 评估是否应该独立为子模块（按需导入考虑）
3. 确认类型定义应该放在 `src/types/index.ts` 还是本地

### 第 2 步：编写代码（TypeScript + 注释）

**代码规范：**

```typescript
/**
 * 函数的简短描述（一句话说明功能）
 *
 * @param param1 - 参数1的描述
 * @param param2 - 参数2的描述（可选参数标注？）
 * @returns 返回值的描述
 *
 * @example
 * ```typescript
 * const result = functionName('test');
 * console.log(result); // 输出结果
 *```
 */
export function functionName(param1: string, param2?: number): ReturnType {
	// 1. 参数校验（如果需要）
	if (!param1) {
		throw new Error('param1 不能为空');
	}

	// 2. 核心逻辑
	const result = param1 + (param2 || 0);

	// 3. 返回结果
	return result;
}
```

**命名规范：**
- 文件名：`kebab-case.ts`（如 `array-kit.ts`）
- 函数名：`camelCase`（如 `formatNumber`）
- 类名：`PascalCase`（如 `WebSocketManager`）
- 常量：`UPPER_SNAKE_CASE`（如 `REGEXP`）
- 类型/接口：`PascalCase`（如 `FileInfo`）

**SSR 兼容：**
涉及浏览器 API 的方法必须做环境判断：

```typescript
export function browserMethod() {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		console.warn('browserMethod: 当前环境不支持');
		return false; // 或返回默认值
	}
	// 浏览器逻辑
}
```

### 第 3 步：更新导出

**如果是主入口方法：**
在 `src/index.ts` 中添加导出：

```typescript
// 在对应分类下添加
export * from '@/libs/xxx-kit';
```

**如果是子模块：**
1. 在子模块的 `index.ts` 中导出
2. 更新 `tsup.config.ts` 的 `modules` 数组
3. 更新 `package.json` 的 `exports` 字段

**示例（新增 storage 模块）：**

`tsup.config.ts`：
```typescript
const modules = [
	// ... 其他模块
	{ entry: "src/storage/index.ts", name: "storage/index" },
] as const;
```

`package.json`：
```json
"exports": {
	"./storage": {
		"types": "./dist/storage/index.d.ts",
		"import": "./dist/storage/index.js",
		"require": "./dist/storage/index.cjs"
	}
}
```

### 第 4 步：编写单元测试

**测试文件位置：** `__tests__/` 目录下与源码对应

**测试规范（基于 Jest）：**

```typescript
/**
 * xxx-kit 单元测试
 */
import { functionToTest } from '@/libs/xxx-kit';

describe('xxx-kit - 模块描述', () => {
	// 每个方法一个 describe 块
	describe('functionName - 函数描述', () => {
		// beforeEach 用于准备测试环境
		beforeEach(() => {
			// mock 数据、全局对象等
		});

		// afterEach 用于清理
		afterEach(() => {
			jest.clearAllMocks();
		});

		it('应该正确处理正常情况', () => {
			const result = functionToTest('input');
			expect(result).toBe('expected');
		});

		it('应该处理边界情况', () => {
			const result = functionToTest('');
			expect(result).toBe(null);
		});

		it('应该在参数不当时抛出错误', () => {
			expect(() => functionToTest(null as any)).toThrow();
		});

		it('应该在服务端环境下安全处理', () => {
			global.window = undefined as any;
			expect(() => functionToTest('test')).not.toThrow();
		});
	});
});
```

**测试覆盖要求：**
- 正常情况测试
- 边界值测试
- 错误处理测试
- SSR 环境兼容性测试（如果涉及浏览器 API）

### 第 5 步：运行测试并确保通过

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- __tests__/libs/xxx-kit

# 查看测试覆盖率
npm run test:coverage
```

**覆盖率要求：**
- 分支覆盖率：≥ 80%
- 函数覆盖率：≥ 80%
- 行覆盖率：≥ 80%
- 语句覆盖率：≥ 80%

### 第 6 步：构建项目

```bash
npm run build
```

**检查清单：**
- ✅ TypeScript 编译无错误
- ✅ 生成了正确的 `.js`、`.cjs`、`.d.ts` 文件
- ✅ 新模块的输出文件在 `dist/` 目录下

### 第 7 步：更新文档

**1. 更新 CLAUDE.md**

在 "项目架构" 部分的 "模块化导出结构" 中添加新模块说明。

**2. 更新 README.md**

在对应的 API 文档部分添加使用示例：

```typescript
### 模块名称 (xxx)

```typescript
import { method1, method2 } from 'l-js-fn/xxx';

// 使用示例
method1('param');
```
```

**3. 如果是新子模块，还需要更新：**
- `README.md` 的 "按需导入子模块" 示例
- `CLAUDE.md` 的 "导入方式" 示例

### 第 8 步：更新 CHANGELOG.md

**在提交代码前，必须更新 CHANGELOG.md 记录变更！**

**更新位置：** 在 `## [Unreleased]` 部分下添加变更记录

**格式规范：**

```markdown
## [Unreleased]

### 新增
- **模块名**: 简要描述新功能（1 句话）
- **模块名**: 新增 `methodName` 方法，功能说明

### 修复
- **模块名**: 修复 `methodName` 的具体 bug 描述

### 变更
- **模块名**: 重要变更说明（如果有 breaking change）
```

**示例：**

```markdown
## [Unreleased]

### 新增
- **数组方法**: 新增 `groupBy` 方法，支持按字段分组对象数组
- **数组方法**: 新增 `sample` 方法，随机取数组中的一个元素
- **encode 模块**: 新增编码/解码模块
  - `base64Encode/base64Decode` - Base64 编码/解码（支持 Unicode）
  - `escapeHTML/unescapeHTML` - HTML 转义/反转义（防 XSS 攻击）

### 修复
- **bom 模块**: 修复 `decodedURIComponent` 拼写错误为 `decodeURIComponent`
```

**注意事项：**
- 使用简洁清晰的语言描述变更
- 新增功能写明模块名和方法名
- Bug 修复写明修复了什么问题
- 如果有 Breaking Change，必须在"变更"部分标注
- 每次发布时，将 `[Unreleased]` 的内容移到对应版本号下

**版本号规则（语义化版本）：**
```
主版本号.次版本号.修订号 (MAJOR.MINOR.PATCH)
例如：3.3.0

版本号递增规则：
- 新增方法、新增模块 → 次版本号 +1（例如：3.2.0 → 3.3.0）
- 只修复 bug、小改动 → 修订号 +1（例如：3.2.0 → 3.2.1）
- 整体结构变化、破坏性变更 → 主版本号 +1（例如：2.0.0 → 3.0.0）

发布新版本时的步骤：
1. 根据 [Unreleased] 的内容判断应该递增哪个版本号
2. 将 [Unreleased] 的内容移到新版本号下（例如：## [3.4.0] - 2026-XX-XX）
3. 更新 package.json 中的 version 字段
4. 提交并打上 git tag
5. 重新创建空的 [Unreleased] 部分用于下次开发
```

### 第 9 步：提交代码

**提交信息规范（遵循 Conventional Commits）：**

```bash
# 新增功能
git commit -m "feat(storage): 新增 localStorage/sessionStorage 封装方法"

# Bug 修复
git commit -m "fix(array-kit): 修复 arrayDelToIndex 索引越界问题"

# 重构
git commit -m "refactor(core): 优化数组操作性能"

# 文档更新
git commit -m "docs(readme): 更新 API 使用示例"
```

**提交类型（type）：**
- `feat`: 新功能
- `fix`: 修复 bug
- `refactor`: 重构
- `docs`: 文档变更
- `style`: 格式调整
- `test`: 增加测试
- `build`: 构建相关
- `chore`: 辅助工具变动
- `ci`: 自动化构建
- `types`: 类型定义

**提交格式：**
```
type(scope): subject

body（可选）

footer（可选）
```

## 代码审查检查清单

在提交前，确保：

### 代码质量
- [ ] 遵循 KISS 原则（保持简单）
- [ ] 遵循 DRY 原则（没有重复代码）
- [ ] 遵循 YAGNI 原则（不过度设计）
- [ ] 遵循 SOLID 原则（特别是单一职责）
- [ ] TypeScript 严格模式下无类型错误

### 注释和文档
- [ ] 所有导出函数都有 JSDoc 注释
- [ ] 注释包含 `@param`、`@returns`、`@example`
- [ ] README.md 有使用示例
- [ ] CLAUDE.md 已更新（如果需要）
- [ ] CHANGELOG.md 已更新（记录本次变更）

### 测试
- [ ] 测试覆盖率 ≥ 80%
- [ ] 所有测试通过
- [ ] 包含边界情况测试
- [ ] 包含错误处理测试

### 构建和配置
- [ ] `tsup.config.ts` 已更新（如果需要）
- [ ] `package.json` 的 `exports` 已更新（如果需要）
- [ ] `npm run build` 成功

### 兼容性
- [ ] 涉及浏览器 API 的方法做了 SSR 兼容判断
- [ ] 旧浏览器兼容性考虑（如 bom 模块）

## 常见问题

### Q1: 应该把方法放在主入口还是子模块？

**判断标准：**
- 小型、常用的工具函数 → 主入口（`src/libs/`）
- 需要多个方法配合的复杂功能 → 子模块
- 不常被用到的功能 → 子模块（支持按需导入）

### Q2: 类型定义应该放在哪？

**位置规则：**
- 仅单个模块使用的类型 → 本地文件中定义
- 跨模块使用的类型 → `src/types/index.ts`

### Q3: 如何处理浏览器 API 的 SSR 兼容？

**标准模式：**
```typescript
if (typeof window === 'undefined') {
	console.warn('methodName: 当前环境不支持');
	return defaultValue; // 或 return false / return null
}
// 浏览器逻辑
```

### Q4: 测试中的 mock 怎么写？

**简单对象 mock：**
```typescript
beforeEach(() => {
	global.localStorage = {
		getItem: jest.fn(),
		setItem: jest.fn(),
		// ...
	} as any;
});
```

**复杂对象 mock（需要 ownKeys）：**
```typescript
const mock = { /* methods */ };
jest.spyOn(Object, 'keys').mockImplementation((obj) => {
	if (obj === global.localStorage) {
		return ['key1', 'key2'];
	}
	return Object.keys(obj);
});
```

## 快速参考

### 新增主入口方法
1. 在 `src/libs/xxx-kit.ts` 添加方法
2. 在 `src/index.ts` 添加导出
3. 在 `__tests__/libs/xxx-kit.test.ts` 添加测试
4. 更新 README.md 和 CLAUDE.md
5. 更新 CHANGELOG.md（记录本次变更）
6. 运行 `npm test` 和 `npm run build`
7. 提交代码

### 新增子模块
1. 创建 `src/xxx/index.ts`
2. 更新 `tsup.config.ts`、`package.json`
3. 创建 `__tests__/xxx/index.test.ts`
4. 更新 README.md 和 CLAUDE.md
5. 更新 CHANGELOG.md（记录本次变更）
6. 运行 `npm test` 和 `npm run build`
7. 提交代码

---

**记住：老王最恨的就是SB代码和不规范的提交！严格按照这个流程来，别tm给老王找麻烦！**
