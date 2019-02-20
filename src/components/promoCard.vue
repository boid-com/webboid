<template lang="pug">
  div
    .row
      .col(@click="cardClicked()")
        q-card(v-if="parsedPromo" :class="{live:parsedPromo.status.live === true, selected: selected}" ).bg-white
          div.hover(style="height:50px; padding:5px;")
            .row
              .col-auto
                div(style="width:5px; height:100%; margin-right:15px;" :class="{highlight:selected === true,unselected:selected ===false}")
              .col-2
                img(:src="parsedPromo.reward.image" style="height:40px; margin-top:0px;")
              .col.relative-position(v-if="parsedPromo.reward.type === 'COIN' ")
                .absolute-center.text-center(style="padding-top:10px; width:300px;") {{parsedPromo.reward.amount}} {{parsedPromo.reward.name}}
                q-tooltip This prize pool will be distributed proportionally among all eligible accounts
                .row.justify-center(style="padding-top:0px;")
                  small Prize Pool
              .col.relative-position(v-else)
                .absolute-center.text-center(style="padding-top:0px; width:300px;") {{parsedPromo.reward.name}}
                q-tooltip This prize pool will be distributed proportionally among all eligible accounts
              .col
                .row.justify-end(style="height:100%;")
                  .col.on-right.relative-position(style="padding-top:0px; height:100%;")
                    .row.justify-center
                      small.text-center 
                        | {{parsedPromo.status.message}}
                    .row.justify-center
                      small.absolute-center.text-center(style="margin-top:5px;") 
                        | {{parsedPromo.status.days}} d

                  .col.on-right.relative-position(style="padding-top:-3px;" v-if="promo.active && userid")
                    .row.justify-center(style="padding-top:0px;")
                      small.text-center My Status
                    .row.justify-center(style="margin-top:0px;")
                      div(v-if="userEligible")
                        q-icon(name="check" size="30px" color="green")
                      div(v-else)
                        q-icon(name="close" size="30px" color="grey")
                  .col.on-right(v-else style="width:100px;")
          div(v-if="expand != 'grey-5'")   
            .row.justify-center(
              style="margin-top:0px; padding-top:25px; z-index:-1" ).bg-white
              .col.on-right
                .row
                  .col
                    .row.justify-center
                      small.text-center(style="padding-bottom:10px;") Distribution Type
                    .row.justify-center
                      p {{parsedPromo.distributionType.toLowerCase()}}
                  q-tooltip {{explainDistributionType}}
              .col
                .row
                  .col
                    .row.justify-center
                      small.text-center Leaderboard Type
                    .row.justify-center(style="padding-top:10px;")
                      p {{parsedPromo.leaderboardType.toLowerCase()}}
                    q-tooltip(v-if="promo.leaderboardType === 'AVERAGE'") {{averageMsg}}
                    q-tooltip(v-else) {{cumulativeMsg}}
              .col
                .row
                  .col
                    .row.justify-center
                      small.text-center Eligible Rank
                    .row.justify-center(style="padding-top:10px;")
                      p Top {{parsedPromo.minRank}}
                  q-tooltip The minimum rank you need to hold when the promotion ends.
              .col.on-right.relative-position
                .row
                  .col
                    div
                      .row.justify-center
                        small.text-center Timeframe
                      p.text-center(style="padding-top:10px;") {{parsedPromo.startDate}} - {{parsedPromo.endDate}}
                    q-tooltip You need to be on this team during this time to be eligible.
            .row(v-if="parsedPromo.reward.type==='PHYSICAL'" @click="openURL(parsedPromo.reward.details)")
              q-btn.full-width(color="blue" flat) Details



</template>
<style lang="stylus">
@import '~variables'

.tierBox
  padding 5px
  margin 5px
.highlight
  background-color $green-5
.unselected
  background-color $grey-4
.hover:hover
  background-color $grey-2
.live
  box-shadow: 0 5px 10px 0px rgba(8, 156, 252,0.35)
.selected
  box-shadow: 0 5px 10px 0px $green-3 !important
  // background-color $blue-1

</style>

<script>
import { openURL } from 'quasar'

export default {
  data(){
    return{
      selected:null,
      expand:'grey-5',
      averageMsg: "This promotion is based on your average Boid Power during this timeframe.",
      cumulativeMsg: "This promotion is based on the number of BOIDs that you earn during the timeframe."
    }
  },
  props:['promo','userid','deselect'],
  computed:{
    explainDistributionType(){
      console.log('found dist',this.promo.distributionType)
      if (!this.promo.distributionType) return ""
      if (this.promo.distributionType === "PROPORTIONAL") return `
      The prize pool is distributed among the winning users proportional to their relative contribution.
      `
      else if(this.promo.distributionType === "CUSTOM") return `
      The prize pool is distributed among a custom rule that the leader has defined.
      `
      else if(this.promo.distributionType === "EVEN") return `
      All winners receive the same reward.
      `
    },
    userEligible(){
      if (!this.promo.active) return false
      var userPosition = this.promo.leaderboard.findIndex(el => this.userid === el.user.id) + 1

      if (userPosition <= this.promo.minRank && userPosition > 0) return true
      else return false
    },
    parsedPromo(){
      if (!this.promo) return null
      var parsed = Object.assign({},this.promo)
      if (parsed.validTiers){
        if (parsed.validTiers.constructor === Array){}
        else{
          parsed.validTiers = JSON.parse(parsed.validTiers)
        }
      } else parsed.validTiers = [0,1,2,3,4,5]
      var startDate = new Date(parsed.startDate)
      var endDate = new Date(parsed.endDate)
      parsed.startDate = startDate.getMonth() + 1 + '/' + startDate.getDate()
      parsed.endDate = endDate.getMonth() + 1 + '/' + endDate.getDate()
      
      parsed.status = {}
      if (Date.now() > startDate){
        parsed.status.message = "Ending"
        parsed.status.live = true
        parsed.status.days = parseInt((endDate - Date.now()) / 86400000)
      } else {
        parsed.status.message = "Starting"
        parsed.status.live = false
        parsed.status.days = parseInt((startDate - Date.now()) / 86400000)
      }
      console.log(Date.now() < startDate)

      return parsed
    }
  },
  methods:{
    openURL,
    setSelected(val){
      // if (this.promo.leaderboard.length === 0) return
      if (!val){
        if (this.selected) return this.deselected()
        this.$emit('selected')
        this.selected = true
      } else{
        this.$emit('selected')
        this.selected = true
      }
    },
    deselected(){
      this.selected = false
      this.$emit('deselected')
    },
    expander(val){
      if (val) return this.expand = 'blue-4'
      if (this.expand === 'blue-4') this.expand = 'grey-5'
      else this.expand = 'blue-4'
    },
    cardClicked(){
      if (this.selected && this.expand == 'blue-4'){
        this.setSelected()
        this.expander()
      }else{
        this.setSelected(true)
        this.expander(true)
      }
    }
  },
  watch:{
    deselect:{
      handler: function(val){
        console.log('indeselect')
        if (val) {
          if (val != this.promo.id) this.selected = false
          else {
            this.setSelected(true)
            this.expander(true)
            // setTimeout(el =>{this.cardClicked()},500)
            // this.$nextTick(this.cardClicked())
            }
        }
      },
      immediate:true
    }

  }
}
</script>
