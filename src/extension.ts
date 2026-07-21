import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

type Rarity = 'comum' | 'incomum' | 'rara' | 'lendaria';

interface Item {
    id: string;
    name: string;
    emoji: string;
    cost: number;
    rarity: Rarity;
    category: 'moveis' | 'eletronicos' | 'decoracao';
    placement: 'desk' | 'floor' | 'wall';
}

const ITEM_CATALOG: Record<string, Item> = {
    'coffee_mug': { id: 'coffee_mug', name: 'Caneca de Café', emoji: '☕', cost: 30, rarity: 'comum', category: 'decoracao', placement: 'desk' },
    'cactus': { id: 'cactus', name: 'Mini Cacto', emoji: '🌵', cost: 45, rarity: 'comum', category: 'decoracao', placement: 'desk' },
    'lamp': { id: 'lamp', name: 'Luminária de Mesa', emoji: '💡', cost: 60, rarity: 'comum', category: 'eletronicos', placement: 'desk' },
    'carpet': { id: 'carpet', name: 'Tapete Básico', emoji: '🧹', cost: 75, rarity: 'comum', category: 'moveis', placement: 'floor' },
    'chair': { id: 'chair', name: 'Cadeira Ergonômica', emoji: '🪑', cost: 150, rarity: 'incomum', category: 'moveis', placement: 'floor' },
    'bookshelf': { id: 'bookshelf', name: 'Estante de Livros', emoji: '📚', cost: 180, rarity: 'incomum', category: 'moveis', placement: 'floor' },
    'keyboard': { id: 'keyboard', name: 'Teclado Mecânico RGB', emoji: '⌨️', cost: 220, rarity: 'incomum', category: 'eletronicos', placement: 'desk' },
    'speakers': { id: 'speakers', name: 'Monitores de Áudio', emoji: '🔊', cost: 250, rarity: 'incomum', category: 'eletronicos', placement: 'desk' },
    'ultrawide': { id: 'ultrawide', name: 'Monitor Ultrawide', emoji: '🖥️', cost: 450, rarity: 'rara', category: 'eletronicos', placement: 'desk' },
    'bonsai': { id: 'bonsai', name: 'Bonsai Imperial', emoji: '🪴', cost: 400, rarity: 'rara', category: 'decoracao', placement: 'floor' },
    'retro_console': { id: 'retro_console', name: 'Fliperama Portátil', emoji: '🎮', cost: 500, rarity: 'rara', category: 'eletronicos', placement: 'desk' },
    'lava_lamp': { id: 'lava_lamp', name: 'Luminária de Lava', emoji: '🏮', cost: 380, rarity: 'rara', category: 'decoracao', placement: 'desk' },
    'nasa_pc': { id: 'nasa_pc', name: 'Supercomputador Quântico', emoji: '👾', cost: 1000, rarity: 'lendaria', category: 'eletronicos', placement: 'desk' },
    'hologram': { id: 'hologram', name: 'Projetor Estelar', emoji: '🌌', cost: 1200, rarity: 'lendaria', category: 'eletronicos', placement: 'wall' },
    'dragon': { id: 'dragon', name: 'Estátua de Dragão Dourado', emoji: '🐉', cost: 1500, rarity: 'lendaria', category: 'decoracao', placement: 'floor' },
    'portal': { id: 'portal', name: 'Portal Interdimensional', emoji: '🌀', cost: 2000, rarity: 'lendaria', category: 'decoracao', placement: 'wall' }
};

// Histórico de tamanho dos arquivos para calcular a diferença de caracteres ao salvar
const documentCharTracker = new Map<string, number>();

