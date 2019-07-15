<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted service.
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="serviceId"
          :items="services"
          :rules="[v => !!v || 'Service is required']"
          label="Service"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete Service
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
    serviceId: null
  }),
  computed: {
    services() {
      return this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.delete(`/api/services/${this.serviceId.value}`)
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
        this.$store.dispatch('storeServices')
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
