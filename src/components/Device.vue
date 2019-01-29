<template lang="pug">
div()
  .layout-padding.relative-position(v-if="!loading && thisDevice.name")
    h6.text-center(style="padding: 0px; margin: 0px;") {{thisDevice.name}} 
      q-icon.float-lefth.on-right.inline( style="padding-bottom:3px;" :name='parseDevice.icon(thisDevice)' :color="parseDevice.color(thisDevice)")
      q-tooltip Your Device Name
  
    q-card(style='width:90vw; max-height:400px;')
      q-card-media.relative-position
        q-btn.infobtn.absolute-top-right(color='blue' flat round @click="openConfigModal()")
          q-icon(color='grey-7' name="settings")
          q-tooltip Settings
        .row
          .col-auto
            img(style="opacity:.9; width:100px; height:100px; padding:15px;" src="statics/images/magnifyingglass.svg")
          .col-7.relative-position
            h6.light-paragraph Device Boid Power
              q-tooltip Boid Power is updated as each Work Unit is finished. You only receive Boid Power after you have completed at least one Work Unit first. Work Units can take 6-12 hours to process, so be patient when starting.
            div.relative-position(style="width:70%")
              img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; top:5px;")
              div(style="padding-left:20px; padding-top:5px;")
                div(v-if="thisDevice.power") {{thisDevice.power.toFixed(4)}}
                div 2000.000
                small(v-if="thisDevice.pending") Pending:{{thisDevice.pending.toFixed(0)}} 
                  q-tooltip Pending power can take 24 hours or more to be verified.

                div(v-else)
                  | 0.0
                q-btn.absolute-right(flat @click="refreshDevice()")
                  q-tooltip Refresh Device
                  q-icon(name="refresh")
            .row.justify-center
              q-btn.light-paragraph( flat style="margin-bottom: 5px;" @click="ipcRenderer.send('openURL','https://www.worldcommunitygrid.org/research/mcm1/overview.do')") Mapping Cancer Markers
              q-tooltip Learn more about the current computational task
              // h6.absolute-bottom-right.text-grey-7(style="margin-right:10px;") Mapping Cancer Makers
      q-card-main(v-if="toggle")
        p(v-if="activeTasks.length > 0") Work Units
          q-tooltip Work Units are small tasks that help solve huge problems.
        p(v-else) Downloading Work Units....
        div(v-if="activeTasks.length > 0" v-for="(task,index) in activeTasks" :key='task.slot[0]' style="margin-bottom:5px;")
          
          q-progress( style="height:10px;" v-if="task.active_task_state[0] == 1 && !onBatteries" :buffer="0" height="40px" stripe animate :percentage="modulateTaskProgress(task.checkpoint_fraction_done[0])")
          q-progress(v-else :buffer="0" height="40px" stripe :percentage="task.checkpoint_fraction_done[0]*100" color="grey-4")
          q-tooltip 
            p(style="margin:0px;") Task:
            | {{task.result_name[0]}} 
            div(style="height:10px;")
            p(style="margin:0px;") Progress:
            | {{(task.checkpoint_fraction_done[0]*100).toFixed(0)}}%
          
      q-card-separator
      q-card-actions.taller.relative-position()
        q-btn(small round flat)
          q-icon.on-right(v-if="toggle" :name="boincStatusIcon")
        h6.text-grey-8.on-right(v-if="toggle" style="padding-top:5px;") {{boincStatus}}
        q-spinner-grid.inline.on-right.absolute-right(:size="20" color="grey-4" v-if="toggle" style="right:70px; top:20px;")
        q-toggle.absolute-right(color="green" style="padding:20px;" v-model="toggle")
  .layout-padding.relative-position(v-else)
    .text-center {{initStatus}}
    div(style="padding-top:70px;")
    q-btn.absolute-center(flat @click="refreshDevice()" big)
      q-tooltip Refresh Device
      q-icon(name="refresh")


  </template>

<script>
import parseDevice from 'src/lib/parseDevice'
import { Alert } from 'quasar'
var masterInterval = null
function ec(err){
  console.error(err)
  // alert(err)
}

function setupDevice(device) {
  if (!device) return null
  var type
  if (device.os.name === 'Darwin') type = 'MAC'
  else type = 'WINDOWS'
  return {
    status:'ACTIVE',
    cpid: device.cpid,
    name: device.name,
    type,
    meta: device
  }
}

