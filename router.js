import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Result from '@/views/Result.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'Home' }
  },
  {
    path: '/testpma.github.io/',
    name: 'Home',
    component: Home
  },
  {
    path: '/testpma.github.io/:queryParams(.*)',
    name: 'Result',
    component: Result,
    props: true
  }
];

const router = new VueRouter({
  routes,
  mode: 'history' // Use 'history' mode to remove '#' from URLs (requires server-side configuration)
});

export default router;
