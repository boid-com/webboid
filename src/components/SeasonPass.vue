<template lang="pug">
div(style="padding:20px; max-width: 1200px;")
  h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Boid Season Pass
  .row.justify-center(style="padding:30px;")
    .row
      div
       p.inline You can help launch Boid Season 4 by donating towards Boid development.
  .row.justify-center
    h5.no-margin How it works

  .row.justify-center
    .col.infobox
      .row.items-center
        .col.col-auto.on-left
          h5.text-blue 1
        .col
          p Donate any amount towards the Season Pass pool.
    .col.infobox
      .row.items-center
        .col.col-auto.on-left
          h4.text-blue 2
        .col The Season
    .col.infobox
      .row.items-center
        .col.col-auto.on-left
          h4.text-blue 3
        .col The Season
  .row
    .col
      p Donate towards Boid to help fund development.
    .col
      .row.justify-center
        h5 leaderboard
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    padding 20px !important
    padding-bottom 5px !important
  .selectedTab
    background-color $blue-6
    color: white
</style>

<script>
import { openURL } from 'quasar'

export default {
  data(){
    return {
      page:'rules'
    }
  },
  methods:{
    openURL
  },
  watch:{
  }
}
</script>

