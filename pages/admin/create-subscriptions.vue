<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully created subscription(s).
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="userId"
          :rules="[v => !!v || 'User Id is required']"
          name="userId"
          label="User Id"
          required
        />

        <v-combobox
          v-model="services"
          :items="allServices"
          label="Service"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Create Subscription(s)
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
    userId: '',
    services: [],
    allServices: []
  }),
  created: function () {
    this.allServices = this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const subscribedServices = this.services.map(s => ({ id: s.value, state: true }))
        const newSubscriptions = { services: subscribedServices }
        try {
          await this.$axios.post(`/api/services/subscription/${this.userId}`, newSubscriptions)
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
