import Store from '../core/store.js';

import { listArr } from '../constants/mock/list.js';

class ContentsDataStore extends Store {
  #contentsKey = 'contentsData';
  #selectPostId = 'selectPostId';

  async init() {
    await this.setContents();
    this.setSelectPostId();
  }

  getSelectPostId() {
    return this.getState(this.#selectPostId);
  }

  async setSelectPostId(id) {
    this.setState(this.#selectPostId, id);
  }

  getContents() {
    return this.getState(this.#contentsKey);
  }

  async setContents() {
    this.setState(this.#contentsKey, listArr);
  }

  async setSearchContents(word) {
    if (word.length === 0) return;
    const filterArr = listArr.filter((data) => {
      return data.title.search(word) > 0 ?? data;
    });
    this.setState(this.#contentsKey, filterArr);
  }

  async setSortContents(order) {
    const filterArr = listArr.filter((data) => {
      return data.post_id % 2 === 0 ?? data;
    });
    this.setState(this.#contentsKey, filterArr);
  }

  setEmptyContents() {
    this.setState(this.#contentsKey, []);
  }
}

export default new ContentsDataStore();
