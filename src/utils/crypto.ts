import JSEncrypt from "jsencrypt";

// 采用固定 type: 'water'的公钥
const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCnDN8jzUpF33WzhHT2x5no2WDu9IoppXzrdWCgojtnV6bV/iQXvNziOSKcTG5HcM550Ymv3W5qgNxsJ3nHG0l6vS2MK9BGH9Zo9Zd2+ye9D2WJVXWSYHkhJHnlvxOHSbq5C0ZgyJAIWSH6YL0JrO1R0tbW9MkEnEAR84AzWaiRNwIDAQAB";

export function encrypt(str: string) {
  const encryptRSA = new JSEncrypt();
  encryptRSA.setPublicKey(publicKey);
  return encryptRSA.encrypt(str) || "";
}
