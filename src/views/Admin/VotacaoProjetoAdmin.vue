<script setup>
import { useRoute } from 'vue-router'
import VotarProjeto from '../../components/votacoes/VotarProjeto.vue'

const route = useRoute()
</script>

<template>
  <div class="home-container">
    <h1 class="fullscreen-title">Projeto</h1>
    <VotarProjeto :projetoId="route.params.id" />
  </div>
</template>
