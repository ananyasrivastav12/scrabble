// This module contains utility functions for the scrabble game.

// This imports the dictionary of scrabble words.
import { dictionary } from './dictionary.js';

await dictionary.loadDictionary();

/**
 * This function checks whether a given word can be constructed with the
 * available tiles. The availableTiles object should not be modified.
 *
 * @param {object} availableTiles The available tiles to use.
 * @param {string} word The word to check.
 * @returns {boolean} Returns true if the word can be constructed with the given
 *                    tiles; false otherwise.
 */
function canConstructWord(availableTiles, word) {
  const copy = {};
  for (let letter in availableTiles) {
    copy[letter] = availableTiles[letter];
  }

  for (let letter of word) {
    if (letter in copy) {
      --copy[letter];

      if (copy[letter] === 0) {
        delete copy[letter];
      }
    } else {
      if ('*' in copy) {
        --copy['*'];

        if (copy['*'] === 0) {
          delete copy['*'];
        }
      } else {
        return false;
      }
    }
  }

  return true;
}


function constructWord(availableTiles, word) {
  const copy = {};
  for (let letter in availableTiles) {
    copy[letter] = availableTiles[letter];
  }

  const tiles = [];

  for (let letter of word) {
    if (letter in copy) {
      tiles.push(letter);
      --copy[letter];

      if (copy[letter] === 0) {
        delete copy[letter];
      }
    } else {
      if ('*' in copy) {
        tiles.push('*');
        --copy['*'];

        if (copy['*'] === 0) {
          delete copy['*'];
        }
      } else {
        return null;
      }
    }
  }

  return tiles;
}


function baseScore(word) {
  const scores = {
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

  let score = 0;

  for (let letter of word) {
    score += scores[letter];
  }

  return score;
}


function possibleWords(availableTiles) {
  const possibilities = [];

  for (let word of dictionary.getWords()) {
    if (canConstructWord(availableTiles, word)) {
      possibilities.push(word);
    }
  }

  return possibilities;
}


function bestPossibleWords(availableTiles) {
  const possibilities = possibleWords(availableTiles);

  let suggestions = [];
  let max = -1;

  for (let word of possibilities) {
    const score = baseScore(constructWord(availableTiles, word).join(''));
    if (score > max) {
      max = score;
      suggestions = [word];
    } else if (score === max) {
      suggestions.push(word);
    }
  }

  return suggestions;
}


function isValid(word) {
  if (!word.includes('*')) {
    return dictionary.getWords().includes(word);
  }

  for (let i = 0; i < 26; ++i) {
    const letter = String.fromCharCode('a'.charCodeAt(0) + i);
    if (isValid(word.replace('*', letter))) {
      return true;
    }
  }

  return false;
}

export {
  canConstructWord,
  constructWord,
  baseScore,
  possibleWords,
  bestPossibleWords,
  isValid,
};
