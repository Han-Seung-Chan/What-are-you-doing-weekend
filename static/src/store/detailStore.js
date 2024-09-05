import Store from '../core/store.js';

import { requestGET, requestPOST } from '../api/fetchData.js';

class DetailStore extends Store {
  #detail = 'detailPost';
  #selectId = 'selectId';

  async init() {
    this.setState(this.#detail, {});
  }

  getSelectPostId() {
    return this.getState(this.#selectId);
  }

  setSelectId(id) {
    return this.setState(this.#selectId, id);
  }

  getDetailPost() {
    return this.getState(this.#detail);
  }

  async setDetailPost(id) {
    const data = await requestGET(`/view?post_id=${id}`);
    console.log(data);

    this.setState(this.#detail, data);
  }

  async deleteContent(id) {
    await requestPOST('/delete', { id });
  }

  async participate(post_id) {
    await requestPOST('/parti', { post_id });
    await this.setDetailPost(post_id);
  }

  async participateCancel(post_id) {
    await requestPOST('/parti-cancel', { post_id });
    await this.setDetailPost(post_id);
  }
}

export default new DetailStore();
