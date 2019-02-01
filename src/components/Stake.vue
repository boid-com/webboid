<template lang="pug">
div(style="padding:20px; max-width: 1600px;")
  .row.justify-center(style="margin-bottom:20px;")
    .col-auto
      h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") BOID Staking
      p You can now stake BOID tokens to amplify the profitability of your generated Boid Power. 
  div(v-if="!authenticated")
    p.text-center you need to register/login to a Boid account to proceed.
    .row.justify-center
      .col-auto
        q-btn(@click="$root.$emit('modal','auth')" color="green") Register/Login 
  div(v-else-if="!thisUser.payoutAccount")  
    q-card(color="red-4" style="padding:10px;")
      .row
        .col-auto
          div
            h2(style="margin:0px; padding-right:15px; padding-left:10px;") ! 
        .col 
          p You can only earn staking rewards if your EOS account is linked to your Boid account.
      .row.justify-center
        q-btn(color="green" @click="$root.$emit('modal','updatePayoutModal')") Link EOS Account
  div(v-else-if="!account" )
    .row.justify-center 
      .col-auto
        p you need to login to Scatter to proceed.
    .row.justify-center 
      .col-auto
        q-btn(@click='login()' color="green") Scatter Login
  div(v-else-if="account.name != thisUser.payoutAccount")
    .row.justify-center
      .col-auto
        h6 You are logged into Scatter using 
        h5 {{account.name}}
        h6 But your Boid account is linked to 
        h5 {{thisUser.payoutAccount}}
    .row.justify-center
      .col-auto
        q-btn.on-left( color="blue" @click="$root.$emit('modal','updatePayoutModal')") Link different EOS Account
        q-btn(@click='reset()' color="green") Scatter Login

  div(v-else)
    .row.justify-center
      .col-md-3
        q-card
          .light-paragraph.text-center Stake Actions
          .row.relative-position
            .col-7
              q-input(v-model="formattedStake" :disabled="disableStake" placeholder="BOIDs to stake")
            .col
              q-btn.absolute-bottom-right(
                @click="formattedStake = liquidBalance"
                style="margin-bottom:10px;" small flat color="blue" :disabled="disableStake") all
          q-btn.full-width(color="green" :disabled="disableStake" @click="stake()") Stake
          div(style="height:1 0px;")
          q-btn.full-width(:disabled="!disableStake" flat @click="unstake()") Unstake
        q-card.relative-position
          .light-paragraph.text-center EOS Wallet
          p.text-center {{account.name}}
          p Total Balance
            h6 {{userBalance}} BOID
          p Liquid Balance
            h6 {{liquidBalance}} BOID
          p Staked
            h6 {{userStake}} BOID
          //- q-btn(@click='reset()' color="blue") Change Account
          q-btn.absolute-top-right(
            round
            flat 
            color="blue"
            style="margin:10px;"
            @click="fillBalances(_self)")
            q-icon(name="refresh")
          q-inner-loading(:visible="walletLoading")
            q-spinner-ball(size="60px" color="blue")
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
        q-card
          p.light-paragraph.text-center 2019 Q1 - Q2 Season Schedule
          .row.relative-position
            .col-11
              div.absolute-center.gt-sm(style="height:5px; width:80%; background-color:grey; z-index:-1;")
            .col.scheduleCard
              q-card.scheduleCard(color="green")
                p.text-center Break
                p.text-center 1/1 - 2/7
            .col
              q-card.bg-white.scheduleCard
                p.text-center Season 0
                p.text-center 2/7 - 4/7
            .col
              q-card.bg-white.scheduleCard
                p.text-center Break
                p.text-center 4/7 - 4/21
            .col
              q-card.bg-white.scheduleCard
                p.text-center Season 1
                p.text-center 4/21 - 6/21
        interactivePanel(:thisUser="thisUser" :userStake="userStake")
      .col-4
  interactivePanel(v-if="!account | !authenticated" :thisUser="thisUser" userStake="0.00" style="margin-top:40px;")



  h6.text-orange-8(v-if="error") {{error}}

</template>
<style lang="stylus" scoped>
  .q-card
    padding 20px !important
  .scheduleCard
    height 114px !important
</style>


<script>
import ScatterJS, { Network } from "scatterjs-core"
import ScatterEOS from "scatterjs-plugin-eosjs2"
import { Api, JsonRpc } from "eosjs"
ScatterJS.plugins(new ScatterEOS())
import {stakeTx,taposData,unstakeTx} from "lib/tx"
var format=require('format-number')()
import interactivePanel from "components/interactivePanel.vue"
// MAINNET
const network = Network.fromJson({
   blockchain:'eos',
   host:'public.eosinfra.io',
   port:443,
   protocol:'https',
   chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
})

// JUNGLE
// const network = Network.fromJson({
//   blockchain: "eos",
//   protocol: "https",
//   host: "jungle2.cryptolions.io",
//   port: 443,
//   chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
// });
window.network = network

let eos;
const rpc = new JsonRpc(network.fullhost())


