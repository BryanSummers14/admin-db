<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully updated service.
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
          @change="handleService"
        />
        <v-text-field
          v-model="serviceName"
          :counter="32"
          :rules="nameRules"
          name="Name"
          label="Name"
          required
        />

        <v-text-field
          v-model="icon"
          :rules="[v => !!v || 'Icon is required']"
          name="Icon"
          label="Icon"
          required
        />

        <v-textarea
          v-model="description"
          name="Description"
          :rules="[v => !!v || 'Description is required']"
          label="Description"
          required
        />

        <v-text-field
          v-model="templateOnline"
          :rules="[v => !!v || 'Template Online is required']"
          label="Template Online"
          required
        />

        <v-text-field
          v-model="templateOutage"
          :rules="[v => !!v || 'Template Outage is required']"
          label="Template Outage"
          required
        />

        <v-select
          v-model="category"
          :items="categories"
          :rules="[v => !!v || 'Category is required']"
          label="Category"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Update Service
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
    serviceId: null,
    services: [],
    serviceName: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 32) || 'Name must be less than 32 characters'
    ],
    icon: '',
    description: '',
    templateOnline: '',
    templateOutage: '',
    category: null,
    categories: [
      { value: 1, text: 'Other' },
      { value: 2, text: 'Productivity' },
      { value: 3, text: 'Service' },
      { value: 4, text: 'Social' }
    ]
  }),
  computed: {
    _services() {
      return this.$store.getters.filteredServices
    }
  },
  created: function () {
    this.services = this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const updatedService = {}
        this.$refs.form.inputs.forEach((input) => {
          if (input.$vnode.data.model.expression === 'serviceId') {
            updatedService[input.$vnode.data.model.expression] = input.value.value
          } else {
            updatedService[input.$vnode.data.model.expression] = input.value
          }
        })
        try {
          await this.$axios.patch('/api/services', { ...updatedService })
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
    mapCategory(_cat) {
      switch (_cat) {
        case 'Other':
          return 1
        case 'Productivity':
          return 2
        case 'Service':
          return 3
        default:
          return 4
      }
    },
    handleService() {
      const { name, icon, description, template_online: templateOnline, template_outage: templateOutage, category } = this._services.find(s => s.id === this.serviceId.value)
      this.serviceName = name
      this.icon = icon
      this.description = description
      this.templateOnline = templateOnline
      this.templateOutage = templateOutage
      this.category = this.mapCategory(category)
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.success = false
        this.$store.dispatch('storeServices')
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
