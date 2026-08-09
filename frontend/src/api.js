import axios from 'axios'

const BASE_URL = "https://meeting-scheduler-ib3i.onrender.com"
const api = axios.create({
  baseURL: BASE_URL,
})

// Automatically attach the token to every request, if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api