import Component from '../../core/component.js';

import ContentStore from '../../store/contentStore.js';
import SideStore from '../../store/sideStore.js';

import { getTimeDifference } from '../../utils/getTimeDifference.js';

class Post extends Component {
  setup() {
    this.$state = {
      contentsData: ContentStore.getContents(),
    };
  }

  template() {
    return `
    ${
      this.$props.tab === 'post'
        ? `<div class="modal_post">
          <button class="modal_close-button">x</button>
          <h1>내가 작성한 게시글</h1>
          <ul class="post_container">
            ${this.$state.contentsData
              .map(
                ({ post_id, title, scheduled_time, write_time, author_id }) => {
                  return `
                <li class="post_box" data-tab="${post_id}">
                  <h2 class="post_title">${title}</h2>
                  <p class="post_text_group">
                  <span>${scheduled_time}</span>
                  <span>${author_id}</span>
                  <span>${getTimeDifference(write_time)}</span>
                  </p>
                  </li>
                `;
                },
              )
              .join('')}
            </ul>
            <div class="modal_alarm_button-group">
              <button class="modal_alarm-ok">확인</button>
            </div>
          </div>
        `
        : `<div class="modal_post">
            <button class="modal_close-button">x</button>
            <h1>내가 참여한 게시글</h1>
            <ul class="post_container">
              ${this.$state.contentsData
                .map(
                  ({
                    post_id,
                    title,
                    scheduled_time,
                    write_time,
                    author_id,
                  }) => {
                    return `
                  <li class="post_box" data-tab="${post_id}">
                    <h2 class="post_title">${title}</h2>
                    <p class="post_text_group">
                    <span>${scheduled_time}</span>
                    <span>${author_id}</span>
                    <span>${getTimeDifference(write_time)}</span>
                    </p>
                    </li>
                  `;
                  },
                )
                .join('')}
              </ul>
            <div class="modal_alarm_button-group">
              <button class="modal_alarm-ok">확인</button>
            </div>
          </div>
        `
    }
  `;
  }

  setEvent() {
    this.addEvent('click', '.modal_close-button', () => {
      this.$target.close();
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_alarm-ok', () => {
      this.$target.close();
      SideStore.setCurModal('');
    });

    this.addEvent('click', 'ul', (event) => this.handleSidebarClick(event));
  }

  handleSidebarClick(e) {
    const li = e.target.closest('li');
    if (!li) return;
    ContentStore.setSelectPostId(li.dataset.tab);
    SideStore.setCurModal('detail');
  }
}

export default Post;
