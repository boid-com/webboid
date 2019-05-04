<template lang="pug">
div
  q-card(style='max-height:480px;' v-if="thisDevice").relative-position
    div.absolute(v-if="disabled" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.6);")
      h6.absolute-center.no-margin.text-white HDD Coming soon...
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
          img(style="opacity:.9; width:100px; height:80px; width:auto; padding:10px;" src="/statics/ipfsLogo.svg")
        .col-7.relative-position
          h6.light-paragraph HDD
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
            q-btn.light-paragraph.no-margin( flat small style="margin-bottom: 5px;" @click="ipcRenderer.send('openURL','https://ipfs.boid.com')") ipfs.boid.com
            q-tooltip Learn more about the current computational task
            // h6.absolute-bottom-right.text-grey-7(style="margin-right:10px;") Mapping Cancer Makers
      div(style="padding-left:10px;" v-if="selected")
        p.on-right(v-if="activeTasks.length > 0") Work Units ({{activeTasks.length}})
          q-tooltip Work Units are small tasks that help solve huge problems.
        p(v-else) Downloading Work Units....
    q-card-main(v-if="selected" style="height:265px; overflow:scroll; padding-top:0px;")
      div(v-if="activeTasks.length > 0" v-for="(task,index) in activeTasks" :key='task.slot[0]' style="margin-bottom:5px;")
        q-progress( style="height:10px;" v-if="task.active_task_state[0] == 1 && !onBatteries" :buffer="0" height="40px" stripe :percentage="modulateTaskProgress(task.checkpoint_fraction_done[0])")
        q-progress(v-else :buffer="0" height="40px" stripe :percentage="task.checkpoint_fraction_done[0]*100" color="grey-4")
        q-tooltip 
          p(style="margin:0px;") Task:
          | {{task.result_name[0]}} 
          div(style="height:10px;")
          p(style="margin:0px;") Progress:
          | {{(task.checkpoint_fraction_done[0]*100).toFixed(0)}}%


    q-card-separator
    q-card-actions.relative-position(style="height:50px;")
      q-icon.on-right(v-if="cpuToggle" :name="boincStatusIcon" size="30px")
      h6.text-grey-8.on-right(v-if="cpuToggle" style="padding-top:0px;") {{boincStatus}}
      q-spinner-grid.inline.on-right.absolute-right(:size="20" color="grey-4" v-if="cpuToggle" style="right:70px; top:15px;")
      q-toggle.absolute-right(color="green" style="padding:20px;" v-model="cpuToggle")  
</template>
<script>
export default {
  props:['deviceState','selected','toggle','boincStatus','onBatteries','boincStatusIcon','disabled'],
  data(){
    return {
      cpuToggle:false,
      ipcRenderer: this.$parent.ipcRenderer,
      thisDevice: this.$parent.thisDevice,
      activeTasks: this.$parent.activeTasks
    }
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
    cpuToggle(val){
      this.$emit('toggle',val)
    },
    toggle(val){
      this.cpuToggle = val
    },
    '$parent.thisDevice'(val){
      this.thisDevice = val
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>

