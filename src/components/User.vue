<template lang="pug">
  .div(style="padding:10px; max-width:1300px;")
    .layout-padding(v-if="thatUser.id")
      .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
        .row.justify-center.gutter
          div
            q-btn.on-left(big style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join Us
            q-btn.on-left(big style="font-size:20px" color="blue" @click="openURL('https://www.boid.com')") Learn More
      .row.justify-center
        .col-sm-12.col-lg-4.relative-position
          q-card.animate-scale.relative-position(style="min-width:300px")
            .layout-padding.full-width.relative-position(style="height:140px;")
              img.avatar.absolute-center.block( v-if="myProfile" style="width:120px; height:120px;" :src="thisUser.image")
              img.avatar.absolute-center.block(v-else style="width:120px; height:120px;" :src="thatUser.image")
            h5.text-center(v-if="myProfile") {{thisUser.username}}
            h5.text-center(v-else) {{thatUser.username}}
            div(v-if="!myProfile")
              .tagline(v-if="thatUser.tagline")
                h6.light-paragraph.text-center {{thatUser.tagline}}
              .tagline(v-else-if="myProfile")
                h6.light-paragraph.text-center add a cool tagline here
            div(v-else)
              .tagline(v-if="thisUser.tagline")
                h6.light-paragraph.text-center {{thisUser.tagline}}
          div(v-if="myProfile" style="margin:8px; margin-bottom:0px;")
            q-btn.full-width(color='blue' @click="$e.$emit('openProfileEditModal')") Update Profile
          .row
            q-card.animate-scale.relative-position(v-if="thatUser.powerRatings")
              p.light-paragraph.text-center Power Rating
              div(style="margin:auto;")
                p.text-center {{parseInt(thatUser.powerRatings[0].power)}}
                  q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")

            q-card.animate-scale.relative-position(v-if="thatUser.powerRatings")
              p.light-paragraph.text-center Social
              div(style="margin:auto;")
                h5.text-center.light-paragraph {{thatUser._invitedMeta.count}}
                p.text-center Invited Users
              q-btn.full-width(v-if="myProfile" color="green" @click="$e.$emit('openSocialModal')")
                | Get Invite Link
            q-card.animate-scale.relative-position(v-if="thatUser.team")
              div.light-paragraph.text-center My Team
              table.q-table(style="width:100%")
                tbody()
                  tr
                    td
                      img.tokenimg( :src="thatUser.team.image")
                    td {{thatUser.team.name}}
              // q-btn.full-width(v-if="thatUser.team.meta.social.telegram" color="blue" outline @click="openURL(thatUser.team.meta.social.telegram)")
                | Telegram Chat
              // q-btn.full-width( v-if="thatUser.team.meta.social.facebook" color="blue" outline @click="openURL(thatUser.team.meta.social.facebook)")
                | Facebook Group
        .col-sm-12.col-lg-8
          div(v-if="getTeamInfo")
            q-card.relative-position(ref="chartDiv" style="height:375px; padding: 10px; padding-top: 15px;")
              .light-paragraph.text-center(style="margin-bottom:30px;") Team Graphs (14d)
              teamChart( style="margin-top:20"
              v-if="powerChart" :chartData="powerChart" :height="295")
              q-inner-loading(:visible="!powerChart")
                q-spinner-ball(size="60px" color="blue")
        .row.full-width(v-if="team")
          .col-xs-12.col-sm-12.col-md-4.col-xl-4
            .row
              .col-12.relative-position
                q-card(v-if="team.owner")
                  p.light-paragraph.text-center Leader
                  q-item( style="padding-top:6px;"
                  highlight :to="{name:'User',params:{username:team.owner.username}}")
                    q-item-side(:avatar="team.owner.image")
                    q-item-main
                      q-item-tile(label) {{team.owner.username}}
                      q-item-tile.ellipsis(sublabel)
                        small {{team.owner.tagline}}
                    q-item-side(right icon="flash_on" stamp="")
                      small.text-center {{parseInt(team.owner.tPower)}}
          .col(v-if="team" v-for="stat of teamStats" :key="stat.label").col-xs-6.col-sm-3.col-md-2.col-lg-2
            q-card.relative-position.ellipsis(style="min-width:70px; padding:10px;")
              p.light-paragraph.text-center {{stat.label}}
              div.relative-position(style="margin:auto; margin-top:0px")
                h5.text-center(style="z-index:5; margin-top:33px; margin-bottom:20px; font-size:18px;") {{stat.data}}
                img.text-center.absolute-center(v-if="stat.image" :src="stat.image" style="height:50px; filter: opacity(.6); z-index:-4")
                q-icon.text-center.absolute-center(v-if="stat.icon != 'add'" color="green-2" :name='stat.icon' style="font-size:45px; z-index:-4;")
                q-icon.text-center.absolute-center(v-else color="green-2" :name='stat.icon' style="font-size:80px; z-index:-4;")
                q-tooltip {{stat.label}}
      .row.justify-center.gutter
        .layout-padding(v-if="!authenticated")
          .layout-padding
        .col
          q-card()
            p.light-paragraph.text-center {{leaderboardTitle}}
            teamLeaderboard(:leaderboard="leaderboard" :thisUser="thisUser" :type="leaderboardType")
        .col-md-12.col-lg-6
          q-card
            p.light-paragraph.text-center Team Promotions
            div(v-if="teamPromotions")
              .row.justify-center(style="padding-bottom:5px;")
                small filter
              .row.justify-center
                q-btn(flat :class="{activeTab:ended === false}" @click="ended = false")
                  | live & upcoming
                q-btn(flat :class="{activeTab:ended === true}" @click="ended = true") Ended
              h6.light-paragraph Physical Rewards
              div(v-if="teamPromotions.physical.length > 0" style="max-height:600px; overflow:auto;")
                promoCard.cursor-pointer.clickable(
                v-for="promo of teamPromotions.physical"
                :key="promo.id" :promo="promo" :userid="thisUser.id"
                @selected="showPromoLeaderboard(promo)"
                @deselected="setupLeaderboard()"
                :deselect="selectedPromo")
              div(v-else)
                q-card.relative-position(style="padding:20px;")
                  div.light-paragraph.text-center No physical rewards available...
                  q-tooltip You can ask the team leader to add some additional rewards.
              h6.light-paragraph Coin Rewards
              div(v-if="teamPromotions.coin.length > 0" style="max-height:600px; overflow:auto;")
                promoCard.cursor-pointer.clickable(
                v-for="promo of teamPromotions.coin"
                :key="promo.id" :promo="promo" :userid="thisUser.id"
                @selected="showPromoLeaderboard(promo)"
                @deselected="setupLeaderboard()"
                :deselect="selectedPromo")
              div(v-else)
                q-card.relative-position(style="padding:20px;")
                  div.light-paragraph.text-center No coin rewards available...
                  q-tooltip You can ask the team leader to add some additional rewards.
              h6.light-paragraph Boid NFT Collectibles
              div(v-if="teamPromotions.nft.length > 0" style="max-height:600px; overflow:auto;")
                .row
                  .col
                    promoCard.cursor-pointer.clickable(
                    v-for="promo of teamPromotions.nft"
                    :key="promo.id" :promo="promo" :userid="thisUser.id"
                    @selected="showPromoLeaderboard(promo)"
                    @deselected="setupLeaderboard()"
                    :deselect="selectedPromo")
              div(v-else)
                q-card.relative-position(style="padding:20px;")
                  div.light-paragraph.text-center No collectible rewards available...
                  q-tooltip You can ask the team leader to add some additional rewards.
          q-card(v-if="team.tWidget" style="padding:0px; height:510px; overflow:hidden;" )
            iframe(
            :src="team.tWidget"
            style="margin:0px;"
            id="tgw_5c6ca24c83ba88d8738b456d"
            frameborder="0"
            scrolling="no"
            horizontalscrolling="no"
            verticalscrolling="no"
            width="100%"
            height="540px"
            )
</template>
<script>
  import { openURL } from 'quasar'
  import teamLeaderboard from '@/teamLeaderboard.vue'
  import teamChart from '@/teamChart.vue'
  import parseSocials from 'lib/parseSocial.js'
  import promoCard from '@/promoCard.vue'



  export default {
    name: 'index',
    components:{teamChart,promoCard,teamLeaderboard},
    data () {
      return {
        team:[],
        openURL,
        chartData:null,
        leaderboardTitle:"",
        leaderboard: [],
        leaderboardType:'LIVE',
        ended:false,
        endedPromotions:[],
        promotions:[],
        selectedPromo:"",
      }
    },
    computed: {
      myProfile: function(){
        if (this.thisUser && this.thatUser){
          return this.thisUser.id === this.thatUser.id
        }else return false
      },
      getTeamInfo: async function(){
        console.log("USERSTART>>>>>");//fix_me
        console.log('TEAMNAME>>>>>>>>', this.thatUser.team.name);//fix_me
        this.team = await this.$api.getTeam({name:this.thatUser.team.name});
      },
      parseSocial(){
        console.log("TEAM START>>>>>>");//fix_me
        if (!this.team.social) return null
        return parseSocials(this.team.social)
      },
      teamStats(){
        if (!this.team.owner) return null
        var ownerStake = this.team.owner.stake.toFixed(0).toLocaleString()
        if (!ownerStake) return null
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
            data:(this.team.bonus * 100).toFixed(2) + '%',
            icon:'add',
            label:"Team Bonus"
          },
          {
            data:ownerStake + ' BOID',
            icon:'lock',
            label:"Leader Stake"
          }
        ]
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
          data.push(parseInt(el.teamPower))
          data2.push(parseInt(el.activeUsers))
        })
        return {labels,datasets:[{data:data},{data:data2}]}
      },
    },
    methods: {
      openURL,
      showPromoLeaderboard(promo){
        this.$router.push({ query: Object.assign({}, this.$route.query, { promo: promo.id }) })
        if (Date.parse(promo.endDate) < Date.now()) this.leaderboardTitle = "The selected promotion has ended."
        else if (!promo.active) this.leaderboardTitle = "The selected promotion has not started yet."
        else this.leaderboardTitle = "leaderboard for the selected team promotion"
        this.selectedPromo = promo.id
        this.leaderboardType = promo.leaderboardType
        const promoLeaderboard = promo.leaderboard.map(el =>{
          var result = Object.assign({},el.user)
          if (promo.leaderboardType == "AVERAGE") result.tPower = el.averagePower
          else result.tPower = el.cumulativeMined
          result.tokenTransaction = el.tokenTransaction
          return result
        })
        // console.log('hi',promo.leaderboard)
        // console.log('PROMOLEADERBOARD',promoLeaderboard)
        this.leaderboard = promoLeaderboard
      },
      setupLeaderboard: async function() {
        let query = Object.assign({}, this.$route.query)
        delete query.promo
        this.$router.replace({ query })
        this.leaderboardType = 'LIVE'
        this.leaderboardTitle = "Top Users on " + this.team.name.replace(/-/g, ' ')
        // if (this.leaderboard.length > 0) console.log('found leaderboard already')
        this.leaderboard = await this.$api.teamLeaderboard({id:this.team.id})
      },
      async populateTeamPromotions(){
        this.promotions = await this.$api.getTeamPromotions({teamId:this.team.id})
        const promoId = this.$route.query.promo
        if (promoId){
          const foundPromo = this.promotions.find(el=>el.id === promoId)
          if (foundPromo){
            if (Date.parse(foundPromo.endDate) < Date.now()) this.ended = true
            this.showPromoLeaderboard(foundPromo)
          }else {
            this.setupLeaderboard()
          }
        }
      },
      async getTeamChart(){
        this.chartData = await this.$api.getTeamChart({teamId:this.team.id})
      }
    },
    watch:{
      async ended(val){
        // console.log(val)
      },
      async team(val) {
        console.log('VAL>>>>', val);//fix_me
        if (!val) return
        if (!this.$route.query.promo) this.setupLeaderboard()
        this.populateTeamPromotions()
        this.getTeamChart()
        window.localStorage.setItem('invitedById', this.team.owner.id)
      },
      'thatUser'(val){
        console.log('VAL>>>>', val);//fix_me
        if (!val) return
        window.localStorage.setItem('invitedById',val.id)
        console.log('thatUser',this.thatUser)
      },
      "thisUser":function(val,oldVal){

        if ((val.username != oldVal.username) && this.myProfile && this.$route.params.username){
          setTimeout(()=>{
            this.$router.push({name:"User",params:{username:this.thisUser.username}})
          },1000)
        }
      }

    },
    async created(){
      this.$e.$once('userUpdated',()=>{
        console.log('userUpdated',this.myProfile,this.$route.params.username)
      })
    },
    async mounted(){
      setTimeout(()=>{
        if(!this.$route.query.promo | !this.$q.platform.is.desktop) return
        window.scrollTo({
          top: 500,
          left: 0,
          behavior: 'smooth'
        })
      },500)
    },
    destroyed(){
      this.$e.$off('team')
    },

    props:['thisUser','thatUser','api','authenticated'],
  }
</script>
<style lang="stylus">
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
  .socialbtn:hover
    filter: opacity(1.0)
  .activeTab
    background-color: $green-7
    color: white
</style>
