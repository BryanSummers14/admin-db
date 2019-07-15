<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully created alert.
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

        <v-text-field
          v-model="userId"
          :rules="[v => !!v || 'User Id is required']"
          name="userId"
          label="User Id"
          required
        />

        <v-select
          v-model="status"
          :items="statuses"
          label="Type"
          required
        />

        <v-text-field
          v-model="alertTitle"
          :rules="[v => !!v || 'Title is required']"
          label="Title"
          required
        />

        <v-textarea
          v-model="alertText"
          name="Message"
          :rules="[v => !!v || 'Message is required']"
          label="Message"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Create Alert
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
    serviceId: null,
    services: [],
    userId: '',
    status: 0,
    statuses: [
      { value: 1, text: 'Product Release' },
      { value: 0, text: 'Incident' },
      { value: 2, text: 'Promotion' }
    ],
    alertTitle: '',
    alertText: ''
  }),
  created: function () {
    this.services = this.$store.state.services.map(_val => ({ value: _val.id, text: _val.name }))
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newAlert = {}
        this.$refs.form.inputs.forEach((input) => {
          const expression = input.$vnode.data.model.expression
          if (expression === 'serviceId') {
            newAlert[expression] = input.value.value
          } else {
            newAlert[expression] = input.value
          }
        })
        try {
          await this.$axios.post('/api/alert', { ...newAlert })
          this.loading = false
          this.alertSuccess()
        } catch (err) {
          this.loading = false
          if (err.response && err.response.data && err.response.data.hasProfanity) {
            this.errMessage = 'Alert contains profanity, please fix before trying again'
            this.alertText = err.response.data.alertText
          } else {
            this.errMessage = err.message
          }
          this.alertFailure()
        }
      }
    },
    reset() {
      this.$refs.form.reset()
      this.type = 0
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
