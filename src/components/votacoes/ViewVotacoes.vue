<template> 
  <div class="home-container">
    <p v-if="projetosFiltrados.length === 0" class="nenhum-projeto">
      Nenhum projeto liberado para votação.
    </p>
    <div
      v-else
      v-for="projeto in projetosFiltrados"
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
            <p class="ementa"><b>Ementa:</b> {{ projeto.ementa }}</p>
            <p><b>Tipo:</b> {{ projeto.tipo }}</p>
            <p><b>Data:</b> {{ formatarData(projeto.dt_votacao) }}</p>
          </div>

          <p
            class="status-text"
            :class="projeto.estado === 1 ? 'status-aberto' : 'status-encerrado'"
          >
            {{ projeto.estado === 1 ? 'Votação Aberta' : 'Votação Encerrada' }}
          </p>


          <div class="botoes-container">
            <button @click="irParaVotacao(projeto.id)" class="btn-card">
              ACESSAR
            </button>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "../../services/api.js"

const router = useRouter()
const route = useRoute()

const projetos = ref([])

const projetosFiltrados = computed(() =>
  projetos.value.filter(projeto => projeto.estado === 0 || projeto.estado === 1)
)

const carregarProjetos = async () => {
  try {
    const response = await api.get("/projetos")
    projetos.value = response.data
  } catch (erro) {
    console.error("Erro ao carregar projetos:", erro)
  }
}

const irParaVotacao = (id) => {
  const role = route.meta.role

  if (role === 'admin') {
    router.push({ name: 'VotacaoProjetoAdmin', params: { id } })
  } else {
    router.push({ name: 'VotacaoProjeto', params: { id } })
  }
}

const formatarData = (data) => new Date(data).toLocaleDateString("pt-BR")

onMounted(() => {
  carregarProjetos()
  setInterval(carregarProjetos, 60000)
})
</script>

<style scoped>
.projeto-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.299);
  padding: 1rem 1.8rem 1.8rem 2rem;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 998px;
  display: flex;
  flex-direction: column;
  height: 350px;
  box-sizing: border-box;
}

.projeto-card:hover {
  transform: translateY(-2px);
}

.projeto-top {
  display: flex;
  gap: 1.5rem;
  height: 100%;
}

.content-column {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
}

.ementa {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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

.status-aberto {
  color: #0d820d;
}

.status-encerrado {
  color: #b51e1e;
}

.botoes-container {
  margin-top: auto;
}

.btn-card {
  width: 100%;
  height: 45px;
  background-color: #1e50b5;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;
}

.btn-card:hover {
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
    height: auto;
    min-height: unset;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .projeto-top {
    flex-direction: column;
    gap: 0.8rem;
  }

  .icon-column {
    width: 100%;
    justify-content: flex-start;
  }

  .info-icon {
    padding: 0;
    width: 24px;
    height: 24px;
  }

  .projeto-card-title {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }

  .projeto-info p {
    font-size: 0.9rem;
  }

  .ementa {
    -webkit-line-clamp: 4;
  }

  .status-text {
    margin-top: 1rem;
    font-size: 1.1rem;
  }

  .btn-card {
    height: 44px;
    font-size: 0.95rem;
  }
}
</style>