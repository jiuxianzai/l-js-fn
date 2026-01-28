# 示例代码

本目录包含 `l-js-fn` 的各种使用示例，帮助你快速上手。

## 📁 示例列表

### [basic-usage.ts](./basic-usage.ts)
**基础用法示例**

演示主包中常用的工具函数：
- 类型判断（isEmpty、isEmail、isPhoneNumber 等）
- 数组操作（arrayDelEl、arrayUnique、arrayPaginate 等）
- 字符串处理（desensitization、trim、getUuid 等）
- 对象操作（objMerge、objFilterNull 等）
- 日期处理（dateFormat、formatPassTime 等）
- 数字处理（formatNumber、toPercent 等）
- URL 处理（getUrlParams、appendUrlParam 等）
- 通用工具（debounce、throttle、deepClone 等）

**适用场景**：新手入门、了解项目功能

---

### [bom-usage.ts](./bom-usage.ts)
**浏览器对象模型 (BOM) 使用示例**

演示浏览器相关的方法：
- 滚动控制（scrollTop、scrollToBottom、getScrollPosition、setScrollPosition）
- 全屏控制（launchFullscreen、exitFullscreen）
- 剪贴板操作（copyToClipboard）

**实际应用示例**：
- 返回顶部按钮
- 阅读进度保存和恢复
- 图片全屏查看器
- 一键复制功能

**适用场景**：浏览器环境开发、需要操作浏览器 API

---

### [websocket-usage.ts](./websocket-usage.ts)
**WebSocket 管理示例**

演示如何使用 `WebSocketManager` 类：
- 创建 WebSocket 连接
- 发送消息（文本、JSON 对象）
- 处理收到的消息
- 错误处理
- 定时发送心跳
- 重新连接机制

**实际应用示例**：
- 完整的聊天室实现

**适用场景**：实时通信、在线聊天、数据推送

---

### [polling-usage.ts](./polling-usage.ts)
**轮询工具使用示例**

演示如何使用 `Polling` 类进行定时轮询：
- 基础轮询用法
- 启动/停止轮询
- 检查轮询状态

**实际应用示例**：
- 检查任务状态
- 获取通知
- 健康检查
- 处理队列任务

**适用场景**：定时任务、状态轮询、队列处理

---

### [regex-usage.ts](./regex-usage.ts)
**正则表达式使用示例**

演示如何使用 `REGEXP` 常量：
- 手机号验证（REGEXP.PHONE）
- 座机号验证（REGEXP.LAND_LINE）
- 邮箱验证（REGEXP.EMAIL）
- 密码强度验证（REGEXP.PASSWORD）
- URL 验证（REGEXP.URL）
- 身份证验证（REGEXP.ID_CARD）
- 内容类型验证（中文、英文、数字等）
- 金额验证（REGEXP.MONEY）

**实际应用示例**：
- 表单验证类（FormValidator）

**适用场景**：表单验证、数据校验、输入过滤

---

## 🚀 如何运行示例

### 方法1: 直接在浏览器中使用

如果你使用的是打包工具（如 Vite、Webpack），可以直接导入：

```typescript
import { isArray, dateFormat } from 'l-js-fn';
import { scrollTop } from 'l-js-fn/bom';
import { Polling } from 'l-js-fn/polling';
```

### 方法2: 使用 Deno 运行

```bash
deno run --allow-net --allow-read examples/basic-usage.ts
```

### 方法3: 使用 ts-node 运行

```bash
# 安装 ts-node
npm install -g ts-node

# 运行示例
ts-node examples/basic-usage.ts
```

### 方法4: 复制代码到项目中

直接复制示例代码到你的项目中，根据需要进行修改。

---

## 📝 注意事项

1. **浏览器环境示例**
   - `bom-usage.ts` 中的方法只能在浏览器环境中使用
   - 如果在 Node.js 环境中运行会报错

2. **类型定义**
   - 所有示例都是用 TypeScript 编写的
   - 如果你使用 JavaScript，可以去掉类型注解

3. **依赖安装**
   - 确保已安装 `l-js-fn`：`npm install l-js-fn`

---

## 🤝 贡献示例

欢迎贡献更多示例！

如果你想添加新的示例，请：

1. 在 `examples/` 目录下创建新文件
2. 使用清晰的文件名（如 `your-example.ts`）
3. 添加详细的注释和说明
4. 更新本 README.md 文件
5. 提交 Pull Request

---

## 📚 更多资源

- [主 README](../README.md) - 项目主文档
- [API 文档](../README.md#-api-文档) - 完整的 API 文档
- [贡献指南](../CONTRIBUTING.md) - 如何贡献代码
- [更新日志](../CHANGELOG.md) - 版本变更记录

---

**祝你使用愉快！** 🎉
