<template lang="pug">
  .row.justify-end(style="margin:0px;")
    .col-12
      div(style="padding:5px;")
        .row.justify-center
          q-btn(small flat color="blue" @click="openURL('https://stats.boid.com/d/YrQi9xhZk/boidcomtoken-blockchain-tracking?orgId=1')") stats
          div(style="margin-bottom:5px; margin-top:4px;").light-paragraph Global Parameters 
          q-btn(small flat color="green" @click="openURL('https://drive.google.com/file/d/1sl3hWUsZQ52-eb4F_TYW6LPhkD5cLCX2/view')") info
          q-btn( small color="red" @click="init()" flat) reset
        .row.justify-center
          small You can adjust global network parameters to see how profitability could change over time.
        div(style="min-height:120px;").relative-position
          .row.justify-center(style="padding-top:10px;")
            .col-md-6.col-lg-3(v-for="param of globalParams" style="padding:10px;")
              .row.justify-center.no-wrap
                .col-auto.on-left
                  div(style="margin-top:10px;")
                    q-btn(small round outline @click="param.value = decrementParam(param.value,1)" color="red-7")
                      q-icon(name="remove")
                .col-4
                  .row.justify-center
                    strong(style="margin-top:0px;") 
                      q-input(@input="globalParamsToConfig" v-model="param.value" style="max-width:100px;")
                  .row.justify-center
                    small {{param.name}}
                  .row.justify-center
                    small.text-grey {{param.note}}
                .col-auto
                  div(style="margin-top:10px;")
                    q-btn( round small @click="param.value = incrementParam(param.value,1)" outline color="green")
                      q-icon(name="add")
                      //- .strong +
          q-inner-loading(:visible="loading" style="min-height:50px;")
            q-spinner-ball(size="60px" color="blue")
          textarea.hidden(:value="globalParams" ref="copyText")
          //- .row.justify-center(v-else)

            //- h4 loading...
    .col.justify-center(style="padding:20px;")
      .row.items-center
        .col
          small These parameters are adjusted during each season break based on formulas and community governance. You can use this tool to generate a proposal and share the parameters at #[a(href="https://community.boid.com" target="_blank") community.boid.com] for community feedback.
        .col-auto
          div(style="padding:0px;")
            q-btn(@click="copyText()") Copy parameters
              q-icon(name="fa-copy").on-right
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
    .row.full-width.justify-center
      h5 Simulate Entire Network
    .col-9(v-if="results")
      div(style="margin-bottom:20px;")
        .row.justify-center(style="padding-right:10px;")
          .col-4
            q-card(style="padding:10px; height:100%").shadow-4
              .row.items.center
                .col-auto(style="padding-right:10px;")
                  q-icon(name="fa-users" color="blue" size="30px;" style="height:80px; padding:5px;")
                  //- img(src="/statics/images/BoidPower.svg" style="height:80px; padding:5px;")
                .col
                  q-input(v-bind:value="netSim.userCount" v-on:input="netSim.userCount = $event" type="number") 
                  div(style="margin:5px;")
                    strong Active Accounts
          .col-4
            q-card(style="padding:10px; height:100%").shadow-4
              .row.items.center
                .col-auto(style="padding-right:10px;")
                  img(src="/statics/images/BoidStake.png" style="height:55px; padding:5px; margin-top:15px;")
                .col
                  q-input(v-model="netSim.avgStake" type="number") 
                  div(style="margin:5px;")
                    strong Average Account Stake
          .col-4
            q-card(style="padding:10px; height:100%").shadow-4
              .row.items.center
                .col-auto(style="padding-right:10px;")
                  img(src="/statics/images/BoidPower.svg" style="height:55px; padding:5px; margin-top:15px;")
                .col
                  q-input(v-bind:value="netSim.avgPower" v-on:input="netSim.avgPower = $event" type="number") 
                  div(style="margin:5px;")
                    strong Average Account Power
        .row.justify-center(style="padding-top:20px;")
          .col-6
            .row.justify-center
              .col-3.relative-position.on-left(style="margin-top:15px;")
                img.absolute-center(src="/statics/images/BoidStake.png" style="width:80px; padding:5px;")
              .col-auto
                .row.justify-center
                  h4.text-center {{printNum(netSim.userCount * netSim.avgStake,0)}}
                .row.justify-center
                  small Total Network Stake
            div(style="margin:10px;")
              //- small {{poweredStakeDescription}}
          .col-6
            .row.justify-center
              .col-3.relative-position.on-left(style="margin-top:15px;")
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:80px; padding:5px;")
              .col-auto
                .row.justify-center
                  h4.text-center {{printNum(netSim.avgPower * netSim.userCount,0)}}
                .row.justify-center
                  small Total Network Power
            div(style="margin:10px;")
              //- small {{poweredStakeDescription}}
    .col-3(style="padding-top:10px; padding-right:8px;")
      .row
        .col.bg-grey-2(style=" padding-bottom:0px;")
          .row.bg-grey-8.justify-center(style="padding:10px;")
            div.text-center.text-white Network Inflation
          div(style="padding:15px; padding-bottom:0px;")
            div(style="height:6px;")
            h6.text-center {{printNum(simResults.power,0)}}
            .row.justify-center
              small From Power
            div.relative-position(style="height:40px;")
              h4.text-center.absolute-center(style="padding-top:10px; margin:0px;") +
      .row
        .col.bg-grey-2(style="padding:15px; padding-top:0px;")
          h6.text-center {{printNum(simResults.stake,0)}}
          .row.justify-center
            small From Stake
      .row.justify-end
        .col.bg-green-6.text-white(style="padding:15px; padding-bottom:15px;")
          div(style="height:0px;")
          h6.text-center {{printNum(simResults.stake + simResults.power,0)}}
          .row.justify-center
            small Network inflation
          .row.justify-center
            small estimate
    .row.full-width.justify-center
      h5 Simulate Individual Account
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
    .col-3(style="padding-top:10px; padding-right:8px;")
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
      loading:true,
      editStake:0,
      profitCalc:{
        stake:2000000,
        power: 20000,
        mintDifficulty: 2,
        stakeDifficulty: 0.15,
        timeScale:86400000,
      },
      netSim:{
        avgStake:2000000,
        avgPower: 3000,
        userCount:700
      },
      config:null,
      prediction:{stake:0,power:0,maxPoweredStake:0},
      thisUser:null,
      globalParams:[]
    }
  },
  methods:{printNum,openURL,
    copyText() {
      const el = document.createElement('textarea')
      el.value = JSON.stringify(this.globalParams,null,2)
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    },
    globalParamsToConfig(){
      if (!this.globalParams) return
      for(let param of this.globalParams) {
        param.value = parseFloat(param.value)
        if (param.name == "Stake Difficulty") this.config.stake_difficulty = param.value * 10000000
        if (param.name == "Power Difficulty") this.config.power_difficulty = param.value * 10000000
        if (param.name == "PStake Multiplier") this.config.powered_stake_multiplier = param.value
        if (param.name == "PStake Ratio") this.config
        // params.push({name:"PStake Multiplier",value:printNum(conf.powered_stake_multiplier,2),note:""})
        // params.push({name:"PStake Ratio",value:printNum(conf.max_powered_stake_ratio * 100,2) + "%",note:""})
      }
    },
    async init(){
      this.loading = true
      this.config = await boidjs.get.stakeConfig()
      this.loading = false
    },
    setGlobals(){
      var params = []
      var conf = this.config
      if (!this.config) return []
      params.push({name:"Stake Difficulty",value:printNum(conf.stake_difficulty/10000000,2),note:"/10000000"})
      params.push({name:"Power Difficulty",value:printNum(conf.power_difficulty/10000000,2),note:"/10000000"})
      params.push({name:"PStake Multiplier",value:printNum(conf.powered_stake_multiplier,2),note:""})
      params.push({name:"PStake Ratio",value:printNum(conf.max_powered_stake_ratio * 100,2) + "%",note:""})
      return params
    },
    incrementParam(param,amount) {
      console.log(param)
      param = parseFloat(param)
      this.globalParamsToConfig()
      return parseInt(param + amount)
    },
    decrementParam(param,amount) {
      param = parseFloat(param)
      this.globalParamsToConfig()
      return parseInt(param - amount)
    },
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
    simResults(){
      const userSim = boidjs.get.pendingClaim({ 
        lastClaimTime: Date.now() - this.profitCalc.timeScale,
        totalPower:this.netSim.avgPower,
        allStaked:this.netSim.avgStake
      },this.config)
      const stake = userSim.stake * this.netSim.userCount
      const power = userSim.power * this.netSim.userCount
      console.log('simpower',power)
      return {stake,power}
    },
    results(){
      return boidjs.get.pendingClaim({ lastClaimTime: Date.now() - this.profitCalc.timeScale,
        totalPower:this.profitCalc.power,
        allStaked:this.profitCalc.stake
      },this.config)
    },
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
    }
  },
  async mounted(){
    this.init()
    this.syncDefaults()
  },
  watch: {
    'wallet'(val) {
      this.syncDefaults()
    },
    'config'(){
      this.globalParams = this.setGlobals()
    },
    'globalParams'(){
      console.log('globalparams event')
      this.globalParamsToConfig()
    }
  }
}
</script>