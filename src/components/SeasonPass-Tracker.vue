<template lang="pug">
div.full-width(style="padding:0px;")
  .row.justify-center.relative-position.full-width(style="margin-top:0px;")
    .col-sm-12.col-md-9
      div.col.no-margin.full-width(style="margin-bottom:5px; " v-if="config")
        .row.justify-center(style="margin-bottom:20px;")
          h5(v-if="promoStarted") {{promoEndingMsg}}
          h5(v-else) {{promoStartingMsg}} 
        .row
          .col.full-width
            q-progress(:percentage="dateProgress" style="height:20px;")
        .row.justify-between(style="margin-bottom:20px;")
          .col-auto
            h6 {{startDate}}
            small Promotion Start
          .col-auto
            h6 {{endDate}}
            small Promotion End
        //- .row(style="margin-top:10px;")
        //-   p.no-margin Text can go here
        //- .row
        //-   p.no-margin Text can go here too!
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

</style>

<script>
import seasonPass from '../lib/seasonPass'



export default {
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:{
    promoStartingMsg(){
      if (!this.countdownStart) return
      else if (this.countdownStart.hours < 1 && this.countdownStart.days < 1) return `Promotion Starting ${this.startDate}`
      else if (this.countdownStart.days < 1) return `Promotion starts in ${this.countdownStart.hours} hours`
      else return `Promotion starts in ${this.countdownStart.days} ${this.days} and ${this.countdownStart.hours} hours`
    },
    promoEndingMsg(){
      if (!this.countdown) return
      else if (this.countdown.hours < 1 && this.countdown.days < 1) return `Promotion Ending ${this.startDate}`
      else if (this.countdown.days < 1) return `Promotion ends in ${this.countdown.hours} hours`
      else return `Promotion ends in ${this.countdown.days} ${this.endingDays} and ${this.countdown.hours} hours`
    },
    days(){
      if (!this.countdownStart.days) return 'days'
      if (this.countdownStart.days >=2) return 'days'
      else return 'day'
    },
    endingDays(){
      if (!this.countdown.days) return 'days'
      if (this.countdown.days >=2) return 'days'
      else return 'day'
    },
    ...seasonPass.computed},
  mounted(){

  },
  watch:{
    
  }
}
</script>

