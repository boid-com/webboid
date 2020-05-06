<template lang="pug">
div(style="padding:20px; max-width: 1900px;")
  .row.justify-center
    .col-12(style="max-width: 1000px;")
      div(style="margin:20px;")
        h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px; padding:10px;") KROWN IBC Birthday Contest
        .row.justify-center
          p We need your help. Support BOID Teams with a contribution towards COVID-19 Research while helping test out the new EOSIO Superhighway IBC.  The more donations you contribute the higher and faster you can Level Up. This will give you more entries into the Event Drawing!
          p Contribute from any EOS wallet, simply send any of the whitelisted tokens to "boiddonation"
          p This is brought to you in part by the KROWN DAC Community in celebration of their 1st Birthday!
    heropanel(style="max-width: 1200px;")
  .row.justify-center
    .col(style="max-width:1480px;")
      trackerpanel
  .row.justify-center
    .col.col-xs-12.col-sm-5.col-md-12.col-lg-3(style="max-width:400px; min-width:400px; margin-top:60px;").relative-position
      q-btn(round small flat @click="updateAccountPanel(),getContributor(),checkFreeCPU()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Track your progress
      .row.justify-center(style="margin:10px; min-height:40px;")
        .col
          p.text-center Donations of any size help level up your account equally.
      progresspanel
      accountpanel(style="margin-top:20px;")
    .col.col-xs-12.col-md-12.col-lg-5(style="max-width:550px; margin-right:40px; margin-left:40px; margin-top:60px;").relative-position
      q-btn(round small flat @click="getCoins()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Pick a coin to donate
      .row.justify-center(style="margin-top:5px; min-height:30px;")
        p(style="padding-top:5px;") The Boid Power bonus changes based on popularity.
      selector
    .col.col-xs-12.col-sm-12.col-md-12.col-lg-3.relative-position(style="min-width:400px; margin-top:60px;")
      q-btn(round small flat @click="getLeaderboard()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Contributors
      .row.justify-center(style="margin:10px; min-height:40px;")
        p Increases your level to increase your chance to win.
      leaderboard
    .col.col-lg-8(style="max-width:1200px; margin-top:60px;")
      .row.justify-center
        h5.no-margin Details
      .row.justify-center(style="margin:10px; min-height:40px;")
      passpanel(style="min-width:300px;")
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    // padding 20px !important
    // padding-bottom 5px !important
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
import selector from './SeasonPass-Select'
import accountpanel from './SeasonPass-AccountPanel'
import progresspanel from './SeasonPass-Progress.vue'
import leaderboard from './SeasonPass-Leaderboard.vue'
import heropanel from './SeasonPass-Hero.vue'
import passpanel from './SeasonPass-Pass.vue'
import trackerpanel from './SeasonPass-Tracker.vue'

export default {
  components:{selector,accountpanel,progresspanel,leaderboard,heropanel,passpanel,trackerpanel},
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){
    this.loading.selectPanel = true
    this.getAll()
    this.updatePayAmount(this.selectedPay)
    this.getBalances()
    this.loading.selectPanel = false
    this.checkFreeCPU()
  },
  watch:{
    async 'global.transitWallet'(){
      if(!this.global.transitWallet) return
      this.loading.selectPanel = true
      console.log('Detected transitwallet update in SeasonPass')
      await this.getContributor(this.global.transitWallet.auth.accountName)
      this.updatePayAmount()
      this.checkFreeCPU()
      // this.global.do.checkCPUClaim()
      this.loading.selectPanel = false
    },
    selectedPay(val){
      if (!val)return
      this.updatePayAmount(val)
    },coins(val){
      if (!val) return
      this.checkAmount()
      this.getBalances()
    },
    payAmount(val){
      if (!val || isNaN(val)||val[val.length - 1] =='.' || val[val[val.length - 1] == 0]) return
      const result = parseFloat(parseFloat(val).toFixed(4))
      if (isNaN(result)) this.payAmount = 0
      else this.payAmount = result
    }
  }
}
</script>

