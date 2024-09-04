import Store from '/src/core/store.js';

class HeaderStore extends Store {
  #searchWord = 'searchWord';
  #sortOrder = 'sortOrder';

  init() {
    this.setState(this.#searchWord, '');
    this.setState(this.#sortOrder, 'progressAppoint');
  }

  getSearchWord() {
    return this.getState(this.#searchWord);
  }

  setSearchWord(word) {
    this.setState(this.#searchWord, word);
  }

  getSortOrder() {
    return this.getState(this.#sortOrder);
  }

  setSortOrder(order) {
    this.setState(this.#sortOrder, order);
  }
}

export default new HeaderStore();
