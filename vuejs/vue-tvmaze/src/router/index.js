import {createRouter, createWebHistory} from 'vue-router';
import ShowList from '../components/ShowList.vue';
import Show from '../components/Show.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'showList',
      component: ShowList
    },
    {
      path: '/show/:id',
      name: 'show',
      component: Show
    }
  ]
});

export default router;
