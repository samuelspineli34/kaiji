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
    filter?: string;
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
    'window_sunset': {
        id: 'window_sunset', name: 'Janela Crepúsculo', icon: 'Objects/window_dawn-sunset.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'wall', obtainable: 'chest',
        animation: { folder: 'Animations/window_dawn_sunset/window_dawn_sunset', frames: 15, suffix: '.png', speed: 100 }
    },
    'spear_front': { id: 'spear_front', name: 'Lança de Infantaria', icon: 'Objects/spear_front.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'scissors': { id: 'scissors', name: 'Tesoura de Alfaiate', icon: 'Objects/scissors.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'knife': { id: 'knife', name: 'Trinchante de Cozinha', icon: 'Objects/kitchen_knife.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },

    // Móveis Modernos
    'armchair_18': { id: 'armchair_18', name: 'Poltrona Estofada', icon: 'Objects/Armchair_18.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'bath_03': { id: 'bath_03', name: 'Banheira de Imersão', icon: 'Objects/Bath_03.png', cost: 0, rarity: 'rara', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'bed_02': { id: 'bed_02', name: 'Cama de Solteiro', icon: 'Objects/Bed_02.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'bed_07': { id: 'bed_07', name: 'Cama Casal de Luxo', icon: 'Objects/Bed_07.png', cost: 0, rarity: 'rara', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'chair_17': { id: 'chair_17', name: 'Cadeira Moderna', icon: 'Objects/Chair_17.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'chair_pc_04': { id: 'chair_pc_04', name: 'Cadeira Gamer', icon: 'Objects/Chair_PC_04.png', cost: 0, rarity: 'rara', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'closet_01': { id: 'closet_01', name: 'Guarda-Roupa Escuro', icon: 'Objects/Closet_01.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'closet_02': { id: 'closet_02', name: 'Guarda-Roupa Moderno', icon: 'Objects/Closet_02.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'coffee_table_03': { id: 'coffee_table_03', name: 'Mesa de Centro Elegante', icon: 'Objects/Coffee_Table_03.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'couch_08': { id: 'couch_08', name: 'Sofá Confortável', icon: 'Objects/Couch_08.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'couch_11': { id: 'couch_11', name: 'Sofá Contemporâneo', icon: 'Objects/Couch_11.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'kitchen_d_01': { id: 'kitchen_d_01', name: 'Balcão de Cozinha com Pia', icon: 'Objects/Kitchen_D_01.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'kitchen_d_06': { id: 'kitchen_d_06', name: 'Armário de Cozinha Aéreo', icon: 'Objects/Kitchen_D_06.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'wall', obtainable: 'chest' },
    'kitchen_d_08': { id: 'kitchen_d_08', name: 'Balcão de Cozinha Simples', icon: 'Objects/Kitchen_D_08.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'kitchen_d_09': { id: 'kitchen_d_09', name: 'Balcão de Cozinha Duplo', icon: 'Objects/Kitchen_D_09.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'kitchen_table_09': { id: 'kitchen_table_09', name: 'Mesa de Jantar', icon: 'Objects/Kitchen_Table_09.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'nightstand_02': { id: 'nightstand_02', name: 'Criado-Mudo', icon: 'Objects/Nightstand_02.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'toilet_03': { id: 'toilet_03', name: 'Vaso Sanitário', icon: 'Objects/Toilet_03.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'wash_basin_07': { id: 'wash_basin_07', name: 'Lavatório com Espelho', icon: 'Objects/Wash_Basin_07.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'work_table_06': { id: 'work_table_06', name: 'Escrivaninha de Trabalho', icon: 'Objects/Work_Table_06.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'shelf': { id: 'shelf', name: 'Prateleira de Madeira', icon: 'Objects/shelf.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'wall', obtainable: 'chest' },
    'library_empty': { id: 'library_empty', name: 'Estante Vazia', icon: 'Objects/library_empty.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },

    // Eletrônicos & Eletrodomésticos
    'computer_01': { id: 'computer_01', name: 'Computador Desktop', icon: 'Objects/Computer_01.png', cost: 0, rarity: 'rara', category: 'eletronicos', placement: 'desk', obtainable: 'chest' },
    'exercise_bike_01': { id: 'exercise_bike_01', name: 'Bicicleta Ergométrica', icon: 'Objects/ExerciseBike_01.png', cost: 0, rarity: 'rara', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'fridge_01': { id: 'fridge_01', name: 'Geladeira', icon: 'Objects/Fridge_01.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'kitchen_d_10': { id: 'kitchen_d_10', name: 'Fogão Modular', icon: 'Objects/Kitchen_D_10.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'light_05': { id: 'light_05', name: 'Luminária de Mesa', icon: 'Objects/Light_05.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'desk', obtainable: 'chest' },
    'microwave_01': { id: 'microwave_01', name: 'Aparelho Micro-ondas', icon: 'Objects/Microwave_01.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'desk', obtainable: 'chest' },
    'mixer_08': { id: 'mixer_08', name: 'Batedeira de Cozinha', icon: 'Objects/Mixer_08.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'desk', obtainable: 'chest' },

    // Decorações
    'book_03': { id: 'book_03', name: 'Livro de Estudo', icon: 'Objects/Book_03.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'book_08': { id: 'book_08', name: 'Grimório Fechado', icon: 'Objects/Book_08.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'clock_03': { id: 'clock_03', name: 'Relógio de Parede', icon: 'Objects/Clock_03.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'cutting_board_02': { id: 'cutting_board_02', name: 'Tábua de Corte', icon: 'Objects/Cutting_board_02.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'guitar_01': { id: 'guitar_01', name: 'Violão Acústico', icon: 'Objects/Guitar_01.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'paper_01': { id: 'paper_01', name: 'Papéis de Trabalho', icon: 'Objects/Paper_01.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'paper_02': { id: 'paper_02', name: 'Carta Selada', icon: 'Objects/Paper_02.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'picture_08': { id: 'picture_08', name: 'Quadro de Paisagem', icon: 'Objects/Picture_08.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'picture_17': { id: 'picture_17', name: 'Quadro Retrato', icon: 'Objects/Picture_17.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'picture_21': { id: 'picture_21', name: 'Quadro Abstrato', icon: 'Objects/Picture_21.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'plants_05': { id: 'plants_05', name: 'Planta de Vaso Pequena', icon: 'Objects/Plants_05.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'plants_15': { id: 'plants_15', name: 'Planta Ornamental de Chão', icon: 'Objects/Plants_15.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'plants_19': { id: 'plants_19', name: 'Vaso com Cacto', icon: 'Objects/Plants_19.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'toothbrush_01': { id: 'toothbrush_01', name: 'Escova de Dentes', icon: 'Objects/Toothbrush_01.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'toothpaste_01': { id: 'toothpaste_01', name: 'Pasta de Dentes', icon: 'Objects/Toothpaste_01.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'toy_02': { id: 'toy_02', name: 'Carrinho de Brinquedo', icon: 'Objects/Toy_02.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'toy_03': { id: 'toy_03', name: 'Ursinho de Pelúcia', icon: 'Objects/Toy_03.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'utensils_01': { id: 'utensils_01', name: 'Suporte com Utensílios', icon: 'Objects/Utensils_01.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'candle_consumed': { id: 'candle_consumed', name: 'Vela Gastando', icon: 'Objects/candle_consumed.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'firewood': { id: 'firewood', name: 'Lenha Empilhada', icon: 'Objects/firewood.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'logs': { id: 'logs', name: 'Toras de Madeira', icon: 'Objects/logs.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'hanger_with_clothes': { id: 'hanger_with_clothes', name: 'Cabideiro com Casaco', icon: 'Objects/hanger_with_clothes.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'hanger_without_clothes': { id: 'hanger_without_clothes', name: 'Cabideiro Vazio', icon: 'Objects/hanger_without_clothes.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },

    // Porções & Utensílios Mágicos/Antigos
    'potion_blue': { id: 'potion_blue', name: 'Poção de Mana', icon: 'Objects/potion_blue.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'potion_green': { id: 'potion_green', name: 'Poção de Veneno', icon: 'Objects/potion_green.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'potion_red': { id: 'potion_red', name: 'Poção de Vida', icon: 'Objects/potion_red.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'potion_yellow': { id: 'potion_yellow', name: 'Poção de Energia', icon: 'Objects/potion_yellow.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'cauldron_cold_blue': { id: 'cauldron_cold_blue', name: 'Caldeirão Azul Apagado', icon: 'Objects/cauldron_cold_blue.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'cauldron_cold_red': { id: 'cauldron_cold_red', name: 'Caldeirão Vermelho Apagado', icon: 'Objects/cauldron_cold_red.png', cost: 0, rarity: 'comum', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },

    // Armas & Acessórios
    'shield_green': { id: 'shield_green', name: 'Escudo Florestal', icon: 'Objects/shield_green.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'shield_red': { id: 'shield_red', name: 'Escudo do Fogo', icon: 'Objects/shield_red.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'spear_side': { id: 'spear_side', name: 'Lança Cerimonial', icon: 'Objects/spear_side.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'desk', obtainable: 'chest' },

    // Variações de Cadeiras
    'chair_green': { id: 'chair_green', name: 'Cadeira Verde', icon: 'Objects/chair_front_green.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'chair_red': { id: 'chair_red', name: 'Cadeira Vermelha', icon: 'Objects/chair_front_red.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'chair_yellow': { id: 'chair_yellow', name: 'Cadeira Amarela', icon: 'Objects/chair_front_yellow.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },

    // Baús, Portas e Janelas
    'chest_closed': { id: 'chest_closed', name: 'Baú Fechado', icon: 'Objects/chest_front_closed.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'chest_empty': { id: 'chest_empty', name: 'Baú Vazio', icon: 'Objects/chest_front_empty.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'door_closed': { id: 'door_closed', name: 'Porta Fechada', icon: 'Objects/door_closed.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'window_black': { id: 'window_black', name: 'Janela Escura', icon: 'Objects/window_black.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'window_closed': { id: 'window_closed', name: 'Janela Fechada', icon: 'Objects/window_closed.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'window_opened': { id: 'window_opened', name: 'Janela Aberta Simples', icon: 'Objects/window_opened.png', cost: 0, rarity: 'incomum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },

    // Tapetes e Decorações de Parede/Chão
    'flooring_carpet': { id: 'flooring_carpet', name: 'Carpete Modular', icon: 'Flooring Carpet.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_circle_blue': { id: 'rug_circle_blue', name: 'Tapete Redondo Azul', icon: 'Objects/rug_circle_blue.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_circle_green': { id: 'rug_circle_green', name: 'Tapete Redondo Verde', icon: 'Objects/rug_circle_green.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_circle_red': { id: 'rug_circle_red', name: 'Tapete Redondo Vermelho', icon: 'Objects/rug_circle_red.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_circle_yellow': { id: 'rug_circle_yellow', name: 'Tapete Redondo Amarelo', icon: 'Objects/rug_circle_yellow.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_square_blue': { id: 'rug_square_blue', name: 'Tapete Quadrado Azul', icon: 'Objects/rug_square_blue.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_square_green': { id: 'rug_square_green', name: 'Tapete Quadrado Verde', icon: 'Objects/rug_square_green.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'rug_square_yellow': { id: 'rug_square_yellow', name: 'Tapete Quadrado Amarelo', icon: 'Objects/rug_square_yellow.png', cost: 0, rarity: 'comum', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'wall_decoration_blue': { id: 'wall_decoration_blue', name: 'Flâmula Azul', icon: 'Objects/wall_decoration_blue.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'wall_decoration_green': { id: 'wall_decoration_green', name: 'Flâmula Verde', icon: 'Objects/wall_decoration_green.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'wall_decoration_red': { id: 'wall_decoration_red', name: 'Flâmula Vermelha', icon: 'Objects/wall_decoration_red.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },
    'wall_decoration_yellow': { id: 'wall_decoration_yellow', name: 'Flâmula Amarela', icon: 'Objects/wall_decoration_yellow.png', cost: 0, rarity: 'comum', category: 'decoracao', placement: 'wall', obtainable: 'chest' },

    // RECOMPENSAS EXCLUSIVAS DAS ÚLTIMAS CONQUISTAS
    'trophy_master': { id: 'trophy_master', name: 'Troféu Kaiji de Platina', icon: 'Objects/chest_front_full.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'desk', obtainable: 'chest' },
    'throne_gold': { id: 'throne_gold', name: 'Trono Imperial de Ouro', icon: 'Objects/Armchair_02.png', cost: 0, rarity: 'lendaria', category: 'moveis', placement: 'floor', obtainable: 'chest' },
    'arcade_cabinet': { id: 'arcade_cabinet', name: 'Fliperama Lendário Teiai', icon: 'Objects/GameConsole_01.png', cost: 0, rarity: 'lendaria', category: 'eletronicos', placement: 'floor', obtainable: 'chest' },
    'dragon_statue': { id: 'dragon_statue', name: 'Estátua Alquímica Suprema', icon: 'Objects/cauldron_hot_red.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'floor', obtainable: 'chest' },
    'crown_legend': { id: 'crown_legend', name: 'Coroa Imperial Suprema', icon: 'Objects/shield_yellow.png', cost: 0, rarity: 'lendaria', category: 'decoracao', placement: 'desk', obtainable: 'chest' },

    // VARIANTES COM FILTROS ESPECIAIS (EXPANSAO DE CATÁLOGO)
    'sword_golden': { id: 'sword_golden', name: 'Espada de Ouro Maciço', icon: 'Objects/sword.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'desk', obtainable: 'chest', filter: 'sepia(1) hue-rotate(5deg) saturate(6) brightness(1.2)' },
    'chair_neon': { id: 'chair_neon', name: 'Cadeira Cyberpunk Neon', icon: 'Objects/chair_front_blue.png', cost: 0, rarity: 'incomum', category: 'moveis', placement: 'floor', obtainable: 'chest', filter: 'hue-rotate(280deg) saturate(3) contrast(1.2)' },
    'potion_void': { id: 'potion_void', name: 'Poção do Vazio Cósmico', icon: 'Objects/potion_blue.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'desk', obtainable: 'chest', filter: 'hue-rotate(220deg) saturate(4) brightness(1.4)' },
    'plants_gold': { id: 'plants_gold', name: 'Planta Solar Sagrada', icon: 'Objects/Plants_15.png', cost: 0, rarity: 'rara', category: 'decoracao', placement: 'floor', obtainable: 'chest', filter: 'sepia(1) hue-rotate(15deg) saturate(5)' },
    'fridge_pink': { id: 'fridge_pink', name: 'Geladeira Retrô Rosa', icon: 'Objects/Fridge_01.png', cost: 0, rarity: 'incomum', category: 'eletronicos', placement: 'floor', obtainable: 'chest', filter: 'hue-rotate(310deg) saturate(2)' },
    'library_dark': { id: 'library_dark', name: 'Estante Obscura das Sombras', icon: 'Objects/library_full.png', cost: 0, rarity: 'rara', category: 'moveis', placement: 'floor', obtainable: 'chest', filter: 'brightness(0.6) contrast(1.5) hue-rotate(180deg)' }
};


export const UNLOCKABLE_THEMES = ['yakuza', 'cyber', 'gold', 'zen', 'dusk', 'sakura', 'forest', 'coffee', 'nordic'];