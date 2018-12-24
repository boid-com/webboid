<template lang="pug">
div
  div
    div.thin-paragraph(v-if="authenticated")
    div(v-else) 
      bHeader(style="drop-shadow: 0px 4px 10px grey").shadow-3
    br
    .row.justify-center(v-if="!authenticated")
      div
        q-btn.on-left(big style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join Us
        q-btn.on-left(big style="font-size:20px" color="blue" @click="openURL('https://www.boid.com')") Learn More
    br
  .row.justify-center
    .col-md-4.col-lg-3.col-xl-3(v-if="authenticated")
      .row.justify-center
        .col-12
          .row
            .col-xs-12.col-sm-6.col-md-12
              q-card.relative-position.animate-scale
                q-btn.absolute.infobtn(round small flat)
                  q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.power)")
                p.light-paragraph.text-center My Boid Power
                .row.justify-center
                  .col-7
                    img.float-right(v-if="userPower > 0" src="/statics/images/BoidPower.svg" style=" margin-top: 10px; fill:white; width:100%; max-height:140px; padding:20px;")
                    img.float-right(v-else src="/statics/images/BoidPower-Off.svg" style="fill:white; width:100%; max-height:140px; padding:20px;")
                  .col-5
                    div.relative-position(style="padding-top: 10px;")
                      small.block.light-paragraph.small Total: 
                      h5 {{thisUser.tPower.toFixed(4)}}
                        //- p.text-center(v-if="!ch.toggle") Enable a device to generate Power
                        // q-icon.text-center( v-if="ch.toggle" color="yellow" name='flash_on' style="font-size:50px;")
                        // q-icon.text-center( v-else color="grey-4" name='flash_on' style="font-size:50px;")
                      div
                        small.block.light-paragraph.small From Devices: 
                        p.light-paragraph {{thisUser.dPower.toFixed(4)}}
                        small.block.light-paragraph From Social: 
                        p.light-paragraph {{thisUser.sPower.toFixed(4)}}
            .col-xs-12.col-sm-6.col-md-12
              q-card.animate-scale.relative-position
                q-btn.absolute.infobtn(round small flat)
                  q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.social)")
                p.light-paragraph.text-center Social
                div.relative-position(style="margin:auto; margin-top:30px")
                  q-tooltip Invited Users
                  h3.text-center(style="z-index:5;") {{parseInt(thisUser.invited.length)}}
                    q-icon.text-center.absolute-center(color="blue-1" name='fa-users' style="font-size:50px; z-index:-4;")
                div(style="height:15px;")
                q-btn.full-width( outline color="green" @click="$e.$emit('openSocialModal')")
                  | Get Invite Link
          .row(style="align-items: stretch;")
            .col-xs-12.col-sm-6.col-md-12
              q-card.animate-scale.relative-position
                div.light-paragraph.text-center Profile
                table.q-table(style="width:100%")
                  tbody
                    tr
                      td 
                        img.tokenimg(:src="thisUser.image")
                        div.ellipsis.inline(style="max-width:220px;") {{thisUser.username}}
                      td
                div(style="padding-left:5px")
                  p.light-paragraph.text-truncate(v-if="!thisUser.tagline") No tagline set...
                  p.text-truncate(v-else) {{thisUser.tagline}}
                q-btn.full-width(outline color="blue" @click="$e.$emit('openProfileEditModal')")
                  | Update profile
            .col-xs-12.col-sm-6.col-md-12
              q-card.animate-scale.relative-position(v-if='thisUser.team' )
                q-btn.absolute.infobtn(round small flat)
                  q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.team)")
                div.light-paragraph.text-center Team
                table.q-table.reactive( style="width:100%; margin-top:10px")
                  tbody()
                    tr.cursor-pointer(@click="$router.push({name:'Team',params:{teamname:thisUser.team.name}})")
                      td 
                        img.tokenimg(:src="thisUser.team.image")
                      td {{thisUser.team.name}}
          .row
            .col-xs-12.col-sm-6.col-md-12
              q-card.animate-scale.relative-position
                q-btn.absolute.infobtn(round small flat)
                  q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.wallet)")
                p.light-paragraph.text-center Wallet
                table.q-table.reactive(style="width:100%")
                  tbody(v-for="token in thisUser.wallet.tokens" :key="token.id")
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
                        q-btn.full-width(color="green" @click="$root.$emit('modal.updatePayout',true)") Change  
                div(v-else)
                  p.light-paragraph.text-center You have not linked an EOS account yet
                  q-btn.full-width(color="green" @click="$root.$emit('modal.updatePayout',true)") Link EOS Account  

               

                 
            .col-xs-12.col-sm-6.col-md-12
              div
                q-card.animate-scale.relative-position
                  q-btn.absolute.infobtn(round small flat)
                    q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.wallet)")
                  p.light-paragraph.text-center Inventory
                  table.q-table.reactive(style="width:100%")
                    tbody
                      tr.tokenlist.cursor-pointer()
                        td 
                          img.tokenimg(src="https://assets.boid.com/images/winprizes.svg")
                        td Boid Items
                //- q-card(style="padding:0px;")
                //-   iframe(src="https://cl1.widgetbot.io/channels/467640777187655700/467640777703424001" height="400" width="100%")
    .col-md-8.col-lg-9.col-xl-8
      .row
        .col-12
          q-card.animate-scale.relative-position(v-if="authenticated")
            p.light-paragraph.text-center My Devices
              q-btn.absolute.infobtn(round small flat)
                q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.devices)")
            q-list( v-for="(device,index) in devices" :key="device.id")
              q-item.relative-position(v-if="!adBlock" style="padding-bottom:30px;")
                q-item-side()
                  q-icon(:name="parseDevice.icon(device)" :color="parseDevice.color(device)")         
                q-item-main
                  q-item-tile(label style="user-select: none;") {{device.name}}
                  q-item-tile.relative-position(
                    style="padding-left:15px;" sublabel v-if="device.powerRatings"
                    ) {{device.powerRatings[0].power.toFixed(4)}}
                    img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")
                div.absolute(style="width:190px; height:50px; left:180px; padding-top:8px;" v-show="browserDeviceToggle && device.type=='BROWSER'")
                  q-tooltip CPU Usage
                  div.relative-position.float-left
                    q-btn.on-left(style="margin-right:20px;" small round @click="$root.$emit('browserDeviceThrottle',ch.throttle += .1 )") -
                    h6.absolute-center.text-black(style="margin-top:3px; width:35px;" v-if="browserDeviceToggle && device.type=='BROWSER'") {{throttlePercent}}
                    q-btn(style="margin-left:35px;" small round @click="$root.$emit('browserDeviceThrottle',ch.throttle -= .1 )") +
                .relative-position(style="width: 80px;")
                  q-tooltip Hashes Per Second
                  h5.inline.float-right.text-green-4(style="margin-top:0px; margin-bottom: 0px" v-if="browserDeviceToggle && device.type=='BROWSER'") {{ch.hps}}
                div(v-if="device.type=='BROWSER'")
                q-spinner-grid.inline.on-right( :size="30" color="grey-4" v-if="browserDeviceToggle && !ch.accepted" style="margin-right:10px;")
                q-spinner-cube.inline.on-right( :size="30" color="yellow" v-if="browserDeviceToggle && ch.accepted" style="margin-right:10px;")
                q-item-side(right v-if="device.toggle" )
                  //- q-btn.on-left.hovericon(  round flat @click="configDevice(device.id)")
                    q-icon(name='settings' color="")
                // q-item-side.text-green(right v-else-if="userPower < 1" )
                //   div.inline Start Here
                //     q-icon(name="arrow_forward" size="30px")
                q-progress.absolute-bottom(v-if="browserDeviceToggle && device.type=='BROWSER'" :indeterminate="ch.found" color="yellow" style="bottom:10px;")

                q-toggle(v-if="device.type==='BROWSER'" v-model="browserDeviceToggle" color="yellow")
                q-inner-loading(:visible="device.pending")
                  q-spinner(size="30px" color="blue")
                  //- | {{device.toggle}}
                //- q-item-side.relative-position(right)
                //-   q-btn.absolute-center(
                //-     flat color="red-5" 
                //-     style="right:-17px; padding:5px; margin-left:20px;"
                //-     @click="$root.$emit('modal.removeDevice',true,device)"
                //-     )
                //-     q-tooltip Remove Device
                //-     q-icon(name="close" color="grey-5")
              q-item.relative-position.bg-red(v-else color="red" style="height:80px")
                h5.text-white Disable AdBlock and refresh to continue

            q-btn.full-width(v-if="thisUser.devices.length > 0 " style="margin-top:20px;" color="green" @click="$root.$emit('modal.addDevice',true)")
              | add more Devices
              q-icon.on-right(name="add")
            q-btn.full-width(v-else style="margin-top:20px;" color="green"           @click="$root.$emit('modal.addDevice',true)")
              | add your first device
              q-icon.on-right(name="add")
          div.full-width
            leaderboard.full-width(:leaderboard='leaderboard' :teamLeaderboard="teamLeaderboard")
      // q-modal(ref="deviceModal" @close="currentDevice = null")
      //   device(
      //     :deviceId="currentDevice"
      //     :api="api"
      //     :ch="ch"
      //     :thisModal="$refs.deviceModal"
      //   )

