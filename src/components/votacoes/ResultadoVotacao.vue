<template>
  <div class="votacao-card">
    <h2>{{ projeto?.titulo ?? 'Carregando projeto...' }}</h2>

    <p class="tipo" v-if="projeto">Tipo: {{ projeto.tipo }}</p>

    <p class="autor" v-if="projeto">
      Autor: {{ projeto.autor ?? 'Não informado' }}
    </p>

    <p class="descricao" v-if="projeto">
      {{ projeto.ementa ?? 'Sem descrição cadastrada.' }}
    </p>

    <div v-if="loading" class="loading">Carregando resultados...</div>

    <div v-else>
        <div v-if="!votacaoEncerrada" class="alert info">
        A votação ainda está em andamento.
        </div>

        <div v-else class="alert encerrada">
        A votação foi encerrada. Confira abaixo o resultado final.
        </div>


      <div class="estatisticas" v-if="totalVotos > 0">
        <h3>Resultado da Votação</h3>

        <div class="grafico-pizza">
            <Pie :data="chartData" :options="chartOptions" />
        </div>

        <div class="barra">
            <span>Sim ({{ resultado.sim }})</span>
            <div
            class="barra-preenchida sim"
            :style="{ width: percentualSim + '%' }"
            ></div>
        </div>

        <div class="barra">
            <span>Não ({{ resultado.nao }})</span>
            <div
            class="barra-preenchida nao"
            :style="{ width: percentualNao + '%' }"
            ></div>
        </div>

        <div class="barra">
            <span>Abstenção ({{ resultado.abstencao }})</span>
            <div
            class="barra-preenchida abstencao"
            :style="{ width: percentualAbstencao + '%' }"
            ></div>
        </div>
        </div>

      <div v-else class="info">
        Nenhum voto registrado até o momento.
      </div>

      <div v-if="isAdmin && votos.length">
        <h4>Votos Registrados</h4>
        <ul>
          <li v-for="voto in votos" :key="voto.id">
            Usuário {{ voto.usuario_id }} – {{ mapOpcao(voto.opcao) }}
          </li>
        </ul>
      </div>

      <div v-if="mensagem" :class="['mensagem', mensagemTipo]">
        {{ mensagem }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../services/api.js'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  projetoId: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const projeto = ref(null)
const loading = ref(true)
const mensagem = ref('')
const mensagemTipo = ref('')
const votacaoEncerrada = ref(false)

const resultado = ref({
  sim: 0,
  nao: 0,
  abstencao: 0
})

const totalVotos = computed(() =>
  resultado.value.sim +
  resultado.value.nao +
  resultado.value.abstencao
)

const percentualSim = computed(() =>
  totalVotos.value ? (resultado.value.sim / totalVotos.value) * 100 : 0
)

const percentualNao = computed(() =>
  totalVotos.value ? (resultado.value.nao / totalVotos.value) * 100 : 0
)

const percentualAbstencao = computed(() =>
  totalVotos.value ? (resultado.value.abstencao / totalVotos.value) * 100 : 0
)

const chartData = computed(() => ({
  labels: ['Sim', 'Não', 'Abstenção'],
  datasets: [
    {
      data: [
        resultado.value.sim,
        resultado.value.nao,
        resultado.value.abstencao
      ],
      backgroundColor: ['#0d820d', '#d62828', '#6a717e'],
      borderWidth: 1
    }
  ]
}))

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    }
  }
}

const carregarDados = async () => {
  loading.value = true
  try {
    const projetoResp = await api.get(`/projetos/${props.projetoId}`)
    projeto.value = projetoResp.data
    votacaoEncerrada.value = projeto.value?.estado !== 1

    const resultadoResp = await api.get(
      `/projetos/${props.projetoId}/resultado`
    )

    resultado.value = resultadoResp.data.detalhes
  } catch (err) {
    mensagem.value = 'Erro ao carregar resultados da votação.'
    mensagemTipo.value = 'erro'
  } finally {
    loading.value = false
  }
}

onMounted(carregarDados)
</script>

<style scoped>
.votacao-card {
  border: 1px solid #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tipo {
  color: #666;
  margin-bottom: .6rem;
}

.autor {
  color: #666;
  margin-bottom: .4rem;
  font-weight: 500;
}

.descricao {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.4rem;
}

.alert {
  padding: .6rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: .95rem;
}

.alert.info {
  background: #eef6ff;
  border: 1px solid #cfe7ff;
  color: #1c4c7a;
}

.alert.encerrada {
  background: #ffecec;
  border: 1px solid #f5c2c2;
  color: #8a1f1f;
}

.estatisticas {
  margin-top: 1.5rem;
}

.estatisticas h3 {
  margin-bottom: 1rem;
}

.grafico-pizza {
  max-width: 320px;
  margin: 1rem auto 1.5rem auto;
}

.barra {
  margin-bottom: .9rem;
  background: #eee;
  height: 40px;
  border-radius: 7px;
  overflow: hidden;
}

.barra span {
  display: block;
  font-size: .95rem;
  font-weight: 500;
  margin-bottom: .25rem;
  color: #333;
}

.barra-preenchida {
  height: 100%;
  width: 0;
  transition: width .6s ease;
}

.barra-preenchida.sim {
  background: #0d820d;
}

.barra-preenchida.nao {
  background: #d62828;
}

.barra-preenchida.abstencao {
  background: #6a717e;
}

h4 {
  margin-top: 1.5rem;
  margin-bottom: .6rem;
}

ul {
  padding-left: 1.2rem;
}

li {
  margin-bottom: .3rem;
  color: #444;
  font-size: .95rem;
}

.mensagem {
  margin-top: 1rem;
  padding: .6rem;
  border-radius: 6px;
  font-size: .95rem;
}

.mensagem.sucesso {
  background: #e6ffed;
  border: 1px solid #b8efc5;
  color: #1f6f3d;
}

.mensagem.erro {
  background: #fff0f0;
  border: 1px solid #f1b5b5;
  color: #8a1f1f;
}

.mensagem.info {
  background: #eef6ff;
  border: 1px solid #cfe7ff;
  color: #1c4c7a;
}

.loading {
  font-style: italic;
  color: #666;
}
</style>