export default {
  data() {
    return {
      ipcRenderer:null,
      loading: true,
      initialized:false,
      parseDevice,
      initStatus:"Initializing...",
      onBatteries: false,
      deviceStatePoll: null,
      actionbg: {
        backgroundColor: 'white'
      },
      config: {
        run_if_user_active: null
      },
      boincStatus: 'Initializing....',
      boincStatusIcon: 'check',
      activeTasks: [],
      thisDevice: {
        name: null,
        power: '',
        status: '',
        id: '',
        meta: {},
        icon: 'WINDOWS',
        type: 'WINDOWS',
        powerRatings: []
      },
      deviceId: null,
      pending: false,
      toggle: false
    }
  },
  computed: {},
  methods: {
    refreshDevice: async function(){
        try {
          this.init()
          window.local.ipcRenderer.send('boinc.activeTasks')
        } catch (error) {
          alert(error.message)
          ec(error)
          return
        }
    },
    openConfigModal() {
      this.$e.$emit('openBoincConfigModal', this.config)
    },
    modulateTaskProgress(progress) {
      progress = parseFloat(progress)
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
      }
      if (progress < .02) progress += .01
      return progress * 100 + getRandomInt(2)
    },
    handleLocalDevice: async function(localDevice) {
      if (!localDevice) {
        console.log('received blank localDevice')
        window.local.ipcRenderer.send('initBoinc')
        // setTimeout(()=>{
        //   this.handleLocalDevice(window.local.ipcRenderer.sendSync('localDevice'))
        // },3000)
      } else {
        if (localDevice.cpid) {
          try {
            var result = await this.$api.getDevice({cpid:localDevice.cpid}).catch(ec)
            console.log('RESULT FROM CHECK',result)
            if (!result) return
            if (result === 'none'){
              console.log('device does not exist, User can claim device')
              try {
                var newDevice = await this.$api.addDevice(setupDevice(localDevice)).catch(ec)
                this.thisDevice = await this.$api.getDevice({id:newDevice.id}).catch(ec)
                console.log("INITIALIZED TRUE")
                this.initialized = true
              } catch (error) {
                console.error(error)
                // clearInterval(this.deviceStatePoll)
                return
              }
            } else {
              if (result.owner.id === this.thisUser.id) {
                console.log('this device is owned by this user')
                try {
                  this.thisDevice = await this.$api.getDevice({id:result.id})
                } catch (error) {
                  ec(error)
                  return
                }
              } else {
                this.$e.$emit('logout')
                alert('This device is already claimed by a different account. 😢 \n \n Contact us: support@boid.com')
              }
            }
          } catch (error) {
            // clear`l(this.deviceStatePoll)
            ec(error)
            // alert(error)
            // this.$e.$emit('logout')
            // this.$e.$emit('openAuthModal')
          }
        } else {
          this.$e.$emit('logout')
          this.$e.$emit('openAuthModal')
          alert('This device is acting up. 😢 \n \n Contact us: support@boid.com')
        }
        if (localDevice.wcgid) {
          if (localDevice.wcgid == 0) return
          if (localDevice.wcgid == "0") return
          if (this.thisDevice.wcgid === localDevice.wcgid) return
          else {
            var result = await this.$api.updateDevice({
              deviceId: this.thisDevice.id,
              wcgid: localDevice.wcgid
            }).catch(console.error)
            console.log(result)
          }
        }
      }
    },
    init() {
      if (window.local && this.authenticated) {
        setTimeout(() => {
          console.log("INIT")
          console.log('LOCAL DEVICE',window.local.ipcRenderer.sendSync('localDevice')) 
          if (this.initialized){
            if (masterInterval) clearInterval(masterInterval)
            masterInterval = setInterval(this.init, 180000)
          }
          this.handleLocalDevice(window.local.ipcRenderer.sendSync('localDevice'))
        }, 600)
      }else{
        // throw('Not Authenticated, restart app')
      }
    }
  },
  props: ['thisUser', 'authenticated', 'api', 'thisModal', 'ch'],
  mounted() {
    console.log('this.route',this.$route.name)
    if (!this.$route.name === 'Desktop') return
    if (masterInterval) clearInterval(masterInterval)
    // masterInterval = setInterval(this.init, 10000)
    this.init()
    if (window.local){
      console.log('creating event emitters')
      this.ipcRenderer = window.local.ipcRenderer
      window.local.ipcRenderer.send('boinc.config.get')
      window.local.ipcRenderer.on('boinc.toggle', (event, toggle) => {
        console.log('GOT TOGGLE:', toggle)
        if (!this.loading) this.toggle = toggle
      })
      window.local.ipcRenderer.on('boinc.config', (event, value) => {
        console.log('GOT CONFIG', value)
        this.config = value
      })
      window.local.ipcRenderer.on('boinc.activeTasks', (event, activeTasks) => {
        console.log('got ACTIVETASKS',JSON.stringify(activeTasks))
        if (activeTasks) {
          this.activeTasks = activeTasks
        }
      })
      window.local.ipcRenderer.on('boinc.suspended', (event, status) => {
        console.log('GOT BOINC SUSPENDED:', status)
        if (status) {
          this.onBatteries = true
          this.boincStatus = `Paused: ${status}`
          this.boincStatusIcon = 'pause'
        } else {
          this.onBatteries = false
          this.boincStatus = 'Computing Tasks...'
          this.boincStatusIcon = 'check'
        }
      })
      window.local.ipcRenderer.on('deviceReady', (event, device) => {
        console.log('GOT DEVICE:', device)
      })
      window.local.ipcRenderer.on('boinc.error', (event, error) => { 

        console.error('boinc.error', error)
        // if (typeof error == "string") alert(error)
        // else{
        //   try{
        //     alert(JSON.stringify(error))
        //   } catch (error) {
        //     console.error('unable to display error to user')
        //   }
        // }
      })
    }
  }, 
  watch: {
    activeTasks(value) {
      if (value.length > 0) {
        if (
          value.some(el => {
            return el.active_task_state[0] == 1
          })
        ) {
          // console.log('SOME TASKS ARE1` RUNNING')
          if (!this.onBatteries) {
            this.boincStatus = 'Computing Tasks...'
            this.boincStatusIcon = 'check'
          }
        } else {
          // console.log('NO TASKS ARE RUNNING')
        }
      }
    },
    thisDevice: async function(value) {
      // console.log('got deviceid')
      if (value) {
        console.log("INITIALIZED TRUE")
        this.initialized = true
        window.local.ipcRenderer.send('boinc.config.get')
        this.loading = false
        console.log(JSON.stringify(this.thisDevice))
        // if (this.thisDevice.status == 'ACTIVE') this.toggle = true
        // else {
          // this.toggle = false
          // window.local.ipcRenderer.send('boinc.cmd', 'quit')
        // }
        this.thisDevice.icon = parseDevice.icon(this.thisDevice)
      }
    },
    toggle: async function(value) {
      // console.log('TOGGLE STATE', value)
      this.pending = true
      try {
        var deviceStatus = {
          deviceId: this.thisDevice.id
        }
        if (value) {
          deviceStatus.status = 'ACTIVE'
          this.actionbg.backgroundColor = 'li'
          window.local.ipcRenderer.send('startBoinc')
          window.local.ipcRenderer.send('boinc.activeTasks')
          clearInterval(this.deviceStatePoll)
          this.deviceStatePoll = setInterval(() => {
            console.log('request device active tasks')
            window.local.ipcRenderer.send('boinc.activeTasks')
          }, 200000)
        } else {
          deviceStatus.status = 'ONLINE'
          this.actionbg.backgroundColor = 'white'
          window.local.ipcRenderer.send('boinc.cmd', 'quit')
          clearInterval(this.deviceStatePoll)
        } 
        // var result = await this.api.device.updateStatus(deviceStatus)
      } catch (error) {
        ec(error)

      } finally {
        this.thisDevice = await this.getDevice({id:this.thisDevice.id}).catch(ec)
        this.pending = false
      }
    }
    // '$route.path'(path) {
    //   console.log(path)
    // }
  }
}
</script>

<style scoped lang="stylus">
.layout-padding {
  max-width: 700px;
}

.infobtn {
  color: $grey-6;
  font-size: 15px;
  right: 5px;
  top: 5px;
}

.taller {
  height: 60px;
}

body {
  user-select: none;
}
</style>
