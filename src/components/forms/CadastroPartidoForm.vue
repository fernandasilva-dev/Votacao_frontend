<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const nome = ref('')
const sigla = ref('')
const mensagem = ref('')

const partidos = ref([])
const usuarios = ref([])

const abrirEditar = ref(false)
const abrirExcluir = ref(false)

const partidoSelecionado = ref({ id: null, nome: '', sigla: '' })
const novoNome = ref('')
const novaSigla = ref('')

const idExcluir = ref(null)

const carregarDados = async () => {
  try {
    const respPartidos = await api.get('/partidos')
    partidos.value = respPartidos.data.sort((a, b) =>
      a.nome.localeCompare(b.nome)
    )

    const respUsuarios = await api.get('/usuarios')
    usuarios.value = respUsuarios.data
  } catch (e) {
    console.error('Erro ao carregar dados:', e)
  }
}

onMounted(() => {
  carregarDados()
})

const cadastrarPartido = async () => {
  try {
    const response = await api.post(
      '/partidos',
      { nome: nome.value, sigla: sigla.value },
      { withCredentials: true }
    )

    mensagem.value = response.data.mensagem || 'Partido cadastrado com sucesso!'
    nome.value = ''
    sigla.value = ''

    carregarDados()

  } catch (error) {
    mensagem.value = error.response?.data?.mensagem || 'Erro ao cadastrar partido.'
  }
}

const vereadoresDoPartido = (idPartido) => {
  return usuarios.value.filter(u => u.partido_id === idPartido && u.tipo === 1)
}

const abrirPopupEditar = (partido) => {
  partidoSelecionado.value = { ...partido }
  novoNome.value = partido.nome
  novaSigla.value = partido.sigla
  abrirEditar.value = true
}

const salvarEdicao = async () => {
  try {
    await api.put(`/partidos/${partidoSelecionado.value.id}`, {
      nome: novoNome.value,
      sigla: novaSigla.value
    })

    mensagem.value = "Partido editado com sucesso!"
    abrirEditar.value = false
    carregarDados()

  } catch (e) {
    mensagem.value = "Erro ao editar partido."
  }
}

const abrirPopupExcluir = (id) => {
  idExcluir.value = id
  abrirExcluir.value = true
}

const confirmarExclusao = async () => {
  try {
    await api.delete(`/partidos/${idExcluir.value}`)
    mensagem.value = "Partido excluído com sucesso!"
    abrirExcluir.value = false
    carregarDados()
  } catch (e) {
    mensagem.value = "Erro ao excluir partido."
  }
}
</script>

<template>
  <div class="projeto-container">
    <div class="projeto-content">
      <div class="projeto-form" role="region" aria-label="Cadastrar Partido">
        <form @submit.prevent="cadastrarPartido" class="form-vertical">
          <p>Nome do Partido</p>
          <input v-model="nome" type="text" placeholder="Digite o nome do partido" required />
          <p>Sigla</p>
          <input v-model="sigla" type="text" placeholder="Digite a sigla" required />
          <button type="submit" class="projeto-button">Cadastrar</button>
        </form>
      </div>

      <div class="tabela-container" aria-live="polite">
        <h2 class="projeto-title">Partidos e Vereadores Cadastrados</h2>
        <div class="tabela-wrapper">
          <table class="tabela" role="table">
            <thead>
              <tr>
                <th>Sigla</th>
                <th>Nome</th>
                <th>Vereadores</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="partido in partidos" :key="partido.id">
                <td data-label="Sigla">{{ partido.sigla }}</td>
                <td data-label="Nome">{{ partido.nome }}</td>
                <td data-label="Vereadores">
                  <ul class="vereadores-list">
                    <li v-for="v in vereadoresDoPartido(partido.id)" :key="v.id">
                      {{ v.nome }}
                    </li>
                    <li v-if="vereadoresDoPartido(partido.id).length === 0" class="none">
                      Nenhum vereador cadastrado
                    </li>
                  </ul>
                </td>

                <td data-label="Ações" class="acoes">
                  <button class="btn-edit" @click="abrirPopupEditar(partido)">Editar</button>
                  <button class="btn-delete" @click="abrirPopupExcluir(partido.id)">Excluir</button>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="mensagem" class="mensagem-global">
        {{ mensagem }}
      </div>

    </div>
  </div>

  <div v-if="abrirEditar" class="overlay">
    <div class="popup auth-form">
      <h3>Editar Partido</h3>
      <p>Nome</p>
      <input v-model="novoNome" type="text" />
      <p>Sigla</p>
      <input v-model="novaSigla" type="text" />
      <div class="linha-botoes">
        <button class="button" @click="salvarEdicao">Salvar</button>
        <button class="button cancelar" @click="abrirEditar = false">Cancelar</button>
      </div>
    </div>
  </div>

  <div v-if="abrirExcluir" class="overlay">
    <div class="popup auth-form">
      <h3>Excluir Partido</h3>
      <p>Tem certeza que deseja excluir este partido?</p>
      <div class="linha-botoes">
        <button class="button" @click="confirmarExclusao">Sim, excluir</button>
        <button class="button cancelar" @click="abrirExcluir = false">Cancelar</button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.projeto-content {
  display: flex !important;
  flex-direction: column !important;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.projeto-form {
  width: 100%;
  max-width: 720px;
  box-sizing: border-box;
}

.projeto-form input {
  width: 100% !important;
  box-sizing: border-box;
}

.tabela-container {
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin-top: 12px;
  padding: 0 8px;
}

.tabela-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  background: transparent;
}

.tabela th,
.tabela td {
  border: 1px solid #b9b9b9;
  padding: 10px;
  text-align: left;
  vertical-align: top;
  font-size: 14px;
  color: #333;
}

.tabela thead th {
  background: #1e50b5;
  color: #ffffff;
  font-weight: 600;
}

.vereadores-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.vereadores-list li {
  padding: 4px 0;
  font-size: 13px;
  color: #333;
}

.vereadores-list li.none {
  color: #777;
  font-style: italic;
}

@media (max-width: 768px) {
  .tabela thead th {
    font-size: 13px;
  }

  .tabela th,
  .tabela td {
    font-size: 13px;
    padding: 8px;
  }
}

.acoes {
  text-align: center;
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit,
.btn-delete {
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.btn-edit { background: #ffc107; color: #000; }
.btn-edit:hover { background: #e0a800; }

.btn-delete { background: #dc3545; color: #fff; }
.btn-delete:hover { background: #b02a37; }

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px);
  z-index: 9999;
}

.popup {
  width: 100%;
  max-width: 360px;
  animation: aparecer 0.25s ease-out;
}

.linha-botoes {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 15px;
}

.button {
  padding: 8px 12px;
  background: #1e50b5;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  border: none;
}

.cancelar {
  background: #aaa;
}

@media (max-width: 768px) {
  .tabela thead {
    display: none;
  }

  .tabela,
  .tabela tbody,
  .tabela tr,
  .tabela td {
    display: block;
    width: 95%;
  }

  .tabela tr {
    border: 1px solid #1e50b5;
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 10px;
    background: #fff;
  }

  .tabela td {
    border: none;
    padding: 6px 0;
    font-size: 14px;
    text-align: left;
  }

  .tabela td::before {
    content: attr(data-label);
    font-weight: 600;
    display: block;
    margin-bottom: 2px;
    color: #1e50b5;
    font-size: 13px;
  }

  .acoes {
    display: flex !important;
    flex-wrap: wrap;
    justify-content: flex-start !important;
    gap: 8px !important;
    margin-top: 8px;
  }

  .btn-edit,
  .btn-delete {
    flex: 0 0 auto;
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>