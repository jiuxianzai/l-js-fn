/**
 * ipc 模块 —— 跨窗口通信
 * @remark 依赖浏览器 window.postMessage / MessageChannel，仅能在浏览器环境（iframe/H5）运行。
 */
export * from "@/ipc/H5Bridge"
export * from "@/ipc/IframeBridge"