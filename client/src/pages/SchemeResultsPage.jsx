import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { matchSchemes, calculateFinancials, getAIRecommendation } from '../services/apiService';
import useStore from '../store/useStore';

export default function SchemeResultsPage() {
  const navigate = useNavigate();
  const { userProfile, language, setSelectedScheme, setFinancials } = useStore();
  const [schemes, setSchemes] = useState([]);
  const [selectedScheme, setLocalScheme] = useState(null);
  const [financials, setLocalFinancials] = useState(null);
  const [loanAmount, setLoanAmount] = useState(50000);
  const [tenure, setTenure] = useState(36);
  const [aiReco, setAiReco] = useState('');
  const [loadingReco, setLoadingReco] = useState(false);

  useEffect(() => {
    matchSchemes(userProfile || {}).then(res => {
      const list = res.schemes || [];
      setSchemes(list);
      // Fetch AI recommendation after schemes load
      if (list.length > 0) {
        setLoadingReco(true);
        getAIRecommendation(userProfile || {}, list, language || 'hi')
          .then(reco => setAiReco(reco))
          .finally(() => setLoadingReco(false));
      }
    });
  }, []);

  const handleSelect = async (scheme) => {
    setLocalScheme(scheme);
    setSelectedScheme(scheme); // global store
    setLoanAmount(scheme.maxLoan);
    const res = await calculateFinancials({ schemeId: scheme.id, amount: scheme.maxLoan, tenure });
    const fins = res.financials || res;
    setLocalFinancials(fins);
    setFinancials(fins); // global store
  };

  const handleRecalculate = async () => {
    if (!selectedScheme) return;
    const res = await calculateFinancials({ schemeId: selectedScheme.id, amount: loanAmount, tenure });
    const fins = res.financials || res;
    setLocalFinancials(fins);
  };

  useEffect(() => {
    handleRecalculate();
  }, [loanAmount, tenure]);

  return (
    <div className="min-h-screen p-8 pt-24 bg-[#0a0a1a] text-white flex gap-8">
      {/* Left: Matched Schemes */}
      <div className={`transition-all duration-500 ease-in-out ${selectedScheme ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}>

        <div className="flex items-center justify-between mb-5">
          <h1 className="text-3xl font-bold text-cyan-400">Top Matched Schemes</h1>
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-white/10">
            {schemes.length} schemes found
          </span>
        </div>

        {/* Gemini AI Recommendation Banner */}
        <AnimatePresence>
          {(aiReco || loadingReco) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">🤖</span>
                <div>
                  <div className="text-xs font-semibold text-purple-400 uppercase tracking-widest mb-1.5">
                    Gemini AI Recommendation
                  </div>
                  {loadingReco ? (
                    <div className="flex gap-1.5 mt-1">
                      {[0, 0.15, 0.3].map(d => (
                        <motion.div key={d} animate={{ scale: [1, 1.4, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: d }}
                          className="w-2 h-2 bg-purple-400 rounded-full" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-200 text-sm leading-relaxed">{aiReco}</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-5">
          {schemes.length === 0 && (
            <div className="flex items-center justify-center h-40 text-slate-500">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                Loading schemes...
              </div>
            </div>
          )}
          {schemes.map((s, i) => (
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
              key={s.id}
              className={`backdrop-blur-xl bg-slate-900/40 border p-6 rounded-2xl cursor-pointer transition-all duration-300
                ${selectedScheme?.id === s.id
                  ? 'border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] scale-[1.01]'
                  : 'border-white/10 hover:border-white/25 hover:bg-slate-800/60'}`}
              onClick={() => handleSelect(s)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-white">{s.name}</h2>
                    {i === 0 && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        Best Match
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {s.categories?.map(cat => (
                      <span key={cat} className="text-xs bg-slate-800 border border-white/10 px-2 py-0.5 rounded text-slate-400">{cat}</span>
                    ))}
                  </div>
                </div>
                {/* Real eligibility score circle */}
                <div className="relative w-14 h-14 flex-shrink-0 ml-4">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <circle cx="28" cy="28" r="24" fill="none" stroke="#10b981" strokeWidth="4"
                      strokeDasharray={`${(s.eligibilityScore ?? 100) * 1.507} 150.7`}
                      strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-emerald-400 font-black text-sm leading-none">{s.eligibilityScore ?? 100}%</span>
                    <span className="text-[8px] text-emerald-500/70">match</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-4 leading-relaxed">{s.description}</p>

              <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Max Loan</span>
                  <span className="text-cyan-400 font-bold">₹{(s.maxLoan || 0).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Interest</span>
                  <span className="text-amber-400 font-bold">{s.interestRate ?? 0}% p.a.</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase tracking-wider mb-0.5">Subsidy / Grant</span>
                  <span className="text-emerald-400 font-bold">₹{(s.grantAmount || s.subsidyAmount || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right: Financial Calculator */}
      <AnimatePresence>
        {selectedScheme && (
          <motion.div 
            initial={{ opacity: 0, x: 100, width: 0 }} animate={{ opacity: 1, x: 0, width: '50%' }} exit={{ opacity: 0, x: 100, width: 0 }}
            className="backdrop-blur-xl bg-slate-900/60 border border-white/15 rounded-2xl p-8 h-fit sticky top-24 shadow-2xl"
          >
            <h2 className="text-2xl font-bold mb-8 text-amber-400 flex items-center gap-3">
              <span>🧮</span> Financial Calculator
            </h2>
            
            <div className="space-y-8">
              <div className="bg-slate-800/50 p-5 rounded-xl border border-white/10">
                <div className="flex justify-between mb-4">
                  <label className="block text-slate-300 font-medium">Loan Amount</label>
                  <span className="text-cyan-400 font-bold">₹{loanAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" className="w-full accent-cyan-500" 
                  min="10000" max={selectedScheme.maxLoan} step="5000" 
                  value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} 
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>₹10,000</span>
                  <span>₹{selectedScheme.maxLoan.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-5 rounded-xl border border-white/10">
                <div className="flex justify-between mb-4">
                  <label className="block text-slate-300 font-medium">Tenure</label>
                  <span className="text-cyan-400 font-bold">{tenure} Months</span>
                </div>
                <input 
                  type="range" className="w-full accent-cyan-500" 
                  min="12" max="60" step="6" 
                  value={tenure} onChange={(e) => setTenure(Number(e.target.value))} 
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>12m</span>
                  <span>60m</span>
                </div>
              </div>

              {financials && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-slate-950 p-5 rounded-xl border border-cyan-500/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-cyan-500/10 group-hover:bg-cyan-500/20 transition-all"></div>
                    <div className="text-slate-400 text-sm mb-1 relative z-10">Monthly EMI</div>
                    <div className="text-4xl font-black text-cyan-400 relative z-10">₹{financials.emi}</div>
                  </div>
                  <div className="bg-slate-950 p-5 rounded-xl border border-emerald-500/30 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-all"></div>
                    <div className="text-slate-400 text-sm mb-1 relative z-10">Net Disbursement</div>
                    <div className="text-4xl font-black text-emerald-400 relative z-10">₹{financials.netDisbursement.toLocaleString()}</div>
                  </div>
                </motion.div>
              )}
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full mt-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:-translate-y-1"
              >
                Find Best Branch →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
