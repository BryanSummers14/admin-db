<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout row justify-space-between wrap>
          <v-flex xs12 sm5>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <v-text-field
                slot="activator"
                v-model="fromDate"
                label="From Date"
                prepend-icon="event"
                required
                :rules="[v => !!v || 'From Date is required']"
                readonly
              />
              <v-date-picker v-model="fromDate" :max="currentDate" @input="menu = false" />
            </v-menu>
          </v-flex>
          <v-flex xs12 sm5>
            <v-menu
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="scale-transition"
              offset-y
              full-width
            >
              <v-text-field
                slot="activator"
                v-model="toDate"
                label="To Date"
                prepend-icon="event"
                required
                :rules="[v => !!v || 'To Date is required']"
                readonly
              />
              <v-date-picker v-model="toDate" :min="currentDate" @input="menu2 = false" />
            </v-menu>
          </v-flex>
        </v-layout>
        <v-select v-model="selectedService" :items="allServices" label="Service" />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Get Stats
        </loader-button>

        <v-btn color="error" @click="reset">
          Reset Form
        </v-btn>
      </v-form>
      <div v-if="success" class="alert-data-chips">
        <v-chip
          outline
          color="primary"
        >
          Total Alerts: {{ totalAlerts }}
        </v-chip>
        <v-chip
          outline
          color="success"
        >
          Online Alerts: {{ onlineAlerts }}
        </v-chip>
        <v-chip
          outline
          color="red"
        >
          Outage Alerts: {{ outageAlerts }}
        </v-chip>
        <v-chip
          outline
          color="info"
        >
          Update Alerts: {{ updateAlerts }}
        </v-chip>
      </div>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.alert-data-chips {
  margin-top: 36px;
  text-align: center;
}
</style>

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
    date: new Date().toISOString().substr(0, 10),
    menu: false,
    menu2: false,
    fromDate: '',
    toDate: new Date().toISOString().substr(0, 10),
    currentDate: new Date().toISOString().substr(0, 10),
    selectedService: 0,
    allServices: [],
    totalAlerts: 0,
    onlineAlerts: 0,
    outageAlerts: 0,
    updateAlerts: 0
  }),
  created: function () {
    this.allServices = this.$store.getters.filteredServices.map(_val => ({ value: _val.id, text: _val.name }))
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const newStatReq = {
          serviceId: this.selectedService,
          startDate: this.fromDate,
          endDate: this.toDate
        }
        const { data } = await this.$axios.get(`/api/stats/range/service-alerts/${newStatReq.serviceId}/${newStatReq.startDate}/${newStatReq.endDate}`)
        const { totalAlerts, onlineAlerts, outageAlerts, updateAlerts } = data
        this.totalAlerts = totalAlerts
        this.onlineAlerts = onlineAlerts
        this.outageAlerts = outageAlerts
        this.updateAlerts = updateAlerts
        this.loading = false
        this.success = true
      }
    },
    reset() {
      this.$refs.form.reset()
      this.success = false
    }
  }
}
</script>
