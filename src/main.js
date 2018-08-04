require(`quasar/dist/quasar.${__THEME}.css`)

import Vue from 'vue'
import Quasar, * as All from 'quasar'
import router from './router'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import { AddressbarColor } from 'quasar'
AddressbarColor.set('#089cfc')
// import storePlugin from './storePlugin'

Vue.config.productionTip = false
Vue.use(Quasar, {
  components: All,
  directives: All
})
Vue.filter('removeDash', function (value) {
  if (!value) return ''
  return value.toString().replace('-', ' ')
})

import Vuelidate from 'vuelidate'
Vue.use(Vuelidate)

Vue.prototype.$e = new Vue()

if (__THEME === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'

const HelloJs = require('hellojs/dist/hello.all.min.js');
const VueHello = require('vue-hellojs');

HelloJs.init({
  google: '474818646334-kgl6rsvpflvksrev5c0jvh6eem1dd9aj.apps.googleusercontent.com'
}, {
  redirect_uri: 'authcallback/'
});
Vue.use(VueHello, HelloJs);

Quasar.start(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#q-app',
    router,
    render: h => h(require('./App').default)
  })
})
