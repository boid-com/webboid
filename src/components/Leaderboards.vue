<template lang="pug">
div
  .row.justify-center
    .col-xs-12
      q-card(v-if="globalStats") 
        p.light-paragraph.text-center Network Stats
        .row.justify-center
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{parseInt(globalStats.dPower).toLocaleString()}}
              p.light-paragraph.text-center Total Power
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{globalStats.activeUsers}}
              p.light-paragraph.text-center Active Users
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{parseInt(globalStats.averagePower).toLocaleString()}}
              p.light-paragraph.text-center Average Power 
  .row
    .col-md-12.col-lg-6(style="padding-bottom:15px;")
      q-card(style="height:100%;")
        p.light-paragraph.text-center Top Movers (48hrs)
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th 
              th.relative-position(style="width:50px;") 
                q-tooltip Boid Power change Percentage
                q-icon.absolute-center(name="fa-percent" color="grey-7" size="25px" style="padding-top:15px;")
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px; padding-right:45px;")
          tbody(v-for="(user,index) in topMovers" :key="user.id").full-width
            tr.user(style="cursor: pointer;" @click="$router.push({name:'User',params:{username:user.username}})")
              td.relative-position
                .absolute-left.text-grey-7
                  //- .puck.text-center {{index + 1}}
                .absolute-left.text-grey-7(style="left:45px; top:45px;")
                  .puck-lg.text-center
                    .row.justify-center
                      img(:src="user.team.image" style="width:20px; height:20px; margin-top:1px;")
                .row
                  .col-auto
                    img.avatar(:src="user.image")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power" style="width:80px;").text-green-5.text-bold + {{parseInt(user.percentageChange).toLocaleString()}}%
              //- td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
    .col(style="padding-bottom:15px;")
      q-card(style="height:100%;")
        p.light-paragraph.text-center Recently Added Team Promotions
        promoCard.cursor-pointer.clickable(
        v-for="promo of recentPromotions" 
        :key="promo.id" :promo="promo"
        :basic="true"
        @click.native="$router.push({name:'Team',params:{teamname:promo.team.name},query:{promo:promo.id}})"
        )
  .row.justify-center.full-width
    .col-md-12.col-lg-6
      q-card.animate-scale
        p.light-paragraph.text-center Top Users
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th 
              th.relative-position(style="width:50px;") 
                q-tooltip User Boid Power
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
          tbody(v-for="(user,index) in leaderboard" :key="user.id")
            tr.user(style="cursor: pointer;" @click="$router.push({name:'User',params:{username:user.username}})")
              td.relative-position
                .absolute-left.text-grey-7
                  .puck.text-center {{index + 1}}
                .absolute-left.text-grey-7(style="left:45px; top:45px;")
                  .puck-lg.text-center
                    .row.justify-center
                      img(:src="user.team.image" style="width:20px; height:20px; margin-top:1px;")
                .row
                  .col-auto
                    img.avatar(:src="user.image")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
    .col-md-12.col-lg-6
      q-card.animate-scale
        p.light-paragraph.text-center Top Teams
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th(style="width:0px;")
              th.relative-position(style="width:50px;") 
                q-tooltip Team Boid Power
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
          tbody(v-for="(team,index) in teamLeaderboard" :key="team.id")
            tr.user.cursor-pointer(@click="$router.push({name:'Team',params:{teamname:team.name}})")
              td.relative-position
                .absolute-left.text-grey-7 {{index + 1}}
                .row
                  .col-auto
                    img.tokenimg(:src="team.image")
                  .col(style="padding:15px;")
                    .ellipsis(style="max-width:100%;") {{team.name | removeDash}}
              td(data-th="Power") {{parseInt(team.power)}}

</template>

<script>
import promoCard from '@/promoCard.vue'

export default {
  
  name: 'index',
  data() {
    return {
      team: {},
      promotions:null,
      topMovers:null
    }
  },
  components:{promoCard},
  computed: {
    recentPromotions(){
      if (!this.promotions) return 
      const now = Date.now()
      return this.promotions.map((el,i,arr)=>{
        if (Date.parse(el.startDate) > now ){el.active = false}else{el.active = true}
        return el
      })
    }
  },
  methods: {
  },
  watch: {
    team(val) {
      console.log('gotTeam', val)
    }
  },
  async created() {
    this.$e.$on('team', team => {
      this.team = team
    })
    this.promotions = await this.$api.recentPromotions()
    this.topMovers = await this.$api.topGainers()
  },
  props: ['thisUser', 'api', 'authenticated', 'leaderboard', 'teamLeaderboard','globalStats','tiersLeaderboard']
}
</script>

<style lang="stylus">
@import '~variables'

p
  margin-bottom 0


.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.tokenimg{
  width:50px;
}
.user:hover {
  background-color: $grey-2
}
</style>
