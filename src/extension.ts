import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ITEM_CATALOG, Item, Offset, Rarity } from './items';
import { ACHIEVEMENTS_CATALOG, Achievement, UserStats } from './achievements';

const documentCharTracker = new Map<string, number>();

export interface ThemeDefinition {
    id: string;
    name: string;
    wallColor: string;
    floorColor: string;
    wallTexture: string;
    floorTexture: string;
}

export const THEME_DEFINITIONS: Record<string, ThemeDefinition> = {
    'yakuza': {
        id: 'yakuza',
        name: 'Yakuza',
        wallColor: '#6e1f1f',
        floorColor: '#1a1414',
        wallTexture: 'https://www.transparenttextures.com/patterns/az-subtle.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/dark-wood.png'
    },
    'cyber': {
        id: 'cyber',
        name: 'Cyberpunk',
        wallColor: '#120224',
        floorColor: '#091321',
        wallTexture: 'https://www.transparenttextures.com/patterns/hexabump.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/gplay.png'
    },
    'gold': {
        id: 'gold',
        name: 'Ouro Real',
        wallColor: '#3a2800',
        floorColor: '#1c150b',
        wallTexture: 'https://www.transparenttextures.com/patterns/diamond-upholstery.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/moulin.png'
    },
    'zen': {
        id: 'zen',
        name: 'Zen Tatami',
        wallColor: '#425244',
        floorColor: '#2b2118',
        wallTexture: 'https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/black-linen.png'
    },
    'dusk': {
        id: 'dusk',
        name: 'Crepúsculo',
        wallColor: '#2b1a30',
        floorColor: '#161021',
        wallTexture: 'https://www.transparenttextures.com/patterns/pineapple-cut.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/batthern.png'
    },
    'sakura': {
        id: 'sakura',
        name: 'Jardim Sakura',
        wallColor: '#7a4251',
        floorColor: '#362128',
        wallTexture: 'https://www.transparenttextures.com/patterns/az-subtle.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/light-wool.png'
    },
    'forest': {
        id: 'forest',
        name: 'Taverna Florestal',
        wallColor: '#2b211a',
        floorColor: '#162418',
        wallTexture: 'https://www.transparenttextures.com/patterns/brick-wall-dark.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/dark-wood.png'
    },
    'coffee': {
        id: 'coffee',
        name: 'Café Vintage',
        wallColor: '#473223',
        floorColor: '#21150e',
        wallTexture: 'https://www.transparenttextures.com/patterns/cartographer.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/dark-wood.png'
    },
    'nordic': {
        id: 'nordic',
        name: 'Sótão Nórdico',
        wallColor: '#35434d',
        floorColor: '#1c2226',
        wallTexture: 'https://www.transparenttextures.com/patterns/connected.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/fabric-1-dark.png'
    },
    'arcade': {
        id: 'arcade',
        name: 'Retrô Arcade',
        wallColor: '#281338',
        floorColor: '#130f26',
        wallTexture: 'https://www.transparenttextures.com/patterns/diagmonds.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/argyle.png'
    },
    'dungeon': {
        id: 'dungeon',
        name: 'Masmorra Escura',
        wallColor: '#1e1e24',
        floorColor: '#0f0f12',
        wallTexture: 'https://www.transparenttextures.com/patterns/brick-wall-dark.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/black-mamba.png'
    },
    'palace': {
        id: 'palace',
        name: 'Palácio Real',
        wallColor: '#1a233a',
        floorColor: '#2c2214',
        wallTexture: 'https://www.transparenttextures.com/patterns/black-thread-light.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/diamond-upholstery.png'
    },
    'steampunk': {
        id: 'steampunk',
        name: 'Steampunk',
        wallColor: '#52341b',
        floorColor: '#211710',
        wallTexture: 'https://www.transparenttextures.com/patterns/cartographer.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/hexabump.png'
    },
    'cozy': {
        id: 'cozy',
        name: 'Quarto Aconchegante',
        wallColor: '#5c4538',
        floorColor: '#3b2f28',
        wallTexture: 'https://www.transparenttextures.com/patterns/black-linen.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/light-wool.png'
    },
    'neon_tokyo': {
        id: 'neon_tokyo',
        name: 'Tóquio Neon',
        wallColor: '#3d0c2e',
        floorColor: '#081c24',
        wallTexture: 'https://www.transparenttextures.com/patterns/black-thread.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/gplay.png'
    },
    'gothic': {
        id: 'gothic',
        name: 'Mansão Gótica',
        wallColor: '#3d0f19',
        floorColor: '#141113',
        wallTexture: 'https://www.transparenttextures.com/patterns/moulin.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/black-linen.png'
    },
    'industrial': {
        id: 'industrial',
        name: 'Loft Industrial',
        wallColor: '#363636',
        floorColor: '#1c1c1c',
        wallTexture: 'https://www.transparenttextures.com/patterns/crisp-paper-ruffles.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/connected.png'
    },
    'cabin': {
        id: 'cabin',
        name: 'Cabana Rústica',
        wallColor: '#382519',
        floorColor: '#241a14',
        wallTexture: 'https://www.transparenttextures.com/patterns/dark-wood.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/light-wool.png'
    },
    'space': {
        id: 'space',
        name: 'Estação Espacial',
        wallColor: '#111326',
        floorColor: '#0b0c17',
        wallTexture: 'https://www.transparenttextures.com/patterns/argyle.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/batthern.png'
    },
    'emerald': {
        id: 'emerald',
        name: 'Santuário Esmeralda',
        wallColor: '#0d3822',
        floorColor: '#091f14',
        wallTexture: 'https://www.transparenttextures.com/patterns/pineapple-cut.png',
        floorTexture: 'https://www.transparenttextures.com/patterns/black-mamba.png'
    }
};

