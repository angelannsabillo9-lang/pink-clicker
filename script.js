let score = 0;
let highScore = localStorage.getItem("pinkClickerHighScore") || 0;
let time = 30;

let gameStarted = false;
let timer;
let countdownTimer;

let targetSize = 80;

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const timeText = document.getElementById("time");
const difficultyText = document.getElementById("difficulty");
const difficultyHint = document.getElementById("difficultyHint");
const gameStatus = document.getElementById("gameStatus");

const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const clearButton = document.getElementById("clearButton");
const target = document.getElementById("target");

const easyButton = document.getElementById("easyButton");
const mediumButton = document.getElementById("mediumButton");
const hardButton = document.getElementById("hardButton");

const gameOver = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const bestMessage = document.getElementById("bestMessage");
const playAgain = document.getElementById("playAgain");

const countdown = document.getElementById("countdown");
const readyText = document.getElementById("readyText");

highScoreText.textContent = highScore;


// Sound

function playSound(frequency, duration) {

    const audioContext = new (
        window.AudioContext || window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gain.gain.setValueAtTime(0.15, audioContext.currentTime);

    gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration
    );
}


// Countdown animation

function animateCountdown() {

    countdown.style.animation = "none";

    void countdown.offsetWidth;

    countdown.style.animation = "countdownPop 0.4s ease";
}


// Score animation

function animateScore() {

    scoreText.classList.remove("scorePop");

    void scoreText.offsetWidth;

    scoreText.classList.add("scorePop");
}


// Difficulty

easyButton.addEventListener("click", function () {
    targetSize = 100;
    difficultyText.textContent = "Easy";
    difficultyHint.textContent = "🎀 Easy mode selected!";

    easyButton.classList.add("selected");
    mediumButton.classList.remove("selected");
    hardButton.classList.remove("selected");
});

mediumButton.addEventListener("click", function () {
    targetSize = 80;
    difficultyText.textContent = "Medium";
    difficultyHint.textContent = "🎀 Medium mode selected!";

    mediumButton.classList.add("selected");
    easyButton.classList.remove("selected");
    hardButton.classList.remove("selected");
});

hardButton.addEventListener("click", function () {
    targetSize = 60;
    difficultyText.textContent = "Hard";
    difficultyHint.textContent = "🎀 Hard mode selected!";

    hardButton.classList.add("selected");
    easyButton.classList.remove("selected");
    mediumButton.classList.remove("selected");
});


// Game buttons

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
playAgain.addEventListener("click", startGame);


// Clear High Score

clearButton.addEventListener("click", function () {

    highScore = 0;

    highScoreText.textContent = 0;

    localStorage.removeItem("pinkClickerHighScore");

    playSound(250, 0.15);
});


// Target click

target.addEventListener("click", function () {

    if (!gameStarted) {
        return;
    }

    score++;

    scoreText.textContent = score;

    animateScore();

    playSound(600, 0.08);

    target.classList.remove("pop");

    void target.offsetWidth;

    target.classList.add("pop");

    if (score > highScore) {

        highScore = score;

        highScoreText.textContent = highScore;
        mediumButton.classList.add("selected");

        localStorage.setItem(
            "pinkClickerHighScore",
            highScore
        );
    }

    moveTarget();
});


// Start Game

function startGame() {

    clearInterval(timer);
    clearInterval(countdownTimer);

    score = 0;
    time = 30;
    gameStarted = false;
    gameStatus.textContent = "🎀 Get ready...";

    scoreText.textContent = score;
    timeText.textContent = time;

    startButton.disabled = true;
    gameStatus.textContent = "💗 GO! Click as fast as you can!";

    gameOver.style.display = "none";
    target.style.display = "none";

    bestMessage.textContent = "";

    countdown.textContent = "";
    readyText.textContent = "🎀 READY? 🎀";
    readyText.style.display = "block";

    playSound(500, 0.2);

    setTimeout(function () {

        readyText.style.display = "none";

        let count = 3;

        countdown.textContent = count;

        animateCountdown();

        playSound(400, 0.15);

        countdownTimer = setInterval(function () {

            count--;

            if (count > 0) {

                countdown.textContent = count;

                animateCountdown();

                playSound(400, 0.15);

            } else {

                clearInterval(countdownTimer);

                countdown.textContent = "GO!";

                animateCountdown();

                playSound(800, 0.25);

                gameStarted = true;

                target.style.display = "block";

                moveTarget();

                setTimeout(function () {
                    countdown.textContent = "";
                }, 500);

                startTimer();
            }

        }, 1000);

    }, 1000);
}


// Timer

function startTimer() {

    timer = setInterval(function () {

        time--;

        timeText.textContent = time;
        if (time <= 10) {
    timeText.classList.add("warning");
} else {
    timeText.classList.remove("warning");
}

        if (time <= 0) {
            endGame();
        }

    }, 1000);
}


// Game Over

function endGame() {

    clearInterval(timer);
    clearInterval(countdownTimer);

    gameStarted = false;
    gameStatus.textContent = "🏆 Game over! Great job!";

    target.style.display = "none";

    finalScore.textContent = score;

    if (score >= highScore && score > 0) {

        bestMessage.textContent = "🏆 NEW HIGH SCORE! 🎀";

        playSound(900, 0.4);

    } else {

        bestMessage.textContent = "💗 Great job! Try again!";

        playSound(300, 0.3);
    }

    gameOver.style.display = "block";

    startButton.disabled = false;
}


// Move Target

function moveTarget() {

    const gameArea = document.getElementById("gameArea");

    const maxX = gameArea.clientWidth - targetSize;
    const maxY = gameArea.clientHeight - targetSize;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    target.style.left = x + "px";
    target.style.top = y + "px";

    target.style.width = targetSize + "px";
    target.style.height = targetSize + "px";
}