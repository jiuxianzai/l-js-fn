# 更新日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/) 规范。

---

## [3.2.0] - 2026-01-28

### 新增
- 新增 `validateParams` 方法，用于校验参数中必填选项是否为空

### 测试
- **完整覆盖**：为所有模块添加完整的单元测试，测试覆盖率从 0% 提升至 80%+
- **新增测试文件**：
  - `__tests__/utils/Result.test.ts` - Result 类测试
  - `__tests__/config/index.test.ts` - 配置常量测试
  - `__tests__/libs/common.test.ts` - 通用工具函数测试
  - `__tests__/bom/index.test.ts` - 浏览器对象模型测试
  - `__tests__/ipc/H5Bridge.test.ts` - H5 桥接测试
  - `__tests__/ipc/IframeBridge.test.ts` - Iframe 桥接测试
  - `__tests__/ws/index.test.ts` - WebSocket 管理器测试
- **测试统计**：16 个测试套件，654 个测试用例全部通过

### 修复
- 修复 `getUniqueRandomIndexes` 方法在特定参数下无限循环的问题
- 修复 `formatNumber` 方法对非数字字符串的处理逻辑
- 修复 `formatNumber` 方法对 Infinity 值的返回结果
- 修复 `formatNumber` 方法负数中文单位的显示问题
- 修复 `toPercent` 方法截断模式的精度问题

---

## [3.1.0] - 2026-01-15

### 新增
- 新增 `syntaxHtmlToJson` 方法，将带语法高亮的 HTML 转换为 JSON 对象或纯字符串

---

## [3.0.1] - 2025-12-20

### 修复
- 开启代码压缩优化，减小包体积

---

## [3.0.0] - 2025-11-10

### 重大变更
- **破坏性变更**：重构导出方式，支持按需导入子模块
- **破坏性变更**：主入口仅导出核心工具函数，子模块需单独导入

### 新增
- 优化拆分主包大小，支持模块化导出（Tree Shaking 优化）
- 新增 `/bom` 子模块 - 浏览器对象模型方法（滚动、全屏、剪贴板）
- 新增 `/config` 子模块 - 配置常量（日期格式、HTTP 状态码）
- 新增 `/ipc` 子模块 - IPC 通信（H5Bridge、IframeBridge）
- 新增 `/polling` 子模块 - 轮询工具类（异步方法定时执行）
- 新增 `/regex` 子模块 - 正则表达式常量（手机号、邮箱、密码等）
- 新增 `/ws` 子模块 - WebSocket 管理类（连接、重连、消息发送）

### 迁移指南
```typescript
// 旧版本（所有方法从主入口导入）
import { scrollTop, isArray } from 'l-js-fn';

// 新版本（按需导入子模块）
import { scrollTop } from 'l-js-fn/bom';
import { isArray } from 'l-js-fn';
```

---

## [2.2.0] - 2024-12-05

### 新增
- 新增 `arrayDelToIndex` 方法 - 根据索引删除数组元素
- 新增 `arrayDelToEl` 方法 - 根据基本类型元素删除数组元素
- 新增 `arrayDelToKey` 方法 - 根据对象数组的键值对删除元素

---

## [2.1.0] - 2024-11-20

### 新增
- 新增 `filterSpace` 方法 - 禁止输入空格
- 新增 `searchTextColor` 方法 - 匹配文字变色（搜索时高亮）

---

## [2.0.0] - 2024-10-15

### 重大变更
- **破坏性变更**：保留按需导出，取消全量导出
- 优化包体积，减少不必要的代码打包

---

## [1.8.0] - 2024-09-01

### 新增
- 新增 `moveElement` 方法 - 数组元素移动（上移、下移、置顶、置底）

---

## [1.7.0] - 2024-08-10

### 新增
- 新增 `getUniqueRandomIndexes` 方法 - 生成指定数量的不重复随机索引

---

## [1.6.0] - 2024-07-20

### 修复
- 误操作重复更新问题

---

## [1.5.0] - 2024-06-15

### 新增
- 新增 `copyToClipboard` 方法 - 复制文本到剪贴板
- 新增 `scrollToBottom` 方法 - 滚动到底部
- 新增 `MONEY` 正则 - 金额验证（支持两位小数）
- 新增 `imageToBase64` 方法 - 图片转 Base64

---

## [1.4.0] - 2024-05-20

### 新增
- 新增 `dateFormat` 方法支持默认当前时间参数
- 新增 `getTimeDiff` 方法 - 计算两个时间的间隔（毫秒）

---

## [1.3.2] - 2024-04-10

### 修复
- 修复 package.json 声明类型问题

---

## [1.3.1] - 2024-03-25

### 变更
- 新增 `indexToLabel` 参数类型定义

---

## [1.3.0] - 2024-03-10

### 新增
- 新增 `indexToLabel` 方法 - 根据数组索引生成序号标识（支持大写、小写、数字、中文）

---

## [1.2.0] - 2024-02-15

### 新增
- 新增正则表达式：整数、正整数
- 新增 `isHasProperties` 方法 - 判断对象是否存在属性
- 新增 `scrollTop` 方法 - 平滑滚动到顶部
- 新增 `getScrollPosition` 方法 - 获取当前页面滚动位置
- 新增 `setScrollPosition` 方法 - 设置页面滚动位置
- 新增 `formDataToObject` 方法 - FormData 转 JSON
- 新增 `launchFullscreen` 方法 - 进入全屏
- 新增 `exitFullscreen` 方法 - 退出全屏

---

## [1.1.2] - 2024-01-20

### 修复
- 修复 `dateFormat` 时间戳超出位数误判成秒级的问题

---

## [1.1.1] - 2024-01-10

### 修复
- 修复 package.json 默认导出文件及类型声明

---

## [1.1.0] - 2023-12-25

### 新增
- 新增 `removeScript` 方法 - 移除已加载的 script 标签

---

## [1.0.13] - 2023-12-10

### 修复
- 修复 `dateFormat` 兼容性问题（环境、设备）

---

## [1.0.12] - 2023-11-25

### 新增
- 新增 IPC `destroy` 方法 - 销毁清理资源

### 修复
- 删除 IPC-getUuid 方法冗余
- 修复 `dateFormat` 在 iOS 下解析警告和错误

---

## [1.0.11] - 2023-11-10

### 新增
- 新增 IPC 通讯类（H5Bridge、IframeBridge）
- 新增 `FileInfo` TypeScript 类型定义

---

## [1.0.10] - 2023-10-25

### 新增
- 新增 `formatNumber` 方法 - 数字格式化（千分位、中文单位）
- 新增 `diffDays` 方法 - 计算两个日期之间相差的天数

---

## [1.0.9] - 2023-10-10

### 新增
- 新增 `loadResource` 方法（后续版本已移除）

---

## [1.0.0] - 2022-09-01

### 新增
- 初始版本发布
- 基础工具函数集合（数组、对象、字符串、日期、数字处理等）

---

## 版本说明

本项目的版本号遵循 [语义化版本 2.0.0](https://semver.org/lang/zh-CN/) 规范：

- **主版本号（Major）**：不兼容的 API 变更
- **次版本号（Minor）**：向下兼容的新增功能
- **修订号（Patch）**：向下兼容的问题修复

### 变更类型说明
- **新增（Added）**：新功能
- **变更（Changed）**：现有功能的变更
- **废弃（Deprecated）**：即将移除的功能
- **移除（Removed）**：已移除的功能
- **修复（Fixed）**：问题修复
- **安全（Security）**：安全性修复
