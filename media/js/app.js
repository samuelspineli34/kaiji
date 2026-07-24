// Adquire API do VS Code ou faz Mock para preview local
let vscode;
try {
    vscode = acquireVsCodeApi();
} catch (e) {
    vscode = {
        postMessage: (msg) => {
            console.log("Mock postMessage:", msg);
        }
    };
}

let localCoins = 0;
let localInventory = [];
let localPlaced = [];
let localOffsets = {};
let selectedItemId = null;
let activeIntervals = [];
let isSpinning = false;
let currentReward = null;
let localUnlockedThemes = ['yakuza'];
let localThemeDefinitions = {};
// --- SISTEMA DE CONQUISTAS (CLIENT-SIDE) ---
let localAchievements = [];
let localUnlockedAchievements = [];
let localStats = {};
let currentAchievementFilter = 'all';

window.toggleAchievements = function(open) {
    const panel = document.getElementById('achievementsPanel');
    if (panel) {
        if (open) {
            renderAchievements();
        }
        panel.classList.toggle('open', Boolean(open));
    }
};

window.filterAchievements = function(filter, btn) {
    currentAchievementFilter = filter;
    document.querySelectorAll('.achievements-filter .filter-btn').forEach((b) => {
        b.classList.remove('active');
    });
    if (btn) {
        btn.classList.add('active');
    }
    renderAchievements();
};

function getAchievementProgress(ach) {
    const inv = localInventory || [];
    const placed = localPlaced || [];
    const themes = localUnlockedThemes || [];

    let val = 0;
    switch (ach.category) {
        case 'colecao':
            val = inv.length;
            break;
        case 'roleta':
            val = localStats.rouletteSpins || 0;
            break;
        case 'cassino':
            val = localStats.slotSpins || 0;
            break;
        case 'jackpot':
            val = localStats.jackpots || 0;
            break;
        case 'riqueza':
            val = localStats.coinsEarned || 0;
            break;
        case 'decoracao':
            val = placed.length;
            break;
        case 'temas':
            val = themes.length;
            break;
        case 'raridade': {
            const targetRarity = ach.id.replace('rarity_', '').split('_')[0];
            val = inv.filter((id) => {
                const item = typeof catalog !== 'undefined' ? catalog[id] : null;
                return item && item.rarity === targetRarity;
            }).length;
            break;
        }
    }
    return val;
}

function renderAchievements() {
    const list = document.getElementById('achievementsList');
    const summary = document.getElementById('achievementsSummary');
    if (!list) {
        return;
    }

    list.innerHTML = '';
    const unlockedSet = new Set(localUnlockedAchievements || []);

    if (summary) {
        summary.innerText = `${unlockedSet.size}/${localAchievements.length}`;
    }

    const filtered = (localAchievements || []).filter((ach) => {
        const isDone = unlockedSet.has(ach.id);
        if (currentAchievementFilter === 'completed') { return isDone; }
        if (currentAchievementFilter === 'in_progress') { return !isDone; }
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding: 30px; color: #a28f80; font-size: 0.8em;">Nenhuma conquista encontrada neste filtro.</div>';
        return;
    }

    filtered.forEach((ach) => {
        const isDone = unlockedSet.has(ach.id);
        const currentVal = getAchievementProgress(ach);
        const percentage = Math.min(100, Math.floor((currentVal / ach.target) * 100));

        list.innerHTML += `
            <div class="achievement-card ${isDone ? 'completed' : ''}">
                <div class="achievement-icon">${ach.icon}</div>
                <div class="achievement-details">
                    <div class="achievement-title">${ach.title} ${isDone ? '✅' : ''}</div>
                    <div class="achievement-desc">${ach.description}</div>
                    <div class="achievement-progress-bg">
                        <div class="achievement-progress-fill" style="width: ${isDone ? '100%' : percentage + '%'};"></div>
                    </div>
                </div>
                <div class="achievement-reward">
                    +${ach.rewardCoins} 💰
                </div>
            </div>
        `;
    });
}

function renderThemes() {
    const grid = document.getElementById('themesGrid');
    if (!grid) {return;};
    grid.innerHTML = '';

    Object.values(localThemeDefinitions).forEach(t => {
        const isUnlocked = localUnlockedThemes.includes(t.id);
        const isActive = localTheme === t.id;
        
        const btn = document.createElement('button');
        btn.className = `theme-btn ${isUnlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''}`;
        btn.innerHTML = `${isUnlocked ? '' : '🔒 '}${t.name}`;
        btn.title = isUnlocked ? `Aplicar tema ${t.name}` : `Tema Bloqueado! Desbloqueie no Cassino 🎰`;
        
        if (isUnlocked) {
            btn.onclick = () => selectThemePreset(t);
        }
        grid.appendChild(btn);
    });
}

function selectThemePreset(theme) {
    applyWallVisual(theme.wallColor);
    applyFloorVisual(theme.floorColor);
    localTheme = theme.id;
    renderThemes();
    
    vscode.postMessage({
        command: 'saveTheme',
        themeId: theme.id
    });
}

const rarityColors = {
    comum: '#8b949e',
    incomum: '#58a6ff',
    rara: '#bc8cff',
    lendaria: '#dfb15b'
};

// --- PAINÉIS E MODAIS ---
function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        const isHidden = !panel.style.display || panel.style.display === 'none';
        panel.style.display = isHidden ? 'flex' : 'none';
    }
}

