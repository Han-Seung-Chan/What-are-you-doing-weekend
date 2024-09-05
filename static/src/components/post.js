import Component from '../core/component.js';

import ContentStore from '../store/contentStore.js';
import DetailStore from '../store/detailStore.js';
import SideStore from '../store/sideStore.js';
import CommentStore from '../store/commentStore.js';

import { getTimeDifference } from '../utils/getTimeDifference.js';

class Post extends Component {
  setup() {
    this.$state = {
      contentsData: ContentStore.getContents(),
    };
  }

  template() {
    return `
      <div class="modal_post">
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
  `;
  }

  setEvent() {
    this.addEvent('click', '.modal_close-button', () => {
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_alarm-ok', () => {
      SideStore.setCurModal('');
    });

    this.addEvent('click', 'ul', (event) => this.handleSidebarClick(event));
  }

  async handleSidebarClick(e) {
    const li = e.target.closest('li');
    if (!li) return;
    DetailStore.setSelectId(li.dataset.tab);
    await DetailStore.setDetailPost(li.dataset.tab);
    await CommentStore.setComment(li.dataset.tab);

    SideStore.setCurModal('detail');
  }
}

export default Post;
