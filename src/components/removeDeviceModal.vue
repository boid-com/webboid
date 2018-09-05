<template lang="pug">
  div(style="padding:30px; max-width: 450px;").relative-position
    h5 Remove Device
    p When you remove this device, any Boid Power currently being contributed by this device will no longer count towards this account.
    br
    q-card(v-if="device")
      .row
        .col-auto.relative-position(style="padding:30px;")
          q-icon.absolute-center(:name="parseDevice.icon(device)" :color="parseDevice.color(device)" size="25px;")         
        .col
          h6 {{device.name}}
          h6.relative-position(v-if="device.powerRatings.length>0" style="padding-left:15px; padding-top:3px;") {{device.powerRatings[0].power.toFixed(4)}}
            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")

    br
    br
    br
    br
    q-btn.absolute(color="grey" outline style="bottom:20px; right:170px;" @click="modal.close()")
      | Cancel
    q-btn.absolute(color="red-6" style="bottom:20px; right:20px;" @click="removeDevice(device.id)")
      | Remove Device
    q-inner-loading(:visible="pending")
      q-spinner-ball(size="70px" color="blue")


</template>
<style lang="stylus">
@import '~variables'
  .deviceCard
    padding 20px
  .deviceListIcon
    width: 50px

</style>
<script>
import parseDevice from 'src/lib/parseDevice'

export default {
  data(){
    return {
      pending:false,
      parseDevice,
      device:null
    }
  },
  created(){
    this.init()
  },
  methods:{
    init(){
      this.$root.$on('modal.removeDevice',(toggle,device) =>{
        if (device) this.device = device
        if (toggle){
          this.modal.open()
        } else{
          this.modal.close()
        }
      })
    },
    removeDevice: async function(deviceId){
      this.pending = true
      var result = await this.api.device.remove(deviceId).catch(alert)
      this.$e.$emit('refreshUser')
      this.$e.$emit('userUpdated')
      setTimeout(()=>{
        this.modal.close()
        this.pending = false

      },1000)
    },
    modalOpened(){
      this.pending = false
    },
    modalClosed(){
      this.device = null
      this.pending = false
    } 
  },
  computed:{
  
  },
  props:['modal','api','thisUser'],
  watch:{
    modal(modal){
      if (modal){
        this.modal.$on('close',this.modalClosed)
        this.modal.$on('open',this.modalOpened)
      }
    },
    thisUser(){
    }
  }
}
</script>