const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.score-value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

const audio = new Audio('../assets/audio.mp3');

const size = 30;
const inicialPosition = { x: 0, y: 0};
let snake = [inicialPosition];

const incrementScore = () => {
    score.innerText = +score.innerText + 10;
}

const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number/30) * 30;
}

const apple = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"
}

let direction, loopId;

const drawFood = () => {
    const { x, y, color } = apple;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    })
}

const moveSnake = () => {
    if (!direction) return;
    
    const head = snake[snake.length - 1];

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y})
    } else if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y})
    } else if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size})
    } else if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size})
    }

    snake.shift();
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = size; i < canvas.width; i+= size) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
}

const checkEat = () => {
    const head = snake[snake.length - 1];
    
    if (head.x == apple.x && head.y == apple.y) {
        incrementScore();
        snake.push(head);
        audio.play();
        let x, y;

        do {
            x = randomPosition();
            y = randomPosition();
        } while (snake.find((position) => position.x == x && position.y == y))

        apple.x = x;
        apple.y = y;
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y 
    })
    
    if (wallCollision || selfCollision) {
        gameOver();
    }
}

const gameOver = () => {
    direction = undefined;

    menu.style.display = 'flex';
    finalScore.innerText = score.innerText;
    canvas.style.filter = 'blur(6px)'

}

const gameLoop = () => {
    clearInterval(loopId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawFood();
    moveSnake();
    drawSnake();
    checkEat();
    checkCollision();

    loopId = setTimeout(() => {
        gameLoop();
    }, 200);
}

gameLoop();

document.addEventListener('keydown', ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right";
    } else if (key == "ArrowLeft" && direction != "right") {
        direction = "left";
    } else if (key == "ArrowDown" && direction != "up") {
        direction = "down";
    } else if (key == "ArrowUp" && direction != "down") {
        direction = "up";
    }
})

buttonPlay.addEventListener('click', () => {
    score.innerText = "00";
    menu.style.display = 'none';
    canvas.style.filter = 'none';
    snake = [inicialPosition];
})