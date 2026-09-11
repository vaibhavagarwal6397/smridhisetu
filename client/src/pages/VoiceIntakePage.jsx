import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import { startListening, stopListening, speak } from '../services/voiceService';
import useStore from '../store/useStore';

/* ─────────────────────────────────────────────
   Interview Script — one question per field
───────────────────────────────────────────── */
const QUESTIONS = [
  {
    field: 'name',
    hi: 'नमस्ते! मैं SamriddhiSetu AI हूं। आपका नाम क्या है?',
    en: 'Hello! I am SamriddhiSetu AI. What is your full name?',
  },
  {
    field: 'age',
    hi: 'आपकी उम्र कितनी है?',
    en: 'How old are you?',
  },
  {
    field: 'annualIncome',
    hi: 'आपकी सालाना आमदनी कितनी है? जैसे "एक लाख" या "डेढ़ लाख"।',
    en: 'What is your annual income? For example "one lakh" or "1.5 lakh".',
  },
  {
    field: 'category',
    hi: 'आप किस वर्ग से हैं? SC, ST, OBC, BC, DNT, या Safai Karamchari?',
    en: 'What is your social category? SC, ST, OBC, BC, DNT, or Safai Karamchari?',
  },
  {
    field: 'gender',
    hi: 'आप पुरुष हैं या महिला?',
    en: 'What is your gender — Male or Female?',
  },
  {
    field: 'state',
    hi: 'आप किस राज्य में रहते हैं?',
    en: 'Which state do you live in?',
  },
  {
    field: 'district',
    hi: 'आपका जिला कौन सा है?',
    en: 'What is your district?',
  },
  {
    field: 'purpose',
    hi: 'आप ऋण किस काम के लिए चाहते हैं? जैसे व्यवसाय, शिक्षा, मकान, या खेती।',
    en: 'What do you need the loan for? Business, Education, Housing, or Agriculture?',
  },
  {
    field: 'loanAmount',
    hi: 'आपको कितने रुपए का ऋण चाहिए?',
    en: 'How much loan amount are you looking for?',
  },
];

/** Parse a single spoken answer into a field value */
function parseAnswer(field, text, lang) {
  const t = text.toLowerCase().trim();

  if (field === 'age') {
    const m = t.match(/(\d+)/);
    return m ? m[1] : t;
  }
  if (field === 'annualIncome' || field === 'loanAmount') {
    // Handle "ek lakh", "do lakh", "50 hazaar" etc.
    let n = t.replace(/[,₹]/g, '');
    n = n.replace(/ek|one/i, '1').replace(/do|two/i, '2').replace(/teen|three/i, '3')
         .replace(/char|four/i, '4').replace(/paanch|five/i, '5');
    const lakhMatch = n.match(/([\d.]+)\s*(lakh|lac|लाख)/i);
    if (lakhMatch) return String(Math.round(parseFloat(lakhMatch[1]) * 100000));
    const hazaarMatch = n.match(/([\d.]+)\s*(hazaar|hazar|thousand|हज़ार|हजार)/i);
    if (hazaarMatch) return String(Math.round(parseFloat(hazaarMatch[1]) * 1000));
    const plain = n.match(/([\d]+)/);
    return plain ? plain[1] : t;
  }
  if (field === 'category') {
    if (/sc|scheduled caste|अनुसूचित जाति/i.test(t)) return 'SC';
    if (/st|scheduled tribe|अनुसूचित जनजाति/i.test(t)) return 'ST';
    if (/obc|other backward/i.test(t)) return 'OBC';
    if (/bc|backward/i.test(t)) return 'BC';
    if (/dnt|denotified/i.test(t)) return 'DNT';
    if (/safai|sweeper|scavenger/i.test(t)) return 'SafaiKaramchari';
    return t.toUpperCase().trim().split(' ')[0];
  }
  if (field === 'gender') {
    if (/male|man|purush|पुरुष|ladka/i.test(t)) return 'Male';
    if (/female|woman|mahila|महिला|lady|ladki/i.test(t)) return 'Female';
    return text.trim();
  }
  if (field === 'purpose') {
    if (/business|vyapar|व्यवसाय|dukaan/i.test(t)) return 'Business';
    if (/educat|padhai|पढ़ाई|school|college/i.test(t)) return 'Education';
    if (/hous|makaan|घर|ghar/i.test(t)) return 'Housing';
    if (/agri|khet|farming|किसान/i.test(t)) return 'Agriculture';
    if (/vehicle|gaadi|गाड़ी/i.test(t)) return 'Vehicle';
    if (/shg|mahila group|self help/i.test(t)) return 'SHG';
    return text.trim();
  }
  return text.trim();
}

