import { PlanTier, PlanAmount } from '../types';

/**
 * Extracts 2-character uppercase initials from the user's full name.
 * Examples:
 * - "RAINAKSH NITYAM" -> "RN"
 * - "Vikas Kumar" -> "VK"
 * - "Rahul Sharma" -> "RS"
 * - "Nityam" (single word) -> "NI"
 * - Empty / Fallback -> "RN"
 */
export function extractNameInitials(fullName: string = ''): string {
  if (!fullName) return 'RN';
  const clean = fullName.trim().toUpperCase().replace(/[^A-Z\s]/g, '');
  const words = clean.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const firstInitial = words[0].charAt(0);
    const lastInitial = words[words.length - 1].charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  } else if (words.length === 1 && words[0].length >= 2) {
    return words[0].substring(0, 2).toUpperCase();
  } else if (words.length === 1 && words[0].length === 1) {
    return `${words[0]}X`.toUpperCase();
  }
  return 'RN';
}

/**
 * Normalizes plan tier/amount to official numeric plan amount ('100', '500', '1000').
 */
export function getPlanNumericAmount(plan: PlanTier | PlanAmount | string | number = '1000'): '100' | '500' | '1000' {
  const str = plan.toString().toLowerCase().trim();
  if (str === 'royal' || str === '1000' || str === 'crown' || str === 'vip') {
    return '1000';
  } else if (str === 'platinum' || str === '500') {
    return '500';
  } else {
    return '100';
  }
}

/**
 * Generates a Permanent, Unique, Fixed and Non-Editable RainAksh User ID.
 *
 * Official RainAksh Format Pattern:
 * RNX + [PlanAmount] + [NameInitials] + [SequentialNumber]
 *
 * Example:
 * If user "RAINAKSH NITYAM" joins with 1000 plan at 1st position:
 * -> Plan: 1000
 * -> Initials: RN (RAINAKSH NITYAM)
 * -> Position: 01
 * -> Final User ID: RNX1000RN01
 *
 * If next user "Rahul Sharma" joins with 500 plan:
 * -> RNX500RS01 (or sequential 02 if RS already exists in 500)
 */
export function generateRainAkshUserId(
  plan: PlanTier | PlanAmount | string | number = '1000',
  fullName: string = 'Member',
  existingIdsOrUsers: Array<string | { userId?: string; id?: string }> = []
): string {
  const planAmount = getPlanNumericAmount(plan);
  const initials = extractNameInitials(fullName);

  // Extract all existing IDs into a normalized Set
  const existingSet = new Set<string>();
  existingIdsOrUsers.forEach((item) => {
    if (typeof item === 'string') {
      existingSet.add(item.trim().toUpperCase());
    } else if (item && typeof item === 'object') {
      if (item.userId) existingSet.add(item.userId.trim().toUpperCase());
      if (item.id) existingSet.add(item.id.trim().toUpperCase());
    }
  });

  // Calculate sequential count based on users enrolled in this plan amount
  let planCount = 0;
  existingSet.forEach((id) => {
    if (id.startsWith(`RNX${planAmount}`) || id.includes(`_${planAmount}_`)) {
      planCount++;
    }
  });

  // Start sequence at next sequential position (minimum 1)
  let seq = planCount + 1;
  let candidateId = `RNX${planAmount}${initials}${String(seq).padStart(2, '0')}`;

  // If candidate already exists, increment until strictly unique
  while (existingSet.has(candidateId)) {
    seq++;
    candidateId = `RNX${planAmount}${initials}${String(seq).padStart(2, '0')}`;
  }

  return candidateId;
}

/**
 * Backward compatibility alias pointing to the official RainAksh User ID Generator.
 */
export function generateTierFormattedId(
  tier: PlanTier | PlanAmount | string = '1000',
  fullName: string = 'Member',
  existingIdsOrUsers: Array<string | { userId?: string; id?: string }> = []
): string {
  return generateRainAkshUserId(tier, fullName, existingIdsOrUsers);
}

/**
 * Validates whether an ID matches the official RainAksh Network pattern (RNX[Plan][Initials][Seq] e.g. RNX1000RN01)
 * or legacy patterns (RX_2026_XXXXX, RX_MAIN_001).
 */
export function validateIdFormat(id: string): boolean {
  if (!id) return false;
  const clean = id.trim().toUpperCase();

  // Official format: RNX + (100|500|1000) + [A-Z]{2} + \d+ (e.g. RNX1000RN01)
  const officialRegex = /^RNX(100|500|1000)[A-Z]{2}\d+$/i;
  // Legacy formats for backwards compatibility
  const legacyRegex = /^RX_\d{4}_[A-Z0-9]+$/i;
  const rootRegex = /^RX_MAIN_\d+$/i;

  return officialRegex.test(clean) || legacyRegex.test(clean) || rootRegex.test(clean);
}

/**
 * Extracts plan tier metadata from an ID
 */
export function extractTierFromId(id: string): PlanTier | 'unknown' {
  if (!id) return 'unknown';
  const clean = id.trim().toUpperCase();

  // Check official format first
  if (clean.startsWith('RNX1000')) return 'royal';
  if (clean.startsWith('RNX500')) return 'platinum';
  if (clean.startsWith('RNX100')) return 'silver';

  // Legacy format checks
  if (clean === 'RX_MAIN_001' || clean === 'RX_SYSTEM') return 'royal';

  const parts = clean.split('_');
  if (parts.length === 3 && parts[2]) {
    const code = parts[2].charAt(0);
    if (code === 'C' || code === 'R') return 'royal';
    if (code === 'P') return 'platinum';
    if (code === 'S') return 'silver';
  }

  return 'unknown';
}
