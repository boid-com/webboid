require(`quasar/dist/quasar.${__THEME}.css`)

import Vue from 'vue'
import Quasar, * as All from 'quasar'
import router from './router'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'

const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: ' https://api.graph.cool/simple/v1/cjairjkxk2ea90149d6i52vdh'
  }),
  cache: new InMemoryCache()
})

Vue.config.productionTip = false
Vue.use(Quasar, {
  components: All,
  directives: All
})
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
})

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    apolloProvider,
    render: h => h(require('./App').default)
  })
})
