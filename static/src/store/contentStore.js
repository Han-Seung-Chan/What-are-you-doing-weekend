import Store from '../core/store.js';

import { requestGET, requestPOST } from '../api/fetchData.js';

class ContentsDataStore extends Store {
  #contentsKey = 'contentsData';

  async init() {
    await this.setContents();
  }

  getContents() {
    return this.getState(this.#contentsKey);
  }

  async setContents() {
    let data;
    if (!data) data = [];
    else data = await requestGET('/list');

    this.setState(this.#contentsKey, data);
  }

  async setSearchContents(word) {
    if (word.length === 0) return;
    const data = await requestGET(`/list?search=${word}`);
    this.setState(this.#contentsKey, data);
  }

  async setSortContents(order) {
    const data = await requestGET(`/list?sort=${sortStandard}`);
    // data 추가해주면 끝
    this.setState(this.#contentsKey, data);
  }

  async postContent(bodyData) {
    await requestPOST('/write', 'POST', bodyData);
    this.setContents();
  }

  async deleteContent(id) {
    await requestPOST('/delete', 'POST', { id });
    this.setContents();
  }

  async participate(id) {
    await requestPOST('/participate', 'POST', { id });
    this.setContents();
  }

  setEmptyContents() {
    this.setState(this.#contentsKey, []);
  }
}

export default new ContentsDataStore();
