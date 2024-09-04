import Component from '../core/component.js';
import HeaderStore from '../store/headerStore.js';
import ContentStore from '../store/contentStore.js';
import SideStore from '../store/sideStore.js';

import { $ } from '../utils/selector.js';

class Header extends Component {
  setup() {
    this.$state = {
      curSortOrder: HeaderStore.getSortOrder(),
    };
  }

  template() {
    return `
    <div class="header_container">
        <h1>
          <a class="header_logo" href="">주말 뭐하지?</a>
        </h1>
        <div>
          <input type="text" id="searchInput" placeholder="검색어를 입력하세요" />
          <button id="searchButton">검색</button>
        </div>
        <div>
          <select name="sortOrder" id="header_sort">
            <option value="progressAppoint">진행중인 약속</option>
            <option value="closeAppoint">가까운 약속</option>
            <option value="completeAppoint">완료된 약속</option>
          </select>
        </div>
    </div>
    `;
  }

  setEvent() {
    this.addEvent('click', '#searchButton', () => {
      const searchInputValue = $('#searchInput').value;
      HeaderStore.setSortOrder(searchInputValue);
      ContentStore.setSearchContents(searchInputValue);
    });

    this.addEvent('change', '#header_sort', (event) => {
      const selectedValue = event.target.value;
      HeaderStore.setSortOrder(selectedValue);
      ContentStore.setSortContents(selectedValue);
    });

    this.addEvent('change', '.header_logo', () => {
      SideStore.setCurModal('');
    });
  }
}

export default Header;
