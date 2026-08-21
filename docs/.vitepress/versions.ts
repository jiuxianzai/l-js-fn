export interface VersionItem {
	text: string
	/** 目录前缀，最新版为空字符串（顶层） */
	path: string
	/** 是否最新版本 */
	latest?: boolean
	/** 是否精简归档（无完整文档，仅归档说明页） */
	minimal?: boolean
	/** 该版本的默认落地页（切换版本时目标页面不存在时的回退页） */
	home?: string
}

/**
 * 文档版本列表（最新版在顶层 /guide/，历史大版本归档到 /v{path}/guide/）。
 *
 * 发新版流程（以从 v3 升到 v4 为例）：
 * 1. 将 docs/guide/ 下内容整体移动到 docs/v3/guide/
 * 2. 在 versions 数组最前插入 `{ text: 'v4.x', path: '', latest: true }`
 * 3. 将旧的最新项改为 `{ text: 'v3.x', path: 'v3' }`
 * 4. 在 docs/guide/ 下编写 v4 文档
 */
export const versions: VersionItem[] = [
	{ text: 'v3.x', path: '', latest: true, home: '/guide/is-kit' },
	{ text: 'v2.x', path: 'v2', minimal: true, home: '/v2/guide/' },
]
