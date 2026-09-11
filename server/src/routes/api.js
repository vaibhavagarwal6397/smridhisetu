import express from 'express';
import { matchSchemes } from '../engine/rulesEngine.js';
import { calculateFinancials } from '../engine/financialCalculator.js';
import { routeToBranches } from '../engine/branchRouter.js';
import { createApplication } from '../services/sanctionService.js';
import { schemes, branches, sampleApplications } from '../data/mockData.js';
import { tokenizePII } from '../security/piiTokenizer.js';
import {
  extractFactsFromTranscript,
  generateSchemeRecommendation,
  getNextQuestion
} from '../services/geminiService.js';

const router = express.Router();

let applicationsStore = [...sampleApplications];

// POST /api/extract-facts — Real Gemini AI fact extraction from voice transcript
router.post('/extract-facts', async (req, res) => {
  const { transcript, language = 'hi' } = req.body;

  if (!transcript || transcript.trim().length < 3) {
    return res.status(400).json({ error: 'Transcript is required and must be non-empty.' });
  }

  try {
    const result = await extractFactsFromTranscript(transcript, language);
    if (!result.success) {
      // Fallback mock if Gemini fails
      return res.json({
        facts: { age: 30, annualIncome: 150000, category: 'OBC', gender: 'Male', state: 'UP', purpose: 'Business', loanAmount: 200000 },
        source: 'fallback'
      });
    }
    res.json({ facts: result.facts, source: 'gemini' });
  } catch (error) {
    console.error('[/extract-facts]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/ai-recommend — Gemini-powered scheme recommendation in Hindi/English
router.post('/ai-recommend', async (req, res) => {
  const { userProfile, matchedSchemes: incoming, language = 'hi' } = req.body;

  if (!userProfile || !incoming || !incoming.length) {
    return res.status(400).json({ error: 'userProfile and matchedSchemes are required.' });
  }

  try {
    const recommendation = await generateSchemeRecommendation(userProfile, incoming, language);
    res.json({ recommendation, language });
  } catch (error) {
    console.error('[/ai-recommend]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/next-question — Get next conversational AI question for missing profile field
router.post('/next-question', async (req, res) => {
  const { currentProfile, language = 'hi' } = req.body;

  if (!currentProfile) {
    return res.status(400).json({ error: 'currentProfile is required.' });
  }

  try {
    const question = await getNextQuestion(currentProfile, language);
    res.json({ question, language });
  } catch (error) {
    console.error('[/next-question]', error.message);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/match-schemes
router.post('/match-schemes', (req, res) => {
  try {
    const userProfile = req.body;
    const matched = matchSchemes(userProfile);
    res.json({ matchedSchemes: matched });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/calculate
router.post('/calculate', (req, res) => {
  try {
    const { schemeId, loanAmount, tenure, gender } = req.body;
    const scheme = schemes.find(s => s.id === schemeId);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    
    const financials = calculateFinancials(scheme, loanAmount, tenure || 36, gender);
    res.json({ financials });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/route-branches
router.post('/route-branches', (req, res) => {
  try {
    const { userLocation, matchedSchemes } = req.body; // userLocation: {lat, lng}
    if (!matchedSchemes || !Array.isArray(matchedSchemes)) {
      return res.status(400).json({ error: 'Invalid matchedSchemes array' });
    }
    
    const rankedBranches = routeToBranches(userLocation, matchedSchemes, branches);
    res.json({ rankedBranches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/apply
router.post('/apply', (req, res) => {
  try {
    const { userProfile, schemeId, branchId, loanAmount, tenure } = req.body;
    
    const scheme = schemes.find(s => s.id === schemeId);
    const branch = branches.find(b => b.id === branchId);
    
    if (!scheme || !branch) {
      return res.status(400).json({ error: 'Invalid scheme or branch' });
    }

    // Tokenize PII before creating application (DPDP Compliance)
    const tokenizedProfile = tokenizePII(userProfile);

    const financials = calculateFinancials(scheme, loanAmount, tenure || 36, tokenizedProfile.gender);
    const newApplication = createApplication(tokenizedProfile, scheme, branch, financials);
    
    applicationsStore.push(newApplication);

    res.status(201).json({ 
      message: 'Application created successfully',
      application: newApplication
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/schemes
router.get('/schemes', (req, res) => {
  res.json({ schemes });
});

// GET /api/applications
router.get('/applications', (req, res) => {
  res.json({ applications: applicationsStore });
});

// GET /api/applications/:id
router.get('/applications/:id', (req, res) => {
  const app = applicationsStore.find(a => a.id === req.params.id || a.applicationId === req.params.id);
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }
  
  // Detokenize PII if needed for authorized viewing
  // const fullApp = { ...app, applicant: detokenizePII(app.applicant) };
  res.json({ application: app });
});

export default router;
