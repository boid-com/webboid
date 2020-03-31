<template lang="pug">
div
  q-card.relative-position
    .row(v-if="contributor")
      .col-auto.on-left
        .row.justify-center
          h3.no-margin {{contributor.level}}
        .row.justify-center
          h5.no-margin Level
      .col
        .row
          .col-auto.on-left
            h6.no-margin 1
            small.text-amber-10 +10
          .col
            .row
              .col(v-for="box of 10")
                div(style="height:0px; font-size:25px;").relative-position.text-grey
                  .absolute-right.strong(style="right:-2px;") |
            q-progress(:percentage="contributor.donations" height="25px" style="height:10px; margin-top:10px; padding-right:40px;" color="teal-3")
          .col-auto.on-right
           h6.no-margin(style="padding-bottom:0px;") 10
           small.text-amber-10 +100
        .row.justify-center
          .col
            .row.justify-center(v-if="config")
              h6.no-margin.text-amber-10 + {{config.user_power_reward_increment * contributor.level}}
            .row.justify-center
              small current power bonus
          .col(v-if="contributor.level < 10")
            h6.no-margin {{10 - (contributor.donations - contributor.level*10)}} more donations until level {{contributor.level + 1}}
          .col(v-if="contributor.level < 10")
            .row.justify-center(v-if="config")
              h6.no-margin + {{config.user_power_reward_increment * (contributor.level+1)}}
            .row.justify-center
              small level {{contributor.level + 1}} power bonus

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

  },
  watch:{
    'global.transitWallet'(){

    }
  }
}
</script>

