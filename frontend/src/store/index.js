import HeaderStore from '/src/store/headerStore.js';
import ContentStore from '/src/store/contentStore.js';
import SideStore from '/src/store/sideStore.js';
import AlarmStore from '/src/store/alarmStore.js';

export const initStore = async () => {
  HeaderStore.init();
  SideStore.init();
  await ContentStore.init();
  await AlarmStore.init();
};
