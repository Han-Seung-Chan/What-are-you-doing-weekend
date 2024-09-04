import Component from '../core/component.js';
import CommentStore from '../store/commentStore.js';
import DetailStore from '../store/detailStore.js';
import SideStore from '../store/sideStore.js';
import ContentStore from '../store/contentStore.js';
import { getTimeDifference } from '../utils/getTimeDifference.js';
import { $ } from '../utils/selector.js';

class Detail extends Component {
  async setup() {
    this.$state = {
      selectId: DetailStore.getSelectPostId(),
      data: DetailStore.getDetailPost(),
    };
    DetailStore.subscribe('detailPost', this);
  }

  template() {
    const {
      author_id,
      description,
      participant,
      post_id,
      scheduled_time,
      title,
      write_time,
    } = this.$state.data;

    const isAuthor = false;

    return `
  <div class="modal_detail">
    <button class="modal_close-button-detail">x</button>
    <h1>상세</h1>
    <div class="modal_detail-content">
    <div class="modal_detail-row">
      <label class="modal_detail-label">제목 :</label>
      <span class="modal_detail-value">${title}</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">일정 :</label>
      <span class="modal_detail-value">${scheduled_time}</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">내용 :</label>
      <span class="modal_detail-value">${description}</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">작성자 :</label>
      <span class="modal_detail-value">${author_id}</span>
    </div>
    <div class="modal_detail-row">
      <label class="modal_detail-label">참여 인원 :</label>
      <span class="modal_detail-value">${participant.length}명</span>
    </div>
        <div class="modal_detail-row">
        <label class="modal_detail-label"></label>
      <span class="modal_detail-value">${getTimeDifference(write_time)}</span>
    </div>
    <div class='modal_detail_button-group'>
      ${
        isAuthor
          ? `
            <button class='modal_detail-delete'>삭제</button>
            <button class='modal_detail-edit'>수정</button>
        `
          : `
          <button class='modal_detail-cancel'>취소하기</button>
          <button class='modal_detail-enter'>참여하기</button>
          `
      }
    </div>
    </div>
  

        <div class="toggle_buttons">
          <button class="toggle_button toggle_button-comment active">댓글</button>
          <button class="toggle_button toggle_button-review">리뷰</button>
        </div>
        
          <div class="comment_section">
            <h2>댓글</h2>
            <ul class="comment_list">
              <li class="comment_item">유저1: 재미있겠네요!</li>
              <li class="comment_item">유저2: 저도 참여하고 싶습니다!</li>
            </ul>
          </div>
            <div class="comment_input">
          <input type="text" placeholder="댓글을 입력하세요..." class="comment_input_field" />
          <button class="comment_submit_button">등록</button>
        </div>

            <div class="review_section none">
            <h2>리뷰</h2>
            <ul class="review_list">
              <li class="review_item">리뷰1: 모임이 유익했습니다!</li>
              <li class="review_item">리뷰2: 다시 참여하고 싶어요!</li>
            </ul>
          </div>
          <div class="review_input none">
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
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_detail-ok', () => {
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_detail-delete', () => {
      ContentStore.deleteContent(this.$state.selectId);
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_detail-edit', () => {
      ContentStore.deleteContent(this.$state.selectId);
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.modal_detail-enter', () => {
      ContentStore.participate(this.$state.selectId);
      SideStore.setCurModal('');
    });

    this.addEvent('click', '.toggle_button-comment', () => {
      const commentButton = $('.toggle_button-comment');
      const commentSection = $('.comment_section');
      const commentInput = $('.comment_input');
      const reviewButton = $('.toggle_button-review');
      const reviewSection = $('.review_section');
      const reviewInput = $('.review_input');

      reviewButton.classList.remove('active');
      reviewSection.classList.add('none');
      reviewInput.classList.add('none');

      commentButton.classList.add('active');
      commentSection.classList.remove('none');
      commentInput.classList.remove('none');
    });

    this.addEvent('click', '.toggle_button-review', () => {
      const commentButton = $('.toggle_button-comment');
      const commentSection = $('.comment_section');
      const commentInput = $('.comment_input');

      const reviewButton = $('.toggle_button-review');
      const reviewSection = $('.review_section');
      const reviewInput = $('.review_input');

      reviewButton.classList.add('active');
      reviewSection.classList.remove('none');
      reviewInput.classList.remove('none');

      commentButton.classList.remove('active');
      commentSection.classList.add('none');
      commentInput.classList.add('none');
    });

    this.addEvent('click', '.comment_submit_button', () => {
      댓글작성;
    });
    this.addEvent('click', '.review_submit_button', () => {
      댓글작성;
    });
  }
}

export default Detail;
