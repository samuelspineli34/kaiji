export type AchievementCategory = 'colecao' | 'roleta' | 'cassino' | 'jackpot' | 'riqueza' | 'decoracao' | 'temas' | 'raridade';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: AchievementCategory;
    target: number;
    rewardCoins: number;
    rewardItemId?: string;
}

export interface UserStats {
    rouletteSpins: number;
    slotSpins: number;
    jackpots: number;
    coinsEarned: number;
    itemsCollected: number;
    itemsPlaced: number;
    themesUnlocked: number;
    commonItems: number;
    uncommonItems: number;
    rareItems: number;
    legendaryItems: number;
}

const list: Achievement[] = [];

// Helper de criação
function addGroup(
    prefix: string,
    category: AchievementCategory,
    icon: string,
    titleTemplate: (v: number) => string,
    descTemplate: (v: number) => string,
    steps: number[],
    baseReward: number,
    finalRewardItemId?: string
) {
    steps.forEach((val, index) => {
        const isLast = index === steps.length - 1;
        list.push({
            id: `${prefix}_${val}`,
            title: titleTemplate(val),
            description: descTemplate(val) + (isLast && finalRewardItemId ? ' 🎁 (Concede Item Exclusivo!)' : ''),
            icon: icon,
            category: category,
            target: val,
            rewardCoins: baseReward * (index + 1),
            rewardItemId: isLast ? finalRewardItemId : undefined
        });
    });
}

addGroup('items', 'colecao', '🎒', (v) => `Coletor Nível ${v}`, (v) => `Colecione ${v} decorações e móveis diferentes.`, [1, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100], 250, 'crown_legend');
addGroup('roleta', 'roleta', '✍️', (v) => `Programador Focado ${v}`, (v) => `Gire a Roleta de Código ${v} vezes salvando alterações.`, [1, 5, 10, 25, 50, 75, 100, 150, 200, 300, 500, 750, 1000], 300, 'dragon_statue');
addGroup('cassino', 'cassino', '🎰', (v) => `Apostador Teiai ${v}`, (v) => `Gire o Caça-Níquel ${v} vezes no Cassino.`, [1, 5, 10, 25, 50, 100, 200, 300, 400, 500, 750, 1000, 2000], 500, 'arcade_cabinet');
addGroup('jackpot', 'jackpot', '🌟', (v) => `Mestre do Jackpot ${v}`, (v) => `Acerte ${v} Jackpots ou Prêmios Lendários!`, [1, 2, 3, 5, 10, 15, 20, 30, 50, 75, 100], 1000, 'throne_gold');
addGroup('riqueza', 'riqueza', '💰', (v) => `Magnata das Moedas ${v}`, (v) => `Acumule um total de ${v.toLocaleString('pt-BR')} moedas ganhas.`, [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000], 400, 'throne_gold');
addGroup('decoracao', 'decoracao', '🛋️', (v) => `Arquiteto de Interiores ${v}`, (v) => `Posicione simultaneamente ${v} móveis no seu quarto.`, [1, 3, 5, 10, 15, 20, 25, 30, 40, 50], 200);
addGroup('temas', 'temas', '🎨', (v) => `Artista de Paredes ${v}`, (v) => `Desbloqueie ${v} temas de quarto diferentes.`, [2, 4, 6, 8, 10, 12, 15, 18, 20], 600);
addGroup('rarity_comum', 'raridade', '⚪', (v) => `Mestre dos Comuns ${v}`, (v) => `Possua ${v} móveis de raridade Comum.`, [1, 5, 10, 20, 30, 40, 50], 150);
addGroup('rarity_incomum', 'raridade', '🟢', (v) => `Entusiasta Incomum ${v}`, (v) => `Possua ${v} móveis de raridade Incomum.`, [1, 5, 10, 15, 20, 30], 300);
addGroup('rarity_rara', 'raridade', '🟣', (v) => `Caçador do Raro ${v}`, (v) => `Possua ${v} móveis de raridade Rara.`, [1, 3, 5, 10, 15, 20], 600);
addGroup('rarity_lendaria', 'raridade', '🟡', (v) => `Lenda do Espaço ${v}`, (v) => `Possua ${v} móveis de raridade Lendária.`, [1, 2, 3, 5, 10], 1500);


const totalStandardAchievements = list.length;
list.push({
    id: 'master_all_achievements',
    title: '👑 Perfeccionista Supremo (100%)',
    description: 'Desbloqueie todas as outras conquistas do jogo!',
    icon: '🏆',
    category: 'colecao',
    target: totalStandardAchievements,
    rewardCoins: 50000,
    rewardItemId: 'trophy_master'
});

export const ACHIEVEMENTS_CATALOG: Achievement[] = list;