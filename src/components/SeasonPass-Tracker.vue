<template lang="pug">
div.full-width(style="padding:20px;")
  .row.justify-center.relative-position.full-width(style="margin-top:0px;")

    q-card.col.no-margin.full-width(style="margin-bottom:5px;" v-if="config")
      .row.justify-center(style="margin-bottom:20px;")
        h5(v-if="promoStarted") Promotion ends in {{countdown.days}} days {{countdown.hours}} hours
        h5(v-else) Promotion starts in {{countdownStart.days}} days and {{countdownStart.hours}} hours 
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
        p.no-margin Contest Starts 5/10/20 Contest Ends 5/23/20 12PM PST
      .row
        p.no-margin Drawing will be Live! Need not be present to win.
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

