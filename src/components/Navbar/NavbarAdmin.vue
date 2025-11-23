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
        <div v-if="showMenu" class="profile-dropdown">
          <button @click="abrirPerfil">Meu Perfil</button>
          <button @click="logout">Sair</button>
        </div>
      </transition>

      <div class="menu-item profile-button" @click="toggleMenu" role="button" tabindex="0">
        <img src="../../assets/images/perfil.png" alt="perfil" class="menu-icon" />
        <span>{{ usuario?.nome || "Usuário" }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api.js'

const router = useRouter()
const showMenu = ref(false)
const usuario = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('/me')
    usuario.value = response.data
  } catch (err) {
    console.error("Erro ao buscar usuário logado:", err)
    router.push('/login')
  }
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const abrirPerfil = () => {
  router.push('/admin/profile-admin')
}

const logout = async () => {
  try {
    await api.post('/logout')
    router.push('/login')
  } catch (err) {
    console.error('Erro ao sair:', err)
    alert('Erro ao sair. Tente novamente.')
  }
}
</script>

<style>
.profile-section {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 10px;
  position: relative;
  cursor: pointer;
}

.profile-dropdown {
  position: absolute;
  bottom: 70px;
  left: 20px;
  width: calc(100% - 40px);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.782);
  display: flex;
  flex-direction: column;
  z-index: 10;
  overflow: hidden;
}

.profile-dropdown button {
  padding: 12px 14px;
  border: none;
  text-align: left;
  cursor: pointer;
}

.profile-dropdown button:hover {
  background: #d3d3d3;
}
</style>