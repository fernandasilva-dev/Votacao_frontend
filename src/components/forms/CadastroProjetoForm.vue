<script setup>
import { ref } from 'vue'
import api from '../../services/api.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const titulo = ref('')
const autor = ref('')
const ementa = ref('')
const tipo = ref('')
const data_votacao = ref('')
const mensagem = ref('')

const tiposProjeto = [
    { id: 1, nome: 'Lei Ordinária' },
    { id: 2, nome: 'Lei Complementar' },
    { id: 3, nome: 'Emenda Constitucional' },
    { id: 4, nome: 'Resolução' },
]

const cadastrarProjeto = async () => {
    try {

        const userId = 1 //usuario para teste

        if (!userId) {
            mensagem.value = 'Usuário não identificado. Faça login novamente.'
            return
        }
        
        //console.log('Data de votação (v-model):', data_votacao.value)

        const isoDate = data_votacao.value ? data_votacao.value + "T00:00:00Z" : null;

        const response = await api.post('/projetos', {
            titulo: titulo.value,
            autor: autor.value,
            ementa: ementa.value,
            tipo: tipo.value,
            data_votacao: isoDate,
            usuario_id: userId,
        })

        mensagem.value = response.data.mensagem || 'Projeto cadastrado com sucesso!'

        titulo.value = ''
        autor.value = ''
        ementa.value = ''
        tipo.value = ''
        data_votacao.value = ''

        router.push('/dashboard')
    } catch (error) {
        mensagem.value = error.response?.data?.mensagem || 'Erro ao cadastrar projeto.'
    }
}
</script>

<template>
    <div class="projeto-container">
        <div class="projeto-content">
            <div class="projeto-form">
                <form @submit.prevent="cadastrarProjeto">
                    <p>Título</p>
                    <input v-model="titulo" type="text" placeholder="Digite o título do projeto" required />

                    <p>Autor</p>
                    <input v-model="autor" type="text" placeholder="Digite o nome do autor" required />

                    <p>Ementa</p>
                    <textarea v-model="ementa" placeholder="Descreva a ementa do projeto" required></textarea>

                    <p>Tipo</p>
                    <select v-model="tipo" required>
                        <option disabled value="">Selecione o tipo</option>
                        <option v-for="t in tiposProjeto" :key="t.id" :value="t.nome">{{ t.nome }}</option>
                    </select>

                    <p>Data de Votação</p>
                    <input v-model="data_votacao" type="date" required />
                    <button type="submit" class="projeto-button">Cadastrar</button>

                    <p class="projeto-mensagem" v-if="mensagem">{{ mensagem }}</p>
                </form>
            </div>
        </div>
    </div>
</template>