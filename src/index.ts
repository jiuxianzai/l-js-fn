export * from './libs/is-kit';
export * from './libs/url-kit';
export * from './libs/array-kit';
export * from './libs/object-kit';
export * from './libs/polling-kit';
export * from './libs/common';
export * from "./libs/string-kit"

import * as isKit from './libs/is-kit';
import * as urlKit from './libs/url-kit';
import * as arrayKit from './libs/array-kit';
import * as objectKit from './libs/object-kit';
import * as pollingKit from './libs/polling-kit';
import * as common from './libs/common';
import * as stringKit from './libs/string-kit';

const L = {
  ...isKit,
  ...urlKit,
  ...arrayKit,
  ...objectKit,
  ...pollingKit,
  ...common,
  ...stringKit
}

export default L;