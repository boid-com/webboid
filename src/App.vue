<template lang="pug">

 #q-app
    q-layout(color="" ref='layout', view='hHR Lpr lFf', :left-breakpoint='menuBreakpoint', @left-breakpoint='setMenu', :left-style='menuStyle')
      q-toolbar.shadow-1(slot="header") 
        q-toolbar-title(style="font-family: 'Comfortaa', cursive;")
          | boid
          div(slot='subtitle') Season Break - Alpha 0.0.4
        div(v-if="loginVisible")

          q-btn.gt-xs( flat style="margin-right:10px;" @click="$router.push('/vote')") vote
            q-icon.on-right(name="create")
          q-btn.gt-xs( style="margin-right:10px;" :loading="true" color="green" @click="$router.push('/staking')") stake
            q-icon.on-right(name="show_chart")
            q-progress(:indeterminate="true" :animate="true")
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
          q-btn( v-else flat style="margin-right:10px;" @click="$router.push('/')")
            q-icon(name="home")
          q-btn.on-left(v-if="!authenticated" @click='$e.$emit("openAuthModal",false)', color='green')
            | Login
          //- q-btn(@click="$root.$emit('resetScatter')") externaltest
        scatter
        //- q-btn( v-if="!local" @click='$router.push({name:"Stake"})'  color="green") BOID Staking
      div.shadow-0(slot='left' v-if="showSideMenu")
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
      div.text-grey-9(ref="warningBanner" v-if="showWarningBanner") 
        div.bg-grey-4(style="padding:20px;")
          q-btn.infobtn.absolute-top-right( style="right:40px; top:20px;" size="30px" color='blue' flat round @click="showWarningBanner = false")
            q-icon(color='grey-9' name="close")
          h5 Boid Season 0 has ended
            h6.strong.text-black Season 1 starts April 21st
            h6 Token staking for Season 1 is now unlocked.
            h6 Token staking will be locked when Season 1 starts.
      .row.justify-center
        .col-12
          .row.justify-center
            router-view(
              :globalStats='globalStats'
              :leaderboard='leaderboard'
              :teamLeaderboard='teamLeaderboard'
              :tiersLeaderboard='tiersLeaderboard'
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
          div(
            server="467640777187655700"
            channel="general"
            id="embed")
          div(v-if="!local" style="height:300px;")
            bFooter.absolute-bottom
      q-modal.position-relative.layout-padding(ref="infoModal")
        .layout-padding(style="max-width:400px")
          h4.text-centered(style="color:#089cfc;") {{infoModal.heading}}
          p {{infoModal.body}}
          br
          br
          q-btn.absolute(color="blue" outline style="bottom:20px; right:20px;" @click="$refs.infoModal.close()")
            | done
      q-modal.shadow-3(ref="authModal" @close="showOlark(true)" @open="showOlark(false)")
        auth(:api='api' :authenticated.sync="authenticated" :thisUser.sync="thisUser" :thisModal="$refs.authModal" )
      q-modal.shadow-3(ref="profileEditModal" @close="showOlark(true)" @open="showOlark(false)")
        profileEdit(:thisUser="thisUser" :api="api" :thisModal="$refs.profileEditModal")
      q-modal.shadow-3(ref="accountEditModal" @close="showOlark(true)" @open="showOlark(false)")
        accountEdit(:thisUser="thisUser" :thisModal="$refs.accountEditModal")
      q-modal.shadow-3(ref="boincConfigModal" @close="showOlark(true)" @open="showOlark(false)" )
        .layout-padding1
          boincConfig(:config="boincConfigData" :thisModal="$refs.boincConfigModal")
      q-modal.position-relative(ref="socialModal")
        div(style="max-width: 800px;")
          div(style="padding:40px;")
            h4.text-centered(style="color:#089cfc;") Share Boid
            h6 When you invite a user, you will receive a small percentage of any Boid Power they generate.
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
      q-modal(ref="removeDeviceModal")
        removeDeviceModal(:modal="$refs.removeDeviceModal" :api="api" :thisUser="thisUser" 	)
      q-modal(ref="nueModal" no-esc-dismiss no-backdrop-dismiss)
        nueModal(:modal="$refs.nueModal" :api="api" :thisUser="thisUser" 	)
      q-modal(ref="updatePayoutAccount")
        updatePayoutModal(:thisModal="$refs.updatePayoutAccount" :api="api" :thisUser="thisUser")
      q-modal(ref="modal" @close="showOlark(true),thisModal=null")
        component(:is="thisModal" :thisModal="$refs.modal" :modal="$refs.modal" :thisUser="thisUser" :teamLeaderboard="teamLeaderboard")
      div.bg-white.fullscreen(v-if="pending")
        q-inner-loading(:visible="pending")
          q-spinner-ball(size="70px" color="blue")
</template>

<script>
window.olark.identify('3844-769-10-6059')
var coinhive = require('vue-coin-hive')
import 'quasar-extras/animate'
// import Chartist from "chartist"
import { Loading, Toast } from 'quasar'
import auth from '@/Auth.vue'
import adBlocker from 'just-detect-adblock'
import profileEdit from '@/ProfileEdit.vue'
import scatter from '@/Scatter.vue'
import boincConfig from '@/BoincConfig.vue'
import addDeviceModal from '@/addDeviceModal.vue'
import removeDeviceModal from '@/removeDeviceModal.vue'
import accountEdit from '@/AccountEdit.vue'
import nueModal from '@/nueModal.vue'
import bFooter from '@/Footer.vue'
import updatePayoutModal from '@/updatePayoutModal.vue'
import changeTeam from '@/changeTeam.vue'
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
      showSideMenu:true,
      ipcRenderer:null,
      loginVisible:true,
      tiersLeaderboard:null,
      globalStats:{},
      ch:{
        toggle:false,
        hps: "loading",
        throttle:null,
        found:null,
        accepted:null
      },
      showWarningBanner:true,
      boincConfigData: defaultConfig,
      thisDevice: null,
      leaderboard: null,
      teamLeaderboard: null,
      adBlock: false,
      pending: true,
      local: false,
      thisModal:null,
      auth: {},
      infoModal: {},
      thisUser: { team: { name: 'placeholder' } },
      thisTeam: {},
      thatUser: {},
      api:this.$api,
      userPoll: null,
      authenticated: null,
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
        console.error(error)
      }
    },
    updateLeaderboards: async function() {
      this.leaderboard = await this.$api.globalLeaderboard().catch(console.error)
      this.teamLeaderboard = await this.$api.teamsLeaderboard().catch(console.error)
      this.globalStats = await this.$api.globalStats().catch(console.error)
      this.tiersLeaderboard = await this.$api.tiersLeaderboard().catch(console.error)

      // console.log('got globalStats',this.globalStats)
    },
    selectText(data) {
      this.$refs.socialLink.select()
      console.log(this.$refs.socialLink)
      Toast.create.info('Link copied to clipboard')
      document.execCommand('Copy')
    },
    setMenu(event) {
      // console.log(event)
      this.showMenu = !event
    },
    handleLogin() {
      this.$refs.authModal.open()
    },
    // handleRegister(){
    //   this.$refs.authModal.open()
    // },
    handleLogout() {
      Loading.show({ delay: 0 })
      this.$api.logout()
      // if (!this.local) location.reload()
      this.authenticated = false
      this.thisUser = {}
      Loading.hide()
      if(this.local) {
        this.$nextTick(function () {
          this.$e.$emit('openAuthModal')
        })
      }
    },
    init: async function(id) {
      if (!id) {
        id = this.$api.localUser()
        console.log('id here:',id)
        if (id) return this.init(id)
        else {
          this.pending = false
          this.authenticated = false
          if (this.local) this.handleLogin()
          return}
      }
      const userData = await this.$api.getUser({id})
      console.log('userData from Init',userData)
      if (!userData) return
      this.thisUser = userData
      this.pending = false
      this.authenticated = true
      Loading.hide()
      }, hideAllMenus(val){
        if (val){
          this.showMenu = false
          this.showSideMenu = false
          this.loginVisible = false
        }else{
          if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
          this.showSideMenu = true
          this.loginVisible = true
        }
      }
  },
  mounted: async function() {
    // if (this.local && !this.authenticated) this.handleLogin()
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
    if (window.olark) {
     window.olark.configure('system.hb_position', 'right') 
    }
    this.init().catch(err => {
      console.log(err)
      // this.$refs.authModal.open()
    })
    var that = this
    if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
  },
  created() {
    if (window.local) {
      this.local = true
      console.log('FOUND LOCAL IN APP',window.local.ipcRenderer)
      
      }
    if (!this.local) {
        this.updateLeaderboards().catch(console.error)
        setInterval(this.updateLeaderboards, 128000)
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
          },8000)
          this.ch.throttle = miner.getThrottle()
          miner.on('found', (data) => {
            this.ch.found = true
            setTimeout(()=>{
              this.ch.found = false 
            },2000)
          });

          miner.on('error', function(params) {
            if (params.error !== 'connection_error') {
              console.error('The pool reported an error', params.error);
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
    this.$root.$on('hideAllMenus',val =>{
      this.hideAllMenus(val)
    })
    this.$root.$on('modal',val =>{
      this.thisModal = val
      if (val) this.$refs.modal.open(), this.showOlark(false)
      else this.$refs.modal.close(), this.showOlark(true)
    })
    this.$e.$on('thatUser', value => {
      console.log('thatUser', value)
      this.thatUser = value
      console.log(this.thatUser)
    })
    this.$e.$on('refreshUser', (id) => {
      console.log('got Refreshuser')
      this.updateLeaderboards()
      if (id) this.init(id)
      else this.init(this.thisUser.id)
    })
    this.$e.$on('showInfoModal', data => {
      this.infoModal = data
      this.$refs.infoModal.open()
    })
    this.$e.$on('openAuthModal', () => {
      this.handleLogin()
    })
    this.$e.$on('thisTeam', data => {
      this.thisTeam = data
    })
    this.$e.$on('openProfileEditModal', () => {
      this.$refs.profileEditModal.open()
    })
    this.$e.$on('openAccountEditModal', () => {
      this.$refs.accountEditModal.open()
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
    accountEdit,
    boincConfig,
    addDeviceModal,
    removeDeviceModal,
    nueModal,
    bFooter,
    updatePayoutModal,
    scatter,
    changeTeam
  },
  watch: {
    '$route.name'(name){
      if (name === "ChangeAccount") this.hideAllMenus(true)
      else this.hideAllMenus(false)
    },
    '$route.path'(path) {
      if (path === '/device'){
        this.$router.push('/desktop')
      }
      if (path === '/device2'){
        this.$router.push('/desktop')
      }
      if (path === '/device3'){
        this.$router.push('/desktop')
      }
      if (path === '/device4'){
        this.$router.push('/desktop')
      }
      if (path === '/device5'){
        this.$router.push('/desktop')
      }
      if (path === '/device6'){
        this.$router.push('/desktop')
      }
      else if (this.$route.name === 'confirmPayoutAccount' ){
        // this.handleLogout()
        this.handleLogin()
      }
      if (window.olark) {
        if (path === '/auth') {
          window.olark('api.box.hide')
        } else window.olark('api.box.show')
      }
    },
    authenticated(authed) {
      this.pending = false
      if (authed) {
        if (this.local) this.$router.push({ name: 'Desktop' })
        console.log('close authModal')
        this.$refs.authModal.close()
        this.menuBreakpoint = 1200
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
            this.init(this.thisUser.id)
            if (!this.local){
            }
          }, 120000)
        }
      } else {

        // if(this.local)this.$refs.authModal.open()
        // if (this.local) this.$router.push({ name: 'Auth' })
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
    background: white !important;
  }
}
.modal-content {
  box-shadow: 0 10px 30px -10px #089cfc !important;
}
h4 {
  font-size: 1.58rem !important;

}

.ct-series-a .ct-line {
  stroke: #ffeb3b !important;
  stroke-width: 2px !important;
}
.ct-series-a .ct-point {
  /* Colour of your points */
  stroke: #ffeb3b !important;
  /* Size of your points */
  stroke-width: 4px !important;
  /* Make your points appear as squares */
  stroke-linecap: square !important;
}

.router-link-active .q-item-side {
  /* background: #027be3 !important; */
  color: black !important;
}
.layout-aside.fixed.on-layout {
  box-shadow: 0 0 0 !important;
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
