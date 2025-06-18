// Game variables
const player = document.getElementById('player');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

let isJumping = false;
let isGameOver = false;
let score = 0;
let gravity = 0.9;
let playerBottom = 0;
let playerLeft = 50;
let upTimerId;
let downTimerId;
let isGoingLeft = false;
let isGoingRight = false;
let leftTimerId;
let rightTimerId;
let platformCount = 5;
let platforms = [];
let coins = [];
let enemies = [];
let gameSpeed = 2;

// Player properties
const playerWidth = 40;
const playerHeight = 40;

// Game container dimensions
const gameWidth = 800;
const gameHeight = 400;

// Function to create player character as a simple yellow square
function createPlayerCharacter() {
    player.style.backgroundColor = 'yellow';
}

// Function to create a platform
function createPlatform(left, bottom, width) {
    const platform = document.createElement('div');
    platform.classList.add('platform');
    platform.style.left = left + 'px';
    platform.style.bottom = bottom + 'px';
    platform.style.width = width + 'px';
    
    // Add grass-like top to platform
    platform.style.borderTop = '5px solid #3CB371';
    
    gameContainer.appendChild(platform);
    platforms.push({
        left: left,
        bottom: bottom,
        width: width,
        element: platform
    });
}

// Function to create a coin
function createCoin(left, bottom) {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = left + 'px';
    coin.style.bottom = bottom + 'px';
    gameContainer.appendChild(coin);
    coins.push({
        left: left,
        bottom: bottom,
        element: coin,
        collected: false
    });
}

// Function to create an enemy
function createEnemy(left) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = left + 'px';
    enemy.style.bottom = '0px';
    
    // Make enemy look more like a goomba
    enemy.style.borderRadius = '10px 10px 0 0';
    enemy.style.backgroundColor = '#8B4513';
    enemy.style.borderBottom = '5px solid #654321';
    
    gameContainer.appendChild(enemy);
    enemies.push({
        left: left,
        element: enemy,
        direction: -1 // -1 for left, 1 for right
    });
}

// Function to initialize platforms
function createPlatforms() {
    // Create ground
    createPlatform(0, 0, gameWidth);
    
    // Create random platforms
    createPlatform(100, 100, 200);
    createPlatform(400, 150, 150);
    createPlatform(600, 80, 150);
    createPlatform(300, 200, 100);
}

// Function to initialize coins
function createCoins() {
    createCoin(150, 130);
    createCoin(450, 180);
    createCoin(650, 110);
    createCoin(350, 230);
    createCoin(700, 30);
}

// Function to initialize enemies
function createEnemies() {
    createEnemy(300);
    createEnemy(600);
}

// Function to handle jumping
function jump() {
    if (isJumping) return;
    isJumping = true;
    
    let jumpCount = 0;
    const jumpHeight = 15;
    
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    
    upTimerId = setInterval(() => {
        playerBottom += jumpHeight;
        player.style.bottom = playerBottom + 'px';
        jumpCount++;
        
        if (jumpCount > 10) {
            clearInterval(upTimerId);
            fall();
        }
    }, 30);
}

// Function to handle falling
function fall() {
    clearInterval(upTimerId);
    
    downTimerId = setInterval(() => {
        playerBottom -= 5;
        player.style.bottom = playerBottom + 'px';
        
        if (playerBottom <= 0) {
            playerBottom = 0;
            player.style.bottom = '0px';
            isJumping = false;
            clearInterval(downTimerId);
        }
        
        // Check for platform collisions
        platforms.forEach(platform => {
            if (
                (playerBottom >= platform.bottom) &&
                (playerBottom <= platform.bottom + 20) &&
                (playerLeft + playerWidth >= platform.left) &&
                (playerLeft <= platform.left + platform.width) &&
                (playerBottom - 5 <= platform.bottom)
            ) {
                playerBottom = platform.bottom;
                player.style.bottom = playerBottom + 'px';
                isJumping = false;
                clearInterval(downTimerId);
            }
        });
    }, 30);
}

// Function to move left
function moveLeft() {
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    }
    
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
        if (playerLeft > 0) {
            playerLeft -= 5;
            player.style.left = playerLeft + 'px';
        } else {
            playerLeft = 0;
        }
    }, 30);
}

