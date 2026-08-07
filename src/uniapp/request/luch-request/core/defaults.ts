// @ts-nocheck
/**
 * 默认的全局配置
 */

export default {
    baseURL: '',
    header: {},
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
    custom: {},
    timeout: 60000,
    sslVerify: true,
    withCredentials: false,
    firstIpv4: false,
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300
    }
}