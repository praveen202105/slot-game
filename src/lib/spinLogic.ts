const symbols = ['🍋', '🍒', '🍀', '🔔', '⭐', '💎'];

const winningCombinations: { reels: string[]; multiplier: number }[] = [
    { reels: ['💎', '💎', '💎'], multiplier: 20 },
    { reels: ['⭐', '⭐', '⭐'], multiplier: 10 },
    { reels: ['🔔', '🔔', '🔔'], multiplier: 8 },
    { reels: ['🍀', '🍀', '🍀'], multiplier: 6 },
    { reels: ['🍒', '🍒', '🍒'], multiplier: 5 },
    { reels: ['🍋', '🍋', '🍋'], multiplier: 3 },
    { reels: ['💎', '💎', getRandomSymbolExcept('💎')], multiplier: 2 }
];

// Helper to avoid 3 💎 when generating 2-match
function getRandomSymbolExcept(exclude: string): string {
    const filtered = symbols.filter(s => s !== exclude);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

// Fully random reel
function randomReel(): string[] {
    const pick = () => symbols[Math.floor(Math.random() * symbols.length)];
    return [pick(), pick(), pick()];
}

// Weighted spin: ~80% win, ~20% random
export function spinReels(): string[] {
    const winChance = Math.random();

    if (winChance < 0.8) {
        // Choose a winning combination at random
        const winner = winningCombinations[Math.floor(Math.random() * winningCombinations.length)];
        return [...winner.reels];
    }

    return randomReel(); // no guarantee of win
}

// Payout logic
export function calculateWin(reels: string[]): number {
    const result = reels.join('');

    const payouts: Record<string, number> = {
        '💎💎💎': 20,
        '⭐⭐⭐': 10,
        '🔔🔔🔔': 8,
        '🍀🍀🍀': 6,
        '🍒🍒🍒': 5,
        '🍋🍋🍋': 3
    };

    if (payouts[result]) return payouts[result];

    // Two diamonds = 2x
    const diamondCount = reels.filter(r => r === '💎').length;
    if (diamondCount === 2) return 2;

    return 0;
}
