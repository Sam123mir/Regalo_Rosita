/**
 * SCRIPT PRINCIPAL - JUEGO INTERACTIVO ROSITA BÁSQUETBOL
 * 
 * Este script maneja la navegación entre pantallas, el puzzle interactivo,
 * la integración con Phaser.js y el flujo general de la aplicación.
 */

// ============================================
// VARIABLES GLOBALES Y ESTADO
// ============================================

const AppState = {
    currentScreen: 0,
    puzzleCompleted: false,
    gameScore: 0,
    gameAttempts: 5,
    maxAttempts: 5
};

// Referencias a elementos del DOM
const screens = document.querySelectorAll('.screen');
const startBtn = document.getElementById('start-btn');
const puzzleNextBtn = document.getElementById('puzzle-next-btn');
const gameNextBtn = document.getElementById('game-next-btn');
const restartBtn = document.getElementById('restart-btn');
const shareBtn = document.getElementById('share-btn');

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏀 Inicializando aplicación Rosita Básquetbol');
    
    // Agregar animación shake al CSS dinámicamente
    const shakeKeyframes = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }`;
    
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = shakeKeyframes;
        document.head.appendChild(style);
    }
    
    // Configurar eventos iniciales
    setupEventListeners();
    
    // Mostrar botón de comenzar después de 3 segundos
    setTimeout(() => {
        startBtn.classList.remove('hidden');
        startBtn.style.animation = 'bounceIn 0.6s ease-out';
    }, 3000);
    
    // Prevenir comportamientos no deseados en móviles
    preventDefaultBehaviors();
    
    console.log('✅ Aplicación inicializada correctamente');
});

// ============================================
// CONFIGURACIÓN DE EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Botones de navegación
    startBtn.addEventListener('click', () => goToScreen(1));
    puzzleNextBtn.addEventListener('click', () => goToScreen(2));
    gameNextBtn.addEventListener('click', () => goToScreen(3));
    restartBtn.addEventListener('click', restartApp);
    shareBtn.addEventListener('click', shareApp);
    
    // Inicializar puzzle cuando se llega a esa pantalla
    document.addEventListener('screenChanged', (e) => {
        if (e.detail.screenIndex === 1) {
            initializePuzzle();
        } else if (e.detail.screenIndex === 2) {
            initializePhaserGame();
        }
    });
}

function preventDefaultBehaviors() {
    // Prevenir zoom con doble tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // Prevenir scroll horizontal
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Prevenir menú contextual
    document.addEventListener('contextmenu', e => e.preventDefault());
}

// ============================================
// NAVEGACIÓN ENTRE PANTALLAS
// ============================================

function goToScreen(screenIndex) {
    console.log(`🎯 Navegando a pantalla ${screenIndex}`);
    
    if (screenIndex < 0 || screenIndex >= screens.length) {
        console.error('❌ Índice de pantalla inválido:', screenIndex);
        return;
    }
    
    // Ocultar pantalla actual
    const currentScreen = screens[AppState.currentScreen];
    currentScreen.classList.remove('active');
    currentScreen.classList.add('prev');
    
    // Mostrar nueva pantalla
    setTimeout(() => {
        const newScreen = screens[screenIndex];
        newScreen.classList.remove('prev');
        newScreen.classList.add('active');
        
        // Actualizar estado
        AppState.currentScreen = screenIndex;
        
        // Emitir evento de cambio de pantalla
        document.dispatchEvent(new CustomEvent('screenChanged', {
            detail: { screenIndex: screenIndex }
        }));
        
        console.log(`✅ Pantalla ${screenIndex} activada`);
    }, 150);
}

// ============================================
// PUZZLE INTERACTIVO (PANTALLA 2)
// ============================================

let puzzleData = {
    pieces: [],
    slots: [],
    correctPlacements: 0,
    draggedPiece: null,
    touchOffset: { x: 0, y: 0 }
};

function initializePuzzle() {
    console.log('🧩 Inicializando puzzle 4x4');
    
    const puzzleGrid = document.getElementById('puzzle-grid');
    const puzzlePieces = document.getElementById('puzzle-pieces');
    
    // Limpiar contenedores
    puzzleGrid.innerHTML = '';
    puzzlePieces.innerHTML = '';
    
    // Crear slots del grid (16 espacios)
    for (let i = 0; i < 16; i++) {
        const slot = document.createElement('div');
        slot.className = 'puzzle-slot';
        slot.dataset.position = i;
        puzzleGrid.appendChild(slot);
        puzzleData.slots.push(slot);
    }
    
    // Crear piezas desordenadas
    const shuffledPositions = shuffleArray([...Array(16).keys()]);
    
    for (let i = 0; i < 16; i++) {
        const piece = document.createElement('div');
        piece.className = 'puzzle-piece';
        piece.dataset.correctPosition = i;
        piece.dataset.currentPosition = shuffledPositions[i];
        
        // Calcular posición de la imagen de fondo
        const row = Math.floor(i / 4);
        const col = i % 4;
        piece.style.backgroundPosition = `${-col * 100}% ${-row * 100}%`;
        
        // Agregar eventos táctiles
        setupPieceEvents(piece);
        
        puzzlePieces.appendChild(piece);
        puzzleData.pieces.push(piece);
    }
    
    updatePuzzleProgress();
    console.log('✅ Puzzle inicializado con 16 piezas');
}

function setupPieceEvents(piece) {
    // Eventos para dispositivos táctiles
    piece.addEventListener('touchstart', handleTouchStart, { passive: false });
    piece.addEventListener('touchmove', handleTouchMove, { passive: false });
    piece.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    // Eventos para mouse (testing en desktop)
    piece.addEventListener('mousedown', handleMouseDown);
    piece.addEventListener('mousemove', handleMouseMove);
    piece.addEventListener('mouseup', handleMouseUp);
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    startDrag(e.target, touch.clientX, touch.clientY);
}

function handleTouchMove(e) {
    e.preventDefault();
    if (puzzleData.draggedPiece) {
        const touch = e.touches[0];
        updateDragPosition(touch.clientX, touch.clientY);
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    endDrag();
}

function handleMouseDown(e) {
    startDrag(e.target, e.clientX, e.clientY);
}

function handleMouseMove(e) {
    if (puzzleData.draggedPiece) {
        updateDragPosition(e.clientX, e.clientY);
    }
}

function handleMouseUp(e) {
    endDrag();
}

function startDrag(piece, x, y) {
    puzzleData.draggedPiece = piece;
    piece.classList.add('dragging');
    
    const rect = piece.getBoundingClientRect();
    puzzleData.touchOffset = {
        x: x - rect.left,
        y: y - rect.top
    };
    
    // Cambiar a posición absoluta para el arrastre
    piece.style.position = 'absolute';
    piece.style.zIndex = '1000';
    updateDragPosition(x, y);
}

function updateDragPosition(x, y) {
    if (!puzzleData.draggedPiece) return;
    
    const piece = puzzleData.draggedPiece;
    piece.style.left = `${x - puzzleData.touchOffset.x}px`;
    piece.style.top = `${y - puzzleData.touchOffset.y}px`;
    
    // Destacar slot válido si está cerca
    highlightNearestSlot(x, y);
}

function highlightNearestSlot(x, y) {
    // Remover highlight anterior
    puzzleData.slots.forEach(slot => slot.classList.remove('highlight'));
    
    // Encontrar slot más cercano
    const nearestSlot = findNearestSlot(x, y);
    if (nearestSlot && getDistance(x, y, nearestSlot) < 50) {
        nearestSlot.classList.add('highlight');
    }
}

function findNearestSlot(x, y) {
    let nearest = null;
    let minDistance = Infinity;
    
    puzzleData.slots.forEach(slot => {
        const distance = getDistance(x, y, slot);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = slot;
        }
    });
    
    return nearest;
}

function getDistance(x, y, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    return Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
}

function endDrag() {
    if (!puzzleData.draggedPiece) return;
    
    const piece = puzzleData.draggedPiece;
    const pieceRect = piece.getBoundingClientRect();
    const pieceCenterX = pieceRect.left + pieceRect.width / 2;
    const pieceCenterY = pieceRect.top + pieceRect.height / 2;
    
    // Encontrar slot de destino
    const targetSlot = findNearestSlot(pieceCenterX, pieceCenterY);
    const distance = getDistance(pieceCenterX, pieceCenterY, targetSlot);
    
    // Si está cerca de un slot, intentar colocar
    if (distance < 80) {
        placePieceInSlot(piece, targetSlot);
    } else {
        // Volver a la posición original
        resetPiecePosition(piece);
    }
    
    // Limpiar estado de arrastre
    piece.classList.remove('dragging');
    piece.style.position = '';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.zIndex = '';
    
    puzzleData.draggedPiece = null;
    
    // Remover highlights
    puzzleData.slots.forEach(slot => slot.classList.remove('highlight'));
}

function placePieceInSlot(piece, slot) {
    const correctPosition = parseInt(piece.dataset.correctPosition);
    const slotPosition = parseInt(slot.dataset.position);
    
    // Verificar si la colocación es correcta
    if (correctPosition === slotPosition) {
        // Colocación correcta
        slot.appendChild(piece);
        piece.style.pointerEvents = 'none'; // Deshabilitar futuro movimiento
        piece.classList.add('correct');
        
        puzzleData.correctPlacements++;
        updatePuzzleProgress();
        
        // Efecto visual de éxito
        piece.style.animation = 'bounceIn 0.4s ease-out';
        
        console.log(`✅ Pieza ${correctPosition} colocada correctamente`);
        
        // Verificar si el puzzle está completo
        if (puzzleData.correctPlacements === 16) {
            completePuzzle();
        }
    } else {
        // Colocación incorrecta, volver a la posición original
        resetPiecePosition(piece);
        
        // Feedback visual de error
        piece.style.animation = 'shake 0.5s ease-out';
        setTimeout(() => piece.style.animation = '', 500);
    }
}

function resetPiecePosition(piece) {
    // La pieza vuelve a su posición en el área de piezas
    document.getElementById('puzzle-pieces').appendChild(piece);
}

function updatePuzzleProgress() {
    const progress = (puzzleData.correctPlacements / 16) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

function completePuzzle() {
    console.log('🎉 ¡Puzzle completado!');
    
    AppState.puzzleCompleted = true;
    
    // Mostrar mensaje de éxito
    const successMessage = document.getElementById('puzzle-success');
    successMessage.classList.remove('hidden');
    successMessage.classList.add('show');
    
    // Ocultar mensaje después de 3 segundos
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.classList.add('hidden'), 300);
    }, 3000);
    
    // Mostrar botón siguiente después de 2 segundos
    setTimeout(() => {
        puzzleNextBtn.classList.remove('hidden');
        puzzleNextBtn.style.animation = 'bounceIn 0.6s ease-out';
    }, 2000);
}

// ============================================
// UTILIDADES DEL PUZZLE
// ============================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ============================================
// FUNCIONES DEL JUEGO PHASER (PANTALLA 3)
// ============================================

let phaserGame = null;

function initializePhaserGame() {
    console.log('🏀 Inicializando juego Phaser');
    
    // Destruir juego anterior si existe
    if (phaserGame) {
        phaserGame.destroy(true);
        phaserGame = null;
    }
    
    // El juego se inicializa en phaser-game.js
    // Aquí solo actualizamos la UI
    updateGameStats();
}

function updateGameStats() {
    document.getElementById('score').textContent = `Puntos: ${AppState.gameScore}`;
    document.getElementById('attempts').textContent = `Intentos: ${AppState.gameAttempts}`;
}

function onScore() {
    AppState.gameScore++;
    updateGameStats();
    
    // Mostrar mensaje de punto
    const scoreMessage = document.getElementById('score-message');
    scoreMessage.classList.remove('hidden');
    scoreMessage.style.animation = 'scorePopup 2s ease-out';
    
    setTimeout(() => {
        scoreMessage.classList.add('hidden');
        scoreMessage.style.animation = '';
    }, 2000);
    
    console.log(`🎯 ¡Punto anotado! Score: ${AppState.gameScore}`);
}

function onAttempt() {
    AppState.gameAttempts--;
    updateGameStats();
    
    console.log(`🏀 Intento realizado. Restantes: ${AppState.gameAttempts}`);
    
    // Si no quedan intentos, terminar juego
    if (AppState.gameAttempts <= 0) {
        setTimeout(() => {
            gameNextBtn.classList.remove('hidden');
            gameNextBtn.style.animation = 'bounceIn 0.6s ease-out';
        }, 1000);
    }
}

// ============================================
// PANTALLA FINAL Y FUNCIONES DE CIERRE
// ============================================

function updateFinalScreen() {
    const finalScore = document.getElementById('final-score');
    finalScore.textContent = `Puntos obtenidos: ${AppState.gameScore}/${AppState.maxAttempts}`;
}

function restartApp() {
    console.log('🔄 Reiniciando aplicación');
    
    // Resetear estado
    AppState.currentScreen = 0;
    AppState.puzzleCompleted = false;
    AppState.gameScore = 0;
    AppState.gameAttempts = 5;
    
    // Resetear UI
    startBtn.classList.add('hidden');
    puzzleNextBtn.classList.add('hidden');
    gameNextBtn.classList.add('hidden');
    
    // Ocultar todas las pantallas y mostrar la primera
    screens.forEach((screen, index) => {
        screen.classList.remove('active', 'prev');
        if (index === 0) {
            screen.classList.add('active');
        }
    });
    
    // Mostrar botón comenzar después de 3 segundos
    setTimeout(() => {
        startBtn.classList.remove('hidden');
        startBtn.style.animation = 'bounceIn 0.6s ease-out';
    }, 3000);
    
    console.log('✅ Aplicación reiniciada');
}

function shareApp() {
    const shareData = {
        title: 'Rosita Básquetbol - Juego Interactivo',
        text: `¡Completé el juego de Rosita! Obtuve ${AppState.gameScore}/${AppState.maxAttempts} puntos en el básquet 🏀`,
        url: window.location.href
    };
    
    // Usar Web Share API si está disponible
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('✅ Contenido compartido exitosamente'))
            .catch((err) => console.log('❌ Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        const textToShare = `${shareData.text} - ${shareData.url}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(textToShare)
                .then(() => {
                    alert('¡Enlace copiado al portapapeles!');
                    console.log('✅ Enlace copiado al portapapeles');
                })
                .catch((err) => {
                    console.log('❌ Error al copiar:', err);
                    fallbackCopyText(textToShare);
                });
        } else {
            fallbackCopyText(textToShare);
        }
    }
}

function fallbackCopyText(text) {
    // Método alternativo para copiar texto
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('¡Enlace copiado al portapapeles!');
        console.log('✅ Enlace copiado usando fallback');
    } catch (err) {
        console.log('❌ Error en fallback de copia:', err);
        alert('No se pudo copiar automáticamente. URL: ' + window.location.href);
    }
    
    textArea.remove();
}

// ============================================
// EVENTOS GLOBALES PARA INTEGRACIÓN CON PHASER
// ============================================

// Estas funciones son llamadas desde phaser-game.js
window.onPhaserScore = onScore;
window.onPhaserAttempt = onAttempt;
window.onPhaserGameEnd = () => {
    updateFinalScreen();
    console.log('🏁 Juego Phaser terminado');
};

console.log('📱 Script principal cargado correctamente');