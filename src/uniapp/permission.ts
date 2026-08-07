import { getAdapter } from '@/uniapp/base.ts';

/** 功能 → scope 映射 */
const SCOPE_MAP: Record<string, string> = {
	camera: 'scope.camera',
	album: 'scope.writePhotosAlbum',
	location: 'scope.userLocation',
	microphone: 'scope.record',
};

class Permission {
	private get adapter() {
		return getAdapter();
	}

	/**
	 * 统一授权流程：
	 * 1. 先检查是否已授权（getSetting）
	 * 2. 未授权时请求授权（authorize）
	 * 3. 授权失败（此前被拒）时引导打开设置页（openSetting，仅微信支持）
	 */
	private async checkAndRequest(scope: string): Promise<boolean> {
		const adapter = this.adapter;

		const alreadyGranted = await adapter.checkPermission(scope);
		if (alreadyGranted) return true;

		const authorized = await adapter.requestPermission(scope);
		if (authorized) return true;

		if (adapter.openSetting) {
			return adapter.openSetting();
		}
		return false;
	}

	/**
	 * 检查摄像头权限
	 * @returns 是否有摄像头权限
	 * @example
	 * const has = await permission.camera()
	 */
	camera(): Promise<boolean> {
		return this.checkAndRequest(SCOPE_MAP.camera);
	}

	/**
	 * 检查相册权限
	 * @returns 是否有相册权限
	 * @example
	 * const has = await permission.album()
	 */
	album(): Promise<boolean> {
		return this.checkAndRequest(SCOPE_MAP.album);
	}

	/**
	 * 检查位置权限
	 * @returns 是否有位置权限
	 * @example
	 * const has = await permission.location()
	 */
	location(): Promise<boolean> {
		return this.checkAndRequest(SCOPE_MAP.location);
	}

	/**
	 * 检查录音权限
	 * @returns 是否有录音权限
	 * @example
	 * const has = await permission.microphone()
	 */
	microphone(): Promise<boolean> {
		return this.checkAndRequest(SCOPE_MAP.microphone);
	}

	/**
	 * 通用授权请求
	 * @param scope - scope 值，如 'scope.camera'
	 * @returns 是否授权成功
	 * @example
	 * const ok = await permission.authorize('scope.camera')
	 */
	authorize(scope: string): Promise<boolean> {
		return this.checkAndRequest(scope);
	}
}

let permission = new Permission();

export { permission };
