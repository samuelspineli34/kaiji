import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ITEM_CATALOG, Item, Offset, Rarity } from './items';

const documentCharTracker = new Map<string, number>();

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
                        this.saveItemOffset(message.itemId, message.x, message.y, message.z || 0);
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

    public handleSaveAndAssessChest(charsAdded: number): void {
        if (!this._view) {
            return;
        }

        this._accumulatedProgress += charsAdded;
        const targetThreshold = 80;

        if (charsAdded < 30 && this._accumulatedProgress < targetThreshold) {
            const consoleCoins = Math.floor(Math.random() * 3) + 1;
            this.addCoins(consoleCoins);
            this.updateState();
            vscode.window.setStatusBarMessage(
                `✍️ Código salvo (+${charsAdded} chars). Progresso da Roleta: ${this._accumulatedProgress}/${targetThreshold}`,
                4000
            );
            return;
        }

        const totalEvaluated = this._accumulatedProgress;
        this._accumulatedProgress = 0;

        // VALORES DE COIN LÓGICOS DE ACORDO COM AS RARIDADES
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

        vscode.window.setStatusBarMessage(`🎰 ROLETA ATIVADA! ${totalEvaluated} caracteres codificados sem erros!`, 5000);
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

        this._context.globalState.update('decor-coins', coins - cost);

        const roll = Math.random();
        let winType: 'jackpot' | 'box' | 'star' | 'diamond' | 'bag' | 'cherry' | 'loss' = 'loss';

        if (roll < 0.02) {
            winType = 'jackpot';
        } else if (roll < 0.07) {
            winType = 'box';
        } else if (roll < 0.17) {
            winType = 'star';
        } else if (roll < 0.32) {
            winType = 'diamond';
        } else if (roll < 0.55) {
            winType = 'bag';
        } else if (roll < 0.80) {
            winType = 'cherry';
        } else {
            winType = 'loss';
        }

        const symbolsList = ['🍒', '💰', '💎', '⭐', '🎁', '🎰', '💣'];
        let s1 = '';
        let s2 = '';
        let s3 = '';
        let rewardCoins = 0;
        let wonItem: Item | null = null;

        if (winType === 'jackpot') {
            s1 = '🎰'; s2 = '🎰'; s3 = '🎰';
            const rareItems = Object.values(ITEM_CATALOG).filter((i) => {
                return i.rarity === 'rara' || i.rarity === 'lendaria';
            });
            const item = rareItems[Math.floor(Math.random() * rareItems.length)];
            this.giveItemDirectly(item.id);
            wonItem = {
                ...item,
                icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`)
            };
        } else if (winType === 'box') {
            s1 = '🎁'; s2 = '🎁'; s3 = '🎁';
            const commonItems = Object.values(ITEM_CATALOG).filter((i) => {
                return i.rarity === 'comum' || i.rarity === 'incomum';
            });
            const item = commonItems[Math.floor(Math.random() * commonItems.length)];
            this.giveItemDirectly(item.id);
            wonItem = {
                ...item,
                icon: getWebviewUri(this._context, this._view!.webview, `icons/${item.icon}`)
            };
        } else if (winType === 'star') {
            s1 = '⭐'; s2 = '⭐'; s3 = '⭐';
            rewardCoins = 5000;
            this.addCoins(rewardCoins);
        } else if (winType === 'diamond') {
            s1 = '💎'; s2 = '💎'; s3 = '💎';
            rewardCoins = 3000;
            this.addCoins(rewardCoins);
        } else if (winType === 'bag') {
            s1 = '💰'; s2 = '💰'; s3 = '💰';
            rewardCoins = 1500;
            this.addCoins(rewardCoins);
        } else if (winType === 'cherry') {
            s1 = '🍒'; s2 = '🍒'; s3 = '🍒';
            rewardCoins = 500;
            this.addCoins(rewardCoins);
        } else {
            s1 = symbolsList[Math.floor(Math.random() * (symbolsList.length - 2))];
            do {
                s2 = symbolsList[Math.floor(Math.random() * symbolsList.length)];
            } while (s2 === s1 && Math.random() < 0.6);

            do {
                s3 = symbolsList[Math.floor(Math.random() * symbolsList.length)];
            } while ((s1 === s2 && s3 === s1) || (s3 === s1 && s3 === s2));

            rewardCoins = Math.floor(Math.random() * 51) + 50;
            this.addCoins(rewardCoins);
        }

        this._view?.webview.postMessage({
            command: 'slotMachineResult',
            success: true,
            symbols: [s1, s2, s3],
            rewardCoins: rewardCoins,
            rewardItem: wonItem,
            newCoins: this.getCoins()
        });

        this.updateState();
    }

    public updateState(): void {
        if (this._view) {
            const wallUri = getWebviewUri(this._context, this._view.webview, 'icons/Wall Green plain.png');
            this._view.webview.postMessage({
                command: 'syncState',
                coins: this.getCoins(),
                inventory: this.getInventory(),
                placed: this.getPlaced(),
                offsets: this.getOffsets(),
                theme: this.getTheme(),
                wallUri: wallUri
            });
        }
    }

    public getCoins(): number {
        return this._context.globalState.get<number>('decor-coins', 50);
    }

    public addCoins(amount: number): void {
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