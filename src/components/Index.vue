<template lang="pug">
.layout-padding(v-if="authenticated")
  big.thin-paragraph User Dashboard
  br
  br
  .row.gutter.justify-center
    .col-auto
      q-card.animate-scale
        p.light-paragraph.text-center Power Rating
        div(style="margin:auto;")
          p.text-center {{parseInt(thisUser.powerRatings[0].power)}}
            q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
            small.block.light-paragraph.small Devices: {{parseInt(thisUser.powerRatings[0].meta.devices)}}
              q-icon(name="flash_on" color="yellow")
            small.block.light-paragraph Social: {{parseInt(thisUser.powerRatings[0].meta.social)}}
              q-icon(name="flash_on" color="yellow")
        q-btn(small flat color="blue").block.full-width
          | What is Power Rating?
      q-card.animate-scale
        p.light-paragraph.text-center Wallet
        table.q-table(style="width:100%")
          tbody(v-for="token in thisUser.wallet.tokens" :key="token.id")
            tr.tokenlist.cursor-pointer()
              td 
                img.tokenimg(:src="token.tokenType.image")
              td {{token.tokenType.name}}
              td {{token.balance}}
              td
    .col
      q-card.animate-scale
        p.light-paragraph.text-center My Devices
        q-list( v-for="(device,index) in devices" :key="device.id")
          q-item.relative-position()
            //- | {{device.status}}
            q-item-side
              q-icon(:name="parseDevice.icon(device)" :color="parseDevice.color(device)")         
            q-item-main
              q-item-tile(label style="user-select: none;") {{device.name}}
              q-item-tile(sublabel) {{device.status}}
                //- q -icon.text-center(color="yellow" name='flash_on')
            h6.inline.float-right.text-green(v-if="device.toggle") {{ch.hps}}
            q-spinner-grid.inline.on-right(:size="20" color="green" v-if="device.toggle")

            q-item-side(right)
              q-btn.on-left(  round flat  color="blue" @click="configDevice(device.id)")
                q-icon(name='settings' color="")
            q-toggle(v-model="device.toggle" color="green" @blur="device.pending = true,toggleDevice(device)")
            q-inner-loading(:visible="device.pending")
              q-spinner(size="30px" color="blue")
              //- | {{device.toggle}}
        q-btn.full-width( small color="green")
          | add more Devices
          q-icon.on-right(name="add")
      q-card.animate-scale
        p.light-paragraph.text-center User Leaderboard
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th
              th Username
              th Team
              th Power
                q-icon(name="flash_on" color="yellow")
              th
          tbody(v-for="user in this.leaderboard" :key="user.id")
            tr
              td 
                img.avatar(:src="user.image")
              td(data-th="Username") {{user.username}}
              td(data-th="Team") $10.11
              td(data-th="Power") {{parseInt(user.power)}}
      q-card.animate-scale
        p.light-paragraph.text-center Team Leaderboard
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th
              th Teamname
              th Leader
              th Power
                q-icon(name="flash_on" color="yellow")
              th
          tbody(v-for="team in this.teamLeaderboard" :key="team.id")
            tr
              td 
                img.avatar(:src="team.image")
              td(data-th="Username") {{team.name}}
              td(data-th="Leader") $10.11
              td(data-th="Power") {{parseInt(team.power)}}
      
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

export default {
  name: "index",
  data() {
    return {
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
    }
  },
  props: ["thisUser", "authenticated", "api", "ch"],
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

</style>
