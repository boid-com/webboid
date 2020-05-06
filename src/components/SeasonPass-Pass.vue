<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      .row
        .col
          div(style="margin-left:20px;")
            h6 Drawing Prizes
            .row.justify-center
              .col-auto
                .infobox
                  h6 1st
                  ul
                    li 12% of Token Pot
                    li + 1,000,000 KROWN
                    li + 500,000 BOID
                    li + 7,000 BOS
              .col-auto
                .infobox
                  h6 2nd
                  ul
                    li 5% of Token Pot 
                    li + 500,000 KROWN
                    li + 250,000 BOID
                    li + 3500 BOS
              .col-auto
                .infobox
                  h6 3rd
                  ul
                    li 3% of Token Pot 
                    li + 250,000 KROWN
                    li + 125,000 BOID
                    li + 1,700 BOS
    
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

