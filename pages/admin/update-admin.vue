<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully updated admin.
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="admin"
          :items="allAdmins"
          label="Admin"
          @change="getAdminServices"
        />

        <v-combobox
          v-model="services"
          :items="allServices"
          label="Service(s)"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Update Admin
        </loader-button>

        <v-btn color="error" @click="reset">
          Reset Form
        </v-btn>
      </v-form>
    </v-flex>
  </v-layout>
</template>

<script>
import LoaderButton from '../../components/LoaderButton'

export default {
  middleware: 'authenticated',
  components: {
    LoaderButton
  },
  data: () => ({
    valid: true,
    success: false,
    failure: false,
    errMessage: '',
    loading: false,
    admin: null,
    allAdmins: [],
    services: [],
    allServices: []
  }),
  created: function () {
    this.allServices = this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
    this.getAdmins()
  },
  methods: {
    async getAdmins() {
      const { data } = await this.$axios.get('/api/users/admins?db=true')
      this.allAdmins = data.filter(u => u.role !== 'superAdmin').map(_val => ({
        value: _val.sso_id,
        text: _val.sso_id
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const updatedAdmin = Object.assign({}, { userId: this.admin.value, services: this.services.map(s => s.value) })
        try {
          await this.$axios.put(`/api/users/admins/${this.admin.text}`, { ...updatedAdmin })
          this.loading = false
          this.alertSuccess()
        } catch (err) {
          this.loading = false
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    async getAdminServices() {
      const skipServices = []
      const { data } = await this.$axios.get(`/api/services/admin/${this.admin.text}`)
      const filteredData = data.filter(v => !skipServices.includes(v.id))
      this.services = filteredData.map(_val => ({ value: _val.id, text: _val.name }))
    },
    reset() {
      this.$refs.form.reset()
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.success = false
        this.getAdmins()
        this.reset()
      }, 3000)
    },
    alertFailure() {
      this.failure = true
      setTimeout(() => {
        this.failure = false
      }, 5000)
    }
  }
}
</script>
