import Component from '../core/component.js';
import SideStore from '../store/sideStore.js';

import { sideTabList } from '../constants/sideTabList.js';
import { requestPOST } from '../api/fetchData.js';

class Header extends Component {
  template() {
    return ` 
        <div class="sidebar">
          <hr style="position: relative; top:100px; border: solid 1px black;">
          <ul class="nav_mobile">
            ${sideTabList
              .map(({ category, title }) => {
                return `
                    <li data-tab="${category}">
                    <div>
                      <button>
                        ${title}
                      </button>
                    </div>
                  </li>
                    `;
              })
              .join('')}
          </ul>
        </div>
    `;
  }

  setEvent() {
    this.addEvent('click', 'ul', (event) => this.handleSidebarClick(event));
  }

  async handleSidebarClick(e) {
    const li = e.target.closest('li');
    if (!li) return;
    if (li.dataset.tab !== 'logout') SideStore.setCurModal(li.dataset.tab);
    else {
      $.ajax({
        type: 'POST',
        url: '/api/logout',
        data: {},
        success() {
          window.location.reload();
        },
        error() {
          window.location.reload();
        },
      });
    }
  }
}

export default Header;
