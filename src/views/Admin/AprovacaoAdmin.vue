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
.status-aguardando {
  color: #e39d00;
  font-weight: bold;
}

.status-aberta {
  color: green;
  font-weight: bold;
}

.status-encerrada {
  color: red;
  font-weight: bold;
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

.title {
  text-align: center;
  color: #1e50b5;
  margin-bottom: 15px;
  font-size: 1.4rem;
}

.texto-modal {
  text-align: center;
  font-size: 1.05rem;
  margin-bottom: 15px;
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
}

.btn-fechar:hover {
  background-color: #666666;
}

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fullscreen-title {
  font-size: 2rem;
  color: #1e50b5;
  margin-bottom: 1rem;
  text-align: center;
}

.projeto-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.299);
  padding: 1rem 1.8rem 1.8rem 2rem;
  margin-bottom: 3rem;
  transition: transform 0.18s ease;
  width: 100%;
  max-width: 998px;
  box-sizing: border-box;
}

.projeto-card:hover {
  transform: translateY(-2px);
}

.projeto-top {
  display: flex;
  gap: 1rem;
}

.icon-column {
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.info-icon {
  width: 28px;
  height: 28px;
  padding: 1.5rem;
}

.projeto-card-title {
  color: #1a1a1a;
  font-size: 1.45rem;
  font-weight: 600;
}

.projeto-info p {
  color: #555;
  font-size: 0.95rem;
  margin: 0.15rem 0;
  text-align: justify;
}

.status-text {
  margin-top: 1.9rem;
  font-weight: 600;
  font-size: 1.3rem;
}

.botoes-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.button {
  flex: 1 1 0%;
  min-width: 380px;
  max-width: 100%;
  height: 45px;
  background-color: #1e50b5;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
}

.button:hover {
  background-color: #163f93;
}

.nenhum-projeto {
  font-size: 1.3rem;
  color: #333;
  margin-top: 2rem;
  text-align: center;
}
</style>