import Store from '../core/store.js';

import { alarmList } from '../constants/mock/alarm.js';
import { fetchContents } from '../api/fetchData.js';

class AlarmStore extends Store {
  #alarm = 'alarm';

  async init() {
    await this.setAlarm();
  }

  getAlarm() {
    return this.getState(this.#alarm);
  }

  async setAlarm() {
    const data = await fetchContents('alarm');

    this.setState(this.#alarm, alarmList);
  }
}

export default new AlarmStore();
