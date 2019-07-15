<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully created service.
      </v-alert>

      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="serviceName"
          :counter="32"
          :rules="nameRules"
          name="Name"
          label="Name"
          required
        />

        <v-text-field v-model="icon" :rules="[v => !!v || 'Icon is required']" name="Icon" label="Icon" required />

        <v-textarea v-model="description" name="Description" :rules="[v => !!v || 'Description is required']" label="Description" required />

        <v-text-field v-model="templateOnline" :rules="[v => !!v || 'Template Online is required']" label="Template Online" required />

        <v-text-field v-model="templateOutage" :rules="[v => !!v || 'Template Outage is required']" label="Template Outage" required />

        <v-select
          v-model="category"
          :items="categories"
          :rules="[v => !!v || 'Category is required']"
          label="Category"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Create Service
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
    loading: false,
    failure: false,
    errMessage: '',
    serviceName: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 32) || 'Name must be less than 17 characters'
    ],
    icon: '',
    description: '',
    templateOnline: '',
    templateOutage: '',
    category: null,
    categories: [{ value: 1, text: 'Other' }, { value: 2, text: 'Productivity' }, { value: 3, text: 'Service' }, { value: 4, text: 'Social' }]
  }),

  methods: {
    validate() {
      if (this.$refs.form.validate()) {
      }
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newService = {}
        this.$refs.form.inputs.forEach((input) => { newService[input.$vnode.data.model.expression] = input.value })
        try {
          await this.$axios.post('/api/services', { ...newService })
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
