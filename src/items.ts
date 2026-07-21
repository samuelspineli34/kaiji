export type Rarity = 'comum' | 'incomum' | 'rara' | 'lendaria';
export type Obtainable = 'shop' | 'chest';

export interface Offset {
    x: number;
    y: number;
    z?: number;
}

export interface AnimationConfig {
    folder: string;
    frames: number;
    suffix: string;
    speed: number;
}

export interface Item {
    id: string;
    name: string;
    icon: string;
    cost: number;
    rarity: Rarity;
    category: 'moveis' | 'eletronicos' | 'decoracao';
    placement: 'desk' | 'floor' | 'wall';
    obtainable: Obtainable;
    animation?: AnimationConfig;
}

// Substiua o dicionário ITEM_CATALOG por esta definição:
export const ITEM_CATALOG: Record<string, Item> = {
    'chair': { id: 'chair', name: 'Cadeira de Estudo', icon: 'Objects/chair_front_blue.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'table': { id: 'table', name: 'Mesa Rústica', icon: 'Objects/table.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'stool': { id: 'stool', name: 'Banco Rústico', icon: 'Objects/stool.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'carpet_blue': { id: 'carpet_blue', name: 'Tapete Real Azul', icon: 'rug blue.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'carpet_red': { id: 'carpet_red', name: 'Tapete Vermelho', icon: 'Objects/rug_square_red.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'library': { id: 'library', name: 'Estante Arcana', icon: 'Objects/library_full.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'sofa': { id: 'sofa', name: 'Poltrona Real', icon: 'Furniture Couch Back.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'coffee_table': { id: 'coffee_table', name: 'Mesa de Centro', icon: 'Furniture Table Coffee.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'torch': { id: 'torch', name: 'Tocha de Parede', icon: 'Objects/torch.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'wall', obtainable: 'chest' },
    'candle': { id: 'candle', name: 'Vela de Cera', icon: 'Objects/candle.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },

    'flask1': {
        id: 'flask1', name: 'Frasco Purpurina', icon: 'Objects/flask1.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'desk', obtainable: 'chest',
        animation: { folder: 'Animations/flask1/flask1_', frames: 4, suffix: '.png', speed: 150 }
    },
    'flask2': {
        id: 'flask2', name: 'Frasco Esmeralda', icon: 'Objects/flask2.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'desk', obtainable: 'chest',
        animation: { folder: 'Animations/flask2/flask2_', frames: 4, suffix: '.png', speed: 150 }
    },
    'cauldron_empty': { id: 'cauldron_empty', name: 'Caldeirão Vazio', icon: 'Objects/cauldron_empty.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'cauldron_hot': {
        id: 'cauldron_hot', name: 'Caldeirão Alquímico', icon: 'Objects/cauldron_hot_blue.png', cost: 0, rarity: 'rara', category: 'eletronicos', placement: 'floor', obtainable: 'chest',
        animation: { folder: 'Animations/cauldron_hot_blue/cauldron_hot_blue', frames: 6, suffix: '.png', speed: 120 }
    },
    'fireplace': { id: 'fireplace', name: 'Lareira de Pedra', icon: 'Objects/fireplace.png', cost: 0, rarity: 'rara', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'sword': { id: 'sword', name: 'Espada de Aço', icon: 'Objects/sword.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'shield': { id: 'shield', name: 'Escudo de Batalha', icon: 'Objects/shield_blue.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'spear_stand': { id: 'spear_stand', name: 'Suporte de Armas', icon: 'Objects/spear_stand.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },

    'window_day': {
        id: 'window_day', name: 'Janela Ensolarada', icon: 'Objects/window_day.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'wall', obtainable: 'chest',
        animation: { folder: 'Animations/window_day/window_day', frames: 15, suffix: '.png', speed: 100 }
    },
    'window_night': { id: 'window_night', name: 'Janela Noturna', icon: 'Objects/window_night.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'door': { id: 'door', name: 'Porta Mágica', icon: 'Objects/door_opened.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'floor', obtainable: 'chest' },

    // RECOMPENSAS EXCLUSIVAS DE CAIXAS (GACHA)
    'cauldron_cold_pink': { id: 'cauldron_cold_pink', name: 'Caldeirão Rosa Gélido', icon: 'Objects/cauldron_cold_pink.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'cauldron_cold_green': { id: 'cauldron_cold_green', name: 'Caldeirão Verde Gélido', icon: 'Objects/cauldron_cold_green.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },

    'cauldron_hot_pink': {
        id: 'cauldron_hot_pink', name: 'Caldeirão Rosa Fervente', icon: 'Objects/cauldron_hot_pink.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'floor', obtainable: 'chest',
        animation: { folder: 'Animations/cauldron_hot_pink/cauldron_hot_pink', frames: 6, suffix: '.png', speed: 120 }
    },
    'cauldron_hot_green': {
        id: 'cauldron_hot_green', name: 'Caldeirão Verde Fervente', icon: 'Objects/cauldron_hot_green.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'floor', obtainable: 'chest',
        animation: { folder: 'Animations/cauldron_hot_green/cauldron_hot_green', frames: 6, suffix: '.png', speed: 120 }
    },
    'cauldron_hot_red': {
        id: 'cauldron_hot_red', name: 'Caldeirão Vermelho Fervente', icon: 'Objects/cauldron_hot_red.png', cost: 0, rarity: 'rara', category: 'eletronicos', placement: 'floor', obtainable: 'chest',
        animation: { folder: 'Animations/cauldron_hot_red/cauldron_hot_red', frames: 6, suffix: '.png', speed: 120 }
    },
    'window_sunset': {
        id: 'window_sunset', name: 'Janela Crepúsculo', icon: 'Objects/window_dawn-sunset.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'wall', obtainable: 'chest',
        animation: { folder: 'Animations/window_dawn_sunset/window_dawn_sunset', frames: 15, suffix: '.png', speed: 100 }
    },
    'chest_full': { id: 'chest_full', name: 'Baú de Ouro', icon: 'Objects/chest_front_full.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'spear_front': { id: 'spear_front', name: 'Lança de Infantaria', icon: 'Objects/spear_front.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'scissors': { id: 'scissors', name: 'Tesoura de Alfaiate', icon: 'Objects/scissors.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'knife': { id: 'knife', name: 'Trinchante de Cozinha', icon: 'Objects/kitchen_knife.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'shield_gold': { id: 'shield_gold', name: 'Escudo Real de Ouro', icon: 'Objects/shield_yellow.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'desk', obtainable: 'chest' }
};

export const UNLOCKABLE_THEMES = ['yakuza', 'cyber', 'gold', 'zen', 'dusk', 'sakura', 'forest', 'coffee', 'nordic'];