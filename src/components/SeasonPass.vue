<template lang="pug">
div(style="padding:20px; max-width: 1600px;")
  .row.justify-center
    .col-12(style="max-width: 1000px;")
      div(style="margin:20px;")
        h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px; padding:10px;") Boid Season Pass
        //- h4.text-weight-light.text-center.lt-md(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Boid Season Pass

      .row.justify-center
        //- .row
          //- p(style="margin:30px;") You can help launch Boid Season 4 by donating towards Boid development.
      .row.justify-center
        .col
          h5.no-margin.text-center(style="padding-bottom:15px;") Donate to win a Boid Season Pass
      .row.justify-center.relative-position.gt-md
        div(style="height:5px; width:800px; top:95px;").absolute-center.bg-blue-2.gt-sm
        .col.infobox(v-for="(instruction,index) of instructions" :key="instruction.text")
          .row
            .col
              .row
                .col-auto.on-left
                  h5.text-blue {{index+1}}
                .col
                  .row.justify-center(style="padding-top:20px; padding-bottom:25px;").relative-position
                    img(:src="instruction.img" style="height:150px; padding:15px; filter: drop-shadow(2px 2px 2px #9999)")
                  .row.items-center(style="padding-bottom:35px;")
                    .col
                      p {{instruction.text}}
      .row.lt-lg
        .col.col-12(v-for="(instruction,index) of instructions" :key="instruction.text")
          .row(style="padding:10px; padding-left:10px;")
            .col-1.on-left
              h3.text-blue {{index+1}}
            .col-2.on-left
              img(:src="instruction.img" style="height:100px; padding:5px; filter: drop-shadow(2px 2px 2px #9999)")
            .col
              p(style="width:300px;") {{instruction.text}}
  .row.justify-center
    .col.col-xs-12.col-md-12.col-lg-5(style="max-width:550px;")
      selector
    .col.col-xs-12.col-sm-5.col-md-12.col-lg-4(style="max-width:400px;")
      .row.justify-center
        h5.no-margin Track your progress
      .row.justify-center(style="margin:10px; min-height:30px;")
        .col
          p.text-center Level up and earn NFT rewards.
      progresspanel
      accountpanel(style="margin-top:20px;")
    .col.col-xs-12.col-sm-5.col-md-12.col-lg-3
      .row.justify-center
        h5.no-margin Contributors
      .row.justify-center(style="margin:10px; min-height:30px;")
        p The top 20% will receive the Boid Season Pass.
      leaderboard
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    // padding 20px !important
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
import selector from './SeasonPass-Select'
import accountpanel from './SeasonPass-AccountPanel'
import progresspanel from './SeasonPass-Progress.vue'
import leaderboard from './SeasonPass-Leaderboard.vue'

export default {
  components:{selector,accountpanel,progresspanel,leaderboard},
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){
    this.loading.selectPanel = true
    this.getAll()
    this.updatePayAmount(this.selectedPay)
    this.getBalances()
    this.loading.selectPanel = false
  },
  watch:{
    async 'global.transitWallet'(){
      if(!this.global.transitWallet) return
      this.loading.selectPanel = true
      console.log('Detected transitwallet update in SeasonPass')
      await this.getContributor(this.global.transitWallet.auth.accountName)
      await this.updatePayAmount()
      this.loading.selectPanel = false
    },
    selectedPay(val){
      if (!val)return
      this.updatePayAmount(val)
    },coins(val){
      if (!val) return
      this.checkAmount()
      this.getBalances()
    },
    payAmount(val){
      if (!val || isNaN(val)||val[val.length - 1] =='.' || val[val[val.length - 1] == 0]) return
      const result = parseFloat(parseFloat(val).toFixed(4))
      if (isNaN(result)) this.payAmount = 0
      else this.payAmount = result
    }
  }
}
</script>

