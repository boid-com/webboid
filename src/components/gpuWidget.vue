<template lang="pug">
div
  q-card(style='max-height:480px;' v-if="thisDevice && ipcRenderer").relative-position
    div.absolute(v-if="disabled" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.6);")
      h6.absolute-center.no-margin.text-white Not compatible with this OS
    div.absolute(v-if="!gpuActivated" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.6);")
      q-btn.absolute-center.no-margin.bg-white(@click="activateGPU()") Activate GPU
    q-card-media.relative-position
      q-btn.infobtn.absolute-top-right(color='blue' flat round small @click="$parent.$emit('modal','gpuConfig',{config,directories})")
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
              //- small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
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
                    q-icon(name="check" v-if="gpu.valid")
                    q-icon(name="close" v-else)
                  .col-10.ellipsis(style=" max-width:170px;")
                    small {{gpu.name}}
    q-card-separator
    q-card-main.relative-position(v-if="selected" style="height:320px; overflow:hidden; width:100%; padding:0px;")
      div(style="overflow:auto; height:285px;")
        div(v-for="log of reverseLog" style="padding:0px; margin:10px; overflow:hidden;" ref="logDisplay")
          small.block {{log.time}}
          pre(style="margin:0px;")
            small(style="padding:0px;") {{log.text}}
      q-card-separator
      div
        .row.items-center
          .col-auto(style="height:40px;" v-if="trexActive && toggle")
            .row(style="height:100%;").items-center
              small.light-paragraph(style="margin:5px;") trex
              q-btn(small flat @click="ipcRenderer.send('openURL','http://127.0.0.1:4067/trex')") stats 
              q-btn(small flat :disable="!trexStats" @click="alert(trexStats)") details 
          .col-auto(style="height:40px;" v-if="wildrigActive && toggle")
            .row(style="height:100%;").items-center
              small.light-paragraph(style="margin:5px;") wildrig
              q-btn(small flat :disable="!wildrigStats" @click="alert(wildrigStats)" style="height:100%;") details 
          .col
            .row.justify-end
              .col-auto(style="height:40px;")
                q-btn( style="height:100%;" small flat @click="selectText()" :disable="reverseLog.length < 1") Copy Log
    q-card-separator
    div(style="height:50px;")
      .row.items-center(style="height:100%;")
        .col-auto
          h6.text-grey-8.on-right.no-margin(style="padding:20px;") {{status}} 
        .col.full-width
          .row.justify-end.items-baseline(style="padding-bottom:10px;")
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
            q-toggle(:disable="!gpuInfo || disableToggle" color="green" style="padding-right:20px; padding-top:10px;" v-model="toggle")
</template>

<script>
import { Loading, Toast } from 'quasar'
Toast.setDefaults({
  timeout: 2000,
})
const copyToClipboard = str => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.appendChild(el)
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
};
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

function copyDivToClipboard(elem) {
    var range = document.createRange();
    range.selectNode(document.getElementById(elem));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();
}

import gpu from '../lib/gpu.js'
export default {
  props: [],
  data() {
    return {
      disableToggle:true,
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
      wildrigStats:null,
      config:null,
      shouldAutoStart:false,
      directories:null,
      gpuActivated:false
    }
  },
  mounted() { 
    this.$root.$on('updateGPUConfig', el => ipc.send('config.write',el))
    this.$root.$on('confirmGPU',el => {
      if (el){
        localStorage.setItem('gpuActivated',true)
        this.gpuActivated = true
      }
    })
    this.ipcRenderer = window.local.ipcRenderer
    // ipc.on('gpu.error',alert)
    ipc.on('init', data => this.directories = data)
    ipc.send('init', this.thisDevice.id)
    ipc.on('trex.config.read', data => this.trexConfig = data)
    ipc.on('config.init', data => this.shouldAutoStart = data.autoStart)
    ipc.on('wildrig.config.read', data => this.wildrigConfig = gpu.wildrig.config.parse(data))
    ipc.on('config.read', data => this.config = data)
    ipc.on('getGPU', (data) => this.gpuInfo = gpu.parse(data))
    ipc.send('getGPU')
    ipc.send('config.init',gpu.config.defaultConfig)

    // ipc.on('trex.config.init',(data)=>{console.log(data)})
    ipc.on('status', (data) => this.status = data)
    ipc.on('trex.getStats', data => this.trexStats = data)
    ipc.on('wildrig.getStats', data => this.wildrigStats = data)
    ipc.on('log', data => this.statusLog.push({
      time: new Date().toLocaleString(),
      text: data.replace(/\[.*?\]/g,'')
    }))
    if (JSON.parse(localStorage.getItem('gpuActivated'))) this.gpuActivated = true
  },
  methods: {
    activateGPU(){
      this.$parent.$emit('modal','gpuConfirmModal')

    },
    selectText(data) {
      copyToClipboard(JSON.stringify(this.statusLog,null,2))
      // copyDivToClipboard(this.$refs.logDisplay)
      Toast.create.info('Logs copied to clipboard')
      // document.execCommand('Copy')
    },
    activebtn() {

    },
    alert(data) {
      alert(JSON.stringify(data, null, 2))
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
            if (this.toggle) ipc.send('trex.getStats')
            else clearInterval(this.trexInterval)
          }, 2000)
        }, 2000)
        ipc.send('trex.start')
      }
      if (this.wildrigActive){
        clearInterval(this.wildrigInterval)
        setTimeout(() => {
          this.wildrigInterval = setInterval(() => {
            console.log(this.toggle)
            if (this.toggle) ipc.send('wildrig.getStats')
            else clearInterval(this.wildrigInterval)
          }, 2000)
        }, 5000)

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
    autoStart(){
      if (this.gpuInfo && this.shouldAutoStart) this.toggle = true, this.shouldAutoStart = false
      return true
    },
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
        this.disableToggle = false
        if (val && !this.toggle) this.status = "Ready to start"
      }, 1500)
    },
    trexConfig(val){
      setTimeout(() => {
        this.disableToggle = false
        if (val && !this.toggle) this.status = "Ready to start"
      }, 1500)
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
      if (!val) return this.disabled = true
      if (val && !this.toggle) this.status = "Ready to start"
      if (val.some(el => el.type === 'Nvidia' && el.valid === true)) {
        this.trexActive = true
        ipc.send('trex.config.init', gpu.trex.config.init(this.thisDevice.id))}
      if (val.some(el => el.type === 'AMD' && el.valid === true)) {
        this.wildrigActive = true
        ipc.send('wildrig.config.init', gpu.wildrig.config.init(this.thisDevice.id))}
      if (!this.wildrigActive && !this.trexActive) return this.status = "No valid GPU was found 😢"
      if (this.shouldAutoStart) {
        this.status = "Autostarting"
        setTimeout(() => {
          this.toggle = true
          this.shouldAutoStart = false
        }, 1000)
      } 
    },
    toggle(val) {
      this.disableToggle =  true
      setTimeout(() => {
        this.disableToggle = false
      }, 5500)
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
  .infobtn
    height:10px
    width: 30px
    margin:10px
</style>
