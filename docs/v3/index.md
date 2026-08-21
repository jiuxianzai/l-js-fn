# l-js-fn v3.x 文档归档

> [!WARNING]
> 本页面为 **v3.x** 历史版本文档归档，该版本已停止维护，仅作存档参考。建议升级到最新版本，如需了解 v4 的破坏性变更，请查看[迁移指南](/guide/breaking-changes)。

## 版本概览

v3.x 是引入**分包模块化**后的版本线，所有函数改为按需导入，全面支持 Tree-shaking，并新增了子模块入口（`bom`、`ws`、`storage`、`polling`、`ipc`、`encode`、`file`、`event-bus`、`crypto`、`uniapp` 等）。

## 安装

```bash
npm install l-js-fn@3
```

## 模块列表

| 模块 | 说明 |
| --- | --- |
| [is-kit](/v3/guide/is-kit) | 类型判断（空值、数组、邮箱、身份证、手机号等） |
| [array-kit](/v3/guide/array-kit) | 数组操作（增删改查、分页、分组、随机抽样等） |
| [string-kit](/v3/guide/string-kit) | 字符串处理（脱敏、去除空格、UUID、序号生成等） |
| [object-kit](/v3/guide/object-kit) | 对象操作（合并、过滤、FormData 转换等） |
| [common](/v3/guide/common) | 通用工具（防抖、节流、深拷贝、设备检测等） |
| [date-kit](/v3/guide/date-kit) | 日期处理（格式化、计算、相对时间等） |
| [number-kit](/v3/guide/number-kit) | 数字处理（格式化、百分比、随机数等） |
| [url-kit](/v3/guide/url-kit) | URL 处理（参数解析、拼接、转换等） |
| [color](/v3/guide/color) | 颜色处理（HEX/HSL 转换等） |
| [Result](/v3/guide/result) | 结果类（v4 已移除） |
| [encode](/v3/guide/encode) | 编码解码（Base64、HTML 转义、URL 编码等） |
| [crypto](/v3/guide/crypto) | 加密模块（MD5、AES、RSA、SM2、SM4 等） |
| [uniapp](/v3/guide/uniapp) | 小程序工具集 |

## 与 v4.x 的主要差异

| 能力 | v3.x | v4.x |
| --- | --- | --- |
| 命名规范 | 混合命名（`groupBy`/`pick`/`diffDays` 等） | 统一前缀（`arrayXxx`/`objXxx`/`dateXxx`） |
| 数组删除 | 4 个 `arrayDelXxx` | 合并为 `arrayRemove`/`arrayRemoveAt`/`arrayRemoveBy` |
| 对象合并 | `objMerge`（破坏性）+ `deepMerge` | 统一为 `objMerge`（非破坏性） |
| 查询字符串 | `querystringify`/`parseQueryString` | 统一到 `transUrlParams`/`getUrlParams` |
| Result 类 | 存在 | 已移除 |

> [!TIP]
> v3 → v4 的完整迁移对照表请查看[迁移指南](/guide/breaking-changes)。
