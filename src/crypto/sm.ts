/**
 * SM 系列子入口 —— 仅含 SM2/SM3/SM4，不依赖 Node 内置 crypto
 * 供小程序等无 Node crypto 环境使用（不会拉入 md5/aes/rsa 的 node crypto）
 */
export { sm2Encrypt, sm2Decrypt, sm2GenerateKeyPair } from '@/crypto/sm2';
export type { Sm2KeyPair, Sm2EncryptOptions, Sm2DecryptOptions } from '@/crypto/sm2';
export { sm3 } from '@/crypto/sm3';
export { sm4Encrypt, sm4Decrypt } from '@/crypto/sm4';
export type { Sm4Options } from '@/crypto/sm4';
