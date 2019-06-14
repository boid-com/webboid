<template lang="pug">
div
  q-card(style='max-height:480px;' v-if="thisDevice && ipcRenderer").relative-position
    div.absolute(v-if="disabled" style="height:100%; width:100%; z-index:100; background-color:rgba(0,0,0,.6);")
      h6.absolute-center.no-margin.text-white Unable to initialize
    q-card-media.relative-position
      q-btn.infobtn.absolute-top-right(color='blue' flat round small @click="configModal()")
        q-icon(color='grey-7' name="settings")
        q-tooltip Settings
      q-btn.infobtn.absolute-top-right(v-if="!selected" color='blue' flat round small @click="$parent.page = 'CPU'" style="top:40px;")
        q-icon(color='green-7' name="info" v-if="toggle")
        q-icon(color='grey' name="info" v-else)
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
            q-btn.light-paragraph.no-margin( flat small style="margin-bottom: 5px;" @click="ipcRenderer.send('openURL','https://www.worldcommunitygrid.org/research/viewAllProjects.do')") WorldCommunityGrid
            q-tooltip Learn more about the current computational task
    q-card-separator
    q-card-main.relative-position(v-if="selected" style="height:320px; overflow:hidden; width:100%; padding:0px;")
      cpuInfo
    q-card-separator
    div(style="height:50px;")
      .row.items-center(style="height:100%;")
        .col-auto
          div(style="padding:10px; padding-right:0px;")
            q-icon(:name="statusIcon" :color="statusIconColor" size="25px;")
        .col-auto
          h6.text-grey-8.on-right.no-margin.inline(style="padding-left:5px;") {{status}} 
        .col.full-width
          .row.justify-end.items-baseline(style="padding-bottom:10px;")
            q-toggle(:disable="disableToggle" color="green" style="padding-right:20px; padding-top:10px;" v-model="toggle")
</template>