function toggleShop(open) {
    const panel = document.getElementById('shopPanel');
    if (panel) {
        panel.classList.toggle('open', open);
    }
}

function toggleSlotMachine(open) {
    const panel = document.getElementById('slotPanel');
    if (panel) {
        panel.classList.toggle('open', open);
    }
}

function closeRouletteModal() {
    document.getElementById('chestOverlay').style.display = 'none';
    currentReward = null;
}

// --- PINTURA ---
function applyWallVisual(color, textureUrl) {
    const wallLeft = document.getElementById('wallLeft');
    const wallRight = document.getElementById('wallRight');
    if (wallLeft && wallRight) {
        wallLeft.style.backgroundColor = color;
        wallRight.style.backgroundColor = color;
        
        if (textureUrl) {
            wallLeft.style.backgroundImage = `url("${textureUrl}")`;
            wallRight.style.backgroundImage = `url("${textureUrl}")`;
            wallLeft.style.backgroundRepeat = 'repeat';
            wallRight.style.backgroundRepeat = 'repeat';
        } else {
            wallLeft.style.backgroundImage = 'none';
            wallRight.style.backgroundImage = 'none';
        }
    }
}

function applyFloorVisual(color, textureUrl) {
    const roomBase = document.getElementById('roomBase');
    if (roomBase) {
        roomBase.style.backgroundColor = color;
        if (textureUrl) {
            roomBase.style.backgroundImage = `url("${textureUrl}")`;
            roomBase.style.backgroundRepeat = 'repeat';
        } else {
            roomBase.style.backgroundImage = 'none';
        }
    }
}

function selectThemePreset(theme) {
    applyWallVisual(theme.wallColor, theme.wallTexture);
    applyFloorVisual(theme.floorColor, theme.floorTexture);
    localTheme = theme.id;
    renderThemes();

    vscode.postMessage({
        command: 'saveTheme',
        themeId: theme.id
    });
}

function changeWallColor(color) {
    applyWallVisual(color);
    saveCustomColors();
}

function changeFloorColor(color) {
    applyFloorVisual(color);
    saveCustomColors();
}

function saveCustomColors() {
    const wallColor = document.getElementById('wallColorPicker').value;
    const floorColor = document.getElementById('floorColorPicker').value;
    vscode.postMessage({
        command: 'saveTheme',
        themeId: `custom|${wallColor}|${floorColor}`
    });
}

