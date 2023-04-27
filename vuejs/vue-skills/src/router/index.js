import {createRouter, createWebHistory} from 'vue-router';
import Skills from '../components/Skills.vue';
import About from '../components/About.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'skills',
      component: Skills
    },
    {
      path: '/about/:name?',
      name: 'about',
      component: About
    }
  ]
});

export default router;
