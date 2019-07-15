<template>
  <v-btn type="submit" :loading="loading" :disabled="disabled" :color="color" @click="$emit('submit')">
    <slot />
    <span slot="loader" class="custom-loader">
      <v-icon light>cached</v-icon>
    </span>
  </v-btn>
</template>

<script>
export default {
  props: { loading: Boolean, disabled: Boolean, color: { type: String, default: 'success' } }
}
</script>

<style scoped>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
