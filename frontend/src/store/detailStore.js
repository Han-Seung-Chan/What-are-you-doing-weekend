import Store from '../core/store.js';

import { listArr } from '../constants/mock/list.js';
import { fetchContents } from '../api/fetchData.js';

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
    console.log(id);

    return;

    const data = await fetchContents(`list?id=${id}`);
    // data 추가해주면 끝
    this.setDetailPost(this.#detailPost, listArr[0]);
  }
}

export default new DetailStore();
