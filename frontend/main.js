import MainPage from '/src/pages/mainPage.js';
import { initStore } from '/src/store/index.js';
import { $ } from '/src/utils/selector.js';

const main = async () => {
  await initStore();
  new MainPage($('#app'));
};

main();
