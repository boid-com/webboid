<template lang="pug">
  div(style="overflow:hidden;")
    h4.text-blue.text-center(style="padding:20px;") Device Global Settings
    div(v-if="config" style="padding-left:20px; padding-right:20px; height:500px; overflow:hidden;").relative-position
      q-field(icon="power_settings_new"  helper="Enable to launch Boid when the device is started.")
        q-checkbox(v-model="config.addToStartup" label="Start on System Boot")
      q-field(icon="remove"  helper="When enabled Boid will not display the main window on startup. You will need to access Boid by clicking on the icon in the system tray.")
        q-checkbox(v-model="config.startMinimized" label="Start Minimized")
      q-field(icon="remove_red_eye"  helper="When enabled Boid will attempt to keep the device from entering into sleep mode. This will ensure that Boid is able to run in the background for long periods of time.")
        q-checkbox(v-model="config.stayAwake" label="Stay Awake")
    .row.gutter.justify-center.absolute-bottom(style="bottom:50px;")
      q-btn( outline @click="backbtn()") < Back
      q-btn.on-right(color="green" @click="updateDeviceConfig()") Confirm

</template>

<script>
function valBetween(v, min, max) {
  return Math.min(max, Math.max(min, v))
}
export default {
  data(){
    return {
      config:null,
      ipc:window.local.ipcRenderer,
    }
  },
  props:['data','thisModal'],
  methods:{
    updateDeviceConfig(){
      try {
      console.log('update Device settings here')
      // this.$root.$emit('updateDeviceConfig',this.config)
      window.local.ipcRenderer.send('config.setConfig',this.config)
      this.$parent.close()
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    backbtn(){
      this.$parent.close()
    }
  },
  computed:{

  },
  mounted(){
    console.log(this.data)
    this.config = Object.assign({},this.data)
  },
  watch: {

  }
}
</script>

<style lang="stylus" scoped>

</style>
