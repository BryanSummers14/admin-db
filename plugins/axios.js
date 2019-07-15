export default function ({ $axios, store }) {
  $axios.onRequest((config) => {
    $axios.setHeader('X-Auth-Token', store.state.token)
  })
}
