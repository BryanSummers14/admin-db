<template>
  <v-card color="blue-grey darken-2" class="white--text">
    <v-card-title primary-title>
      <div>
        <div
          class="headline"
        >
          {{ feedback.user_id }}
        </div>
        <br>
        <span>- {{ feedback.message }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <v-rating v-model="feedback.rating" readonly />
      <br>
      Left on : {{ new Date(feedback.createdAt).toLocaleString() }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { feedback: { type: Object, default: () => ({ rating: 0 }) } }
}
</script>
