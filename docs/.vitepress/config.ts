import { defineConfig } from 'vitepress'

export default defineConfig({
	lang: 'zh-CN',
	title: 'l-js-fn',
	description: '轻量级 JavaScript 工具函数库，支持模块化导入和 Tree-shaking',
	base: '/',
	lastUpdated: true,

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
					{ text: 'is-kit — 类型判断', link: '/guide/is-kit' },
					{ text: 'array-kit — 数组操作', link: '/guide/array-kit' },
					{ text: 'string-kit — 字符串处理', link: '/guide/string-kit' },
					{ text: 'object-kit — 对象操作', link: '/guide/object-kit' },
					{ text: 'common — 通用工具', link: '/guide/common' },
					{ text: 'date-kit — 日期处理', link: '/guide/date-kit' },
					{ text: 'number-kit — 数字处理', link: '/guide/number-kit' },
					{ text: 'url-kit — URL 处理', link: '/guide/url-kit' },
					{ text: 'color — 颜色处理', link: '/guide/color' },
					{ text: 'Result — 结果类', link: '/guide/result' },
				],
			},
			{
				text: '子模块',
				items: [
					{ text: 'bom — 浏览器对象模型', link: '/guide/bom' },
					{ text: 'ws — WebSocket', link: '/guide/ws' },
					{ text: 'storage — 本地存储', link: '/guide/storage' },
					{ text: 'polling — 轮询工具', link: '/guide/polling' },
					{ text: 'ipc — IPC 通信', link: '/guide/ipc' },
					{ text: 'regex — 正则常量', link: '/guide/regex' },
					{ text: 'config — 配置常量', link: '/guide/config' },
					{ text: 'encode — 编码解码', link: '/guide/encode' },
					{ text: 'file — 文件处理', link: '/guide/file' },
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
			message: 'Released under the ISC License.',
			copyright: 'Copyright © 2024-present jiuxianzai',
		},

		search: {
			provider: 'local',
		},
	},
})
