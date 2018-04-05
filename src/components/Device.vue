<template lang="pug">
  //- div(style="background-color:black; width:100%; height:50%;")
  q-transition(    
    enter="fadeIn"
    leave="fadeOut")
    .layout-padding.relative-position(v-if="!loading && thisDevice.name")
      p {{thisDevice.name}} 
        q-icon.float-lefth.on-right.inline(:name='parseDevice.icon(thisDevice)' :color="parseDevice.color(thisDevice)")
      h6.light-paragraph CPU 
        div(v-if="thisDevice.powerRatings[0]")
          | {{parseInt(thisDevice.powerRatings[0].power)}}
          q-icon.text-center(v-if="toggle" color="yellow" name='flash_on' style="font-size:20px;")
          q-icon.text-center(v-else color="grey-4" name='flash_off' style="font-size:20px;")
      

      q-card(style='width:90vw;')
        q-card-media.relative-position
          q-btn.infobtn.absolute-top-right(color='blue' flat round @click="openConfigModal()")
            q-icon(color='grey-7' name="settings")
          img(style="opacity:.9; width:100px; height:100px;" src="https://www.boid.com/media/boid/science-magnifying-glass-dna-cell.svg")
          h6.absolute-bottom-right.text-grey-7(style="margin-right:10px;") Mapping Cancer Makers
        q-card-main(v-if="toggle")
          p(v-if="activeTasks.length > 0") Active Tasks
          p(v-else) Downloading Tasks....
          div(v-if="activeTasks.length > 0" v-for="(task,index) in activeTasks" :key='task.slot[0]')
            q-progress(v-if="task.active_task_state[0] == 1 && !onBatteries" :buffer="0" :height="20" stripe animate :percentage="modulateTaskProgress(task.checkpoint_fraction_done[0])")
            q-progress(v-else :buffer="0" :height="20" stripe :percentage="task.checkpoint_fraction_done[0]*100" color="grey-4")
            
            //- q-item
              //- h5 {{task.checkpoint_fraction_done[0]}}
              //- pre {{JSON.stringify(task,null,2)}}
        q-card-separator
        q-card-actions.taller.relative-position()
          q-btn(small round flat)
            q-icon.on-right(v-if="toggle" :name="boincStatusIcon")
          h6.text-grey-8.on-right(v-if="toggle" style="padding-top:5px;") {{boincStatus}}
          q-spinner-grid.inline.on-right.absolute-right(:size="20" color="grey-4" v-if="toggle" style="right:70px; top:20px;")
          q-toggle.absolute-right(color="green" :disable="pending" style="padding:20px;" v-model="toggle")
    .layout-padding.relative-position(v-else)
      .text-center Initializing....


  </template>

<script>
import parseDevice from 'src/lib/parseDevice'
import { Alert } from 'quasar'

function setupDevice(device) {
  if (!device) return null
  var type
  if (device.os.name === 'Darwin') type = 'MAC'
  else type = 'WINDOWS'
  console.log(window.local.thisUser.id)
  var ownerId = window.local.thisUser.id
  return {
    ownerId,
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
      loading: true,
      parseDevice,
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
    openConfigModal() {
      this.$e.$emit('openBoincConfigModal', this.config)
    },
    modulateTaskProgress(progress) {
      // console.log('PROGRESS', progress)
      function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max))
      }

      progress = parseFloat(progress) * 100 + getRandomInt(2)
      return progress
    },
    handleLocalDevice: async function(localDevice) {
      if (!localDevice) {
        // this.$router.push({ name: 'Auth' })
        console.log('received blank localDevice')
        window.local.ipcRenderer.send('initBoinc')
        // alert('This device is acting up. 😢 \n \n Contact us: support@boid.com')
        return
      } else {
        if (localDevice.cpid) {
          try {
            var result = await this.api.device.getByCpid(localDevice.cpid).catch(console.log)
            if (!result) {
              console.log('device does not exist, User can claim device')
              try {
                var newDevice = await this.api.device.create(setupDevice(localDevice))
                this.thisDevice = await this.api.device.get(newDevice.id)
              } catch (error) {
                console.log(error)
                return
              }
            } else {
              if (result.owner.id === this.thisUser.id) {
                // console.log('this device is owned by this user')
                try {
                  this.thisDevice = await this.api.device.get(result.id)
                } catch (error) {
                  return console.log(error)
                }
              } else {
                this.$e.$emit('logout')
                alert('This device is already claimed by a different account. 😢 \n \n Contact us: support@boid.com')
              }
            }
          } catch (error) {
            console.log(error)
          }
        } else {
          this.$router.push({ name: 'Auth' })
          alert('This device is acting up. 😢 \n \n Contact us: support@boid.com')
        }
        if (localDevice.wcgid) {
          // console.log('GOT WCGID', localDevice.wcgid)
          if (this.thisDevice.wcgid === localDevice.wcgid) return
          else {
            var result = await this.api.device.updateWcgid({
              deviceId: this.thisDevice.id,
              wcgid: localDevice.wcgid
            })
            console.log(result)
          }
        }
      }
    },
    init() {
      if (window.local) {
        setTimeout(() => {
          this.handleLocalDevice(window.local.ipcRenderer.sendSync('localDevice'))
        }, 200)
      }
    }
  },
  props: ['thisUser', 'authenticated', 'api', 'thisModal', 'ch'],
  created() {
    setInterval(() => {
      this.init()
    }, 4000)
    this.init()
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
      // console.log('got ACTIVETASKS',JSON.stringify(activeTasks))
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
      console.log('got errorfrom boinc', error)
      alert(error)
    })
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
        window.local.ipcRenderer.send('boinc.config.get')
        this.loading = false
        console.log(JSON.stringify(this.thisDevice))
        if (this.thisDevice.status == 'ACTIVE') this.toggle = true
        else {
          this.toggle = false
          window.local.ipcRenderer.send('boinc.cmd', 'quit')
        }
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
          clearInterval(this.deviceStatePoll)
          this.deviceStatePoll = setInterval(() => {
            // console.log('request device active tasks')
            window.local.ipcRenderer.send('boinc.activeTasks')
          }, 1000)
        } else {
          deviceStatus.status = 'ONLINE'
          this.actionbg.backgroundColor = 'white'
          window.local.ipcRenderer.send('boinc.cmd', 'quit')
          clearInterval(this.deviceStatePoll)
        }
        var result = await this.api.device.updateStatus(deviceStatus)
      } catch (error) {
        console.log('error')
        alert(error)
        console.log(error)
      } finally {
        this.thisDevice = await this.api.device.get(this.thisDevice.id)
        this.pending = false
      }
    }
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
