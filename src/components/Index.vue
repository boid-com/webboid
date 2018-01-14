<template lang="pug">
div
  .layout-padding()
    big.thin-paragraph(v-if="authenticated") User Dashboard
    big.thin-paragraph(v-else) Global Leaderboards
    br
    br
    .row.gutter.justify-center
      .col-md-4.col-lg-4.col-xl-4(v-if="authenticated")
        div
          q-card.relative-position.animate-scale
            q-btn.absolute.infobtn(round small flat)
              q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.power)")
            p.light-paragraph.text-center Power Rating
            div(style="margin:auto;")
              p.text-center {{parseInt(thisUser.powerRatings[0].power)}}
                q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
                small.block.light-paragraph.small Devices: {{parseInt(thisUser.powerRatings[0].meta.devices)}}
                  q-icon(name="flash_on" color="yellow")
                small.block.light-paragraph Social: {{parseInt(thisUser.powerRatings[0].meta.social)}}
                  q-icon(name="flash_on" color="yellow")
          q-card.animate-scale.relative-position
            q-btn.absolute.infobtn(round small flat)
              q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.social)")
            p.light-paragraph.text-center Social
            p Users Invited: {{thisUser.invited.length}}
            p Power from Invited Users: {{parseInt(thisUser.powerRatings[0].meta.social)}}
            q-btn.full-width(color="green" @click="$e.$emit('openSocialModal')")
              | Get Invite Link
          q-card.animate-scale.relative-position
            div.light-paragraph.text-center My Profile
            table.q-table(style="width:100%")
              tbody
                tr
                  td 
                    img.tokenimg(:src="thisUser.image")
                  td {{thisUser.username}}
            div(style="padding-left:5px")
              p.light-paragraph(v-if="!thisUser.tagline") No tagline set...
              p(v-else) {{thisUser.tagline}}
            q-btn.full-width(color="blue" @click="$e.$emit('openProfileEditModal')")
              | Update profile
          q-card.animate-scale.relative-position
            q-btn.absolute.infobtn(round small flat)
              q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.team)")
            div.light-paragraph.text-center My Team
            table.q-table(style="width:100%")
              tbody()
                tr
                  td 
                    img.tokenimg(:src="thisUser.team.image")
                  td {{thisUser.team.name}}
            q-btn.full-width(color="blue" outline @click="openURL(thisUser.team.meta.social.telegram)")
              img.on-left(style="width:25px" src="https://telegram.org/img/t_logo.png")
              | Join Telegram Chat

          q-card.animate-scale.relative-position
            q-btn.absolute.infobtn(round small flat)
              q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.wallet)")
            p.light-paragraph.text-center Wallet
            table.q-table(style="width:100%")
              tbody(v-for="token in thisUser.wallet.tokens" :key="token.id")
                tr.tokenlist.cursor-pointer()
                  td 
                    img.tokenimg(:src="token.tokenType.image")
                  td {{token.tokenType.name}}
                  td {{token.balance.toFixed(2)}}
                  td
          q-card.animate-scale
            p.light-paragraph.text-center Inventory
            p.text-centered.text-grey Inventory Items are coming soon...

      .col
        q-card.animate-scale.relative-position(v-if="authenticated")
          p.light-paragraph.text-center My Devices
            q-btn.absolute.infobtn(round small flat)
              q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.devices)")
          q-list( v-for="(device,index) in devices" :key="device.id")
            q-item.relative-position(v-if="!adBlock && device.type == 'BROWSER'")
              //- | {{device.status}}
              q-item-side
                q-icon(:name="parseDevice.icon(device)" :color="parseDevice.color(device)")         
              q-item-main
                q-item-tile(label style="user-select: none;") {{device.name}}
                q-item-tile(sublabel) {{device.status}}
                  //- q -icon.text-center(color="yellow" name='flash_on')
              h6.inline.float-right.text-yellow-6(v-if="device.toggle") {{ch.hps}}
              q-spinner-grid.inline.on-right(:size="20" color="yellow-4" v-if="device.toggle")

              q-item-side(right)
                q-btn.on-left.hovericon(  round flat @click="configDevice(device.id)")
                  q-icon(name='settings' color="")
              q-toggle(v-model="device.toggle" color="yellow" @blur="device.pending = true,toggleDevice(device)")
              q-inner-loading(:visible="device.pending")
                q-spinner(size="30px" color="blue")
                //- | {{device.toggle}}
            q-item.relative-position.bg-red(v-else color="red" style="height:80px")
              h5.text-white Disable AdBlock and refresh to continue

          q-btn.full-width( disabled small color="green")
            | add more Devices
            q-icon.on-right(name="add")
        q-card.animate-scale
          p.light-paragraph.text-center Top Users
          table.q-table.horizontal-separator(style="width:100%")
            thead
              tr
                th 
                th Username
                th Team
                th Power
                  q-icon(name="flash_on" color="yellow")
                th Rank
            tbody(v-for="(user,index) in this.leaderboard" :key="user.id")
              tr
                td 
                  img.avatar(:src="user.image")
                td(data-th="Username") {{user.username}}
                td(data-th="Team") {{user.team.name}}
                td(data-th="Power") {{parseInt(user.power)}}
                td {{index + 1}}
        q-card.animate-scale
          p.light-paragraph.text-center Top Teams
          table.q-table.horizontal-separator(style="width:100%")
            thead
              tr
                th
                th 
                th Leader
                th Power
                  q-icon(name="flash_on" color="yellow")
                th Rank
            tbody(v-for="(team,index) in this.teamLeaderboard" :key="team.id")
              tr
                td 
                  img.avatar(:src="team.image")
                td(data-th="Username") {{team.name}}
                td(data-th="Leader") $10. 11
                td(data-th="Power") {{parseInt(team.power)}}
                td {{index + 1}}
        div.relative-position(v-if="!authenticated")
          .absolute-center
            br
            br
            br
            br
            q-btn.on-left(big  style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join
            //- q-btn(big style="font-size:30px" color="blue" @click="openURL('https://www.boid.com')") Learn More

    q-modal(ref="deviceModal" @close="currentDevice = null")
      device(
        :deviceId="currentDevice"
        :api="api"
        :ch="ch"
        :thisModal="$refs.deviceModal"
      )

</template>

<script>
import device from "@/Device"
import parseDevice from "src/lib/parseDevice"
import { openURL } from 'quasar'

var info = {
  wallet:{
    heading:"Your Wallet",
    body:`Tokens and coins which you earn from your team will show up in your wallet.
          To earn more, you need to increase your Power by running Boid on more devices or inviting more users.
          During the Alpha, only BOIDs are generated.`
  },
  power:{
    heading:"Boid Power",
    body:`Your Boid Power is your score that shows how much influence you have on Boid.  The higher your Power,
          the more you will earn and the higher you will climb in the leaderboards. When you invite others, you
          earn some power when they run the app.`
  },
  devices:{
    heading:"Your Devices",
    body:`When you install the Boid application on multiple devices (desktops, laptops, phones), 
          you will be able to manage your devices here.`
  },
  team:{
    heading:"Your Team",
    body:`Your power generated goes towards your Team, in eachange, each team will distribute exclusive rewards. 
          You are automatically on the team of the user who has invited you.`
  },
  social:{
    heading:"Social",
    body:`When users join Boid using your invite link you will receive a small percentage of bonus power based
          on their contributions. Your Invite link changes if you change your username.`
  }

}


export default {
  name: "index",
  data() {
    return {
      openURL,
      info,
      currentDevice: null,
      devices: [],
      parseDevice,
      leaderboard:[],
      teamLeaderboard:[],
      pollLeaderboard:null
    }
  },
  computed: {
    userPower:() => {
      return 'lul'
    }
  },
  methods: {
    updateLeaderboards: async function(){
      this.leaderboard = await this.api.leaderboard.global() 
      this.teamLeaderboard = await this.api.leaderboard.teams() 
      console.log('updateLeaderboard',this.leaderboard)
    },
    toggleDevice(device) {
      console.log(device)
    },
    configDevice(deviceId) {
      this.currentDevice = deviceId
      this.$refs.deviceModal.open()
    },
    toggleDevice:async function(device) {
      console.log('TOGGLE STATE',device.toggle)
      try {
        if(!device.toggle){
        var result = await this.api.device.updateStatus({
          deviceId:device.id,
          status:'ACTIVE'
        })
      }else{
        console.log('online')
        var result = await this.api.device.updateStatus({
          deviceId:device.id,
          status:'ONLINE'
        })
      }
      } catch (error) {
        console.log(error)
      }finally{
        console.log(result)
        this.$e.$emit('refreshUser')
        this.$e.$emit('ch.toggle',device.toggle)
      }
    },
    init() {
      this.devices = this.thisUser.devices
    }
  },
  mounted() {
    this.init()
    this.updateLeaderboards()
    setInterval(this.updateLeaderboard,200000)
  },
  watch: {
    thisUser() {
      this.init()
    },
    adBlock(){
      console.log('here we are')
    }
  },
  props: ["thisUser", "authenticated", "api", "ch","adBlock"],
  components: {
    device
  }
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
.tokenlist{

}
.tokenlist:hover
  background-color: $grey-2
.hovericon:hover
  color $blue
.hovericon
  color $grey-5
.power
  color $yellow-4
.infobtn
  color $grey-6
  font-size 15px
  right 10px
.infobtn:hover
  color $green
.q-btn-round.q-btn-small
  width 30px
  height 30px

</style>
