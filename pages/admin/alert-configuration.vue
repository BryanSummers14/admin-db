<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully updated alert configuration.
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>
      <h3>Configure how many days of alerts should be shown</h3>
      <br>
      <br>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-slider
          v-model="days"
          thumb-label="always"
          min="2"
          max="30"
          step="1"
          ticks="always"
          tick-size="3"
          :disabled="getInitial"
          @change="checkInitial"
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Configure Alerts
        </loader-button>

        <v-btn color="error" :disabled="isInitial" @click="reset">
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
    days: 1,
    databaseDays: 1,
    getInitial: true,
    isInitial: true
  }),
  created: async function () {
    try {
      const { data } = await this.$axios.get('/api/alert/configuration')
      this.days = data.alert_lookback_time
      this.databaseDays = data.alert_lookback_time
      this.getInitial = false
    } catch (err) {
      console.log(err)
      this.getInitial = false
      this.errMessage = 'Unable to get initial value'
      this.alertFailure()
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const alertConfiguration = { alert_lookback_time: this.days }
          await this.$axios.put('/api/alert/configure-alert', { ...alertConfiguration })
          this.loading = false
          this.databaseDays = this.days
          this.isInitial = true
          this.alertSuccess()
        } catch (err) {
          this.loading = false
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    checkInitial() {
      this.isInitial = this.databaseDays === this.days
    },
    reset() {
      this.isInitial = true
      this.days = this.databaseDays
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.success = false
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
