class WordScoreBoard {
  constructor() {
    this.words = [];
  }

  async saveWordScore(name, word, score) {
    this.words.push({ name, word, score });
    console.log(name, word, score);

    const response = await fetch('http://localhost:3000/wordScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, word, score }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
  render(element) {
    element.innerHTML = '';
  }
}

class GameScoreBoard {
  constructor() {
    this.game = [];
  }

  render(element) {
    element.innerHTML = '';
  }

  async saveGameScore(name, score) {
    this.game.push({ name, score });

    const response = await fetch('http://localhost:3000/gameScore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, score }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
}class TopWordAndGameScoreBoard {
  async render(element) {
    const responseWordScores = await fetch('http://localhost:3000/highestWordScores');
    if (!responseWordScores.ok) {
      throw new Error(`HTTP error! status: ${responseWordScores.status}`);
    }
    const topWordScores = await responseWordScores.json();
    console.log(topWordScores);

    const responseGameScores = await fetch('http://localhost:3000/highestGameScores');
    if (!responseGameScores.ok) {
      throw new Error(`HTTP error! status: ${responseGameScores.status}`);
    }
    const topGameScores = await responseGameScores.json();

    let html = '<h1 class="top-score-boards">Top Scores</h1>';

    html += '<h2>Top Word Scores</h2>';
    html += '<table>';
    html += `
      <tr>
        <th>Name</th>
        <th>Word</th>
        <th>Score</th>
      </tr>
    `;
    topWordScores.slice(0, 10).forEach((score) => {
      html += `
        <tr>
          <td>${score.name}</td>
          <td>${score.word}</td>
          <td>${score.score}</td>
        </tr>
      `;
    });
    html += '</table>';

    html += '<h2>Top Game Scores</h2>';
    html += '<table>';
    html += `
      <tr>
        <th>Name</th>
        <th>Score</th>
      </tr>
    `;
    topGameScores.slice(0, 10).forEach((score) => {
      html += `
        <tr>
          <td>${score.name}</td>
          <td>${score.score}</td>
        </tr>
      `;
    });
    html += '</table>';

    element.innerHTML = html;
  }
}


export const wordScoreBoard = new WordScoreBoard();
export const gameScoreBoard = new GameScoreBoard();
export const topWordAndGameScoreBoard = new TopWordAndGameScoreBoard();
