<template>
  <button class="hamburger" @click="toggleSidebar">
    ☰
  </button>
  <aside class="sidebar" :class="{ open: sidebarOpen }">    <nav class="menu">
      <router-link to="/vereador/dashboard" class="menu-item" active-class="active">
        <img src="../../assets/images/votar.png" alt="" class="menu-icon">
        <span>Votações</span>
      </router-link>

      <router-link to="/vereador/meus-projetos" class="menu-item" active-class="active">
        <img src="../../assets/images/meuprojeto.png" alt="" class="menu-icon">
        <span>Meus Projetos</span>
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
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

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
  router.push('/vereador/profile-vereador')
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

.hamburger {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #0055ff;
  color: #fff;
  font-size: 26px;
  border: none;
  cursor: pointer;
  z-index: 1100;

  align-items: center;
  justify-content: center;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: -260px;
    width: 260px;
    height: 100dvh;
    transition: left 0.3s ease;
    z-index: 1000;
  }

  .sidebar.open {
    left: 0;
  }

  .hamburger {
    display: flex;
  }
}
</style>