// --- INVENTÁRIO (Colocar e Guardar móveis) ---
function renderInventory() {
    const list = document.getElementById('shopList');
    list.innerHTML = '';

    if (!localInventory || localInventory.length === 0) {
        list.innerHTML = '<div style="text-align:center; padding: 40px 20px; color:#a28f80; font-size:0.85em;">Seu inventário está vazio.<br><br>Salve arquivos de código para ganhar baús! 🎁</div>';
        return;
    }

    localInventory.forEach((itemId) => {
        const item = catalog[itemId];
        if (item) {
            const isPlaced = localPlaced.includes(itemId);
            const itemStyle = item.filter ? `style="filter: ${item.filter}; image-rendering: pixelated;"` : 'style="image-rendering: pixelated;"';
            list.innerHTML += `
                <div class="shop-item">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${item.icon}" ${itemStyle} style="max-width:28px; max-height:28px;" />
                        <div>
                            <div style="font-weight:bold; font-size:0.85em;">${item.name}</div>
                            <span class="badge" style="color:${rarityColors[item.rarity]}">${item.rarity.toUpperCase()}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background:${isPlaced ? '#d11313' : '#286b39'}" onclick="togglePlacement('${item.id}')">
                        ${isPlaced ? 'Guardar' : 'Colocar'}
                    </button>
                </div>
            `;
        }
    });
}

function togglePlacement(itemId) {
    if (itemId === selectedItemId) {
        deselectItem();
    }
    vscode.postMessage({ command: 'togglePlacement', itemId: itemId });
}

// --- SELEÇÃO E MOVIMENTAÇÃO DE MÓVEIS ---
function selectItem(itemId, name) {
    selectedItemId = itemId;
    document.querySelectorAll('.room-item').forEach((el) => {
        el.classList.remove('selected');
    });

    const selectedEl = document.getElementById('item-' + itemId);
    if (selectedEl) {
        selectedEl.classList.add('selected');
    }

    document.getElementById('selectedItemName').innerText = name;
    document.getElementById('movementPad').style.display = 'flex';

    const offset = localOffsets[itemId] || { x: 0, y: 0, z: 0 };
    document.getElementById('elevationSlider').value = offset.z || 0;
    document.getElementById('elevationVal').innerText = (offset.z || 0) + 'px';
}

function deselectItem() {
    selectedItemId = null;
    document.querySelectorAll('.room-item').forEach((el) => {
        el.classList.remove('selected');
    });
    document.getElementById('movementPad').style.display = 'none';
}

function applyPositionOffset(element, offset) {
    element.style.marginTop = offset.y + 'px';
    element.style.marginLeft = offset.x + 'px';
    const visual = element.querySelector('.item-visual');
    if (visual) {
        // Subir a altura no isometrico = deslocar Y negativo
        visual.style.transform = `translateY(${- (offset.z || 0)}px)`;
    }
}

function moveItem(direction) {
    if (!selectedItemId) {
        return;
    }
    const offset = localOffsets[selectedItemId] || { x: 0, y: 0, z: 0 };
    const step = 6;

    if (direction === 'up') {
        offset.y -= step;
    }
    if (direction === 'down') {
        offset.y += step;
    }
    if (direction === 'left') {
        offset.x -= step;
    }
    if (direction === 'right') {
        offset.x += step;
    }

    localOffsets[selectedItemId] = offset;
    const itemEl = document.getElementById('item-' + selectedItemId);
    if (itemEl) {
        applyPositionOffset(itemEl, offset);
    }

    vscode.postMessage({ command: 'saveOffset', itemId: selectedItemId, x: offset.x, y: offset.y, z: offset.z || 0 });
}

function adjustElevation(value) {
    if (!selectedItemId) {
        return;
    }
    const offset = localOffsets[selectedItemId] || { x: 0, y: 0, z: 0 };
    offset.z = parseInt(value, 10) || 0;
    localOffsets[selectedItemId] = offset;

    const itemEl = document.getElementById('item-' + selectedItemId);
    if (itemEl) {
        applyPositionOffset(itemEl, offset);
    }

    document.getElementById('elevationVal').innerText = value + 'px';
    vscode.postMessage({ command: 'saveOffset', itemId: selectedItemId, x: offset.x, y: offset.y, z: offset.z });
}

// --- SPRITE ANIMATION MANAGER ---
function clearAllIntervals() {
    activeIntervals.forEach((interval) => {
        clearInterval(interval);
    });
    activeIntervals = [];
}