</template>

<script>
import device from '@/Device'
import parseDevice from 'src/lib/parseDevice'
import { openURL } from 'quasar'
import leaderboard from '@/Leaderboards'
import bHeader from '@/Header'

var info = {
  wallet: {
    heading: 'Your Wallet',
    body: `Tokens and coins that you earn will show up here, during the Alpha, only BOIDs are generated. Soon you will be able to earn other coins as well.`
  },
  power: {
    heading: 'Boid Power',
    body: `Boid Power increases when you run Boid on devices. Your Power will also decrease when devices are turned off. The higher your Power, the more you will earn and the higher you will climb in the leaderboards.`
  },
  devices: {
    heading: 'Your Devices',
    body: `When you install the Boid application on multiple devices (desktops, laptops, phones), 
          you will be able to manage your devices here.`
  },
  team: {
    heading: 'Your Team',
    body: `Your power generated goes towards your team, in eachange, each team will distribute exclusive rewards. 
          You are automatically on the team of the user who has invited you.`
  },
  social: {
    heading: 'Social',
    body: `When users join Boid using your invite link you will receive a small percentage of bonus power based
          on their contributions. Your invite link changes if you change your username.`
  }
}

export default {
  name: 'index',
  data() {
    return {
      browserDeviceId:null,
      chThrottleDisplay:null,
      browserDeviceToggle:false,
      openURL,
      info,
      currentDevice: null,
      devices: [],
      parseDevice,
      pollLeaderboard: null
    }
  },
  computed: {
    userPower() {
      // return 0
      try {
        var total = this.thisUser.powerRatings[0].power.toFixed(4)
        return total

      } catch (err) {
        return 0
      }
    },
    throttlePercent(){

      if (this.ch.throttle === 0) return "100%"
      else return (100 - (this.ch.throttle * 100).toFixed(0)) + "%"
    }
  },
  methods: {
    configDevice(deviceId) {
      this.currentDevice = deviceId
      this.$refs.deviceModal.open()
    },
    toggleDevice: async function(device) {
    },
    init() {
      if (!this.thisUser) return
      this.devices = this.thisUser.devices
      if (!this.devices) return
      this.devices.forEach((el)=>{
        if (el.type === "BROWSER"){
          this.browserDeviceId = el.id
        }
      })
      // this.devices = this.thisUser.devices.map((el,i)=>{
      //   if (el.type === "BROWSER"){
      //     if (this.devices[i]){
      //       el.toggle = this.devices[i].toggle
      //     }else{
      //       el.toggle = false
      //     }
      //   } else el.toggle = false
      //   return el
      // })
    },
    disableToggle(device){
      if (device.type==="BROWSER"){
        return false
      }else return true
    }
  },
  mounted() {
    
    this.init()
  },
  watch: {
    ch(){
      this.chThrottleDisplay = this.ch.throttle
    },
    browserDeviceToggle(value){
      console.log('browserdevicetoggle',value)
      this.$root.$emit('browserDeviceToggle',value,this.browserDeviceId)
    },
    thisUser() {
      // console.log('GOT THIS USER')
      this.init()
    },
    adBlock() {
      console.log('here we are')
    }
  },
  props: ['thisUser', 'thisDevice', 'authenticated', 'api', 'ch', 'adBlock', 'leaderboard', 'teamLeaderboard'],
  components: {
    device,
    leaderboard,
    bHeader
  }
}
</script>

<style lang="stylus">
@import '~variables'
// @import url('/statics/Comfortaa-Regular.ttf')
p
  margin-bottom 0px

h5
  font-family: 'Comfortaa', cursive;  
  font-size: 20px 
  @media screen and (max-width 500px)
    font-size: 15px 
  
h4
  font-family: 'Comfortaa', cursive;  
h6
  font-family: 'Comfortaa', cursive;  


.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}

.tokenimg {
  width: 50px;
}

.tokenlist {
}

.tokenlist:hover {
  background-color: $grey-2;
}

.hovericon:hover {
  color: $blue;
}

.hovericon {
  color: $grey-5;
}

.power {
  color: $yellow-4;
}

.infobtn {
  color: $grey-6;
  font-size: 15px;
  right: 10px;
}

.infobtn:hover {
  color: $green;
}

.q-btn-round.q-btn-small {
  width: 30px;
  height: 30px;
}

@media (max-width: 767px) {
  table.q-table.responsive:not(.flipped) table.q-table.responsive:not(.flipped) td {
    display: inline-table;
  }
}

// tr:hover {
//   background-color: $grey-2;
// }
</style>
