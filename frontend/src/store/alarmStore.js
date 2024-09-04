import Store from '../core/store.js';

import { alarmList } from '../constants/mock/alarm.js';

class AlarmStore extends Store {
  #alarm = 'alarm';

  async init() {
    await this.setAlarm();
  }

  getAlarm() {
    return this.getState(this.#alarm);
  }

  async setAlarm() {
    this.setState(this.#alarm, alarmList);
  }
}

export default new AlarmStore();