<script>
import { Loading, Toast } from 'quasar'
const boinc = require('../lib/boinc.js')
import cpuInfo from '@/cpuInfo.vue'

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
      return func(data)
    })
  },
  async once(channel, func) {
    channel = 'boinc.' + channel
    console.log('ipcOn:', channel, func)
    return await window.local.ipcRenderer.once(channel, async (event, data, data2) => {
      return await func(data,data2)
    })
  },
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
var needsProject = false
export default {
  props: [],
  components:{cpuInfo},
  data() {
    return {
      disableToggle:false,
      toggle: JSON.parse(window.localStorage.getItem('cpuToggle')) || false,
      ipcRenderer: null,
      thisDevice: this.$parent.thisDevice,
      activeTasks: null,
      disabled: false,
      status: "Toggle on to start >",
      boincInfo: null,
      statusIcon: "stop",
      isPaused:false,
      statusLog: [],
      config:null,
      shouldAutoStart:false,
      directories:null,
      boinc,
      state:{workUnits:[],results:[],uptime:0},
      prefs:null,
      statusIconColor:"grey-8"
    }
  },
  created(){
    console.log('LOCALSTORAGE TOGGLE:',JSON.parse(window.localStorage.getItem('cpuToggle')))
    // if (!JSON.parse(window.localStorage.getItem('gpuToggle'))) {
    //   this.toggle = false
    //   window.localStorage.setItem('gpuToggle',false)}
  },
  beforeDestroy(){
    clearInterval(window.boincInterval)
    this.$root.$off('updateCPUConfig')
  },
  mounted() { 
    if (JSON.parse(window.localStorage.getItem('cpuToggle'))) this.start()
    clearInterval(window.boincInterval)
    this.ipcRenderer = window.local.ipcRenderer
    this.$root.$on('updateCPUConfig', el => {
      if (el.prefs.run_if_user_active && el.prefs.run_on_batteries) this.isPaused = false
      else if (el.prefs.run_on_batteries && this.isPaused.search('Batteries') > -1) this.isPaused = false
      else if (el.prefs.run_if_user_active && this.isPaused.search('Activity') > -1) this.isPaused = false

      const prefs = boinc.convertForPrefs(el.prefs)      
      ipc.send('config.write', el.config)
      ipc.send('prefs.write', prefs)
      setTimeout(() => {
        ipc.send('cmd','read_global_prefs_override')
        ipc.send('prefs.read')
      }, 1000)
      setTimeout(() => {
        ipc.send('state.getUI')
      }, 2000)
    })
    // ipc.on('gpu.error',alert)
    ipc.on('init', data => this.directories = data)
    ipc.send('init')
    ipc.on('started',()=>{
      ipc.send('state.getProject')
    })
    ipc.on('state.getProject',data => {
      if (!data){
        console.log('need to connect device to WCG')
          var userProjectURL = 'http://www.worldcommunitygrid.org/'
          var addProject = 'project_attach ' + userProjectURL + ' ' + this.thisDevice.wcgKey
          ipc.send('cmd',addProject)
          setTimeout(() => ipc.send('state.getProject'), 15000)
      } else {
        try {
          const wcgid = data.hostid[0]
          if (wcgid == "0") return setTimeout(() => ipc.send('state.getProject'), 15000)
          console.log('WCGID DEBUG',wcgid,this.thisDevice.wcgid)
          if (this.thisDevice.wcgid != wcgid) this.$api.updateDevice({id:this.thisDevice.id,wcgid})
        } catch (error) { ec(error) }
      }
    })
    ipc.once('config.init', data => {
      if (data.autoStart && !this.toggle) {
        this.status = "Autostarting"
        setTimeout(() => {
          this.toggle = true
        }, 1000)
      } 
    })
    ipc.send('config.init',boinc.config.defaultConfig)
    ipc.on('state.getUI',data => this.state = data)
    ipc.send('state.getUI')
    ipc.on('status', (data) => this.status = data)
    ipc.on('prefs.read', prefs => this.prefs = prefs)
    ipc.send('prefs.read')
    ipc.on('log', data => {
      const text = boinc.parseLog(data)
      const paused = boinc.checkPaused(text)
      const resumed = boinc.checkResumed(text)
      if (paused) this.isPaused = paused
      if (resumed) this.isPaused = false
      this.statusLog.push({
      time: new Date().toLocaleString(),
      text
      })
    })
  },
  methods: {
    configModal(){
      ipc.once('prefs.read',(prefs)=>{
        prefs = boinc.parsePrefs(prefs)
        ipc.once('config.read',(config) => this.$parent.$emit('modal','cpuConfig',{prefs,config}))
        ipc.send('config.read')
      })
      ipc.send('prefs.read')
    },
    dev(){
      ipc.once('prefs.read',(data)=>{
        alert(JSON.stringify(boinc.parsePrefs(data)))
      })
      ipc.send('prefs.read')
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
      this.statusIconColor = "green"
      this.status = "Starting..."
        clearInterval(window.boincInterval)
        setTimeout(() => {
          window.boincInterval = setInterval(() => {
            if (this.toggle) ipc.send('state.getUI')
            else clearInterval(window.boincInterval)
          }, 30000)
        }, 2000)
        ipc.send('start')
        ipc.send('state.getUI')
        setTimeout(() => {
          ipc.send('state.getUI')
        }, 5000)
    },
    stop() {
      this.statusIcon = "stop"
      this.statusIconColor = "grey-8"
      ipc.send('stop')
      clearInterval(window.boincInterval)
      this.status = "Stoping..."
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
    isPaused(val){
      if(val){
        this.statusIcon = "pause"
        this.statusIconColor = "grey-8"
        this.status = val
      }else{
        this.statusIcon = "check"
        this.statusIconColor = "green"
        ipc.send('state.getUI')
      }
    },
    state(val){
      if (!val || !this.toggle || !this.prefs) return
      if (this.isPaused) return
      if (!val.workUnits) return
      const workUnits = val.workUnits.filter(el => el.active_task_state[0] == 1)
      this.status = "Processing " + workUnits.length + " Work Units at " + parseFloat(this.prefs.max_ncpus_pct).toFixed(0) + '%' + ' CPU'
    },
    status(val){
      if (val === 'Stopped') {
        this.statusIcon = "stop"
        this.statusIconColor = "grey-8"
        this.disableToggle = false}
    },
    
    statusLog(val){
      if (val.length > 1000) this.statusLog.shift()
    },
    boincConfig(val){
      setTimeout(() => {
        this.disableToggle = false
        if (val && !this.toggle) this.status = "Ready to start"
      }, 1500)
    },
    toggle(val) {
      this.disableToggle =  true
      window.localStorage.setItem('cpuToggle',val)
      if (val) {
        setTimeout(() => {
          this.disableToggle = false
        }, 4500)
        // if (!this.boincInfo) return this.toggle = false
        this.start()
      } else {
        this.isPaused = false
        setTimeout(() => {
          this.disableToggle = false
        }, 10500)
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
