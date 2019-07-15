<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully onboarded User.
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
          :rules="[v => !!v || 'User is required']"
          name="user"
          label="User"
          required
        />

        <v-select
          v-model="origin"
          :items="allOrigins"
          :rules="[v => !!v || 'Origin is required']"
          name="origin"
          label="Origin"
          required
        />

        <v-text-field
          v-model="domain"
          :rules="[v => !!v || 'Domain is required']"
          name="domain"
          label="Domain"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Onboard User
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
    users: [],
    domain: '',
    origin: null,
    allOrigins: [{ value: 1, text: 'Mobile' }, { value: 2, text: 'Desktop' }]
  }),
  created: function () {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const { data } = await this.$axios.get('/api/users/app-users')
      this.users = data.filter(v => !v.onboarded).map(_val => ({
        value: _val.sso_id,
        text: `${_val.sso_id}`
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const user = Object.assign({}, { userId: this.userId, origin: this.origin, domain: this.domain, appVersion: 1.723 })
        try {
          await this.$axios.post('/api/users/app-user/onboarded', { ...user })
          this.loading = false
          this.alertSuccess()
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
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.success = false
        this.getUsers()
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
