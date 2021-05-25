<template lang="pug">
div(style="padding: 20px; max-width: 1600px")
  .row.justify-center(style="margin-bottom: 20px")
    .full-width
      h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color: #089cfc; user-select: none; margin-bottom: 5px") BOID Staking
      p.text-center You can stake BOID to amplify the profitability of your generated Boid Power.
  div
    .row.justify-center
      .col-md-3
        //- q-card.bg-amber-10.text-white
          //- h6 If you receive an error during staking about an existing stake expiration time, you should unstake 100% of your existing BOID and then stake again. If you still see an error then contact us support@boid.com. Enjoy the stake break!
          //- h6 Staking is paused for maintenance.
          //- h6 Staking should be available tomorrow.
        q-card
          .light-paragraph.text-center Stake Actions
          .row.relative-position
            .col-7
              q-input(:disabled="!wallet" placeholder="BOID to stake" v-model="formattedStake")
            .col
              q-btn.absolute-bottom-right(:disabled="!wallet" @click="formattedStake = liquidBalance.toFixed(4)" color="blue" flat style="margin-bottom: 10px") 100%
          q-btn.full-width(:disabled="!wallet" @click="stake()" color="green") Stake
          div(style="height: 1 0px")
          .row.relative-position
            .col-7
              q-input(:disabled="!wallet" placeholder="BOID to unstake" v-model="formattedUnstake")
            .col
              q-btn.absolute-bottom-right(:disabled="!wallet" @click="formattedUnstake = userStake" color="blue" flat style="margin-bottom: 10px") 100%
          q-btn.full-width(:disabled="!wallet" @click="unstake()" flat) Unstake
          div(style="padding-top: 20px")
            q-btn.full-width.full-width.text-blue-9(@click="reset()" flat small v-if="wallet") change account
            div(v-if="!authenticated")
              p.strong You need to register/login to a Boid account to proceed.
              .row.justify-center
                .col-auto
                  q-btn(@click="$root.$emit('modal', 'auth')" color="green") Register/Login
            div(v-else-if="!thisUser.payoutAccount")
              q-card(color="red-4" style="padding: 10px")
                .row
                  .col-auto
                    div
                      h2(style="margin: 0px; padding-right: 15px; padding-left: 10px") !
                  .col
                    p You can only earn staking rewards if your EOS account is linked to your Boid account.
                .row.justify-center
                  q-btn(@click="$root.$emit('modal', 'updatePayoutModal')" color="green") Link EOS Account
            div(v-else-if="!wallet")
              .row.justify-center
                .col
                  p.strong.text-center You need to login to Scatter to proceed.
              .row.justify-center
                .col
                  q-btn.full-width(@click="login()" color="green") Scatter Login
            div(v-else-if="wallet.auth.accountName != thisUser.payoutAccount")
              .row.justify-center
                .col
                  h6 You are logged into Scatter using
                  h5 {{ wallet.auth.accountName }}
                  h6 But your Boid account is linked to
                  h5 {{ thisUser.payoutAccount }}
              .row.justify-center
                q-btn.full-width(@click="$root.$emit('modal', 'updatePayoutModal')" color="blue") Link different EOS Account
              .row.justify-center
                // q-btn.full-width(@click='reset()' color="green") Change Scatter Login
        q-card.relative-position(style="user-select: text" v-if="account")
          .light-paragraph.text-center EOS Wallet
          p.text-center {{ wallet.auth.accountName }}
          div Total Balance
          .row(style="padding: 10px")
            strong {{ userBalance }}
          div Liquid Balance
          .row(style="padding: 10px")
            strong {{ liquidBalance.toLocaleString(undefined, { minimumFractionDigits: 4 }) }} BOID
          div Self + Delegated Stake
          .row(style="padding: 10px")
            strong {{ userStake }} BOID
          //- q-btn(@click='reset()' color="blue") Change Account
          q-btn.absolute-top-right(@click="fillBalances(_self)" color="blue" flat round style="margin: 10px")
            q-icon(name="refresh")
          q-btn.full-width(@click="global.do.claimCPU()" color="blue" flat) Claim Free CPU

          q-inner-loading(:visible="walletLoading")
            q-spinner-ball(color="blue" size="60px")
        //- q-card(color="amber-6")
        //-   p Boid Season 2 has started. Staking/Unstaking is now locked.
        //- q-card(color="red-4")
        //-   p Boid Season 1 is currently underway. Staking/Unstaking is locked during the Boid seasons

        //- q-card
        //-   p.light-paragraph.text-center Live Network Stats
        //-   .row.justify-center
        //-     .col-auto
        //-       div(style="padding:5px;")
        //-         small.text-center Mint Difficulty
        //-         h6.text-center {{mintD}}
        //-     .col-auto
        //-       div(style="padding:5px;")
        //-         small.text-center Stake Difficulty
        //-         h6.text-center {{stakeD}}
      .col-md-8.col-xl-7
        interactivePanel(:thisUser="thisUser" :userStake="userStake")

        q-card(style="height: 100%; max-height: 400px")
          //- p.light-paragraph.text-center Recently Added Team Promotions
          //- div(style="height:430px; overflow:auto;")
          //-   .row.justify-center
          //-     promoCard.cursor-pointer.clickable.col-auto(
          //-     style="min-width:400px;"
          //-     v-for="promo of recentPromotions"
          //-     :key="promo.id" :promo="promo"
          //-     :basic="true"
          //-     @click.native="$router.push({name:'Team',params:{teamname:promo.team.name},query:{promo:promo.id}})"
          //-     )
          q-btn(@click="openURL('https://powerpools.io')" flat)
            div(style="margin: 0px")
              img.full-width(src="https://powerpools.io/powerpools-social.jpg")
              .row.justify-center(style="margin: 10px")
                h6 New Boid DEFI project is live. Lock your tokens to earn Boid Power and other rewards.
      .col-4
  // interactivePanel(v-if="!wallet | !authenticated" :thisUser="thisUser" userStake="0.00" style="margin-top:40px;")

  h6.text-orange-8(v-if="error") {{ error }}
