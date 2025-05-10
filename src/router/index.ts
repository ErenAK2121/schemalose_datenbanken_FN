import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/register",
      name: 'register',
      component: RegisterView
    }
  ],
})

export default router
