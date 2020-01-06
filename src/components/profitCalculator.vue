<template lang="pug">
  .row.justify-end(style="margin:0px;")
    .col-12
      div(style="padding:5px;")
        .row.justify-center
          q-btn(small flat color="blue" @click="openURL('https://stats.boid.com/d/YrQi9xhZk/boidcomtoken-blockchain-tracking?orgId=1')") stats
          div(style="margin-bottom:5px; margin-top:4px;").light-paragraph Global Parameters 
          q-btn(small flat color="green" @click="openURL('https://docs.boid.com/docs/boidpower')") info
        .row.justify-center
          small Global Parameters change during each season break to fit network inflation targets.
        .row.justify-center(style="padding-top:10px;")
          .col-3(v-for="param of globalParams" style="padding:10px;")
            .row.justify-center
              strong(style="margin-top:0px;") {{param.value}}
            .row.justify-center
              small {{param.name}}
            .row.justify-center
              small.text-grey {{param.note}}
    .col-12.row.justify-center
      .row.justify-center(style="padding-bottom:10px;")
        q-btn( flat
          :class="{selectedTab: profitCalc.timeScale == 86400000}"
          @click="profitCalc.timeScale = 8.64e+7"
        ) Day
        q-btn( flat
          :class="{selectedTab: profitCalc.timeScale == 86400000 * 7}"
          @click="profitCalc.timeScale = 8.64e+7 * 7"
        ) Week
        q-btn( flat
          :class="{selectedTab: profitCalc.timeScale == 86400000 * 30}"
          @click="profitCalc.timeScale = 8.64e+7 * 30"
        ) Month
    .col-9(v-if="results")
      div(style="padding-right:10px;")
        .row.justify-center
          .col-6
            q-card(style="padding:10px; height:100%").shadow-4
              .row.items.center
                .col-auto(style="padding-right:10px;")
                  img(src="/statics/images/BoidPower.svg" style="height:80px; padding:5px;")
                .col
                  q-input(v-bind:value="profitCalc.power" v-on:input="profitCalc.power = $event" type="number") 
                  strong Power
                  .row
                    small &nbsp;
                  .row
                    small &nbsp;
                  .row
                    small &nbsp;
          .col-6
            q-card(style="padding:10px; height:100%").shadow-4
              .row.items.center
                .col-auto(style="padding-right:10px;")
                  img(src="/statics/images/BoidStake.png" style="height:80px; padding:5px;")
                .col
                  q-input(v-bind:value="profitCalc.stake" v-on:input="profitCalc.stake = $event" type="number") 
                  strong BOID Stake
              .row
                .col
                  .row
                    small Powered: {{poweredStake}}
                  .row
                    small Unpowered: {{unPoweredStaked}} 
        .row.justify-center(style="padding-top:20px;")
          .col-6
            .row.justify-center
              .col-3.relative-position.on-left(style="margin-top:15px;")
                img.absolute-center(src="/statics/BoidPoweredStake.png" style="width:80px; padding:5px;")
              .col-auto
                .row.justify-center
                  h4.text-center {{printNum(results.maxPoweredStake,0)}}
                .row.justify-center
                  small Max Powered Stake
            div(style="margin:10px;")
              small {{poweredStakeDescription}}
          .col-6(v-if="results.wpf")
            .row.justify-center
              .col-3.relative-position.on-left(style="margin-top:15px;")
                img.absolute-center(src="/statics/BoidWPFLogo.png" style="width:80px; padding:5px;")
              .col-auto
                .row.justify-center
                  h4.text-center {{printNum(results.wpf.total,0)}}
                .row.justify-center
                  small To Worker Fund
            div(style="margin:10px;")
              small {{WPFDescription}}
    .col-3(style="padding-top:10px;")
      .row
        .col.bg-grey-2(style=" padding-bottom:0px;")
          .row.bg-grey-8.justify-center(style="padding:10px;")
            div.text-center.text-white BOID Earnings
          div(style="padding:15px; padding-bottom:0px;")
            div(style="height:6px;")
            h6.text-center {{printNum(results.power,0)}}
            .row.justify-center
              small From Power
            div.relative-position(style="height:40px;")
              h4.text-center.absolute-center(style="padding-top:10px; margin:0px;") +
      .row
        .col.bg-grey-2(style="padding:15px; padding-top:0px;")
          h6.text-center {{printNum(results.stake,0)}}
          .row.justify-center
            small From Stake
      .row.justify-end
        .col.bg-green-6.text-white(style="padding:15px; padding-bottom:15px;")
          div(style="height:0px;")
          h6.text-center {{printNum(results.stake + results.power,0)}}
          .row.justify-center
            small Total Payout
          .row.justify-center
            small estimate
