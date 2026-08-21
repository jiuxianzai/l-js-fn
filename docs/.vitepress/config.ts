import { defineConfig } from 'vitepress'
import { versions } from './versions'

function buildSidebar(prefix: string) {
	const p = (link: string) => (prefix ? `${prefix}${link}` : link)
	return [
		{
			text: '主包工具函数',
			items: [
				{ text: '类型判断', link: p('/guide/is-kit') },
				{ text: '数组操作', link: p('/guide/array-kit') },
				{ text: '字符串处理', link: p('/guide/string-kit') },
				{ text: '对象操作', link: p('/guide/object-kit') },
				{ text: '通用工具', link: p('/guide/common') },
				{ text: '日期处理', link: p('/guide/date-kit') },
				{ text: '数字处理', link: p('/guide/number-kit') },
				{ text: 'URL 处理', link: p('/guide/url-kit') },
				{ text: '颜色处理', link: p('/guide/color') },
			],
		},
		{
			text: '子模块',
			items: [
				{ text: '浏览器对象模型', link: p('/guide/bom') },
				{ text: 'WebSocket', link: p('/guide/ws') },
				{ text: '本地存储', link: p('/guide/storage') },
				{ text: '轮询工具', link: p('/guide/polling') },
				{ text: 'IPC 通信', link: p('/guide/ipc') },
				{ text: '正则常量', link: p('/guide/regex') },
				{ text: '配置常量', link: p('/guide/config') },
				{ text: '编码解码', link: p('/guide/encode') },
				{ text: '事件总线', link: p('/guide/event-bus') },
				{ text: '文件处理', link: p('/guide/file') },
				{ text: '加密模块', link: p('/guide/crypto') },
			],
		},
		{
			text: 'uniapp 小程序工具集',
			items: [
				{ text: '基础功能 (API)', link: p('/guide/uniapp') },
				{ text: '文件系统 (File)', link: p('/guide/uniapp-file') },
				{ text: '剪贴板 (Clipboard)', link: p('/guide/uniapp-clipboard') },
				{ text: '设备适配 (Device)', link: p('/guide/uniapp-device') },
				{ text: '网络状态 (Network)', link: p('/guide/uniapp-network') },
				{ text: '网络请求 (Request)', link: p('/guide/uniapp-request') },
			],
		},
		{
			text: '版本迁移',
			items: [
				{ text: '迁移指南', link: p('/guide/breaking-changes') },
				{ text: '更新日志', link: p('/guide/changelog') },
			],
		},
	]
}

/**
 * 历史完整归档版的专属侧边栏：
 * 顶部为「vX.x 归档」分组（版本概览入口），下方保留完整指南分组。
 */
function buildArchiveSidebar(versionText: string, prefix: string) {
	const p = (link: string) => `${prefix}${link}`
	return [
		{
			text: `${versionText} 归档`,
			items: [{ text: '版本概览', link: `${prefix}/` }],
		},
		...buildSidebar('').map((group) => ({
			...group,
			items: group.items.map((item) => ({ ...item, link: p(item.link) })),
		})),
	]
}

export default defineConfig({
	lang: 'zh-CN',
	title: 'l-js-fn',
	description: '轻量级 JavaScript 工具函数库，支持模块化导入和 Tree-shaking',
	base: '/l-js-fn/',
	lastUpdated: {
		text: '最后更新于',
		formatOptions: {
			dateStyle: 'short',
			timeStyle: 'short',
		},
	},

	head: [
		['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
		['meta', { name: 'theme-color', content: '#FEEB9F' }],
		['meta', { name: 'og:type', content: 'website' }],
		['meta', { name: 'og:locale', content: 'zh-CN' }],
		['meta', { name: 'og:site_name', content: 'l-js-fn' }],
	],

	markdown: {
		theme: {
			light: 'github-light',
			dark: 'github-dark',
		},
	},

	themeConfig: {
		logo: '/logo.svg',
		nav: [
			{ component: 'VersionSelect' },
			{ text: '指南', link: '/guide/is-kit' },
			{ text: '迁移指南', link: '/guide/breaking-changes' },
			{ text: '更新日志', link: '/guide/changelog' },
		],

		sidebar: Object.fromEntries(
			versions.map((v) => {
				const prefix = v.path ? `/${v.path}` : ''
				const dir = v.path ? `/${v.path}/guide/` : '/guide/'
				if (v.minimal) {
					return [
						dir,
						[
							{
								text: `${v.text} 归档`,
								items: [{ text: '版本概览', link: `${prefix}/guide/` }],
							},
						],
					]
				}
				if (v.path) {
					// 历史完整归档版：专属归档侧边栏（归档概览 + 完整指南），覆盖整个 /vX/ 目录（含首页 /vX/）
					return [prefix + '/', buildArchiveSidebar(v.text, prefix)]
				}
				return [dir, { items: buildSidebar('') }]
			}),
		),

		editLink: {
			pattern: 'https://github.com/jiuxianzai/l-js-fn/edit/main/docs/:path',
			text: '在 GitHub 上编辑此页',
		},

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/jiuxianzai/l-js-fn' },
		],

		footer: {
			message: '基于 ISC 许可证发布。',
			copyright: '版权所有 © 2024-present jiuxianzai',
		},

		search: {
			provider: 'local',
		},

		docFooter: {
			prev: '上一页',
			next: '下一页',
		},

		outline: {
			label: '页面导航',
			level: [2, 3],
		},

		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
	},
})
