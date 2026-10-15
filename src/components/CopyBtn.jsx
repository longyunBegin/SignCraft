import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CopyBtn({ text, label = '复制' }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    } catch { /* ignore */ }
  };
  return (
    <button className="copy-btn" onClick={copy}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={done ? 'done' : 'copy'}
          className="copy-btn-inner"
          initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
          transition={{ duration: 0.14, ease: 'easeOut' }}
        >
          {done ? (
            <>
              <motion.svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              >
                <path d="M20 6 9 17l-5-5" />
              </motion.svg>
              已复制
            </>
          ) : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
