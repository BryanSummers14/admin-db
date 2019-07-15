<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted alert(s).
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="selectedAlerts"
          :items="alerts"
          :rules="[v => !!v || 'Alert is required']"
          label="Alerts"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete Alert(s)
        </loader-button>

        <v-btn color="secondary" @click="reset">
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
    selectedAlerts: [],
    alerts: []
  }),
  created: function () {
    this.getAlerts()
  },
  methods: {
    async getAlerts() {
      const { data } = await this.$axios.get('/api/stats/alerts-deletion')
      this.alerts = data.map(_val => ({
        value: _val.id,
        text: `${_val.user}: ${_val.service} - ${_val.message}. ${new Date(_val.createdAt).toLocaleString()}`
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const alertsToDelete = this.selectedAlerts.map(a => this.$axios.delete(`/api/alert/${a.value}`))
        try {
          await Promise.all(alertsToDelete)
          this.loading = false
          this.alertSuccess()
        } catch (err) {
          this.loading = false
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.getAlerts()
        this.success = false
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
