<template lang="pug">
div
  q-card.bg-white(style='max-height:480px;' v-if="thisDevice && ipcRenderer").relative-position
    q-card-media.relative-position
      q-btn.infobtn.absolute-top-right(color='blue' disabled flat round small @click="")
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
            q-tooltip Boid helps secure POW blockchains using your GPU hashing power.
          div.relative-position(style="width:70%")
            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; top:5px;")
            div(style="padding-left:20px; padding-top:5px;")
              div(v-if="thisDevice.power") {{thisDevice.rvnPower.toFixed(2)}}
              div(v-else)
                | 0.0
              small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
              q-tooltip Boid Power is displayed at a 1-2 hour delay.
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
        div(v-for="log of reverseLog" style="padding:0px; margin:10px; overflow:hidden;")
          small.block {{new Date(log.time).toLocaleString()}}
          pre(style="margin:0px;")
            small(style="padding:0px;") {{log.text}}
      div(style="height:50px;")
      .row.absolute-bottom(v-if="trexActive && toggle")
        p.light-paragraph(style="margin:5px;") trex miner
        q-btn(small @click="ipcRenderer.send('openURL','http://127.0.0.1:4067/trex')") stats 
        q-btn(small :disable="!trexStats" @click="displayFullStats()") details 
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
const convertRange = ( value, r1, r2 ) => ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ]
const convertHashrate = (number) => (number / 1000000).toFixed(0) + ' MH/s '
const convertIntensity = (intensity) => Math.round(convertRange(intensity, [10, 20], [1, 100]) / 5) * 5
const sleep = async(ms) => new Promise((resolve) => setTimeout(resolve, ms))
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
      trexStats: null,
      trexInterval: null,
      statusIcon: "pause",
      trexConfig: null,
      wildrigConfig:null,
      gpu,
      statusLog: [],
      trexActive:false,
      wildrigActive:false,
      wildrigStats:null
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
    ipc.on('wildrig.config.read', data => this.wildrigConfig = gpu.wildrig.config.parse(data))
    ipc.on('getGPU', (data) => this.gpuInfo = gpu.parse(data))
    ipc.send('getGPU')
    // ipc.on('trex.config.init',(data)=>{console.log(data)})
    ipc.on('status', (data) => this.status = data)
    ipc.on('trex.getStats', data => this.trexStats = data)
    ipc.on('wildrig.getStats', data => this.wildrigStats = data)
    ipc.on('log', data => this.statusLog.push({
      time: new Date().getTime(),
      text: data.replace(/\[.*?\]/g,'')
    }))
    // this.ipc.send('gpu.trex.getStats')
  },
  methods: {
    activebtn() {

    },
    displayFullStats() {
      alert(JSON.stringify(this.trexStats, null, 2))
    },
    adjustIntensity(percent) {
      if (!this.trexActive && !this.wildrigActive) return
      console.log('percent', percent)
      var intensity = convertRange(percent, [1, 100], [10, 20])
      console.log('New Intensity:', intensity)
      if (intensity > 20) intensity = 20
      else if (intensity < 10) intensity = 10
      if (this.trexActive) ipc.send('trex.config.setIntensity', intensity)
      if (this.wildrigActive) ipc.send('wildrig.config.setIntensity', intensity)

    },
    startMining() {
      this.statusIcon = "check"
      this.status = "Starting..."
      if (this.trexActive) {
        clearInterval(this.trexInterval)
        setTimeout(() => {
          this.trexInterval = setInterval(() => {
            ipc.send('trex.getStats')
          }, 2000)
        }, 2000)
        ipc.send('trex.start')
      }
      if (this.wildrigActive){
        clearInterval(this.wildrigInterval)
        setTimeout(() => {
          this.wildrigInterval = setInterval(() => {
            ipc.send('wildrig.getStats')
          }, 2000)
        }, 2000)
        ipc.send('wildrig.start')
      }
    },
    stopMining() {
      this.statusIcon = "stop"
      ipc.send('trex.stop')
      ipc.send('wildrig.stop')
      clearInterval(this.trexInterval)
      clearInterval(this.wildrigInterval)
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

      if (!this.trexConfig && !this.wildrigConfig) return 0
      if (this.trexActive) return convertIntensity(this.trexConfig.intensity)
      else if (this.wildrigActive) return  convertIntensity(this.wildrigConfig.intensity)
      else return 0
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
    statusLog(val){
      if (val.length > 1000) this.statusLog.shift()
    },
    wildrigConfig(val){
      setTimeout(() => {
        if (val) this.status = "Ready to start"
      }, 1000)
    },
    trexConfig(val){
      setTimeout(() => {
        if (val) this.status = "Ready to start"
      }, 1000)
    },
    trexStats(val) {
      if (!val || val.hashrate_minute < 1) return
      this.status = convertHashrate(val.hashrate_minute)
      this.toggle = true
    },
    wildrigStats(val) {
      if (!val || val.hashrate.total[0] < 1) return
      this.status = convertHashrate(val.hashrate.total[0])
      this.toggle = true
    },
    gpuInfo(val) {
      if (!val) return
      if (val && !this.toggle) this.status = "Ready to start"
      if (val.some(el => el.type === 'Nvidia')) {
        this.trexActive = true
        ipc.send('trex.config.init', gpu.trex.config.init(this.thisDevice.id))}
      if (val.some(el => el.type === 'AMD')) {
        this.wildrigActive = true
        ipc.send('wildrig.config.init', gpu.wildrig.config.init(this.thisDevice.id))}
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
  pre
    word-wrap: break-word
</style>
