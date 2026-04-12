const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 5;

let player1 = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

let player2 = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    score: 0
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 5,
    dy: 5,
    speed: 5
};

// Keyboard controls
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Move paddles
function movePaddles() {
    // Player 1 (W/S keys)
    if (keys['w'] || keys['W']) {
        if (player1.y > 0) {
            player1.y -= 6;
        }
    }
    if (keys['s'] || keys['S']) {
        if (player1.y + player1.height < canvas.height) {
            player1.y += 6;
        }
    }

    // Player 2 (Arrow keys)
    if (keys['ArrowUp']) {
        if (player2.y > 0) {
            player2.y -= 6;
        }
    }
    if (keys['ArrowDown']) {
        if (player2.y + player2.height < canvas.height) {
            player2.y += 6;
        }
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Top and bottom collision
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
    }

    // Paddle collision
    if (
        ball.x - ball.size < player1.x + player1.width &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player1.x + player1.width + ball.size;
    }

    if (
        ball.x + ball.size > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player2.x - ball.size;
    }

    // Score
    if (ball.x < 0) {
        player2.score++;
        resetBall();
    }
    if (ball.x > canvas.width) {
        player1.score++;
        resetBall();
    }
}

// Reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 5;
    ball.dy = (Math.random() - 0.5) * 8;
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#ff00ff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.fillText('P1: ' + player1.score, 50, 30);
    ctx.fillText('P2: ' + player2.score, canvas.width - 150, 30);
}

function drawCenterLine() {
    ctx.strokeStyle = '#ffffff';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update
    movePaddles();
    moveBall();

    // Draw
    drawCenterLine();
    drawPaddle(player1);
    drawPaddle(player2);
    drawBall();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();
