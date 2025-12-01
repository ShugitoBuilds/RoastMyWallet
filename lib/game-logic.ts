import { differenceInDays } from "date-fns";

export const BASE_ROAST_POINTS = 100;
export const FRIEND_BONUS_MULTIPLIER = 2.0;
export const DECAY_RATE_PER_DAY = 0.05;
export const MIN_DECAY_MULTIPLIER = 0.5;

/**
 * Calculates the points awarded for a roast based on time decay and bonuses.
 * 
 * Formula:
 * Multiplier = max(0.5, 2.0 - (days_elapsed * 0.05))
 * Points = Base (100) * Multiplier * (FriendBonus ? 2.0 : 1.0)
 */
export function calculatePoints(
    seasonStartDate: Date,
    isFriendRoast: boolean = false
): { points: number; multiplier: number; breakdown: string } {
    const now = new Date();
    const daysElapsed = Math.max(0, differenceInDays(now, seasonStartDate));

    // Calculate Time Decay Multiplier
    // Starts at 2.0x, decays by 0.05 per day, floor at 0.5x
    let timeMultiplier = Math.max(
        MIN_DECAY_MULTIPLIER,
        2.0 - (daysElapsed * DECAY_RATE_PER_DAY)
    );

    // Round to 2 decimal places for cleanliness
    timeMultiplier = Math.round(timeMultiplier * 100) / 100;

    // Apply Friend Bonus
    const friendMultiplier = isFriendRoast ? FRIEND_BONUS_MULTIPLIER : 1.0;

    const totalMultiplier = timeMultiplier * friendMultiplier;
    const points = Math.round(BASE_ROAST_POINTS * totalMultiplier);

    const breakdown = `Base(${BASE_ROAST_POINTS}) * Time(${timeMultiplier}x)${isFriendRoast ? ` * Friend(${FRIEND_BONUS_MULTIPLIER}x)` : ''}`;

    return { points, multiplier: totalMultiplier, breakdown };
}
