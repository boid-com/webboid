<template lang="pug">
div(style="height:100%; overflow:hidden;")
  p.text-center(style="padding:40px;") {{config.device.uid}}
  div(v-if="!loading && thisDevice" ref="navigation").bg-grey-3
    deviceName(:thisDevice="thisDevice")
    .row.justify-center.no-wrap
      div(v-for="nav in navigation")
        q-btn( flat :class="{selected: page === nav.name}" @click="page = nav.name" :disable="nav.disabled")
          q-icon.on-left(:name="nav.icon")
          | {{nav.name}}
          div(v-if="nav.disabled")
            q-tooltip Coming soon
  .row.justify-center.relative-position(v-if="!loading && thisDevice" style="padding:5px;")
    .full-width
      //- cpuWidget(v-show="page === 'CPU' || page === 'Dash'"
        //- :thisDevice="thisDevice" ref="cpuWidget")
    .full-width
      gpuWidget(v-show="page === 'GPU' || page === 'Dash' "
        :thisDevice="thisDevice" ref="gpuWidget")
    .full-width.relative-position
      hddWidget(:disabled="true" v-show="page === 'HDD' || page === 'Dash' " :thisDevice="thisDevice")
  .layout-padding.relative-position(v-else)
    div(style="padding-top:70px;")
    q-btn.absolute-center(flat @click="init()" big)
      q-tooltip Refresh Device
      q-icon(name="refresh")
    .row.justify-center
      q-btn( flat @click="ipcRenderer.send('openURL','https://www.youtube.com/watch?v=VVlGjVDek_M')" ) Problems?
  //- div(style="height:20px").full-width.bg-grey-8.absolute-bottom
  q-modal(ref="modal" @close="thisModal=null, modalData=null" )
    component(:is="thisModal" :thisModal="$refs.modal" :data="modalData" v-if="thisModal")
</template>

<script>
import parseDevice from 'src/lib/parseDevice'
import { Alert, openURL } from 'quasar'
import cpuWidget from '@/cpuWidget.vue'
import gpuWidget from '@/gpuWidget.vue'
import hddWidget from '@/hddWidget.vue'
import gpuConfig from '@/gpuConfig.vue'
import deviceName from '@/deviceName.vue'

const ipc = {
  async send(channel,data,data2) {
    console.log('DeviceipcSend:', channel, data)
    return await window.local.ipcRenderer.send(channel,data,data2)
  },
  async on(channel, func) {
    console.log('DeviceipcOn:', channel, func)
    return await window.local.ipcRenderer.on(channel, async (event, data, data2) => {
      return await func(data,data2)
    })
  }
}
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
  components:{cpuWidget,gpuWidget,gpuConfig,hddWidget,deviceName},
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
      ipc
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
    init(){
      ipc.send('config.set','data1','data2')
    }
  }, 
  props: ['thisUser', 'authenticated'],
  mounted() {
    if (!window.local) return alert('Desktop App error')
    this.$on('modal', (val,data) => {this.thisModal = val,this.modalData = data})
    ipc.send('device.init')
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
        console.log("INITIALIZED TRUE")
        this.initialized = true
        this.loading = false
        this.thisDevice.icon = parseDevice.icon(this.thisDevice)
      }
    },
    authenticated(val) {
      if (!val) return
    },
    config(){

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
