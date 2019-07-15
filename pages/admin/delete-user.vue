<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted user(s).
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="selectedUsers"
          :items="users"
          :rules="[v => !!v || 'User is required']"
          label="Users"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete User(s)
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
    selectedUsers: [],
    users: []
  }),
  created: function () {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const { data } = await this.$axios.get('/api/users/app-users')
      this.users = data.map(_val => ({
        value: _val.id,
        text: `${_val.sso_id}`
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const usersToDelete = this.selectedUsers.map(a => this.$axios.delete(`/api/users/app-user/${a.text}`))
        try {
          await Promise.all(usersToDelete)
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
        this.getUsers()
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
