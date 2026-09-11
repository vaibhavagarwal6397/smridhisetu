import { schemes } from '../data/mockData.js';

/**
 * Deterministic Scheme Matcher
 * Matches user profile against available schemes.
 * 
 * @param {Object} userProfile 
 * @param {number} userProfile.age
 * @param {number} userProfile.annualIncome
 * @param {string} userProfile.category
 * @param {string} userProfile.gender
 * @param {string} userProfile.state
 * @param {string} userProfile.purpose
 * @param {number} userProfile.loanAmount
 * @returns {Array} Array of matched schemes sorted by eligibility score
 */
export function matchSchemes(userProfile) {
  const { age, annualIncome, category, gender, loanAmount } = userProfile;
  const matched = [];

  for (const scheme of schemes) {
    let score = 100;
    const reasons = [];

    // Category match
    if (scheme.categories && scheme.categories.length > 0) {
      if (!scheme.categories.includes(category)) {
        score -= 50; // Major penalty
        reasons.push(`Category ${category} not prioritized. Priority: ${scheme.categories.join(', ')}`);
      } else {
        reasons.push(`Category ${category} is eligible.`);
      }
    }

    // Income limit match
    if (scheme.maxIncome && annualIncome > scheme.maxIncome) {
      score = 0; // Disqualified
      reasons.push(`Income exceeds maximum limit of ₹${scheme.maxIncome}.`);
    } else if (scheme.maxIncome) {
      reasons.push(`Income is within limit.`);
    }

    // Age limit match
    if (scheme.minAge && age < scheme.minAge) {
      score = 0;
      reasons.push(`Age below minimum requirement of ${scheme.minAge}.`);
    }
    if (scheme.maxAge && age > scheme.maxAge) {
      score = 0;
      reasons.push(`Age above maximum limit of ${scheme.maxAge}.`);
    }

    // Loan amount match
    if (scheme.minLoan && loanAmount < scheme.minLoan) {
      score = 0;
      reasons.push(`Loan amount below minimum requirement of ₹${scheme.minLoan}.`);
    }
    if (scheme.maxLoan && loanAmount > scheme.maxLoan) {
      score -= 20;
      reasons.push(`Loan amount exceeds standard maximum of ₹${scheme.maxLoan}.`);
    } else if (scheme.maxLoan) {
      reasons.push(`Loan amount is within limits.`);
    }

    if (score > 0) {
      matched.push({
        scheme,
        eligibilityScore: Math.max(score, 0),
        reasons
      });
    }
  }

  // Sort by highest score first
  return matched.sort((a, b) => b.eligibilityScore - a.eligibilityScore);
}
