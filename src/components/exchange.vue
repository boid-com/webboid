<template lang="pug">
  div(style="min-height:300px; min-width:300px;")
    h4( v-if="showHeading" style="margin-bottom:30px;").text-blue.text-center BOID Exchanges
    div(v-if="!showCarbon")
      h6.text-center BOID/EOS
      .row.justify-center
        q-btn(flat @click="openURL('https://newdex.io/trade/BOID_EOS')") newdex
        q-btn(flat @click="openURL('https://eosdaq.com/exchange/BOID_EOS')") eosdaq
        q-btn(flat @click="openURL('https://dexeos.io/trade/?market=eos&symbol=BOID')") dexeos
        q-btn(flat @click="openURL('https://chaince.com/trade/boideos')") Chaince
      div(style="height:20px;")
      h6.text-center BOID/CUSD
      .row.justify-center
        q-btn(flat @click="openURL('https://dexeos.io/trade/?market=cusd&symbol=BOID')") Dexeos
    q-btn( v-if="!showCarbon" color="green" @click="openURL('https://boid.carbon.money/')").full-width.no-margin.absolute-bottom get Carbon
</template>

<script>
import { openURL } from 'quasar'
export default {
  data(){
    return {
      showCarbon:false,
      
    }
  },
  methods:{
    openURL
  },
  props:{
    showHeading: {
      type: Boolean,
      default:true
    }
  }

}
</script>

<style scoped lang="stylus">


</style>

