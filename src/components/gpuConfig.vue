<template lang="pug">
  div(style="overflow:hidden;")
    div(v-if="config" style="padding-left:20px; padding-right:20px; height:600px; overflow:hidden;").relative-position
      h4.text-blue.text-center(style="padding:20px;") GPU Settings
      q-field(icon="refresh"  helper="Start GPU automatically when Boid is launched.")
        q-checkbox(v-model="config.autoStart" label="Start on Launch")
      q-card(style="padding:10px;").shadow-1
        p.text-center ADVANCED
        div(style="padding:10px;")
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
  },
  watch:{
    // data(val){this.config = val}
  }
}
</script>

<style>

</style>
