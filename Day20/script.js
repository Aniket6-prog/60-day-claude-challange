const DOM = {
    screens: {
        camera: document.getElementById('screen-camera'),
        setup: document.getElementById('screen-setup'),
        game: document.getElementById('screen-game')
    },
    camera: {
        video: document.getElementById('camera-feed'),
        error: document.getElementById('camera-error'),
        btnSnap: document.getElementById('btn-take-photo')
    },
    setup: {
        canvas: document.getElementById('photo-preview'),
        diffBtns: document.querySelectorAll('.diff-btn'),
        btnRetake: document.getElementById('btn-retake')
    },
    game: {
        time: document.getElementById('display-time'),
        moves: document.getElementById('display-moves'),
        correct: document.getElementById('display-correct'),
        container: document.getElementById('puzzle-container'),
        btnNewPhoto: document.getElementById('btn-new-photo-game'),
        btnRestart: document.getElementById('btn-restart')
    },
    results: {
        overlay: document.getElementById('results-overlay'),
        time: document.getElementById('result-time'),
        moves: document.getElementById('result-moves'),
        diff: document.getElementById('result-diff'),
        leaderboardList: document.getElementById('leaderboard-list'),
        btnPlayAgain: document.getElementById('btn-play-again')
    }
};

const GameState = {
    stream: null,
    photoDataUrl: null,
    gridSize: 3,
    pieces: [],
    moves: 0,
    startTime: 0,
    timerInterval: null,
    isWon: false,
    
    // Drag State
    draggingElement: null,
    dragStartIndex: -1,
    pointerStartX: 0,
    pointerStartY: 0,
    elemStartLeft: 0,
    elemStartTop: 0
};

/* --- Initialization --- */
function init() {
    bindEvents();
    showScreen('camera');
    startCamera();
}

function showScreen(screenName) {
    Object.values(DOM.screens).forEach(el => el.classList.remove('active'));
    DOM.screens[screenName].classList.add('active');
    DOM.results.overlay.classList.remove('active');
}

function bindEvents() {
    DOM.camera.btnSnap.addEventListener('click', takePhoto);
    DOM.setup.btnRetake.addEventListener('click', () => {
        showScreen('camera');
        startCamera();
    });
    DOM.setup.diffBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            GameState.gridSize = parseInt(e.currentTarget.dataset.size);
            startGame();
        });
    });

    DOM.game.btnRestart.addEventListener('click', startGame);
    DOM.game.btnNewPhoto.addEventListener('click', () => {
        stopTimer();
        showScreen('camera');
        startCamera();
    });
    DOM.results.btnPlayAgain.addEventListener('click', startGame);

    // Pointer events for robust drag and drop across mobile and desktop
    DOM.game.container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
}

/* --- Camera Logic --- */
async function startCamera() {
    DOM.camera.error.style.display = 'none';
    try {
        if (GameState.stream) {
            GameState.stream.getTracks().forEach(track => track.stop());
        }
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } }, 
            audio: false 
        });
        GameState.stream = stream;
        DOM.camera.video.srcObject = stream;
    } catch (err) {
        console.error("Camera access denied:", err);
        DOM.camera.error.style.display = 'block';
    }
}

function takePhoto() {
    if (!GameState.stream) return;
    
    const video = DOM.camera.video;
    const canvas = DOM.setup.canvas;
    const ctx = canvas.getContext('2d');
    
    const TARGET_SIZE = 600;
    canvas.width = TARGET_SIZE;
    canvas.height = TARGET_SIZE;

    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const minDim = Math.min(vw, vh);
    const startX = (vw - minDim) / 2;
    const startY = (vh - minDim) / 2;

    // FIX: Use save() and restore() to prevent transforms from stacking on "Retake Photo"
    ctx.save();
    ctx.translate(TARGET_SIZE, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, startX, startY, minDim, minDim, 0, 0, TARGET_SIZE, TARGET_SIZE);
    ctx.restore();
    
    // FIX: Using jpeg instead of webp for maximum cross-browser/iOS compatibility
    GameState.photoDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    GameState.stream.getTracks().forEach(track => track.stop());
    GameState.stream = null;
    
    showScreen('setup');
}

