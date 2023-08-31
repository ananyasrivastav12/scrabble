const saveState = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));
const restoreState = (key) => JSON.parse(window.localStorage.getItem(key));
const removeState = (key) => window.localStorage.removeItem(key);
const isSaved = (key) => window.localStorage.getItem(key) !== null;

const playerNames = [];

export const getPlayerName = (i) => playerNames[i];

const turnLabel = (playerNumber) => {
  const playerName = isSaved(`player-${playerNumber}`)
    ? restoreState(`player-${playerNumber}`)
    : `Player ${playerNumber}`;
  const pElm = document.createElement('p');
  pElm.classList.add('center');
  pElm.innerHTML = `<p>It is <strong>${playerName}</strong>'s turn</p>`;
  return pElm;
};

const playerTextBox = (playerNumber, turnLabel) => {
  const playerName = `Player ${playerNumber}`;
  const inputElm = document.createElement('input');
  inputElm.type = 'text';
  inputElm.value = isSaved(`player-${playerNumber}`)
    ? restoreState(`player-${playerNumber}`)
    : playerName;

  inputElm.addEventListener('keyup', () => {
    const playerName = inputElm.value;
    turnLabel.innerHTML = `<p>It is <strong>${playerName}</strong>'s turn</p>`;
    saveState(`player-${playerNumber}`, playerName);

    playerNames[playerNumber - 1] = playerName;
  });

  playerNames[playerNumber - 1] = inputElm.value;

  return inputElm;
};

const playerView = (playerTextBox, rack) => {
  const rackViewElm = document.createElement('div');
  rackViewElm.classList.add('rack');
  rack.render(rackViewElm);

  const playerViewElm = document.createElement('div');
  playerViewElm.appendChild(playerTextBox);
  playerViewElm.appendChild(rackViewElm);

  return playerViewElm;
};

export const multiPlayerView = (element, racks, turn, reset = false) => {
  const playerCount = racks.length;

  element.innerHTML = '';

  if (reset) {
    for (let i = 0; i < playerCount; ++i) {
      removeState(`player-${i + 1}`);
    }
  }

  const multiPlayerViewElm = document.createElement('div');

  const turnLabelElm = turnLabel(turn + 1);

  multiPlayerViewElm.appendChild(turnLabelElm);

  for (let i = 0; i < playerCount; ++i) {
    const playerTextBoxElm = playerTextBox(i + 1, turnLabelElm);
    const playerViewElm = playerView(playerTextBoxElm, racks[i]);
    playerTextBoxElm.disabled = i !== turn;

    multiPlayerViewElm.appendChild(playerViewElm);
  }


  element.appendChild(multiPlayerViewElm);

  return element;
};
