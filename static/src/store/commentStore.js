import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';

class DetailStore extends Store {
  #comment = 'comment';
  #review = 'review';

  async init() {
    this.setState(this.#comment, []);
    this.setState(this.#review, []);
  }

  getComment() {
    return this.getState(this.#comment);
  }
  async setComment(id) {
    this.setState(this.#comment, []);
  }

  getReview() {
    return this.getState(this.#review);
  }

  async setReview(id) {
    this.setState(this.#review, []);
  }
}

export default new DetailStore();
