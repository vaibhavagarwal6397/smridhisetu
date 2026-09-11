/**
 * Financial Calculator for EMI, Interest, and Subsidy calculations.
 *
 * @param {Object} scheme - Scheme details
 * @param {number} loanAmount - Requested loan amount
 * @param {number} tenure - Tenure in months
 * @param {string} gender - Applicant's gender
 * @returns {Object} Financial details including EMI, totals, and net disbursement
 */
export function calculateFinancials(scheme, loanAmount, tenure, gender) {
  let effectiveRate = scheme.interestRate || 8.0; // Default if not specified

  // Apply female rebate if applicable
  if (gender && gender.toLowerCase() === 'female' && scheme.femaleRebate) {
    effectiveRate -= scheme.femaleRebate;
  }

  const monthlyRate = (effectiveRate / 12) / 100;
  
  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  let monthlyEMI = 0;
  if (monthlyRate > 0) {
    monthlyEMI = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
  } else {
    monthlyEMI = loanAmount / tenure;
  }

  const totalPayable = monthlyEMI * tenure;
  const totalInterest = totalPayable - loanAmount;

  let subsidyAmount = 0;
  if (scheme.subsidyPercent) {
    subsidyAmount = loanAmount * (scheme.subsidyPercent / 100);
  } else if (scheme.grantAmount) {
    subsidyAmount = scheme.grantAmount; // Flat grant amount
  }

  const netDisbursement = loanAmount - subsidyAmount; // Assuming subsidy is upfront for simplicity, or it's just tracked.

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalPayable: Math.round(totalPayable),
    subsidyAmount: Math.round(subsidyAmount),
    effectiveRate: effectiveRate.toFixed(2),
    moratoriumMonths: scheme.moratoriumMonths || 0,
    netDisbursement: Math.max(0, Math.round(netDisbursement))
  };
}
