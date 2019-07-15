<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
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

        <v-text-field
          v-model="password"
          type="password"
          :rules="[v => !!v || 'Password is required']"
          name="password"
          label="Password"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Login
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
  middleware: 'notAuthenticated',
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
    password: ''
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const authUser = Object.assign({}, { userId: this.userId, password: this.password })
        try {
          await this.$store.dispatch('login', { ...authUser })
          this.loading = false
          this.$router.push({ path: '/admin' })
        } catch (err) {
          this.loading = false
          console.log(err)
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    reset() {
      this.$refs.form.reset()
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
