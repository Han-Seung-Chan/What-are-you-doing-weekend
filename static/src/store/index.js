import HeaderStore from './headerStore.js';
import ContentStore from './contentStore.js';
import SideStore from './sideStore.js';
import AlarmStore from './alarmStore.js';
import CommentStore from './commentStore.js';
import DetailStore from './detailStore.js';

export const initStore = async () => {
  await ContentStore.init();
  HeaderStore.init();
  SideStore.init();
  CommentStore.init();
  DetailStore.init();
  await AlarmStore.init();
};
