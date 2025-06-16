export type Symbol = '💎' | '⭐' | '🍋' | '🍒';

const symbols: Symbol[] = ['💎', '⭐', '🍋', '🍒'];
const weights: Record<Symbol, number> = { '💎': 1, '⭐': 2, '🍋': 4, '🍒': 8 };
const payouts: Record<string, number> = {
    '💎💎💎': 20,
    '⭐⭐⭐': 10,
    '🍋🍋🍋': 5,
    '🍒🍒🍒': 2,
};

function randSymbol(): Symbol {
    const total = 15;
    let r = Math.random() * total;
    for (const s of symbols) {
        r -= weights[s];
        if (r <= 0) return s;
    }
    return '🍒';
}

export function spin() {
    return [randSymbol(), randSymbol(), randSymbol()] as Symbol[];
}

export function payout(reels: Symbol[], wager: number) {
    const key = reels.join('');
    if (payouts[key]) return payouts[key] * wager;
    if (new Set(reels).size === 2) return wager; // any two
    return 0;
}
