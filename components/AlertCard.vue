<template>
  <v-card color="blue-grey darken-2" class="white--text">
    <v-card-title primary-title>
      <div>
        <div
          class="headline"
        >
          {{ alert.user }}
        </div>
        <br>
        <h3>{{ alert.title }}</h3>
        <span>- {{ alert.message }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      <br>
      Audience Size: {{ alert.audience }}
      <br>
      Read: {{ alert.num_read }}
      <br>
      Left on: {{ new Date(alert.createdAt).toLocaleString() }}
      <br>
      Sumo Alert ID: {{ alert.sumo_id }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: { alert: { type: Object, default: () => ({ }) } }
}
</script>
