// @ts-nocheck
'use strict'

import { transUrlParams } from '@/libs/url-kit.ts'
import * as utils from '../utils.ts'

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
export default function buildURL(url, params) {
    /* eslint no-param-reassign:0 */
    if (!params) {
        return url
    }

    let serializedParams
    if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString()
    } else {
        // Date 对象无可枚举键，提前转 ISO 字符串避免被 transUrlParams 当作空对象丢弃
        Object.keys(params).forEach((key) => {
            if (utils.isDate(params[key])) {
                params[key] = params[key].toISOString()
            }
        })
        serializedParams = transUrlParams(params)
    }

    if (serializedParams) {
        const hashmarkIndex = url.indexOf('#')
        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex)
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
    }

    return url
}
