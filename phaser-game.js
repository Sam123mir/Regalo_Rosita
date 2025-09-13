/**
 * PHASER GAME - MINI-JUEGO DE BÁSQUETBOL
 * 
 * Este archivo contiene la configuración y lógica del mini-juego de básquetbol
 * desarrollado con Phaser.js 3.x, optimizado para dispositivos móviles.
 */

// ============================================
// CONFIGURACIÓN GLOBAL DEL JUEGO
// ============================================

let game = null;
let gameScene = null;

const GameConfig = {
    width: 400,
    height: 600,
    gravity: 800,
    ballSize: 40,
    hoopWidth: 120,
    hoopHeight: 20,
    bounceThreshold: 0.3,
    maxAttempts: 5
};

// Variables de estado del juego
const GameState = {
    ball: null,
    hoop: null,
    background: null,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    attempts: 0,
    score: 0,
    gameEnded: false
};

// ============================================
// INICIALIZACIÓN DE PHASER
// ============================================

function initializePhaserGame() {
    console.log('🎮 Configurando juego Phaser');
    
    // Destruir juego anterior si existe
    if (game) {
        game.destroy(true);
        game = null;
    }
    
    // Configuración del juego
    const config = {
        type: Phaser.AUTO,
        width: GameConfig.width,
        height: GameConfig.height,
        parent: 'phaser-game',
        backgroundColor: '#87CEEB', // Color cielo
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: GameConfig.gravity },
                debug: false
            }
        },
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: 'phaser-game',
            width: GameConfig.width,
            height: GameConfig.height
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    
    // Crear juego
    game = new Phaser.Game(config);
    gameScene = game.scene.scenes[0];
    
    console.log('✅ Juego Phaser inicializado');
}

// ============================================
// CARGA DE RECURSOS (PRELOAD)
// ============================================

function preload() {
    console.log('📦 Cargando recursos del juego');
    
    // Crear gráficos simples con código (sin necesidad de archivos externos)
    
    // Crear pelota de básquet
    this.add.graphics()
        .fillStyle(0xD2691E) // Marrón naranja
        .fillCircle(GameConfig.ballSize/2, GameConfig.ballSize/2, GameConfig.ballSize/2)
        .lineStyle(2, 0x000000)
        .strokeCircle(GameConfig.ballSize/2, GameConfig.ballSize/2, GameConfig.ballSize/2)
        .generateTexture('basketball', GameConfig.ballSize, GameConfig.ballSize);
    
    // Crear aro de básquet
    this.add.graphics()
        .fillStyle(0xFF4500) // Naranja
        .fillRect(0, 0, GameConfig.hoopWidth, GameConfig.hoopHeight)
        .lineStyle(3, 0x000000)
        .strokeRect(0, 0, GameConfig.hoopWidth, GameConfig.hoopHeight)
        .generateTexture('hoop', GameConfig.hoopWidth, GameConfig.hoopHeight);
    
    // Crear poste del aro
    this.add.graphics()
        .fillStyle(0x666666) // Gris
        .fillRect(0, 0, 8, 100)
        .generateTexture('pole', 8, 100);
    
    console.log('✅ Recursos cargados');
}

// ============================================
// CREACIÓN DEL JUEGO (CREATE)
// ============================================

function create() {
    console.log('🏗️ Creando elementos del juego');
    
    gameScene = this;
    
    // Reset del estado
    GameState.attempts = 0;
    GameState.score = 0;
    GameState.gameEnded = false;
    GameState.isDragging = false;
    
    // Crear fondo con nubes
    createBackground(this);
    
    // Crear aro y poste
    createHoop(this);
    
    // Crear pelota
    createBall(this);
    
    // Configurar controles táctiles
    setupTouchControls(this);
    
    console.log('✅ Juego creado y listo para jugar');
}

