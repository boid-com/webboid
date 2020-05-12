<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      .row
        .col-xs-12.col-sm-4
          div(style="margin-left:20px;")
            h6 Drawing Prizes
            .row
              .col-12
                .infobox
                  h6 1st
                  ul
                    li 12% of Token Pot
                    li + 1,000,000 KROWN
                    li + 500,000 BOID
                    li + 7,000 BOS
              .col-12
                .infobox
                  h6 2nd
                  ul
                    li 5% of Token Pot 
                    li + 500,000 KROWN
                    li + 250,000 BOID
                    li + 3500 BOS
              .col-12
                .infobox
                  h6 3rd
                  ul
                    li 3% of Token Pot 
                    li + 250,000 KROWN
                    li + 125,000 BOID
                    li + 1,700 BOS
        .col-xs-12.col-sm-6
          div(style="margin-left:20px;")
            h5 IBC token instructions
            p First you need to transfer a native token from another chain to your EOS account.
            h6.no-margin Examples
            pre(style="margin-bottom:10px; margin-top:0px;") {{ibcInstructions}}
            a(href="https://medium.com/boscore/experience-ibc-protocol-for-eosio-chains-1fd17cbb9302") learn more about IBC
            div(style="margin:20px;")
            p After you have received the IBC token on EOS, you can send the token to the 'boiddonation' contract from any wallet or use Scatter + this page to make the transfer.
            p Remember that IBC transfers have a small fee and the donations contract enforces a minimum donation per token.


    
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
const ibcInstructions = `
TELOS --> EOS
send tokens to bosibc.io with a memo:
hub.io@bos >> YOUREOSACCOUNTNAME@eos

BOS --> EOS
send tokens to bosibc.io with a memo:
YOUREOSACCOUNTNAME@eos

WAX --> EOS
send tokens to bosibc.io with a memo:
hub.io@bos >> YOUREOSACCOUNTNAME@eos
`

export default {
  data(){
    return Object.assign({ibcInstructions},seasonPass.state)
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){
    // this.ibcInstructions = instructions
  },
  watch:{
    
  }
}
</script>

