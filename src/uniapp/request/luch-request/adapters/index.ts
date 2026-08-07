// @ts-nocheck
import buildURL from '../helpers/buildURL.ts'
import buildFullPath from '../core/buildFullPath.ts'
import settle from '../core/settle.ts'
import { isUndefined } from '../utils.ts'

/**
 * 返回可选值存在的配置
 * @param {Array} keys - 可选值数组
 * @param {Object} config2 - 配置
 * @return {{}} - 存在的配置项
 */
const mergeKeys = (keys, config2) => {
    const config = {}
    keys.forEach((prop) => {
        if (!isUndefined(config2[prop])) {
            config[prop] = config2[prop]
        }
    })
    return config
}
export default (config) => new Promise((resolve, reject) => {
    const fullPath = buildURL(buildFullPath(config.baseURL, config.url), config.params)
    const _config = {
        url: fullPath,
        header: config.header,
        complete: (response) => {
            config.fullPath = fullPath
            response.config = config
            try {
                // 对可能字符串不是json 的情况容错
                if (typeof response.data === 'string') {
                    response.data = JSON.parse(response.data)
                }
            } catch (e) {
            }
            settle(resolve, reject, response)
        }
    }
    let requestTask
    if (config.method === 'UPLOAD') {
        delete _config.header['content-type']
        delete _config.header['Content-Type']
        const otherConfig = {
            fileType: config.fileType,
            filePath: config.filePath,
            name: config.name
        }
        const optionalKeys = [
            'files',
            'file',
            'timeout',
            'formData'
        ]
        requestTask = uni.uploadFile({ ..._config, ...otherConfig, ...mergeKeys(optionalKeys, config) })
    } else if (config.method === 'DOWNLOAD') {
        if (!isUndefined(config.timeout)) {
            _config.timeout = config.timeout
        }
        requestTask = uni.downloadFile(_config)
    } else {
        const optionalKeys = [
            'data',
            'method',
            'timeout',
            'dataType',
        ]
        // 支付宝不支持 responseType
        if (typeof my === 'undefined') {
            optionalKeys.push('responseType')
        }
        optionalKeys.push('sslVerify', 'withCredentials', 'firstIpv4')
        requestTask = uni.request({ ..._config, ...mergeKeys(optionalKeys, config) })
    }
    if (config.getTask) {
        config.getTask(requestTask, config)
    }
})
