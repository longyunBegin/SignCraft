import { useState, useMemo } from 'react';
import { getSign } from '../../signer/sign.js';
import { webSign } from '../lib/crypto.js';
import CopyBtn from './CopyBtn.jsx';

function cleanParams(params) {
  const cleaned = {};
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue;
    if (k === 'appId' && /^\d+$/.test(v)) cleaned[k] = Number(v);
    else cleaned[k] = v;
  }
  return cleaned;
}

const DEFAULT_JSON = `{
  "appId": 22153,
  "orderId": "ptpci_1700000000000",
  "amount": "5.00",
  "payType": "PAYMENT_GATEWAY",
  "inBankCode": "CARD",
  "email": "test@gmail.com",
  "subject": "AED Card",
  "customerIp": "127.0.0.1"
}`;

export default function SignTool() {
  const [jsonText, setJsonText] = useState(DEFAULT_JSON);
  const [secretKey, setSecretKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const jsonValid = useMemo(() => {
    try { JSON.parse(jsonText); return true; } catch { return false; }
  }, [jsonText]);

  const formatJson = () => {
    try { setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2)); } catch { /* ignore */ }
  };

  const handleSign = async () => {
    setError('');
    setBusy(true);
    try {
      const cleaned = cleanParams(JSON.parse(jsonText));
      const signStr = getSign(cleaned, secretKey);
      const sign = await webSign(signStr, privateKey);
      setResult({ signStr, sign, body: { ...cleaned, sign } });
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const bodyJson = result ? JSON.stringify(result.body, null, 2) : '';

  return (
    <div className="tool">
      <div className="field">
        <div className="field-head">
          <label>参数（JSON）</label>
          <button className="copy-btn" onClick={formatJson} disabled={!jsonValid}>格式化</button>
        </div>
        <textarea className="mono" rows={10} value={jsonText}
          onChange={(e) => setJsonText(e.target.value)} spellCheck={false} />
        {!jsonValid && <span className="warn">JSON 格式错误</span>}
      </div>

      <div className="field">
        <label>secretKey</label>
        <input type="password" value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)} placeholder="<SECRET_KEY>" />
      </div>

      <div className="field">
        <label>privateKey（PKCS#8 Base64，可含 PEM 头）</label>
        <textarea className="mono" rows={4} value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)} placeholder="<PRIVATE_KEY>" />
      </div>

      <button className="btn-primary" onClick={handleSign}
        disabled={busy || !jsonValid || !secretKey || !privateKey}>
        {busy ? '生成中…' : '生成签名'}
      </button>

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results">
          <div className="result">
            <div className="result-head"><span>待签明文</span><CopyBtn text={result.signStr} /></div>
            <pre className="code">{result.signStr}</pre>
          </div>
          <div className="result">
            <div className="result-head"><span>sign</span><CopyBtn text={result.sign} /></div>
            <pre className="code">{result.sign}</pre>
          </div>
          <div className="result">
            <div className="result-head"><span>最终请求 JSON</span><CopyBtn text={bodyJson} /></div>
            <pre className="code">{bodyJson}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
