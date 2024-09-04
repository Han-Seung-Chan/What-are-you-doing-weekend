import Component from '../core/component.js';
import Header from '../components/header.js';
import Content from '../components/content.js';
import Side from '../components/side.js';

import SideStore from '../store/sideStore.js';

import { $ } from '../utils/selector.js';
import Detail from '../components/detail.js';
import Alarm from '../components/alarm.js';
import Write from '../components/write.js';
import Post from '../components/post.js';
import Join from '../components/join.js';

class MainPage extends Component {
  setup() {
    SideStore.subscribe('curModal', this);
  }

  mounted() {
    new Header($('.header_wrapper'));
    new Side($('.aside_wrapper'));

    const curTab = SideStore.getCurModal();
    if (curTab === 'detail') new Detail($('.content_wrapper'));
    else if (curTab === 'alarm') new Alarm($('.content_wrapper'));
    else if (curTab === 'write') new Write($('.content_wrapper'));
    else if (curTab === 'post') new Post($('.content_wrapper'));
    else if (curTab === 'participation') new Join($('.content_wrapper'));
    else new Content($('.content_wrapper'));
  }

  template() {
    return `
    <header class="header_wrapper"></header>
    <aside class="aside_wrapper"></aside>
    <main class="content_wrapper"></main>
    `;
  }
}
export default MainPage;
