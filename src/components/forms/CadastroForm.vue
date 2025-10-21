<script setup>
import { ref } from 'vue'
import axios from 'axios'

const nome = ref('')
const cpf = ref('')
const email = ref('')
const senha = ref('')
const partido_id = ref('')
const mensagem = ref('')

const partidos = [
  { id: 1, nome: 'Avante' },
  { id: 2, nome: 'Cidadania' },
  { id: 3, nome: 'DC' },
  { id: 4, nome: 'MDB' },
  { id: 5, nome: 'Mobiliza' },
  { id: 6, nome: 'Novo' },
  { id: 7, nome: 'Patriota' },
  { id: 8, nome: 'PCdoB' },
  { id: 9, nome: 'PCB' },
  { id: 10, nome: 'PCO' },
  { id: 11, nome: 'PDT' },
  { id: 12, nome: 'PL' },
  { id: 13, nome: 'PMB' },
  { id: 14, nome: 'PMN' },
  { id: 15, nome: 'PODE' },
  { id: 16, nome: 'PP' },
  { id: 17, nome: 'PRTB' },
  { id: 18, nome: 'PSB' },
  { id: 19, nome: 'PSC' },
  { id: 20, nome: 'PSD' },
  { id: 21, nome: 'PSDB' },
  { id: 22, nome: 'PSOL' },
  { id: 23, nome: 'PSTU' },
  { id: 24, nome: 'PT' },
  { id: 25, nome: 'PTB' },
  { id: 26, nome: 'PV' },
  { id: 27, nome: 'REDE' },
  { id: 28, nome: 'Solidariedade' },
  { id: 29, nome: 'UP' },
  { id: 30, nome: 'UNIÃO' },
]

const cadastrar = async () => {
  try {
    const response = await api.post('/usuarios', {
      nome: nome.value,
      cpf: cpf.value,
      email: email.value,
      senha: senha.value,
      tipo: tipo.value,
      partido_id: partido_id.value
    })

    mensagem.value = response.data.mensagem || 'Cadastro realizado com sucesso!'
    nome.value = ''
    cpf.value = ''
    email.value = ''
    senha.value = ''
    partido_id.value = ''
  } catch (error) {
    mensagem.value = error.response?.data?.mensagem || 'Erro ao cadastrar.'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-content">
      <h2 class="title">Cadastro</h2>

      <div class="auth-form">
        <form @submit.prevent="cadastrar">
          <p>Nome</p>
          <input v-model="nome" type="text" placeholder="Digite seu nome" required />

          <p>CPF</p>
          <input v-model="cpf" type="text" placeholder="Digite seu CPF" required />

          <p>Email</p>
          <input v-model="email" type="email" placeholder="exemplo@gmail.com" required />

          <p>Partido</p>
          <select v-model="partido_id" required>
            <option disabled value="">Selecione um partido</option>
            <option v-for="p in partidos" :key="p.id" :value="p.id">{{ p.nome }}</option>
          </select>

          <p>Senha</p>
          <input v-model="senha" type="password" placeholder="Digite sua senha" required />

          <button type="submit" class="button">Cadastrar</button>

          <p class="link">
            <router-link to="/login">Tem uma conta? Entre</router-link>
          </p>

          <p class="mensagem" v-if="mensagem">{{ mensagem }}</p>
        </form>
      </div>
    </div>
  </div>
</template>