<template>
  <div class="home-container">
    <p v-if="projetos.length === 0" class="nenhum-projeto">
      Nenhum projeto liberado para votação.
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

          <p class="status-text status-aprovacao">
            Aberto para votação
          </p>

          <div class="botoes-container">
            <button @click="irParaVotacao(projeto.id)" class="button votar">
              ACESSAR
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "../../services/api.js"

const router = useRouter()
const projetos = ref([])

const carregarProjetos = async () => {
  try {
    const response = await api.get("/projetos?estado=liberado")
    projetos.value = response.data
  } catch (erro) {
    console.error("Erro ao carregar projetos:", erro)
  }
}

const irParaVotacao = (id) => {
  router.push({ name: 'VotacaoProjeto', params: { id } })
}

const formatarData = (data) => new Date(data).toLocaleDateString("pt-BR")

onMounted(() => {
  carregarProjetos()

  setInterval(() => {
    carregarProjetos()
  }, 60000)
})
</script>

<style scoped>
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
  justify-content: center;
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
  color: #1e50b5;
}

.botoes-container {
  margin-top: 20px;
}

.button {
  width: 100%;
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
  padding: 0 16px;
}

.button:hover {
  background-color: #163f93;
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

  .button {
    width: 100%;
  }
}
</style>