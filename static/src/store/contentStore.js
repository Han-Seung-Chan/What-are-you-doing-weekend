import Store from '../core/store.js';

import { requestGET, requestPOST } from '../api/fetchData.js';
import DetailStore from './detailStore.js';

class ContentsDataStore extends Store {
  #contentsKey = 'contentsData';

  async init() {
    await this.setContents();
  }

  getContents() {
    return this.getState(this.#contentsKey);
  }

  async setContents() {
    const data = await requestGET('/lists');
    // DetailStore.setDetailPost(data[0].post_id);
    this.setState(this.#contentsKey, data);
  }

  async setSearchContents(word) {
    if (word.length === 0) return;
    const data = await requestGET(`/list?search=${word}`);
    this.setState(this.#contentsKey, data);
  }

  async setSortContents(order) {
    const data = await requestGET(`/list?sort=${sortStandard}`);
    this.setState(this.#contentsKey, data);
  }

  async postContent(bodyData) {
    await requestPOST('/write', bodyData);
    this.setContents();
  }

  async deleteContent(id) {
    await requestPOST('/delete', { id });
    this.setContents();
  }

  async participate(id) {
    await requestPOST('/participate', { id });
    this.setContents();
  }

  setEmptyContents() {
    this.setState(this.#contentsKey, []);
  }
}

export default new ContentsDataStore();
