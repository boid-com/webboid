<template lang="pug">
div(style="padding:20px; max-width: 1900px;")
  .row.justify-center
    .col-12(style="max-width: 1000px;")
      div(style="margin:20px;")
        h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px; padding:10px;") Boid NFT Donation
        .row.justify-center
          div Donate to support Boid and you have a chance to be rewarded with a special edition Boid Tesla NFT!
    heropanel(style="max-width: 1200px;")
  .row.justify-center
    .col(style="max-width:1480px;")
      trackerpanel
  .row.justify-center
    .col.col-xs-12.col-sm-5.col-md-12.col-lg-3(style="max-width:400px; min-width:350px; margin-top:60px;").relative-position
      q-btn(round small flat @click="updateAccountPanel(),getContributor(),checkFreeCPU()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Track your progress
      .row.justify-center(style="margin:10px; min-height:40px;")
        .col
          p.text-center Donations of #[strong any size] level up your account equally.
      progresspanel
      accountpanel(style="margin-top:10px;")
    .col.col-xs-12.col-md-12.col-lg-5(style="max-width:550px; margin-right:40px; margin-left:40px; margin-top:60px;").relative-position
      q-btn(round small flat @click="getCoins()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Pick a coin to donate
      .row.justify-center(style="margin-top:5px; min-height:30px;")
        p(style="padding-top:5px;") The Boid Power bonus changes based on popularity.
      selector
    .col.col-xs-12.col-sm-12.col-md-12.col-lg-3.relative-position(style="min-width:350px; margin-top:60px;")
      q-btn(round small flat @click="getLeaderboard()" color="black").absolute-top-right
        q-icon(name="refresh" )
      .row.justify-center
        h5.no-margin Contributors
      .row.justify-center(style="margin:10px; min-height:40px;")
        p Higher USD Contributions = lower NFT mint #
      leaderboard
    .col.col-lg-8(style="max-width:1200px; margin-top:45px;")
      .row.justify-center
        h5 Details
      .row.justify-center
        a(target="_blank" href="https://boidcom.medium.com/boid-breaches-barriers-offering-the-first-nft-on-eos-with-real-utility-8cf5d7620570") Read the announcement
      .row.justify-center(style="margin:6px; min-height:20px;")
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

