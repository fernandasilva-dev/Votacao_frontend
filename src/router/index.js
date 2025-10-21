import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Auth/LoginView.vue'
import CadastroView from '../views/Auth/CadastroView.vue'
import DashboardVereador from '../views/Veredador/DashboardVereador.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastro', name: 'Cadastro', component: CadastroView },

  {
    path: '/vereador',
    component: DashboardVereador,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'Votacoes', component: () => import('../views/Veredador/Votacoes.vue') },
      { path: 'cadastrar-projeto', name: 'CadastrarProjeto', component: () => import('../views/Veredador/CadastrarProjeto.vue') },
    ]
  },

  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router