import { v4 as uuidv4 } from 'uuid';

/**
 * Ephemeral Cache for DPDP Compliance.
 * Stores tokens mapping to real data with a TTL.
 */
class EphemeralCache {
  constructor(ttlMs = 300000) { // 5 mins default
    this.cache = new Map();
    this.ttlMs = ttlMs;
    
    // Cleanup interval
    setInterval(() => this.cleanup(), 60000);
  }

  set(key, value) {
    this.cache.set(key, { value, expiry: Date.now() + this.ttlMs });
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

const tokenCache = new EphemeralCache();

/**
 * DPDP Act Compliance Tokenizer
 * Replaces sensitive PII with tokens.
 * 
 * @param {Object} data Input data containing PII
 * @returns {Object} Tokenized data
 */
export function tokenizePII(data) {
  const tokenized = { ...data };
  
  if (tokenized.aadhaar) {
    const token = `TOK-${uuidv4().substring(0, 8).toUpperCase()}`;
    tokenCache.set(token, tokenized.aadhaar);
    tokenized.aadhaar = token;
  }

  if (tokenized.pan) {
    const token = `PAN-${uuidv4().substring(0, 8).toUpperCase()}`;
    tokenCache.set(token, tokenized.pan);
    tokenized.pan = token;
  }

  if (tokenized.phone) {
    const token = `PH-${uuidv4().substring(0, 8).toUpperCase()}`;
    tokenCache.set(token, tokenized.phone);
    tokenized.phone = token;
  }

  return tokenized;
}

/**
 * Detokenizes data by retrieving real PII from ephemeral cache.
 * 
 * @param {Object} tokenizedData Data containing tokens
 * @returns {Object} Data with real PII restored if tokens are still valid
 */
export function detokenizePII(tokenizedData) {
  const detokenized = { ...tokenizedData };

  if (detokenized.aadhaar && detokenized.aadhaar.startsWith('TOK-')) {
    const val = tokenCache.get(detokenized.aadhaar);
    if (val) detokenized.aadhaar = val;
  }

  if (detokenized.pan && detokenized.pan.startsWith('PAN-')) {
    const val = tokenCache.get(detokenized.pan);
    if (val) detokenized.pan = val;
  }

  if (detokenized.phone && detokenized.phone.startsWith('PH-')) {
    const val = tokenCache.get(detokenized.phone);
    if (val) detokenized.phone = val;
  }

  return detokenized;
}