export function activate(context: vscode.ExtensionContext) {
    console.log('Kaiji Decor TypeScript ativa!');

    // Sincroniza o tamanho dos arquivos abertos inicialmente
    vscode.workspace.textDocuments.forEach(doc => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    vscode.workspace.onDidOpenTextDocument(doc => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    // Gatilho de Salvamento (On Save)
    vscode.workspace.onDidSaveTextDocument((document) => {
        const uriStr = document.uri.toString();
        const currentLength = document.getText().length;
        const previousLength = documentCharTracker.get(uriStr) ?? 0;
        documentCharTracker.set(uriStr, currentLength);

        const diff = currentLength - previousLength;

        // Se o usuário adicionou caracteres válidos
        if (diff > 0) {
            handleSaveReward(context, diff);
        }
    });

    context.subscriptions.push(
        vscode.commands.registerCommand('kaiji.openDashboard', () => {
            openDashboardPanel(context);
        })
    );
}

// Lógica de cálculo de Rariadade e Recompensa com base no esforço
function handleSaveReward(context: vscode.ExtensionContext, charsAdded: number) {
    if (charsAdded < 30) {
        // Sem baú, apenas consolação
        const consoleCoins = Math.floor(Math.random() * 3) + 1;
        addCoins(context, consoleCoins);
        vscode.window.setStatusBarMessage(`✍️ Alteração pequena: +${consoleCoins} Moedas coletadas!`, 4000);
        return;
    }

    let rarity: Rarity = 'comum';
    if (charsAdded >= 1500) {
        rarity = 'lendaria'; // Jackpot!
    } else if (charsAdded >= 500) {
        rarity = 'rara';
    } else if (charsAdded >= 150) {
        rarity = 'incomum';
    }

    vscode.window.showInformationMessage(`💾 Código salvo! Você conquistou um Baú ${rarity.toUpperCase()} (+${charsAdded} Caracteres)!`);
    openChestPanel(context, rarity);
}

// Funções do globalState
function getCoins(context: vscode.ExtensionContext): number {
    return context.globalState.get<number>('decor-coins', 50);
}

function addCoins(context: vscode.ExtensionContext, amount: number): void {
    const current = getCoins(context);
    context.globalState.update('decor-coins', current + amount);
}

function getInventory(context: vscode.ExtensionContext): string[] {
    return context.globalState.get<string[]>('decor-inventory', []);
}

function giveItemDirectly(context: vscode.ExtensionContext, itemId: string): void {
    const inventory = getInventory(context);
    if (!inventory.includes(itemId)) {
        inventory.push(itemId);
        context.globalState.update('decor-inventory', inventory);
    }
}

function buyItem(context: vscode.ExtensionContext, itemId: string, cost: number): boolean {
    const coins = getCoins(context);
    const inventory = getInventory(context);

    if (coins >= cost && !inventory.includes(itemId)) {
        context.globalState.update('decor-coins', coins - cost);
        inventory.push(itemId);
        context.globalState.update('decor-inventory', inventory);
        return true;
    }
    return false;
}

// Lê arquivos HTML externos e converte para string aceitável pelo Webview
function getHtmlContent(context: vscode.ExtensionContext, filename: string): string {
    const filePath = path.join(context.extensionPath, 'media', filename);
    return fs.readFileSync(filePath, 'utf8');
}

// 2. WEBVIEW DA ROLETA (media/roulette.html)
function openChestPanel(context: vscode.ExtensionContext, rarity: Rarity): void {
    const panel = vscode.window.createWebviewPanel(
        'chestPanel',
        'Abrindo Caixa...',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
    );

    let coinReward = 0;
    if (rarity === 'lendaria') {
        coinReward = Math.floor(Math.random() * 201) + 200; // 200-400
    } else if (rarity === 'rara') {
        coinReward = Math.floor(Math.random() * 101) + 100; // 100-200
    } else if (rarity === 'incomum') {
        coinReward = Math.floor(Math.random() * 51) + 40; // 40-90
    } else {
        coinReward = Math.floor(Math.random() * 11) + 15; // 15-25
    }

    const matchingItems = Object.values(ITEM_CATALOG).filter(i => i.rarity === rarity);
    const rolledItem = matchingItems[Math.floor(Math.random() * matchingItems.length)];

    panel.webview.onDidReceiveMessage((message) => {
        if (message.command === 'ready') {
            panel.webview.postMessage({
                command: 'setupChest',
                rarity: rarity,
                coinReward: coinReward,
                rolledItem: rolledItem
            });
        } else if (message.command === 'claimRewards') {
            addCoins(context, coinReward);
            if (rolledItem) {
                giveItemDirectly(context, rolledItem.id);
            }
            vscode.window.showInformationMessage(`Você resgatou suas recompensas!`);
            panel.dispose();
        }
    });

    panel.webview.html = getHtmlContent(context, 'roulette.html');
}

// 3. WEBVIEW DO DASHBOARD (media/dashboard.html)
function openDashboardPanel(context: vscode.ExtensionContext): void {
    const panel = vscode.window.createWebviewPanel(
        'dashboardPanel',
        'Meu Espaço Decorativo',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    const updateWebviewState = () => {
        panel.webview.postMessage({
            command: 'syncState',
            coins: getCoins(context),
            inventory: getInventory(context)
        });
    };

    panel.webview.onDidReceiveMessage((message) => {
        switch (message.command) {
            case 'ready':
                updateWebviewState();
                return;
            case 'buyItem':
                if (message.itemId && message.cost !== undefined) {
                    const success = buyItem(context, message.itemId, message.cost);
                    if (success) {
                        vscode.window.showInformationMessage(`Item colocado no cenário!`);
                        updateWebviewState();
                    } else {
                        vscode.window.showErrorMessage(`Moedas insuficientes!`);
                    }
                }
                return;
        }
    });

    let html = getHtmlContent(context, 'dashboard.html');
    // Injeta o catálogo diretamente no HTML de forma segura
    html = html.replace('/*CATALOG_PLACEHOLDER*/', `const catalog = ${JSON.stringify(ITEM_CATALOG)};`);
    panel.webview.html = html;
}