function setupAnimation(imgElement, framesArray, speed) {
    if (!framesArray || framesArray.length === 0) {
        return;
    }
    let currentFrameIdx = 0;
    const interval = setInterval(() => {
        currentFrameIdx = (currentFrameIdx + 1) % framesArray.length;
        imgElement.src = framesArray[currentFrameIdx];
    }, speed);
    activeIntervals.push(interval);
}

// --- ROLETA REDONDA 3D EM CANVAS COM RARIDADES LÓGICAS ---
const wheelSlices = [
    { label: '50 💰', value: 50, color: '#1f1a26', textColor: '#8b949e', rarity: 'comum' },
    { label: '100 💰', value: 100, color: '#252030', textColor: '#8b949e', rarity: 'comum' },
    { label: '250 💰', value: 250, color: '#1b2d42', textColor: '#58a6ff', rarity: 'incomum' },
    { label: '400 💰', value: 400, color: '#223854', textColor: '#58a6ff', rarity: 'incomum' },
    { label: '800 💰', value: 800, color: '#38224d', textColor: '#bc8cff', rarity: 'rara' },
    { label: '1200 💰', value: 1200, color: '#4a2863', textColor: '#bc8cff', rarity: 'rara' },
    { label: '2500 💰', value: 2500, color: '#4d3b1b', textColor: '#dfb15b', rarity: 'lendaria' },
    { label: '5000 💰', value: 5000, color: '#591b38', textColor: '#ff007f', rarity: 'lendaria' }
];

let currentWheelAngle = 0;

function drawWheel(angle, lightPhase) {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const center = width / 2;
    const radius = center - 12;
    const sliceAngle = (2 * Math.PI) / wheelSlices.length;

    ctx.clearRect(0, 0, width, height);

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);

    wheelSlices.forEach((slice, i) => {
        const start = i * sliceAngle;
        const end = start + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, start, end);
        ctx.closePath();

        ctx.fillStyle = slice.color;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'rgba(223, 177, 91, 0.4)';
        ctx.stroke();

        ctx.save();
        ctx.rotate(start + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = slice.textColor;
        ctx.font = 'bold 11px Segoe UI, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(slice.label, radius - 18, 4);
        ctx.restore();
    });

    ctx.restore();

    ctx.save();
    ctx.translate(center, center);
    ctx.beginPath();
    ctx.arc(0, 0, radius + 2, 0, 2 * Math.PI);
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#dfb15b';
    ctx.stroke();

    const bulbCount = 16;
    for (let i = 0; i < bulbCount; i++) {
        const bulbAngle = (i * 2 * Math.PI) / bulbCount;
        const bx = Math.cos(bulbAngle) * (radius + 2);
        const by = Math.sin(bulbAngle) * (radius + 2);

        ctx.beginPath();
        ctx.arc(bx, by, 3.5, 0, 2 * Math.PI);
        const isLit = (i + (lightPhase || 0)) % 2 === 0;
        ctx.fillStyle = isLit ? '#ffffff' : '#523c1c';
        if (isLit) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 8;
        } else {
            ctx.shadowBlur = 0;
        }
        ctx.fill();
    }
    ctx.restore();

    ctx.beginPath();
    ctx.arc(center, center, 22, 0, 2 * Math.PI);
    const grad = ctx.createRadialGradient(center, center, 2, center, center, 22);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#dfb15b');
    grad.addColorStop(1, '#523c1c');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
}

