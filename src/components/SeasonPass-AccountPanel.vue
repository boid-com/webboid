<template lang="pug">
div
  q-card.relative-position(v-if="global.transitWallet && global.boidWallet")
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
              p {{parseFloat(global.boidWallet.totalPower.toFixed(0)).toLocaleString()}}
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
                  p.no-margin(v-if="global.pendingClaim") {{global.pendingClaim.maxPoweredStake.toLocaleString()}}

        .col
          div(style="padding:0px; margin:10px;" v-if="true")
            .row.justify-center
              .col-auto(style="margin-left:0px;")
                h6 Pending Claim
            .row
              .col
                .row.justify-center
                  small with max powered stake
                .row.justify-center
                  p.no-margin(v-if="global.maxPendingClaim") {{global.maxPendingClaim.total.toLocaleString()}} BOID
              .col
                .row.justify-center
                  small with powered stake
                .row.justify-center
                  p.no-margin(v-if="global.pendingClaim") {{global.pendingClaim.total.toLocaleString()}} BOID
            .row(style="margin:10px;").justify-center
              .col
                q-btn.full-width(color="green" flat @click="$router.push({name:'Stake'})") stake
              .col
                q-btn.full-width(color="blue" flat @click="claim()") claim
      q-inner-loading(:visible="loading.accountPanel")
        q-spinner-ball(size="60px" color="blue")
  q-card.relative-position(style="margin-top:20px;" v-if="global.boidWallet")
    p Claim Free CPU
    div(style="padding:10px;" v-if="global.cpuClaimStatus").bg-grey-3
      p.no-margin.text-grey-9 {{global.cpuClaimStatus}}
    div(style="padding:10px;" v-else).bg-grey-3
      p.no-margin.text-grey-9 Active Boid Users can click "Claim CPU" to claim free CPU daily.
    .row
      .col(style="padding:0px;").on-left
        .row.justify-center 
          q-btn(style="margin:10px;" color="green" @click="claimCPU()" :disable="Boolean(global.cpuClaimStatus)") Claim CPU
        small If you are an active Boid User you can get free CPU on your EOS account.
      .col(style="padding:0px;").on-right
        .row.justify-center 
          q-btn(style="margin:10px;" color="blue" @click="openURL('https://t.me/Boidcom_official')") Join Telegram
        small If you are a new user you can join the Telegram and ask an admin for some free CPU.
    q-inner-loading(:visible="loading.cpuClaim")
      q-spinner-ball(size="60px" color="blue")
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    padding 20px
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

