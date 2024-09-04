import Store from '../core/store.js';

import { listArr } from '../constants/mock/list.js';
import { fetchContents } from '../api/fetchData.js';

class ContentsDataStore extends Store {
  #contentsKey = 'contentsData';

  async init() {
    await this.setContents();
  }

  getContents() {
    return this.getState(this.#contentsKey);
  }

  async setContents() {
    const data = await fetchContents('list');
    // data 추가해주면 끝
    this.setState(this.#contentsKey, listArr);
  }

  async setSearchContents(word) {
    if (word.length === 0) return;
    const data = await fetchContents(`list?search=${word}`);
    // data 추가해주면 끝
    this.setState(this.#contentsKey, filterArr);
  }

  async setSortContents(order) {
    const filterArr = listArr.filter((data) => {
      return data.post_id % 2 === 0 ?? data;
    });
    const data = await fetchContents(`list?sort=${sortStandard}`);
    // data 추가해주면 끝
    this.setState(this.#contentsKey, filterArr);
  }

  async postContent(bodyData) {
    await fetchContents('write', 'POST', bodyData);
    this.setContents();
  }

  async deleteContent(id) {
    await fetchContents('delete', 'POST', { id });
    this.setContents();
  }

  async participate(id) {
    await fetchContents('participate', 'POST', { id });
    this.setContents();
  }

  setEmptyContents() {
    this.setState(this.#contentsKey, []);
  }
}

export default new ContentsDataStore();