</template>
<style lang="stylus" scoped>
.q-card {
  padding: 20px !important;
}

.scheduleCard {
  height: 114px !important;
}
</style>


<script>
import { stakeTx, taposData, unstakeTx } from "../lib/tx.js"
import state from "../lib/state"
var format = require("format-number")()
import interactivePanel from "components/interactivePanel.vue"
import { Loading, openURL } from "quasar"

async function fillBalances(v) {
  try {
    if (!v.wallet) return
    v.walletLoading = true
    v.userBalance = "0.00"
    v.userStake = "0.00"
    v.disableStake = false
    v.userBalance = (await v.rpc.get_currency_balance(global.boidtokencontract, v.wallet.auth.accountName, "BOID"))[0]
    v.totalDelegated = await window.eosjs.getTotalDelegated(v.wallet.auth.accountName)
    var selfStaked = await window.eosjs.getTotalStake(v.wallet.auth.accountName)
    console.log("SELFSTAKE", selfStaked)
    if (selfStaked) {
      console.log("selfStaked", selfStaked)
      if (parseFloat(selfStaked) > 0) v.disableStake = true
      v.userStake = selfStaked + " BOID"
    }
    setTimeout(() => {
      v.walletLoading = false
    }, 500)
  } catch (error) {
    v.walletLoading = false
    console.log(error)
    // alert(error)
  }
}

import { Toast } from "quasar"

