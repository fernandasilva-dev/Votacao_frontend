import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Auth/LoginView.vue'
import CadastroView from '../views/Auth/CadastroView.vue'
import DashboardVereador from '../views/Vereador/DashboardVereador.vue'
import DashboardAdmin from '../views/Admin/DashboardAdmin.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastro', name: 'Cadastro', component: CadastroView },

  {
    path: '/vereador',
    component: DashboardVereador,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'Votacoes', component: () => import('../views/Vereador/Votacoes.vue') },
      { path: 'cadastrar-projeto', name: 'CadastrarProjeto', component: () => import('../views/Vereador/CadastrarProjeto.vue') },
    ]
  },
  {
    path: '/admin',
    component: DashboardAdmin,
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'VotacoesAdmin', component: () => import('../views/Admin/Votacoes.vue') },
      { path: 'cadastrar-partido', name: 'AdminCadastrarPartido', component: () => import('../views/Admin/CadastrarPartido.vue') },
    ]
  },

  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router