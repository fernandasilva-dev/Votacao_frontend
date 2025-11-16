<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api.js'

const nome = ref('')
const sigla = ref('')
const mensagem = ref('')

const partidos = ref([])
const usuarios = ref([])

const carregarDados = async () => {
  try {
    const respPartidos = await api.get('/partidos')

    //ORDENA OS PARTIDOS POR NOME (A - Z)
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

const editarPartido = (partido) => {
  const novoNome = prompt("Novo nome do partido:", partido.nome)
  const novaSigla = prompt("Nova sigla:", partido.sigla)

  if (!novoNome || !novaSigla) return

  api.put(`/partidos/${partido.id}`, {
    nome: novoNome,
    sigla: novaSigla
  }).then(() => {
    mensagem.value = "Partido editado com sucesso!"
    carregarDados()
  }).catch(() => {
    mensagem.value = "Erro ao editar."
  })
}

const excluirPartido = (id) => {
  if (!confirm("Tem certeza que deseja excluir este partido?")) return

  api.delete(`/partidos/${id}`)
    .then(() => {
      mensagem.value = "Partido excluído com sucesso!"
      carregarDados()
    })
    .catch(() => {
      mensagem.value = "Erro ao excluir partido."
    })
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
        <h2 class="projeto-title" style="margin-top: 100px">Partidos e Vereadores Cadastrados</h2>

        <div class="tabela-wrapper">
          <table class="tabela" role="table">
            <thead>
              <tr>
                <th style="width:120px">Sigla</th>
                <th>Nome</th>
                <th>Vereadores</th>
                <th style="width:140px; text-align:center;">Ações</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="partido in partidos" :key="partido.id">
                <td>{{ partido.sigla }}</td>
                <td>{{ partido.nome }}</td>

                <td>
                  <ul class="vereadores-list">
                    <li v-for="v in vereadoresDoPartido(partido.id)" :key="v.id">
                      {{ v.nome }}
                    </li>
                    <li v-if="vereadoresDoPartido(partido.id).length === 0" class="none">
                      Nenhum vereador cadastrado
                    </li>
                  </ul>
                </td>

                <td class="acoes">
                  <button class="btn-edit" @click="editarPartido(partido)">Editar</button>
                  <button class="btn-delete" @click="excluirPartido(partido.id)">Excluir</button>
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
  border-radius: 8px;
  padding: 12px;
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

.btn-edit {
  background: #ffc107;
  color: #000;
}

.btn-edit:hover {
  background: #e0a800;
}

.btn-delete {
  background: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background: #b02a37;
}
</style>