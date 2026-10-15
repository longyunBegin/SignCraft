import crypto from 'node:crypto';

export function normalizePrivateKey(privateKey) {
  const trimmed = String(privateKey).trim();
  if (trimmed.includes('-----BEGIN')) return trimmed;
  const b64 = trimmed.replace(/\s+/g, '');
  return `-----BEGIN PRIVATE KEY-----\n${b64}\n-----END PRIVATE KEY-----`;
}

export function normalizePublicKey(publicKey) {
  const trimmed = String(publicKey).trim();
  if (trimmed.includes('-----BEGIN')) return trimmed;
  const b64 = trimmed.replace(/\s+/g, '');
  return `-----BEGIN PUBLIC KEY-----\n${b64}\n-----END PUBLIC KEY-----`;
}

export function buildRSASignByPrivateKey(data, privateKey) {
  const keyObj = crypto.createPrivateKey({ key: normalizePrivateKey(privateKey), format: 'pem' });
  const sig = crypto.sign('SHA256', Buffer.from(data, 'utf8'), keyObj);
  return sig.toString('base64');
}

export function buildRSAverifyByPublicKey(data, publicKey, sign) {
  const keyObj = crypto.createPublicKey({ key: normalizePublicKey(publicKey), format: 'pem' });
  return crypto.verify('SHA256', Buffer.from(data, 'utf8'), keyObj, Buffer.from(sign, 'base64'));
}