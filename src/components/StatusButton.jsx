import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// uselayouts save-button 风格：idle → loading(spinner) → success(check) 状态机
// status 由父组件持有；success 会在 1.8s 后自动回到 idle
function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.9s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}

function Check({ size = 16 }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
    >
      <path d="M20 6 9 17l-5-5" />
    </motion.svg>
  );
}

export default function StatusButton({
  status, onClick, onReset, disabled,
  labels = { idle: '确定', loading: '处理中…', success: '完成' },
}) {
  useEffect(() => {
    if (status !== 'success') return;
    const t = setTimeout(() => onReset?.(), 1800);
    return () => clearTimeout(t);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const busy = status === 'loading';
  const label = status === 'loading' ? labels.loading : status === 'success' ? labels.success : labels.idle;

  return (
    <motion.button
      className="status-btn"
      onClick={() => onClick?.()}
      disabled={disabled || busy}
      whileTap={disabled || busy ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 24 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          className="status-btn-inner"
          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
        >
          {busy && <Spinner />}
          {status === 'success' && <Check />}
          {label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
