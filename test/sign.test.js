import { describe, it, expect } from 'vitest';
import { getSign } from '../signer/sign.js';
import { buildRSASignByPrivateKey, buildRSAverifyByPublicKey, normalizePrivateKey } from '../signer/rsa.js';
import { signParams } from '../signer/index.js';
import { testPrivateKey, testPublicKey } from './fixtures/test-keys.js';

const SECRET = 'MOCK_SECRET_KEY_FOR_TEST';
const EXPECTED_SIGNSTR =
  'amount=5.00&appId=22153&customerIp=127.0.0.1&email=test@gmail.com&inBankCode=CARD&orderId=ptpci_1700000000000&payType=PAYMENT_GATEWAY&subject=AED Card&key=MOCK_SECRET_KEY_FOR_TEST';
const EXPECTED_SIGN =
  'EJrNJ8Wex1rZFoWmVfP3MlBMd712rQ0Yo6OtXWwjJZ0DKfzfRnIfirGHd9wPtIgoe9GQ8uoh6lxjeP4pe5kmMtEdSH1K/SVe6jL56kzL4PBkASTi5KDMRN72Ax9UBUuP/TW69hccHRowksDFdLkXbbzWmF6aaOfzQuZj6PbYiUaFuBBY9FaDdqtgyDiqRadQq9KHSWMngcUdspORCfGqb+RFCKGW5GxXrprqvFBZpRjaODjWL5vbWNuF791aAs20PKE5h4aEvbi4raNYhIaFbcp+vAC1pVjVF+nZAeohMCOOUBRHx/FEbCC8gRGaKxzVGcwUT6kwyUbCbVEHtz2uew==';

const baseParams = () => ({
  orderId: 'ptpci_1700000000000', amount: '5.00', appId: 22153,
  payType: 'PAYMENT_GATEWAY', inBankCode: 'CARD', name: '',
  email: 'test@gmail.com', subject: 'AED Card', customerIp: '127.0.0.1',
  callBackUrl: '', sign: 'x', sign_type: 'x',
});

describe('getSign — 对齐 Java SignUtils.getSign', () => {
  it('按字段名 ASCII 升序拼接，跳过 sign/sign_type/空串/null', () => {
    expect(getSign(baseParams(), SECRET)).toBe(EXPECTED_SIGNSTR);
  });

  it('字段输入顺序不影响结果', () => {
    const reversed = Object.fromEntries(Object.entries(baseParams()).reverse());
    expect(getSign(reversed, SECRET)).toBe(EXPECTED_SIGNSTR);
  });

  it('null 字段被跳过', () => {
    const p = { ...baseParams(), subject: null };
    expect(getSign(p, SECRET)).toBe(EXPECTED_SIGNSTR.replace('&subject=AED Card', ''));
  });

  it('空字符串字段被跳过', () => {
    const p = { ...baseParams(), email: '' };
    expect(getSign(p, SECRET)).toBe(EXPECTED_SIGNSTR.replace('&email=test@gmail.com', ''));
  });

  it('末尾追加 key=secretKey', () => {
    expect(getSign({ a: '1' }, 'SK')).toBe('a=1&key=SK');
  });
});

describe('buildRSASignByPrivateKey — 对齐 Java SHA256withRSA', () => {
  it('输出稳定可复现的 Base64', () => {
    expect(buildRSASignByPrivateKey(EXPECTED_SIGNSTR, testPrivateKey)).toBe(EXPECTED_SIGN);
  });

  it('兼容含 PEM 头的私钥', () => {
    const pem = normalizePrivateKey(testPrivateKey);
    expect(pem).toContain('-----BEGIN PRIVATE KEY-----');
    expect(buildRSASignByPrivateKey(EXPECTED_SIGNSTR, pem)).toBe(EXPECTED_SIGN);
  });

  it('公钥验签通过', () => {
    expect(buildRSAverifyByPublicKey(EXPECTED_SIGNSTR, testPublicKey, EXPECTED_SIGN)).toBe(true);
  });

  it('篡改明文验签失败', () => {
    expect(buildRSAverifyByPublicKey(EXPECTED_SIGNSTR + 'x', testPublicKey, EXPECTED_SIGN)).toBe(false);
  });
});

describe('signParams — 对齐 LionPayTest.signParams', () => {
  it('返回 signStr/sign/body，body 含 sign 字段', () => {
    const r = signParams(baseParams(), SECRET, testPrivateKey);
    expect(r.signStr).toBe(EXPECTED_SIGNSTR);
    expect(r.sign).toBe(EXPECTED_SIGN);
    expect(r.body.sign).toBe(EXPECTED_SIGN);
    expect(r.body.orderId).toBe('ptpci_1700000000000');
  });

  it('修改任一字段后 sign 变化', () => {
    const r1 = signParams(baseParams(), SECRET, testPrivateKey);
    const r2 = signParams({ ...baseParams(), amount: '6.00' }, SECRET, testPrivateKey);
    expect(r1.signStr).not.toBe(r2.signStr);
    expect(r1.sign).not.toBe(r2.sign);
  });
});