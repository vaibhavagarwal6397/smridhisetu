import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a formatted Sanction ID.
 * Example: 'SS-PMAJAY-CNBK-20260911-A7X3'
 * 
 * @param {Object} scheme 
 * @param {Object} branch 
 * @returns {string} Sanction ID
 */
export function generateSanctionId(scheme, branch) {
  const prefix = 'SS';
  const schemeName = scheme.name ? scheme.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().substring(0, 6) : 'UNKNWN';
  
  // Extract simple acronym for bank name
  let bankAcronym = 'BANK';
  if (branch.bank) {
    bankAcronym = branch.bank.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 4);
    if (bankAcronym.length < 4) {
      bankAcronym = bankAcronym.padEnd(4, 'X');
    }
  }

  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = uuidv4().substring(0, 4).toUpperCase();

  return `${prefix}-${schemeName}-${bankAcronym}-${dateStr}-${randomSuffix}`;
}

/**
 * Creates a full application object with initial status
 * 
 * @param {Object} userProfile 
 * @param {Object} scheme 
 * @param {Object} branch 
 * @param {Object} financials 
 * @returns {Object} Application object
 */
export function createApplication(userProfile, scheme, branch, financials) {
  const applicationId = uuidv4();
  const sanctionId = generateSanctionId(scheme, branch);

  return {
    applicationId,
    sanctionId,
    status: 'Under Review',
    statusPipeline: [
      { step: 'Applied', completed: true, timestamp: new Date().toISOString() },
      { step: 'Under Review', completed: true, timestamp: new Date().toISOString() },
      { step: 'Approved', completed: false, timestamp: null },
      { step: 'Disbursed', completed: false, timestamp: null }
    ],
    applicant: userProfile, // In real world, this would be tokenized
    scheme: {
      id: scheme.id,
      name: scheme.name
    },
    branch: {
      id: branch.id,
      name: branch.name,
      bank: branch.bank
    },
    financials,
    appliedAt: new Date().toISOString()
  };
}
