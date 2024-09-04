import Store from '../core/store.js';

class SideStore extends Store {
  #curModal = 'curModal';

  init() {
    this.setState(this.#curModal, '');
  }

  getCurModal() {
    return this.getState(this.#curModal);
  }

  setCurModal(str) {
    this.setState(this.#curModal, str);
  }
}

export default new SideStore();
