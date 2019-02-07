<template lang="pug">
.div(style="padding:30px; max-width:1200px;")
  .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
    .row.justify-center.gutter
      q-btn( big color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal',true)") Join US
  .row.justify-center
    .col-sm-12.col-lg-4
      div.relative-position(style="min-width:300px; padding-bottom:30px;")
        .layout-padding.full-width.relative-position(style="height:140px;")
          img.absolute-center.block(style="width:120px; height:120px;" :src="team.image")
        h5.text-center {{team.name | removeDash}}
        h6.light-paragraph.text-center {{team.tagline}}
        br
      .row
        .col(v-for="stat of teamStats" :key="stat.label")
          q-card.animate-scale(style="min-width:70px; padding:15px; height:110px;")
            div.relative-position(style="margin:auto; margin-top:30px")
              h5.text-center(style="z-index:5;") {{stat.data}}
                img.text-center.absolute-center(v-if="stat.image" :src="stat.image" style="height:70px; filter: opacity(.4); z-index:-4") 
                q-icon.text-center.absolute-center(v-if="stat.icon != 'add'" color="green-1" :name='stat.icon' style="font-size:55px; z-index:-4;")
                q-icon.text-center.absolute-center(v-else color="green-1" :name='stat.icon' style="font-size:100px; z-index:-4;")
                q-tooltip {{stat.label}}
      .row
        .col-12
          q-card(v-if="team.owner" style="min-height:135px;")
            p.light-paragraph.text-center Leader
            q-item(highlight :to="{name:'User',params:{username:team.owner.username}}")
              q-item-side(:avatar="team.owner.image")
              q-item-main
                q-item-tile(label) {{team.owner.username}}
                q-item-tile(sublabel) {{team.owner.tagline}}
              q-item-side(right icon="flash_on" stamp="") 
                small.text-center {{parseInt(team.owner.tPower)}}

    .col-sm-12.col-lg-8
      q-card.relative-position(ref="chartDiv" style="height:374px; padding: 40px;")
        .light-paragraph.text-center Team Stats
        teamChart(v-if="powerChart" :chartData="powerChart" :height="295" v-on:legend-clicked="alert('data')")
        q-inner-loading(:visible="!powerChart")
          q-spinner-ball(size="60px" color="blue")
      div
        q-card(v-if="parseSocial" style="margin-top:15px; min-height:125px;")
          p.light-paragraph.text-center Social
          .row.justify-center(style="padding:10px")
            .col(v-for="(social,index) in parseSocial" :key="index")
              .row.justify-center
                q-btn.socialbtn(flat round @click="openURL(social.url)")
                  img.socialbtn(:src="social.img" style="max-width:30px; filter:opacity(.8)")
                  q-tooltip {{social.url}}

              //- a(:href="social[1]") {{social[0]}}


  .row.gutter.justify-center
    .col
      q-card
        p.light-paragraph.text-center {{leaderboardTitle}}
        teamLeaderboard(:leaderboard="leaderboard" :thisUser="thisUser")
    .col
      q-card
        p.light-paragraph.text-center Team Promotions
        div(v-if="teamPromotions")
          h6.light-paragraph Physical Rewards 
          div(v-if="teamPromotions.physical.length > 0")
            promoCard.cursor-pointer.clickable(
            v-for="promo of teamPromotions.physical" 
            :key="promo.id" :promo="promo" :userid="thisUser.id" @click.native="alert('hi')" )
          div(v-else)
            q-card.relative-position(style="padding:20px;")
              div.light-paragraph.text-center No physical rewards available...
              q-tooltip You can ask the team leader to add some additional rewards.
          h6.light-paragraph Coin Rewards 
          div(v-if="teamPromotions.coin.length > 0")
            promoCard.cursor-pointer.clickable(
            v-for="promo of teamPromotions.coin" 
            :key="promo.id" :promo="promo" :userid="thisUser.id" @selected="showPromoLeaderboard(promo)" @deselected="setupLeaderboard()" :deselect="selectedPromo" )
          div(v-else)
            q-card.relative-position(style="padding:20px;")
              div.light-paragraph.text-center No coin rewards available...
              q-tooltip You can ask the team leader to add some additional rewards.
          h6.light-paragraph Boid NFT Collectibles 
          div(v-if="teamPromotions.nft.length > 0")
            .row
              .col-1
                q-btn(round @click="" name="check")
              .col
                promoCard.cursor-pointer.clickable(
                v-for="promo of teamPromotions.nft" 
                :key="promo.id" :promo="promo" :userid="thisUser.id" @click.native="alert('hi')" )
          div(v-else)
            q-card.relative-position(style="padding:20px;")
              div.light-paragraph.text-center No collectible rewards available...
              q-tooltip You can ask the team leader to add some additional rewards.




</template>

<style lang="stylus" scoped>
  .socialbtn:hover
    filter: opacity(1.0)
</style>


<script>
import teamChart from '@/teamChart.vue'
import promoCard from '@/promoCard.vue'
import teamLeaderboard from '@/teamLeaderboard.vue'
import parseSocials from 'lib/parseSocial.js'
import { openURL } from 'quasar'

export default {
  name: 'index',
  components:{teamChart,promoCard,teamLeaderboard},
  data() {
    return {
      team: {},
      leaderboard: [],
      leaderboardTitle:"",
      chartData:null,
      selectedPromo:"",
      promotions:[
        // {
        //   id:23223434,
        //   startDate: new Date(Date.now() - 243000000).toLocaleDateString().replace('/2019',''),
        //   endDate: new Date(Date.now() + 1430000).toLocaleDateString().replace('/2019',''),
        //   validTiers:[1,2,3,4],
        //   minRank: 20,
        //   reward:{
        //     type:"COIN",
        //     amount:30000000,
        //     coin:{
        //       image:"https://assets.boid.com/images/boidviplogonew2.png",
        //       name:"BOID"
        //     }
        //   }
        // },
        // {
        //   id:983983939483,
        //   startDate: new Date(Date.now() - 243000000).toLocaleDateString().replace('/2019',''),
        //   endDate: new Date(Date.now() + 1430000).toLocaleDateString().replace('/2019',''),
        //   validTiers:[1,2,3,4],
        //   minRank: 20,
        //   reward:{
        //     type:"COIN",
        //     amount:30,
        //     coin:{
        //       image:"https://assets.boid.com/images/boidviplogonew2.png",
        //       name:"BOID"
        //     }
        //   }
        // }
      ]
    }
  },
  computed: {
    parseSocial(){
      if (!this.team.social) return null
      return parseSocials(this.team.social)
    },
    powerChart(){
      if (!this.chartData) return null
      var labels = []
      var data = []
      var data2 = []
      this.chartData.forEach((el)=>{
        if (!el.createdAt) return null
        const created = new Date(el.createdAt)
        labels.push(created.getMonth() + 1 + '/' + created.getDate())
        data.push(parseInt(el.power))

        // labels.push(created.getMonth() + 1 + '/' + created.getDate())
        data2.push(parseInt(el.power*1.01))
      })
      console.log(data)
      return {
        labels,
        datasets:[
        {
          data
        },
        {
          data:data2
        }
        ]
      }
    },
    teamStats(){
      return [
        {
          data:parseInt(this.team.power).toLocaleString(),
          image:"/statics/images/BoidPower.svg",
          label:"Team Power"
        },
        {
          data:this.team.activeUsers,
          icon:'fa-users',
          label:"Active Users"
        },
        {
          data:this.team.bonus * 100 + '%',
          icon:'add',
          label:"Team Bonus"
        }
      ]
    },
    teamPromotions(){
      if (!this.promotions) return null
      var promotions = {}
      promotions.physical = this.promotions.filter(el => el.reward.type === 'PHYSICAL')
      promotions.coin = this.promotions.filter(el => el.reward.type === 'COIN')
      promotions.nft = this.promotions.filter(el => el.reward.type === 'NFT')
      return promotions
    }
  },
  methods: {
    openURL,
    showPromoLeaderboard(promo){
      this.selectedPromo = promo.id
      this.leaderboardTitle = "Showing leaderboard for selected team promotion"
      // this.$nextTick(()=> this.deselectPromos = true)
    },
    setupLeaderboard: async function() {
      this.leaderboardTitle = "Top Users on " + this.team.name.replace(/-/g, ' ')
      if (this.leaderboard.length > 0) console.log('found leaderboard already')
      this.leaderboard = await this.$api.teamLeaderboard({id:this.team.id})
    }
  },
  watch: {
    async team(val) {
      if (!val) return
      this.promotions = this.team.promotions
      this.setupLeaderboard()
      window.localStorage.setItem('invitedById', this.team.owner.id)
      this.chartData = await this.$api.getTeamChart({teamId:this.team.id})
      // console.log(this.powerChart)
    }
  },
  async created() {
    this.team = await this.$api.getTeam({name:this.$route.params.teamname})
  },
  destroyed(){
    this.$e.$off('team')
  },
  props: ['thisUser', 'api', 'authenticated']
}
</script>
<style lang="stylus">
@import '~variables'
.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.tokenimg{
  width:50px;
}
.user:hover {
  background-color: $grey-2;
}
</style>
