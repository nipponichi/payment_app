import axios from 'axios'

const api = axios.create({
// Si usamos server descomentar la siguiente linea y comentar la siguiente
// baseURL: import.meta.env.VITE_API_URL || 'web del server',
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api