import { scoring } from './scoring.js';

function shuffle(array) {
  let m = array.length;
  while (m) {
    let i = Math.floor(Math.random() * m--);

    let t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

export class Game {
  constructor() {
    if (
      window.localStorage.getItem('grid') !== null &&
      window.localStorage.getItem('bag') !== null
    ) {
      this.grid = JSON.parse(window.localStorage.getItem('grid'));
      this.bag = JSON.parse(window.localStorage.getItem('bag'));
    } else {
      this.reset();
    }
  }

  reset() {
    // Initialize the bag.
    const frequencies = {
      '*': 2,
      a: 9,
      b: 2,
      c: 2,
      d: 4,
      e: 12,
      f: 2,
      g: 3,
      h: 2,
      i: 9,
      j: 1,
      k: 1,
      l: 4,
      m: 2,
      n: 6,
      o: 8,
      p: 2,
      q: 1,
      r: 6,
      s: 4,
      t: 6,
      u: 4,
      v: 2,
      w: 2,
      x: 1,
      y: 2,
      z: 1,
    };

    this.grid = [];
    for (let i = 1; i <= 15; ++i) {
      this.grid[i] = [];
      for (let j = 1; j <= 15; ++j) {
        this.grid[i][j] = null;
      }
    }

    // Create the bag
    this.bag = [];
    for (let letter in frequencies) {
      for (let i = 0; i < frequencies[letter]; ++i) {
        this.bag.push(letter);
      }
    }

    this.bag = shuffle(this.bag);

    // Save current state to local storage
    window.localStorage.setItem('grid', JSON.stringify(this.grid));
    window.localStorage.setItem('bag', JSON.stringify(this.bag));
  }

  render(element) {
    element.innerHTML = '';

    for (let i = 1; i <= 15; ++i) {
      for (let j = 1; j <= 15; ++j) {
        const div = document.createElement('div');
        div.classList.add('grid-item');
        div.innerText = this.grid[i][j] === null ? '' : this.grid[i][j];

        const label = scoring.label(i, j);
        if (label !== '') {
          div.classList.add(label);
        }

        element.appendChild(div);
      }
    }
  }

  _saveBag() {
    window.localStorage.setItem('bag', JSON.stringify(this.bag));
  }

  _saveGrid() {
    window.localStorage.setItem('grid', JSON.stringify(this.grid));
  }

  takeFromBag(n) {
    if (n >= this.bag.length) {
      const drawn = this.bag;
      this.bag = [];
      return drawn;
    }

    const drawn = [];
    for (let i = 0; i < n; ++i) {
      drawn.push(this.bag.pop());
    }
    return drawn;
  }


  getGrid() {
    return this.grid;
  }

  _canBePlacedOnBoard(word, position, direction) {
    const grid = this.grid;
    const letters = word.split('');
    const placement = direction
      ? letters.map((letter, i) => grid[position.x + i][position.y] === null)
      : letters.map((letter, i) => grid[position.x][position.y + i] === null);

    return !placement.includes(false);
  }

  _placeOnBoard(word, position, direction) {
    const grid = this.grid;
    const letters = word.split('');
    if (direction) {
      letters.forEach(
        (letter, i) => (grid[position.x + i][position.y] = letter)
      );
    } else {
      letters.forEach(
        (letter, i) => (grid[position.x][position.y + i] = letter)
      );
    }
  }

  
  playAt(word, position, direction) {
    //check if the word can be placed
    if (!this._canBePlacedOnBoard(word, position, direction)) {
      return -1;
    }

    // Place the word on the board
    this._placeOnBoard(word, position, direction);

    // Save the state of the board
    this._saveGrid();

    // Compute the score
    return scoring.score(word, position, direction);
  }
}
