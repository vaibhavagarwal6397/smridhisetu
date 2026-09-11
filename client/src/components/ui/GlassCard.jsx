import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({ title, icon, children, className = '', glowColor = 'cyan-500' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={`relative rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 overflow-hidden transition-all duration-300 hover:border-white/25 hover:shadow-[0_0_20px_rgba(var(--tw-colors-${glowColor}),0.2)] ${className}`}
    >
      <div className="flex items-center space-x-3 mb-4">
        {icon && <span className={`text-${glowColor}`}>{icon}</span>}
        {title && <h3 className={`text-lg font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent`}>{title}</h3>}
      </div>
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle corner glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 bg-${glowColor}/10 rounded-full blur-3xl pointer-events-none`} />
    </motion.div>
  );
}
