import Vuex from 'vuex'

const INIT_STATE = {
  auth: process.client && JSON.parse(sessionStorage.getItem('cred')) ? JSON.parse(sessionStorage.getItem('cred')).auth : false,
  token: process.client && JSON.parse(sessionStorage.getItem('cred')) ? JSON.parse(sessionStorage.getItem('cred')).token : '',
  services: process.client && JSON.parse(sessionStorage.getItem('services')) ? JSON.parse(sessionStorage.getItem('services')) : []
}

const createStore = () => {
  return new Vuex.Store({
    state: INIT_STATE,
    mutations: {
      SET_USER(state, { token }) {
        state.auth = true
        state.token = token
        process.client && sessionStorage.setItem('cred', JSON.stringify({ auth: state.auth, token }))
      },
      SET_SERVICES(state, data) {
        state.services = data
        process.client && sessionStorage.setItem('services', JSON.stringify(data))
      },
      UNSET_USER(state) {
        state.auth = false
        state.token = ''
        state.services = []
        sessionStorage.clear()
      }
    },
    actions: {
      async login({ commit }, { userId, password }) {
        try {
          const { data } = await this.$axios.post('/api/admin-dashboard/login', { userId, password })
          commit('SET_USER', data)
        } catch (error) {
          if (error.response && error.response.status === 401) {
            throw new Error('Bad credentials')
          }
          throw error
        }
      },
      async storeServices({ commit }) {
        const { data } = await this.$axios.get('/api/services/admin/akbodap')
        commit('SET_SERVICES', data)
      },
      logout({ commit }) {
        sessionStorage.clear()
        commit('UNSET_USER')
      }
    },
    getters: {
      filteredServices: state => state.services.filter(v => ![2].includes(v.id))
    }
  })
}

export default createStore
