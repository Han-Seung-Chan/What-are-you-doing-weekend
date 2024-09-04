import Component from '/src/core/component.js';
import AlarmStore from '/src/store/alarmStore.js';
import SideStore from '/src/store/sideStore.js';

import { getTimeDifference } from '/src/utils/getTimeDifference.js';

class Alarm extends Component {
  setup() {
    this.$state = {
      alarmData: AlarmStore.getAlarm(),
    };
  }

  template() {
    return `
      <div class="modal_alarm">    
        <button class="modal_close-button-alarm">x</button>
        <h1>알림</h1>
        ${this.$state.alarmData
          .map(({ title, time }) => {
            return `
            <div class="alert_message">
              <p >${title}</p>
              <span>${getTimeDifference(time)}</span>
            </div>

            `;
          })
          .join('')}
        <div class="modal_alarm_button-group">
          <button class="modal_alarm-ok">확인</button>
        </div>
      </div>
`;
  }

  setEvent() {
    this.addEvent('click', '.modal_close-button-alarm', () => {
      this.$target.close();
      SideStore.setCurModal('');
      this.destroy();
    });

    this.addEvent('click', '.modal_alarm-ok', () => {
      this.$target.close();
      SideStore.setCurModal('');
      this.destroy();
    });
  }
}

export default Alarm;
