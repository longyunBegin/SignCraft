import { getSign } from './sign.js';
import { buildRSASignByPrivateKey, buildRSAverifyByPublicKey } from './rsa.js';

export { getSign } from './sign.js';
export { buildRSASignByPrivateKey, buildRSAverifyByPublicKey } from './rsa.js';

export function signParams(params, secretKey, privateKey) {
  const signStr = getSign(params, secretKey);
  const sign = buildRSASignByPrivateKey(signStr, privateKey);
  return { signStr, sign, body: { ...params, sign } };
}