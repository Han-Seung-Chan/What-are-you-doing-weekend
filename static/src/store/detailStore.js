import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';

class DetailStore extends Store {
  #detailPost = 'detailPost';
  #selectPostId = 'selectPostId';
  async init() {}

  getSelectPostId() {
    return this.getState(this.#selectPostId);
  }

  async setSelectPostId(id) {
    this.setState(this.#selectPostId, id);
  }

  getDetailPost() {
    return this.getState(this.#detailPost);
  }

  async setDetailPost(id) {
    const data = await requestGET(`/list?id=${id}`);
    this.setDetailPost(this.#detailPost, data);
  }
}

export default new DetailStore();
