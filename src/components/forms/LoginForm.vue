<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const senha = ref('')
const mensagem = ref('')
const usuarioLogado = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('/me', { withCredentials: true })
    if (response.data) {
      localStorage.setItem('usuario', JSON.stringify(response.data))
      usuarioLogado.value = response.data
      redirecionarPorTipo(response.data.tipo)
    }
  } catch (error) {}
})

const login = async () => {
  try {
    const response = await api.post(
      '/login',
      {
        email: email.value,
        senha: senha.value,
      },
      { withCredentials: true }
    )

    usuarioLogado.value = response.data.usuario
    localStorage.setItem('usuario', JSON.stringify(response.data.usuario))
    redirecionarPorTipo(usuarioLogado.value.tipo)
  } catch (error) {
    mensagem.value = error.response?.data?.mensagem || 'Erro ao tentar logar'
  }
}

const redirecionarPorTipo = (tipo) => {
  if (tipo === 2) {
    router.push('/admin/dashboard')
  } else {
    router.push('/vereador/dashboard')
  }
}

const logout = async () => {
  try {
    await api.post('/logout', {}, { withCredentials: true })
    usuarioLogado.value = null
    localStorage.removeItem('usuario')
    router.push('/login')
  } catch {
    mensagem.value = 'Erro ao sair'
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
          <input v-model="senha" type="password" placeholder="Digite sua senha" required />

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