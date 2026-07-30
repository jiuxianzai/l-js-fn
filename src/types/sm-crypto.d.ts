declare module 'sm-crypto' {
	interface Sm2 {
		generateKeyPairHex(): { publicKey: string; privateKey: string };
		doEncrypt(msg: string, publicKey: string, cipherMode?: number): string;
		doDecrypt(encryptData: string, privateKey: string, cipherMode?: number): string;
	}

	interface Sm4 {
		encrypt(msg: string | Uint8Array, key: string, options?: { mode?: string; iv?: string; output?: string }): string;
		decrypt(encryptData: string, key: string, options?: { mode?: string; iv?: string; output?: string }): string;
	}

	export const sm2: Sm2;
	export const sm4: Sm4;
}
