<template lang="pug">
div
    q-card.bg-white(style='max-height:480px;' v-if="thisDevice && ipcRenderer").relative-position
        //- div.absolute(v-if="thisDevice.type === 'MAC'" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.7);")
        //-   h4.absolute-center.no-margin.text-white MacOS not supported
        q-card-media.relative-position
            q-btn.infobtn.absolute-top-right(color='blue' flat round small @click="")
                q-icon(color='grey-7' name="settings")
                q-tooltip Settings
            q-btn.infobtn.absolute-top-right(v-if="!selected" color='blue' flat round small @click="$parent.page = 'GPU'" style="top:40px;")
                q-icon(color='green-7' name="info_outline")
                q-tooltip Details
            q-btn.infobtn.absolute-top-right(v-else color='blue' flat round small @click="$parent.page = 'Dash'" style="top:40px;")
                q-icon(color='green-7' name="keyboard_arrow_up")
                q-tooltip Return
            .row
                .col-auto
                    img(style="opacity:.9; width:100px; height:80px; width:auto; padding:10px;" src="https://i.imgur.com/LXWW8MS.png")
                .col-auto.relative-position
                    h6.light-paragraph GPU
                        q-tooltip Boid Power is updated as each Work Unit is finished. You only receive Boid Power after you have completed at least one Work Unit first. Work Units can take 6-12 hours to process, so be patient when starting.
                    div.relative-position(style="width:70%")
                        img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; top:5px;")
                        div(style="padding-left:20px; padding-top:5px;")
                            div(v-if="thisDevice.power") {{thisDevice.rvnPower.toFixed(2)}}
                            div(v-else)
                                | 0.0
                            small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
                                q-tooltip Pending power can take 24 hours or more to be verified.
                    .row
                        q-btn.light-paragraph.no-margin( flat small style="margin-bottom: 5px;" @click="ipcRenderer.send('openURL','https://rvn.boid.com')") rvn.boid.com
                        q-tooltip Learn more about the current computational task
                .col-auto
                    div(v-if="gpuInfo" style="margin:0px; overflow:auto; max-height:70px;").ellipsis
                        q-list(dense no-border v-for="(gpu,index) of gpuInfo" :key="index" style="margin-left:0px;")
                            q-item(dense style="padding:0px;").ellipsis
                                .row.no-wrap
                                    .col-auto(style="padding-right:5px;")
                                        q-icon(name="check")
                                    .col-10.ellipsis(style=" max-width:170px;")
                                        small {{gpu.name}}
        q-card-main.relative-position(v-if="selected" style="height:305px; overflow:hidden; width:100%; padding:0px;")
            div(style="overflow:auto; height:270px;")
                div(v-for="log of reverseLog" :key="log.time" style="padding:10px; margin:10px; overflow:hidden;").shadow-1
                    small {{new Date(log.time).toLocaleDateString()}}
                    small(style="padding:10px;") {{log.text}}
            div(style="height:50px;")
            .row.absolute-bottom(v-if="gpuInfo[0].type === 'Nvidia' && toggle")
                p.light-paragraph(style="margin:5px;") trex miner
                q-btn(small @click="ipcRenderer.send('openURL','http://127.0.0.1:4067/trex')") stats 
                q-btn(small :disable="!rvnStats" @click="displayFullStats()") details 
        q-card-separator
        div(style="height:50px;")
            .row(style="padding-top:0px;").items-baseline
                .col-auto
                    h6.text-grey-8.on-right(style="padding-top:0px;") {{status}} 
                .col.full-width
                    .row.justify-end.items-baseline
                        q-btn.infobtn(:color='activebtnminus' flat round small 
                        @click="adjustIntensity(rvnPercent - 5)" 
                        :disabled="rvnPercent < 8 || toggle")
                            q-icon(name="remove")
                        h6.text-grey-8 {{rvnPercent.toFixed(0)}} %
                            q-tooltip GPU Intensity
                        q-btn.infobtn(:color='activebtnplus' flat round small  
                        @click="adjustIntensity(rvnPercent + 5)" 
                        :disabled="rvnPercent > 98 || toggle")
                            q-icon(name="add")
                        q-toggle(:disabled="!gpuInfo" color="green" style="padding-right:20px; padding-top:10px;" v-model="toggle")
</template>

