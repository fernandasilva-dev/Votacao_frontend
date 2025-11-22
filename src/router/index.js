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
    meta: {requiresAuth: true, role: 'vereador'},
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'Votacoes', component: () => import('../views/Vereador/Votacoes.vue') },
      { path: 'profile-vereador', name: 'ProfileVereador', component: () => import('../views/Vereador/ProfileVereador.vue') },
    ]
  },
  {
    path: '/admin',
    component: DashboardAdmin,
    meta: {requiresAuth: true, role: 'admin'},
    children: [
      { path: '', redirect: 'dashboard' },
      { path: 'dashboard', name: 'VotacoesAdmin', component: () => import('../views/Admin/Votacoes.vue') },
      { path: 'cadastrar-partido', name: 'AdminCadastrarPartido', component: () => import('../views/Admin/CadastrarPartido.vue') },
      { path: 'aprovar-projeto', name: 'AprovacaoAdmin', component: () => import('../views/Admin/AprovacaoAdmin.vue')},
      { path: 'cadastrar-projeto', name: 'CadastrarProjeto', component: () => import('../views/Admin/CadastrarProjeto.vue') },
      { path: 'profile-admin', name: 'ProfileAdmin', component: () => import('../views/Admin/ProfileAdmin.vue') },
    ]
  },

  { path: '/', redirect: '/login' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const usuario = JSON.parse(localStorage.getItem('usuario'))

  if (to.meta.requiresAuth && !usuario) {
    return next('/login')
  }

  const tipoMap = {
    1: 'vereador',
    2: 'admin'
  }

  if (to.meta.role && tipoMap[usuario?.tipo] !== to.meta.role) {
    return next('/login')}
  next()
})


export default router