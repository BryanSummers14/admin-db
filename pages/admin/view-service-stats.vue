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

          <!-- <v-checkbox
            v-model="admins"
            label="Admins"
          /> -->

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
      <v-chip color="green" text-color="white">
        <v-avatar class="green darken-4">
          {{ totalUsersOnboarded }}
        </v-avatar>
        Total Onboarded Users
      </v-chip>
      <v-chip color="red" text-color="white">
        <v-avatar class="red darken-4">
          {{ totalUsersWithoutSubscriptions }}
        </v-avatar>
        Total Users Without Subscriptions
      </v-chip>
      <v-layout row wrap>
        <v-flex v-for="service in allServices" :key="service.id" xs12 sm8 md4>
          <service-card
            :service="service"
            :start-date="fromDate"
            :end-date="toDate"
            :total-users="totalSubscribers"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </main>
</template>

<script>
import ServiceCard from '../../components/ServiceCard'

export default {
  middleware: 'authenticated',
  components: {
    ServiceCard
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
    allServices: [],
    totalSubscribers: 0,
    totalUsersOnboarded: 0,
    totalUsersWithoutSubscriptions: 0
  }),
  created: function () {
    this.allServices = this.$store.getters.filteredServices
    this.getAllSubscribers()
    this.getAllUsers()
    this.getUsersWithoutSubscriptions()
  },
  methods: {
    reset() {
      this.fromDate = new Date(Date.now() - 2592e6).toISOString().substr(0, 10)
      this.toDate = new Date().toISOString().substr(0, 10)
    },
    async getAllSubscribers() {
      const { data } = await this.$axios.get('/api/stats/unique-users')
      this.totalSubscribers = data.total_users
    },
    async getAllUsers() {
      const { data } = await this.$axios.get('/api/users/app-users')
      this.totalUsersOnboarded = data.reduce((acc, cur) => {
        acc += cur.onboarded
        return acc
      }, 0)
    },
    async getUsersWithoutSubscriptions() {
      const { data } = await this.$axios.get('/api/stats/no-sub-users')
      this.totalUsersWithoutSubscriptions = data.length
    }
  }
}
</script>
