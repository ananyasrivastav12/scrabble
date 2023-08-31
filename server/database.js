import { readFile, writeFile } from 'fs/promises';

class Database {
  constructor() {
    this.path = 'scores.json';
  }

  async saveWordScore(name, word, score) {
    const data = await this._read();
    data.word.push({ name, word, score });
    await this._write(data);
  }

  async saveGameScore(name, score) {
    const data = await this._read();
    data.game.push({ name, score });
    await this._write(data);
  }

  async top10WordScores() {
    const data = await this._read();
    const sorted = data.word.sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, 10);
    return top;
  }

  async top10GameScores() {
    const data = await this._read();
    const sorted = data.game.sort((a, b) => b.score - a.score);
    const top = sorted.slice(0, 10);
    return top;
  }

  async _read() {
    try {
      const data = await readFile(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { word: [], game: [] };
    }
  }

  async _write(data) {
    await writeFile(this.path, JSON.stringify(data), 'utf8');
  }
}

const database = new Database();

export { database };