/* --- Game Logic --- */
function startGame() {
    showScreen('game');
    DOM.results.overlay.classList.remove('active');
    GameState.isWon = false;
    GameState.moves = 0;
    updateStatsBar();
    
    generatePuzzle();
    
    stopTimer();
    GameState.startTime = Date.now();
    GameState.timerInterval = setInterval(updateTimer, 100);
}

function generatePuzzle() {
    const container = DOM.game.container;
    container.innerHTML = '';
    
    const size = GameState.gridSize;
    const totalPieces = size * size;
    GameState.pieces = [];

    // Initialize logical pieces
    for (let i = 0; i < totalPieces; i++) {
        GameState.pieces.push({
            id: i,
            correctPos: i,
            currentPos: i 
        });
    }

    // FIX: Update currentPos INSIDE the loop so the win condition checks the new shuffle
    do {
        shuffleArray(GameState.pieces);
        GameState.pieces.forEach((piece, index) => {
            piece.currentPos = index;
        });
    } while (checkWinConditionSilently());

    // Create DOM elements
    GameState.pieces.forEach(piece => {
        const el = document.createElement('div');
        el.classList.add('puzzle-piece');
        el.dataset.id = piece.id;
        
        el.style.width = `${100 / size}%`;
        el.style.height = `${100 / size}%`;
        el.style.backgroundImage = `url(${GameState.photoDataUrl})`;
        el.style.backgroundSize = `${size * 100}% ${size * 100}%`;
        
        const correctCol = piece.correctPos % size;
        const correctRow = Math.floor(piece.correctPos / size);
        
        const bgX = size > 1 ? (correctCol * (100 / (size - 1))) : 0;
        const bgY = size > 1 ? (correctRow * (100 / (size - 1))) : 0;
        el.style.backgroundPosition = `${bgX}% ${bgY}%`;
        
        container.appendChild(el);
        piece.element = el;
    });

    updateAllPiecePositions();
}

