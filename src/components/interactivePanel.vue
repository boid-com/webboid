<template lang="pug">
div
  .row
    .col
      q-card
        p.light-paragraph.text-center 2019 Q3 - Q4 Season Schedule
        .row.relative-position
          .col-11
            div.absolute-center.gt-sm(style="height:5px; width:80%; background-color:grey; z-index:-1;")
          .col.scheduleCard.text-grey
            q-card.bg-white.text-grey
              p.text-center Break
              p.text-center 6/21 - 7/21
          .col.scheduleCard
            q-card.bg-white.scheduleCard.text-grey
              p.text-center Season 2
              p.text-center 7/21 - 9/21
          .col.scheduleCard.text-grey
            q-card.bg-white.scheduleCard
              p.text-center Break
              p.text-center 9/21 - 10/21
          .col.scheduleCard
            q-card.bg-white.scheduleCard(color="green")
              p.text-center Season 3
              p.text-center 10/21 - 12/21
  .row
    .col
      q-card
        .row.justify-center
          div(style="padding-bottom:10px;")
            q-btn(  flat
              :class="{selectedTab:page==='info'}"
              @click="page='info'"
            ) info
            q-btn( flat
              :class="{selectedTab:page==='calc'}"
              @click="page='calc'"
            ) Profit Calculator
            //- q-btn( flat
            //-   :class="{selectedTab:page==='exchange'}"
            //-   @click="page='exchange'"
            //- ) exchange
        .row.justify-center
          div(v-if="page==='info'")
            ul
              li(v-for="info of stakeFAQ" :key="info") {{info}}
          div(v-else-if="page==='calc'").full-width
            profitCalculator

          div(v-else-if="page==='exchange'")
            .row.justify-center.relative-position
              exchanges(:showHeading="false")
 
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
var format=require('format-number')()
import { Toast } from 'quasar'
import { openURL } from 'quasar'
import exchanges from '@/exchange.vue'
import profitCalculator from '@/profitCalculator.vue'
export default {
  components:{exchanges, profitCalculator},
  data() {
    return {
      stakeFAQ,
      page:'calc',
      mintD:0,
      stakeD:0
    }
  },
  methods:{openURL},
  props:['thisUser','userStake'],
  watch:{
  }
}

const stakeFAQ = [
  "Staking BOIDs increases your profitability when you generate Boid Power using the Boid app.",
  "Staked tokens are locked in your wallet until they are unstaked.",
  "You can manually stake and unstake instantly at any time.",
  // "During a Boid Season, you can’t stake or unstake tokens.",
  // "All tokens staked when the season break ends will remain staked for the entire season",
  "The minimum amount of BOIDs you can stake is 100k",
]

</script>

