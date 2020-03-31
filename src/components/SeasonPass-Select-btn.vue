<template lang="pug">
q-card.cursor-pointer.relative-position(v-ripple="{ color: 'green' }" style="margin:10px; padding:0px; min-width:100px; zoom: 1;" :class="{selectedpay:selectedPay === coin.symbol}" @click="selectedPay = coin.symbol")
  .row.justify-center.center-items(style="width:100%; padding:0px;")
    .col-auto(style="height:50px;")
      img(:src="coin.img" style="height:100%; padding:10px;")
    .col-auto
      p.no-margin(style="padding-top:15px;") {{coin.symbol}}
  .row.justify-center
    .col-auto
      p.no-margin {{coin.minContribution}} 
  .row.justify-center.no-wrap(style="margin-bottom:0px;")
    small minimum

      //- small.text-black.light-paragraph Multiplier
  .row.justify-center(style="padding-top:10px").items-center
    .col-auto
      .row.no-wrap.justify-center
        .col-auto.on-left.text-amber-7.round-borders(style="border-radius:39px; padding:5px;")
          h6.no-margin {{coin.power_reward_multiplier}}x
    .col-auto.center-items(style="margin-right:10px;")
      img(src="/statics/images/BoidPower.svg" style="width:15px; margin:0px;")
    .col-auto
      p.no-margin + {{calcPowerBonus(parseFloat(coin.availablePower),coin.power_reward_multiplier)}}
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
    // background-color $-4
    // color white
    outline 1px solid $green-3
    box-shadow: 0 4px 10px 2px $green-8
</style>

<script>
import seasonPass from '../lib/seasonPass'


export default {
  props:['coin'],
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

