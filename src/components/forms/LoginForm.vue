<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const senha = ref('')
const mensagem = ref('')

const login = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/login', {
      email: email.value,
      senha: senha.value
    })
    mensagem.value = response.data.message || 'Login realizado com sucesso!'
    localStorage.setItem('token', response.data.token)
  } catch (error) {
    mensagem.value = error.response?.data?.message || 'Erro ao tentar logar'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-content">
      <h2 class="title">Login</h2>
      <div class="auth-form">
        <form @submit.prevent="login">
          <p>Email</p>
          <input v-model="email" type="email" placeholder="exemplo@gmail.com" required />
          <p>Senha</p>
          <input v-model="senha" type="password" placeholder="Digite sua senha aqui" required />
          <button type="submit" class="button">Entrar</button>
        </form>
        <p class="link">
          <router-link to="/cadastro">Não tem uma conta? Cadastre-se</router-link>
        </p>
        <p class="mensagem" v-if="mensagem">{{ mensagem }}</p>
      </div>
    </div>
  </div>
</template>