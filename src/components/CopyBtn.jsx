import { useState } from 'react';

export default function CopyBtn({ text, label = '复制' }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch { /* ignore */ }
  };
  return <button className="copy-btn" onClick={copy}>{done ? '已复制' : label}</button>;
}