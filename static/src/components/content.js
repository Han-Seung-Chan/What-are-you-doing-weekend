import Component from '../core/component.js';
import ContentStore from '../store/contentStore.js';
import DetailStore from '../store/detailStore.js';
import SideStore from '../store/sideStore.js';

import { getTimeDifference } from '../utils/getTimeDifference.js';

class Contents extends Component {
  setup() {
    this.$state = {
      contentsData: ContentStore.getContents(),
    };
    ContentStore.subscribe('contentsData', this);
  }

  template() {
    return `
    <ul class="content_container">
    ${
      this.$state.contentsData.length === 0
        ? ''
        : this.$state.contentsData
            .map(
              ({ post_id, title, scheduled_time, write_time, author_id }) => {
                return `
        <li class="content_box" data-tab="${post_id}">
          <h1 class="content_title">${title}</h1>
          <p class="content_text_group">
          <span>${scheduled_time}</span>
          <span>${author_id}</span>
          <span>${getTimeDifference(write_time)}</span>
          </li>
        `;
              },
            )
            .join('')
    }
    </ul>
`;
  }

  setEvent() {
    this.addEvent('click', 'ul', (event) => this.handleSidebarClick(event));
  }

  async handleSidebarClick(e) {
    const li = e.target.closest('li');
    if (!li) return;
    await DetailStore.setDetailPost(li.dataset.tab);
    DetailStore.setSelectId(li.dataset.tab);
    SideStore.setCurModal('detail');
  }
}

export default Contents;
