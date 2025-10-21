<script setup>
import { ref } from 'vue'
import api from '../../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const senha = ref('')
const mensagem = ref('')

const usuarioLogado = ref(JSON.parse(localStorage.getItem('usuarioLogado')) || null)

const login = async () => {
  try {
    const response = await api.get('/login', {
      params: {
        email: email.value,
        senha: senha.value
      }
    })

    localStorage.setItem('usuarioLogado', JSON.stringify(response.data))
    usuarioLogado.value = response.data

    mensagem.value = response.data.message || 'Login realizado com sucesso!'

    router.push('/dashboard')
  } catch (error) {
    mensagem.value = error.response?.data?.message || 'Erro ao tentar logar'
  }
}

const logout = () => {
  localStorage.removeItem('usuarioLogado')
  usuarioLogado.value = null
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-content">
      <h2 class="title">Login</h2>

      <div class="auth-form">
        <div v-if="usuarioLogado">
          <p>Bem-vindo, {{ usuarioLogado.nome }}!</p>
          <button class="button" @click="logout">Sair</button>
        </div>

        <!-- Formulário de login -->
        <form v-else @submit.prevent="login">
          <p>Email</p>
          <input v-model="email" type="email" placeholder="exemplo@gmail.com" required />

          <p>Senha</p>
          <input v-model="senha" type="password" placeholder="Digite sua senha" required />

          <button type="submit" class="button">Entrar</button>
        </form>

        <p class="link" v-if="!usuarioLogado">
          <router-link to="/cadastro">Não tem uma conta? Cadastre-se</router-link>
        </p>

        <p class="mensagem" v-if="mensagem">{{ mensagem }}</p>
      </div>
    </div>
  </div>
</template>