/* ── 3D Voice Orb ── */
function VoiceOrbMesh({ active, processing }) {
  const ref = useRef();
  return (
    <mesh ref={ref} scale={active ? 1.15 : 1}>
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        color={processing ? '#f59e0b' : active ? '#10b981' : '#06b6d4'}
        emissive={processing ? '#f59e0b' : active ? '#10b981' : '#3b82f6'}
        emissiveIntensity={active || processing ? 2 : 0.5}
        wireframe
      />
    </mesh>
  );
}

const FIELD_LABELS = {
  name: 'नाम / Name', age: 'उम्र / Age',
  annualIncome: 'सालाना आय / Income', category: 'वर्ग / Category',
  gender: 'लिंग / Gender', state: 'राज्य / State',
  district: 'जिला / District', purpose: 'उद्देश्य / Purpose',
  loanAmount: 'ऋण राशि / Loan Amount',
};

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export default function VoiceIntakePage() {
  const navigate = useNavigate();
  const { setUserProfile, language, setLanguage } = useStore();

  const [lang, setLang] = useState(language || 'hi');
  const [step, setStep] = useState(0);           // current question index
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '', age: '', annualIncome: '', category: '',
    gender: '', state: '', district: '', purpose: '', loanAmount: '',
  });

  const filledCount = Object.values(profile).filter(v => v !== '').length;
  const totalFields = QUESTIONS.length;

  /* Auto-scroll */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  /* Ask first question on mount */
  useEffect(() => { askQuestion(0, lang); }, []);

  function pushMsg(speaker, text, tag = null) {
    setMessages(prev => [...prev, {
      speaker, text, tag,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  }

  function askQuestion(idx, currentLang) {
    if (idx >= QUESTIONS.length) return;
    const q = QUESTIONS[idx][currentLang];
    pushMsg('ai', q);
    setTimeout(() => speak(q, currentLang), 200);
  }

  /* Toggle mic */
  const handleMicClick = () => {
    if (listening) { stopListening(); setListening(false); return; }

    setListening(true);
    startListening(
      lang,
      (text, isFinal) => {
        if (!isFinal) return;
        setListening(false);

        if (!text || text.trim().length < 2) {
          pushMsg('ai', lang === 'hi' ? 'मुझे सुनाई नहीं दिया, कृपया दोबारा बोलें।' : 'I could not hear you. Please try again.');
          return;
        }

        pushMsg('user', text);
        setProcessing(true);

        const currentField = QUESTIONS[step].field;
        const parsed = parseAnswer(currentField, text, lang);

        const updated = { ...profile, [currentField]: parsed };
        setProfile(updated);
        setUserProfile(updated);

        const nextStep = step + 1;
        setStep(nextStep);

        setTimeout(() => {
          setProcessing(false);
          if (nextStep >= QUESTIONS.length) {
            // All done
            const done = lang === 'hi'
              ? `✅ शुक्रिया! सारी जानकारी मिल गई। आपके लिए सबसे अच्छी योजनाएं खोज रहा हूं...`
              : `✅ Thank you! All information collected. Finding the best schemes for you...`;
            pushMsg('ai', done);
            speak(done, lang);
            setUserProfile(updated);
            setTimeout(() => navigate('/schemes'), 2000);
          } else {
            askQuestion(nextStep, lang);
          }
        }, 400);
      },
      () => setListening(false),
    );
  };

  const switchLang = (l) => {
    setLang(l);
    setLanguage(l);
    // Re-ask current question in new language
    if (step < QUESTIONS.length) {
      const q = QUESTIONS[step][l];
      speak(q, l);
    }
  };

  const currentQuestion = step < QUESTIONS.length ? QUESTIONS[step][lang] : null;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row gap-0 pt-16 bg-[#0a0a1a] text-white">

      {/* ── LEFT PANEL ── */}
      <div className="w-full md:w-3/5 flex flex-col items-center px-4 md:px-10 py-8">

        {/* 3D Orb */}
        <div className="relative w-52 h-52 md:w-64 md:h-64 mb-4">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} color="#06b6d4" intensity={3} />
            <pointLight position={[-5, -5, 5]} color="#3b82f6" intensity={1.5} />
            <VoiceOrbMesh active={listening} processing={processing} />
          </Canvas>
          <div className={`absolute inset-0 rounded-full pointer-events-none transition-all duration-500
            ${listening ? 'shadow-[0_0_80px_rgba(16,185,129,0.5)]' : processing ? 'shadow-[0_0_60px_rgba(245,158,11,0.4)]' : ''}`} />
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md mb-2">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Question {Math.min(step + 1, totalFields)} of {totalFields}</span>
            <span>{filledCount}/{totalFields} filled</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(filledCount / totalFields) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            />
          </div>
        </div>

        {/* Status */}
        <motion.p
          key={listening ? 'l' : processing ? 'p' : 'i'}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className={`text-xs font-semibold tracking-widest uppercase mb-5
            ${listening ? 'text-emerald-400' : processing ? 'text-amber-400' : 'text-cyan-400/50'}`}
        >
          {listening ? '🎤 Listening...' : processing ? '⚙️ Processing...' : '● Tap mic to answer'}
        </motion.p>

        {/* Language toggle */}
        <div className="flex bg-slate-800/80 rounded-full p-1 border border-white/10 mb-6">
          {['hi', 'en'].map(l => (
            <button key={l} onClick={() => switchLang(l)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${lang === l ? 'bg-cyan-600 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-white'}`}>
              {l === 'hi' ? 'हिंदी' : 'English'}
            </button>
          ))}
        </div>

        {/* Chat window */}
        <div className="w-full max-w-2xl flex-1 backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-4 h-72 overflow-y-auto flex flex-col gap-3 shadow-2xl mb-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.speaker === 'user'
                    ? 'bg-cyan-900/60 border border-cyan-500/30 text-cyan-50 rounded-br-sm'
                    : 'bg-emerald-900/50 border border-emerald-500/30 text-emerald-50 rounded-bl-sm'}`}>
                  {msg.text}
                  <div className="text-[10px] opacity-40 mt-0.5 text-right">{msg.time}</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {(listening || processing) && (
            <div className="flex gap-1.5 px-3 py-2">
              {[0, 0.2, 0.4].map(d => (
                <motion.div key={d} animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay: d }}
                  className="w-2 h-2 bg-cyan-400 rounded-full" />
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Mic button */}
        <motion.button
          whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}
          onClick={handleMicClick}
          disabled={processing || step >= totalFields}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed
            ${listening
              ? 'bg-red-500 shadow-[0_0_50px_rgba(239,68,68,0.8)] scale-110'
              : 'bg-cyan-600 shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:bg-cyan-500'}`}
        >
          {listening ? '⏹' : '🎤'}
        </motion.button>
      </div>

      {/* ── RIGHT PANEL: Profile card ── */}
      <div className="hidden md:flex w-2/5 flex-col py-8 pr-8 pl-4">
        <div className="backdrop-blur-xl bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col h-full shadow-2xl">

          <h2 className="text-xl font-bold text-emerald-400 mb-2 flex items-center gap-2">
            <span>📋</span> Extracted Profile
          </h2>

          {/* Step indicator */}
          {currentQuestion && (
            <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 bg-cyan-950/50 border border-cyan-500/20 rounded-xl text-sm text-cyan-300">
              <span className="text-xs text-cyan-500 block mb-1 uppercase tracking-wider">Now asking →</span>
              {currentQuestion}
            </motion.div>
          )}

          {/* Fields */}
          <div className="flex flex-col gap-2.5 overflow-y-auto flex-grow">
            {QUESTIONS.map(({ field }, i) => {
              const val = profile[field];
              const filled = val !== '';
              const isCurrent = step === i && step < totalFields;
              return (
                <motion.div key={field}
                  animate={isCurrent ? { borderColor: 'rgba(6,182,212,0.5)' } : {}}
                  className={`flex justify-between items-center p-2.5 rounded-xl border transition-all duration-300
                    ${filled ? 'bg-emerald-900/20 border-emerald-500/20' : isCurrent ? 'bg-cyan-950/30 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]' : 'bg-slate-900/30 border-white/5'}`}
                >
                  <span className={`text-xs font-medium ${isCurrent ? 'text-cyan-400' : filled ? 'text-emerald-400/80' : 'text-slate-500'}`}>
                    {isCurrent && '▸ '}{FIELD_LABELS[field]}
                  </span>
                  <span className={`text-sm font-semibold flex items-center gap-1.5 ${filled ? 'text-white' : 'text-slate-600'}`}>
                    {filled ? (
                      <>
                        {field === 'annualIncome' || field === 'loanAmount'
                          ? `₹${Number(val).toLocaleString('en-IN')}`
                          : val}
                        <span className="text-emerald-400 text-xs">✓</span>
                      </>
                    ) : <span className="text-xs italic">—</span>}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Manual skip to schemes if 5+ filled */}
          <motion.button
            disabled={filledCount < 5}
            onClick={() => navigate('/schemes')}
            whileHover={filledCount >= 5 ? { scale: 1.02 } : {}}
            className="mt-5 w-full py-3 rounded-xl font-bold text-sm transition-all
              bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
              hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {filledCount >= 5 ? `Find Schemes (${filledCount}/${totalFields} filled) →` : `Answer ${5 - filledCount} more questions`}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
