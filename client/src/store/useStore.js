import { create } from 'zustand';

const useStore = create((set) => ({
  userProfile: {
    name: '',
    age: '',
    income: '',
    category: '',
    gender: '',
    state: '',
    district: '',
    purpose: '',
    loanAmount: ''
  },
  matchedSchemes: [],
  selectedScheme: null,
  financials: {},
  rankedBranches: [],
  selectedBranch: null,
  application: {
    id: null,
    status: 'idle',
    pipeline: []
  },
  voiceState: 'idle', // 'idle' | 'listening' | 'processing' | 'speaking'
  language: 'hi', // 'hi' | 'en'
  transcript: '',
  isOffline: false,

  // Actions
  setUserProfile: (profile) => set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),
  setSchemes: (schemes) => set({ matchedSchemes: schemes }),
  setSelectedScheme: (scheme) => set({ selectedScheme: scheme }),
  setFinancials: (financials) => set({ financials }),
  setBranches: (branches) => set({ rankedBranches: branches }),
  setSelectedBranch: (branch) => set({ selectedBranch: branch }),
  setApplication: (application) => set((state) => ({ application: { ...state.application, ...application } })),
  setVoiceState: (voiceState) => set({ voiceState }),
  setLanguage: (language) => set({ language }),
  setTranscript: (transcript) => set({ transcript }),
  setIsOffline: (isOffline) => set({ isOffline }),
  reset: () => set({
    userProfile: { name: '', age: '', income: '', category: '', gender: '', state: '', district: '', purpose: '', loanAmount: '' },
    matchedSchemes: [],
    selectedScheme: null,
    financials: {},
    rankedBranches: [],
    selectedBranch: null,
    application: { id: null, status: 'idle', pipeline: [] },
    transcript: '',
    voiceState: 'idle'
  })
}));

export default useStore;
