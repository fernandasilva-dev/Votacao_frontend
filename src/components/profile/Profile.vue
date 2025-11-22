<template>
  <div class="projeto-container">
    <div v-if="mensagemGlobal" class="mensagem-global">
      {{ mensagemGlobal }}
    </div>

    <div class="projeto-content">
      <div class="auth-form">
        <img class="image" src="../../assets/images/meuperfil.png" alt="icon perfil">

        <p>Nome</p>
        <div class="linha">
          <input type="text" v-model="usuario.nome" />
          <button class="button-mini" @click="salvarNome">Salvar</button>
        </div>

        <p>Email</p>
        <div class="linha">
          <input type="email" :value="usuario.email" disabled class="blocked" />
          <button class="button-mini" @click="abrirEmail = true">Alterar</button>
        </div>

        <p>Senha</p>
        <div class="linha">
          <input type="password" value="********" disabled class="blocked" />
          <button class="button-mini" @click="abrirSenha = true">Alterar</button>
        </div>

        <p>CPF</p>
        <input type="text" :value="usuario.cpf" disabled class="blocked" />

        <p>Tipo</p>
        <input
          type="text"
          :value="usuario.tipo === 2 ? 'Administrador' : 'Vereador'"
          disabled
          class="blocked"
        />

        <p>Partido</p>
        <input
          type="text"
          :value="usuario.partido ? usuario.partido.sigla : 'Não vinculado'"
          disabled
          class="blocked"
        />
      </div>
    </div>
  </div>

  <div v-if="abrirEmail" class="overlay">
    <div class="popup auth-form">
      <h3 class="title">Alterar Email</h3>

      <p>Novo Email</p>
      <input type="email" v-model="novoEmail" class="form-input" />

      <p>Confirmar Novo Email</p>
      <input type="email" v-model="confirmarEmail" class="form-input" />

      <button class="form-button" @click="salvarEmail">Salvar Email</button>
      <button class="btn-fechar" @click="abrirEmail = false">Cancelar</button>

      <p class="mensagem erro" v-if="mensagemEmail">{{ mensagemEmail }}</p>
    </div>
  </div>

  <div v-if="abrirSenha" class="overlay">
    <div class="popup auth-form">
      <h3 class="title">Alterar Senha</h3>

      <p>Senha Atual</p>
      <input type="password" v-model="senhaAtual" class="form-input" />

      <p>Nova Senha</p>
      <input type="password" v-model="senhaNova" class="form-input" />

      <ul class="senha-requisitos">
        <li :class="{ ok: senhaNova.length >= 8 }">• Mínimo 8 caracteres</li>
        <li :class="{ ok: /[A-Z]/.test(senhaNova) }">• 1 letra maiúscula</li>
        <li :class="{ ok: /[0-9]/.test(senhaNova) }">• 1 número</li>
        <li :class="{ ok: /[^A-Za-z0-9]/.test(senhaNova) }">• 1 símbolo</li>
      </ul>

      <button class="form-button" @click="salvarSenha">Salvar Senha</button>
      <button class="btn-fechar" @click="abrirSenha = false">Cancelar</button>

      <p class="mensagem erro" v-if="mensagemSenha">{{ mensagemSenha }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'

const usuario = ref({})
const abrirEmail = ref(false)
const abrirSenha = ref(false)

const novoEmail = ref("")
const confirmarEmail = ref("")
const mensagemEmail = ref("")

const senhaAtual = ref("")
const senhaNova = ref("")
const mensagemSenha = ref("")

const mensagemGlobal = ref("")

const mostrarMensagemGlobal = (msg) => {
  mensagemGlobal.value = msg
  setTimeout(() => mensagemGlobal.value = "", 3000)
}

const carregarPerfil = async () => {
  try {
    const resp = await api.get('/me')
    usuario.value = resp.data

    const respPartidos = await api.get('/partidos')
    const partidos = respPartidos.data

    usuario.value.partido = usuario.value.partido_id
      ? partidos.find(p => p.id === usuario.value.partido_id)
      : null

  } catch (error) {
    console.error("Erro ao carregar perfil:", error)
  }
}

const salvarNome = async () => {
  try {
    await api.put(`/usuarios/${usuario.value.id}`, {
      nome: usuario.value.nome
    })
    mostrarMensagemGlobal("Nome atualizado com sucesso!")

  } catch (error) {
    console.error("Erro ao atualizar nome:", error)
    mostrarMensagemGlobal("Erro ao atualizar nome.")
  }
}

const salvarEmail = async () => {
  mensagemEmail.value = ""

  if (novoEmail.value !== confirmarEmail.value) {
    mensagemEmail.value = "Os emails não coincidem."
    return
  }

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!regexEmail.test(novoEmail.value)) {
    mensagemEmail.value = "Formato de email inválido."
    return
  }

  try {
    await api.put(`/usuarios/${usuario.value.id}`, {
      email: novoEmail.value
    })

    usuario.value.email = novoEmail.value
    abrirEmail.value = false
    mostrarMensagemGlobal("Email alterado com sucesso!")

    novoEmail.value = ""
    confirmarEmail.value = ""

  } catch (error) {
    mensagemEmail.value = error.response?.data?.mensagem || "Erro ao atualizar email."
  }
}

const salvarSenha = async () => {
  mensagemSenha.value = ""

  try {
    await api.put(`/usuarios/${usuario.value.id}`, {
      senhaAtual: senhaAtual.value,
      senhaNova: senhaNova.value
    })

    abrirSenha.value = false
    mostrarMensagemGlobal("Senha alterada com sucesso!")

    senhaAtual.value = ""
    senhaNova.value = ""

  } catch (error) {
    mensagemSenha.value = error.response?.data?.mensagem || "Erro ao atualizar senha."
  }
}

onMounted(() => {
  carregarPerfil()
})
</script>


<style scoped>
.sucesso {
  background-color: #d4f7d4;
  color: #1b6e1b;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  margin-bottom: 15px;
  font-weight: bold;
  border: 1px solid #8fd78f;
}

.linha {
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-mini {
  background-color: #1e50b5;
  color: white;
  padding: 10px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.button-mini:hover {
  background-color: #163f93;
}

.blocked {
  background-color: #e4e4e4;
  cursor: not-allowed;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
  z-index: 999;
}

.popup {
    position: fixed;
  top: 20%;
  left: 43%;
  background: #ffffff;
  width: 90%;
  max-width: 450px;
  padding: 25px 30px;
  border-radius: 16px;
  box-shadow: 0px 6px 16px rgba(0,0,0,0.25);
  animation: popupShow 0.18s ease-out;
  display: flex;
  flex-direction: column;
}

.popup h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  color: #1e50b5;
  font-size: 20px;
}

@keyframes popupShow {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.erro {
  color: #d63031;
  margin-top: 8px;
  text-align: center;
  font-weight: bold;
}
.form-input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  font-size: 1rem;
}

.form-input:focus {
  border-color: #1e50b5;
  box-shadow: 0 0 3px rgba(30, 80, 181, 0.4);
}

.form-button {
  width: 101%;
  padding: 10px;
  margin-top: 15px;
  background-color: #1e50b5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.form-button:hover {
  background-color: #163f93;
}

.btn-fechar {
  width: 101%;
  padding: 10px;
  margin-top: 15px;
  background-color: #838383;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-fechar:hover {
  background-color: #666666;
}

.image {
  display: block;
  margin: 0 auto 20px auto;
}
</style>