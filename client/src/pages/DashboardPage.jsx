import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const stages = ['Voice Intake', 'Rules Match', 'Financial Calc', 'Routing', 'Doc Fetch', 'Sanction'];

export default function DashboardPage() {
  const [activeStage, setActiveStage] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Simulated Pipeline progress for Demo
    const flow = [
      { msg: 'Voice intake processing completed successfully.', delay: 1000 },
      { msg: 'Rules Engine matched 3 optimal schemes.', delay: 3000 },
      { msg: 'Financials locked: ₹1,250 EMI over 36 months.', delay: 5000 },
      { msg: 'Routed to Canara Bank, Lucknow based on 92% compatibility score.', delay: 7000 },
      { msg: 'DigiLocker integrated. KYC & income certificates fetched.', delay: 9000 },
      { msg: 'SUCCESS! Sanction ID Generated: SS-PMAJAY-CNBK-1234', delay: 11000 },
    ];

    flow.forEach((item, index) => {
      setTimeout(() => {
        setActiveStage(index + 1);
        setEvents(prev => [...prev, { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'}), text: item.msg }]);
      }, item.delay);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white p-8 pt-24 font-sans">
      
      {/* TOP: Pipeline Visualization */}
      <div className="mb-8 w-full backdrop-blur-xl bg-slate-900/40 border border-white/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <h2 className="text-2xl font-bold mb-10 text-cyan-400">Application Pipeline Tracker</h2>
        
        <div className="flex justify-between items-center relative px-4">
          <div className="absolute left-4 right-4 top-1/2 h-1 bg-slate-800 -z-10 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute left-4 top-1/2 h-1 bg-cyan-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ width: `calc(${(Math.min(activeStage, stages.length - 1)) / (stages.length - 1) * 100}% - 2rem)` }}
          ></div>
          
          {stages.map((stage, idx) => {
            const isActive = activeStage === idx;
            const isPast = activeStage > idx;
            const isLast = activeStage >= stages.length && idx === stages.length - 1;
            
            return (
              <div key={stage} className="flex flex-col items-center relative">
                <motion.div 
                  animate={{ scale: isActive || isLast ? 1.2 : 1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 font-bold text-sm z-10 transition-colors duration-500 ${isPast || isLast ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.6)]' : isActive ? 'bg-cyan-500 text-cyan-950 shadow-[0_0_20px_rgba(6,182,212,1)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}
                >
                  {isPast || isLast ? '✓' : idx + 1}
                </motion.div>
                <span className={`text-sm font-medium absolute -bottom-6 whitespace-nowrap ${(isActive || isLast) ? 'text-cyan-400' : isPast ? 'text-emerald-400' : 'text-slate-500'}`}>{stage}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* MIDDLE: 3 Columns Data panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Applicant Summary */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-amber-400 mb-6 flex items-center gap-2"><span>👤</span> Applicant Summary</h3>
          <div className="space-y-4 text-base flex-grow">
            <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-400">Name</span><span className="font-medium">Ramesh Kumar</span></div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-400">Category</span><span className="bg-slate-800 px-2 py-1 rounded text-sm">SC</span></div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-400">Scheme</span><span className="text-cyan-400 font-bold bg-cyan-900/30 px-2 py-1 rounded">PM-AJAY</span></div>
            <div className="flex justify-between items-center border-b border-white/5 pb-2"><span className="text-slate-400">Req. Amount</span><span className="font-mono text-lg">₹50,000</span></div>
          </div>
          <AnimatePresence>
            {activeStage >= 6 && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 p-4 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-400 text-center font-mono shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="text-xs text-emerald-500/70 mb-1 uppercase tracking-widest">Sanction ID</div>
                <div className="text-xl font-bold tracking-wider">SS-PMAJAY-CNBK-1234</div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Branch Assignment */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2"><span>🏦</span> Branch Routing</h3>
          <div className="space-y-4">
            <motion.div animate={activeStage >= 4 ? { scale: 1.05, borderColor: '#06b6d4', boxShadow: '0 0 15px rgba(6,182,212,0.3)' } : {}} className="p-4 bg-slate-800/80 border border-cyan-500/50 rounded-xl relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
              <div className="flex justify-between font-bold mb-2 text-lg"><span>Canara Bank</span><span className="text-cyan-400 bg-cyan-950 px-2 py-1 rounded text-sm">92 Score</span></div>
              <div className="flex justify-between text-sm text-slate-400 mb-3"><span>Distance: 2.5 km</span><span>NPA: 2.1%</span></div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: '92%' }}></div>
              </div>
            </motion.div>
            
            <div className="p-4 bg-slate-900/50 border border-white/10 rounded-xl opacity-60">
              <div className="flex justify-between font-bold mb-2"><span>SBI, Gomti Nagar</span><span className="text-slate-400">85 Score</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Distance: 4.0 km</span><span>NPA: 3.5%</span></div>
            </div>
          </div>
        </motion.div>

        {/* Financial Details */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl flex flex-col">
          <h3 className="text-xl font-bold text-emerald-400 mb-6 flex items-center gap-2"><span>💰</span> Financials</h3>
          <div className="space-y-4 text-base flex-grow">
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-400">Monthly EMI</span><span className="font-mono">₹1,250</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-400">Interest Rate</span><span className="font-mono text-amber-400">0% (Subsidized)</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-400">Upfront Subsidy</span><span className="font-mono text-emerald-400">₹50,000</span></div>
            <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-slate-400">Moratorium</span><span className="font-mono">6 Months</span></div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 bg-slate-950 p-4 rounded-xl">
            <div className="text-slate-400 text-xs mb-1 uppercase tracking-wider">Net Bank Disbursement</div>
            <div className="text-4xl font-black text-emerald-400 tracking-tight">₹4,50,000</div>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: Activity Log */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="backdrop-blur-xl bg-slate-900/40 border border-white/15 p-6 rounded-2xl">
        <h3 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2"><span>📝</span> Secure Audit Log</h3>
        <div className="space-y-3 h-48 overflow-y-auto pr-4 custom-scrollbar">
          <AnimatePresence>
            {events.slice().reverse().map((ev, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} 
                key={events.length - i} 
                className="flex gap-4 items-center bg-slate-800/40 p-4 rounded-xl border border-white/5 hover:bg-slate-800/80 transition-colors"
              >
                <span className="text-sm text-cyan-500 font-mono w-24 border-r border-white/10">{ev.time}</span>
                <span className="text-base text-slate-200">{ev.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {events.length === 0 && (
            <div className="text-slate-500 italic p-4 text-center">Awaiting pipeline events...</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