// Function to move right
function moveRight() {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    }
    
    isGoingRight = true;
    rightTimerId = setInterval(() => {
        if (playerLeft < gameWidth - playerWidth) {
            playerLeft += 5;
            player.style.left = playerLeft + 'px';
        } else {
            playerLeft = gameWidth - playerWidth;
        }
    }, 30);
}

// Function to stop moving
function stopMoving() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
}

// Function to check for coin collection
function checkCoinCollision() {
    coins.forEach(coin => {
        if (!coin.collected &&
            playerLeft + playerWidth >= coin.left &&
            playerLeft <= coin.left + 20 &&
            playerBottom + playerHeight >= coin.bottom &&
            playerBottom <= coin.bottom + 20) {
            
            coin.collected = true;
            coin.element.style.display = 'none';
            score += 10;
            scoreElement.textContent = 'Score: ' + score;
        }
    });
}

// Function to check for enemy collision
function checkEnemyCollision() {
    enemies.forEach(enemy => {
        const enemyLeft = parseInt(enemy.element.style.left);
        const enemyBottom = parseInt(enemy.element.style.bottom);
        
        // Check if player jumps on enemy
        if (playerLeft + playerWidth >= enemyLeft &&
            playerLeft <= enemyLeft + 30 &&
            playerBottom <= 30 &&
            playerBottom >= 20) {
            
            // Remove enemy
            enemy.element.style.display = 'none';
            score += 20;
            scoreElement.textContent = 'Score: ' + score;
            
            // Small jump after defeating enemy
            jump();
        }
        // Check if enemy hits player from the side
        else if (playerLeft + playerWidth >= enemyLeft &&
                playerLeft <= enemyLeft + 30 &&
                playerBottom < 30) {
            
            gameOver();
        }
    });
}

// Function to move enemies
function moveEnemies() {
    enemies.forEach(enemy => {
        const enemyLeft = parseInt(enemy.element.style.left);
        
        // Move enemy
        enemy.element.style.left = (enemyLeft + (enemy.direction * gameSpeed)) + 'px';
        
        // Change direction if enemy hits edge
        if (enemyLeft <= 0) {
            enemy.direction = 1;
        } else if (enemyLeft >= gameWidth - 30) {
            enemy.direction = -1;
        }
    });
}

// Function to handle game over
function gameOver() {
    isGameOver = true;
    
    // Stop all intervals
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(gameLoopId);
    
    // Show game over message
    gameOverElement.style.display = 'block';
    restartBtn.style.display = 'block';
}

// Function to restart the game
function restartGame() {
    // Reset game state
    isGameOver = false;
    score = 0;
    playerBottom = 0;
    playerLeft = 50;
    
    // Reset player position
    player.style.bottom = playerBottom + 'px';
    player.style.left = playerLeft + 'px';
    
    // Reset score display
    scoreElement.textContent = 'Score: 0';
    
    // Hide game over elements
    gameOverElement.style.display = 'none';
    restartBtn.style.display = 'none';
    
    // Remove all platforms, coins, and enemies
    platforms.forEach(platform => {
        gameContainer.removeChild(platform.element);
    });
    
    coins.forEach(coin => {
        gameContainer.removeChild(coin.element);
    });
    
    enemies.forEach(enemy => {
        gameContainer.removeChild(enemy.element);
    });
    
    platforms = [];
    coins = [];
    enemies = [];
    
    // Create new game elements
    createPlatforms();
    createCoins();
    createEnemies();
    
    // Start game loop
    startGameLoop();
}

// Game loop
let gameLoopId;
function startGameLoop() {
    gameLoopId = setInterval(() => {
        checkCoinCollision();
        checkEnemyCollision();
        moveEnemies();
    }, 50);
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    
    switch(e.key) {
        case 'ArrowUp':
            jump();
            break;
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
    }
});

document.addEventListener('keyup', (e) => {
    if (isGameOver) return;
    
    switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            stopMoving();
            break;
    }
});

// Event listener for restart button
restartBtn.addEventListener('click', restartGame);

// Initialize game
createPlayerCharacter();
createPlatforms();
createCoins();
createEnemies();
startGameLoop();
