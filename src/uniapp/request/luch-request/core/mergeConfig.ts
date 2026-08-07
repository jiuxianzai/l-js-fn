// @ts-nocheck
import { deepMerge, isUndefined } from '../utils.ts'

/**
 * 合并局部配置优先的配置，如果局部有该配置项则用局部，如果全局有该配置项则用全局
 * @param {Array} keys - 配置项
 * @param {Object} globalsConfig - 当前的全局配置
 * @param {Object} config2 - 局部配置
 * @return {{}}
 */
const mergeKeys = (keys, globalsConfig, config2) => {
    const config = {}
    keys.forEach((prop) => {
        if (!isUndefined(config2[prop])) {
            config[prop] = config2[prop]
        } else if (!isUndefined(globalsConfig[prop])) {
            config[prop] = globalsConfig[prop]
        }
    })
    return config
}
/**
 *
 * @param globalsConfig - 当前实例的全局配置
 * @param config2 - 当前的局部配置
 * @return - 合并后的配置
 */
export default (globalsConfig, config2 = {}) => {
    const method = config2.method || globalsConfig.method || 'GET'
    let config = {
        baseURL: globalsConfig.baseURL || '',
        method,
        url: config2.url || '',
        params: config2.params || {},
        custom: { ...(globalsConfig.custom || {}), ...(config2.custom || {}) },
        header: deepMerge(globalsConfig.header || {}, config2.header || {})
    }
    const defaultToConfig2Keys = ['getTask', 'validateStatus']
    config = { ...config, ...mergeKeys(defaultToConfig2Keys, globalsConfig, config2) }

    if (method === 'DOWNLOAD') {
        if (!isUndefined(config2.timeout)) {
            config.timeout = config2.timeout
        } else if (!isUndefined(globalsConfig.timeout)) {
            config.timeout = globalsConfig.timeout
        }
    } else if (method === 'UPLOAD') {
        delete config.header['content-type']
        delete config.header['Content-Type']
        const uploadKeys = [
            'files',
            'fileType',
            'file',
            'filePath',
            'name',
            'timeout',
            'formData'
        ]
        uploadKeys.forEach((prop) => {
            if (!isUndefined(config2[prop])) {
                config[prop] = config2[prop]
            }
        })
        if (isUndefined(config.timeout) && !isUndefined(globalsConfig.timeout)) {
            config.timeout = globalsConfig.timeout
        }
    } else {
        const defaultsKeys = [
            'data',
            'timeout',
            'dataType',
            'responseType',
            'sslVerify',
            'withCredentials',
            'firstIpv4'
        ]
        config = { ...config, ...mergeKeys(defaultsKeys, globalsConfig, config2) }
    }

    return config
}
