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
    const res = await requestGET(`/list/reviews?post_id=${id}`);
    this.setState(this.#comment, res);
  }

  async postComment(data) {
    const prev = this.getComment();
    const res = await requestPOST('/write/reviews', data);

    this.setState(this.#comment, [...prev, res]);
  }

  getReview() {
    return this.getState(this.#review);
  }

  async setReview(post_id) {
    const res = await requestPOST('/write/reviews', { post_id });
    console.log(res);
    this.setState(this.#review, []);
  }
}

export default new CommentStore();