function setupSaveGacha(rewardData) {
    currentReward = rewardData;

    const overlay = document.getElementById('chestOverlay');
    overlay.style.display = 'flex';

    document.getElementById('gachaResultContainer').style.display = 'none';
    document.getElementById('rouletteWrapper').style.display = 'flex';

    const chars = rewardData.charsAdded || 0;
    document.getElementById('rouletteHeader').innerText = 'SORTEANDO RECOMPENSA';
    document.getElementById('rouletteSubheader').innerText = `CÓDIGO SALVO: ${chars} CARACTERES MODIFICADOS`;

    let targetSliceIndex = wheelSlices.findIndex((s) => {
        return s.value === rewardData.coinReward;
    });
    if (targetSliceIndex === -1) {
        targetSliceIndex = Math.floor(Math.random() * wheelSlices.length);
        currentReward.coinReward = wheelSlices[targetSliceIndex].value;
        currentReward.rarity = wheelSlices[targetSliceIndex].rarity;
    }

    const sliceAngle = (2 * Math.PI) / wheelSlices.length;
    const targetSliceAngle = (3 * Math.PI) / 2 - (targetSliceIndex * sliceAngle + sliceAngle / 2);
    const totalSpins = 6;
    const finalAngle = totalSpins * 2 * Math.PI + targetSliceAngle;

    const startTime = performance.now();
    const duration = 3800;
    const initialAngle = currentWheelAngle % (2 * Math.PI);

    let lightPhase = 0;
    const lightInterval = setInterval(() => {
        lightPhase = (lightPhase + 1) % 2;
    }, 150);

    function animateWheel(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentWheelAngle = initialAngle + (finalAngle - initialAngle) * easeOut;

        drawWheel(currentWheelAngle, lightPhase);

        if (progress < 1) {
            requestAnimationFrame(animateWheel);
        } else {
            clearInterval(lightInterval);
            setTimeout(() => {
                document.getElementById('rouletteWrapper').style.display = 'none';
                revealCoinAward();
                launchConfetti();
            }, 300);
        }
    }

    requestAnimationFrame(animateWheel);
}

function revealCoinAward() {
    const container = document.getElementById('gachaResultContainer');
    const color = rarityColors[currentReward.rarity] || '#dfb15b';
    const card = document.getElementById('rewardCard');

    container.style.display = 'flex';

    document.getElementById('resultTitle').innerText = `RECOMPENSA ${currentReward.rarity.toUpperCase()}`;
    document.getElementById('resultTitle').style.color = color;

    card.style.border = `2px solid ${color}`;
    card.style.boxShadow = `0 0 25px ${color}60`;
    card.innerHTML = `
        <div style="font-size: 0.75em; letter-spacing: 1.5px; color: #a28f80; font-weight: bold; text-transform: uppercase;">Moedas Adquiridas</div>
        <div style="font-size: 2.2em; font-weight: 900; margin: 8px 0; color: var(--accent-gold); text-shadow: 0 0 15px rgba(223, 177, 91, 0.6);">${currentReward.coinReward} MOEDAS</div>
        <div style="font-size: 0.75em; color: #ccc;">Clique abaixo para resgatar!</div>
    `;
    document.getElementById('rewardReveal').style.display = 'block';
}

function claimRewards() {
    if (!currentReward) {
        closeRouletteModal();
        return;
    }

    vscode.postMessage({
        command: 'saveRewards',
        amount: currentReward.coinReward
    });

    localCoins += currentReward.coinReward;
    document.getElementById('coinBalance').innerText = localCoins;

    closeRouletteModal();
}

// SISTEMA DE CONFETES OFFLINE EM CANVAS
function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#dfb15b', '#00f0ff', '#ff007f', '#bc8cff', '#ffffff'];

    for (let i = 0; i < 90; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 - 50,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.7) * 12,
            size: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rSpeed: (Math.random() - 0.5) * 10,
            opacity: 1
        });
    }

    function renderConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let stillActive = false;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.25;
            p.rotation += p.rSpeed;
            p.opacity -= 0.012;

            if (p.opacity > 0) {
                stillActive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            }
        });

        if (stillActive) {
            requestAnimationFrame(renderConfetti);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    renderConfetti();
}

// --- CASSINO (SLOTS ULTRA ANIMADO) ---
let reelIntervals = [];