</template>

<style lang="stylus" scoped>
@import '~variables'
  .q-card
    padding 20px
  .selectedTab
    background-color $blue-6
    color: white
  .clickable:hover
    background-color $blue-6
  li
    padding:5px
</style>

<script>
const boidjs = window.boidjs
const printNum = (val,prec) => parseFloat(parseFloat(val).toFixed(prec)).toLocaleString()
const poweredStakeDescription = `
To earn extra BOID from staking, the BOID must be a Powered Stake (PStake).
The amount of stake you can power is dictated by PStakeMultiplier * Power.
`
const WPFDescription = `
Profits generated from Unpowered Stake are diverted to the Boid Worker Proposal Fund.
The Boid WPF provides funding for users that help grow and promote the Boid ecosystem.
`
import { openURL } from 'quasar'

export default {
  data(){
    return {
      poweredStakeDescription,
      WPFDescription,
      editStake:0,
      profitCalc:{
        stake:2000000,
        power: 20000,
        mintDifficulty: 2,
        stakeDifficulty: 0.15,
        timeScale:86400000,
      },
      config:null,
      prediction:{stake:0,power:0,maxPoweredStake:0},
      thisUser:null
    }
  },
  methods:{printNum,openURL, 
    async syncDefaults(){
      if (this.wallet) {
        const result = await boidjs.get.wallet(this.wallet.auth.accountName)
        console.log(result)
        this.profitCalc.stake = parseInt(result.allStaked)
        this.profitCalc.power = parseInt(result.totalPower)
      }
    }
  },
  computed:{
    poweredStake(){
      if (this.profitCalc.stake < this.results.maxPoweredStake) return printNum(this.profitCalc.stake,0)
      else return printNum(this.results.maxPoweredStake,0)
    },
    unPoweredStaked(){
      if (this.profitCalc.stake < this.results.maxPoweredStake) return 0
      else return printNum(this.profitCalc.stake - this.results.maxPoweredStake,0)
    },
    wallet(){
      if (this.$parent.$parent.wallet){
        return this.$parent.$parent.wallet
      }else return false
    },
    userStake(){
      return parseFloat(this.$parent.userStake)
    },
    results(){
      return boidjs.get.pendingClaim({ lastClaimTime: Date.now() - this.profitCalc.timeScale,
        totalPower:this.profitCalc.power,
        allStaked:this.profitCalc.stake
      },this.config)
    },
    globalParams() {
      var params = []
      var conf = this.config
      if (!this.config) return []
      params.push({name:"Stake Difficulty",value:printNum(conf.stake_difficulty/10000000,2),note:"/10000000"})
      params.push({name:"Power Difficulty",value:printNum(conf.power_difficulty/10000000,2),note:"/10000000"})
      params.push({name:"PStake Multiplier",value:printNum(conf.powered_stake_multiplier,2),note:""})
      params.push({name:"PStake Ratio",value:printNum(conf.max_powered_stake_ratio * 100,2) + "%",note:""})
      return params
    }
  },
  async mounted(){
    this.config = await boidjs.get.stakeConfig()
    this.syncDefaults()
  },
  watch: {
    'wallet'(val) {
      this.syncDefaults()
    }
  }
}
</script>