class Goblin {
    constructor() {
        this.element = null;
        this.create();
    }

    create() {
        this.element = document.createElement('img');
        this.element.src = require('../img/goblin.png');
        this.element.classList.add('goblin');
        this.element.alt = 'Goblin';
    }

    getElement() {
        return this.element;
    }
}

module.exports = Goblin;