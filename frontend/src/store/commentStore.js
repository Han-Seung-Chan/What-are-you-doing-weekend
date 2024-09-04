import Store from '../core/store.js';

import { listArr } from '../constants/mock/list.js';
import { fetchContents } from '../api/fetchData.js';

class DetailStore extends Store {
  #comment = 'comment';
  #review = 'review';
  async init() {}

  getComment() {
    return this.getState(this.#comment);
  }
  async setComment(id) {
    console.log(id);
    this.setState(this.#comment, []);
  }
  getReview() {
    return this.getState(this.#review);
  }
  async setComment(id) {
    console.log(id);
    this.setState(this.#review, []);
  }
}

export default new DetailStore();
