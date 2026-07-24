"In the world of business and development, just as on underground gambling tables, those who do not play to win have already accepted defeat."

Kaiji is a high-stakes gamified productivity extension for Visual Studio Code, inspired by the philosophy of survival, despair, and reward found in the work of Nobuyuki Fukumoto. It transforms the routine act of saving code into a real psychological and chemical bet for your brain, stimulating absolute focus through variable rewards, an underground casino, and workspace customization.

---

## The Philosophy of Risk: Why Bet on Your Code?

Most programmers live a monotonous routine of predictable text typing. However, the human mind was not designed for tedious stability; we evolved to respond to risk, scarcity, and the adrenaline of uncertainty.

Betting your effort is the only way to assign real value to work. When you save a file with hundreds of modified characters without syntax errors, you are not just sending data to the hard drive. You are putting your life force and precious time on the betting table of the Teiai Group.

As Yukio Tonegawa would say: "Money is more important than life itself, because people spend their lives to get it." In Kaiji, your clean code is your betting chip. Zawa... Zawa...

---

## How the Extension Works

The extension monitors your changes in real-time locally, securely, and integrated with the editor's syntax validation. The current ecosystem is composed of five interconnected pillars:

### 1. Effort and House Validation (Anti-Error)

Every time you save a text file, the extension analyzes the character delta compared to the previous save:

* **Syntax Error Check**: If the code is saved with structural or compilation errors, the house rejects the save and blocks the roulette until you fix the issues.
* **Minimal Change (less than 30 characters)**: Grants 1 to 3 consolation coins directly to your wallet to reward small adjustments.
* **Accumulated Roulette Progress**: Valid changes accumulate in the effort meter until reaching the target to trigger the Code Roulette.

### 2. The Code Roulette (Save Gacha)

Upon reaching the required volume of code, an illuminated 3D Canvas Roulette is triggered on screen. The value of the reward drawn in coins depends directly on the accumulated volume of characters processed:

* **Common Tier (80 to 149 characters)**: Draws rewards between 50 and 100 coins.
* **Uncommon Tier (150 to 499 characters)**: Draws rewards between 250 and 400 coins.
* **Rare Tier (500 to 1499 characters)**: Draws rewards between 800 and 1200 coins.
* **Legendary Tier (1500+ characters)**: Draws massive prizes from 2500 to 5000 coins.

### 3. The Teiai Casino (Slot Machine with Mechanical Side Lever)

For developers willing to risk their coins in search of prestige, the Teiai Casino offers a classic slot machine complete with a stylized cabinet and golden LED lighting:

* **Cost per Spin**: 2,000 coins.
* **Mechanical Side Lever**: Triggered by a click with realistic physical rotation animation and spring return.
* **Sequential Reels**: The reels spin with a speed effect and stop one by one (Reel 1, Reel 2, and Reel 3) to generate real casino suspense.
* **Casino Rewards and Risks**: Possibility of winning rare and legendary furniture, unlocking exclusive wall paint themes, multiplying coins with stars and diamonds, or suffering penalties with bombs (-100, -250, or -500 coins).

### 4. 3D Isometric Decorative Workspace and Wall Themes

The main tab displays your virtual betting office in 3D isometric perspective with advanced customization features:

* **Draggable Camera**: Free navigation and panning of the isometric scene with the mouse.
* **D-Pad Positioning and Z-Elevation**: Precise control of furniture movement on the X and Y axes, plus a vertical elevation slider (Z-axis) to place items on top of tables or shelves.
* **Themes and Paint System**: Unlock and apply various wall and floor themes (Yakuza, Cyberpunk, Royal Gold, Zen Tatami, Twilight, Sakura Cherry, Forest Tavern, Nordic Attic, and more).
* **Lighting Variants and CSS Filters**: Furniture with special visual effects such as Neon, Solid Gold, Cosmic Void, Retro, and Elemental Shadows editions.

### 5. The Master Achievement System

A complete achievements panel to track your journey of evolution and code addiction. The game features over 120 categorized achievements:

* **Categories**: Item Collection, Roulette Spins, Casino Spins, Jackpot Hits, Accumulated Wealth, Placed Furniture, Unlocked Themes, and Collected Rarities.
* **Coin Rewards and Exclusive Items**: Upon reaching the final achievement of each module, the player wins massive amounts of coins and exclusive must-have furniture (such as the Imperial Crown, the Alchemical Statue, and the Golden Arcade).
* **Ultimate Perfectionist Achievement (100%)**: Granted upon completing all other achievements in the game, rewarding the player with the legendary Platinum Kaiji Trophy.

---

## Item Rarity Catalog

The decorative items available in the game are divided into four prestige tiers:

* **Common**: Simple chairs, rustic stools, candles, basic potions, rugs, and desk lamps.
* **Uncommon**: Armchairs, arcane bookshelves, animated flasks, contemporary sofas, swords, and coat hangers.
* **Rare**: Desktop computers, gaming chairs, animated alchemical cauldrons, sunny windows, exercise bikes, and golden replicas.
* **Legendary**: Animated sunset window, chest full of gold, royal golden throne, Teiai arcade cabinet, dragon statue, and the master platinum trophy.

---

## How to Run and Test Locally

If you want to compile and test the extension in a development environment:

1. Open the project root folder in VS Code.
2. In the integrated terminal, install dependencies and start the TypeScript compilation:
   ```bash
   npm run compile
   ```
   or for continuous automatic compilation:
   ```bash
   npm run watch
   ```
3. Press `F5` to open the test window (Extension Development Host).
4. In the test window, open any project or code folder.
5. Save changes in your text files to accumulate progress and trigger the Roulette and Casino.

---

## Data Persistence

Your coin balance, inventory, custom furniture positions, themes, and achievements are saved automatically in your VS Code global storage. If you wish to restart your journey from scratch, use the command in the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

`Kaiji: Reset Progress`