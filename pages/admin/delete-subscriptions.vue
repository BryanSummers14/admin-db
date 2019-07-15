<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted subscription(s).
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="selectedSubscriptions"
          :items="subscriptions"
          :rules="[v => v.length > 0 || 'Subscription is required']"
          label="Subscriptions"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete Subscription(s)
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
    selectedSubscriptions: [],
    subscriptions: []
  }),
  created: function () {
    this.getSubscriptions()
  },
  methods: {
    async getSubscriptions() {
      const { data } = await this.$axios.get('/api/stats/all-subscriptions?admins=true')
      this.subscriptions = data.map(_val => ({
        value: _val.id,
        text: `${_val.user} - ${_val.service}`
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const subsToDelete = this.selectedSubscriptions.map(sub => this.$axios.delete(`/api/services/subscriptions/${sub.value}`))
        try {
          await Promise.all(subsToDelete)
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
        this.getSubscriptions()
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
