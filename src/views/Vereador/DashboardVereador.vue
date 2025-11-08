<template>
  <div class="navbar-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
  import Navbar from '../../components/Navbar/NavbarVereador.vue'
</script>