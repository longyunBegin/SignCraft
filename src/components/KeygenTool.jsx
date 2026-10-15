import { useState } from 'react';
import { motion } from 'motion/react';
import { webGenerateKey } from '../lib/crypto.js';
import CopyBtn from './CopyBtn.jsx';
import StatusButton from './StatusButton.jsx';

const resultItem = {
  hidden: { opacity: 0, y: 16, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
};

export default function KeygenTool() {
  const [keys, setKeys] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const handleGen = async () => {
    setError('');
    setStatus('loading');
    try {
      setKeys(await webGenerateKey());
      setStatus('success');
    } catch (e) {
      setError(e.message);
      setStatus('idle');
    }
  };

  return (
    <div className="tool">
      <div className="note">
        使用浏览器 WebCrypto 本地生成，不向服务器发送任何请求。私钥请妥善保存，公钥在服务端配置即可。
      </div>

      <StatusButton
        status={status}
        onClick={handleGen}
        onReset={() => setStatus('idle')}
        labels={{ idle: '生成密钥对', loading: '生成中…', success: '已生成' }}
      />

      {error && <div className="error">{error}</div>}

      {keys && (
        <motion.div
          className="results"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.div className="result" variants={resultItem}>
            <div className="result-head"><span>私钥（请妥善保管）</span><CopyBtn text={keys.privateKey} /></div>
            <pre className="code">{keys.privateKey}</pre>
          </motion.div>
          <motion.div className="result" variants={resultItem}>
            <div className="result-head"><span>公钥（可对外共享）</span><CopyBtn text={keys.publicKey} /></div>
            <pre className="code">{keys.publicKey}</pre>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
