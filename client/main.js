import { Game } from './game.js';
import { multiPlayerView, getPlayerName } from './multiplayer.js';
import { Rack } from './rack.js';
import * as utils from './scrabbleUtils.js';
import {
  wordScoreBoard,
  gameScoreBoard,
  topWordAndGameScoreBoard,
} from './scoreboard.js';

const boardGridElement = document.getElementById('board');
const playersElement = document.getElementById('players');
const wordElement = document.getElementById('word');
const xElement = document.getElementById('x');
const yElement = document.getElementById('y');
const directionElement = document.getElementById('direction');
const playButtonElement = document.getElementById('play');
const resetButtonElement = document.getElementById('reset');
const helpButtonElement = document.getElementById('help');
const hintElement = document.getElementById('hint');
const endButtonElement = document.getElementById('end');

const TILE_COUNT = 7;
const NUMBER_OF_PLAYERS = 2;

const scores = Array.from(Array(NUMBER_OF_PLAYERS), () => 0);

const setUpRacks = (game, tileCount, numberOfPlayers) => {
  const racks = [];
  for (let i = 0; i < numberOfPlayers; i++) {
    const rack = new Rack();
    rack.takeFromBag(tileCount, game);
    racks[i] = rack;
  }
  return racks;
};

// A utility function to keep a circular counter.
const circularCounter = (end) => {
  let current = 0;
  return () => {
    current = (current + 1) % end;
    return current;
  };
};

const game = new Game();
game.render(boardGridElement);

const racks = setUpRacks(game, TILE_COUNT, NUMBER_OF_PLAYERS);
let nextTurn = circularCounter(NUMBER_OF_PLAYERS);
let turn = 0;

multiPlayerView(playersElement, racks, turn);

playButtonElement.addEventListener('click', () => {
  const word = wordElement.value;
  const x = parseInt(xElement.value);
  const y = parseInt(yElement.value);
  const direction = directionElement.value === 'horizontal';

  let score = 0;

  const tiles = racks[turn].getAvailableTiles();

  const wordIsValid = (w) =>
    utils.canConstructWord(tiles, w) && utils.isValid(w);

  const wordIsNotValid = (w) => !wordIsValid(w);

  const playAt = (rw, { x, y }, d) => {
    score = game.playAt(rw, { x, y }, d);
    if (score !== -1) {
      scores[turn] += score;
    }
  };

  const playFails = (w, d) => {
    const rw = utils.constructWord(tiles, w).join('');
    return playAt(rw, { x, y }, d) === -1;
  };

  if (wordIsNotValid(word)) {
    alert(`The word ${word} cannot be constructed.`);
  } else if (wordIsValid(word) && playFails(word, direction)) {
    alert(`The word ${word} cannot be played at that location.`);
  } else {
    game.render(boardGridElement);

    const used = utils.constructWord(tiles, word);
    used.forEach((tile) => racks[turn].removeTile(tile));

    racks[turn].takeFromBag(used.length, game);

    const wordScoreBoardElement = document.getElementById('word-score-board');
    wordScoreBoard.saveWordScore(getPlayerName(turn), word, score);
    wordScoreBoard.render(wordScoreBoardElement);

    turn = nextTurn();
    multiPlayerView(playersElement, racks, turn);

    wordElement.value = '';
    xElement.value = '';
    yElement.value = '';
    hintElement.innerHTML = '';
  }
});

resetButtonElement.addEventListener('click', () => {
  // Reset the game board.
  game.reset();
  game.render(boardGridElement);

  // Reset the racks.
  racks.forEach((rack) => rack.reset());
  racks.forEach((rack) => rack.takeFromBag(TILE_COUNT, game));

  // Reset the turn and next turn counter function.
  nextTurn = circularCounter(racks.length);
  turn = 0;

  // Reset the multiplayer view.
  multiPlayerView(playersElement, racks, turn, true);
});

helpButtonElement.addEventListener('click', () => {
  const tiles = racks[turn].getAvailableTiles();
  const possibilities = utils.bestPossibleWords(tiles);
  const hint =
    possibilities.length === 0
      ? 'no words!'
      : possibilities[Math.floor(Math.random() * possibilities.length)];
  hintElement.innerText = hint;
});

endButtonElement.addEventListener('click', () => {
  const playerName = getPlayerName(turn); 
  gameScoreBoard.saveGameScore(playerName, scores[turn]);
  gameScoreBoard.render(document.getElementById('game-score-board')); 
  topWordAndGameScoreBoard.render(document.getElementById('top-10-score-board'));
});
