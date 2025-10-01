export * from './libs/is-kit';
export * from './libs/url-kit';
export * from './libs/array-kit';
export * from './libs/object-kit';
export * from './libs/polling-kit';
export * from './libs/common';
export * from './libs/string-kit';
export * from './libs/date-kit';
export * from './utils/Result';
export * from './config/regex';
export * from './config/constant';

import * as isKit from './libs/is-kit';
import * as urlKit from './libs/url-kit';
import * as arrayKit from './libs/array-kit';
import * as objectKit from './libs/object-kit';
import * as polling from './libs/polling-kit';
import * as common from './libs/common';
import * as stringKit from './libs/string-kit';
import * as dateKit from './libs/date-kit';
import { Result } from './utils/Result';

const L = {
  ...isKit,
  ...urlKit,
  ...arrayKit,
  ...objectKit,
  ...common,
  ...stringKit,
  ...dateKit,
  polling,
  Result,
};

export default L;
