<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      .row
        .col
          div(style="margin-left:20px;")
            h6 Topic
            .row
              .col
                .infobox
                  ul
                    li Info
               
            h6 Topic 2
            .row
              .col
                .infobox
                  ul
                    li Info

        .col
          div(style="margin-left:20px;")
            h6 Topic 3
            .row
              .col.infobox
                p Info
            h6 Topic 4
            .row
              .col.infobox
                ul
                  li Info
            h6 Topic 5
            .row
              .col.infobox
                p Info
            h6 I'd like to review the smart contract code or learn more about how the contract works.
            .row
              .col.infobox
                p The contract is open source on #[a(href="https://github.com/boid-com/boiddonation" target="_blank") github].

    
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

