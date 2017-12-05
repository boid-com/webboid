<template lang="pug">
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    .layout-padding.relative-position
        h5.text-center Configure Device
        h6.text-center {{thisDevice.name}}
        p {{ch}}
        q-toggle(v-model="toggle")
        div(style="max-width:200px;")
            p.subtitle(v-if="toggle") This browser is currently generating account energy
            p.subtitle(v-if="!toggle") This browser is not currently active
        
        q-btn(color='blue' @click="thisModal.close()") finished

        q-inner-loading(:visible="pending")
            q-spinner-ball(size="70px" color="blue")
    //- q-btn.float-left.on-left(@click="submit" outline color="blue") Register

</template>

<script>
export default {
  data() {
    return {
    thisDevice:{
        name:"",
        power:"",
        status:"",
        id:"",
        meta:{}
        
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
    //   console.log()
    //   this.device = this.api.device.get(this.deviceId)
    this.toggle = this.ch.toggle
  },
  watch:{
      deviceId: async function(value){
          if(value){
              this.pending = true
              this.thisDevice = await this.api.device.get(this.deviceId)
              if (this.thisDevice.status == "ACTIVE") this.toggle = true
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

<style lang="stylus">

</style>
