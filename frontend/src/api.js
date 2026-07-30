import axios from 'axios'

const BASE_URL = "https://meeting-scheduler-ib3i.onrender.com"

const api = axios.create({
  baseURL: BASE_URL,
})

export default api