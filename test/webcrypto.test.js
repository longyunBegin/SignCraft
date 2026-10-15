import { describe, it, expect } from 'vitest';
import { webSign, webVerify, webGenerateKey } from '../src/lib/crypto.js';
import { testPrivateKey, testPublicKey } from './fixtures/test-keys.js';

const SIGNSTR =
  'amount=5.00&appId=22153&customerIp=127.0.0.1&email=test@gmail.com&inBankCode=CARD&orderId=ptpci_1700000000000&payType=PAYMENT_GATEWAY&subject=AED Card&key=MOCK_SECRET_KEY_FOR_TEST';
const EXPECTED_SIGN =
  'EJrNJ8Wex1rZFoWmVfP3MlBMd712rQ0Yo6OtXWwjJZ0DKfzfRnIfirGHd9wPtIgoe9GQ8uoh6lxjeP4pe5kmMtEdSH1K/SVe6jL56kzL4PBkASTi5KDMRN72Ax9UBUuP/TW69hccHRowksDFdLkXbbzWmF6aaOfzQuZj6PbYiUaFuBBY9FaDdqtgyDiqRadQq9KHSWMngcUdspORCfGqb+RFCKGW5GxXrprqvFBZpRjaODjWL5vbWNuF791aAs20PKE5h4aEvbi4raNYhIaFbcp+vAC1pVjVF+nZAeohMCOOUBRHx/FEbCC8gRGaKxzVGcwUT6kwyUbCbVEHtz2uew==';

describe('WebCrypto 签名 — 与 Java / Node crypto 输出一致', () => {
  it('webSign 输出与期望 Base64 完全一致', async () => {
    expect(await webSign(SIGNSTR, testPrivateKey)).toBe(EXPECTED_SIGN);
  });

  it('webVerify 验签通过', async () => {
    expect(await webVerify(SIGNSTR, testPublicKey, EXPECTED_SIGN)).toBe(true);
  });

  it('webGenerateKey 生成可用密钥对', async () => {
    const { privateKey, publicKey } = await webGenerateKey();
    expect(privateKey).toMatch(/^[A-Za-z0-9+/=]+$/);
    expect(publicKey).toMatch(/^[A-Za-z0-9+/=]+$/);
    const sig = await webSign('hello', privateKey);
    expect(await webVerify('hello', publicKey, sig)).toBe(true);
  });
});