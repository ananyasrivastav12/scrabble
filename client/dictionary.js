class Dictionary {

  constructor() {
    this.status = 'not loaded';
    this.words = [];
  }

  async loadDictionary() {
    const response = await fetch('dictionary.json');
    if (response.ok) {
      this.words = await response.json();
      this.status = 'loaded';
      return true;
    } else {
      this.status = 'unavailable';
      return false;
    }
  }

  isLoaded() {
    return this.status === 'loaded';
  }

  getWords() {
    return this.words;
  }

  getStatus() {
    return this.status;
  }
}

const dictionary = new Dictionary();

export { dictionary };
