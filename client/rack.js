export class Rack {
  constructor() {
    this.available = {};
  }

  getAvailableTiles() {
    return this.available;
  }

  render(element) {
    element.innerHTML = '';
    for (const letter in this.available) {
      for (let i = 0; i < this.available[letter]; ++i) {
        const div = document.createElement('div');
        div.classList.add('grid-item');
        div.innerText = letter;
        element.appendChild(div);
      }
    }
  }

  reset() {
    this.available = {};
  }

  removeTile(tile) {
    if (!(tile in this.available)) {
      return false;
    } else {
      if (this.available[tile] === 1) {
        delete this.available[tile];
      } else {
        --this.available[tile];
      }

      return true;
    }
  }

  takeFromBag(n, game) {
    for (let tile of game.takeFromBag(n)) {
      if (tile in this.available) {
        ++this.available[tile];
      } else {
        this.available[tile] = 1;
      }
    }
  }
}
