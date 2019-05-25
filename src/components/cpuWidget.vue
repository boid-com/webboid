<template lang="pug">
div
  q-card(style='max-height:480px;' v-if="thisDevice && ipcRenderer").relative-position
    div.absolute(v-if="disabled" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.6);")
      h6.absolute-center.no-margin.text-white Unable to initialize
    q-card-media.relative-position
      q-btn.infobtn.absolute-top-right(color='blue' flat round small @click="$parent.$emit('modal','cpuConfig',{config})")
        q-icon(color='grey-7' name="settings")
        q-tooltip Settings
      q-btn.infobtn.absolute-top-right(v-if="!selected" color='blue' flat round small @click="$parent.page = 'CPU'" style="top:40px;")
        q-icon(color='green-7' name="info_outline")
        q-tooltip Details
      q-btn.infobtn.absolute-top-right(v-else color='blue' flat round small @click="$parent.page = 'Dash'" style="top:40px;")
        q-icon(color='green-7' name="keyboard_arrow_up")
        q-tooltip Return
      .row
        .col-auto
          img(style="opacity:.9; width:100px; height:80px; width:auto; padding:10px;" src="/statics/images/magnifyingglass.svg")
        .col-auto.relative-position
          h6.light-paragraph CPU
            q-tooltip Boid Contributes towards scientific research using your CPU.
          div.relative-position(style="width:70%")
            img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; top:5px;")
            div(style="padding-left:20px; padding-top:5px;")
              div(v-if="thisDevice.boincPower") {{thisDevice.boincPower.toFixed(2)}}
              div(v-else)
                | 0.0
              //- small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
              q-tooltip Boid Power is displayed at a 6-12 hour delay.
          .row
            q-btn.light-paragraph.no-margin( flat small style="margin-bottom: 5px;" @click="ipcRenderer.send('openURL','https://www.worldcommunitygrid.org/research/mcm1/overview.do')") rvn.boid.com
            q-tooltip Learn more about the current computational task
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
          .col-auto(style="height:40px;" v-if="toggle")
            .row(style="height:100%;").items-center
              small.light-paragraph(style="margin:5px;") BOINC
              q-btn(small flat @click="alert('boinc stats here')") stats 
              //- q-btn(small flat @click="alert(trexStats)") details 
          .col
            .row.justify-end
              .col-auto(style="height:40px;")
                q-btn( style="height:100%;" small flat @click="selectText()" :disable="reverseLog.length < 1") Copy Log
    q-card-separator
    div(style="height:50px;")
      .row.items-center(style="height:100%;")
        .col-auto
          q-btn.inline(@click="dev()") dev
          h6.text-grey-8.on-right.no-margin.inline(style="padding:20px;") {{status}} 
        .col.full-width
          .row.justify-end.items-baseline(style="padding-bottom:10px;")
            q-btn.infobtn(:color='activebtnminus' flat round small 
            @click="adjustIntensity(cpuUtilization - 5)" 
            :disabled="cpuUtilization < 10 || toggle")
              q-icon(name="remove")
            h6.text-grey-8 {{cpuUtilization.toFixed(0)}} %
              q-tooltip CPU Intensity
            q-btn.infobtn(:color='activebtnplus' flat round small  
            @click="adjustIntensity(cpuUtilization + 5)" 
            :disabled="cpuUtilization > 96 || toggle")
              q-icon(name="add")
            q-toggle(:disable="disableToggle" color="green" style="padding-right:20px; padding-top:10px;" v-model="toggle")
</template>

<script>
import { Loading, Toast } from 'quasar'
import boinc from '../lib/boinc.js'

Toast.setDefaults({timeout: 2000})

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
    channel = 'boinc.' + channel
    console.log('ipcSend:', channel, data)
    return await window.local.ipcRenderer.send(channel, data)
  },
  async on(channel, func) {
    channel = 'boinc.' + channel
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

export default {
  props: [],
  data() {
    return {
      disableToggle:false,
      toggle: false,
      ipcRenderer: null,
      thisDevice: this.$parent.thisDevice,
      activeTasks: null,
      disabled: false,
      status: "initializing...",
      boincInfo: null,
      statusIcon: "pause",
      statusLog: [],
      config:null,
      shouldAutoStart:false,
      directories:null,
      boinc,
      cpuUtilization:40
    }
  },
  mounted() { 
    this.$root.$on('updateCPUConfig', el => ipc.send('config.write',el))


    this.ipcRenderer = window.local.ipcRenderer
    // ipc.on('gpu.error',alert)
    ipc.on('init', data => this.directories = data)
    ipc.send('init')
    // ipc.on('trex.config.read', data => this.trexConfig = data)
    // ipc.on('config.init', data => this.shouldAutoStart = data.autoStart)
    // ipc.on('wildrig.config.read', data => this.wildrigConfig = gpu.wildrig.config.parse(data))
    // ipc.on('config.read', data => this.config = data)
    // ipc.on('getGPU', (data) => this.gpuInfo = gpu.parse(data))
    // ipc.send('getGPU')
    // ipc.send('config.init',gpu.config.defaultConfig)

    // ipc.on('trex.config.init',(data)=>{console.log(data)})
    ipc.on('status', (data) => this.status = data)
    ipc.on('log', data => this.statusLog.push({
      text: data.replace(/\[.*?\]/g,'')
    }))
  },
  methods: {
    dev(){
      ipc.send('init')
    },
    selectText(data) {
      copyToClipboard(JSON.stringify(this.statusLog,null,2))
      // copyDivToClipboard(this.$refs.logDisplay)
      Toast.create.info('Logs copied to clipboard')
      // document.execCommand('Copy')
    },
    alert(data) {
      alert(JSON.stringify(data, null, 2))
    },
    adjustIntensity(percent) {
      console.log('percent', percent)
      var intensity = convertRange(percent, [1, 100], [30, 100])
      console.log('New Intensity:', intensity)
      if (intensity > 100) intensity = 100
      else if (intensity < 5) intensity = 5
      ipc.send('config.setIntensity',intensity)

    },
    start() {
      this.statusIcon = "check"
      this.status = "Starting..."
        clearInterval(this.boincInterval)
        setTimeout(() => {
          this.boincInterval = setInterval(() => {
            if (this.toggle) ipc.send('state.getUI')
            else clearInterval(this.boincInterval)
          }, 2000)
        }, 2000)
        ipc.send('start')
    },
    stop() {
      this.statusIcon = "stop"
      ipc.send('stop')
      clearInterval(this.boincInterval)
      this.status = ""
    }
  },
  computed: {
    activebtnplus() {
      if (this.toggle) return 'grey'
      else if (this.boincPercent > 98) return 'grey'
      else return 'green'
    },
    activebtnminus() {
      if (this.toggle) return 'grey'
      else if (this.boincPercent < 8) return 'grey'
      else return 'green'
    },
    boincPercent() {
      if (!this.boincConfig) return 0
      else return 40
    },
    reverseLog() {
      var reverseLog = this.statusLog
      return reverseLog.reverse()
    },
    selected() {
      if (this.$parent.page === "CPU") return true
      else return false
    }
  },
  watch: {
    statusLog(val){
      if (val.length > 1000) this.statusLog.shift()
    },
    boincConfig(val){
      setTimeout(() => {
        this.disableToggle = false
        if (val && !this.toggle) this.status = "Ready to start"
      }, 1500)
    },
    boincInfo(val) {
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
      }, 2500)
      if (val) {
        
        // if (!this.boincInfo) return this.toggle = false
        this.start()
      } else {
        this.stop()
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