export function activate(context: vscode.ExtensionContext) {
    console.log('Kaiji Decor Ativa!');

    const provider = new KaijiSidebarProvider(context);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('kaiji.sidebarView', provider)
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('kaiji.resetProgress', async () => {
            const answer = await vscode.window.showWarningMessage(
                'Deseja realmente formatar seu save? Suas moedas, decorações e posições dos móveis serão deletadas para sempre.',
                { modal: true },
                'Apagar Save'
            );
            if (answer === 'Apagar Save') {
                context.globalState.update('decor-coins', 50);
                context.globalState.update('decor-inventory', []);
                context.globalState.update('decor-placed', []);
                context.globalState.update('decor-offsets', {});
                context.globalState.update('decor-theme', 'yakuza');
                provider.updateState();
                vscode.window.showInformationMessage('Progresso limpo.');
            }
        })
    );

    vscode.workspace.textDocuments.forEach((doc) => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    vscode.workspace.onDidOpenTextDocument((doc) => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    vscode.workspace.onDidSaveTextDocument((document) => {
        // VERIFICAÇÃO DE ERROS NO CÓDIGO
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        const hasErrors = diagnostics.some((d) => {
            return d.severity === vscode.DiagnosticSeverity.Error;
        });

        if (hasErrors) {
            vscode.window.setStatusBarMessage(
                '⚠️ Código salvo com erros de sintaxe! Corrija os erros para liberar a Roleta.',
                5000
            );
            return;
        }

        const uriStr = document.uri.toString();
        const currentLength = document.getText().length;
        const previousLength = documentCharTracker.get(uriStr) ?? 0;
        documentCharTracker.set(uriStr, currentLength);

        const diff = Math.abs(currentLength - previousLength);
        if (diff > 0) {
            provider.handleSaveAndAssessChest(diff);
        }
    });
}

function getWebviewUri(context: vscode.ExtensionContext, webview: vscode.Webview, relativePath: string): string {
    const diskPath = vscode.Uri.joinPath(context.extensionUri, 'media', relativePath);
    return webview.asWebviewUri(diskPath).toString();
}

function getResolvedCatalog(context: vscode.ExtensionContext, webview: vscode.Webview): Record<string, any> {
    const resolved: Record<string, any> = {};
    for (const [key, item] of Object.entries(ITEM_CATALOG)) {
        const resolvedItem = { ...item };
        resolvedItem.icon = getWebviewUri(context, webview, `icons/${item.icon}`);

        if (item.animation) {
            const animatedFrames: string[] = [];
            for (let i = 1; i <= item.animation.frames; i++) {
                const framePath = `icons/${item.animation.folder}${i}${item.animation.suffix}`;
                animatedFrames.push(getWebviewUri(context, webview, framePath));
            }
            (resolvedItem as any).animationFrames = animatedFrames;
        }
        resolved[key] = resolvedItem;
    }
    return resolved;
}

class KaijiSidebarProvider implements vscode.WebviewViewProvider {
    private _view?: vscode.WebviewView;
    private _accumulatedProgress = 0;

    constructor(private readonly _context: vscode.ExtensionContext) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._context.extensionUri]
        };

        webviewView.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'ready':
                    this.updateState();
                    return;
                case 'saveRewards':
                    if (message.amount !== undefined) {
                        this.addCoins(message.amount);
                        this.updateState();
                    }
                    return;
                case 'togglePlacement':
                    if (message.itemId) {
                        this.toggleItemPlacement(message.itemId);
                        this.updateState();
                    }
                    return;
                case 'saveOffset':
                    if (message.itemId && message.x !== undefined) {
                        this.saveItemOffset(
                            message.itemId,
                            message.x,
                            message.y ?? 0,
                            message.z ?? 0
                        );
                    }
                    return;
                case 'saveTheme':
                    if (message.themeId) {
                        this.saveTheme(message.themeId);
                        this.updateState();
                    }
                    return;
                case 'spinSlotMachine':
                    this.handleSpinSlotMachine();
                    return;
            }
        });

        const stylesUri = getWebviewUri(this._context, webviewView.webview, 'css/styles.css');
        const appJsUri = getWebviewUri(this._context, webviewView.webview, 'js/app.js');

        let html = fs.readFileSync(
            path.join(this._context.extensionPath, 'media', 'view.html'),
            'utf8'
        );

        html = html.replace('/*STYLES_URI*/', stylesUri);
        html = html.replace('/*APP_JS_URI*/', appJsUri);
        html = html.replace('/*CATALOG_PLACEHOLDER*/', `const catalog = ${JSON.stringify(getResolvedCatalog(this._context, webviewView.webview))};`);

        webviewView.webview.html = html;
    }

    public getUnlockedAchievements(): string[] {
        return this._context.globalState.get<string[]>('decor-unlocked-achievements', []);
    }

    public checkAchievements(): void {
        const unlocked = new Set(this.getUnlockedAchievements());
        const inv = this.getInventory();
        const placed = this.getPlaced();
        const themes = this.getUnlockedThemes();

        let common = 0, uncommon = 0, rare = 0, legendary = 0;
        inv.forEach((id) => {
            const item = ITEM_CATALOG[id];
            if (item) {
                if (item.rarity === 'comum') { common++; }
                if (item.rarity === 'incomum') { uncommon++; }
                if (item.rarity === 'rara') { rare++; }
                if (item.rarity === 'lendaria') { legendary++; }
            }
        });

        const stats: UserStats = {
            rouletteSpins: this._context.globalState.get<number>('stats-roulette-spins', 0),
            slotSpins: this._context.globalState.get<number>('stats-slot-spins', 0),
            jackpots: this._context.globalState.get<number>('stats-jackpots', 0),
            coinsEarned: this._context.globalState.get<number>('stats-coins-earned', 0),
            itemsCollected: inv.length,
            itemsPlaced: placed.length,
            themesUnlocked: themes.length,
            commonItems: common,
            uncommonItems: uncommon,
            rareItems: rare,
            legendaryItems: legendary
        };

        let newAchievementsUnlocked = 0;

        ACHIEVEMENTS_CATALOG.forEach((ach) => {
            if (unlocked.has(ach.id)) { return; }

            let currentValue = 0;
            if (ach.id === 'master_all_achievements') {
                // Conta quantas conquistas (exceto a própria Mestre) já foram concluídas
                currentValue = unlocked.has('master_all_achievements') ? unlocked.size : unlocked.size;
            } else {
                switch (ach.category) {
                    case 'colecao': currentValue = stats.itemsCollected; break;
                    case 'roleta': currentValue = stats.rouletteSpins; break;
                    case 'cassino': currentValue = stats.slotSpins; break;
                    case 'jackpot': currentValue = stats.jackpots; break;
                    case 'riqueza': currentValue = stats.coinsEarned; break;
                    case 'decoracao': currentValue = stats.itemsPlaced; break;
                    case 'temas': currentValue = stats.themesUnlocked; break;
                    case 'raridade':
                        if (ach.id.startsWith('rarity_comum')) { currentValue = stats.commonItems; }
                        if (ach.id.startsWith('rarity_incomum')) { currentValue = stats.uncommonItems; }
                        if (ach.id.startsWith('rarity_rara')) { currentValue = stats.rareItems; }
                        if (ach.id.startsWith('rarity_lendaria')) { currentValue = stats.legendaryItems; }
                        break;
                }
            }

            if (currentValue >= ach.target) {
                unlocked.add(ach.id);
                newAchievementsUnlocked++;
                this.addCoins(ach.rewardCoins);

                // Concede o item exclusivo diretamente ao inventário caso a conquista possua
                if (ach.rewardItemId) {
                    this.giveItemDirectly(ach.rewardItemId);
                }

                vscode.window.showInformationMessage(
                    `🏆 CONQUISTA DESBLOQUEADA: "${ach.title}"! (+${ach.rewardCoins} 💰)${ach.rewardItemId ? ' 🎁 Item Exclusivo concedido!' : ''}`
                );
            }
        });

        if (newAchievementsUnlocked > 0) {
            this._context.globalState.update('decor-unlocked-achievements', Array.from(unlocked));
        }
    }

    public handleSaveAndAssessChest(charsAdded: number): void {
        if (!this._view) { return; }

        // Incrementa contagem de giros de roleta
        const spins = this._context.globalState.get<number>('stats-roulette-spins', 0) + 1;
        this._context.globalState.update('stats-roulette-spins', spins);

        this._accumulatedProgress += charsAdded;
        const targetThreshold = 80;

        if (charsAdded < 30 && this._accumulatedProgress < targetThreshold) {
            const consoleCoins = Math.floor(Math.random() * 3) + 1;
            this.addCoins(consoleCoins);
            this.checkAchievements();
            this.updateState();
            return;
        }

        const totalEvaluated = this._accumulatedProgress;
        this._accumulatedProgress = 0;

        let rarity: Rarity = 'comum';
        let coinReward = 50;

        if (totalEvaluated >= 1500) {
            rarity = 'lendaria';
            coinReward = Math.random() < 0.5 ? 2500 : 5000;
        } else if (totalEvaluated >= 500) {
            rarity = 'rara';
            coinReward = Math.random() < 0.5 ? 800 : 1200;
        } else if (totalEvaluated >= 150) {
            rarity = 'incomum';
            coinReward = Math.random() < 0.5 ? 250 : 400;
        } else {
            rarity = 'comum';
            coinReward = Math.random() < 0.5 ? 50 : 100;
        }

        this._view.show?.(true);
        this._view.webview.postMessage({
            command: 'triggerChest',
            rollType: 'coins',
            rarity: rarity,
            coinReward: coinReward,
            charsAdded: totalEvaluated
        });
    }

    private handleSpinSlotMachine(): void {
        const cost = 2000;
        const coins = this.getCoins();
        if (coins < cost) {
            this._view?.webview.postMessage({
                command: 'slotMachineResult',
                success: false,
                error: 'Saldo insuficiente! Você precisa de 2.000 moedas.'
            });
            return;
        }

        // Incrementa estatística de giros do cassino
        const slotSpins = this._context.globalState.get<number>('stats-slot-spins', 0) + 1;
        this._context.globalState.update('stats-slot-spins', slotSpins);

        this._context.globalState.update('decor-coins', coins - cost);

        const roll = Math.random();
        let s1 = '', s2 = '', s3 = '';
        let rewardCoins = 0;
        let wonItem: Item | null = null;

        if (roll < 0.0025) {
            // Jackpot
            s1 = '🎰'; s2 = '🎰'; s3 = '🎰';
            const jackpots = this._context.globalState.get<number>('stats-jackpots', 0) + 1;
            this._context.globalState.update('stats-jackpots', jackpots);

            const items = Object.values(ITEM_CATALOG).filter((i) => i.rarity === 'lendaria');
            const pool = items.length > 0 ? items : Object.values(ITEM_CATALOG);
            const item = pool[Math.floor(Math.random() * pool.length)];
            this.giveItemDirectly(item.id);
            wonItem = { ...item, icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`) };
        } else if (roll < 0.0100) {
            s1 = '👑'; s2 = '👑'; s3 = '👑';
            const items = Object.values(ITEM_CATALOG).filter((i) => i.rarity === 'rara');
            const pool = items.length > 0 ? items : Object.values(ITEM_CATALOG);
            const item = pool[Math.floor(Math.random() * pool.length)];
            this.giveItemDirectly(item.id);
            wonItem = { ...item, icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`) };
        } else if (roll < 0.0250) {
            s1 = '📦'; s2 = '📦'; s3 = '📦';
            const items = Object.values(ITEM_CATALOG).filter((i) => i.rarity === 'incomum');
            const pool = items.length > 0 ? items : Object.values(ITEM_CATALOG);
            const item = pool[Math.floor(Math.random() * pool.length)];
            this.giveItemDirectly(item.id);
            wonItem = { ...item, icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`) };
        } else if (roll < 0.0500) {
            s1 = '🎁'; s2 = '🎁'; s3 = '🎁';
            const items = Object.values(ITEM_CATALOG).filter((i) => i.rarity === 'comum');
            const pool = items.length > 0 ? items : Object.values(ITEM_CATALOG);
            const item = pool[Math.floor(Math.random() * pool.length)];
            this.giveItemDirectly(item.id);
            wonItem = { ...item, icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`) };
        } else if (roll < 0.0600) {
            s1 = '⭐'; s2 = '⭐'; s3 = '⭐';
            rewardCoins = 5000; this.addCoins(rewardCoins);
        } else if (roll < 0.0800) {
            s1 = '💎'; s2 = '💎'; s3 = '💎';
            rewardCoins = 3000; this.addCoins(rewardCoins);
        } else if (roll < 0.1200) {
            s1 = '💰'; s2 = '💰'; s3 = '💰';
            rewardCoins = 1500; this.addCoins(rewardCoins);
        } else if (roll < 0.2200) {
            s1 = '🍒'; s2 = '🍒'; s3 = '🍒';
            rewardCoins = 500; this.addCoins(rewardCoins);
        } else if (roll < 0.4000) {
            s1 = '♟'; s2 = '♟'; s3 = '♟';
            rewardCoins = Math.floor(Math.random() * 51) + 50; this.addCoins(rewardCoins);
        } else if (roll < 0.6500) {
            s1 = '💣'; s2 = '🍒'; s3 = '💰';
            rewardCoins = -100; this.addCoins(rewardCoins);
        } else if (roll < 0.8500) {
            s1 = '💣'; s2 = '💣'; s3 = '🍒';
            rewardCoins = -250; this.addCoins(rewardCoins);
        } else {
            s1 = '💣'; s2 = '💣'; s3 = '💣';
            rewardCoins = -500; this.addCoins(rewardCoins);
        }

        let rewardTheme: ThemeDefinition | null = null;
        if (wonItem && Math.random() < 0.4) {
            rewardTheme = this.unlockRandomTheme();
        }

        this.checkAchievements();

        this._view?.webview.postMessage({
            command: 'slotMachineResult',
            success: true,
            symbols: [s1, s2, s3],
            rewardCoins: rewardCoins,
            rewardItem: wonItem,
            rewardTheme: rewardTheme,
            newCoins: this.getCoins()
        });

        this.updateState();
    }

    public getUnlockedThemes(): string[] {
        return this._context.globalState.get<string[]>('decor-unlocked-themes', ['yakuza']);
    }

    public unlockRandomTheme(): ThemeDefinition | null {
        const unlocked = this.getUnlockedThemes();
        const locked = Object.keys(THEME_DEFINITIONS).filter(id => !unlocked.includes(id));
        if (locked.length === 0) { return null; }

        const randomThemeId = locked[Math.floor(Math.random() * locked.length)];
        unlocked.push(randomThemeId);
        this._context.globalState.update('decor-unlocked-themes', unlocked);
        return THEME_DEFINITIONS[randomThemeId];
    }

     public updateState(): void {
        if (this._view) {
            this.checkAchievements();
            const wallUri = getWebviewUri(this._context, this._view.webview, 'icons/Wall Green plain.png');
            this._view.webview.postMessage({
                command: 'syncState',
                coins: this.getCoins(),
                inventory: this.getInventory(),
                placed: this.getPlaced(),
                offsets: this.getOffsets(),
                theme: this.getTheme(),
                unlockedThemes: this.getUnlockedThemes(),
                themeDefinitions: THEME_DEFINITIONS,
                achievements: ACHIEVEMENTS_CATALOG,
                unlockedAchievements: this.getUnlockedAchievements(),
                stats: {
                    rouletteSpins: this._context.globalState.get<number>('stats-roulette-spins', 0),
                    slotSpins: this._context.globalState.get<number>('stats-slot-spins', 0),
                    jackpots: this._context.globalState.get<number>('stats-jackpots', 0),
                    coinsEarned: this._context.globalState.get<number>('stats-coins-earned', 0)
                },
                wallUri: wallUri
            });
        }
    }

    public getCoins(): number {
        return this._context.globalState.get<number>('decor-coins', 50);
    }

    public addCoins(amount: number): void {
        if (amount > 0) {
            const earned = this._context.globalState.get<number>('stats-coins-earned', 0) + amount;
            this._context.globalState.update('stats-coins-earned', earned);
        }
        this._context.globalState.update('decor-coins', this.getCoins() + amount);
    }

    public getInventory(): string[] {
        return this._context.globalState.get<string[]>('decor-inventory', []);
    }

    public getPlaced(): string[] {
        return this._context.globalState.get<string[]>('decor-placed', []);
    }

    public getTheme(): string {
        return this._context.globalState.get<string>('decor-theme', 'yakuza');
    }

    public getOffsets(): Record<string, Offset> {
        return this._context.globalState.get<Record<string, Offset>>('decor-offsets', {});
    }

    public giveItemDirectly(itemId: string): void {
        const inv = this.getInventory();
        if (!inv.includes(itemId)) {
            inv.push(itemId);
            this._context.globalState.update('decor-inventory', inv);
        }
    }

    public toggleItemPlacement(itemId: string): void {
        let placed = this.getPlaced();
        placed = placed.includes(itemId) ? placed.filter((id) => { return id !== itemId; }) : [...placed, itemId];
        this._context.globalState.update('decor-placed', placed);
    }

    public saveItemOffset(itemId: string, x: number, y: number, z: number): void {
        const offsets = this.getOffsets();
        offsets[itemId] = { x, y, z };
        this._context.globalState.update('decor-offsets', offsets);
    }

    public saveTheme(themeId: string): void {
        this._context.globalState.update('decor-theme', themeId);
    }
}