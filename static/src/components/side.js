import Component from '../core/component.js';
import SideStore from '../store/sideStore.js';

import { sideTabList } from '../constants/sideTabList.js';

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

  handleSidebarClick(e) {
    const li = e.target.closest('li');
    if (!li) return;
    SideStore.setCurModal(li.dataset.tab);
  }
}

export default Header;
