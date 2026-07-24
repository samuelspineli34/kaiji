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
function applyWallVisual(color) {
    const wallLeft = document.getElementById('wallLeft');
    const wallRight = document.getElementById('wallRight');
    if (wallLeft && wallRight) {
        wallLeft.style.backgroundImage = 'none';
        wallRight.style.backgroundImage = 'none';
        wallLeft.style.backgroundColor = color;
        wallRight.style.backgroundColor = color;
    }
}

function applyFloorVisual(color) {
    const roomBase = document.getElementById('roomBase');
    if (roomBase) {
        roomBase.style.backgroundImage = 'none';
        roomBase.style.backgroundColor = color;
    }
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
            list.innerHTML += `
                <div class="shop-item">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <img src="${item.icon}" style="max-width:28px; max-height:28px;" />
                        <div>
                            <div style="font-weight:bold; font-size:0.85em;">${item.name}</div>
                            <span class="badge" style="color:${rarityColors[item.rarity]}">${item.rarity.toUpperCase()}</span>
                        </div>
                    </div>
                    <button class="btn btn-sm" style="background:${isPlaced ? 'var(--accent-rose)' : '#4a8258'}" onclick="togglePlacement('${item.id}')">
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
        visual.style.transform = `translateY(${offset.z || 0}px)`;
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
function spinSlots() {
    if (isSpinning) {
        return;
    }
    if (localCoins < 2000) {
        document.getElementById('slotStatus').innerHTML = '<span style="color:var(--accent-rose);">Saldo insuficiente! Custo: 2.000 moedas.</span>';
        return;
    }

    isSpinning = true;
    document.getElementById('spinBtn').disabled = true;
    document.getElementById('slotStatus').innerText = "Girando rolos...";

    const reels = [document.getElementById('slot1'), document.getElementById('slot2'), document.getElementById('slot3')];
    reels.forEach((r) => {
        if (r) {
            r.classList.add('spinning');
        }
    });

    let count = 0;
    const symbolsList = ['🍒', '💰', '💎', '⭐', '🎁', '🎰', '💣'];
    const interval = setInterval(() => {
        reels.forEach((r) => {
            if (r) {
                r.innerText = symbolsList[Math.floor(Math.random() * symbolsList.length)];
            }
        });
        count++;
        if (count > 15) {
            clearInterval(interval);
            reels.forEach((r) => {
                if (r) {
                    r.classList.remove('spinning');
                }
            });
            vscode.postMessage({ command: 'spinSlotMachine' });
        }
    }, 100);
}

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

            document.getElementById('coinBalance').innerText = localCoins;
            renderInventory();
            clearAllIntervals();

            if (data.theme && data.theme.startsWith('custom|')) {
                const parts = data.theme.split('|');
                const savedWall = parts[1] || '#8f745f';
                const savedFloor = parts[2] || '#342764';
                document.getElementById('wallColorPicker').value = savedWall;
                document.getElementById('floorColorPicker').value = savedFloor;
                applyWallVisual(savedWall);
                applyFloorVisual(savedFloor);
            } else {
                document.getElementById('wallColorPicker').value = '#8f745f';
                document.getElementById('floorColorPicker').value = '#342764';
                applyWallVisual('#8f745f');
                applyFloorVisual('#342764');
            }

            if (data.wallUri) {
                const wallLeft = document.getElementById('wallLeft');
                const wallRight = document.getElementById('wallRight');
                if (wallLeft && wallRight && (!data.theme || !data.theme.startsWith('custom|'))) {
                    wallLeft.style.backgroundImage = `url("${data.wallUri}")`;
                    wallRight.style.backgroundImage = `url("${data.wallUri}")`;
                }
            }

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

                    const offset = localOffsets[item.id] || { x: 0, y: 0, z: 0 };
                    applyPositionOffset(itemEl, offset);

                    itemEl.innerHTML = `
                        <div class="item-visual" title="${item.name}">
                            <img id="img-${item.id}" src="${item.icon}" />
                        </div>
                        <div class="item-glow"></div>
                    `;

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

            if (data.rewardItem) {
                document.getElementById('slotStatus').innerHTML = `🎉 JACKPOT! Ganhou: <strong style="color:var(--accent-gold);">${data.rewardItem.name}</strong>!`;
                launchConfetti();
            } else {
                document.getElementById('slotStatus').innerHTML = `Recompensa: <strong style="color:var(--accent-gold);">+${data.rewardCoins} moedas</strong>.`;
            }
            break;

        case 'triggerChest':
            setupSaveGacha(data);
            break;
    }
});

document.getElementById('roomBase').onclick = deselectItem;
setupRoomDragging();
vscode.postMessage({ command: 'ready' });