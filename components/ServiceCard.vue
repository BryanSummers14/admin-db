<template>
  <v-card color="blue-grey darken-2" class="white--text">
    <v-card-title primary-title>
      <div>
        <div
          class="headline"
        >
          {{ service.name }}
        </div>
        <span>Total Subscribers: {{ totalSubscribers + ' out of ' + totalUsers }}</span>
      </div>
    </v-card-title>
    <v-card-text>
      Total Alerts: {{ totalAlerts }}
      <br>
      Incident Alerts: {{ outageAlerts }}
      <br>
      Promotion Alerts: {{ onlineAlerts }}
      <br>
      Product Releast Alerts: {{ updateAlerts }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    service: { type: Object, default: () => {} },
    startDate: { type: String, default: '' },
    endDate: { type: String, default: '' },
    totalUsers: { type: Number, default: 0 }
  },
  data: () => ({
    loading: true,
    totalSubscribers: 0,
    totalAlerts: 0,
    onlineAlerts: 0,
    outageAlerts: 0,
    updateAlerts: 0
  }),
  watch: {
    startDate: function (_date) {
      this.getSubscriptionStats()
      this.getAlertStats()
    },
    endDate: function (_date) {
      this.getSubscriptionStats()
      this.getAlertStats()
    }
  },
  created: function () {
    this.getSubscriptionStats()
    this.getAlertStats()
  },
  methods: {
    async getSubscriptionStats() {
      try {
        const { data } = await this.$axios.get(
          `/api/stats/service-subscriptions/${this.service.id}`
        )
        this.totalSubscribers = data.total_subscribers
      } catch (err) {
        console.log(err)
      }
    },
    async getAlertStats() {
      try {
        const { data } = await this.$axios.get(
          `/api/stats/alerts/${this.service.id}?startDate=${this.startDate}&endDate=${this.endDate}`
        )
        this.totalAlerts = data.totalAlerts
        this.onlineAlerts = data.onlineAlerts
        this.outageAlerts = data.outageAlerts
        this.updateAlerts = data.updateAlerts
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
