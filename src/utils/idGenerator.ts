import { PlanTier, PlanAmount } from '../types';

/**
 * Generates a unique formatted ID (RX_2026_XXXXX) based on the specific plan tier
 * when user registration or verification is approved.
 *
 * Tier encoding scheme:
 * - Basic / Silver (₹100): 'S' tier code -> e.g., RX_2026_S7492
 * - Platinum (₹500): 'P' tier code -> e.g., RX_2026_P3819
 * - Royal Crown VIP (₹1000): 'C' / 'R' tier code -> e.g., RX_2026_C9921
 */
export function generateTierFormattedId(tier: PlanTier | PlanAmount | string = 'silver'): string {
  const currentYear = 2026;
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // exclude ambiguous 0, 1, O, I

  let tierCode = 'S';
  const normalized = tier.toString().toLowerCase();

  if (normalized === 'royal' || normalized === '1000' || normalized === 'crown') {
    tierCode = 'C'; // Crown VIP
  } else if (normalized === 'platinum' || normalized === '500') {
    tierCode = 'P'; // Platinum Shield
  } else {
    tierCode = 'S'; // Silver Basic
  }

  // Generate 4 randomized alphanumeric characters
  let randomSeq = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    randomSeq += chars.charAt(randomIndex);
  }

  return `RX_${currentYear}_${tierCode}${randomSeq}`;
}

/**
 * Validates whether an ID matches the official RainAksh Network pattern (RX_2026_XXXXX)
 */
export function validateIdFormat(id: string): boolean {
  if (!id) return false;
  // Match standard format RX_YYYY_XXXXX or legacy RX_MAIN_001
  const standardRegex = /^RX_\d{4}_[A-Z0-9]{5}$/i;
  const rootRegex = /^RX_MAIN_\d+$/i;
  return standardRegex.test(id.trim()) || rootRegex.test(id.trim());
}

/**
 * Extracts plan tier metadata from an ID
 */
export function extractTierFromId(id: string): PlanTier | 'unknown' {
  if (!id) return 'unknown';
  const clean = id.trim().toUpperCase();
  if (clean === 'RX_MAIN_001') return 'royal';

  const parts = clean.split('_');
  if (parts.length === 3 && parts[2]) {
    const code = parts[2].charAt(0);
    if (code === 'C') return 'royal';
    if (code === 'P') return 'platinum';
    if (code === 'S') return 'silver';
  }
  return 'unknown';
}
