import Store from '/src/core/store.js';

import { alarmList } from '/src/constants/mock/alarm.js';

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