function spinSlots() {
    if (isSpinning) {
        return;
    }
    if (localCoins < 2000) {
        document.getElementById('slotStatus').innerHTML = '<span style="color:var(--accent-rose);">Saldo insuficiente! Custo: 2.000 moedas.</span>';
        return;
    }

    isSpinning = true;

    // Dispara animação da alavanca
    const lever = document.getElementById('slotLever');
    if (lever) {
        lever.classList.add('pulled');
        setTimeout(() => lever.classList.remove('pulled'), 400);
    }

    document.getElementById('slotStatus').innerText = "Boa sorte...";

    // Limpa intervalos antigos caso existam
    reelIntervals.forEach(clearInterval);
    reelIntervals = [];

    const reels = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    const symbolsList = ['🍒', '💰', '💎', '⭐', '🎁', '🎰', '💣'];

    // Inicia rotação contínua nos 3 rolos
    reels.forEach((r, idx) => {
        if (r) {
            r.classList.add('spinning');
            const interval = setInterval(() => {
                r.innerText = symbolsList[Math.floor(Math.random() * symbolsList.length)];
            }, 70);
            reelIntervals.push(interval);
        }
    });

    // Envia solicitação de sorteio ao servidor
    vscode.postMessage({ command: 'spinSlotMachine' });
}

// RECEBE O RESULTADO E PARA OS ROLOS UM POR UM (PARADA SEQUENCIAL DE CASSINO)
function handleSlotResult(data) {
    const reels = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];

    const finalSymbols = data.symbols;
    const stopDelays = [400, 1100, 1900]; // Parada com intervalo de suspense entre cada rolo!

    reels.forEach((reel, index) => {
        setTimeout(() => {
            // Para o rolo individual
            if (reelIntervals[index]) {
                clearInterval(reelIntervals[index]);
            }
            if (reel) {
                reel.classList.remove('spinning');
                reel.innerText = finalSymbols[index];
                
                // Animação de encaixe/trava do rolo
                reel.classList.add('win-pop');
                setTimeout(() => reel.classList.remove('win-pop'), 500);
            }

            // Quando o último rolo parar, revela a mensagem e prêmios!
            if (index === reels.length - 1) {
                isSpinning = false;
                let statusText = '';

                if (data.rewardItem) {
                    statusText += `🎉 GANHOU: <strong style="color:var(--accent-gold); text-shadow:0 0 10px #dfb15b;">${data.rewardItem.name}</strong>! `;
                    launchConfetti();
                }
                if (data.rewardTheme) {
                    statusText += `🎨 TEMA LIBERADO: <strong style="color:var(--accent-cyan); text-shadow:0 0 10px #00f0ff;">${data.rewardTheme.name}</strong>! `;
                    launchConfetti();
                } else if (!data.rewardItem) {
                    if (data.rewardCoins > 0) {
                        statusText += `Recompensa: <strong style="color:var(--accent-gold);">+${data.rewardCoins} moedas</strong>.`;
                    } else if (data.rewardCoins < 0) {
                        statusText += `Recompensa: <strong style="color:#ff4d4d;">${data.rewardCoins} moedas</strong>.`;
                    }
                }

                document.getElementById('slotStatus').innerHTML = statusText;
            }
        }, stopDelays[index]);
    });
}

// CORREÇÃO DA MENSAGEM DE RESULTADO (Resolve o bug do "+-100"):
window.addEventListener('message', (event) => {
    const data = event.data;
    switch (data.command) {
         case 'slotMachineResult':
            handleSlotResult(data);
            break;
    }
});

// --- NAVEGAÇÃO E DRAG DE CÂMERA DO AMBIENTE ---
function setupRoomDragging() {
    const viewport = document.querySelector('.isometric-viewport');
    const roomBase = document.getElementById('roomBase');
    if (!viewport || !roomBase) {
        return;
    }

    let isPanning = false;
    let startX = 0;
    let startY = 0;
    let currentPanX = 0;
    let currentPanY = 0;

    viewport.onmousedown = (e) => {
        if (e.target.closest('.room-item') || e.target.closest('.btn')) {
            return;
        }
        isPanning = true;
        startX = e.clientX - currentPanX;
        startY = e.clientY - currentPanY;
    };

    window.onmousemove = (e) => {
        if (!isPanning) {
            return;
        }
        currentPanX = e.clientX - startX;
        currentPanY = e.clientY - startY;
        roomBase.style.transform = `translate(${currentPanX}px, ${currentPanY}px) rotateX(60deg) rotateZ(-45deg)`;
    };

    window.onmouseup = () => {
        isPanning = false;
    };
}

