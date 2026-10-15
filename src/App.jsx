import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DiscreteTabs from './components/DiscreteTabs.jsx';
import SignTool from './components/SignTool.jsx';
import KeygenTool from './components/KeygenTool.jsx';

export default function App() {
  const [tab, setTab] = useState('sign');

  return (
    <div className="app">
      <motion.header
        className="app-header"
        initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="brand">
          <svg className="logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="15" fill="#1d1d1f" />
            <path d="M16 42 C28 42 36 34 47 23" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="47" cy="23" r="3.4" fill="#fff" />
          </svg>
          <h1>SignCraft</h1>
        </div>
        <p>本地生成 · 不向服务器发送任何请求 · 与后端签名规则对齐</p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <DiscreteTabs tab={tab} onChange={setTab} />
      </motion.div>

      <main className="content">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
          >
            {tab === 'sign' ? <SignTool /> : <KeygenTool />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="app-footer">
        签名规则：字段名 ASCII 升序，跳过 null / 空串 / sign / sign_type，拼 k=v&amp;…&amp;key=secretKey，SHA256withRSA 输出 Base64
      </footer>
    </div>
  );
}
