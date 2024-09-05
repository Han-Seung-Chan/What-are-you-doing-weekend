import Component from '../core/component.js';
import AlarmStore from '../store/alarmStore.js';
import SideStore from '../store/sideStore.js';

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
          .map(({ title, user_id, isJoin }) => {
            const myJoin = isJoin === 1 ? true : false;
            return `
            <div class="alert_message">
              <p>나의 ${title} 약속에 ${user_id}님이 ${
              isJoin === 1 ? '참가' : '참가 취소'
            }했습니다.</p>
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
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_alarm-ok', () => {
      SideStore.setCurModal('');
    });
  }
}

export default Alarm;
