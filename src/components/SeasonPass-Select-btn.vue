<template lang="pug">
div.cursor-pointer.relative-position.shadow-2(v-ripple style="margin:10px; padding:0px; width:130px; height:150px; zoom: 1; border-radius:30px; user-select:none;" :class="{selectedpay:selectedPay === coin.symbol}" @click="updateSelectedPay(coin.symbol)")
  .row.justify-center.center-items(style="width:100%; padding-top:3px;").no-wrap
    .col-auto(style="height:50px;")
      img(:src="coin.img" style="height:100%; padding:10px;")
    .col-auto.on-left
      p.no-margin(style="padding-top:15px;") {{coin.symbol}}
  .row.justify-center
    .col-auto
      p.no-margin {{coin.minContribution}} 
  .row.justify-center.no-wrap(style="margin-bottom:0px;")
    small minimum
  .row.justify-center(style="padding-top:10px").items-center
    .col-auto.center-items(style="margin-right:5px;")
      img(src="/statics/images/BoidPower.svg" style="width:15px; margin:0px;")
    .col-auto.text-green.strong
      p.no-margin + {{calcPowerBonus(parseFloat(coin.availablePower),coin.power_reward_multiplier).toFixed(0)}}
  .row.justify-center
    div(style="width:80px;")
      div(style="padding:1px;")
      q-progress(:percentage="reservior" style="height:5px;" color="amber-6") 
      q-tooltip Charge: {{reservior}}%

</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    // padding 10px !important
    padding-bottom 5px !important
  .selectedTab
    background-color $blue-6
    color: white
  .selectedpay
    // background-color $blue-1
    // color white
    // outline 6px solid $green-1
    box-shadow: 0 6px 8px 2px $blue-4
</style>

<script>
import seasonPass from '../lib/seasonPass'
function convertRange( value, r1, r2 ) { 
    return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
}

export default {
  props:['coin'],
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:{
    reservior(){
      if(!this.coin)return 0
      return convertRange(this.coin.availablePower,[0,this.coin.powerCap],[0,100]).toFixed(0)
    },
    ...seasonPass.computed
  },
  mounted(){

  },
  watch:{
  }
}
</script>

