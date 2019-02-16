<template lang="pug">
  div
    .row
      .col(@click="cardClicked()")
        q-card(v-if="parsedPromo").bg-white
          div.hover
            .row
              .col-auto
                div(style="width:5px; height:100%" :class="{highlight:selected === true}")
              .col-2
                img(:src="parsedPromo.reward.image" style="height:80px; padding:10px;")
              .col.relative-position
                .absolute-center.text-center(style="padding-top:10px;") {{parsedPromo.reward.amount}} {{parsedPromo.reward.name}}
                q-tooltip This prize pool will be distributed proportionally among all eligible accounts
                .row.justify-center(style="padding-top:10px;")
                  small Prize Pool
              .col
                .row.justify-end(style="height:100%;")
                  .col.on-right.relative-position(style="padding-top:10px; height:100%;")
                    .row.justify-center
                      small.text-center 
                        | {{parsedPromo.status.message}}
                    .row.justify-center
                      small.absolute-center.text-center(style="padding-top:5px;") 
                        | {{parsedPromo.status.days}} d

                  .col.on-right.relative-position(style="padding-top:10px;" v-if="promo.active && userid")
                    .row.justify-center
                      small.text-center My Status
                    .row.justify-center(style="margin-top:10px;")
                      div(v-if="userEligible")
                        q-icon(name="check" size="30px" color="green")
                      div(v-else)
                        q-icon(name="close" size="30px" color="grey")
                  .col.on-right(v-else style="width:100px;")
              
          .row.justify-center(
            v-if="expand != 'grey-5'" style="margin-top:-8px; padding-top:25px; z-index:-1" ).bg-white
            .col.on-right
              .row
                .col-1
                  .row.justify-center
                    //- q-icon.gt-md(name="menu" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  //- .row.justify-center
                  //-   small.text-center(style="padding-bottom:10px;") Eligible Tiers
                  //- .row.justify-center
                  //-   .col-auto(v-for="tier in parsedPromo.validTiers") {{tier}} &nbsp;
                q-tooltip This promotion is only available for accounts in the listed tiers.
            .col.on-right
              .row
                .col-1
                  .row.justify-center
                    //- q-icon.gt-md(name="menu" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  .row.justify-center
                    small.text-center Leaderboard Type
                  .row.justify-center
                    p {{parsedPromo.leaderboardType.toLowerCase()}}
                  q-tooltip(v-if="promo.leaderboardType === 'AVERAGE'") {{averageMsg}}
                  q-tooltip(v-else) {{cumulativeMsg}}
            .col.on-right
              .row
                .col-1
                  .row.justify-center
                    //- q-icon.gt-md(name="menu" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  .row.justify-center
                    small.text-center Eligible Rank
                  .row.justify-center
                    p Top {{parsedPromo.minRank}}
                q-tooltip The minimum rank you need to hold when the promotion ends.
            .col.on-right.relative-position
              .row
                .col-1
                  .row.justify-center
                    //- q-icon.gt-md(name="fa-clock-o" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  div
                    .row.justify-center
                      small.text-center Timeframe
                    p.text-center {{parsedPromo.startDate}} - {{parsedPromo.endDate}}
                  q-tooltip You need to be on this team during this time to be eligible.



</template>
<style lang="stylus" scoped>
@import '~variables'

.tierBox
  padding 5px
  margin 5px
.highlight
  background-color $green-5
.hover:hover
  background-color $grey-2
</style>

<script>
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
    userEligible(){
      if (!this.promo.active) return false
      var userPosition = this.promo.leaderboard.findIndex(el => this.userid === el.user.id) + 1

      if (userPosition <= this.promo.minRank && userPosition > 0) return true
      else return false
    },
    parsedPromo(){
      if (!this.promo) return null
      var parsed = Object.assign({},this.promo)
      console.log('PARSED',parsed)
      if (parsed.validTiers){
        if (parsed.validTiers.constructor === Array){}
        else{
          parsed.validTiers = JSON.parse(parsed.validTiers)
        }
      } else parsed.validTiers = [0,1,2,3,4,5]
      var startDate = new Date(parsed.startDate)
      console.log(startDate)
      var endDate = new Date(parsed.endDate)
      console.log(endDate)
      parsed.startDate = startDate.getMonth() + 1 + '/' + startDate.getDate()
      parsed.endDate = endDate.getMonth() + 1 + '/' + endDate.getDate()
      
      parsed.status = {}
      if (Date.now() > startDate){
        parsed.status.message = "Ending"
        console.log(endDate)
        console.log(Date.parse(endDate))
        console.log(Date.now())
        parsed.status.days = parseInt((endDate - Date.now()) / 86400000)
        console.log(parsed.status.days)
      } else {
        parsed.status.message = "Starting"
        parsed.status.days = parseInt((startDate - Date.now()) / 86400000)
      }
      console.log(Date.now() < startDate)

      return parsed
    }
  },
  methods:{
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
    deselect(val){
      if (val) {
        if (val != this.promo.id) this.selected = false
      }
    }
  }
}
</script>
