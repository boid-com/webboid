<template lang="pug">

 #q-app
    q-layout(color="" ref='layout', view='hHR Lpr lFf', :left-breakpoint='menuBreakpoint', @left-breakpoint='setMenu', :left-style='menuStyle')
      q-toolbar.shadow-1(slot="header")
        q-toolbar-title(v-bind:class="{'cursor-pointer':notLocal}" style="font-family: 'Comfortaa', cursive;")
          | boid
          div(slot='subtitle') Alpha 0.0.2
        q-btn.text-black(@click='' flat v-if="authenticated", color='light')
          .on-right
            | {{thisUser.username}}
          q-icon.on-right(name="account_circle")
          q-popover(ref='profileMenu' anchor="bottom right" self="top right")
            q-item(link @click='handleLogout()')
              | Logout
            q-item(link v-if="!local" @click='$router.push({name:"User",params:{username:thisUser.username}}),$refs.profileMenu.close()')
              | My Profile
            q-item(link v-else @click="ipcRenderer.send('openURL','https://app.boid.com/u/'+thisUser.username)")
              | My Profile
        q-btn( v-if="local" flat style="margin-right:10px;" @click="ipcRenderer.send('openURL','https://app.boid.com')")
          q-icon(name="home")
        q-btn(v-if="!authenticated" @click='$e.$emit("openAuthModal",false)', color='green')
          | Login
      div.shadow-0(slot='left')
        q-list(no-border='', link='', inset-delimiter='')
          q-side-link(item='', to='/', exact='')
            q-item-side(icon='home')
            q-item-main(label='Home')
          q-side-link(item='', :to='{name:"Leaderboards"}')
            q-item-side(icon='list')
            q-item-main(label='Competitions')
          q-side-link(v-if='thisUser.team' item='', :to='{name:"Team",params:{teamname:thisUser.team.name}}')
            q-item-side(icon='fa-users')
            q-item-main(label='My Team')
          q-side-link(item='', :to='{name:"User",params:{username:thisUser.username}}')
            q-item-side(icon='account_circle')
            q-item-main(label='My profile')
      q-tabs(align='left', v-if='showMenu && authenticated && !local' slot="navigation")
        q-route-tab(icon='home', to='/', exact='', slot='title')
        q-route-tab(icon='list', :to='{name:"Leaderboards"}', exact='', slot='title')
        q-route-tab(v-if='thisUser.team' icon='fa-users', :to='{name:"Team",params:{teamname:thisUser.team.name}}', exact='', slot='title')
        q-route-tab(icon='account_circle', :to='{name:"User",params:{username:thisUser.username}}', exact='', slot='title')

      .row.justify-center
        .col-12
          .row.justify-center
            router-view(
              :leaderboard='leaderboard'
              :teamLeaderboard='teamLeaderboard'
              :thisUser='thisUser'
              :thatUser="thatUser"
              :thisDevice="thisDevice"
              :authenticated='authenticated'
              :api='api'
              @refreshUser='init()'
              :adBlock="adBlock"
              :ch="ch"
              style="width:100%;"
            )
          div(style="height:300px;")
            bFooter.absolute-bottom
      q-modal.position-relative.layout-padding(ref="infoModal")
        .layout-padding(style="max-width:400px")
          h4.text-centered(style="color:#089cfc;") {{infoModal.heading}}
          p {{infoModal.body}}
          br
          br
          q-btn.absolute(color="blue" outline style="bottom:20px; right:20px;" @click="$refs.infoModal.close()")
            | done
      q-modal.shadow-3(ref="authModal")
        auth(:api='api' :authenticated.sync="authenticated" :thisUser.sync="thisUser" :thisModal="$refs.authModal" )
      q-modal.shadow-3(ref="profileEditModal")
        profileEdit(:thisUser="thisUser" :api="api" :thisModal="$refs.profileEditModal")
      q-modal.shadow-3(ref="boincConfigModal" @close="showOlark(true)" @open="showOlark(false)" )
        .layout-padding
          boincConfig(:config="boincConfigData" :thisModal="$refs.boincConfigModal")
      q-modal.position-relative(ref="socialModal")
        div(style="max-width: 500px;")
          div(style="padding:40px;")
            h4.text-centered(style="color:#089cfc;") Share Boid
            h6 When Users join Boid and run the app you get a small percent of any Boid Power they generate.
          .layout-padding.position-relative
            p.text-center.light-paragraph Share this link
            h4.text-center( @click="selectText($event)") 
              textarea.text-center.full-width(readonly ref="socialLink") app.boid.com/u/{{thisUser.username}}
          br
          br
          q-btn.absolute(color="green" style="bottom:20px; right:100px;" @click="selectText()")
            q-icon.on-left(name="content_copy")
            | Copy Link
          q-btn.absolute(color="blue" outline style="bottom:20px; right:20px;" @click="$refs.socialModal.close()")
            | done
      q-modal(ref="addDeviceModal" no-esc-dismiss no-backdrop-dismiss)
        addDeviceModal(:modal="$refs.addDeviceModal" :api="api" :thisUser="thisUser" 	)
      q-modal(ref="nueModal" no-esc-dismiss no-backdrop-dismiss)
        nueModal(:modal="$refs.nueModal" :api="api" :thisUser="thisUser" 	)
      div.bg-white.fullscreen(v-if="pending")
        q-inner-loading(:visible="pending")
          q-spinner-ball(size="70px" color="blue")