function createBackground(scene) {
    // Crear algunas nubes decorativas
    const cloudPositions = [
        { x: 80, y: 100 },
        { x: 300, y: 150 },
        { x: 200, y: 80 },
        { x: 50, y: 200 }
    ];
    
    cloudPositions.forEach(pos => {
        const cloud = scene.add.graphics()
            .fillStyle(0xFFFFFF, 0.8)
            .fillCircle(0, 0, 25)
            .fillCircle(20, 0, 20)
            .fillCircle(-15, 0, 18)
            .fillCircle(10, -10, 15);
        
        cloud.x = pos.x;
        cloud.y = pos.y;
        
        // Animación sutil de las nubes
        scene.tweens.add({
            targets: cloud,
            x: pos.x + 20,
            duration: 8000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    });
}

function createHoop(scene) {
    // Crear poste
    const pole = scene.add.image(GameConfig.width - 50, 200, 'pole');
    pole.setOrigin(0.5, 0);
    
    // Crear aro
    GameState.hoop = scene.physics.add.staticGroup();
    const hoop = scene.add.image(GameConfig.width - 100, 200, 'hoop');
    hoop.setOrigin(0, 0.5);
    
    // Agregar física al aro
    GameState.hoop.add(hoop);
    
    // Crear red del aro (líneas decorativas)
    const netGraphics = scene.add.graphics();
    netGraphics.lineStyle(2, 0x228B22); // Verde
    
    // Dibujar red
    for (let i = 0; i < 8; i++) {
        const x = hoop.x + (i * 15) + 10;
        netGraphics.moveTo(x, hoop.y + 10);
        netGraphics.lineTo(x + (Math.random() * 10 - 5), hoop.y + 40);
    }
    netGraphics.strokePath();
    
    console.log('🏀 Aro creado en posición:', hoop.x, hoop.y);
}

function createBall(scene) {
    // Crear pelota en la parte inferior
    GameState.ball = scene.physics.add.sprite(200, GameConfig.height - 100, 'basketball');
    
    // Configurar física de la pelota
    GameState.ball.setBounce(0.6);
    GameState.ball.setCollideWorldBounds(true);
    GameState.ball.setInteractive();
    
    // Hacer la pelota arrastrable
    scene.input.setDraggable(GameState.ball);
    
    console.log('🏀 Pelota creada');
}

function setupTouchControls(scene) {
    // Eventos de arrastre de la pelota
    GameState.ball.on('dragstart', function (pointer, dragX, dragY) {
        if (GameState.gameEnded) return;
        
        GameState.isDragging = true;
        GameState.dragStartX = pointer.x;
        GameState.dragStartY = pointer.y;
        
        // Efecto visual de selección
        GameState.ball.setTint(0xffff00); // Amarillo
        
        console.log('🎯 Iniciando arrastre de pelota');
    });
    
    GameState.ball.on('drag', function (pointer, dragX, dragY) {
        if (GameState.gameEnded) return;
        
        // Mostrar trayectoria visual (opcional)
        // Se podría agregar una línea punteada para mostrar la trayectoria
    });
    
    GameState.ball.on('dragend', function (pointer) {
        if (GameState.gameEnded) return;
        
        GameState.isDragging = false;
        
        // Remover tinte
        GameState.ball.clearTint();
        
        // Calcular velocidad basada en el arrastre
        const dragDistance = Phaser.Math.Distance.Between(
            GameState.dragStartX, 
            GameState.dragStartY, 
            pointer.x, 
            pointer.y
        );
        
        const dragAngle = Phaser.Math.Angle.Between(
            GameState.dragStartX, 
            GameState.dragStartY, 
            pointer.x, 
            pointer.y
        );
        
        // Aplicar velocidad a la pelota
        const force = Math.min(dragDistance * 3, 800); // Limitar fuerza máxima
        const velocityX = Math.cos(dragAngle) * force;
        const velocityY = Math.sin(dragAngle) * force;
        
        GameState.ball.setVelocity(velocityX, velocityY);
        
        // Registrar intento
        registerAttempt();
        
        console.log('🚀 Pelota lanzada:', { force, angle: dragAngle, vx: velocityX, vy: velocityY });
    });
    
    // Detectar colisión con el aro
    scene.physics.add.overlap(GameState.ball, GameState.hoop, onBallHoopCollision, null, scene);
}

// ============================================
// LÓGICA DEL JUEGO (UPDATE)
// ============================================

function update() {
    if (GameState.gameEnded) return;
    
    // Resetear pelota si sale de la pantalla por abajo
    if (GameState.ball && GameState.ball.y > GameConfig.height + 50) {
        resetBallPosition();
    }
    
    // Verificar si la pelota está quieta para resetear
    if (GameState.ball && !GameState.isDragging) {
        const velocity = GameState.ball.body.velocity;
        if (Math.abs(velocity.x) < 10 && Math.abs(velocity.y) < 10 && 
            GameState.ball.y > GameConfig.height - 200) {
            // La pelota está prácticamente quieta en la parte inferior
            setTimeout(() => {
                if (GameState.ball.y > GameConfig.height - 200) {
                    resetBallPosition();
                }
            }, 2000); // Esperar 2 segundos antes de resetear
        }
    }
}

// ============================================
// FUNCIONES DEL JUEGO
// ============================================

function onBallHoopCollision(ball, hoop) {
    // Verificar si la pelota pasa por el aro desde arriba
    const ballBottom = ball.y + ball.height/2;
    const hoopTop = hoop.y - hoop.height/2;
    const ballCenterX = ball.x;
    const hoopCenterX = hoop.x + hoop.width/2;
    
    // La pelota debe estar cayendo y pasar por el centro del aro
    if (ball.body.velocity.y > 100 && 
        ballBottom > hoopTop && 
        Math.abs(ballCenterX - hoopCenterX) < GameConfig.hoopWidth/3) {
        
        registerScore();
        
        // Efecto visual de anotación
        createScoreEffect(hoop.x + hoop.width/2, hoop.y);
        
        console.log('🎯 ¡ANOTACIÓN!');
    }
}

function registerScore() {
    GameState.score++;
    
    // Llamar función global para actualizar UI
    if (window.onPhaserScore) {
        window.onPhaserScore();
    }
    
    // Efecto de celebración en la pelota
    GameState.ball.setTint(0x00ff00); // Verde
    setTimeout(() => {
        if (GameState.ball) {
            GameState.ball.clearTint();
        }
    }, 1000);
}

function registerAttempt() {
    GameState.attempts++;
    
    // Llamar función global para actualizar UI
    if (window.onPhaserAttempt) {
        window.onPhaserAttempt();
    }
    
    // Verificar si se acabaron los intentos
    if (GameState.attempts >= GameConfig.maxAttempts) {
        setTimeout(() => {
            endGame();
        }, 3000); // Esperar 3 segundos para que termine la jugada
    }
}

function resetBallPosition() {
    if (!GameState.ball || GameState.gameEnded) return;
    
    // Resetear posición y velocidad de la pelota
    GameState.ball.setPosition(200, GameConfig.height - 100);
    GameState.ball.setVelocity(0, 0);
    GameState.ball.clearTint();
    
    console.log('🔄 Pelota reseteada a posición inicial');
}

function createScoreEffect(x, y) {
    if (!gameScene) return;
    
    // Crear efecto de partículas de puntuación
    const particles = gameScene.add.particles(x, y, 'basketball', {
        scale: { start: 0.3, end: 0 },
        speed: { min: 50, max: 150 },
        lifespan: 800,
        quantity: 10
    });
    
    // Remover partículas después de la animación
    setTimeout(() => {
        if (particles) {
            particles.destroy();
        }
    }, 1000);
    
    // Texto de puntuación
    const scoreText = gameScene.add.text(x, y - 50, '¡PUNTO!', {
        fontSize: '24px',
        fill: '#FFD700',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 2
    });
    
    scoreText.setOrigin(0.5);
    
    // Animar texto
    gameScene.tweens.add({
        targets: scoreText,
        y: y - 100,
        alpha: 0,
        duration: 1500,
        ease: 'Power2',
        onComplete: () => {
            scoreText.destroy();
        }
    });
}

function endGame() {
    GameState.gameEnded = true;
    
    // Llamar función global de fin de juego
    if (window.onPhaserGameEnd) {
        window.onPhaserGameEnd();
    }
    
    // Mostrar mensaje de fin de juego
    const finalText = gameScene.add.text(GameConfig.width/2, GameConfig.height/2, 
        `¡Juego Terminado!\nPuntuación: ${GameState.score}/${GameConfig.maxAttempts}`, {
        fontSize: '20px',
        fill: '#FFFFFF',
        fontWeight: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center'
    });
    
    finalText.setOrigin(0.5);
    
    // Efecto de aparición del texto
    finalText.setAlpha(0);
    gameScene.tweens.add({
        targets: finalText,
        alpha: 1,
        duration: 1000,
        ease: 'Power2'
    });
    
    console.log(`🏁 Juego terminado. Puntuación final: ${GameState.score}/${GameConfig.maxAttempts}`);
}

// ============================================
// INICIALIZACIÓN AUTOMÁTICA
// ============================================

// Esperar a que la pantalla del juego esté activa
document.addEventListener('screenChanged', (e) => {
    if (e.detail.screenIndex === 2) { // Pantalla del juego (índice 2)
        setTimeout(() => {
            initializePhaserGame();
        }, 500); // Pequeño delay para asegurar que el DOM esté listo
    }
});

console.log('🎮 Phaser game script cargado correctamente');