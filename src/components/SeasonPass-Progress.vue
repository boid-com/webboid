<template lang="pug">
div
  q-card.relative-position
    .row(v-if="contributor && config")
      .col-auto.on-left
        .row.justify-center
          h3.no-margin {{contributor.level}}
        .row.justify-center
          h5.no-margin Level
      .col
        .row
          .col-auto.on-left
            h6.no-margin 1
            small.text-grey +{{config.user_power_reward_increment}}
          .col
            .row
              .col(v-for="box of 10")
                div(style="height:0px; font-size:25px;").relative-position.text-grey-4
                  .absolute-right.strong(style="right:-2px;") |
            q-progress(:percentage="contributor.donations" height="25px" style="height:10px; margin-top:10px; padding-right:40px;" color="teal-3")
          .col-auto.on-right
           h6.no-margin(style="padding-bottom:0px;") {{config.user_level_cap}}
           small.text-grey +{{config.user_power_reward_cap}}
        .row.justify-center(style="padding-bottom:10px;")
          .col
            .row.justify-center(v-if="config")
              h6.no-margin.text-green(v-if="contributor.level > 0") + {{config.user_power_reward_increment * contributor.level}}
              h6.no-margin.text-green(v-else) + 5

            .row.justify-center
              small power bonus
          .col(v-if="contributor.level < config.user_level_cap")
            .row.justify-center(v-if="config")
              h6.no-margin.text-grey-8 + {{config.user_power_reward_increment * (contributor.level+1)}}
            .row.justify-center
              small level {{contributor.level + 1}} power bonus
        .row(style="padding-top:10px;" v-if="contributor.level < config.user_level_cap")
          h6.no-margin {{remainingDonations}} more {{donationText}} until level {{contributor.level + 1}}

    q-inner-loading(:visible="loading.progressPanel")
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

  },
  watch:{
    'global.transitWallet'(){

    }
  }
}
</script>

