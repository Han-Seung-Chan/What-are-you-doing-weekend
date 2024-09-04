import Store from '../core/store.js';

class HeaderStore extends Store {
  #sortOrder = 'sortOrder';

  init() {
    this.setState(this.#sortOrder, 'progressAppoint');
  }

  getSortOrder() {
    return this.getState(this.#sortOrder);
  }

  setSortOrder(order) {
    this.setState(this.#sortOrder, order);
  }
}

export default new HeaderStore();
