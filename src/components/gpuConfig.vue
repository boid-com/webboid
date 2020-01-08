<template lang="pug">
  div(style="overflow:hidden;")
    div(v-if="config" style="padding-left:20px; padding-right:20px; height:600px; overflow:hidden;").relative-position
      h4.text-blue.text-center(style="padding:20px;") GPU Settings
      q-field(icon="refresh"  helper="Start GPU automatically when Boid is launched.")
        q-checkbox(v-model="config.autoStart" label="Start on Launch")
      q-card(style="padding:5px;").shadow-1
        p.text-center ADVANCED
        div(style="padding:0px;")
          .row.items-center
            .col-4
              q-btn(color="blue" style="padding:5px;" small outline @click="ipc.send('openDirectory',directories.GPUPATH)") open GPU Directory
            .col
              small(style="padding:10px;").block You can manually edit config files for the GPU Miner apps. look for config.json files in the /trex or /wildrig folder.
          .row.items-center
            .col-4
              .flex.flex-center
                q-btn(color="red" small @click="ipc.send('gpu.reset')") Reset
            .col
              small(style="padding:10px;").block Removes all Boid GPU files and restarts Boid. Files will be reinstalled on startup.
      q-field(icon="battery_alert"  helper="Extend battery life by pausing Boid when disconnected from a power source. Boid will resume when power is restored.")
        q-checkbox(v-model="config.runOnBatteries" label="Pause on Battery Power")
      q-field(icon="mouse"
      helper="If enabled, Boid will pause computing while mouse/keyboard is being used. Will resume after a set number of minutes of inactivity.") 
        q-checkbox(v-model="config.runIfUserActive" label="Pause on user activity ")
        div(style="height:30px;")
          .row.items-center
            .col-auto.item-start
              small.text-grey-8 Resume after
            .col-2
              q-input(:disable="!config.runIfUserActive" type="number" :min="1" :decimals="0" style="height:25px; padding-top:0px; margin-bottom:0px; margin-top:0px; padding-bottom:10px; padding-left:10px;" v-model="config.idleTimeToRun")
            .col
              small.text-grey-8 minutes of inactivity
      .row.gutter.justify-center.absolute-bottom(style="bottom:20px;")
        q-btn( outline @click="$parent.close()") < Back
        q-btn.on-right(color="green" @click="updateGpuConfig()") Confirm

</template>

<script>
export default {
  data(){
    return {
      config:null,
      directories:null,
      ipc:window.local.ipcRenderer
    }
  },
  props:['data','thisModal'],
  methods:{
    updateGpuConfig(){
      try {
      console.log('update GPU settings here')

      this.config.runIfUserActive=!this.config.runIfUserActive;
      this.config.runOnBatteries=!this.config.runOnBatteries;

      this.$root.$emit('updateGPUConfig',this.config)
      this.$parent.close()
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed:{
  },
  mounted(){
    this.config = Object.assign({},this.data.config)
    this.directories = Object.assign({},this.data.directories)

    this.config.runIfUserActive=!this.config.runIfUserActive;
    this.config.runOnBatteries=!this.config.runOnBatteries;
  },
  watch:{
    // data(val){this.config = val}
  }
}
</script>

<style>

</style>
