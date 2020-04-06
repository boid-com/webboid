<template lang="pug">
div
  .row.justify-center.relative-position(style="margin-top:0px;")
    q-card.col.no-margin(style="margin-bottom:5px;")
      div(style="margin-left:20px;")
        h5 What is Season 4
        .row
          .col(style="font-size:20px;")
            div(style="padding:10px;")
              li Dedicated to COVID-19 research
              li Introducing new Boid teams and prizes
              li The first multi-chain Boid Season
              li Starting on Earth Day (April 22nd)
        h5 What is Boid Season Pass
        .row
          .col(style="font-size:20px;")
            div(style="padding:10px;")
              li A rare on-chain NFT paired with unique physical merchandise
              li Show your support for Boid and help to fund Boid development
              li The NFT provides a cosmetic upgrade to your Boid account 
              li The NFT upgrades based on your season performance
              li Season Pass NFTs are collectable and transferable
              li Contributors have a random chance to receive the season pass
              li Accounts that reach Level 1 have a 5% chance to receive the pass 
              li Accounts that reach level 10 have a 50% chance
              li The top 20% of contributors have a 100% chance to win 
              li Minimum threshold for physical merchandise is is $80.00 + shipping
    q-btn.full-width(color="grey" @click="openURL('https://github.com/boid-com/boiddonation')") Technical details on Github
    //- .col(style="padding:0px;")
    //-   img(src="/statics/seasonpass/tshirt.png" style="height:100%; width:100%; object-fit:contain;")

    
</template>
<style lang="stylus" scoped>
  @import '~variables'
  li
    padding 5px
  .q-card
    padding 20px !important
    // padding-bottom 5px !important
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
  mounted(){

  },
  watch:{
    
  }
}
</script>

