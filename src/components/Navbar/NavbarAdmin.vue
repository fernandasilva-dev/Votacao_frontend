<template>
  <aside class="sidebar">

    <nav class="menu">
      <router-link to="/admin/dashboard" class="menu-item" active-class="active">
        <img src="../../assets/images/votar.png" alt="" class="menu-icon">
        <span>Votações</span>
      </router-link>

      <router-link to="/admin/cadastrar-partido" class="menu-item" active-class="active">
        <img src="../../assets/images/meuprojeto.png" alt="" class="menu-icon">
        <span>Gerenciar Partidos</span>
      </router-link>
      
      <router-link to="/admin/cadastrar-projeto" class="menu-item" active-class="active">
        <img src="../../assets/images/projeto.png" alt="" class="menu-icon">
        <span>Cadastrar Projeto</span>
      </router-link>

      <router-link to="/admin/aprovar-projeto" class="menu-item" active-class="active">
        <img src="../../assets/images/meuprojeto.png" alt="" class="menu-icon">
        <span>Projetos em Análise</span>
      </router-link>
    </nav>

    <div class="profile-section">
      <transition name="fade">
        <button v-if="showLogout" class="logout-dropdown" @click="logout" aria-label="Sair">
          <span>Sair</span>
        </button>
      </transition>

      <div class="menu-item profile-menu" @click="toggleLogout" role="button" tabindex="0">
        <img src="../../assets/images/perfil.png" alt="perfil" class="menu-icon" />
        <span>Perfil Administrador</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'

const router = useRouter()
const showLogout = ref(false)

const toggleLogout = () => {
  showLogout.value = !showLogout.value
}

const logout = async () => {
  try {
    await api.post('/logout')
    localStorage.removeItem('usuarioLogado')
    router.push('/login')
  } catch (err) {
    console.error('Erro ao sair:', err)
    alert('Erro ao sair. Tente novamente.')
  }
}
</script>