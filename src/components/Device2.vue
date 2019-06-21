<template lang="pug">
div(style="height:100%; overflow:hidden;")
  p.text-center(style="padding:40px;" v-if="config") {{config.device.uid}}
  div(v-if="!loading && thisDevice" ref="navigation").bg-grey-3.relative-position
    .row.justify-center.items-center
      .col-auto
        deviceName(:thisDevice="thisDevice") 
      div.absolute-right(style="margin-right:13px; margin-top:15px height:100%;")
        q-btn(flat style="margin-top:5px;" @click="openConfigModal()")
          q-icon(name="settings" color="grey-7" style="height:100%")
          q-tooltip Global Settings
    .row.justify-center.no-wrap
      div(v-for="nav in navigation")
        q-btn( flat :class="{selected: page === nav.name}" @click="page = nav.name" :disable="nav.disabled")
          q-icon.on-left(:name="nav.icon")
          | {{nav.name}}
          div(v-if="nav.disabled")
            q-tooltip Coming soon
  .row.justify-center.relative-position(v-if="!loading && thisDevice" style="padding:5px;")
    .full-width
      cpuWidget(v-show="page === 'CPU' || page === 'Dash'"
        :thisDevice="thisDevice" ref="cpuWidget")
    .full-width
      gpuWidget(v-show="page === 'GPU' || page === 'Dash' "
        :thisDevice="thisDevice" ref="gpuWidget")
    .full-width.relative-position
      hddWidget(:disabled="true" v-show="page === 'HDD' || page === 'Dash' " :thisDevice="thisDevice")
  .layout-padding.relative-position(v-else)
    div(style="padding-top:70px;")
    //- q-btn.absolute-center(flat @click="$e.$emit('openAuthModal')" big color="green") Login
  q-modal(ref="modal" @close="thisModal=null, modalData=null" )
    component(:is="thisModal" :thisModal="$refs.modal" :data="modalData" v-if="thisModal")
  .absolute-bottom
    .row(style="height:30px;")
      .col-auto
        q-btn( small flat @click="ipcMain.send('openLogs')") logs 
      .col-auto
        q-btn(small flat @click="ipcMain.send('openURL','https://discordapp.com/invite/zJnRpVz')")
          img.tiny.invert(src="/statics/images/discordicon.svg")
      .col-auto
        q-btn(small flat @click="ipcMain.send('openURL','https://t.me/Boidcom_official')")
          img.tinyer.invert(src="/statics/images/telegramlogo.svg")
      .col-auto
        q-btn(small flat @click="ipcMain.send('openURL','https://twitter.com/boidcom')")
          img.tinyer.invert(src="/statics/images/twitterlogo.svg")
</template>

<script>
import parseDevice from 'src/lib/parseDevice'
import { Alert, openURL } from 'quasar'
import cpuWidget from '@/cpuWidget.vue'
import gpuWidget from '@/gpuWidget.vue'
import hddWidget from '@/hddWidget.vue'
import gpuConfig from '@/gpuConfig.vue'
import deviceName from '@/deviceName.vue'
import cpuConfig from '@/cpuConfig.vue'
import deviceConfig from '@/deviceConfig.vue'
import gpuConfirmModal from '@/gpuConfirmModal.vue'


const ipcMain = {
  async send(channel,data,data2) {
    console.log('DeviceipcSend:', channel, data)
    return await window.local.ipcRenderer.send(channel,data,data2)
  },
  async on(channel, func) {
    console.log('DeviceipcOn:', channel, func)
    return await window.local.ipcRenderer.on(channel, async (event, data, data2) => {
      return await func(data,data2)
    })
  },
  async once(channel, func) {
    console.log('DeviceipcOnce:', channel, func)
    return await window.local.ipcRenderer.once(channel, async (event, data, data2) => {
      return await func(data,data2)
    })
  },
}
var masterInterval = null
function ec(err){
  console.error(err)
  // alert(err)
}

var deviceInterval = null


async function initLocalDevice(v){
  ipcMain.once('config.getDevice',async device => {
    console.log('got device datas',device)
    console.log(device.os)
    if (device.os === 'darwin') device.os = 'MAC'
    else if (device.os === 'win32') device.os = 'WINDOWS'
    else device.os = 'LINUX'
    var deviceExists = false
    var newDevice = false
    deviceExists = await v.$api.findDevice(device)
    if(!deviceExists) newDevice = await v.$api.registerDevice(device) 
    var id = deviceExists.id || newDevice.id
    if (!id) {
      v.$e.$emit('logout')
      return alert('There was a problem registering this device.')
    }
    if (deviceInterval) clearInterval(deviceInterval)
      v.thisDevice = await v.$api.getDevice({id})
      deviceInterval = setInterval( async () => {
        console.log('getDevice')
        v.thisDevice = await v.$api.getDevice({id})
      }, 30000)
  })
  ipcMain.send('config.getDevice')
}

export default {
  components:{cpuWidget,gpuWidget,gpuConfig,hddWidget,deviceName,cpuConfig,deviceConfig,gpuConfirmModal},
  data() {
    return {
      config:null,
      thisDevice:null,
      editName:false,
      newDeviceName:"",
      thisModal:null,
      navigation:[{name:"Dash", icon:"dashboard"},{name:"CPU",icon:"memory"},{name:"GPU",icon:"apps"},{name:"HDD",icon:"storage",disabled:true}],
      page:"Dash",
      ipcRenderer:window.local.ipcRenderer,
      loading: false,
      initialized:true,
      parseDevice,
      ipcMain,
      localDevice:null,
      deviceInterval:null
    }
  },
  computed: {
    state(){
      if (!this.config) return null
      else return this.config.state
    }
  },
  methods: {
    openURL,
    async openConfigModal(){
      this.$emit('modal','deviceConfig',await this.getConfig())
    },
    getConfig(){
      return new Promise( res => {
        ipcMain.once('config.get',(data) => {
          res(data.config)
        })
        ipcMain.send('config.get')
      })
    },
    init(){
      // ipcMain.once('config.getState',(data,data2) => alert(JSON.stringify(data)))
      // ipcMain.send('config.getState')
      this.getConfig()
    }
  }, 
  props: ['thisUser', 'authenticated'],
  created(){
    ipcMain.send('config.initIPC')
  },
  mounted() {
    this.init()
    if (!window.local) return alert('Desktop App error')
    this.$on('modal', (val,data) => { this.thisModal = val,this.modalData = data })
    // ipc.on('config.get', data => this.config = data)   
    // ipc.send('config.get') 
  }, 
  watch: {
    thisModal(val){
      this.$nextTick(el =>{
        if (val) this.$refs.modal.open()
        else this.$refs.modal.close()
      })
    },
    thisDevice: async function(value) {
      if (value) {
        console.log("thisDevice:",this.thisDevice)
        this.initialized = true
        this.loading = false
        this.thisDevice.icon = parseDevice.icon(this.thisDevice)
      }
    },
    authenticated(val) {
      if (!val) this.$root.$emit('reload')
      else initLocalDevice(this)
    },
    config(){

    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
.invert
  filter: invert(50%)
.tinyer
  height 20px
  width 20px
.tiny
  height 25px
  width 25px
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
