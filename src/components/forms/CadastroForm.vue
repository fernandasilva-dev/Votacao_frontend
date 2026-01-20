<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const nome = ref('')
const cpf = ref('')
const email = ref('')
const senha = ref('')
const partido_id = ref('')
const mensagem = ref('')

const partidos = ref([])

onMounted(async () => {
  try {
    const response = await api.get('/partidos')
    partidos.value = response.data
  } catch (error) {
    console.error('Erro ao buscar partidos:', error)
  }
})

const cadastrar = async () => {
  try {
    const partidoSelecionado = partido_id.value ? partido_id.value : null

    const response = await api.post('/usuarios', {
      nome: nome.value,
      cpf: cpf.value,
      email: email.value,
      senha: senha.value,
      partido_id: partidoSelecionado,
    })

    mensagem.value = response.data.mensagem || 'Vereador cadastrado com sucesso!'

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
      <h2 class="title-cor">Cadastrar Vereador</h2>

      <div class="auth-form">
        <form @submit.prevent="cadastrar">
          <p>Nome</p>
          <input v-model="nome" type="text" placeholder="Digite seu nome" required />

          <p>CPF</p>
          <input v-model="cpf" type="text" placeholder="Digite seu CPF" required />

          <p>Email</p>
          <input v-model="email" type="email" placeholder="exemplo@gmail.com" required />

          <p>Partido</p>
          <select v-model="partido_id">
            <option value="">Sem partido (Administrador)</option>

            <option v-for="p in partidos" :key="p.id" :value="p.id">
              {{ p.nome }}
            </option>
          </select>

          <p>Senha</p>
          <input
            type="password"
            v-model="senha"
            placeholder="Digite sua senha"
          />
          <ul class="senha-requisitos">
            <li :class="{ ok: senha.length >= 8 }">• Mínimo 8 caracteres</li>
            <li :class="{ ok: /[A-Z]/.test(senha) }">• 1 letra maiúscula</li>
            <li :class="{ ok: /[0-9]/.test(senha) }">• 1 número</li>
            <li :class="{ ok: /[^A-Za-z0-9]/.test(senha) }">• 1 símbolo (ex: ! @ # $ % & *)</li>
          </ul>

          <button type="submit" class="button">Cadastrar</button>

          <p class="mensagem" v-if="mensagem">{{ mensagem }}</p>
        </form>
      </div>
    </div>
  </div>
</template>