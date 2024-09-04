import HeaderStore from './headerStore.js';
import ContentStore from './contentStore.js';
import SideStore from './sideStore.js';
import AlarmStore from './alarmStore.js';

export const initStore = async () => {
  HeaderStore.init();
  SideStore.init();
  await ContentStore.init();
  await AlarmStore.init();
};
