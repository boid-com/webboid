<template lang="pug">
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    .layout-padding.relative-position
        h5.text-center Configure Device
        p.text-center.inline {{thisDevice.name}}
            q-icon.on-right(:name='thisDevice.icon' :color="parseDevice.color(thisDevice)")
        q-alert(
            color="green"
            icon="info"
            enter="fadeIn"
            leave="fadeOut"
            dismissible
        )
            p You can manaully configure the secure applications which Boid will run on this device.
        p.light-paragraph.text-center
            //- q-list(v-for="(app,index) in thisDevice.meta.applications")
            //-     | {{app.name}}



        div.text-center(style="margin-top:10px;")
            q-btn(color='blue' @click="thisModal.close()") finished
        q-inner-loading(:visible="pending")
            q-spinner-ball(size="70px" color="blue")
    //- q-btn.float-left.on-left(@click="submit" outline color="blue") Register

</template>

<script>
import parseDevice from "src/lib/parseDevice"
import { Alert } from 'quasar'

export default {
  data() {
    return {
        parseDevice,
    thisDevice:{
        name:"",
        power:"",
        status:"",
        id:"",
        meta:{},
        icon:"",
        type:""
        
    },
        pending: false,
        toggle: false
    }
  },
  computed: {

  },
  methods: {

  },
  props: ["thisUser", "authenticated", "api", "deviceId", "thisModal","ch"],
  mounted() {
    // //   console.log()
    // //   this.device = this.api.device.get(this.deviceId)
    // console.log('mountedDeviceModal',this.ch.toggle)
    // this.toggle = this.ch.toggle
  },
  watch:{
      deviceId: async function(value){
          if(value){
              this.pending = true
              this.thisDevice = await this.api.device.get(this.deviceId)
              if (this.thisDevice.status == "ACTIVE") this.toggle = true
              this.thisDevice.icon = parseDevice.icon(this.thisDevice) 
              this.pending = false
          }
      },
      toggle: async function(value){
          console.log(value)
          this.$e.$emit('ch.toggle',value)
      }
  }
}
</script>

<style scoped lang="stylus">
    .layout-padding
        max-width:700px
</style>
