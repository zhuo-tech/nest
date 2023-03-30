import CryptoJS from 'crypto-js'

/**
 * AES 加密
 * @param {*} src  明文
 * @param {*} keyWord  密钥
 * @returns 密文
 */
export function aesEncrypt(src, keyWord = 'XwKsGlMcdPMEhR1B') {
  const key = CryptoJS.enc.Utf8.parse(keyWord)
  // 加密
  var encrypted = CryptoJS.AES.encrypt(src, key, {
    iv: key,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  })
  return encrypted.toString()
}

/**
 *  解密
 * @param {*} result 密文
 * @param {*} keyWord 密钥
 * @returns 明文
 */
export function aesDecrypt(result, keyWord) {
  const key = CryptoJS.enc.Latin1.parse(keyWord)
  var iv = key
  // 解密逻辑
  var decryptd = CryptoJS.AES.decrypt(result, key, {
    iv: iv,
    mode: CryptoJS.mode.CFB,
    padding: CryptoJS.pad.NoPadding
  })

  return decryptd.toString(CryptoJS.enc.Utf8)
}

/**
 * Base64 加密
 * @param {*} src  明文
 * @returns 密文
 */
export function base64Encrypt(src) {
  const encodedWord = CryptoJS.enc.Utf8.parse(src)
  return CryptoJS.enc.Base64.stringify(encodedWord)
}
