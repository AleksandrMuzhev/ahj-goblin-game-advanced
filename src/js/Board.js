class Board {
    constructor(size = 4) {
        this.size = size;
        this.element = null;
        this.cells = [];
        this.goblin = null;
        this.currentPosition = null;
    }

    init(goblin) {
        this.goblin = goblin;
        this.createBoard();
    }

    createBoard() {
        this.element = document.getElementById('game-board');
        if (!this.element) return;

        this.element.innerHTML = '';
        this.cells = [];

        for (let i = 0; i < this.size * this.size; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            this.element.append(cell);
            this.cells.push(cell);
        }
    }

    placeGoblin(position) {
        if (this.currentPosition !== null) {
            this.removeGoblin();
        }

        if (this.cells[position]) {
            this.cells[position].append(this.goblin.getElement());
            this.currentPosition = position;
        }
    }

    removeGoblin() {
        if (this.currentPosition !== null && this.cells[this.currentPosition]) {
            const cell = this.cells[this.currentPosition];
            if (cell.contains(this.goblin.getElement())) {
                cell.remove(this.goblin.getElement());
            }
        }
        this.currentPosition = null;
    }

    getRandomPosition() {
        let newPosition;
        do {
            newPosition = Math.floor(Math.random() * this.cells.length);
        } while (newPosition === this.currentPosition && this.cells.length > 1);
        return newPosition;
    }

    bindClick(callback) {
        this.cells.forEach(cell => {
            cell.addEventListener('click', (event) => {
                const index = parseInt(cell.dataset.index);
                callback(index);
            });
        });
    }

    reset() {
        this.removeGoblin();
        this.currentPosition = null;
    }
}

module.exports = Board;