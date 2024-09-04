import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';

class AlarmStore extends Store {
  #alarm = 'alarm';

  async init() {
    this.setState(this.#alarm, []);
  }

  getAlarm() {
    return this.getState(this.#alarm);
  }

  async setAlarm() {
    return;
    const data = await requestGET('/alarm');
    this.setState(this.#alarm, data);
  }
}

export default new AlarmStore();