export default {
  data() {
    return {
      openURL,
      global: state.global,
      mintD: 0,
      stakeD: 0,
      disableStake: true,
      scatter: null,
      stakeAmount: null,
      unStakeAmount: null,
      stakeTime: null,
      scatterAuth: null,
      scatterId: null,
      userBalance: "0.00",
      userStake: "0.00",
      error: null,
      walletLoading: true,
      totalDelegated: 0,
      rpc: window.eosjs.rpc,
      stakeAmount: null
    }
  },
  components: { interactivePanel },
  props: ["thisUser", "authenticated"],
  mounted() {
    // this.setEosInstance()
    this.init()
  },
  computed: {
    format,
    wallet() {
      return this.$parent.$parent.transitWallet
    },
    liquidBalance() {
      try {
        return parseFloat(this.userBalance) - this.totalDelegated
      } catch (error) {
        console.log(error)
        return 0.0
      }
    },
    account() {
      if (!this.wallet) return null
      return this.wallet.auth
    },
    formattedStake: {
      set(newData) {
        if (!newData) return (this.stakeAmount = null)
        this.stakeAmount = parseFloat(newData.replace(/[^0-9.]/g, ""))
      },
      get(data) {
        if (!this.stakeAmount) return null
        return format(this.stakeAmount)
      }
    },
    formattedUnstake: {
      set(newData) {
        if (!newData) return (this.unStakeAmount = null)
        this.unStakeAmount = parseFloat(newData.replace(/[^0-9.]/g, ""))
      },
      get(data) {
        if (!this.unStakeAmount) return null
        return format(this.unStakeAmount)
      }
    }
  },
  methods: {
    formatStakeAmount() {
      // console.log('hello')
      // console.log(this.stakeAmount.toLocaleString())
      this.stakeAmount = this.stakeAmount.toLocaleString()
    },
    fillBalances,
    async init() {
      console.log("init")
      fillBalances(this)
    },
    async login() {
      console.log("login")
      this.$root.$emit("initTransitWallet")
    },
    reset() {
      this.logout()
      setTimeout(() => {
        this.login()
      }, 1000)
    },
    logout() {
      this.wallet.terminate()
    },
    async stake() {
      this.walletLoading = true
      try {
        const result = await this.wallet.eosApi.transact(boidjs.tx.selfStake(this.wallet.auth, parseFloat(this.stakeAmount)), boidjs.tx.tapos)
        console.log(result)
        this.formattedStake = null
        Toast.create.positive("Transaction successful")
      } catch (error) {
        if (error.message && error.message.indexOf("assertion failure") > -1) {
          error.message = error.message.replace("assertion failure with message: ", "")
          console.log(error.message)
          Toast.create.negative(error.message)
        } else {
          console.log(error)
          alert(error)
        }
      }
      setTimeout(() => {
        fillBalances(this)
      }, 2000)
    },
    async unstake() {
      this.walletLoading = true
      try {
        const result = await this.wallet.eosApi.transact({ actions: [boidjs.tx.selfUnstake(this.wallet.auth, parseFloat(this.unStakeAmount)).actions[0]].filter(el => el) }, boidjs.tx.tapos)
        console.log(result)
        Toast.create.positive("Transaction successful")
      } catch (error) {
        if (error.message.indexOf("assertion failure") > -1) {
          error.message = error.message.replace("assertion failure with message: ", "")
          console.log(error.message)
          Toast.create.negative(error.message)
        } else if (error.message.indexOf("exceeded its usage quota") > -1) {
          let result = await this.wallet.eosApi.transact({ actions: [boidjs.tx.selfUnstake(this.wallet.auth, parseFloat(this.unStakeAmount)).actions[0]].filter(el => el) }, boidjs.tx.tapos)
          console.log(result)
          Toast.create.positive("Transaction successful")
        } else {
          console.log(error)
          alert(error.toString())
        }
      }
      setTimeout(() => {
        fillBalances(this)
      }, 2000)
    }
  },
  watch: {
    wallet() {
      fillBalances(this)
    },
    userStake(data) {
      this.userStake = format(parseFloat(data.replace(/[^0-9.]/g, "")))
    },
    userBalance(data) {
      // if (!data) return
      // this.userBalance = format(parseFloat(data.replace(/[^0-9.]/g, "")))
    }
  }
}
</script>

