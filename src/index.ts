// 方法
export * from '@/libs/is-kit.ts';
export * from '@/libs/url-kit.ts';
export * from '@/libs/array-kit.ts';
export * from '@/libs/object-kit.ts';
export * from '@/libs/common.ts';
export * from '@/libs/string-kit.ts';
export * from '@/libs/date-kit.ts';
export * from '@/libs/number-kit.ts';
export * from '@/bom/index.ts';
// 类
export * from '@/utils/Result.ts';
export * from '@/utils/Polling.ts';
export * from '@/utils/WebSocketManager.ts';
export * from '@/utils/ipc/IframeBridge.ts';
export * from '@/utils/ipc/H5Bridge.ts';
// 常量
export * from '@/config/regex.ts';
export * from '@/config/constant.ts';

import * as isKit from '@/libs/is-kit.ts';
import * as urlKit from '@/libs/url-kit.ts';
import * as arrayKit from '@/libs/array-kit.ts';
import * as objectKit from '@/libs/object-kit.ts';
import * as common from '@/libs/common.ts';
import * as numberKit from '@/libs/number-kit.ts';
import * as stringKit from '@/libs/string-kit.ts';
import * as dateKit from '@/libs/date-kit.ts';
import * as bom from '@/bom/index.ts';
import { Result } from '@/utils/Result.ts';
import { Polling } from '@/utils/Polling.ts';
import { IframeBridge } from '@/utils/ipc/IframeBridge.ts';
import { H5Bridge } from '@/utils/ipc/H5Bridge.ts';
import { WebSocketManager } from '@/utils/WebSocketManager.ts';

const L = {
  ...isKit,
  ...urlKit,
  ...arrayKit,
  ...objectKit,
  ...common,
  ...stringKit,
  ...dateKit,
  ...numberKit,
  ...bom,
  Polling,
  Result,
  H5Bridge,
  IframeBridge,
  WebSocketManager,
};

export default L;
