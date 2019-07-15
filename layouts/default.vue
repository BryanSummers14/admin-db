<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      clipped
      fixed
      app
    >
      <v-list v-if="$store.state.auth">
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile class="logout">
          <v-list-tile-action>
            <v-icon>perm_identity</v-icon>
          </v-list-tile-action>
          <v-list-tile-content @click="logout">
            <v-list-tile-title v-text="'Log Out'" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list v-else>
        <v-list-tile
          v-for="(item, i) in authedRoutes"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<style scoped>
.logout {
  cursor: pointer;
}
.logout:hover {
  background-color: rgb(86, 86, 86);
}
</style>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      authedRoutes: [
        {
          icon: 'person_add',
          title: 'Login',
          to: '/admin/login'
        }
      ],
      items: [
        {
          icon: 'info',
          title: 'Welcome',
          to: '/admin'
        },
        {
          icon: 'person_add',
          title: 'Create App User',
          to: '/admin/create-user'
        },
        {
          icon: 'how_to_reg',
          title: 'Onboard App User',
          to: '/admin/onboard-user'
        },
        {
          icon: 'delete_sweep',
          title: 'Delete User(s)',
          to: '/admin/delete-user'
        },
        {
          icon: 'announcement',
          title: 'Create Alert',
          to: '/admin/create-alert'
        },
        {
          icon: 'delete_sweep',
          title: 'Delete Alert(s)',
          to: '/admin/delete-alert'
        },
        {
          icon: 'settings_applications',
          title: 'Configure Alert',
          to: '/admin/alert-configuration'
        },
        {
          icon: 'library_add',
          title: 'Create Subscription(s)',
          to: '/admin/create-subscriptions'
        },
        {
          icon: 'delete_sweep',
          title: 'Delete Subscription(s)',
          to: '/admin/delete-subscriptions'
        },
        {
          icon: 'create',
          title: 'Create Service',
          to: '/admin/create-service'
        },
        {
          icon: 'cached',
          title: 'Update Service',
          to: '/admin/update-service'
        },
        {
          icon: 'library_add',
          title: 'Slack Channel',
          to: '/admin/slack-channel'
        },
        {
          icon: 'library_add',
          title: 'Workplace Channel',
          to: '/admin/workplace-channel'
        },
        {
          icon: 'delete_forever',
          title: 'Delete Service',
          to: '/admin/delete-service'
        },
        {
          icon: 'add_comment',
          title: 'Create Feedback',
          to: '/admin/create-feedback'
        },
        {
          icon: 'delete_sweep',
          title: 'Delete Feedback',
          to: '/admin/delete-feedback'
        },
        {
          icon: 'person_add',
          title: 'Create Admin',
          to: '/admin/create-admin'
        },
        {
          icon: 'cached',
          title: 'Update Admin',
          to: '/admin/update-admin'
        },
        {
          icon: 'delete_sweep',
          title: 'Delete Admin(s)',
          to: '/admin/delete-admin'
        },
        {
          icon: 'view_list',
          title: 'View Alerts',
          to: '/admin/view-alerts'
        },
        {
          icon: 'dashboard',
          title: 'Stats Dashboard',
          to: '/admin/stats-dashboard'
        },
        {
          icon: 'show_chart',
          title: 'Alert Stats',
          to: '/admin/alerts-by-service-stats'
        },
        {
          icon: 'table_chart',
          title: 'Service Stats',
          to: '/admin/view-service-stats'
        },
        {
          icon: 'timeline',
          title: 'Onboarding Stats',
          to: '/admin/onboarded-stats'
        },
        {
          icon: 'trending_up',
          title: 'Subscriptions Stats',
          to: '/admin/service-subscriber-stats'
        },
        {
          icon: 'comment',
          title: 'View Feedback',
          to: '/admin/view-feedback'
        }
      ],
      title: 'In The Know'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({ path: '/admin/login' })
      })
    }
  }
}
</script>
