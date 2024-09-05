import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';
import { requestPOST } from '../api/fetchData.js';

class CommentStore extends Store {
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
    const res = await requestGET(`/list/comments?post_id=${id}`);
    this.setState(this.#comment, res);
  }

  async postComment(data) {
    const prev = this.getComment();
    const res = await requestPOST('/write/comments', data);

    this.setState(this.#comment, [...prev, res]);
  }

  getReview() {
    return this.getState(this.#review);
  }

  async setReview(id) {
    const res = await requestGET(`/list/reviews?post_id=${id}`);
    this.setState(this.#review, res);
  }

  async postReview(data) {
    const prev = this.getReview();
    const res = await requestPOST('/write/reviews', data);

    this.setState(this.#review, [...prev, res]);
  }
}

export default new CommentStore();
