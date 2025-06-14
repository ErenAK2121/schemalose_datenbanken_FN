import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth } from './authGuard'
import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: 'home',
      redirect: '/login'
    },
    {
      path: "/register",
      name: 'register',
      component: RegisterView
    },
    {
      path: "/login",
      name: 'login',
      component: LoginView
    }
  ],
})

export default router