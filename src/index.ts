// 方法
export * from './libs/is-kit';
export * from './libs/url-kit';
export * from './libs/array-kit';
export * from './libs/object-kit';
export * from './libs/common';
export * from './libs/string-kit';
export * from './libs/date-kit';
// 类
export * from './utils/Result';
export * from './utils/Polling';
// 常量
export * from './config/regex';
export * from './config/constant';

import * as isKit from './libs/is-kit';
import * as urlKit from './libs/url-kit';
import * as arrayKit from './libs/array-kit';
import * as objectKit from './libs/object-kit';
import * as common from './libs/common';
import * as stringKit from './libs/string-kit';
import * as dateKit from './libs/date-kit';
import { Result } from './utils/Result';
import { Polling } from './utils/Polling';

const L = {
  ...isKit,
  ...urlKit,
  ...arrayKit,
  ...objectKit,
  ...common,
  ...stringKit,
  ...dateKit,
  Polling,
  Result,
};

export default L;
