<template lang="pug">
div
  q-card.bg-white(style='max-height:480px;' v-if="thisDevice").relative-position
    //- div.absolute(v-if="thisDevice.type === 'MAC'" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.7);")
    //-   h4.absolute-center.no-margin.text-white MacOS not supported
    q-card-media.relative-position
      q-btn.infobtn.absolute-top-right(color='blue' flat round small @click="$parent.$emit('modal','gpuConfig')")
        q-icon(color='grey-7' name="settings")
        q-tooltip Settings
      q-btn.infobtn.absolute-top-right(v-if="!selected" color='blue' flat round small @click="updateActiveTasks()" style="top:40px;")
        q-icon(color='green-7' name="info_outline")
        q-tooltip Details
      q-btn.infobtn.absolute-top-right(v-else color='blue' flat round small @click="$emit('deselected')" style="top:40px;")
        q-icon(color='green-7' name="keyboard_arrow_up")
        q-tooltip Return
      .row
        .col-auto
          img(style="opacity:.9; width:100px; height:80px; width:auto; padding:10px;" src="https://i.imgur.com/LXWW8MS.png")
        .col-7.relative-position
          h6.light-paragraph GPU
            q-tooltip Boid Power is updated as each Work Unit is finished. You only receive Boid Power after you have completed at least one Work Unit first. Work Units can take 6-12 hours to process, so be patient when starting.
          div.relative-position(style="width:70%")
            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; top:5px;")
            div(style="padding-left:20px; padding-top:5px;")
              div(v-if="thisDevice.power") {{thisDevice.power.toFixed(4)}}
              div(v-else)
                | 0.0
              small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
                q-tooltip Pending power can take 24 hours or more to be verified.
          .row
            q-btn.light-paragraph.no-margin( flat small style="margin-bottom: 5px;" @click="ipc.send('openURL','https://rvn.boid.com')") rvn.boid.com
            q-tooltip Learn more about the current computational task
            // h6.absolute-bottom-right.text-grey-7(style="margin-right:10px;") Mapping Cancer Makers
      div(style="padding-left:10px;" v-if="selected")
        p.on-right(v-if="activeTasks.length > 0") Work Units ({{activeTasks.length}})
          q-tooltip Work Units are small tasks that help solve huge problems.
        p(v-else) Downloading Work Units....
    q-card-main(v-if="selected" style="height:265px; overflow:scroll; padding-top:0px;")
      h5 selected!
    q-card-separator
    q-card-actions.relative-position(style="height:50px;")
      q-icon.on-right(v-if="toggle" :name="boincStatusIcon" size="30px")
      h6.text-grey-8.on-right(style="padding-top:0px;") {{status}}
      q-spinner-grid.inline.on-right.absolute-right(:size="20" color="grey-4" v-if="toggle" style="right:70px; top:15px;")
      q-toggle.absolute-right(color="green" style="padding:20px;" v-model="toggle")  
</template>
<script>

import gpu from '../lib/gpu.js'
import { log } from 'util'
export default {
  props:['deviceState','selected','boincStatus','onBatteries','boincStatusIcon'],
  data(){
    return {
      toggle:false,
      ipc: null,
      thisDevice: this.$parent.thisDevice,
      activeTasks: this.$parent.activeTasks,
      disabled:false,
      thisGPU:null,
      status:"status message"
    }
  },
  mounted(){
    window.gpuConfig = {gpuConfig:true}
    this.ipc = window.local.ipcRenderer
    // this.ipc.on('gpu.getGPU',(el,data) => this.thisGPU = data)
    // this.ipc.send('getGPU')
    this.ipc.on('gpu.getGPU',(even,response)=>{
      gpu.parse(response)
    })
    this.ipc.on('gpu.status',(even,response)=>this.status = response)
    this.ipc.send('gpu.getGPU')
  },
  methods:{
    modulateTaskProgress(progress) {
      progress = parseFloat(progress)
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
      }
      if (progress < .02) progress += .01
      return progress * 100 + getRandomInt(2)
    },
  },
  watch:{
    toggle(val){
      if (val){
        this.ipc.send('gpu.startTrex')
      }
    },
    '$parent.thisDevice'(val){
      this.thisDevice = val
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>

