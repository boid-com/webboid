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
    .col-md-12.col-lg-6(style="padding-bottom:15px; max-height:520px;")
      q-card(style="height:100%; overflow:auto;")
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
                      img(:src="user.team.image" style="width:20px; height:20px; object-fit:cover; margin-top:1px;")
                .row
                  .col-auto
                    img.avatar(:src="user.image" style="object-fit:cover; height:55px; width:55px; ")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power" style="width:80px;").text-green-5.text-bold + {{parseInt(user.percentageChange).toLocaleString()}}%
              //- td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
    .col(style="padding-bottom:15px; ")
      q-card(style="height:100%; max-height:520px;")
        p.light-paragraph.text-center Recently Added Team Promotions
        div(style="height:430px; overflow:auto;")
          promoCard.cursor-pointer.clickable(
          v-for="promo of recentPromotions"
          :key="promo.id" :promo="promo"
          :basic="true"
          @click.native="$router.push({name:'Team',params:{teamname:promo.team.name},query:{promo:promo.id}})"
          )
  .row
    .col-md-12.col-lg-6(style="padding-bottom:15px;")
      q-card(style="height:100%;" v-if="tiersLeaderboard").animate-scale.relative-position
        p.light-paragraph.text-center Users
        // q-btn.absolute-top-right(flat ground color="green" @click="refreshLeaderboard()")
        //   q-icon(name="refresh")
        .row.justify-between
          .col-auto
            .row.justify-center
              small Power Tier
            div(style="padding:4px;")
            .row
              q-btn(big :class="{tierBtn:index === selectedTier}"
              v-for="(tier,index) of tiersLeaderboard.length"
              :key="index"
              @click="selectedTier = index") {{index}}
          .col-auto
            .row.justify-center
              small.text-white 1
            div(style="padding:4px;")
            q-btn( big :class="{tierBtn: showSocial}" @click="selectedTier = null") social
        div(style="padding:15px;")
        table.q-table.horizontal-separator(v-if="!showSocial" style="width:100%")
          thead
            tr
              th
              th.relative-position(style="width:50px;")
                q-tooltip Boid Power change Percentage
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px; padding-right:15px;")
          tbody( v-for="(user,index) in selectedLeaderboard" :key="user.id").full-width
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
                    img.avatar(:src="user.image" style="object-fit:cover; height:55px; width:55px; ")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power" style="width:80px;") {{parseInt(user.tPower).toLocaleString()}}
              //- td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
        table.q-table.horizontal-separator(v-else style="width:100%")
          thead
            tr
              th.relative-position
                small.light-paragraph.absolute-left Does not include team leaders.
              th.relative-position(style="width:30px;")
                q-tooltip Active users invited(tier 1+)
                q-icon.absolute-center(name="fa-users" style="top:15px;" color="grey-8")
              th.relative-position(style="width:30px;")
                q-tooltip Boid Power from social invites only
                p.absolute-left(style="height:30px; top:5px; padding-left:10px;") S
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px; padding-right:5px;")
          tbody( v-for="(user,index) in socialLeaderboard" :key="user.id").full-width
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
                    img.avatar(:src="user.image" style="object-fit:cover; height:55px; width:55px; ")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td() {{parseInt(user.invited).toLocaleString()}}
              td(data-th="Power") {{parseInt(user.sPower).toLocaleString()}}
    .col-md-12.col-lg-6
      q-card.animate-scale
        p.light-paragraph.text-center Teams
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
              td(data-th="Power") {{parseInt(team.power).toLocaleString()}}

</template>

<script>
import promoCard from '@/promoCard.vue'

export default {

  name: 'index',
  data() {
    return {
      team: {},
      promotions:null,
      topMovers:null,
      selectedTier:null,
      showSocial:false,
      selectedLeaderboard:null,
      socialLeaderboard:null,
      tiersLeaderboard:null,
      teamLeaderboard:null
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
    async refreshLeaderboard(){
      // console.log('refresh')
      this.$api.tiersLeaderboard().then(el =>{
        this.tiersLeaderboard = el
      })
      this.promotions = await this.$api.recentPromotions()
      this.topMovers = await this.$api.topGainers()
      this.socialLeaderboard = await this.$api.socialLeaderboard()
      this.teamLeaderboard = await this.$api.teamsLeaderboard()
      if (!this.selectedTier && this.showSocial != true ) this.selectedTier = this.thisUser.tier
    }
  },
  watch: {
    team(val) {
      // console.log('gotTeam', val)
    },
    selectedTier(val){
      if (val != null) {
          if (this.tiersLeaderboard) this.selectedLeaderboard = this.tiersLeaderboard[this.selectedTier]
          this.showSocial = false
          return
        }
      else return this.showSocial = true, this.selectedLeaderboard = null
    },
    thisUser(val){
      // console.log("leader1>>>>",val)
      if (!val.tier) this.selectedTier = 0
      if (!this.selectedTier && this.showSocial != true ) this.selectedTier = val.tier
    },
    tiersLeaderboard(val){
      // console.log("leader2>>>",val)
      if(!val) return
      if (this.showSocial === false) this.selectedLeaderboard = val[this.selectedTier]
    }
  },
  async mounted() {
    // console.log('MOUNTED LEADERBOARDS')
    this.refreshLeaderboard()

    // console.log(this.socialLeaderboard)
  },
  props: ['thisUser', 'api', 'authenticated','globalStats']
}
</script>

<style lang="stylus">
@import '~variables'

p
  margin-bottom 0
.tierBtn{
  background-color $blue-6
  color: white
}

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
