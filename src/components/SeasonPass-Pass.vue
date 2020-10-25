<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      .row
        .col
          div(style="margin-left:20px;")
            h6 Event Mechanics
            .row
              .col
                .infobox
                  ul
                    li Each whitelisted token has a minimum donation amount which increases slightly with each donation.
                    li Each token has a Boid Power reservoir which charges over time.
                    li When users donate a specific token, they can receive some Boid Power from that Boid Power reservoir.
                    li The available power in a token pool could drain to 0 if the donation rate exceeds the recharge rate.
                    li Each user has a global metric which is the total number of donations made.
                    li Each user has a "Level" which increases as the user makes more donations.
                    li Each time an account levels up, the base power reward they receive from a donation increases (5 - 100).
                    li Each token pool has a maximum power capacity and the available power will not increase past this capacity.
                    li Each token pool has a power multiplier which increases as the power reservoir reaches capacity (1x - 5x).
                    li Power granted is your account base power x the coin power multiplier, with a minimum of 5 power and max of 500.
                    li You can only make a donation in between start/end of the event.
                    li The contract is open source on #[a(href="https://github.com/boid-com/boiddonation" target="_blank") github].

        .col
          div(style="margin-left:20px;")
            h6 NFT Distribution rules
            .row
              .col
                .infobox
                  ul
                    li When account reaches level #[strong 3]
                      div #[strong Reward: ]
                        a(href="https://eos.atomichub.io/explorer/asset/2199023257638") Nikola Tesla - BRASS
                      div #[strong Utility: ] +2% Boid Power
                    li When account reaches level #[strong 6]
                      div #[strong Reward: ]
                        a(href="https://eos.atomichub.io/explorer/asset/2199023257637") Nikola Tesla - BRONZE
                      div #[strong Utility: ] +4% Boid Power
                    li When account reaches level #[strong 8]
                      div #[strong Reward: ]
                        a(href="https://eos.atomichub.io/explorer/asset/2199023257636") Nikola Tesla - SILVER
                        div #[strong Utility: ] +6% Boid Power
                    li When account reaches level #[strong 10]
                      div #[strong Reward: ]
                        a(href="https://eos.atomichub.io/explorer/asset/2199023257635") Nikola Tesla - GOLD
                        div #[strong Utility: ] +10% Boid Power
            h6 Details
            .row
              .col.infobox
                ul
                  li Highest contributors (USD value) will receive the lowest mint numbers.
                  li NFTs will be distributed at the end of the promotion period.
                  li The NFT utility bonus can only be activated during a Boid Season.
                  li Tesla NFTs can't be stacked, you can only activate one card of this type in your account.
                  li All contributors will receive one season pass for Boid Season 5.

    
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

