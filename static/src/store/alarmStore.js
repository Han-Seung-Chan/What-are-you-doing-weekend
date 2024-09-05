import Store from '../core/store.js';

import { requestGET } from '../api/fetchData.js';

class AlarmStore extends Store {
  #alarm = 'alarm';
  #alarmLength = 'alarmLength';
  #intervalId = 'intervalId';

  async init() {
    await this.setAlarm();
    this.#intervalId = setInterval(async () => {
      await this.setAlarm();
    }, 100000);
  }

  getIntervalId() {}

  getAlarm() {
    return this.getState(this.#alarm);
  }

  async setAlarm() {
    const data = await requestGET('/alarm');
    this.setState(this.#alarm, data);
  }
}

export default new AlarmStore();
