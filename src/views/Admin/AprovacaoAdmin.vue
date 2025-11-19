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
            :class="{
              'status-aprovacao': projeto.statusSimulado === 'Em aprovação',
              'status-aprovado': projeto.statusSimulado === 'Aprovado',
              'status-reprovado': projeto.statusSimulado === 'Reprovado'
            }"
          >
            {{ projeto.statusSimulado }}
          </p>

          <div class="botoes-container">
            <button @click="aprovar(projeto)" class="button">
              <img src="../../assets/images/aprovar.png" alt="Aprovar" class="icon-btn" />
              Aprovar
            </button>

            <button @click="reprovar(projeto)" class="button reject">
              <img src="../../assets/images/reprovar.png" alt="Reprovar" class="icon-btn" />
              Não Aprovar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const projetos = ref([])

const carregarProjetos = async () => {
  try {
    const response = await api.get('/projetos')
    projetos.value = response.data.map((p) => ({
      ...p,
      statusSimulado: 'Em aprovação'
    }))
  } catch (erro) {
    console.error('Erro ao carregar projetos:', erro)
  }
}

const aprovar = (projeto) => {
  projeto.statusSimulado = 'Aprovado'
}

const reprovar = (projeto) => {
  projeto.statusSimulado = 'Reprovado'
}

const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR')

onMounted(carregarProjetos)
</script>

<style scoped>
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
  gap: 1.5rem;
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
  margin-bottom: 0.8rem;
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

.status-aprovacao {
  color: #e39d00;
}

.status-aprovado {
  color: #0d820d;
}

.status-reprovado {
  color: #d62828;
}

.botoes-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.button {
  flex: 1 1 40%;
  min-width: 380px;
  max-width: 420px;
  height: 45px;
  background-color: #1e50b5;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: background-color 0.2s ease;
  box-sizing: border-box;
  padding: 0 16px;
}

.button:hover {
  background-color: #163f93;
}

.reject {
  background-color: #b51e1e;
}

.reject:hover {
  background-color: #8a1616;
}

.icon-btn {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.nenhum-projeto {
  font-size: 1.3rem;
  color: #333;
  margin-top: 2rem;
  text-align: center;
}

@media (max-width: 720px) {
  .projeto-card {
    width: 95%;
    padding: 1.5rem;
  }

  .botoes-container {
    flex-direction: column;
    gap: 12px;
  }

  .button {
    flex: 1 1 100%;
    width: 100%;
    max-width: none;
    min-width: 0;
  }

  .icon-column {
    width: 36px;
  }

  .projeto-card-title {
    font-size: 1.25rem;
  }
}
</style>