async function fillBalances(v){
  try {
    if (!v.account) return
    v.walletLoading = true
    v.userBalance = '0.00'
    v.userStake = '0.00'
    v.disableStake = false
    v.userBalance = (await rpc.get_currency_balance('boidcomtoken',v.account.name,'BOID'))[0]
    var result = (await rpc.get_table_rows({
        json: true,
        code: 'boidcomtoken',
        scope: 'boidcomtoken',
        table: 'stakes', 
        limit:1,
        lower_bound:v.account.name              
    })).rows[0]
    console.log(result)
    if (result.stake_account != v.account.name) result = '0.00'
    else result = result.staked.replace(' BOID','')
    console.log('STAKE RESULT',result)
    if (result > 0) v.disableStake = true
    v.userStake = result
    setTimeout(()=>{
      v.walletLoading = false
    },500)
  } catch (error) {
    v.walletLoading = false
    console.log(error.message)
    // alert(error)
  }

}

import { Toast } from 'quasar'


export default {
  data() {
    return {
      mintD:0,
      stakeD:0,
      disableStake:false,
      scatter: null,
      stakeAmount: null,
      stakeTime: null,
      scatterAuth:null,
      scatterId:null,
      userBalance:'0.00',
      userStake:'0.00',
      error:null,
      walletLoading:true
    }
  },
  components:{interactivePanel},
  props:['thisUser','authenticated'],
  mounted() {
    this.setEosInstance();
    this.init()
  },
  computed: {
    liquidBalance(){
      try {
        console.log(this.userBalance, this.userStake)
        console.log(parseFloat(this.userBalance.replace(/[^0-9.]/g, "")), parseFloat(this.userStake.replace(/[^0-9.]/g, "")))

        const result = format((parseFloat(this.userBalance.replace(/[^0-9.]/g, "")) - parseFloat(this.userStake.replace(/[^0-9.]/g, ""))))
        console.log(result)
        return result

      } catch (error) {
        console.log(error)
        return 0.00
      }
    },
    account() {
      if (!this.scatter || !this.scatter.identity) return null
      return this.scatter.identity.accounts[0]
    },
    formattedStake: {
      set(newData){
        if (!newData) return this.stakeAmount = null
        this.stakeAmount = parseFloat(newData.replace(/[^0-9.]/g, ""))
      },
      get(data){
        if (!this.stakeAmount) return null
        return format(this.stakeAmount)
      }
    }
  },
  methods: {
    formatStakeAmount(){
      // console.log('hello')
      // console.log(this.stakeAmount.toLocaleString())
      // this.stakeAmount = this.stakeAmount.toLocaleString()
    },
    fillBalances,
    async init(){
      try {
        const connected = await ScatterJS.scatter.connect("boid")
        if (!connected) {
          this.error = "Scatter not detected, make sure scatter is started and refresh."
          console.error("Could not connect to Scatter.")
          return false
        }
        this.scatter = ScatterJS.scatter
        // window.scatter = ScatterJS.scatter
        this.$root.$emit('scatter',this.scatter)
        return true
        console.log("SCATTER ID", this.scatter.identity)
      } catch (error) {
        console.log(error)
      }

    },
    async login() {
      console.log('got login')
      if (!this.scatter) { 
        const result = await this.init()
        if (!result) alert('could not connect to Scatter, make sure Scatter is running and refresh the page.')
      }
      try {
        const result = await this.scatter.getIdentity({ accounts: [network] })
        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
    reset(){
      this.logout()
      setTimeout(()=>{this.login()},1000)
    },
    logout() {
      if (!this.scatter) return
      this.scatter.forgetIdentity()
      this.scatterId = null
      this.scatterAuth = null
    },
    async stake() {
      this.walletLoading = true
      try {
        const result = await eos.transact(stakeTx(this),taposData())
        console.log(result)
        this.formattedStake = null
        Toast.create.positive('Transaction successful')
      } catch (error) {
        if (error.message && error.message.indexOf('assertion failure') > -1){
          error.message = error.message.replace('assertion failure with message: ','')
          console.log(error.message)
          Toast.create.negative(error.message)
        }else{
          console.log(error)
          alert(JSON.stringify(error))
        }

      }
      setTimeout(()=>{
        fillBalances(this)
      },2000)
    },
    async unstake() {
      this.walletLoading = true
      try {
        const result = await eos.transact(unstakeTx(this),taposData())
        console.log(result)
        Toast.create.positive("Transaction successful")
      } catch (error) {
        if (error.message.indexOf('assertion failure') > -1){
          error.message = error.message.replace('assertion failure with message: ','')
          console.log(error.message)
          Toast.create.negative(error.message)
        } else{
          console.log(error)
          alert(JSON.stringify(error))
        }
      }
      setTimeout(()=>{fillBalances(this)},2000)
      
    },
    setEosInstance() {
      if (this.account) {
        eos = this.scatter.eos(network, Api, { rpc,beta3:true })
      } else {
        eos = new Api({ rpc })
      }
    },
    async authenticate(nonce,msg,key){
      try {
        if (!this.scatter) return null
        const sig = await this.scatter.authenticate(nonce,msg,key)
        if(!sig) return null
        this.scatterAuth = sig
        return sig
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  watch: {
    ["account"]() {
      fillBalances(this)
      this.setEosInstance()
      this.error = null
      this.$root.$emit('scatterId',this.account)

    },
    scatterAuth(){
      this.$root.$emit('scatterAuth',this.scatterAuth)
    },
    userStake(data){
      this.userStake = format(parseFloat(data.replace(/[^0-9.]/g, "")))
    },
    userBalance(data){
      if (!data) return
      this.userBalance = format(parseFloat(data.replace(/[^0-9.]/g, "")))

    }
  }
};
</script>

