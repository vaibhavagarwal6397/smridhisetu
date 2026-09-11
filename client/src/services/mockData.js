export const mockSchemes = [
  { id: 'pmajay', name: 'PM-AJAY', maxLoan: 50000, interestRate: 0, subsidy: 50000, categories: ['SC'], description: 'Grant for income < ₹2.5L' },
  { id: 'nsfdc', name: 'NSFDC Term Loan', maxLoan: 4000000, interestRate: 7, subsidy: 0, femaleRebate: 0.5, categories: ['SC'], description: 'Concessional credit up to 40L' },
  { id: 'nbcfdc', name: 'NBCFDC General', maxLoan: 1500000, interestRate: 6, subsidy: 0, categories: ['OBC'], description: 'Credit for Backward Classes' }
];

export const mockBranches = [
  { id: 'b1', name: 'Canara Bank, Lucknow', distance: '2.5 km', npaRatio: 2.1, score: 92 },
  { id: 'b2', name: 'SBI, Gomti Nagar', distance: '4.0 km', npaRatio: 3.5, score: 85 },
  { id: 'b3', name: 'Bank of Baroda, Hazratganj', distance: '5.2 km', npaRatio: 1.8, score: 88 }
];

export const mockFinancials = {
  emi: 1250, subsidy: 50000, effectiveRate: 6.5, moratorium: 6, netDisbursement: 450000
};
