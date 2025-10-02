/**
 * 加载外部资源
 * @param name - 资源路径
 * @param type - 资源类型
 * @param fun - 回调函数
 */
/**
 * 加载外部资源
 * @param name - 资源路径
 * @param type - 资源类型
 */
export const loadResource = (name: string, type: "css" | "js" = "js"): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Not running in browser environment."));
  }

  return new Promise((resolve, reject) => {
    // 避免重复加载
    const tag = type === "js" ? "script" : "link";
    const attr = type === "js" ? "src" : "href";
    const exist = document.querySelector(`${tag}[${attr}="${name}"]`);
    if (exist) {
      resolve();
      return;
    }

    let ref: HTMLScriptElement | HTMLLinkElement;

    if (type === "js") {
      ref = document.createElement("script");
      ref.type = "text/javascript";
      ref.src = name;
    } else {
      ref = document.createElement("link");
      ref.type = "text/css";
      ref.rel = "stylesheet";
      ref.href = name;
    }

    ref.onload = () => resolve();
    ref.onerror = () => reject(new Error(`Failed to load ${type}: ${name}`));

    document.head.appendChild(ref);
  });
};
