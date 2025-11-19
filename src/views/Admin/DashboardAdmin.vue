<template>
  <div v-if="carregado" class="navbar-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../../components/Navbar/NavbarAdmin.vue' // ou vereador

const carregado = ref(false)

onMounted(() => {
  carregado.value = true
})
</script>