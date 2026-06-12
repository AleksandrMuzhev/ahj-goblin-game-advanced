const Board = require('./Board');
const Goblin = require('./Goblin');
const Score = require('./Score');

const BOARD_SIZE = 4;
const GOBLIN_VISIBLE_TIME = 1000;
const GOBLIN_APPEAR_DELAY = 1000;
const MAX_MISSES = 5;

class Game {
    constructor() {
        this.board = new Board(BOARD_SIZE);
        this.goblin = new Goblin();
        this.score = new Score(MAX_MISSES);
        this.timeoutId = null;
        this.isRunning = false;
        this.isGoblinVisible = false;
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
        this.scheduleGoblinAppearance();
    }

    scheduleGoblinAppearance() {
        if (!this.isRunning || this.score.isGameOver()) return;

        this.timeoutId = setTimeout(() => {
            if (this.isRunning && !this.score.isGameOver()) {
                this.showGoblin();
            }
        }, GOBLIN_APPEAR_DELAY);
    }

    showGoblin() {
        if (this.score.isGameOver()) {
            this.endGame();
            return;
        }

        const newPosition = this.board.getRandomPosition();
        this.board.placeGoblin(newPosition);
        this.isGoblinVisible = true;

        // Гоблин исчезнет через GOBLIN_VISIBLE_TIME (без засчета промаха)
        this.timeoutId = setTimeout(() => {
            if (this.isGoblinVisible && this.isRunning && !this.score.isGameOver()) {
                this.board.removeGoblin();
                this.isGoblinVisible = false;
                this.scheduleGoblinAppearance();
            }
        }, GOBLIN_VISIBLE_TIME);
    }

    onCellClick(position) {
        if (!this.isRunning || this.score.isGameOver()) return;

        if (!this.isGoblinVisible) return;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        if (position === this.board.currentPosition) {
            this.score.incrementScore();
            this.board.removeGoblin();
            this.isGoblinVisible = false;
            this.updateScore();

            if (this.score.isGameOver()) {
                this.endGame();
            } else {
                this.showGoblin();
            }
        } else {
            this.score.incrementMiss();
            this.board.removeGoblin();
            this.isGoblinVisible = false;
            this.updateScore();

            if (this.score.isGameOver()) {
                this.endGame();
            } else {
                this.scheduleGoblinAppearance();
            }
        }
    }

    updateScore() {
        this.score.updateDisplay();

        if (this.score.isGameOver()) {
            this.endGame();
        }
    }

    endGame() {
        this.isRunning = false;
        this.isGoblinVisible = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.board.removeGoblin();
        this.showGameStatus();
    }

    showGameStatus() {
        if (!this.statusElement) return;

        if (this.score.isGameOver()) {
            this.statusElement.textContent = `😢 Игра окончена! Вы поймали ${this.score.getScore()} гоблинов, пропустили ${this.score.getMisses()}`;
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
        this.isGoblinVisible = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
        this.board.reset();
        this.score.reset();
        this.clearGameStatus();
        this.start();
    }
}

module.exports = Game;