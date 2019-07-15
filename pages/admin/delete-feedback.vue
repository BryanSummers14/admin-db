<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-alert
        :value="success"
        type="success"
        transition="scale-transition"
      >
        Successfully deleted feedback.
      </v-alert>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-combobox
          v-model="selectedFeedback"
          :items="feedback"
          :rules="[v => v.length > 0 || 'Feedback is required']"
          label="Feedback"
          multiple
          required
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="error" @submit="submit">
          Delete Feedback
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
    loading: false,
    selectedFeedback: [],
    feedback: []
  }),
  created: function () {
    this.getFeedback()
  },
  methods: {
    async getFeedback() {
      const { data } = await this.$axios.get('/api/feedback?test=true')
      this.feedback = data.map(_val => ({
        value: _val.id,
        text: `${_val.rating} - ${_val.message}`
      }))
    },
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const feedbackToDelete = this.selectedFeedback.map(f => this.$axios.delete(`/api/feedback/${f.value}`))
        await Promise.all(feedbackToDelete)
        this.loading = false
        this.alertSuccess()
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    alertSuccess() {
      this.success = true
      setTimeout(() => {
        this.getFeedback()
        this.success = false
        this.reset()
      }, 3000)
    }
  }
}
</script>
