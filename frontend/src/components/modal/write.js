import Component from '/src/core/component.js';

import SideStore from '../../store/sideStore.js';

import { $ } from '/src/utils/selector.js';

class Write extends Component {
  setup() {
    this.$state = {};
    SideStore.subscribe('curModal', this);
  }

  template() {
    return `
      <div class="modal_write">
        <h1>글 작성하기</h1>
        <div class="modal_write_text-box">
          <div class="modal_write_text-div">       
            <label for="modal_write_title-id" class="modal_write_title">제목 : </label>
            <input type="text" id="modal_write_title-id" placeholder="제목을 입력하세요"/>
          </div>
          <div class="modal_write_text-div">       
            <label for="modal_write_date-id" class="modal_write_date">시간 : </label>
            <input type="date" id="modal_write_date-id" />
          </div>
          <div class="modal_write_text-div"> 
            <label for="modal_write_description-id" class="modal_write_description">내용 : </label>
            <textarea id="modal_write_description-id" placeholder="내용을 입력해주세요."></textarea>
          </div>  
          <div>
            <div class="modal_write_button-group">
              <button class="modal_write_cancel">취소</button>
              <button class="modal_write_submit">작성</button>
          </div>
          </div>
        </div>
      </div>
`;
  }

  setEvent() {
    this.addEvent('click', '.modal_write_cancel', () => {
      this.$target.close();
      SideStore.setCurModal('');
      this.destroy();
    });

    this.addEvent('click', '.modal_write_submit', () => {
      const titleInputValue = $('#modal_write_title-id').value;
      const dateInputValue = $('#modal_write_date-id').value;
      const descriptionInputValue = $('#modal_write_description-id').value;

      console.log(titleInputValue);
      console.log(dateInputValue);
      console.log(descriptionInputValue);

      this.$target.close();
      SideStore.setCurModal('');
      this.destroy();
    });
  }
}

export default Write;
