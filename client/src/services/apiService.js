import { mockSchemes, mockBranches, mockFinancials } from './mockData.js';

const BASE_URL = 'http://localhost:5001/api';

const fetchWithTimeout = async (resource, options = {}) => {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, { ...options, signal: controller.signal });
  clearTimeout(id);
  return response;
};

export const matchSchemes = async (userProfile) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/match-schemes`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userProfile)
    });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    // Backend returns [{scheme:{...}, eligibilityScore, reasons}] — flatten it
    const raw = data.matchedSchemes || data.schemes || [];
    const schemes = raw.map(m => ({
      ...(m.scheme || m),
      eligibilityScore: m.eligibilityScore ?? 100,
      reasons: m.reasons ?? [],
    }));
    return { schemes };
  } catch (e) {
    console.warn('Backend unavailable, using mock schemes');
    return { schemes: mockSchemes };
  }
};

export const calculateFinancials = async (params) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/calculate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return mockFinancials;
  }
};

export const routeBranches = async (params) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/route-branches`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return { branches: mockBranches };
  }
};

export const createApplication = async (params) => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/apply`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params)
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (e) {
    return { applicationId: 'SS-PMAJAY-CNBK-1234' };
  }
};

export const getApplication = async (id) => { return { status: 'Sanctioned', id }; };

/** Extract facts from voice transcript using Gemini AI */
export const extractFacts = async (transcript, language = 'hi') => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/extract-facts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language })
    });
    if (!res.ok) throw new Error('API Error');
    return await res.json(); // { facts: {...}, source: 'gemini' | 'fallback' }
  } catch (e) {
    console.warn('extractFacts fallback:', e.message);
    return {
      facts: { name: null, age: null, annualIncome: null, category: null, gender: null, state: null, district: null, purpose: null, loanAmount: null },
      source: 'offline'
    };
  }
};

/** Get Gemini AI scheme recommendation in Hindi/English */
export const getAIRecommendation = async (userProfile, matchedSchemes, language = 'hi') => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/ai-recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userProfile, matchedSchemes, language })
    });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.recommendation;
  } catch (e) {
    return language === 'hi'
      ? 'आपकी प्रोफ़ाइल के आधार पर PM-AJAY योजना सबसे उपयुक्त है।'
      : 'Based on your profile, PM-AJAY scheme is the best match for you.';
  }
};

/** Get next AI-generated interview question for missing profile field */
export const getNextQuestion = async (currentProfile, language = 'hi') => {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/next-question`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentProfile, language })
    });
    if (!res.ok) throw new Error('API Error');
    const data = await res.json();
    return data.question;
  } catch (e) {
    return language === 'hi' ? 'कृपया अपनी जानकारी दें।' : 'Please provide your information.';
  }
};

