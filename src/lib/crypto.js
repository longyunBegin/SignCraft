export function bufToB64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

export function b64ToBuf(input) {
  const b64 = String(input).replace(/-----[A-Z ]+-----/g, '').replace(/\s+/g, '');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export async function webSign(data, privateKey) {
  const key = await crypto.subtle.importKey(
    'pkcs8', b64ToBuf(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(data));
  return bufToB64(sig);
}

export async function webVerify(data, publicKey, sign) {
  const key = await crypto.subtle.importKey(
    'spki', b64ToBuf(publicKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']
  );
  return crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64ToBuf(sign), new TextEncoder().encode(data));
}

export async function webGenerateKey() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify']
  );
  const priv = await crypto.subtle.exportKey('pkcs8', pair.privateKey);
  const pub = await crypto.subtle.exportKey('spki', pair.publicKey);
  return { privateKey: bufToB64(priv), publicKey: bufToB64(pub) };
}