<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully created feedback.
      </v-alert>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field v-model="userId" :rules="[v => !!v || 'User Id is required']" name="userId" label="User Id" required />

        <v-subheader class="pl-0">
          Rating (1 - 5)
        </v-subheader>
        <v-slider
          v-model="sentiment"
          thumb-label="always"
          min="1"
          max="5"
          step="1"
          ticks="always"
          tick-size="2"
        />

        <v-textarea v-model="message" name="Message" :rules="[v => !!v || 'Message is required']" label="Message" required />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Submit Feedback
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
    loading: false,
    success: false,
    userId: '',
    sentiment: 1,
    message: ''
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newFeedback = {}
        this.$refs.form.inputs.forEach((input) => { newFeedback[input.$vnode.data.model.expression] = input.value })
        await this.$axios.post('/api/feedback', { ...newFeedback })
        this.loading = false
        this.alertSuccess()
      }
    },
    reset() {
      this.$refs.form.reset()
      this.sentiment = 1
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.success = false
        this.reset()
      }, 3000)
    }
  }
}
</script>
