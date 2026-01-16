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

    <div v-if="loading" class="loading">Carregando...</div>

    <div v-else>
      <div v-if="votacaoEncerrada" class="alert encerrada">
        A votação foi encerrada. Não é possível registrar novos votos.
      </div>

      <div class="opcoes">
        <button
          class="btn btn-sim"
          :disabled="isSubmitting || votacaoEncerrada || jaVotou"
          @click="confirmarEVotar('sim')"
        >
          Sim
        </button>

        <button
          class="btn btn-nao"
          :disabled="isSubmitting || votacaoEncerrada || jaVotou"
          @click="confirmarEVotar('nao')"
        >
          Não
        </button>

        <button
          class="btn btn-abstencao"
          :disabled="isSubmitting || votacaoEncerrada || jaVotou"
          @click="confirmarEVotar('abstencao')"
        >
          Abstenção
        </button>
      </div>

      <div v-if="jaVotou && !votacaoEncerrada" class="info">
        Você já votou neste projeto!
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

const props = defineProps({
  projetoId: {
    type: String,
    required: true
  }
})

const reverseOptionMap = {
  sim: 1,
  nao: 2,
  abstencao: 3
}

const usuario = ref(null)
const projeto = ref(null)
const votos = ref([])
const votoUsuario = ref(null)
const loading = ref(true)
const isSubmitting = ref(false)
const mensagem = ref('')
const mensagemTipo = ref('')
const votacaoEncerrada = ref(false)

const jaVotou = computed(() => !!votoUsuario.value)

const carregarUsuario = async () => {
  const resp = await api.get('/me')
  usuario.value = resp.data
}

const carregarDados = async () => {
  loading.value = true
  try {
    const projetoResp = await api.get(`/projetos/${props.projetoId}`)
    projeto.value = projetoResp.data
    votacaoEncerrada.value = projeto.value?.estado !== 1

    const votosResp = await api.get('/votos', {
      params: { projeto_id: props.projetoId }
    })

    votos.value = votosResp.data || []
    votoUsuario.value = votos.value.find(
      v => String(v.usuario_id) === String(usuario.value?.id)
    ) || null
  } catch (err) {
    mensagem.value = 'Erro ao carregar dados da votação.'
    mensagemTipo.value = 'erro'
  } finally {
    loading.value = false
  }
}

const confirmarEVotar = async (opcao) => {
  const ok = window.confirm(`Confirma seu voto: ${opcao}?`)
  if (!ok) return

  if (jaVotou.value) {
    mensagem.value = 'Você já votou neste projeto.'
    mensagemTipo.value = 'info'
    return
  }

  isSubmitting.value = true

  try {
    await api.post('/votos', {
      usuario_id: usuario.value.id,
      projeto_id: props.projetoId,
      opcao: reverseOptionMap[opcao]
    })

    mensagem.value = 'Voto registrado com sucesso!'
    mensagemTipo.value = 'sucesso'

    votoUsuario.value = { opcao }
  } catch (err) {
    mensagem.value = 'Erro ao registrar voto.'
    mensagemTipo.value = 'erro'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await carregarUsuario()
  await carregarDados()
})
</script>

<style scoped>
.votacao-card {
  border: 1px solid #e0e0e0;
  padding: 2rem;
  border-radius: 8px;
  max-width: auto;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.tipo { 
    color: #666; 
    margin-bottom: .6rem; 
}

.opcoes { 
    display:flex; 
    gap: .6rem; 
    margin: .8rem 0; 
}

.btn {
  padding: .6rem 3rem;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;

}

.btn-sim {
  background: #0d820d;
  color: #ffffff;
}
.btn-sim:hover:not(:disabled) {
  background: #28a028;
}

.btn-nao {
  background: #d62828;
  color: #ffffff;
}
.btn-nao:hover:not(:disabled) {
  background: #f83e3e;
}

.btn-abstencao {
  background: #6a717e;
  color: #ffffff;
}
.btn-abstencao:hover:not(:disabled) {
  background: #8e98aa;
}

.btn:disabled {
  opacity: .5;
  cursor: not-allowed;
  filter: grayscale(35%) brightness(95%);
}

.alert.encerrada { 
    background:#ffecec; 
    border:1px solid #f5c2c2; 
    padding:.6rem; border-radius:6px; 
    margin-bottom:.6rem 
}

.info { 
    margin-top:.5rem; 
    color:#333 
}

.estatisticas { 
    margin-top: 2rem; 
}

.linha-voto { 
    margin-bottom: .8rem; 
}

.legenda { 
    display:flex; 
    justify-content: space-between; 
    align-items:center; 
    font-size:.95rem; 
    margin-bottom:.30rem 
}

.barra { 
    height:12px; 
    width:100%; 
    background:#eee; 
    border-radius:6px; 
    overflow:hidden; 
}

.barra-preenchida { 
    height:100%; 
    background:#7fc97f; 
    width:0; 
    transition: width .6s ease; 
}

.total { 
    margin-top:.6rem; 
    font-weight:600 
}

.mensagem { 
    margin-top: .8rem; 
    padding:.6rem; 
    border-radius:6px; 
}

.mensagem.sucesso { 
    background:#e6ffed; 
    border:1px solid #b8efc5 
}

.mensagem.erro { 
    background:#fff0f0; 
    border:1px solid #f1b5b5 
}
.mensagem.info { 
    background:#eef6ff; 
    border:1px solid #cfe7ff 
}

.loading { 
    font-style: italic; 
    color:#666 
}

.autor {
  color: #666;
  margin-bottom: .4rem;
  font-weight: 500;
}

.descricao {
  color: #666;
  margin-bottom: .8rem;
  line-height: 1.4rem;
}
</style>