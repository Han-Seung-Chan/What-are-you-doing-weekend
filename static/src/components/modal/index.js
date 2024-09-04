import Component from '../../core/component.js';
import Alarm from './alarm.js';
import Detail from './Detail.js';
import Post from './post.js';
import Write from './write.js';

import SideStore from '../../store/sideStore.js';
import DetailStore from '../../store/detailStore.js';

class Modal extends Component {
  setup() {
    DetailStore.init();
    this.$state = {
      curModal: SideStore.getCurModal(),
    };
  }

  mounted() {
    if (!this.$state.curModal) return;

    switch (this.$state.curModal) {
      case 'alarm':
        new Alarm(this.$target);
        this.$target.showModal();
        break;

      case 'write':
        new Write(this.$target);
        this.$target.showModal();
        break;

      case 'post':
        new Post(this.$target, { tab: 'post' });
        this.$target.showModal();
        break;

      case 'participation':
        new Post(this.$target, { tab: 'join' });
        this.$target.showModal();
        break;

      case 'detail':
        new Detail(this.$target);
        this.$target.showModal();
        break;
    }
  }
}

export default Modal;
