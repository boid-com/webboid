<template lang="pug">
  div
    .row
      .col(@click="cardClicked()")
        q-card(v-if="promo").bg-white
          div
            .row
              .col-auto
                div(style="width:5px; height:100%" :class="{highlight:selected === true}")
              .col-2
                img(:src="promo.reward.coin.image" style="height:80px; padding:10px;")
              .col.relative-position
                .absolute-center.text-center {{promo.reward.amount}} {{promo.reward.name}}
                q-tooltip This prize pool will be distributed proportionally among all elligible accounts.
              .col
                .row.justify-end
                  .col.on-right.relative-position(style="padding-top:10px;")
                    .row.justify-center
                      small.text-center Time Remaining
                    .row.justify-center
                      small 2d
                  .col.on-right.relative-position(style="padding-top:10px;")
                    .row.justify-center
                      small.text-center My Status
                    .row.justify-center
                      div(v-if="userEligible")
                        q-icon(name="check" size="30px" color="green")
              
          .row.justify-center(v-if="expand != 'grey-5'" style="margin-top:-8px; padding-top:25px; z-index:-1" ).bg-white
            .col.on-right
              .row
                .col-1
                  .row.justify-center
                    q-icon.gt-md(name="menu" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  .row.justify-center
                    small.text-center Eligible Tiers
                  .row.justify-center
                    .col-auto(v-for="tier in promo.validTiers") {{tier}} &nbsp;
                q-tooltip This promotion is only available for accounts in the listed tiers.
            .col.on-right
              .row
                .col-1
                  .row.justify-center
                    q-icon.gt-md(name="menu" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  .row.justify-center
                    small.text-center Eligible Rank
                  .row.justify-center
                    p Top {{promo.minRank}}
                q-tooltip The minimum rank you need to hold when the promotion ends.
            .col.on-right.relative-position
              .row
                .col-1
                  .row.justify-center
                    q-icon.gt-md(name="fa-clock-o" size="30px;" color="grey-7" style="padding-top:0px;")
                .col
                  div
                    .row.justify-center
                      small.text-center Timeframe
                    p.text-center {{promo.startDate}} - {{promo.endDate}}
                  q-tooltip You need to be on this team during this time to be eligible.



</template>
<style lang="stylus" scoped>
@import '~variables'

.tierBox
  padding 5px
  margin 5px
.highlight
  background-color $green-5
</style>

<script>
export default {
  data(){
    return{
      selected:null,
      expand:'grey-5'
    }
  },
  props:['promo','userid','deselect'],
  computed:{
    userEligible(){
      return true
    }
  },
  methods:{
    setSelected(val){
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
