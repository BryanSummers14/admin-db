<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully created user.
      </v-alert>
      <v-alert
        :value="updated"
        type="success"
        transition="scale-transition"
      >
        User {{ userId }} already exists. Last login has been updated.
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

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Create User
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
    updated: false,
    failure: false,
    errMessage: '',
    loading: false,
    userId: '',
    user: {}
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newUser = Object.assign({}, { userId: this.userId })
        try {
          const { data, status } = await this.$axios.post('/api/users/app-user', { ...newUser })
          this.user = data
          this.loading = false
          if (status === 201) {
            this.alertSuccess()
          } else {
            this.alertUpdate()
          }
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
    alertUpdate() {
      this.updated = true
      setTimeout(() => {
        this.updated = false
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
