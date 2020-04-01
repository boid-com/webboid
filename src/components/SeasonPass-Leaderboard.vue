<template lang="pug">
div
  q-card.relative-position
    div(style="padding:20px; padding-bottom:0px;")
      p.no-margin leaderboard
    .row(style="padding-left:20px;")
      .col-1.on-left
        small Rank
      .col.on-right 
        small Account
      .col
        small Donations
      .col
        small USD Total
    .row(style="max-height:800px; overflow:auto; padding:10px;").full-width
      .col-12(v-for="user of leaderboard" style="padding:10px;")
        .row.no-wrap
          .col-2
            h6.light-pragraph {{user.level}}
          .col-5
            h6 {{user.account}}     
          .col-2.on-right
            h6 ${{user.usdValue.toFixed(2)}}    

        .row
          .col-auto(v-for="coin of user.coins").on-left
            //- small {{parseFloat(coin.split(' ')[0]).toLocaleString(undefined,{ maximumFractionDigits: 0})}} {{coin.split(' ')[1]}}
    q-inner-loading(:visible="loading.leaderboard")
      q-spinner-ball(size="60px" color="blue")
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    // padding 20px
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
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  async mounted (){
    this.getLeaderboard()
  },
  watch:{

  }
}
</script>

