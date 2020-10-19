<template lang="pug">
div.relative-position
  .row.justify-center
    .col(v-for="(coin,index) of coins" :key="index" style="padding:0px;")
      selectbtn(:coin="coin")
  .row.justify-center(v-if="!global.transitWallet" style="padding:20px;")
    q-btn(color="green" @click="$root.$emit('initTransitWallet')") Scatter Login
  .row.justify-center(style="padding:10px; margin-top:20px;")
    q-btn(size="large" color="blue" style="font-size:25px; padding:10px; " :disable="!global.transitWallet || amountLow" @click="donate()") Donate {{payAmount.toLocaleString(undefined,{ minimumFractionDigits: 4,maximumFractionDigits:4 })}} {{selectedPay}}
  .row.justify-center(style="height:30px;" v-if="amountLow")  
    p.no-margin.text-red minimum donation for {{selectedPay}} is {{selectedCoin.minContribution}}
  //- .row.justify-center
  //-   p Claim your free CPU on 
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
    this.getCoinsInterval = setInterval(()=>this.getCoins(true),20000)
  },
  destroyed(){
    console.log('destroyed')
    clearInterval(this.getCoinsInterval)
  },
  watch:{

  }
}
</script>

