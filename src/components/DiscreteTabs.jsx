import { motion, AnimatePresence } from 'motion/react';

// uselayouts discrete-tabs 风格：未激活只显示图标，激活的 pill 用弹簧展开并 blur-in 文字
const spring = { type: 'spring', stiffness: 320, damping: 26, mass: 1 };

function PenIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  );
}

function KeyIcon({ size = 17 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="m11 12 10-10" />
      <path d="m15 8 3 3" />
    </svg>
  );
}

const TABS = [
  { id: 'sign', label: '签名生成', Icon: PenIcon },
  { id: 'key', label: '密钥生成', Icon: KeyIcon },
];

export default function DiscreteTabs({ tab, onChange }) {
  return (
    <div className="dtabs" role="tablist" aria-label="工具切换">
      {TABS.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <motion.button
            key={id}
            role="tab"
            aria-selected={active}
            layout
            transition={spring}
            onClick={() => onChange(id)}
            className={'dtab' + (active ? ' active' : '')}
            whileTap={{ scale: 0.94 }}
          >
            <span className="dtab-icon"><Icon /></span>
            <AnimatePresence initial={false} mode="popLayout">
              {active && (
                <motion.span
                  key="label"
                  className="dtab-label"
                  initial={{ opacity: 0, x: -8, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: -8, filter: 'blur(6px)' }}
                  transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
