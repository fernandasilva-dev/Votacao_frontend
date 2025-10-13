<script setup>
import { ref } from 'vue'
import axios from 'axios'

const nome = ref('')
const cpf = ref('')
const email = ref('')
const senha = ref('')
const partido = ref('')
const mensagem = ref('')

const partidos = [
  'Avante', 'Cidadania', 'DC', 'MDB', 'Mobiliza', 'Novo', 'Patriota',
  'PCdoB', 'PCB', 'PCO', 'PDT', 'PL', 'PMB', 'PMN', 'PODE', 'PP', 'PRTB',
  'PSB', 'PSC', 'PSD', 'PSDB', 'PSOL', 'PSTU', 'PT', 'PTB', 'PV', 'REDE',
  'Solidariedade', 'UP', 'UNIÃO'
]

const cadastrar = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/cadastro', {
      nome: nome.value,
      cpf: cpf.value,
      email: email.value,
      partido: partido.value,
      senha: senha.value
    })
    mensagem.value = response.data.message || 'Cadastro realizado com sucesso!'
    nome.value = ''
    cpf.value = ''
    email.value = ''
    senha.value = ''
    partido.value = ''
  } catch (error) {
    mensagem.value = error.response?.data?.message || 'Erro ao cadastrar.'
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
          <input v-model="nome" type="text" placeholder="exemplo@gmail.com" required />
          <p>CPF</p>
          <input v-model="cpf" type="text" placeholder="Digite sua senha aqui" required />
          <p>Email</p>
          <input v-model="email" type="email" placeholder="Digite sua senha aqui" required />
          <p>Partido</p>
          <select v-model="partido" required>
            <option disabled value="">Selecione um partido</option>
            <option v-for="p in partidos" :key="p">{{ p }}</option>
          </select>
          <p>Senha</p>
          <input v-model="senha" type="password" placeholder="Digite sua senha aqui" required />
          <button type="submit" class="button">Entrar</button>
          <p class="link">
            <router-link to="/login">Tem uma conta? Entre</router-link>
          </p>
          <p class="mensagem">{{ mensagem }}</p>
        </form>
      </div>
    </div>
  </div>
</template>