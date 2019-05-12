<template lang="pug">
div(style="height:100%; overflow:hidden;")
  div(v-if="!loading && thisDevice.name").bg-grey-3
    .row.justify-center(style="height:45px; overflow:hidden")
      q-icon(:name="thisDevice.icon")
      div( v-if="!editName" style="padding:13px;").text-black {{thisDevice.name}}
      div(v-else)
        q-input( @keyup.enter="editDeviceName(newDeviceName)" style="width:210px; height:10px; padding:5px; margin:5px; padding-bottom:15px; " placeholder="new device name" v-model="newDeviceName")
      div(v-if="!editName")
        q-btn.infobtn(small round flat @click="editName = true" style="height:25px; width:30px; margin-top:3px" )
          q-icon(name="edit" size="20px")
          q-tooltip Edit device name
      div(v-else).on-right
        q-btn.infobtn(small round color="green" @click="editDeviceName(newDeviceName)" style="height:25px; width:30px; margin-top:0px")
          q-icon(name="check" color="white" size="20px")
          q-tooltip Confirm name edit
        q-btn.infobtn.on-right(small round flat color="amber" @click="newDeviceName = '', editName = false" style="height:25px; width:30px; margin-top:5px")
          q-icon(name="close" color="red-5" size="20px")
          q-tooltip Cancel name edit
    .row.justify-center.no-wrap
      div(v-for="nav in navigation")
        q-btn( flat :class="{selected:page===nav.name}" @click="page = nav.name" :disable="nav.disabled")
          q-icon.on-left(:name="nav.icon")
          | {{nav.name}}
          div(v-if="nav.disabled")
            q-tooltip Coming soon
  .row.justify-center.relative-position(v-if="!loading && thisDevice.name" style="padding:5px;")
    .full-width
      cpuWidget(v-show="page === 'CPU' || page === 'Dash' "
        :selected="page === 'CPU'" :activeTasks="activeTasks"
        :boincStatusIcon="boincStatusIcon" :onBatteries="onBatteries" :boincStatus="boincStatus" 
        @deselected="page = 'Dash'" @openConfigModal="openConfigModal" @selected="page = 'CPU'" @toggle="toggleCPU")
    .full-width
      gpuWidget(v-show="page === 'GPU' || page === 'Dash' "
        :thisDevice="thisDevice"
        ref="gpuWidget"
        )
    .full-width.relative-position
      hddWidget(:disabled="true" v-show="page === 'HDD' || page === 'Dash' " :thisDevice="thisDevice")
  .layout-padding.relative-position(v-else)
    .text-center {{initStatus}}
    div(style="padding-top:70px;")
    q-btn.absolute-center(flat @click="refreshDevice()" big)
      q-tooltip Refresh Device
      q-icon(name="refresh")
    .row.justify-center
      q-btn( flat @click="ipcRenderer.send('openURL','https://www.youtube.com/watch?v=VVlGjVDek_M')" ) Problems?
  //- div(style="height:20px").full-width.bg-grey-8.absolute-bottom
  q-modal(ref="modal" @close="thisModal=null, modalData=null" )
    component(:is="thisModal" :thisModal="$refs.modal" :data="modalData" v-if="thisModal")
  textarea(v-show="false" ref="copyText" value="")


  </template>

<script>
import parseDevice from 'src/lib/parseDevice'
import { Alert,openURL } from 'quasar'
import cpuWidget from '@/cpuWidget.vue'
import gpuWidget from '@/gpuWidget.vue'
import hddWidget from '@/hddWidget.vue'
import gpuConfig from '@/gpuConfig.vue'
import { log } from 'util';
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
  components:{cpuWidget,gpuWidget,gpuConfig,hddWidget},
  data() {
    return {
      editName:false,
      newDeviceName:"",
      thisModal:null,
      navigation:[{
        name:"Dash",
        icon:"dashboard"
      },
      {
        name:"CPU",
        icon:"memory"
      },
      {
        name:"GPU",
        icon:"apps"
      },
      {
        name:"HDD",
        icon:"storage",
        disabled:true
      }],
      page:"Dash",
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
      cpuToggle: false
    }
  },
  computed: {},
  methods: {
    openURL,
    toggleCPU(val){
      this.cpuToggle = val
    },
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
    editDeviceName: async function(name){
      try {
        this.newDeviceName = ""
        this.editName = false
        this.thisDevice.name = name
        const result = await this.api.modifyDevice({id:this.thisDevice.id,newName:name})
        console.log(result)
        if (!result) alert('problem updating device name')
        if (result.error) alert(result.error)
        this.thisDevice = await this.$api.getDevice({id:this.thisDevice.id}).catch(ec)
      }
      catch(error){
        alert(error)
      }
    },
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
          window.olark('api.box.hide')
          console.log("INIT")
          console.log('LOCAL DEVICE',window.local.ipcRenderer.sendSync('localDevice')) 
          if (this.initialized){
            if (masterInterval) clearInterval(masterInterval)
            masterInterval = setInterval(this.init, 1800)
          }
          this.handleLocalDevice(window.local.ipcRenderer.sendSync('localDevice'))
        }, 600)
      }else{
        // throw('Not Authenticated, restart app')
      }
    }
  },
  props: ['thisUser', 'authenticated', 'api', 'ch'],
  mounted() {
    this.$on('modal',(val,data) =>{
      console.log(val,data)
      this.thisModal = val
      this.modalData = data
    })
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
        if (!this.loading) this.cpuToggle = toggle
      })
      window.local.ipcRenderer.on('boinc.config', (event, value) => {
        console.log('GOT CONFIG', value)
        this.config = value
      })
      window.local.ipcRenderer.on('boinc.activeTasks', (event, activeTasks) => {
        //- console.log('got ACTIVETASKS',JSON.stringify(activeTasks))
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
    thisModal(val){
      this.$nextTick(el =>{
        if (val) this.$refs.modal.open()
        else this.$refs.modal.close()
      })
    },
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
        this.$root.$emit('localDeviceName',value.name)
        this.thisDevice.icon = parseDevice.icon(this.thisDevice)
      }
    },
    cpuToggle: async function(value) {
      // console.log('TOGGLE STATE', value)
      this.pending = true
      try {
        var deviceStatus = {
          deviceId: this.thisDevice.id
        }
        if (value) {
          deviceStatus.status = 'ACTIVE'
          this.actionbg.backgroundColor = 'li'
          this.ipcRenderer.send('startBoinc')
          this.ipcRenderer.send('boinc.activeTasks')
          clearInterval(this.deviceStatePoll)
          this.deviceStatePoll = setInterval(() => {
            console.log('request device active tasks')
            window.local.ipcRenderer.send('boinc.activeTasks')
          }, 200000)
        } else {
          deviceStatus.status = 'ONLINE'
          this.actionbg.backgroundColor = 'white'
          this.ipcRenderer.send('boinc.cmd', 'quit')
          clearInterval(this.deviceStatePoll)
        } 
        // var result = await this.api.device.updateStatus(deviceStatus)
      } catch (error) {
        ec(error)

      } finally {
        this.thisDevice = await this.$api.getDevice({id:this.thisDevice.id}).catch(ec)
        this.pending = false
      }
    },
    authenticated(val) {
      console.log(val)
      if (val) {
        setTimeout(this.refreshDevice,1000)
        setTimeout(this.refreshDevice,3000)
        setTimeout(this.refreshDevice,6000)

        }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
  .infobtn
    height:10px
    width: 30px

.devicebg
  background-color $green-5

.selected
  background-color $green-5
  color: white

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
