/**
 * Mock data for SamriddhiSetu
 */

export const schemes = [
  { 
    id: 'SCH-001',
    name: 'PM-AJAY', 
    ministry: 'MoSJE', 
    maxIncome: 250000, 
    grantAmount: 50000, 
    categories: ['OBC', 'SC', 'BC', 'DNT'], 
    interestRate: 4, 
    maxLoan: 500000, 
    moratoriumMonths: 6 
  },
  { 
    id: 'SCH-002',
    name: 'NSFDC', 
    maxLoan: 4000000, 
    interestRate: 7, 
    femaleRebate: 0.5, 
    categories: ['SC'], 
    minAge: 18, 
    maxAge: 55 
  },
  { 
    id: 'SCH-003',
    name: 'NBCFDC', 
    maxLoan: 1500000, 
    interestRate: 6, 
    categories: ['OBC', 'BC', 'DNT'], 
    minAge: 18 
  },
  { 
    id: 'SCH-004',
    name: 'NSKFDC', 
    maxLoan: 1500000, 
    interestRate: 4, 
    categories: ['SafaiKaramchari'], 
    subsidyPercent: 50 
  },
  { 
    id: 'SCH-005',
    name: 'PMEGP', 
    maxLoan: 2500000, 
    subsidyPercent: 35, 
    categories: ['SC', 'ST', 'OBC', 'Women', 'Minorities'] 
  },
  { 
    id: 'SCH-006',
    name: 'Stand-Up India', 
    minLoan: 1000000, 
    maxLoan: 10000000, 
    interestRate: 7.5, 
    categories: ['SC', 'ST', 'Women'] 
  }
];

export const branches = [
  { id: 'BR-001', name: 'Canara Bank Lucknow', bank: 'Canara Bank', type: 'PSU', lat: 26.8467, lng: 80.9462, state: 'UP', district: 'Lucknow', npaRatio: 0.05, fundAvailability: 80, avgTATDays: 14, supportedSchemes: ['SCH-001', 'SCH-002', 'SCH-003', 'SCH-004'] },
  { id: 'BR-002', name: 'UP Gramin Bank Varanasi', bank: 'UP Gramin Bank', type: 'RRB', lat: 25.3176, lng: 82.9739, state: 'UP', district: 'Varanasi', npaRatio: 0.12, fundAvailability: 60, avgTATDays: 20, supportedSchemes: ['SCH-001', 'SCH-005', 'SCH-006'] },
  { id: 'BR-003', name: 'SBI Prayagraj', bank: 'State Bank of India', type: 'PSU', lat: 25.4358, lng: 81.8463, state: 'UP', district: 'Prayagraj', npaRatio: 0.04, fundAvailability: 95, avgTATDays: 10, supportedSchemes: ['SCH-001', 'SCH-002', 'SCH-003', 'SCH-004', 'SCH-005', 'SCH-006'] },
  { id: 'BR-004', name: 'Punjab National Bank Kanpur', bank: 'Punjab National Bank', type: 'PSU', lat: 26.4499, lng: 80.3319, state: 'UP', district: 'Kanpur', npaRatio: 0.08, fundAvailability: 75, avgTATDays: 15, supportedSchemes: ['SCH-002', 'SCH-003', 'SCH-004'] },
  { id: 'BR-005', name: 'Bank of Baroda Agra', bank: 'Bank of Baroda', type: 'PSU', lat: 27.1767, lng: 78.0081, state: 'UP', district: 'Agra', npaRatio: 0.06, fundAvailability: 85, avgTATDays: 12, supportedSchemes: ['SCH-001', 'SCH-005', 'SCH-006'] },
  { id: 'BR-006', name: 'Union Bank Meerut', bank: 'Union Bank of India', type: 'PSU', lat: 28.9845, lng: 77.7064, state: 'UP', district: 'Meerut', npaRatio: 0.10, fundAvailability: 70, avgTATDays: 18, supportedSchemes: ['SCH-001', 'SCH-002', 'SCH-003'] },
  { id: 'BR-007', name: 'HDFC Bank Noida', bank: 'HDFC Bank', type: 'Private', lat: 28.5355, lng: 77.3910, state: 'UP', district: 'Gautam Buddha Nagar', npaRatio: 0.02, fundAvailability: 100, avgTATDays: 7, supportedSchemes: ['SCH-005', 'SCH-006'] },
  { id: 'BR-008', name: 'ICICI Bank Ghaziabad', bank: 'ICICI Bank', type: 'Private', lat: 28.6692, lng: 77.4538, state: 'UP', district: 'Ghaziabad', npaRatio: 0.03, fundAvailability: 90, avgTATDays: 8, supportedSchemes: ['SCH-005', 'SCH-006'] },
  { id: 'BR-009', name: 'Central Bank of India Gorakhpur', bank: 'Central Bank of India', type: 'PSU', lat: 26.7606, lng: 83.3732, state: 'UP', district: 'Gorakhpur', npaRatio: 0.15, fundAvailability: 50, avgTATDays: 25, supportedSchemes: ['SCH-001', 'SCH-002', 'SCH-004'] },
  { id: 'BR-010', name: 'Indian Bank Bareilly', bank: 'Indian Bank', type: 'PSU', lat: 28.3670, lng: 79.4304, state: 'UP', district: 'Bareilly', npaRatio: 0.07, fundAvailability: 65, avgTATDays: 16, supportedSchemes: ['SCH-001', 'SCH-003'] },
  { id: 'BR-011', name: 'Axis Bank Aligarh', bank: 'Axis Bank', type: 'Private', lat: 27.8974, lng: 78.0880, state: 'UP', district: 'Aligarh', npaRatio: 0.04, fundAvailability: 88, avgTATDays: 9, supportedSchemes: ['SCH-005', 'SCH-006'] },
  { id: 'BR-012', name: 'Aryavart Bank Jhansi', bank: 'Aryavart Bank', type: 'RRB', lat: 25.4484, lng: 78.5685, state: 'UP', district: 'Jhansi', npaRatio: 0.18, fundAvailability: 40, avgTATDays: 22, supportedSchemes: ['SCH-001', 'SCH-002', 'SCH-003'] }
];

export const sampleApplications = [
  { id: 'APP-001', userId: 'U-123', schemeId: 'SCH-001', branchId: 'BR-001', status: 'Pending', appliedAt: '2026-09-01T10:00:00Z' },
  { id: 'APP-002', userId: 'U-124', schemeId: 'SCH-002', branchId: 'BR-003', status: 'Approved', appliedAt: '2026-08-15T14:30:00Z', sanctionedAt: '2026-08-25T09:15:00Z' },
  { id: 'APP-003', userId: 'U-125', schemeId: 'SCH-005', branchId: 'BR-007', status: 'Disbursed', appliedAt: '2026-07-10T11:20:00Z', disbursedAt: '2026-08-01T10:00:00Z' },
  { id: 'APP-004', userId: 'U-126', schemeId: 'SCH-003', branchId: 'BR-004', status: 'Rejected', appliedAt: '2026-09-05T16:45:00Z', rejectedAt: '2026-09-08T12:00:00Z', rejectionReason: 'Low credit score' },
  { id: 'APP-005', userId: 'U-127', schemeId: 'SCH-006', branchId: 'BR-008', status: 'Under Review', appliedAt: '2026-09-09T09:30:00Z' }
];
