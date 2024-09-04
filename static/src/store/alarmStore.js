import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';

class AlarmStore extends Store {
  #alarm = 'alarm';

  async init() {
    await this.setAlarm();
  }

  getAlarm() {
    return this.getState(this.#alarm);
  }

  async setAlarm() {
    const data = await requestGET('/alarm');
    this.setState(this.#alarm, data);
  }
}

export default new AlarmStore();
