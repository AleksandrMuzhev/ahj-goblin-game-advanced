const Board = require('./Board');
const Goblin = require('./Goblin');
const Score = require('./Score');

class Game {
    constructor() {
        this.board = new Board(4);
        this.goblin = new Goblin();
        this.score = new Score();
        this.intervalId = null;
        this.isRunning = false;
        this.moveInterval = 1000;
        this.statusElement = null;
    }

    init() {
        this.score.init();
        this.board.init(this.goblin);
        this.board.bindClick((position) => this.onCellClick(position));
        this.statusElement = document.getElementById('game-status');
        this.bindRestartButton();
        this.start();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.clearGameStatus();
        this.scheduleNextMove();
    }

    scheduleNextMove() {
        if (this.intervalId) clearTimeout(this.intervalId);

        this.intervalId = setTimeout(() => {
            if (this.isRunning && !this.score.isGameOver()) {
                this.moveGoblin();
                this.scheduleNextMove();
            }
        }, this.moveInterval);
    }

    moveGoblin() {
        if (this.score.isGameOver()) {
            this.endGame();
            return;
        }

        const newPosition = this.board.getRandomPosition();
        this.board.placeGoblin(newPosition);

        // Если гоблин был перемещён без клика - это промах
        if (this.board.currentPosition !== null) {
            // Промах будет засчитан только если гоблин исчезнет сам
        }
    }

    onCellClick(position) {
        if (!this.isRunning || this.score.isGameOver()) return;

        if (position === this.board.currentPosition) {
            this.score.incrementScore();
            this.board.removeGoblin();

            // Сразу перемещаем гоблина в новое место при попадании
            const newPosition = this.board.getRandomPosition();
            this.board.placeGoblin(newPosition);
        } else {
            this.score.incrementMiss();

            if (this.score.isGameOver()) {
                this.endGame();
            }
        }
    }

    endGame() {
        this.isRunning = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.board.removeGoblin();
        this.showGameStatus();
    }

    showGameStatus() {
        if (!this.statusElement) return;

        if (this.score.getMisses() >= this.score.getMaxMisses()) {
            this.statusElement.textContent = `😢 Игра окончена! Вы поймали ${this.score.getScore()} гоблинов`;
            this.statusElement.className = 'game-status game-over';
        }
    }

    clearGameStatus() {
        if (this.statusElement) {
            this.statusElement.textContent = '';
            this.statusElement.className = 'game-status';
        }
    }

    bindRestartButton() {
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }
    }

    restart() {
        this.isRunning = false;
        if (this.intervalId) {
            clearTimeout(this.intervalId);
            this.intervalId = null;
        }
        this.board.reset();
        this.score.reset();
        this.clearGameStatus();
        this.start();
    }
}

module.exports = Game;