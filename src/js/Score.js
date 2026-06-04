class Score {
    constructor() {
        this.score = 0;
        this.misses = 0;
        this.maxMisses = 5;
        this.scoreElement = null;
        this.missesElement = null;
    }

    init() {
        this.scoreElement = document.getElementById('score');
        this.missesElement = document.getElementById('misses');
        this.updateDisplay();
    }

    incrementScore() {
        this.score++;
        this.updateDisplay();
    }

    incrementMiss() {
        this.misses++;
        this.updateDisplay();
    }

    updateDisplay() {
        if (this.scoreElement) this.scoreElement.textContent = this.score;
        if (this.missesElement) this.missesElement.textContent = this.misses;
    }

    isGameOver() {
        return this.misses >= this.maxMisses;
    }

    reset() {
        this.score = 0;
        this.misses = 0;
        this.updateDisplay();
    }

    getScore() {
        return this.score;
    }

    getMisses() {
        return this.misses;
    }

    getMaxMisses() {
        return this.maxMisses;
    }
}

module.exports = Score;