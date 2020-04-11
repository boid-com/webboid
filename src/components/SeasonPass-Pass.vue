<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      .row
        .col
          div(style="margin-left:20px;")
            h6 What is Season 4
            .row
              .col
                .infobox
                  ul
                    li Focused on COVID-19 research
                    li Introducing new Boid teams and prizes
                    li The first multi-chain Boid Season
                    li Dedicated to Earth Day
            h6 What is Boid Season Pass
            .row
              .col
                .infobox
                  ul
                    li A rare on-chain NFT paired with unique physical merchandise
                    li Show your support and help to fund Boid development
                    li The NFT provides a cosmetic upgrade to your Boid account 
                    li The NFT upgrades based on your season performance
                    li Season Pass NFTs are collectable and transferable
                    li Contributors have a random chance to receive the season pass
                    li Accounts that reach Level 1 have a 5% chance to receive the pass 
                    li Accounts that reach level 10 have a 50% chance
                    li The top 20% of contributors have a 100% chance to win 
                    li Minimum threshold for physical merchandise is is $80.00 + shipping
        .col
          div(style="margin-left:20px;")
            h6 How will funds be used?
            .row
              .col.infobox
                p Funds will be used to develop and maintain the Boid platform including but not limited to infrastructure, legal, and marketing tasks.
            h6 How else can I support Boid?
            .row
              .col.infobox
                ul
                  li Join and follow the Boid social channels (Links in the footer)
                  li Share your Boid invite link (you get some bonus social power)
                  li Install the Brave Browser (It's great!). If you use the browser for one month then we get a reward #[a(href="https://brave.com/boi614" target="_blank") Download Brave]
                  li Earn $50 when you sign-up for Crypto.com using #[a(href="https://platinum.crypto.com/r/yeqg9m54fp" target="_blank") This Link] #[strong Ref Code: (yeqg9m54fp)]
                  li Earn up to $50 of EOS when you use this link to learn about EOS on #[a(href="https://coinbase.com/earn/eos/invite/yw0c3rb7" target="_blank") Coinbase Earn]
            h6 I'd like to donate privately or with a different currency.
            .row
              .col.infobox
                p Contact us at donate@boid.com with details.
            h6 I'd like to review the smart contract code or learn more about how the contract works.
            .row
              .col.infobox
                p The contract is open source on #[a(href="https://github.com/boid-com/boiddonation" target="_blank") github].
    //- .col(style="padding:0px;")
    //-   img(src="/statics/seasonpass/tshirt.png" style="height:100%; width:100%; object-fit:contain;")

    
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

