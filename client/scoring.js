class Scoring {
  constructor() {
    this.board = [];
    for (let i = 1; i <= 15; ++i) {
      this.board[i] = [];
      for (let j = 1; j <= 15; ++j) {
        // Get the multiplier for the position (if any)
        this.board[i][j] = findMultipliers(i, j);
      }
    }
  }

  score(word, position, direction) {
    let score = 0;

    let wordMultiplier = 1;

    const letters = word.split('');

    letters.forEach((letter, i) => {
      const coordinate = {
        x: direction ? position.x + i : position.x,
        y: direction ? position.y : position.y + i,
      };

      const boardMultiplier = this.board[coordinate.x][coordinate.y];

      if (boardMultiplier && boardMultiplier.kind === 'ws') {
        wordMultiplier *= boardMultiplier.multiplier;
      }

      let letterMultiplier = 1;
      if (boardMultiplier && boardMultiplier.kind === 'ls') {
        letterMultiplier = boardMultiplier.multiplier;
      }

      score += letterMultiplier * letterScores[letter];
    });

    score *= wordMultiplier;

    return score;
  }

  label(x, y) {
    const multiplier = this.board[x][y];
    if (multiplier) {
      return `${multiplier.kind.toUpperCase()}x${multiplier.multiplier}`;
    }
    return '';
  }
}

export const letterScores = {
  '*': 0,
  a: 1,
  b: 3,
  c: 3,
  d: 2,
  e: 1,
  f: 4,
  g: 2,
  h: 4,
  i: 1,
  j: 8,
  k: 5,
  l: 1,
  m: 3,
  n: 1,
  o: 1,
  p: 3,
  q: 10,
  r: 1,
  s: 1,
  t: 1,
  u: 1,
  v: 4,
  w: 4,
  x: 8,
  y: 4,
  z: 10,
};


const positionMultipliers = [
  { x: 7, y: 7, kind: 'ls', multiplier: 2 },
  { x: 9, y: 7, kind: 'ls', multiplier: 2 },
  { x: 7, y: 9, kind: 'ls', multiplier: 2 },
  { x: 9, y: 9, kind: 'ls', multiplier: 2 },
  { x: 8, y: 4, kind: 'ls', multiplier: 2 },
  { x: 7, y: 3, kind: 'ls', multiplier: 2 },
  { x: 9, y: 3, kind: 'ls', multiplier: 2 },
  { x: 4, y: 1, kind: 'ls', multiplier: 2 },
  { x: 12, y: 1, kind: 'ls', multiplier: 2 },
  { x: 8, y: 12, kind: 'ls', multiplier: 2 },
  { x: 7, y: 13, kind: 'ls', multiplier: 2 },
  { x: 9, y: 13, kind: 'ls', multiplier: 2 },
  { x: 4, y: 15, kind: 'ls', multiplier: 2 },
  { x: 12, y: 15, kind: 'ls', multiplier: 2 },
  { x: 4, y: 8, kind: 'ls', multiplier: 2 },
  { x: 3, y: 7, kind: 'ls', multiplier: 2 },
  { x: 3, y: 9, kind: 'ls', multiplier: 2 },
  { x: 1, y: 4, kind: 'ls', multiplier: 2 },
  { x: 1, y: 12, kind: 'ls', multiplier: 2 },
  { x: 12, y: 8, kind: 'ls', multiplier: 2 },
  { x: 13, y: 7, kind: 'ls', multiplier: 2 },
  { x: 13, y: 9, kind: 'ls', multiplier: 2 },
  { x: 15, y: 4, kind: 'ls', multiplier: 2 },
  { x: 15, y: 12, kind: 'ls', multiplier: 2 },

  { x: 6, y: 2, kind: 'ls', multiplier: 3 },
  { x: 10, y: 2, kind: 'ls', multiplier: 3 },
  { x: 2, y: 6, kind: 'ls', multiplier: 3 },
  { x: 6, y: 6, kind: 'ls', multiplier: 3 },
  { x: 10, y: 6, kind: 'ls', multiplier: 3 },
  { x: 14, y: 6, kind: 'ls', multiplier: 3 },
  { x: 2, y: 10, kind: 'ls', multiplier: 3 },
  { x: 6, y: 10, kind: 'ls', multiplier: 3 },
  { x: 10, y: 10, kind: 'ls', multiplier: 3 },
  { x: 14, y: 10, kind: 'ls', multiplier: 3 },
  { x: 6, y: 14, kind: 'ls', multiplier: 3 },
  { x: 10, y: 14, kind: 'ls', multiplier: 3 },

  { x: 8, y: 8, kind: 'ws', multiplier: 2 },
  { x: 2, y: 2, kind: 'ws', multiplier: 2 },
  { x: 3, y: 3, kind: 'ws', multiplier: 2 },
  { x: 4, y: 4, kind: 'ws', multiplier: 2 },
  { x: 5, y: 5, kind: 'ws', multiplier: 2 },
  { x: 11, y: 11, kind: 'ws', multiplier: 2 },
  { x: 12, y: 12, kind: 'ws', multiplier: 2 },
  { x: 13, y: 13, kind: 'ws', multiplier: 2 },
  { x: 14, y: 14, kind: 'ws', multiplier: 2 },
  { x: 2, y: 14, kind: 'ws', multiplier: 2 },
  { x: 3, y: 13, kind: 'ws', multiplier: 2 },
  { x: 4, y: 12, kind: 'ws', multiplier: 2 },
  { x: 5, y: 11, kind: 'ws', multiplier: 2 },
  { x: 11, y: 5, kind: 'ws', multiplier: 2 },
  { x: 12, y: 4, kind: 'ws', multiplier: 2 },
  { x: 13, y: 3, kind: 'ws', multiplier: 2 },
  { x: 14, y: 2, kind: 'ws', multiplier: 2 },

  { x: 1, y: 1, kind: 'ws', multiplier: 3 },
  { x: 8, y: 1, kind: 'ws', multiplier: 3 },
  { x: 15, y: 1, kind: 'ws', multiplier: 3 },
  { x: 1, y: 8, kind: 'ws', multiplier: 3 },
  { x: 15, y: 8, kind: 'ws', multiplier: 3 },
  { x: 1, y: 15, kind: 'ws', multiplier: 3 },
  { x: 8, y: 15, kind: 'ws', multiplier: 3 },
  { x: 15, y: 15, kind: 'ws', multiplier: 3 },
];

export const scoring = new Scoring();