function updateAllPiecePositions() {
    const size = GameState.gridSize;
    let correctCount = 0;

    GameState.pieces.forEach(piece => {
        const col = piece.currentPos % size;
        const row = Math.floor(piece.currentPos / size);
        
        piece.element.style.left = `${col * (100 / size)}%`;
        piece.element.style.top = `${row * (100 / size)}%`;
        
        if (piece.currentPos === piece.correctPos) {
            piece.element.classList.add('correct');
            correctCount++;
        } else {
            piece.element.classList.remove('correct');
        }
    });

    DOM.game.correct.innerText = `${correctCount}/${size * size}`;
    return correctCount === (size * size);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/* --- Drag & Drop Gestures --- */
function handlePointerDown(e) {
    if (GameState.isWon) return;
    
    const target = e.target.closest('.puzzle-piece');
    if (!target) return;

    // Capture the pointer directly to the element so drag works smoothly everywhere
    target.setPointerCapture(e.pointerId);

    GameState.draggingElement = target;
    target.classList.add('dragging');

    const rect = target.getBoundingClientRect();
    const containerRect = DOM.game.container.getBoundingClientRect();

    GameState.pointerStartX = e.clientX;
    GameState.pointerStartY = e.clientY;
    
    GameState.elemStartLeft = rect.left - containerRect.left;
    GameState.elemStartTop = rect.top - containerRect.top;

    const pieceId = parseInt(target.dataset.id);
    const piece = GameState.pieces.find(p => p.id === pieceId);
    GameState.dragStartIndex = piece.currentPos;
}

function handlePointerMove(e) {
    if (!GameState.draggingElement) return;

    const dx = e.clientX - GameState.pointerStartX;
    const dy = e.clientY - GameState.pointerStartY;

    const el = GameState.draggingElement;
    el.style.left = `calc(${GameState.elemStartLeft + dx}px)`;
    el.style.top = `calc(${GameState.elemStartTop + dy}px)`;
}

function handlePointerUp(e) {
    if (!GameState.draggingElement) return;
    
    const el = GameState.draggingElement;
    el.classList.remove('dragging');
    
    try { el.releasePointerCapture(e.pointerId); } catch(err){}
    GameState.draggingElement = null;

    const rect = el.getBoundingClientRect();
    const containerRect = DOM.game.container.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2 - containerRect.left;
    const centerY = rect.top + rect.height / 2 - containerRect.top;

    const size = GameState.gridSize;
    const pieceWidth = containerRect.width / size;
    const pieceHeight = containerRect.height / size;

    let dropCol = Math.floor(centerX / pieceWidth);
    let dropRow = Math.floor(centerY / pieceHeight);
    
    dropCol = Math.max(0, Math.min(size - 1, dropCol));
    dropRow = Math.max(0, Math.min(size - 1, dropRow));

    const targetPos = dropRow * size + dropCol;

    if (targetPos !== GameState.dragStartIndex) {
        const draggedPiece = GameState.pieces.find(p => p.currentPos === GameState.dragStartIndex);
        const targetPiece = GameState.pieces.find(p => p.currentPos === targetPos);

        if (draggedPiece && targetPiece) {
            draggedPiece.currentPos = targetPos;
            targetPiece.currentPos = GameState.dragStartIndex;
            
            GameState.moves++;
            DOM.game.moves.innerText = GameState.moves;
        }
    }

    el.style.left = '';
    el.style.top = '';
    
    const isWin = updateAllPiecePositions();

    if (isWin && !GameState.isWon) {
        handleWin();
    }
}

/* --- Timer & Stats --- */
function updateTimer() {
    const elapsed = Date.now() - GameState.startTime;
    DOM.game.time.innerText = formatTime(elapsed);
}

function stopTimer() {
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    const tenths = Math.floor((ms % 1000) / 100);
    return `${minutes}:${seconds}.${tenths}`;
}

function updateStatsBar() {
    DOM.game.time.innerText = "00:00.0";
    DOM.game.moves.innerText = GameState.moves;
    DOM.game.correct.innerText = `0/${GameState.gridSize * GameState.gridSize}`;
}

/* --- Win Logic & Leaderboard --- */
function checkWinConditionSilently() {
    return GameState.pieces.every(p => p.currentPos === p.correctPos);
}

function handleWin() {
    GameState.isWon = true;
    stopTimer();
    
    const elapsedMs = Date.now() - GameState.startTime;
    const timeStr = formatTime(elapsedMs);
    const diffStr = `${GameState.gridSize}x${GameState.gridSize}`;
    
    DOM.results.time.innerText = timeStr;
    DOM.results.moves.innerText = GameState.moves;
    DOM.results.diff.innerText = diffStr;
    
    saveToLeaderboard(elapsedMs, timeStr, GameState.moves, diffStr);
    renderLeaderboard();

    setTimeout(() => {
        DOM.results.overlay.classList.add('active');
    }, 300);
}

function saveToLeaderboard(timeMs, timeStr, moves, difficulty) {
    let board = JSON.parse(localStorage.getItem('facePuzzleLeaderboard') || '[]');
    
    const entry = {
        date: new Date().toLocaleDateString(),
        timeMs,
        timeStr,
        moves,
        difficulty
    };

    board.push(entry);
    board.sort((a, b) => a.timeMs - b.timeMs);
    board = board.slice(0, 5);
    
    localStorage.setItem('facePuzzleLeaderboard', JSON.stringify(board));
}

function renderLeaderboard() {
    const board = JSON.parse(localStorage.getItem('facePuzzleLeaderboard') || '[]');
    DOM.results.leaderboardList.innerHTML = '';
    
    if (board.length === 0) {
        DOM.results.leaderboardList.innerHTML = '<li>No times recorded yet.</li>';
        return;
    }

    board.forEach((entry, idx) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        li.innerHTML = `
            <span class="leaderboard-rank">#${idx + 1}</span>
            <div class="leaderboard-details">
                ${entry.difficulty} - ${entry.moves} moves<br>
                <small>${entry.date}</small>
            </div>
            <span class="leaderboard-time">${entry.timeStr}</span>
        `;
        DOM.results.leaderboardList.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', init);