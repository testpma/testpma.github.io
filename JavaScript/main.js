
hidePanel();
fetchData();
initializeFilters();

import Vue from 'vue';
import App from './App.vue';
import router from './router'; // Import the router configuration

Vue.config.productionTip = false;

new Vue({
  router, // Attach the router to the Vue instance
  render: h => h(App),
}).$mount('#app');



