import { defineConfig } from 'vitepress'

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
			{ text: '指南', link: '/guide/is-kit' },
			{ text: 'GitHub', link: 'https://github.com/jiuxianzai/l-js-fn' },
		],

		sidebar: [
			{
				text: '主包工具函数',
				items: [
					{ text: '类型判断', link: '/guide/is-kit' },
					{ text: '数组操作', link: '/guide/array-kit' },
					{ text: '字符串处理', link: '/guide/string-kit' },
					{ text: '对象操作', link: '/guide/object-kit' },
					{ text: '通用工具', link: '/guide/common' },
					{ text: '日期处理', link: '/guide/date-kit' },
					{ text: '数字处理', link: '/guide/number-kit' },
					{ text: 'URL 处理', link: '/guide/url-kit' },
					{ text: '颜色处理', link: '/guide/color' },
					{ text: '结果类', link: '/guide/result' },
				],
			},
			{
				text: '子模块',
				items: [
					{ text: '浏览器对象模型', link: '/guide/bom' },
					{ text: 'WebSocket', link: '/guide/ws' },
					{ text: '本地存储', link: '/guide/storage' },
					{ text: '轮询工具', link: '/guide/polling' },
					{ text: 'IPC 通信', link: '/guide/ipc' },
					{ text: '正则常量', link: '/guide/regex' },
					{ text: '配置常量', link: '/guide/config' },
					{ text: '编码解码', link: '/guide/encode' },
					{ text: '事件总线', link: '/guide/event-bus' },
					{ text: '文件处理', link: '/guide/file' },
				],
			},
		],

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
		},

		returnToTopLabel: '回到顶部',
		sidebarMenuLabel: '菜单',
	},
})
