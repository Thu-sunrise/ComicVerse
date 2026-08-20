import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
})

let refreshing: Promise<string | null> | null = null

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status !== 401 || original?._retry) return Promise.reject(error)
    original._retry = true
    refreshing ??= axios.post<{ accessToken: string }>("/auth/refresh", {}, { baseURL: api.defaults.baseURL })
      .then(({ data }) => { localStorage.setItem("access_token", data.accessToken); return data.accessToken })
      .catch(() => { localStorage.removeItem("access_token"); return null })
      .finally(() => { refreshing = null })
    const token = await refreshing
    if (!token) return Promise.reject(error)
    original.headers.Authorization = `Bearer ${token}`
    return api(original)
  },
)

export default api