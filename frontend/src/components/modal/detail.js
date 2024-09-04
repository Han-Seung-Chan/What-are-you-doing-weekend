import Component from '../../core/component.js';
import ContentStore from '../../store/contentStore.js';
import SideStore from '../../store/sideStore.js';

class Detail extends Component {
  setup() {
    this.$state = {
      selectId: ContentStore.getSelectPostId(),
      commentList: [],
      reviewList: [],
      isAuthor: false,
      isParticipate: false,
      isTimeDone: false,
    };
  }

  template() {
    return `
  <div class="modal_detail">
    <button class="modal_close-button-detail">x</button>
    <h1>상세</h1>
    <div class="modal_detail-content">
    <div class="modal_detail-row">
      <label class="modal_detail-label">제목:</label>
      <span class="modal_detail-value">모임 안내</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">일정:</label>
      <span class="modal_detail-value">9월 27일</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">내용:</label>
      <span class="modal_detail-value">모임에 대한 상세 내용이 여기에 표시됩니다.</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">작성자:</label>
      <span class="modal_detail-value">'김승기'</span>
    </div>
    <div class='modal_detail_button-group'>
      ${
        true
          ? `
            <button class='modal_detail-delete'>삭제</button>
            <button class='modal_detail-edit'>수정</button>
        `
          : `<button class='modal_detail-ok'>참여하기</button>`
      }
    </div>
    </div>
  
    <div class="toggle_buttons">
      <button class="toggle_button active">댓글</button>
      <button class="toggle_button">리뷰</button>
    </div>

    <div class="comment_section">
      <h2>댓글</h2>
      <ul class="comment_list">
        <li class="comment_item">유저1: 재미있겠네요!</li>
        <li class="comment_item">유저2: 저도 참여하고 싶습니다!</li>
      </ul>
    </div>

    <div class="review_section">
      <h2>리뷰</h2>
      <ul class="review_list">
        <li class="review_item">리뷰1: 모임이 유익했습니다!</li>
        <li class="review_item">리뷰2: 다시 참여하고 싶어요!</li>
      </ul>
    </div>

    <div class="comment_input">
      <input type="text" placeholder="댓글을 입력하세요..." class="comment_input_field" />
      <button class="comment_submit_button">등록</button>
    </div>

    <div class="review_input">
      <input type="text" placeholder="리뷰을 입력하세요..." class="review_input_field" />
      <button class="review_submit_button">등록</button>
    </div>


    <div class="modal_detail_button-group">
      <button class="modal_detail-ok">확인</button>
    </div>
  </div>
`;
  }

  setEvent() {
    this.addEvent('click', '.modal_close-button-detail', () => {
      this.$target.close();
      SideStore.setCurModal('');
      ContentStore.setSelectPostId('');
      this.destroy();
    });

    this.addEvent('click', '.modal_detail-ok', () => {
      this.$target.close();
      SideStore.setCurModal('');
      ContentStore.setSelectPostId('');
      this.destroy();
    });
  }
}

export default Detail;
