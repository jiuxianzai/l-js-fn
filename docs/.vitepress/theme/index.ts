import DefaultTheme from 'vitepress/theme'
import VersionSelect from './VersionSelect.vue'
import './custom.css'

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component('VersionSelect', VersionSelect)
	},
}
