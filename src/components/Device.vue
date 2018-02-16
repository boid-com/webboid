<template lang="pug">
    .layout-padding.relative-position
      p {{thisDevice.name}}
        q-icon.float-lefth.on-right.inline(:name='parseDevice.icon(thisDevice)' :color="parseDevice.color(thisDevice)")
      h6.light-paragraph CPU
      q-card(style='width:90vw;')
        q-card-media
          img(style="opacity:.9;" src="https://www.worldcommunitygrid.org/images/slideshowImages/large/scc1Big.jpg")
          h5.absolute-bottom-left.text-grey-4(style="margin:20px;") Fight Childhood Cancer
        q-card-main
          q-list(v-for="(task,index) in activeTasks" :key='task.slot[0]')
            q-item
              pre {{JSON.stringify(task,null,2)}}
        q-card-separator
        q-card-actions.taller.relative-position()
          q-toggle.absolute-right(color="green" :disable="pending" style="padding:20px;" v-model="toggle")
      q-inner-loading()
        q-spinner-ball(size="70px" color="blue")
    //- q-btn.float-left.on-left(@click="submit" outline color="blue") Register

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
    cpid: device.cpid,
    name: device.name,
    type,
    meta: device,
    ownerId
  }
}

export default {
  data() {
    return {
      parseDevice,
      deviceStatePoll: null,
      actionbg: {
        backgroundColor: 'white'
      },
      activeTasks: [],
      thisDevice: {
        name: 'device name',
        power: '',
        status: '',
        id: '',
        meta: {},
        icon: 'WINDOWS',
        type: 'WINDOWS'
      },
      deviceId: null,
      pending: false,
      toggle: false
    }
  },
  computed: {},
  methods: {
    handleLocalDevice: async function(localDevice) {
      if (localDevice.cpid) {
        try {
          var result = await this.api.device.getByCpid(localDevice.cpid).catch(console.log)
          if (!result) {
            console.log('device does not exist, adding device to User')
            var newDevice = await this.api.device.create(setupDevice(device))
            this.thisDevice = await this.api.device.get(newDevice.id)
          } else {
            if (result.owner.id === this.thisUser.id) {
              console.log('this device is owned by this user')
              this.thisDevice = await this.api.device.get(result.id)
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
    }
  },
  props: ['thisUser', 'authenticated', 'api', 'thisModal', 'ch'],
  created() {
    if (window.local) {
      setTimeout(() => {
        this.handleLocalDevice(window.local.ipcRenderer.sendSync('localDevice'))
      }, 500)
    }
  },
  watch: {
    thisDevice: async function(value) {
      console.log('got deviceid')
      if (value) {
        console.log(JSON.stringify(this.thisDevice))
        if (this.thisDevice.status == 'ACTIVE') this.toggle = true
        else this.toggle = false
        this.thisDevice.icon = parseDevice.icon(this.thisDevice)
      }
    },
    toggle: async function(value) {
      console.log('TOGGLE STATE', value)
      this.pending = true
      try {
        var deviceStatus = {
          deviceId: this.thisDevice.id
        }
        if (value) {
          deviceStatus.status = 'ACTIVE'
          this.actionbg.backgroundColor = 'li'
          window.local.ipcRenderer.send('startBoinc')
          this.deviceStatePoll = setInterval(() => {
            console.log('request device active tasks')
            var result = window.local.ipcRenderer.sendSync('boinc.activeTasks')
            this.activeTasks = result
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
        alert('error')
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

.taller {
  height: 60px;
}
</style>
