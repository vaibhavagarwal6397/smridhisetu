import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

/**
 * Extract structured user profile facts from a voice/text transcript.
 * Uses Gemini to perform structured output extraction.
 * @param {string} transcript - Raw transcript text from voice input
 * @param {string} language - 'hi' | 'en'
 * @returns {Promise<Object>} Extracted profile fields
 */
export async function extractFactsFromTranscript(transcript, language = 'hi') {
  const prompt = `
You are an AI assistant for SamriddhiSetu, a government credit routing system for rural India.
Extract the following information from this voice transcript. 
Return ONLY a valid JSON object with no markdown, no explanation, just the JSON.

Transcript: "${transcript}"

Extract these fields (use null for any missing field):
{
  "name": "Full name of applicant",
  "age": "Age as integer (number only)",
  "annualIncome": "Annual income in rupees as integer (convert if given in lakhs: 1 lakh = 100000)",
  "category": "Social category: one of [SC, ST, OBC, BC, DNT, SafaiKaramchari, General]",
  "gender": "Male or Female or Other",
  "state": "Indian state name",
  "district": "District name",
  "purpose": "Loan purpose: one of [Business, Education, Housing, Agriculture, Vehicle, SHG, Rehabilitation]",
  "loanAmount": "Requested loan amount in rupees as integer"
}

Rules:
- If user says "mai OBC hoon" → category: "OBC"
- If user says "50 hazaar" → loanAmount: 50000
- If user says "do lakh income" → annualIncome: 200000
- If user says "padhai ke liye" → purpose: "Education"
- Be smart about Hindi/English mix (Hinglish)
- Return null for fields not mentioned
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any markdown code fences if present
    const cleaned = text.replace(/```json|```/g, '').trim();
    const facts = JSON.parse(cleaned);

    // Sanitize numeric fields
    if (facts.age) facts.age = parseInt(facts.age);
    if (facts.annualIncome) facts.annualIncome = parseInt(facts.annualIncome);
    if (facts.loanAmount) facts.loanAmount = parseInt(facts.loanAmount);

    return { success: true, facts };
  } catch (err) {
    console.error('[Gemini] extractFacts error:', err.message);
    return {
      success: false,
      error: err.message,
      facts: {
        name: null, age: null, annualIncome: null, category: null,
        gender: null, state: null, district: null, purpose: null, loanAmount: null
      }
    };
  }
}

/**
 * Generate an AI-powered scheme recommendation explanation in Hindi/English.
 * Uses Gemini to produce a natural language summary for the matched schemes.
 * @param {Object} userProfile - Extracted user profile
 * @param {Array} matchedSchemes - Schemes matched by rules engine
 * @param {string} language - 'hi' | 'en'
 * @returns {Promise<string>} Natural language recommendation
 */
export async function generateSchemeRecommendation(userProfile, matchedSchemes, language = 'hi') {
  const schemeList = matchedSchemes
    .slice(0, 3)
    .map((m, i) => {
      const s = m.scheme || m;
      return `${i + 1}. ${s.name}: Max loan ₹${(s.maxLoan || 0).toLocaleString('en-IN')}, Interest ${s.interestRate || 0}%, Eligibility score: ${m.eligibilityScore || 100}%`;
    })
    .join('\n');

  const prompt = language === 'hi'
    ? `
आप SamriddhiSetu AI सहायक हैं। नीचे दिए गए आवेदक प्रोफ़ाइल के आधार पर, 2-3 वाक्यों में हिंदी में बताएं कि कौन सी सरकारी योजना सबसे उपयुक्त है और क्यों।

आवेदक:
- नाम: ${userProfile.name || 'आवेदक'}
- आय: ₹${(userProfile.annualIncome || 0).toLocaleString('en-IN')} वार्षिक
- वर्ग: ${userProfile.category || 'OBC'}
- उद्देश्य: ${userProfile.purpose || 'व्यवसाय'}

मिलान योजनाएं:
${schemeList}

केवल 2-3 वाक्यों में सरल हिंदी में जवाब दें:
`
    : `
You are SamriddhiSetu AI assistant. Based on the applicant profile below, explain in 2-3 sentences which government scheme is the best match and why.

Applicant:
- Name: ${userProfile.name || 'Applicant'}
- Income: ₹${(userProfile.annualIncome || 0).toLocaleString('en-IN')} per year
- Category: ${userProfile.category || 'OBC'}
- Purpose: ${userProfile.purpose || 'Business'}

Matched Schemes:
${schemeList}

Reply in 2-3 simple sentences only:
`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('[Gemini] generateRecommendation error:', err.message);
    return language === 'hi'
      ? 'आपकी प्रोफ़ाइल के आधार पर PM-AJAY योजना सबसे उपयुक्त है।'
      : 'Based on your profile, PM-AJAY scheme is the best match for you.';
  }
}

/**
 * Generate a conversational AI question for the next missing profile field.
 * Powers the voice interview flow.
 * @param {Object} currentProfile - Partially filled profile
 * @param {string} language - 'hi' | 'en'
 * @returns {Promise<string>} Next question to ask
 */
export async function getNextQuestion(currentProfile, language = 'hi') {
  const missingFields = Object.entries(currentProfile)
    .filter(([, v]) => !v || v === '')
    .map(([k]) => k);

  if (missingFields.length === 0) {
    return language === 'hi'
      ? 'धन्यवाद! आपकी सभी जानकारी दर्ज हो गई है। अब मैं आपके लिए योजनाएं खोज रहा हूं।'
      : 'Thank you! All your information has been recorded. Finding schemes for you now.';
  }

  const nextField = missingFields[0];
  const fieldQuestions = {
    hi: {
      name: 'आपका नाम क्या है?',
      age: 'आपकी उम्र कितनी है?',
      annualIncome: 'आपकी सालाना आय कितनी है?',
      category: 'आप किस वर्ग से हैं? जैसे SC, ST, OBC, या सामान्य?',
      gender: 'आप पुरुष हैं या महिला?',
      state: 'आप किस राज्य में रहते हैं?',
      district: 'आपका जिला कौन सा है?',
      purpose: 'आप ऋण किस काम के लिए चाहते हैं? जैसे व्यवसाय, शिक्षा, या घर?',
      loanAmount: 'आपको कितने रुपए का ऋण चाहिए?',
    },
    en: {
      name: 'What is your full name?',
      age: 'How old are you?',
      annualIncome: 'What is your annual income in rupees?',
      category: 'What is your social category? Such as SC, ST, OBC, or General?',
      gender: 'What is your gender?',
      state: 'Which state do you live in?',
      district: 'Which district are you from?',
      purpose: 'What do you need the loan for? Such as business, education, or housing?',
      loanAmount: 'How much loan amount are you looking for?',
    }
  };

  return fieldQuestions[language]?.[nextField]
    || (language === 'hi' ? `कृपया ${nextField} बताएं।` : `Please tell me your ${nextField}.`);
}
