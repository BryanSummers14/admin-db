<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted admin(s).
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="selectedAdmins"
          :items="admins"
          :rules="[v => v.length > 0 || 'Admin is required']"
          label="Admin(s)"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete Admin(s)
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
    selectedAdmins: [],
    admins: [],
    _admins: {}
  }),
  created: function () {
    this.getAdmins()
  },
  methods: {
    async getAdmins() {
      const { data } = await this.$axios.get('/api/users/admins?db=true')
      this._admins = data.reduce((prev, cur) => { prev[cur.id] = cur.sso_id; return prev }, {})
      this.admins = data.map(_val => ({
        value: _val.id,
        text: _val.sso_id
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const adminsToDelete = this.selectedAdmins.map(a => this.$axios.delete(`/api/users/admins/${this._admins[a.value]}`))
        try {
          await Promise.all(adminsToDelete)
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
        this.getAdmins()
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
