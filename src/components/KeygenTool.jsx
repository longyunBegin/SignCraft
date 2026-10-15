import { useState } from 'react';
import { webGenerateKey } from '../lib/crypto.js';
import CopyBtn from './CopyBtn.jsx';

export default function KeygenTool() {
  const [keys, setKeys] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleGen = async () => {
    setError('');
    setBusy(true);
    try {
      setKeys(await webGenerateKey());
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="tool">
      <div className="note">
        使用浏览器 WebCrypto 本地生成，不向服务器发送任何请求。私钥请妥善保存，公钥在服务端配置即可。
      </div>

      <button className="btn-primary" onClick={handleGen} disabled={busy}>
        {busy ? '生成中…' : '生成密钥对'}
      </button>

      {error && <div className="error">{error}</div>}

      {keys && (
        <div className="results">
          <div className="result">
            <div className="result-head"><span>私钥（请妥善保管）</span><CopyBtn text={keys.privateKey} /></div>
            <pre className="code">{keys.privateKey}</pre>
          </div>
          <div className="result">
            <div className="result-head"><span>公钥（可对外共享）</span><CopyBtn text={keys.publicKey} /></div>
            <pre className="code">{keys.publicKey}</pre>
          </div>
        </div>
      )}
    </div>
  );
}