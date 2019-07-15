<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title class="headline">
          Welcome to the In The Know Admin Site
        </v-card-title>
        <v-card-text>
          <p>In The Know is an application to notify users across platforms regarding the status and any updates for tools and services they use every day.</p>
          <p>Thank you for using the admin site</p>
          <div class="text-xs-right">
            <em><small>&mdash; Bryan Summers</small></em>
          </div>
          <hr class="my-3">
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  middleware: 'authenticated',
  created: async function () {
    await this.$store.dispatch('storeServices')
  }
}
</script>
