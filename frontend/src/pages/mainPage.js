import Component from '/src/core/component.js';
import Header from '/src/components/header.js';
import Content from '/src/components/content.js';
import Side from '/src/components/side.js';
import Modal from '/src/components/modal/index.js';

import SideStore from '/src/store/sideStore.js';

import { $ } from '/src/utils/selector.js';

class MainPage extends Component {
  setup() {
    SideStore.subscribe('curModal', this);
  }

  mounted() {
    new Header($('.header_wrapper'));
    new Side($('.aside_wrapper'));
    new Content($('.content_wrapper'));
    new Modal($('.modal_wrapper'));
  }

  template() {
    return `
    <header class="header_wrapper"></header>
    <aside class="aside_wrapper"></aside>
    <main class="content_wrapper"></main>
    <dialog class="modal_wrapper"></dialog>
    `;
  }
}
export default MainPage;
