<template lang="pug">
div
  div
    big.thin-paragraph(v-if="authenticated") User Dashboard!!!
    big.thin-paragraph(v-else) Global Leaderboards
    br
    br
    .relative-position.layout-padding(v-if="!authenticated")
      .block.absolute-center
        q-btn.on-left(big  style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join
    .row.gutter.justify-center
      .col-md-3.col-lg-3.col-xl-3(v-if="authenticated")
        div
          q-card.relative-position.animate-scale
            q-btn.absolute.infobtn(round small flat)
              q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.power)")
            p.light-paragraph.text-center Power Rating
            div(style="margin:auto;")
              p.text-center {{userPower}}
                //- p.text-center(v-if="!ch.toggle") Enable a device to generate Power
                q-icon.text-center( v-if="ch.toggle" color="yellow" name='flash_on' style="font-size:50px;")
                q-icon.text-center( v-else color="grey-4" name='flash_on' style="font-size:50px;")
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
                    div.ellipsis.inline(style="max-width:220px;") {{thisUser.username}}
                  td
            div(style="padding-left:5px")
              p.light-paragraph(v-if="!thisUser.tagline") No tagline set...
              p(v-else) {{thisUser.tagline}}
            q-btn.full-width(color="blue" @click="$e.$emit('openProfileEditModal')")
              | Update profile
          q-card.animate-scale.relative-position(v-if='thisUser.team')
            q-btn.absolute.infobtn(round small flat)
              q-icon(name="help_outline" @click="$e.$emit('showInfoModal',info.team)")
            div.light-paragraph.text-center My Team
            table.q-table( style="width:100%")
              tbody()
                tr.cursor-pointer(@click="$router.push({name:'Team',params:{teamname:thisUser.team.name}})")
                  td 
                    img.tokenimg(:src="thisUser.team.image")
                  td {{thisUser.team.name}}
            //- q-btn.full-width(color="blue" outline @click="openURL(thisUser.team.meta.social.telegram)")
            //-   | Join Telegram
          q-card.animate-scale.relative-position
            q-btn.absolute.infobtn(round small flat)
              q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.wallet)")
            p.light-paragraph.text-center Wallet
            table.q-table.reactive(style="width:100%")
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
      .col-md-9(style="min-width:300px;" )
        q-card.animate-scale.relative-position(v-if="authenticated")
          p.light-paragraph.text-center My Devices
            q-btn.absolute.infobtn(round small flat)
              q-icon.infobtn(name="help_outline" @click="$e.$emit('showInfoModal',info.devices)")
          q-list( v-for="(device,index) in devices" :key="device.id")
            q-item.relative-position(v-if="!adBlock")
              //- | {{device.status}}
              q-item-side
                q-icon(:name="parseDevice.icon(device)" :color="parseDevice.color(device)")         
              q-item-main
                q-item-tile(label style="user-select: none;") {{device.name}}
                q-item-tile(sublabel) {{device.status}}
                  //- q -icon.text-center(color="yellow" name='flash_on'
              h6.inline.float-right.text-green-4(v-if="device.toggle && device.type=='BROWSER'") {{ch.hps}}
              q-spinner-grid.inline.on-right(:size="20" color="grey-4" v-if="device.toggle")
              q-item-side(right v-if="device.toggle" )
                //- q-btn.on-left.hovericon(  round flat @click="configDevice(device.id)")
                  q-icon(name='settings' color="")
              q-item-side.text-green(right v-else-if="userPower < 1" )
                div.inline Start Here
                  q-icon(name="arrow_forward" size="30px")
              q-toggle(v-model="device.toggle" color="yellow" @blur="device.pending = true,toggleDevice(device)")
              q-inner-loading(:visible="device.pending")
                q-spinner(size="30px" color="blue")
                //- | {{device.toggle}}
            q-item.relative-position.bg-red(v-else color="red" style="height:80px")
              h5.text-white Disable AdBlock and refresh to continue

          q-btn.full-width( disabled small color="green")
            | add more Devices
            q-icon.on-right(name="add")
        div.full-width
          leaderboard(:leaderboard='leaderboard' :teamLeaderboard="teamLeaderboard")
    div.relative-position.layout-padding(v-if="!authenticated")
      .block.absolute-center
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
import device from '@/Device'
import parseDevice from 'src/lib/parseDevice'
import { openURL } from 'quasar'
import leaderboard from '@/Leaderboards'

var info = {
  wallet: {
    heading: 'Your Wallet',
    body: `Tokens and coins which you earn from your team will show up in your wallet.
          To earn more, you need to increase your Power by running Boid on more devices or inviting more users.
          During the Alpha, only BOIDs are generated.`
  },
  power: {
    heading: 'Boid Power',
    body: `Your Boid Power is your score that shows how much influence you have on Boid.  The higher your Power,
          the more you will earn and the higher you will climb in the leaderboards. When you invite others, you
          earn some power when they run the app.`
  },
  devices: {
    heading: 'Your Devices',
    body: `When you install the Boid application on multiple devices (desktops, laptops, phones), 
          you will be able to manage your devices here.`
  },
  team: {
    heading: 'Your Team',
    body: `Your power generated goes towards your Team, in eachange, each team will distribute exclusive rewards. 
          You are automatically on the team of the user who has invited you.`
  },
  social: {
    heading: 'Social',
    body: `When users join Boid using your invite link you will receive a small percentage of bonus power based
          on their contributions. Your Invite link changes if you change your username.`
  }
}

export default {
  name: 'index',
  data() {
    return {
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
        return parseInt(this.thisUser.powerRatings[0].power)
      } catch (err) {
        return 0
      }
    }
  },
  methods: {
    configDevice(deviceId) {
      this.currentDevice = deviceId
      this.$refs.deviceModal.open()
    },
    toggleDevice: async function(device) {
      console.log('TOGGLE STATE', device.toggle)
      try {
        if (!device.toggle) {
          var result = await this.api.device.updateStatus({
            deviceId: device.id,
            status: 'ACTIVE'
          })
        } else {
          console.log('online')
          var result = await this.api.device.updateStatus({
            deviceId: device.id,
            status: 'ONLINE'
          })
        }
      } catch (error) {
        console.log(error)
      } finally {
        console.log(result)
        this.$e.$emit('refreshUser')
        this.$e.$emit('ch.toggle', device.toggle)
      }
    },
    init() {
      this.devices = this.thisUser.devices
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    thisUser() {
      this.init()
    },
    adBlock() {
      console.log('here we are')
    }
  },
  props: ['thisUser', 'thisDevice', 'authenticated', 'api', 'ch', 'adBlock', 'leaderboard', 'teamLeaderboard'],
  components: {
    device,
    leaderboard
  }
}
</script>

<style lang="stylus">
@import '~variables';

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
  table.q-table.responsive:not(.flipped) tr, table.q-table.responsive:not(.flipped) td {
    display: inline-table;
  }
}

tr:hover {
  background-color: $grey-2;
}
</style>
