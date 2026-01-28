<template>
  <div class="home-container">
    <h1 class="fullscreen-title">Meus Projetos</h1>

    <div v-if="projetos.length === 0" class="nenhum-projeto">
      Nenhum projeto cadastrado por você.
    </div>

    <div v-else class="projetos-lista">
      <div v-for="projeto in projetos" :key="projeto.id" class="projeto-card">
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
              <p><b>Data de Votação:</b> {{ formatarData(projeto.dt_votacao) }}</p>
            </div>

            <p 
              class="status-text"
              :class="projeto.estado === 1 ? 'status-aberto' : projeto.estado === 0 ? 'status-encerrado' : 'status-aguardando'"
            >
              {{ projeto.estado === 1 ? 'Votação Aberta' : projeto.estado === 0 ? 'Votação Encerrada' : 'Aguardando Abertura' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "../../services/api.js"

const projetos = ref([])
const usuario = ref({ nome: "" })

const formatarData = (data) => new Date(data).toLocaleDateString("pt-BR")

onMounted(async () => {
  try {
    const userResp = await api.get("/me", { withCredentials: true })
    usuario.value = userResp.data

    const projetosResp = await api.get("/projetos", { withCredentials: true })
    projetos.value = projetosResp.data.filter(p => p.autor === usuario.value.nome)
  } catch (erro) {
    console.error("Erro ao carregar projetos:", erro)
  }
})
</script>

<style scoped>
.projeto-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  padding: 1rem 1.8rem 1.8rem 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 998px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: auto; /* altura automática */
  word-break: break-word;
  overflow-wrap: break-word;
}

.projeto-top {
  display: flex;
  gap: 1.5rem;
  flex-direction: row;
}

.content-column {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.ementa {
  display: block;
  overflow: visible;
  text-overflow: unset;
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
  margin-top: 1rem;
  font-weight: 600;
  font-size: 1.3rem;
}

.status-aberto { color: #0d820d; }
.status-encerrado { color: #b51e1e; }
.status-aguardando { color: #e39d00; }

.nenhum-projeto {
  font-size: 1.3rem;
  color: #333;
  margin-top: 2rem;
  text-align: center;
}

@media (max-width: 720px) {
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
    -webkit-line-clamp: unset;
  }

  .status-text {
    font-size: 1.1rem;
  }
}
</style>