<script setup>
import { useRoute } from 'vue-router'
import ResultadoVotacao from '../../components/votacoes/ResultadoVotacao.vue'

const route = useRoute()
</script>

<template>
  <div class="home-container">
    <h1 class="fullscreen-title">Projeto</h1>
    <ResultadoVotacao :projetoId="route.params.id" />
  </div>
</template>
