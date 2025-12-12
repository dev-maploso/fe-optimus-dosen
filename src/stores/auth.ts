import { defineStore } from 'pinia'
import { api } from '@/services/api' 
import router from '@/router'

interface User {
  id: number
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    loading: false,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      try {
        const res = await api.post('/dosen/login', {
          email,
          password,
        })

        this.token = res.data.token
        this.user = res.data.dosen

        localStorage.setItem('token', this.token)

        return true
      } catch (err) {
        console.error('LOGIN ERROR:', err)
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')

      router.push('/login')
    },

    async restoreSession() {
      if (!this.token) return

      try {
        this.loading = true
        const res = await api.get('/me')
        this.user = res.data
      } catch {
        this.logout()
      } finally {
        this.loading = false
      }
    }
  },
})
