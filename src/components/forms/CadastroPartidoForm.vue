<script setup>
import { ref } from 'vue'
import api from '../../services/api.js'

const nome = ref('')
const sigla = ref('')
const mensagem = ref('')

const cadastrarPartido = async () => {
  try {
    const response = await api.post('/partidos', {
      nome: nome.value,
      sigla: sigla.value
    }, { withCredentials: true })

    mensagem.value = response.data.mensagem || 'Partido cadastrado com sucesso!'
    nome.value = ''
    sigla.value = ''
    
  } catch (error) {
    mensagem.value = error.response?.data?.mensagem || 'Erro ao cadastrar partido.'
  }
}
</script>

<template>
  <div class="projeto-container">
    <div class="projeto-content">
      <div class="projeto-form">
        <form @submit.prevent="cadastrarPartido">

          <p>Nome do Partido</p>
          <input v-model="nome" type="text" placeholder="Digite o nome do partido" required />

          <p>Sigla</p>
          <input v-model="sigla" type="text" placeholder="Digite a sigla" required />

          <button type="submit" class="projeto-button">Cadastrar</button>

          <p class="projeto-mensagem" v-if="mensagem">{{ mensagem }}</p>
        </form>
      </div>
    </div>
  </div>
</template>