<template lang="pug">
div.full-width(style="padding:20px;")
  .row.justify-center.relative-position.full-width(style="margin-top:0px;")

    q-card.col.no-margin.full-width(style="margin-bottom:5px;" v-if="config")
      .row.justify-center(style="margin-bottom:20px;")
        h5(v-if="promoStarted") Season 4 starts in {{countdown.days}} days
        h5(v-else) Promotion starts in {{countdownStart.hours}} hours
      .row
        .col.full-width
          q-progress(:percentage="dateProgress" style="height:20px;")
      .row.justify-between(style="margin-bottom:20px;")
        .col-auto
          h6 {{startDate}}
          small Promotion Start
        .col-auto
          h6 {{endDate}}
          small Season 4 Start
      .row(style="margin-top:10px;")
        p.no-margin When season 4 starts the donations contract will pause and season 4 NFTs will be issued. 
      .row
        p.no-margin Season Pass NFTs for Season 4 can not be created after the start of season 4.
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .infobox
    padding 10px
  ul
    list-style-position outside
    margin 0px
    margin-left 20px
    padding 0px
  li
    padding 5px
    font-size 16px
  .q-card
    padding 20px !important
    margin 10px
</style>

<script>
import seasonPass from '../lib/seasonPass'



export default {
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){

  },
  watch:{
    
  }
}
</script>

