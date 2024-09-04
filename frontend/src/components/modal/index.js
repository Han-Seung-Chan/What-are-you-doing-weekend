import Component from '/src/core/component.js';
import Alarm from '/src/components/modal/alarm.js';
import Detail from '/src/components/modal/Detail.js';
import Post from '/src/components/modal/post.js';
import Write from '/src/components/modal/write.js';

import SideStore from '/src/store/sideStore.js';

class Modal extends Component {
  setup() {
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
