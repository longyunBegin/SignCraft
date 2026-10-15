const SKIP_KEYS = new Set(['sign', 'sign_type']);

export function getSign(params, secretKey) {
  const keys = Object.keys(params).sort();
  let sb = '';
  for (const key of keys) {
    const val = params[key];
    if (val == null || val === '' || SKIP_KEYS.has(key)) continue;
    sb += `${key}=${val}&`;
  }
  sb += `key=${secretKey}`;
  return sb;
}

