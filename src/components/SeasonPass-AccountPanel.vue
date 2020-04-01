<template lang="pug">
div
  q-card.relative-position(v-if="global.transitWallet && global.boidWallet")
    q-btn(round small flat @click="updateAccountPanel()" color="black").absolute-top-right
      q-icon(name="refresh" )
    .row.justify-center
      h6 {{global.transitWallet.auth.accountName}}
    div
      .row.justify-center
        .col-auto.on-left
          .row
            .col-auto(style="margin-right:10px; padding-top:0px;")
              img(src="/statics/tokenicons/BOID.png" style="width:55px; margin:0px;")
            .col-auto
              h6 BOID Balance
              p {{global.boidWallet.balance.toLocaleString()}}
        .col
          .row
            .col-auto(style="margin-right:10px; padding-top:6px;")
              img(src="/statics/images/BoidPower.svg" style="width:20px; margin:0px;")
            .col-auto
              h6 Boid Power
              p {{global.boidWallet.totalPower.toFixed(0)}}
      .row
        .col-auto.on-left
          .row
            .col-auto(style="margin-right:10px; padding-top:0px;")
              img(src="/statics/images/BoidStake.png" style="width:55px; margin:0px;")
            .col-auto
              h6.no-margin BOID Stake
              .row
                .col-auto.on-left
                  small from self
                  p.no-margin {{global.boidWallet.allSelfStake.toLocaleString()}}
                  small from others
                  p.no-margin {{global.boidWallet.externalStake}}
                .col-auto
                  small powered
                  p.no-margin {{global.poweredStake.toLocaleString()}}
                  small max powered
                  p.no-margin(v-if="global.pendingClaim") {{global.pendingClaim.maxPoweredStake}}
        //- .col
          .row
            //- .col-auto(style="margin-right:10px; padding-top:0px;")
            //-   img(src="/statics/BoidPoweredStake.png" style="width:55px; margin:0px;")
            //- .col-auto
            //-   h6.no-margin Powered Stake
            //-   p.no-margin {{global.poweredStake.toLocaleString()}}
            //-   small.text-grey-8 Max Powered Stake
            //-   p.no-margin.text-grey-8(v-if="global.pendingClaim") {{global.pendingClaim.maxPoweredStake}}
        .col
          q-card(style="padding:0px; margin:10px;" v-if="true").shadow-1.bg-grey-2
            .row.justify-center
              .col-auto(style="margin-left:0px;")
                h6 Pending Claim
            .row
              .col
                .row.justify-center
                  small with powered stake
                .row.justify-center
                  p.no-margin(v-if="global.pendingClaim") {{global.pendingClaim.total.toLocaleString()}} BOID
              .col
                .row.justify-center
                  small with max powered stake
                .row.justify-center
                  p.no-margin(v-if="global.maxPendingClaim") {{global.maxPendingClaim.total.toLocaleString()}} BOID
            .row(style="margin:10px;").justify-center
              .col
                q-btn.full-width(color="green" flat @click="$router.push({name:'Stake'})") stake
              .col
                q-btn.full-width(color="blue" flat @click="claim()") claim
    q-inner-loading(:visible="loading.accountPanel")
      q-spinner-ball(size="60px" color="blue")
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    padding 20px
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
    await this.global.do.refreshAccountData()
    this.loading.accountPanel = false
  },
  watch:{
    'global.transitWallet'(){
      this.loading.accountPanel = true
      this.global.do.refreshAccountData()
      this.loading.accountPanel = false

    }
  }
}
</script>

