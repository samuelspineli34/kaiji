import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { ITEM_CATALOG, UNLOCKABLE_THEMES, Item, Rarity, Offset } from './items';

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
                context.globalState.update('decor-unlocked-themes', ['yakuza']);
                provider.updateState();
                vscode.window.showInformationMessage('Progresso limpo.');
            }
        })
    );

    vscode.workspace.textDocuments.forEach(doc => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    vscode.workspace.onDidOpenTextDocument(doc => {
        documentCharTracker.set(doc.uri.toString(), doc.getText().length);
    });

    vscode.workspace.onDidSaveTextDocument((document) => {
        const uriStr = document.uri.toString();
        const currentLength = document.getText().length;
        const previousLength = documentCharTracker.get(uriStr) ?? 0;
        documentCharTracker.set(uriStr, currentLength);

        const diff = currentLength - previousLength;
        if (diff > 0) {
            provider.handleSaveAndAssessChest(diff);
        }
    });
}



function getWebviewUri(context: vscode.ExtensionContext, webview: vscode.Webview, relativePath: string): string {
    const diskPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'icons', relativePath);
    return webview.asWebviewUri(diskPath).toString();
}

function getResolvedCatalog(context: vscode.ExtensionContext, webview: vscode.Webview): Record<string, any> {
    const resolved: Record<string, any> = {};
    for (const [key, item] of Object.entries(ITEM_CATALOG)) {
        const resolvedItem = { ...item };
        resolvedItem.icon = getWebviewUri(context, webview, item.icon);

        if (item.animation) {
            const animatedFrames: string[] = [];
            for (let i = 1; i <= item.animation.frames; i++) {
                const framePath = `${item.animation.folder}${i}${item.animation.suffix}`;
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

    constructor(private readonly _context: vscode.ExtensionContext) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        _context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken
    ): void | Thenable<void> {
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
                        if (message.itemId) {
                            if (UNLOCKABLE_THEMES.includes(message.itemId)) {
                                this.unlockTheme(message.itemId);
                            } else {
                                this.giveItemDirectly(message.itemId);
                            }
                        }
                        this.updateState();
                    }
                    return;
                case 'togglePlacement':
                    if (message.itemId) {
                        this.toggleItemPlacement(message.itemId);
                        this.updateState();
                    }
                    return;
                // No método resolveWebviewView, dentro de webviewView.webview.onDidReceiveMessage, atualize o caso 'saveOffset':
                case 'saveOffset':
                    if (message.itemId && message.x !== undefined && message.y !== undefined) {
                        this.saveItemOffset(message.itemId, message.x, message.y, message.z || 0);
                    }
                    return;
                case 'saveTheme':
                    if (message.themeId) {
                        this.saveTheme(message.themeId);
                        this.updateState();
                    }
                    return;
            }
        });

        let html = fs.readFileSync(
            path.join(this._context.extensionPath, 'media', 'sidebar.html'),
            'utf8'
        );
        html = html.replace('/*CATALOG_PLACEHOLDER*/', `const catalog = ${JSON.stringify(getResolvedCatalog(this._context, webviewView.webview))};`);
        webviewView.webview.html = html;
    }

    public handleSaveAndAssessChest(charsAdded: number): void {
        if (!this._view) {
            return;
        }

        if (charsAdded < 30) {
            const consoleCoins = Math.floor(Math.random() * 3) + 1;
            this.addCoins(consoleCoins);
            this.updateState();
            vscode.window.setStatusBarMessage(`✍️ Modificações curtas: +${consoleCoins} moedas.`, 4000);
            return;
        }

        let rarity: Rarity = 'comum';
        let coinReward = Math.floor(Math.random() * 11) + 15;

        if (charsAdded >= 1500) {
            rarity = Math.random() < 0.15 ? 'lendaria' : 'rara';
            coinReward = Math.floor(Math.random() * 201) + 200;
        } else if (charsAdded >= 500) {
            rarity = Math.random() < 0.25 ? 'rara' : 'incomum';
            coinReward = Math.floor(Math.random() * 101) + 100;
        } else if (charsAdded >= 150) {
            rarity = Math.random() < 0.35 ? 'incomum' : 'comum';
            coinReward = Math.floor(Math.random() * 51) + 40;
        }

        const rVal = Math.random();
        let rollType = 'coins';
        let rolledItem: any = null;

        if (rVal < 0.40) {
            rollType = 'coins';
        } else if (rVal < 0.80) {
            rollType = 'chest';
            const matchingItems = Object.values(ITEM_CATALOG).filter(i => i.rarity === rarity && i.obtainable === 'chest');
            rolledItem = matchingItems[Math.floor(Math.random() * matchingItems.length)];
        } else {
            rollType = 'theme';
            const themeRolls: Record<Rarity, { id: string, name: string }[]> = {
                comum: [{ id: 'yakuza', name: 'Tema Tradicional Teiai' }],
                incomum: [{ id: 'zen', name: 'Tema Tatami Zen' }],
                rara: [
                    { id: 'dusk', name: 'Tema Crepúsculo Tóquio' },
                    { id: 'cyber', name: 'Tema Cyberpunk Neon' },
                    { id: 'forest', name: 'Tema Floresta de Cedros' },
                    { id: 'coffee', name: 'Tema Grãos de Café' }
                ],
                lendaria: [
                    { id: 'gold', name: 'Tema Pachinko Gold' },
                    { id: 'sakura', name: 'Tema Cerejeira de Kyoto' },
                    { id: 'nordic', name: 'Tema Minimalista Nórdico' }
                ]
            };
            const rolledTheme = themeRolls[rarity][Math.floor(Math.random() * themeRolls[rarity].length)];
            rolledItem = {
                id: rolledTheme.id,
                name: rolledTheme.name,
                icon: ''
            };
        }

        const resolvedRolledItem = (rolledItem && rollType === 'chest') ? {
            ...rolledItem,
            icon: getWebviewUri(this._context, this._view.webview, rolledItem.icon)
        } : rolledItem;

        this._view.webview.postMessage({
            command: 'triggerChest',
            rollType,
            rarity,
            coinReward,
            rolledItem: resolvedRolledItem
        });

        vscode.commands.executeCommand('workbench.view.explorer');
    }

    public updateState(): void {
        if (this._view) {
            const wallUri = getWebviewUri(this._context, this._view.webview, 'Wall Green plain.png');
            const woodTileUri = getWebviewUri(this._context, this._view.webview, 'Tiles/light_brown/tile_light_brown_1.png');
            const grayTileUri = getWebviewUri(this._context, this._view.webview, 'Tiles/gray/tile_gray_1.png');

            this._view.webview.postMessage({
                command: 'syncState',
                coins: this.getCoins(),
                inventory: this.getInventory(),
                placed: this.getPlaced(),
                offsets: this.getOffsets(),
                theme: this.getTheme(),
                unlockedThemes: this.getUnlockedThemes(),
                wallUri: wallUri,
                woodTileUri: woodTileUri,
                grayTileUri: grayTileUri
            });
        }
    }

    public getCoins(): number {
        return this._context.globalState.get<number>('decor-coins', 50);
    }

    public addCoins(amount: number): void {
        const current = this.getCoins();
        this._context.globalState.update('decor-coins', current + amount);
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

    public getUnlockedThemes(): string[] {
        return this._context.globalState.get<string[]>('decor-unlocked-themes', ['yakuza']);
    }

    public getOffsets(): Record<string, Offset> {
        return this._context.globalState.get<Record<string, Offset>>('decor-offsets', {});
    }

    public giveItemDirectly(itemId: string): void {
        const inventory = this.getInventory();
        if (!inventory.includes(itemId)) {
            inventory.push(itemId);
            this._context.globalState.update('decor-inventory', inventory);
        }
    }

    public unlockTheme(themeId: string): void {
        const unlocked = this.getUnlockedThemes();
        if (!unlocked.includes(themeId)) {
            unlocked.push(themeId);
            this._context.globalState.update('decor-unlocked-themes', unlocked);
        }
    }

    public toggleItemPlacement(itemId: string): void {
        let placed = this.getPlaced();
        if (placed.includes(itemId)) {
            placed = placed.filter(id => id !== itemId);
        } else {
            placed.push(itemId);
        }
        this._context.globalState.update('decor-placed', placed);
    }

    // Atualize a assinatura e corpo do método saveItemOffset na classe KaijiSidebarProvider:
    public saveItemOffset(itemId: string, x: number, y: number, z: number): void {
        const offsets = this.getOffsets();
        offsets[itemId] = { x, y, z };
        this._context.globalState.update('decor-offsets', offsets);
    }

    public saveTheme(themeId: string): void {
        this._context.globalState.update('decor-theme', themeId);
    }

}