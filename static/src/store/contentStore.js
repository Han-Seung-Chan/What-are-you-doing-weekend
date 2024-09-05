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

    this.setState(this.#contentsKey, data);
  }

  async setSearchContents(word) {
    if (word.length === 0) return;
    const arr = this.getContents();

    const resultArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].title.includes(word)) {
        resultArray.push(arr[i]);
      }
    }

    this.setState(this.#contentsKey, resultArray);
  }

  async setSortContents(order) {
    const data = await requestGET('/lists', { sortMode: order });
    this.setState(this.#contentsKey, data);
  }

  async postContent(bodyData) {
    const prev = this.getContents();
    const data = await requestPOST('/write', bodyData);
    this.setState(this.#contentsKey, [...prev, data]);
  }

  setEmptyContents() {
    this.setState(this.#contentsKey, []);
  }
}

export default new ContentsDataStore();
