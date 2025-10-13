import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Auth/LoginView.vue'
import CadastroView from '../views/Auth/CadastroView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastro', name: 'Cadastro', component: CadastroView },
  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router