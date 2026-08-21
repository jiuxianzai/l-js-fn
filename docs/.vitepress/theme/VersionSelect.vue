<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import { versions } from '../versions'

interface VersionItem {
	text: string
	/** 目录前缀，最新版为空字符串（顶层） */
	path: string
	/** 是否最新版本 */
	latest?: boolean
}

const { page } = useData()
const router = useRouter()
const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const currentVersion = computed<VersionItem>(() => {
	const rel = page.value.relativePath
	for (const v of versions) {
		if (v.path && rel.startsWith(`${v.path}/`)) return v
	}
	return versions[0]
})

function targetHref(v: VersionItem) {
	const current = currentVersion.value
	if (v.minimal) {
		return withBase(v.home || `/${v.path}/guide/`)
	}
	// 当前处于精简归档版（如 v2 只有概览页），目标最新版没有对应页面，回退到其 home
	if (current.minimal) {
		return withBase(v.home || '/guide/')
	}
	const rel = page.value.relativePath.replace(/\.md$/, '')
	const stripped = current.path && rel.startsWith(`${current.path}/`) ? rel.slice(current.path.length + 1) : rel
	const target = v.path ? `/${v.path}/${stripped}` : `/${stripped}`
	return withBase(`${target}.html`)
}

function switchTo(v: VersionItem) {
	if (v.path === currentVersion.value.path) {
		open.value = false
		return
	}
	router.go(targetHref(v))
	open.value = false
}

function onClickOutside(event: MouseEvent) {
	if (rootEl.value && !rootEl.value.contains(event.target as Node)) {
		open.value = false
	}
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape') open.value = false
}

onMounted(() => {
	document.addEventListener('click', onClickOutside)
	document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
	document.removeEventListener('click', onClickOutside)
	document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
	<div ref="rootEl" class="version-select">
		<button type="button" class="version-select__button" aria-haspopup="listbox" :aria-expanded="open" @click="open = !open">
			<span class="version-select__text">{{ currentVersion.text }}</span>
			<span v-if="currentVersion.latest" class="version-select__tag">最新</span>
			<span class="version-select__arrow" :class="{ 'is-open': open }"></span>
		</button>

		<Transition name="version-select">
			<ul v-if="open" class="version-select__menu" role="listbox" :aria-label="`文档版本（当前：${currentVersion.text}）`">
				<li
					v-for="v in versions"
					:key="v.path"
					role="option"
					:aria-selected="v.path === currentVersion.path"
					class="version-select__item"
					:class="{ 'is-active': v.path === currentVersion.path }"
					@click="switchTo(v)"
				>
					<span>{{ v.text }}</span>
					<span v-if="v.latest" class="version-select__tag">最新</span>
				</li>
			</ul>
		</Transition>
	</div>
</template>

<style scoped>
.version-select {
	position: relative;
	display: flex;
	align-items: center;
	margin-right: 8px;
}

.version-select__button {
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 5px 12px;
	border: 1px solid var(--vp-c-divider);
	border-radius: 8px;
	background-color: var(--vp-c-bg-soft);
	color: var(--vp-c-text-1);
	font-size: 13px;
	font-weight: 500;
	line-height: 24px;
	cursor: pointer;
	transition: border-color 0.2s ease, background-color 0.2s ease;
}

.version-select__button:hover {
	border-color: var(--vp-c-brand-1);
	background-color: var(--vp-c-brand-soft);
}

.version-select__tag {
	padding: 1px 8px;
	border-radius: 20px;
	background: linear-gradient(135deg, #c88a00, #e0a800);
	color: #fff;
	font-size: 10px;
	font-weight: 600;
	letter-spacing: 0.5px;
}

.dark .version-select__tag {
	background: linear-gradient(135deg, #e0a800, #fee89a);
	color: #3a2b00;
}

.version-select__arrow {
	width: 7px;
	height: 7px;
	border-right: 2px solid var(--vp-c-text-3);
	border-bottom: 2px solid var(--vp-c-text-3);
	transform: rotate(45deg) translateY(-2px);
	transition: transform 0.2s ease;
}

.version-select__arrow.is-open {
	transform: rotate(-135deg) translateY(-2px);
}

.version-select__menu {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	min-width: 120px;
	margin: 0;
	padding: 6px;
	list-style: none;
	border: 1px solid var(--vp-c-divider);
	border-radius: 10px;
	background-color: var(--vp-c-bg-elv);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	z-index: 30;
}

.version-select__item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 6px 12px;
	border-radius: 6px;
	font-size: 13px;
	color: var(--vp-c-text-1);
	cursor: pointer;
	transition: background-color 0.2s ease, color 0.2s ease;
}

.version-select__item:hover {
	background-color: var(--vp-c-brand-soft);
	color: var(--vp-c-brand-1);
}

.version-select__item.is-active {
	color: var(--vp-c-brand-1);
	font-weight: 600;
}

.version-select-enter-active,
.version-select-leave-active {
	transition: opacity 0.15s ease, transform 0.15s ease;
}

.version-select-enter-from,
.version-select-leave-to {
	opacity: 0;
	transform: translateY(-4px);
}
</style>
