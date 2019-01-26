<template lang="pug">
q-card
  .row.justify-center
    div(style="padding-bottom:10px;")
      q-btn(  flat
        :class="{selected:page==='info'}"
        @click="page='info'"
      ) info
      q-btn( flat
        :class="{selected:page==='calc'}"
        @click="page='calc'"
      ) Profit Calculator
      q-btn( flat
        :class="{selected:page==='exchange'}"
        @click="page='exchange'"
      ) exchange
  .row.justify-center
    div(v-if="page==='info'")
      ul
        li(v-for="info of stakeFAQ" :key="info") {{info}}
    div(v-else-if="page==='calc'").full-width
      .row.full-width.justify-end
        .col-7
          .row
            .col-3(style="padding-top:10%")
              q-btn( flat
                :class="{selected: profitCalc.timeScale == 86400000}"
                @click="profitCalc.timeScale = 8.64e+7"
              ) Daily
              q-btn( flat
                :class="{selected: profitCalc.timeScale == 86400000 * 7}"
                @click="profitCalc.timeScale = 8.64e+7 * 7"
              ) Weekly
              small Timescale
            .col-2.relative-position(style="height:60px;")
              h4.absolute-center /
            .col-4
              q-input(v-bind:value="profitCalc.power" v-on:input="profitCalc.power = $event" type="number") 
              small Boid Power
            .col-2.relative-position(style="height:60px;")
              h4.absolute-center x
            .col-1
              q-input(v-model="profitCalc.mintDifficulty" type="number") 
              small Mint Difficutly
          .row
            .col-5
              q-input(v-model="profitCalc.staked" type="number") 
              small Staked BOIDs
            .col-2.relative-position(style="height:60px;")
              h4.absolute-center /
            .col-2
              q-input(v-model="profitCalc.stakeDifficulty" type="number")
              small Stake Difficulty
            .col-2.relative-position(style="height:60px;")
              h4.absolute-center x
            .col-1
              div(style="height:37px;")
              h6.tex-center(style="padding-bottom:10px;") {{baseProfit | longNum}}
              small Base Profit

        .col-5
          .row
            .col-4.relative-position(style="height:60px;")
              //- h4.text-center(style="padding-top:20px;") =
            .col.bg-grey-2(style="padding:15px; padding-bottom:0px;")
              div(style="height:36px;")
              h6.text-center {{baseProfit | longNum}}
              .row.justify-center
                small Base Profit
              div.relative-position
                h4.text-center.absolute-bottom-center +
                

          .row
            .col-4.relative-position(style="height:0px;")
              //- h4.absolute-right.text-center(style="margin-right:10px;") =
            .col.bg-grey-2(style="padding:15px; padding-top:0px;")
              div(style="height:0px;")
              h6.text-center {{stakeProfit | longNum}}
              .row.justify-center
                small Stake Profit
          .row.justify-end
            .col-4
            .col.bg-green-6.text-white(style="padding:15px; padding-bottom:15px;")
              div(style="height:0px;")
              h6.text-center {{totalProfit | longNum}}
              .row.justify-center
                small Total Profit
      ul
        li This caculator is just an estimate.
        li Network difficulty calculations change over time.
        li Users can also earn a team bonus and a tier bonus which are not displayed here.
      
 

    
    div(v-else-if="page==='exchange'")
      .row.justify-center
        q-card.cursor-pointer.clickable(@click="openURL('https://eosdaq.com/exchange/BOID_EOS')" style="width:50%")
          img.full-width(src="https://cdn-images-1.medium.com/max/1600/1*4e5Md1hVCq-eM48DkVBhfw.png")

    
    


</template>
<style lang="stylus" scoped>
@import '~variables'
  .q-card
    padding 20px
  .selected
    background-color $blue-6
    color: white
  .clickable:hover
    background-color $blue-6
  li
    padding:5px
</style>


<script>
import { Toast } from 'quasar'
var format=require('format-number')()
import { openURL } from 'quasar'

export default {
  data() {
    return {
      stakeFAQ,
      page:'info',
      mintD:0,
      stakeD:0,
      profitCalc:{
        staked:this.userStake,
        power: this.thisUser.tPower,
        mintDifficulty: 2,
        stakeDifficulty: 0.15,
        timeScale:86400000
      }
    }
  },
  methods:{openURL},
  computed:{
    baseProfit(){
      return parseInt(this.profitCalc.power * (this.profitCalc.timeScale/(this.profitCalc.mintDifficulty*100000000)))
    },
    stakeProfit(){
      return parseFloat(this.baseProfit * (this.profitCalc.staked / (this.profitCalc.stakeDifficulty*100000000)))
    },
    totalProfit(){
      return parseFloat(this.baseProfit) + parseFloat(this.stakeProfit)
    }
  },
  props:['thisUser','userStake'],
  watch:{
    userStake(data){
      if (!data) return
      this.profitCalc.staked = parseFloat(data.replace(/[^0-9.]/g, ""))
    },
    'thisUser':function(){
      console.log('got ThisUser')
      if (!this.profitCalc){
        this.profitCalc = {
        staked: thisUser.staked,
        power: thisUser.tPower
        }
      }
    }
  }
}

const stakeFAQ = [
  "Staking BOIDs increases your profitability when you generate Boid Power using the Boid app.",
  "Staked tokens are locked in your wallet until they are unstaked.",
  "You can manually stake and unstake instantly during a season break period.",
  "During a Boid Season, you can’t stake or unstake tokens.",
  "All tokens staked when the season break ends will remain staked for the entire season",
  "The minimum amount of BOIDs you can stake is 100k",
]

</script>

