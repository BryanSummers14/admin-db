<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Success!
      </v-alert>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="service"
          :items="allServices"
          label="Service(s)"
          required
          @change="setService"
        />

        <v-text-field
          v-model="slackChannel"
          :rules="[v => !!v || 'Channel is required']"
          name="channel"
          label="Slack Channel"
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Set Channel
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
    service: null,
    allServices: [],
    slackChannel: ''
  }),
  computed: {
    allServicesData() {
      return this.$store.getters.filteredServices
    }
  },
  created: function () {
    this.allServices = this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const currentSlack = this.allServicesData.filter(s => s.id === this.service.value).pop().slackChannel
        const op = currentSlack === 'Not Set' ? 'create-channel' : 'update-channel'
        const channelInfo = Object.assign({}, { serviceId: this.service.value, channel: this.slackChannel })
        try {
          await this.$axios.post(`/api/slack/${op}`, { ...channelInfo })
          this.loading = false
          this.alertSuccess()
        } catch (err) {
          this.loading = false
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    setService() {
      this.slackChannel = this.allServicesData.filter(s => s.id === this.service.value).pop().slackChannel
    },
    reset() {
      this.$refs.form.reset()
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