// --- MENSAGENS RECEBIDAS DO TS ---
window.addEventListener('message', (event) => {
    const data = event.data;
    switch (data.command) {
        case 'syncState':
            localCoins = data.coins;
            localInventory = data.inventory || [];
            localPlaced = data.placed || [];
            localOffsets = data.offsets || {};
            localUnlockedThemes = data.unlockedThemes || ['yakuza'];
            localThemeDefinitions = data.themeDefinitions || {};
            localTheme = data.theme || 'yakuza';
            
            // Variáveis de Conquistas
            localAchievements = data.achievements || [];
            localUnlockedAchievements = data.unlockedAchievements || [];
            localStats = data.stats || {};

            document.getElementById('coinBalance').innerText = localCoins;
            renderInventory();
            renderThemes();
            renderAchievements();

            // Aplica as cores do tema selecionado
            const currentDef = localThemeDefinitions[localTheme] || localThemeDefinitions['yakuza'];
            if (currentDef) {
                applyWallVisual(currentDef.wallColor, currentDef.wallTexture);
                applyFloorVisual(currentDef.floorColor, currentDef.floorTexture);
            }

            // Garante que nenhuma imagem de fundo seja aplicada sobre a parede
            const wallLeft = document.getElementById('wallLeft');
            const wallRight = document.getElementById('wallRight');
            if (wallLeft && wallRight) {
                wallLeft.style.backgroundImage = 'none';
                wallRight.style.backgroundImage = 'none';
            }

            // Desenha os móveis posicionados no quarto
           const room = document.getElementById('roomBase');
            document.querySelectorAll('.room-item').forEach((el) => {
                el.remove();
            });

            localPlaced.forEach((itemId) => {
                const item = catalog[itemId];
                if (item) {
                    const itemEl = document.createElement('div');
                    itemEl.className = 'room-item placement-' + item.placement;
                    itemEl.id = 'item-' + item.id;

                    const filterStyle = item.filter ? `filter: ${item.filter};` : '';

                    itemEl.innerHTML = `
                        <div class="item-visual" title="${item.name}">
                            <img id="img-${item.id}" src="${item.icon}" style="${filterStyle}" />
                        </div>
                    `;

                    const offset = localOffsets[item.id] || { x: 0, y: 0, z: 0 };
                    applyPositionOffset(itemEl, offset);

                    itemEl.onclick = (e) => {
                        e.stopPropagation();
                        selectItem(item.id, item.name);
                    };

                    room.appendChild(itemEl);

                    if (item.animationFrames && item.animation) {
                        const imgEl = document.getElementById('img-' + item.id);
                        setupAnimation(imgEl, item.animationFrames, item.animation.speed);
                    }
                }
            });
            break;

        case 'slotMachineResult':
            isSpinning = false;
            document.getElementById('spinBtn').disabled = false;
            document.getElementById('slot1').innerText = data.symbols[0];
            document.getElementById('slot2').innerText = data.symbols[1];
            document.getElementById('slot3').innerText = data.symbols[2];

            let statusText = '';
            if (data.rewardItem) {
                statusText += `🎉 Ganhou: <strong style="color:var(--accent-gold);">${data.rewardItem.name}</strong>! `;
            }
            if (data.rewardTheme) {
                statusText += `🎨 TEMA LIBERADO: <strong style="color:var(--accent-cyan);">${data.rewardTheme.name}</strong>! `;
                launchConfetti();
            } else if (!data.rewardItem) {
                statusText += `Recompensa: <strong style="color:var(--accent-gold);">+${data.rewardCoins} moedas</strong>.`;
            }

            document.getElementById('slotStatus').innerHTML = statusText;
            break;

        case 'triggerChest':
            setupSaveGacha(data);
            break;
    }
});

document.getElementById('roomBase').onclick = deselectItem;
setupRoomDragging();
vscode.postMessage({ command: 'ready' });