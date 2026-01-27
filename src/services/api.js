import axios from 'axios'

const api = axios.create({
    baseURL: 'https://votacao-backend.fly.dev/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

export default api