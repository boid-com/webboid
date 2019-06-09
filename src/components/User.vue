<template lang="pug">
  .div(style="padding:10px; max-width:1300px;")
    .layout-padding(v-if="thatUser.id")
      .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
        .row.justify-center.gutter
          div
            q-btn.on-left(big style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join Us
            q-btn.on-left(big style="font-size:20px" color="blue" @click="openURL('https://www.boid.com')") Learn More
      .row.justify-center
        .col-sm-12.col-lg-5.relative-position
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
          div(style="bottom:15px;")
            div(v-if="parseSocial" style="margin-top:16px;")
              p.light-paragraph.text-center
              .row.justify-center(style="padding-top:0px")
                .col(v-for="(social,index) in parseSocial" :key="index")
                  .row.justify-center
                    q-btn.socialbtn(flat round @click="openURL(social.url)")
                      img.socialbtn(:src="social.img" style="max-width:35px; filter:opacity(.8)")
                      q-tooltip {{social.url}}
          .row
            q-card.animate-scale.relative-position(v-if="thatUser.team" class="teamRange")
              div.light-paragraph.text-center NFT/Medals earned
              table.q-table(style="width:100%")
                tbody()
                  tr
                    td
                      img.tokenimg( :src="thatUser.image")
                    td 0/0
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
            q-card.animate-scale.relative-position(v-if="thatUser.team" class="teamRange")
              div.light-paragraph.text-center User Team
              table.q-table(style="width:100%")
                tbody()
                  tr
                    td
                      img.tokenimg( :src="thatUser.team.image")
                    td {{thatUser.team.name}}
          .col-xs-12.col-sm-6.col-md-12
            q-card(@click="ended=false")
              p.light-paragraph.text-center Team Prizes Won
              div(v-if="teamPromotions")
                h6.light-paragraph List of team Promotions
                div(v-if="teamPromotions.coin.length > 0" style="max-height:600px; overflow:auto;")
                  promoCard.cursor-pointer.clickable(
                  v-for="promo of teamPromotions.coin"
                  :key="promo.id" :promo="promo" :userid="thisUser.id"
                  @selected="showPromoLeaderboard(promo)"
                  @deselected="setupLeaderboard()"
                  :deselect="selectedPromo")
                div(v-else)
                  div.light-paragraph.text-center No coin rewards available...
                  q-tooltip You can ask the team leader to add some additional rewards.
          .col-xs-12.col-sm-6.col-md-12
            q-card.animate-scale.relative-position(v-if=("authenticated"))
              .absolute-top-right
                q-btn.infobtn(round small flat)
                  q-icon(name="info_outline" size="30px" @click="$e.$emit('showInfoModal',info.social)")
              p.light-paragraph.text-center Social
              div.relative-position(style="margin:auto; margin-top:30px")
                q-tooltip The number of users that have signed up for Boid using your referral link.
                h3.text-center(style="z-index:5;") {{parseInt(thatUser.invited.length)}}
                  q-icon.text-center.absolute-center(color="blue-1" name='fa-users' style="font-size:50px; z-index:-4;")
              div(style="height:15px;")
              q-btn.full-width( outline color="green" @click="$e.$emit('openSocialModal')")
                | Get Invite Link
          .col-xs-12.col-sm-6.col-md-12
            q-card.animate-scale.relative-position(v-if="thisUser.tokens")
              .absolute-top-right
                q-btn.absolute.infobtn(round small flat)
                  q-icon.infobtn(name="info_outline" size="30px" @click="$e.$emit('showInfoModal',info.wallet)")
              p.light-paragraph.text-center Wallet
              table.q-table.reactive(style="width:100%")
                tbody(v-for="token in thisUser.tokens" :key="token.id")
                  tr.tokenlist.cursor-pointer()
                    td
                      img.tokenimg(:src="token.type.image")
                    td {{token.type.name}}
                    td
                      small Pending
                      p {{token.balance.toFixed(4)}}
                      small Paid Out
                      p {{token.paid.toFixed(4)}}
                    td
                  //- q-tooltip View Transactions
              div(v-if="thisUser.payoutAccount")
                p.light-paragraph.text-center EOS Payout Account
                .row.gutter-md(style="padding-top:10px")
                  .col-8
                    h5(style="margin:5px;") {{thisUser.payoutAccount}}
                  .col-4
                    div
                      q-btn.full-width(color="green" @click="$root.$emit('modal','updatePayoutModal')") Change
              div(v-else)
                p.light-paragraph.text-center You have not linked an EOS account yet
                  q-btn.full-width(color="green" @click="$root.$emit('modal','updatePayoutModal')") Link EOS Account
                  br
                  q-btn.full-width(color="blue" flat @click="$root.$emit('modal','exchangeModal')") Get BOID
        .col-sm-12.col-lg-7
          div(v-if="myProfile")
            div( v-if="thisUser.username")
              q-card.relative-position(ref="chartDiv" style="height:375px; padding: 10px; padding-top: 15px;")
                .light-paragraph.text-center(style="margin-bottom:30px;") My Graphs (14d)
                userChart( style="margin-top:20"
                v-if="powerChart" :chartData="powerChart" :height="295")
                q-inner-loading(:visible="!powerChart")
                  q-spinner-ball(size="60px" color="blue")
          div(v-else)
            div(v-if="thatUser.username")
              q-card.relative-position(ref="chartDiv" style="height:375px; padding: 10px; padding-top: 15px;")
                .light-paragraph.text-center(style="margin-bottom:30px;") {{thatUser.username}}`s Graphs (14d)
                userChart( style="margin-top:20"
                v-if="powerChart" :chartData="powerChart" :height="295")
                q-inner-loading(:visible="!powerChart")
                  q-spinner-ball(size="60px" color="blue")
          .row.full-width(v-if="thatUser")
            .col(v-if="thatUser" v-for="stat of userStats" :key="stat.label")
              .col-xs-6.col-sm-3.col-md-2.col-lg-2
                q-card.relative-position.ellipsis(v-if="stat.label!=='Invited Users / Social Power'" style="min-width:70px; padding:10px;")
                  p.light-paragraph.text-center {{stat.label}}
                  div.relative-position(style="margin:auto; margin-top:0px")
                    h5.text-center(style="z-index:5; margin-top:33px; margin-bottom:20px; font-size:18px;") {{stat.data}}
                    img.text-center.absolute-center(v-if="stat.image" :src="stat.image" style="height:50px; filter: opacity(.6); z-index:-4")
                    q-icon.text-center.absolute-center(v-if="stat.icon != 'add'" color="green-2" :name='stat.icon' style="font-size:45px; z-index:-4;")
                    q-icon.text-center.absolute-center(v-else color="green-2" :name='stat.icon' style="font-size:80px; z-index:-4;")
                    q-tooltip {{stat.label}}
                q-card.relative-position.ellipsis(v-else style="min-width:70px; padding:10px;")
                  p.light-paragraph.text-center {{stat.label}}
                  div.relative-position(style="margin:auto; margin-top:0px")
                    h5.text-center.absolute-left(style="z-index:5; margin-left:22px;margin-top:2px; font-size:18px;") {{parseInt(stat.data1)}}
                    h5.text-center(style="z-index:5; margin-top:33px; margin-bottom:20px; font-size:18px;") {{stat.split}}
                    h5.text-center.absolute-right(style="z-index:5; margin-right:25px; margin-top:2px; margin-bottom:20px; font-size:18px;") {{parseInt(stat.data2)}}
                    img.text-center.absolute-right(v-if="stat.image" :src="stat.image" style="height:50px; margin-top:-12px; margin-right:22px; filter: opacity(.6); z-index:-4")
                    q-icon.text-center.absolute-left(v-if="stat.icon != 'add'" color="green-2" :name='stat.icon' style="font-size:45px; z-index:-4;")
                    q-tooltip {{stat.label}}
          .row(style="width:100%; margin:0 !important;")
            q-card.animate-scale.relative-position(v-if="thisUser.tokens" style="width:100%;")
              .h6.light-paragraph.text-center User Devices
              .row(v-if="authenticated" @click="$e.$emit('showInfoModal',info.devices)")
                .col( v-for="(device, index) in userDevice" :key="device.id")
                  .col-xs-6.col-sm-3.col-md-2.col-lg-2
                    q-card.relative-position.ellipsis(style="min-width:70px; padding:10px; box-shadow:none !important; border:solid 1px #c8c8c8;")
                      q-item-tile(label style="user-select: none;") {{index+1}}. {{device.name}}({{device.type}})
                      q-item-tile.relative-position(style="padding-left:15px;" sublabel  v-if="device.boincPower") CPU: {{device.boincPower.toLocaleString()}}
                          |{{displayPending(devices)}}
                          q-tooltip Device Power (Pending)
                            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")
                          q-item-tile.relative-position(style="padding-left:15px;" sublabel v-if="device.rvnPower && device.rvnPower > 0") GPU: {{device.rvnPower.toLocaleString()}}
                            div.absolute-top-left(style="width:100px; height:30px;")
                            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")
          .row(style="width:100%; margin:0 !important;")
            q-card.animate-scale.relative-position(style="width:100%; padding:10px;")
              .h6.light-paragraph.text-center Work Units and Pow Shores
                .row.justify-center(style="width:100%; padding:10px;")
                  q-btn(flat :class="{activeTab:powDisplay === false}" @click="powDisplay = false")
                    | Work Units
                  q-btn(flat :class="{activeTab:powDisplay === true}" @click="powDisplay = true") POW Shores
                h6.light-paragraph.text-center(v-if="powDisplay===false") Work Units
                h6.light-paragraph.text-center(v-else) POW Shores
</template>
<script>
  import { openURL } from 'quasar'
  import teamLeaderboard from '@/teamLeaderboard.vue'
  import userChart from '@/userChart.vue'
  import parseSocials from 'lib/parseSocial.js'
  import promoCard from '@/promoCard.vue'
  import parseDevice from 'src/lib/parseDevice'

  var info = require('src/lib/infoText.json')

  export default {
    name: 'index',
    components:{userChart,promoCard,teamLeaderboard},
    data () {
      return {
        user:[],
        userTeam:[],
        openURL,
        info,
        parseDevice,
        parseSocial:[],
        chartData:null,
        leaderboardTitle:"",
        leaderboard: [],
        leaderboardType:'LIVE',
        ended:false,
        powDisplay:false,
        endedPromotions:[],
        promotions:[],
        selectedPromo:"",
        userDevice:[]
      }
    },
    computed: {
      myProfile: function(){
        if (this.thisUser && this.thatUser){
          return this.thisUser.id === this.thatUser.id
        }else return false
      },
      powerChart(){
        if (!this.chartData) return null;
        var labels = [];
        var data = [];
        this.chartData.forEach((el)=>{
          if (!el.createdAt) return null;
          const created = new Date(el.createdAt.toString());
          labels.push(created.getMonth() + 1 + '/' + created.getDate());
          data.push(parseInt(el.userPower));
        });
        return {labels,datasets:[{data:data}]}
      },
      userStats(){
        if (!this.thatUser) return null
        return [
          {
            data:parseInt(this.thatUser.tPower).toLocaleString(),
            image:"/statics/images/BoidPower.svg",
            label:"User Total Power"
          },
          {
            data:parseInt(this.thatUser.tier).toLocaleString(),
            icon:'lock',
            label:"User Power Tier"
          },
          {
            data1:this.thatUser.invited.length,
            split: "/",
            data2:this.thatUser.sPower,
            image:"/statics/images/BoidPower.svg",
            icon:'fa-users',
            label:"Invited Users / Social Power"
          },
          {
            data:this.thatUser.devices.length,
            icon:'add',
            label:"User Devices"
          }
        ]
      },
      teamPromotions(){
        if (!this.promotions) return null;
        var tempPromo = this.promotions;
        var promotions = {};
        const now = Date.now();
        tempPromo = tempPromo.map((el,i,arr)=>{
          if(Date.parse(el.startDate) > now && Date.parse(el.endDate) > now ){
            el.active = false
          }else{
            el.active = true
          }
          if (el.leaderboardType === 'AVERAGE'){
            el.leaderboard.sort((a, b) => b.averagePower - a.averagePower)
          }else{
            el.leaderboard.sort((a, b) => b.cumulativeMined - a.cumulativeMined)
          }
          return el
        });
        this.endedPromotions = tempPromo.filter(el=> now > Date.parse(el.endDate))

        if (this.ended) tempPromo = this.endedPromotions;
        else tempPromo = tempPromo.filter(el=> now < Date.parse(el.endDate));
        // if (this.active) tempPromo = tempPromo.filter(()=>false)
        promotions.physical = tempPromo.filter(el => el.reward.type === 'PHYSICAL')
          .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
        promotions.coin = tempPromo.filter(el => el.reward.type === 'COIN')
          .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))
        promotions.nft = tempPromo.filter(el => el.reward.type === 'NFT')
          .sort((a,b) => new Date(a.startDate) - new Date(b.startDate))

        return promotions
      }
    },
    methods: {
      openURL,
      showPromoLeaderboard(promo){
        this.$router.push({ query: Object.assign({}, this.$route.query, { promo: promo.id }) });
        if (Date.parse(promo.endDate) < Date.now()) this.leaderboardTitle = "The selected promotion has ended.";
        else if (!promo.active) this.leaderboardTitle = "The selected promotion has not started yet.";
        else this.leaderboardTitle = "leaderboard for the selected team promotion";
        this.selectedPromo = promo.id;
        this.leaderboardType = promo.leaderboardType;
        const promoLeaderboard = promo.leaderboard.map(el =>{
          var result = Object.assign({},el.user);
          if (promo.leaderboardType == "AVERAGE") result.tPower = el.averagePower;
          else result.tPower = el.cumulativeMined
          result.tokenTransaction = el.tokenTransaction
          return result
        });
        this.leaderboard = promoLeaderboard
      },
      //todo should be updated
      setupLeaderboard: async function() {
        let query = Object.assign({}, this.$route.query)
        delete query.promo
        this.$router.replace({ query })
        this.leaderboardType = 'LIVE'
        this.leaderboardTitle = "Top Users on " + this.team.name.replace(/-/g, ' ')
        this.leaderboard = await this.$api.teamLeaderboard({id:this.team.id})
      },
      //todo should be updated
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
      async getUserChart(){
        // todo should be updated with correct Api fix_me
        this.chartData = [];
        for( let i =0; i < 14; i ++ ){
          let power = Math.random()*1000;
          this.chartData.push({
            userPower:power,
            createdAt:new Date(new Date().getTime() - (new Date(2012,0,2).getTime() - new Date(2012, 0, 1).getTime())*(14-i))
          });
        }
      },
      async getUserDevices(){
        this.userDevice = [];
        this.thatUser.devices.map((devItem)=>{
          this.getUserDevice(devItem.id);
        });
      },
      //todo should be updated with user social function
      async getTeamInfo(){
        this.team = await this.$api.getTeam({name:this.thatUser.team.name});
        this.parseSocial = parseSocials( this.team.social);
      },
      async getUserDevice(id){
        const device =  await this.$api.getDevice({id:id});
        console.log("DEVICE>>>>>>>>>>>>>>",device);
        this.userDevice.push(device);
      },
      async populateTeamPromotions(){
        if( this.thatUser.team.id ){
          this.promotions = await this.$api.getTeamPromotions({teamId:this.thatUser.team.id});
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
        }
      },
    },
    watch:{
      async ended(val){
      },
      async user(val) {
        if (!val) return;
        this.getUserChart();
      },
      'thatUser'(val){
        if (!val) return
        window.localStorage.setItem('invitedById',val.id);
        // todo should be updated
        this.getUserDevices();
        this.getTeamInfo();
        this.populateTeamPromotions();
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
      this.user = await this.$api.getUser({username:this.$route.params.username});
      this.$e.$once('userUpdated',()=>{
        console.log('userUpdated>>>>>>>>>',this.myProfile,this.$route.params.username)//fix_me
      })
    },
    async mounted(){
      this.userDevice = [];

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
      this.$e.$off('user')
    },

    props:['thisUser','thatUser','api','authenticated'],
  }
</script>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card {
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  }
  .tokenimg{
    width:50px;
  }
  .teamRange{
  width:100%
  }
  .user:hover {
    background-color: $grey-2;
  }
  .infobtn {
    right: 15px !important;
    top: 15px !important;
    color: $blue !important;
  }

  .infobtn:hover {
    color: $green-8 !important;
  }
  .q-btn-round.q-btn-small {
    width: 30px;
    height: 30px;
  }
  .hovericon:hover {
    color: $blue;
  }

  .hovericon {
    color: $grey-5;
  }
  .socialbtn:hover
    filter: opacity(1.0)
  .activeTab
    background-color: $green-7
    color: white
</style>