</template>

<script>
window.olark.identify('3844-769-10-6059')
var coinhive = require('vue-coin-hive')
import 'quasar-extras/animate'
// import Chartist from "chartist"
import api from './api'
import { Loading, Toast } from 'quasar'
import auth from '@/Auth.vue'
import adBlocker from 'just-detect-adblock'
import profileEdit from '@/ProfileEdit.vue'
import boincConfig from '@/BoincConfig.vue'
import addDeviceModal from '@/addDeviceModal.vue'
import nueModal from '@/nueModal.vue'
import bFooter from '@/Footer.vue'
var hashInterval = null
// var trackJs = window.trackJs
var data = {
  series: [[5, 2, 4, 2, 0]]
}
var defaultConfig = null

var miner = null
// var proxyAddr = 'ws://localhost:8892'
// var proxyAddr = "wss://proxboid.mybluemix.net/"

var CPUCores = navigator.hardwareConcurrency

export default {
  data() {
    return {
      ipcRenderer:null,
      ch:{
        toggle:false,
        hps: "loading",
        throttle:null,
        found:null,
        accepted:null
      },
      boincConfigData: defaultConfig,
      thisDevice: null,
      leaderboard: null,
      teamLeaderboard: null,
      adBlock: false,
      pending: true,
      local: false,
      auth: {},
      infoModal: {},
      thisUser: { team: { name: 'placeholder' } },
      thisTeam: {},
      thatUser: {},
      api,
      userPoll: null,
      authenticated: false,
      showMenu: true,
      menuBreakpoint: 0,
      menuStyle: {
        width: '180px',
        background: 'rgb(247, 247, 247)'
      }
    }
  },
  computed: {
    notLocal() {
      return !this.local
    }
  },
  methods: {
    openWebsite(url){

    },
    showOlark(val) {
      try {
        if (val) {
          window.olark('api.box.show')
        } else window.olark('api.box.hide')
      } catch (error) {
        console.log(error)
      }
    },
    updateLeaderboards: async function() {
      this.leaderboard = await this.api.leaderboard.global()
      this.teamLeaderboard = await this.api.leaderboard.teams()
      console.log('updateLeaderboard', this.leaderboard)
    },
    selectText(data) {
      this.$refs.socialLink.select()
      console.log(this.$refs.socialLink)
      Toast.create.info('Link copied to clipboard')
      document.execCommand('Copy')
    },
    setMenu(event) {
      console.log(event)
      this.showMenu = !event
    },
    handleLogin() {
      // this.$e.$emit('openAuthModal',false)
      this.$refs.authModal.open()
    },
    // handleRegister(){
    //   this.$refs.authModal.open()
    // },
    handleLogout() {
      Loading.show({ delay: 0 })
      api.auth.logout()
      if (!this.local) location.reload()
      this.authenticated = false
      this.thisUser = {}
      Loading.hide()
      // this.$nextTick(function () {
      //   this.$refs.authModal.open()
      // })
    },
    init: async function(id) {
      // window.localStorage.clear()
      if (!id) {
        if (this.api.init()) {
          if (window.localStorage.getItem('id')) {
            var userData = await this.api.user.get(window.localStorage.getItem('id'))
            if (userData) (this.thisUser = userData), (this.authenticated = true)
            this.pending = false
          }
        } else {
          this.pending = false
        }
      } else {
        var userData = await this.api.user.get(id)
        this.pending = false
        if (userData) {
          this.pending = false
        } else {
          this.pending = false
        }
      }
    }
  },
  mounted: async function() {
    console.log('LOCLA??',window.local)
    if (this.local && !this.authenticated) this.handleLogin()
    if (this.local) this.ipcRenderer = window.local.ipcRenderer
    setTimeout(() => {
      this.pending = false
      // this.$root.$emit('modal.nue',true)
    }, 1000)
    setTimeout(() => {
      if (adBlocker.isDetected()) {
        this.adBlock = true
        console.log('adblock detected2')
      }
    }, 500)

    this.init().catch(err => {
      console.log(err)
      // this.$refs.authModal.open()
    })
    var that = this

    this.api.events.on('thisUser', data => {
      this.thisUser = data
      this.authenticated = true
      if (this.$refs.authModal) this.$refs.authModal.close()
      Loading.hide()
    })
    if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
  },
  created() {
    if (window.local) {
      this.local = true
      console.log('FOUND LOCAL IN APP',window.local.ipcRenderer)
      
      }
    if (!this.local) {
      this.updateLeaderboards()
      setInterval(this.updateLeaderboard, 10000)
    }
    this.$root.$on('browserDeviceThrottle',(input)=>{
      if (miner){
        if (input){
          if (input > .9) input = .9
          if (input < .09) input = 0
          miner.setThrottle(input)
        }
        this.ch.throttle = miner.getThrottle()
      }else {
        this.ch.throttle = 0
      }
    })
    this.$root.$on('browserDeviceToggle',(toggle,deviceId)=>{
      this.ch.toggle = toggle
      if (toggle){
        this.$loadScript("https://coinhive.com/lib/coinhive.min.js").then(()=>{
          this.ch.hps = "Loading..."
          miner = new window.CoinHive.User('i3u3mkfSxqzZKwsJVrTEfo0IV8QHJOjR', deviceId)
          miner.start({
            throttle:0.3,
            threads: ()=>{if (CPUCores>2) {return CPUCores - 1} else{ return CPUCores}}
          })
          miner.setThrottle(.3)
          hashInterval = setInterval(()=>{
            this.ch.hps = miner.getHashesPerSecond().toFixed(0)
          },3000)
          this.ch.throttle = miner.getThrottle()
          miner.on('found', (data) => {
            this.ch.found = true
            setTimeout(()=>{
              this.ch.found = false 
            },2000)
          });

          miner.on('error', function(params) {
            if (params.error !== 'connection_error') {
              console.log('The pool reported an error', params.error);
            }
          });

          miner.on('job', function(data) {
            console.log(data)
          })

          miner.on('accepted', (data) => {
            this.ch.accepted = true
            setTimeout(()=>{
              this.ch.accepted = false 
            },2000)
          })
      })

      }else {
        if (miner) {
          miner.stop() 
          if (hashInterval) clearInterval(hashInterval)
          }
      }

    })
    this.$e.$on('thatUser', value => {
      console.log('thatUser', value)
      this.thatUser = value
      console.log(this.thatUser)
    })
    this.$e.$on('refreshUser', () => {
      // console.log('got Refreshuser')
      this.updateLeaderboards()
      this.init(this.thisUser.id).catch(err => {
        console.log(err)
      })
    })
    this.$e.$on('showInfoModal', data => {
      this.infoModal = data
      this.$refs.infoModal.open()
    })
    this.$e.$on('openAuthModal', () => {
      console.log('hello')
      this.handleLogin()
    })
    this.$e.$on('thisTeam', data => {
      this.thisTeam = data
    })
    this.$e.$on('openProfileEditModal', () => {
      this.$refs.profileEditModal.open()
    })
    this.$e.$on('openSocialModal', () => {
      this.$refs.socialModal.open()
    })
    this.$e.$on('thisDevice', device => {
      this.thisDevice = device
    })
    this.$e.$on('logout', () => {
      this.handleLogout()
    })
    this.$e.$on('openBoincConfigModal', configData => {
      this.boincConfigData = configData
      if (configData.run_if_user_active == 1) {
        configData.run_if_user_active = false
      } else {
        configData.run_if_user_active = true
      }
      if (window.olark) {
        window.olark('api.box.hide')
      }
      this.$refs.boincConfigModal.open()
    })
    this.$e.$on('boincConfigChanged', configData => {
      this.boincConfigData = defaultConfig
      if (this.local) {
        if (configData.run_if_user_active == true) {
          configData.run_if_user_active = 0
        } else {
          configData.run_if_user_active = 1
        }
        window.local.ipcRenderer.send('boinc.config.set', configData)
      }
    })
  },
  components: {
    auth,
    coinhive,
    profileEdit,
    boincConfig,
    addDeviceModal,
    nueModal,
    bFooter
  },
  watch: {
    '$route.path'(path) {
      if (window.olark) {
        if (path === '/auth') {
          window.olark('api.box.hide')
        } else window.olark('api.box.show')
      }
    },
    authenticated(authed) {
      this.pending = false
      if (authed) {
        console.log('checking Local:', this.local)
        if (this.local) this.$router.push({ name: 'Device' })
        this.menuBreakpoint = 1200
        console.log('THIS USER',this.thisUser)
        if (window.olark) {
          window.olark('api.visitor.updateFullName', {
            fullName: this.thisUser.username
          })
          window.olark('api.visitor.updateEmailAddress', {
            emailAddress: this.thisUser.email
          })
        }
        if (!this.userPoll) {
          var count = 0
          this.userPoll = setInterval(() => {
            count++
            var thisInstance = this.userPoll
            // console.info('PollUser', thisInstance, count)
            this.init(this.thisUser.id)
          }, 10000)
        }
      } else {
        if (this.local) this.$router.push({ name: 'Auth' })
        clearInterval(this.userPoll)
        this.userPoll = null
        this.menuBreakpoint = 0
      }
    }
  }
}
</script>

<style>
@media (min-width: 768px) {
  .modal:not(.maximized) {
    background: white;
  }
}
.modal-content {
  box-shadow: 0 10px 30px -10px #089cfc;
}
h4 {
  font-size: 1.58rem;

}

.ct-series-a .ct-line {
  stroke: #ffeb3b !important;
  stroke-width: 2px;
}
.ct-series-a .ct-point {
  /* Colour of your points */
  stroke: #ffeb3b !important;
  /* Size of your points */
  stroke-width: 4px;
  /* Make your points appear as squares */
  stroke-linecap: square;
}

.router-link-active .q-item-side {
  /* background: #027be3 !important; */
  color: black !important;
}
.layout-aside.fixed.on-layout {
  box-shadow: 0 0 0;
}
textarea:focus {
  border: 0px;
  outline: none;
  resize: none;
}

textarea {
  border: 0px;
  outline: none;
  resize: none;
}
body {
  user-select: none;
}
</style>