<script>
const ipc = {
  async send(channel, data) {
    channel = 'gpu.' + channel
    console.log('ipcSend:', channel, data)
    return await window.local.ipcRenderer.send(channel, data)
  },
  async on(channel, func) {
    channel = 'gpu.' + channel
    console.log('ipcOn:', channel, func)
    return await window.local.ipcRenderer.on(channel, async (event, data) => {
      return await func(data)
    })
  }
}
function convertRange(value, r1, r2) {(value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0]}
function convertHashrate(number) {return (number / 1000000).toFixed(2) + ' MH/s '}
function convertIntensity(intensity) { return Math.round(convertRange(intensity, [8, 25], [1, 100]) / 5) * 5}

import gpu from '../lib/gpu.js'
export default {
  props: [],
  data() {
    return {
      toggle: false,
      ipcRenderer: null,
      thisDevice: this.$parent.thisDevice,
      activeTasks: this.$parent.activeTasks,
      disabled: false,
      status: "initializing...",
      gpuInfo: null,
      rvnStats: null,
      trexInterval: null,
      statusIcon: "pause",
      trexConfig: null,
      gpu,
      statusLog: []
    }
  },
  mounted() {
    window.gpuConfig = {
      gpuConfig: true
    }
    this.ipcRenderer = window.local.ipcRenderer
    // ipc.on('gpu.error',alert)
    ipc.send('init', this.thisDevice.id)
    ipc.on('trex.config.read', data => this.trexConfig = data)
    ipc.send('trex.config.init', gpu.trex.config.init(this.thisDevice.id))
    ipc.on('getGPU', (data) => this.gpuInfo = gpu.parse(data))
    ipc.send('getGPU')
    // ipc.on('trex.config.init',(data)=>{console.log(data)})
    ipc.on('status', (data) => this.status = data)
    ipc.on('trex.getStats', data => this.rvnStats = data)
    ipc.on('log', data => this.statusLog.push({
      time: new Date().getTime(),
      text: data
    }))
    // this.ipc.send('gpu.trex.getStats')
  },
  methods: {
    activebtn() {

    },
    displayFullStats() {
      alert(JSON.stringify(this.rvnStats, null, 2))
    },
    adjustIntensity(percent) {
      console.log(percent)
      var intensity = convertRange(percent, [1, 100], [8, 25])
      if (intensity > 25) intensity = 25
      else if (intensity < 8) intensity = 8
      console.log(intensity)
      ipc.send('trex.config.setIntensity', intensity)
      setTimeout(() => {
        // ipc.send('trex.config.read')
      }, 100)
    },
    startMining() {
      this.statusIcon = "check"
      this.status = "Starting..."
      if (this.gpuInfo[0].type === 'Nvidia') {
        clearInterval(this.trexInterval)
        setTimeout(() => {
          this.trexInterval = setInterval(() => {
            ipc.send('trex.getStats')
          }, 2000)
        }, 2000)
        ipc.send('trex.start')
      } else {
        ipc.send('wildrig.start')
      }
    },
    stopMining() {
      this.statusIcon = "stop"
      ipc.send('trex.stop')
      clearInterval(this.trexInterval)
      this.status = ""
    }
  },
  computed: {
    activebtnplus() {
      if (this.toggle) return 'grey'
      else if (this.rvnPercent > 98) return 'grey'
      else return 'green'
    },
    activebtnminus() {
      if (this.toggle) return 'grey'
      else if (this.rvnPercent < 8) return 'grey'
      else return 'green'
    },
    rvnPercent() {
      if (!this.trexConfig) return 0
      return convertIntensity(this.trexConfig.intensity)
    },
    reverseLog() {
      var reverseLog = this.statusLog
      return reverseLog.reverse()
    },
    selected() {
      if (this.$parent.page === "GPU") return true
      else return false
    }
  },
  watch: {
    // statusLog(val){
    //   if (!val) return
    //   if (val.length > 10) {
    //     var newArray = val.slice(val.length - 5,val.length)
    //     this.statusLog = newArray
    //   }
    // },
    rvnStats(val) {
      if (!val || val.hashrate_minute < 1) return
      this.status = convertHashrate(val.hashrate_minute)
      this.toggle = true
    },
    gpuInfo(val) {
      if (val && !this.toggle) this.status = "Ready to start"
    },
    toggle(val) {
      if (val) {
        console.log(this.gpuInfo)
        if (!this.gpuInfo) return this.toggle = false
        this.startMining()
      } else {
        this.stopMining()
      }
    },
    '$parent.thisDevice'(val) {
      this.thisDevice = val
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
