<template>
  <main>
    <v-alert
      :value="failure"
      type="error"
    >
      Oops, something went wrong. {{ errMessage }}
    </v-alert>
    <v-layout justify-center align-center>
      <v-flex xs12 sm8>
        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
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

          <v-checkbox
            v-model="admins"
            label="Admins"
          />

          <loader-button
            :loading="loading"
            :disabled="(!valid || loading)"
            color="success"
            @submit="submit"
          >
            Get Alerts
          </loader-button>

          <v-btn
            color="error"
            @click="reset"
          >
            Reset Form
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
    <v-container fluid grid-list-sm>
      <v-layout row wrap>
        <v-flex v-for="alert in mergedAlerts" :key="alert.id" xs12 sm6 md4>
          <alert-card :alert="alert" />
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</template>

<script>
import AlertCard from '../../components/AlertCard'
import LoaderButton from '../../components/LoaderButton'

export default {
  middleware: 'authenticated',
  components: {
    AlertCard,
    LoaderButton
  },
  data: () => ({
    valid: true,
    admins: false,
    menu: false,
    menu2: false,
    fromDate: new Date(Date.now() - 2592e6).toISOString().substr(0, 10),
    toDate: new Date().toISOString().substr(0, 10),
    currentDate: new Date().toISOString().substr(0, 10),
    loading: false,
    failure: false,
    errMessage: '',
    allAlerts: [],
    mergedAlerts: []
  }),
  methods: {
    async submit() {
      try {
        this.loading = true
        const dateRange = Object.assign(
          {},
          { startDate: this.fromDate },
          { endDate: this.toDate }
        )
        const { data: allAlertData } = await this.$axios.get(
          `/api/stats/all-alerts?admins=${this.admins}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        )
        this.allAlerts = allAlertData
        const { data: readAlertData } = await this.$axios.get(
          `/api/stats/read-alerts?admins=${this.admins}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
        )
        this.readAlerts = readAlertData
        this.mergeAlertData(this.mapReadAlerts())
        this.loading = false
      } catch (err) {
        this.loading = false
        this.alertError()
      }
    },
    reset() {
      this.fromDate = new Date(Date.now() - 2592e6).toISOString().substr(0, 10)
      this.toDate = new Date().toISOString().substr(0, 10)
      this.admins = false
      this.allAlerts = []
      this.mergedAlerts = []
    },
    mapReadAlerts() {
      const readAlertMap = new Map()
      this.readAlerts.forEach(({ alert_id, num_read }) => { readAlertMap.set(alert_id, num_read) })
      return readAlertMap
    },
    mergeAlertData(readAlertMap) {
      this.mergedAlerts = this.allAlerts.map((alert) => {
        alert.num_read = readAlertMap.get(alert.id) || 0
        return alert
      })
    },
    alertError() {
      this.failure = true
      setTimeout(() => {
        this.failure = false
      }, 5000)
    }
  }
}
</script>
