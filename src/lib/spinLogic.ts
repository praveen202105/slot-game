const symbols = ['🍒', '🍋', '⭐', '💎'];
const weights = [0.4, 0.3, 0.2, 0.1];
const payouts: Record<string, number> = {
    '🍒🍒🍒': 5,
    '🍋🍋🍋': 4,
    '⭐⭐⭐': 10,
    '💎💎💎': 15
};

function weightedRandom(): string {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (r <= sum) return symbols[i];
    }
    return symbols[0];
}

export function spinReels(): string[] {
    return [weightedRandom(), weightedRandom(), weightedRandom()];
}

export function calculateWin(reels: string[]): number {
    const result = reels.join('');
    return payouts[result] ? payouts[result] * 10 : 0;
}