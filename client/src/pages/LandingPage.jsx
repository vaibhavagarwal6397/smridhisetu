import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-screen flex flex-col justify-center items-center text-white z-10 pointer-events-none bg-transparent">
      {/* Container with pointer-events-auto so buttons are clickable */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="text-center max-w-5xl px-4 pointer-events-auto">
        <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
          समृद्धि सेतु
        </motion.h1>
        <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-light mb-6 text-cyan-50">
          SamriddhiSetu — Voice-First Credit Router
        </motion.p>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-300 mb-12">
          Empowering 50M+ rural Indians with AI-powered concessional credit access
        </motion.p>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl hover:bg-slate-800/60 transition-all">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">🎤 Voice-First</h3>
            <p className="text-slate-300">Speak in 12+ Indian languages. No forms needed.</p>
          </div>
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl hover:bg-slate-800/60 transition-all">
            <h3 className="text-xl font-bold mb-2 text-emerald-400">🏦 Smart Routing</h3>
            <p className="text-slate-300">NPA-aware branch matching with real-time fund tracking.</p>
          </div>
          <div className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl hover:bg-slate-800/60 transition-all">
            <h3 className="text-xl font-bold mb-2 text-amber-400">🔒 Zero-Trust Privacy</h3>
            <p className="text-slate-300">DPDP Act compliant. PII never stored.</p>
          </div>
        </motion.div>

        <motion.button 
          variants={itemVariants}
          onClick={() => navigate('/voice')}
          className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xl font-bold shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all hover:scale-105"
        >
          Start Voice Application →
        </motion.button>
      </motion.div>
      
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 w-full flex justify-center gap-12 text-slate-400 text-sm font-mono pointer-events-auto">
        <div className="flex flex-col items-center"><span className="text-xl font-bold text-cyan-300">50M+</span> Beneficiaries</div>
        <div className="flex flex-col items-center"><span className="text-xl font-bold text-emerald-300">&lt; 3 Min</span> Decision</div>
        <div className="flex flex-col items-center"><span className="text-xl font-bold text-amber-300">₹1,500Cr</span> Saved</div>
        <div className="flex flex-col items-center"><span className="text-xl font-bold text-blue-300">12+</span> Languages</div>
      </motion.div>
    </div>
  );
}
