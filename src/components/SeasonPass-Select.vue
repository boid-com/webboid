<template lang="pug">
div.relative-position
  .row.justify-center(v-if="!global.transitWallet" style="padding:0px;")
    q-btn(color="green" @click="$root.$emit('initTransitWallet')") Scatter Login
  .row.justify-center
    h5.no-margin Pick a coin to donate
  .row.justify-center(style="margin-top:5px; min-height:30px;")
    p(style="padding-top:5px;") The Boid Power bonus changes based on popularity.
  .row.justify-center
    .col(v-for="(coin,index) of coins" :key="index" style="padding:0px; width:190px; ")
      selectbtn(:coin="coin")
  .row.justify-center(v-if="!global.transitWallet" style="padding:20px;")
    q-btn(color="green" @click="$root.$emit('initTransitWallet')") Scatter Login
  .row.justify-center(style="padding:10px;")
    q-btn(size="large" color="blue" style="font-size:25px; padding:10px;" :disable="!global.transitWallet || amountLow" @click="donate()") Donate {{parseFloat(payAmount).toFixed(4)}} {{selectedPay}}
  .row.justify-center(style="height:30px;" v-if="amountLow")  
    p.no-margin.text-red minimum donation for {{selectedPay}} is {{selectedCoin.minContribution}}

  .row.justify-center
    p Free CPU and RAM included
  .row.justify-center.center-items
    .col-auto.on-left
      q-btn(round color="amber" size="sm" style="font-size:20px;" @click="updatePayAmount(selectedPay)" flat).on-right min
    .col-auto
      q-input(v-model="payAmount" style="font-size:25px; width:150px;" type="number")
    .col-auto
      div
        h6(style="margin-top:20px;") {{selectedPay}}
    .col-auto 
      q-btn(round color="green" size="sm" style="font-size:20px;" @click="adjustPay(5)" flat ).on-right +5%
  .row.justify-center
    p You can donate from any EOS wallet, simply send tokens to "boiddonation"
  q-inner-loading(:visible="loading.selectPanel")
    q-spinner-ball(size="60px" color="blue")

      //- p {{coin}}
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .selectedTab
    background-color $blue-6
    color: white
  .selectedpay
    // background-color $-4
    // color white
    outline 1px solid $green-3
    box-shadow: 0 4px 10px 2px $green-8
</style>

<script>
import seasonPass from '../lib/seasonPass'
import selectbtn from './SeasonPass-Select-btn.vue'

export default {
  components:{selectbtn},
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){
  },
  watch:{

  }
}
</script>

