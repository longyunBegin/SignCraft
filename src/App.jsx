import { useState } from 'react';
import SignTool from './components/SignTool.jsx';
import KeygenTool from './components/KeygenTool.jsx';

export default function App() {
  const [tab, setTab] = useState('sign');

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <svg className="logo" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <rect width="64" height="64" rx="15" fill="#1d1d1f" />
            <path d="M16 42 C28 42 36 34 47 23" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="47" cy="23" r="3.4" fill="#fff" />
          </svg>
          <h1>SignCraft</h1>
        </div>
        <p>本地生成 · 不向服务器发送任何请求 · 与后端签名规则对齐</p>
      </header>

      <div className="tabs">
        <button className={tab === 'sign' ? 'active' : ''} onClick={() => setTab('sign')}>签名生成</button>
        <button className={tab === 'key' ? 'active' : ''} onClick={() => setTab('key')}>密钥生成</button>
      </div>

      <main className="content">
        {tab === 'sign' ? <SignTool /> : <KeygenTool />}
      </main>

      <footer className="app-footer">
        签名规则：字段名 ASCII 升序，跳过 null / 空串 / sign / sign_type，拼 k=v&amp;…&amp;key=secretKey，SHA256withRSA 输出 Base64
      </footer>
    </div>
  );
}
