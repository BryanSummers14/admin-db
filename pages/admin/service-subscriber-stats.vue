<template>
  <v-layout column>
    <v-flex xs12 sm8>
      <v-alert
        :value="failure"
        type="error"
      >
        Oops, something went wrong. {{ errMessage }}
      </v-alert>
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
        <v-checkbox
          v-model="admins"
          label="Admins"
        />

        <loader-button :loading="loading" :disabled="(!valid || loading)" color="success" @submit="submit">
          Get Subscription Stats
        </loader-button>

        <v-btn color="error" @click="reset">
          Reset Form
        </v-btn>
      </v-form>
    </v-flex>
    <v-flex v-show="success" xs12>
      <v-sheet
        id="chart"
        class="v-sheet--offset mx-auto"
        elevation="12"
        max-width="calc(100% - 32px)"
      />
      <v-btn color="info" :disabled="!values.length" @click="savePDF()">
        Export as PDF
      </v-btn>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.onboard-data {
  margin-top: 36px;
}
</style>

<script>
import * as Highcharts from 'highcharts'
import jsPDF from 'jspdf'
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
    failure: false,
    errMessage: '',
    menu: false,
    menu2: false,
    fromDate: new Date(Date.now() - 2592e6).toISOString().substr(0, 10),
    toDate: new Date().toISOString().substr(0, 10),
    currentDate: new Date().toISOString().substr(0, 10),
    admins: false,
    values: [],
    labels: []
  }),
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.values = []
        this.labels = []
        const newStatReq = {
          admins: this.admins,
          startDate: this.fromDate,
          endDate: this.toDate
        }
        try {
          const { data } = await this.$axios.get(`/api/stats/subscriptions-by-service?admins=${newStatReq.admins}&startDate=${newStatReq.startDate}&endDate=${newStatReq.endDate}`)
          data.forEach(this.getValue)
          this.success = true
          this.createChart()
          this.loading = false
        } catch (err) {
          this.loading = false
          console.log(err)
          this.errMessage = err.message
          this.alertFailure()
        }
      }
    },
    getValue({ users, service }) {
      this.values.push(users)
      this.labels.push(service)
    },
    reset() {
      this.fromDate = new Date(Date.now() - 2592e6).toISOString().substr(0, 10)
      this.toDate = new Date().toISOString().substr(0, 10)
      this.admins = false
      this.success = false
    },
    alertFailure() {
      this.failure = true
      setTimeout(() => {
        this.failure = false
      }, 5000)
    },
    createChart() {
      Highcharts.chart('chart', {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Subscribers by Service'
        },
        xAxis: {
          categories: this.labels,
          crosshair: true
        },
        yAxis: {
          min: 0,
          title: {
            text: '# of Subscribers'
          }
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [{
          name: 'Subscribers',
          data: this.values
        }]
      })
    },
    savePDF() {
      const doc = new jsPDF()
      const usersText = []
      doc.text(`Subscribers By Service for ${this.fromDate} - ${this.toDate}`, 10, 10)
      for (let i = 0, total = this.values.length; i < total; i++) usersText.push(`${this.labels[i]}: ${this.values[i]}`)
      doc.text(usersText, 20, 20)
      doc.save(`subscribers-by-service_${new Date().toDateString()}.pdf`)
    }
  }
}
</script>
