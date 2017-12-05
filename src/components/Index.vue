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
          p.text-center 500
            q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
        q-btn(small flat color="blue").block.full-width
          | What is Power Rating?
    .col
      q-card.animate-scale
        p.light-paragraph.text-center My Devices
        q-list( v-for="(device,index) in devices" :key="device.id")
          q-item.relative-position()
            //- | {{device.status}}
            q-item-side
              q-icon(name="tab" v-if="device.status == 'ONLINE'" color="green")
              q-icon(name="tab" v-if="device.status == 'OFFLINE'" color="grey")
            q-item-main
              q-item-tile(label style="user-select: none;") {{device.name}}
              q-item-tile(sublabel) {{device.status}} {{device.power[0]}}
                //- q-icon.text-center(color="yellow" name='flash_on')
            q-spinner-grid.inline.on-right(:size="20" color="green" v-if="device.toggle")
            q-item-side(right)
              //- q-btn.on-left(  round flat  color="blue" @click="configDevice(device.id)")
                q-icon(name='settings' color="")
            q-toggle(v-model="device.toggle" color="green" @blur="device.pending = true,toggleDevice(device)")
            q-inner-loading(:visible="device.pending")
              q-spinner-grid(size="30px" color="blue")
              //- | {{device.toggle}}
        q-btn.full-width( small color="green")
          | add more Devices
          q-icon.on-right(name="add")
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

export default {
  name: "index",
  data() {
    return {
      currentDevice: null,
      devices: []
    }
  },
  computed: {},
  methods: {
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
  },
  watch: {
    thisUser() {
      this.init()
    },
    devices(val) {
      if (val){
      }
    }
  },
  props: ["thisUser", "authenticated", "api", "ch"],
  components: {
    device
  }
}
</script>

<style lang="stylus">
.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
</style>
