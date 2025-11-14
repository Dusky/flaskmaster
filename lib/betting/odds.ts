/**
 * Simple odds calculation for The Compound betting system
 * Uses fixed odds based on contestant rankings to keep it straightforward
 */

interface Contestant {
  id: string;
  trackedStats?: {
    totalPoints?: number;
    [key: string]: any;
  };
}

/**
 * Calculate odds for a task/episode winner bet based on current standings
 * Better ranked contestants get lower odds (favorite), worse ranked get higher odds (underdog)
 */
export function calculateWinnerOdds(
  contestants: Contestant[],
  targetContestantId: string
): number {
  // Sort contestants by points (descending)
  const sorted = [...contestants].sort((a, b) => {
    const aPoints = a.trackedStats?.totalPoints || 0;
    const bPoints = b.trackedStats?.totalPoints || 0;
    return bPoints - aPoints;
  });

  // Find the rank of the target contestant (1-indexed)
  const rank = sorted.findIndex((c) => c.id === targetContestantId) + 1;

  // If not found, default to middle odds
  if (rank === 0) return 3.0;

  // Odds based on rank (adjust these to balance the economy)
  const oddsMap: Record<number, number> = {
    1: 2.0, // Favorite - 1st place
    2: 2.5, // 2nd place
    3: 3.5, // Middle
    4: 4.5, // 4th place
    5: 6.0, // Underdog - Last place
  };

  return oddsMap[rank] || 3.0; // Default to 3.0x if rank not in map
}

/**
 * Fixed odds for simple binary outcome bets
 */
export const BINARY_BET_ODDS = 2.0;

/**
 * Betting limits to prevent economy breaking
 */
export const BET_LIMITS = {
  MIN_BET: 10, // Minimum bet amount
  MAX_BET: 500, // Maximum bet amount per wager
};

/**
 * Calculate potential payout
 */
export function calculatePayout(amount: number, odds: number): number {
  return Math.floor(amount * odds);
}

/**
 * Validate bet amount
 */
export function validateBetAmount(
  amount: number,
  userCurrency: number
): { valid: boolean; error?: string } {
  if (amount < BET_LIMITS.MIN_BET) {
    return {
      valid: false,
      error: `Minimum bet is ${BET_LIMITS.MIN_BET} currency`,
    };
  }

  if (amount > BET_LIMITS.MAX_BET) {
    return {
      valid: false,
      error: `Maximum bet is ${BET_LIMITS.MAX_BET} currency`,
    };
  }

  if (amount > userCurrency) {
    return {
      valid: false,
      error: "Insufficient currency",
    };
  }

  return { valid: true };
}
