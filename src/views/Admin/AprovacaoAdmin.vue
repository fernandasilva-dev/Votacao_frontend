<template>
  <h1 class="fullscreen-title">Projetos em Análise</h1>

  <div class="home-container">
    <p v-if="projetos.length === 0" class="nenhum-projeto">
      Nenhum projeto cadastrado.
    </p>

    <div
      v-else
      v-for="projeto in projetos"
      :key="projeto.id"
      class="projeto-card">

      <div class="projeto-top">
        <div class="icon-column">
          <img src="../../assets/images/info.png" alt="Informações" class="info-icon" />
        </div>

        <div class="content-column">
          <h2 class="projeto-card-title">{{ projeto.titulo }}</h2>

          <div class="projeto-info">
            <p><b>Autor:</b> {{ projeto.autor }}</p>
            <p><b>Ementa:</b> {{ projeto.ementa }}</p>
            <p><b>Tipo:</b> {{ projeto.tipo }}</p>
            <p><b>Data:</b> {{ formatarData(projeto.dt_votacao) }}</p>
          </div>

          <p
            class="status-text"
            :class="projeto.estado === 1 
                      ? 'status-aberta' 
                      : projeto.estado === 0 
                        ? 'status-encerrada' 
                        : 'status-aguardando'"
            >
              {{
                projeto.estado === 1
                  ? 'Votação Aberta'
                  : projeto.estado === 0
                    ? 'Votação Encerrada'
                    : 'Aguardando Abertura'
              }}
          </p>


          <div class="botoes-container">
            <button
              class="button"
              :class="projeto.estado === 1 ? 'encerrar' : 'abrir'"
              @click="abrirModal(projeto)"
            >
              {{ projeto.estado === 1 ? 'Encerrar Votação' : 'Abrir Votação' }}
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>

  <div v-if="modalVisivel" class="overlay">
    <div class="popup auth-form">
      <h3 class="title">{{ modalTitulo }}</h3>

      <p class="texto-modal">{{ modalMensagem }}</p>

      <button class="form-button" @click="confirmarAlteracao">
        Confirmar
      </button>

      <button class="btn-fechar" @click="fecharModal">
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const projetos = ref([])

const modalVisivel = ref(false)
const modalProjeto = ref(null)
const modalTitulo = ref("")
const modalMensagem = ref("")
const novoEstado = ref(null)

const carregarProjetos = async () => {
  try {
    const response = await api.get('/projetos')
    projetos.value = response.data
  } catch (erro) {
    console.error('Erro ao carregar projetos:', erro)
  }
}

const abrirModal = (projeto) => {
  modalProjeto.value = projeto
  novoEstado.value = projeto.estado === 1 ? 0 : 1

  modalTitulo.value = projeto.estado === 1
    ? "Encerrar Votação"
    : "Abrir Votação"

  modalMensagem.value = projeto.estado === 1
    ? "Tem certeza que deseja ENCERRAR a votação deste projeto?"
    : "Tem certeza que deseja ABRIR a votação deste projeto?"

  modalVisivel.value = true
}

const fecharModal = () => {
  modalVisivel.value = false
}

const confirmarAlteracao = async () => {
  try {
    await api.put(`/projetos/${modalProjeto.value.id}`, {
      ...modalProjeto.value,
      estado: novoEstado.value
    })

    modalProjeto.value.estado = novoEstado.value

  } catch (erro) {
    console.error("Erro ao alterar estado:", erro)
  }

  fecharModal()
}

const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR')

onMounted(carregarProjetos)
</script>

<style scoped>
.status-aguardando { color: #e39d00; font-weight: 600; }
.status-aberta { color: #1e7f3c; font-weight: 600; }
.status-encerrada { color: #c62828; font-weight: 600; }

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(3px);
  z-index: 999;
}

.popup {
  background: #fff;
  width: 92%;
  max-width: 450px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.25);
  animation: popupShow 0.2s ease;
}

@keyframes popupShow {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.title {
  text-align: center;
  color: #1e50b5;
  margin-bottom: 12px;
  font-size: 1.35rem;
}

.texto-modal {
  text-align: center;
  font-size: 1rem;
}

.form-button,
.btn-fechar {
  width: 100%;
  margin-top: 14px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.form-button { background: #1e50b5; color: #fff; }
.form-button:hover { background: #163f93; }

.btn-fechar { background: #8a8a8a; color: #fff; }
.btn-fechar:hover { background: #6d6d6d; }

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.fullscreen-title {
  font-size: 2rem;
  color: #1e50b5;
  margin-bottom: 1.5rem;
  text-align: center;
}

.projeto-card {
  width: 100%;
  max-width: 1000px;
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  transition: transform 0.2s ease;
}

.projeto-card:hover {
  transform: translateY(-3px);
}

.projeto-top {
  display: flex;
  gap: 1rem;
}

.icon-column {
  flex-shrink: 0;
}

.info-icon {
  width: 26px;
  height: 26px;
}

.content-column {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.projeto-card-title {
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.projeto-info p {
  font-size: 0.95rem;
  margin: 0.2rem 0;
  color: #555;
  text-align: justify;
  hyphens:auto;
}

.status-text {
  margin-top: auto;
  padding-top: 1.2rem;
  text-align: justify;
  font-size: 1.2rem;
}

.botoes-container {
  width: 100%;
  margin-top: 1rem;
}

.button {
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background: #1e50b5;
  color: #fff;
  border: none;
  cursor: pointer;
}

.button:hover {
  background: #163f93;
}

.projeto-card,
.projeto-card * {
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
}

@media (max-width: 600px) {
  .projeto-top {
    flex-direction: column;
  }

  .fullscreen-title {
    font-size: 1.5rem;
  }

  .projeto-card-title {
    font-size: 1.2rem;
  }

  .status-text {
    font-size: 1rem;
  }
}
</style>