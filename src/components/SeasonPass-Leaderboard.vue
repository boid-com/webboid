<template lang="pug">
div.relative-position
  q-card(v-if="leaderboard")
    div(style="padding:20px; padding-bottom:0px;")
      .row
        .col
          p.no-margin Global Statistics
    .row
      .col(style="padding:10px;")
        .row.justify-center
          h6 ${{totalEOSContributed}}
        .row.justify-center
          small total contributed 
      .col(style="padding:10px;")
        .row.justify-center
          h6 {{leaderboard.length}}
        .row.justify-center
          .col-auto
            small unique contributors
      .col(style="padding:10px;")
        .row.justify-center
          h6 {{totalPowerGranted}}
        .row.justify-center
          .col-auto
            small power granted
    .row
      //- q-btn.full-width( color="teal" small @click="openURL('https://stats.boid.com/d/hGvA6yrZz/donations?orgId=1&from=now-30d&to=now&refresh=15m')") advanced statistics

  q-card
    div(style="padding:20px; padding-bottom:0px;")
      p.no-margin Leaderboard
    .row(style="padding-left:20px;")
      .col-1.on-left
        small Rank
      .col 
        small Account
      .col-auto(style="padding-left:30px;")
        small level
      .col-auto.on-right.on-left
        small Donations
      .col.on-left
        small USD Total
    .row.full-width.content-start(style="height:634px; overflow:auto; padding:10px;")
      .col-12(v-for="(user,index) of leaderboard" style="padding:10px;")
        .row.no-wrap
          .col-auto.on-left
            h6.light-pragraph {{index+1}}
          .col-4.on-left
            h6 {{user.account}}  
          .col-1.on-right.self-end
            h6 {{user.level}}   
          .col-1.on-right.self-end
            h6 {{user.donations}}   
          .col-auto.on-right.self-end(style="padding-left:30px;")
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
    // this.getLeaderboard()
  },
  watch:{

  }
}
</script>

