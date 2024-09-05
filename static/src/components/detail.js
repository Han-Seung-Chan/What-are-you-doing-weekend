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
      detailPost: DetailStore.getDetailPost(),
      comment: CommentStore.getComment(),
      review: CommentStore.getReview(),
    };
    DetailStore.subscribe('detailPost', this);
    CommentStore.subscribe('comment', this);
    CommentStore.subscribe('review', this);
  }

  mounted() {
    console.log($('.review_submit_button'));
    if (!$('.review_submit_button')) return;
    if (!this.$state.detailPost.isOver) {
      $('.review_submit_button').setAttribute('disabled', true);
      $('.review_input_field').setAttribute('disabled', true);
    } else {
      $('.comment_submit_button').setAttribute('disabled', true);
      $('.comment_input_field').setAttribute('disabled', true);
    }
  }

  template() {
    const {
      description,
      participant,
      post_id,
      scheduled_time,
      title,
      author_id,
      write_time,
      isParti,
      isWriter,
      isOver,
    } = this.$state.detailPost;

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

    <div class='modal_detail_button-group'>
      ${
        isWriter
          ? `
            <button class='modal_detail-delete'>삭제</button>
        `
          : `
          ${
            isParti
              ? `
            <button class='modal_detail-cancel'>취소하기</button>
          `
              : `
          <button class='modal_detail-enter'>참여하기</button>
          `
          }
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
            ${
              this.$state.comment === 0
                ? ''
                : this.$state.comment
                    .map(({ author_id, commentDesc }) => {
                      return `
                <li class="comment_item">${author_id} : ${commentDesc}</li>
                `;
                    })
                    .join('')
            }
            </ul>
          </div>
            <div class="comment_input">
          <input type="text" placeholder="댓글을 입력하세요..." class="comment_input_field"  />
          <button class="comment_submit_button">등록</button>
        </div>

            <div class="review_section none">
            <h2>리뷰</h2>
            <ul class="review_list">
              ${this.$state.review
                .map(({ author_id, reviewDesc }) => {
                  return `
                      <li class="review_item">${author_id} : ${reviewDesc}</li>
                        `;
                })
                .join('')}
            </ul>
          </div>
          <div class="review_input none">
            <input type="text" placeholder="리뷰을 입력하세요..." class="review_input_field" />
            <button class="review_submit_button">등록</button>
          </div>
      </div>
      
    `;
  }

  setEvent() {
    this.addEvent('click', '.modal_detail-delete', () => {
      DetailStore.deleteContent(this.$state.selectId).then(() => {
        alert('삭제완료');
        SideStore.setCurModal('');
      });
    });

    this.addEvent('click', '.modal_detail-edit', () => {
      DetailStore.setSelectId(this.$state.selectId);
      SideStore.setCurModal('write');
    });

    this.addEvent('click', '.modal_detail-enter', async () => {
      await DetailStore.participate(this.$state.selectId).then(() => {
        alert('참여완료');
      });
    });

    this.addEvent('click', '.modal_detail-cancel', async () => {
      await DetailStore.participateCancel(this.$state.selectId).then(() => {
        alert('취소완료');
      });
    });

    this.addEvent('click', '.comment_submit_button', async () => {
      const commentDesc = $('.comment_input_field').value;
      const post_id = this.$state.detailPost.post_id;
      await CommentStore.postComment({ post_id, commentDesc });
    });

    this.addEvent('click', '.review_submit_button', async () => {
      const reviewDesc = $('.review_input_field').value;
      const post_id = this.$state.detailPost.post_id;
      await CommentStore.postReview({ post_id, reviewDesc });
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

    this.addEvent('click', '.modal_close-button-detail', () => {
      SideStore.setCurModal('');
    });
  }
}

export default Detail;
