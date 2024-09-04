import Component from '../core/component.js';
import Header from '../components/header.js';
import Content from '../components/content.js';
import Side from '../components/side.js';
import Modal from '../components/modal/index.js';

import SideStore from '../store/sideStore.js';

import { $ } from '../utils/selector.js';

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
