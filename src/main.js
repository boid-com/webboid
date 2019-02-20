
import Vue from 'vue'
import Quasar, * as All from 'quasar'
import router from './router'
import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
import { AddressbarColor } from 'quasar'
import LoadScript from 'vue-plugin-load-script'
import api from './api.js'
import Vuelidate from 'vuelidate'
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'
import ScatterJS, { Network } from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import { Api, JsonRpc } from "eosjs";
ScatterJS.plugins(new ScatterEOS())
var format=require('format-number')()


  async function init(){
    AddressbarColor.set('#089cfc')
  // import storePlugin from './storePlugin'

  Vue.config.productionTip = false
  Vue.use(Quasar, {
    components: All,
    directives: All
  })
  Vue.filter('longNum', function (value) {
    try {
      if (!value) return ''
      if (typeof value === 'string' || value instanceof String){
        value = parseFloat(value.replace(/[^0-9.]/g, ""))
      }
      value = value.toFixed(2)
      return format(value)

    } catch (error) {
      console.log(error)
      return value
    }


  })
  Vue.filter('removeDash', function (value) {
    if (!value) return ''
    return value.toString().replace(/-/g, ' ')
  })
  Vue.use(LoadScript);

  Vue.use(Vuelidate)


  Vue.prototype.$e = new Vue()
  Vue.prototype.$api = await api.init()
  if (__THEME === 'mat') {
    require('quasar-extras/roboto-font')
  }

require(`quasar/dist/quasar.${__THEME}.css`)

  Quasar.start(() => {
    /* eslint-disable no-new */
    new Vue({
      el: '#q-app',
      router,
      render: h => h(require('./App').default)
    })
  })
}

init().catch(console.error)
