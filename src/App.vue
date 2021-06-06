<template lang="pug">
#q-app
  q-layout(:left-breakpoint="menuBreakpoint" :left-style="menuStyle" @left-breakpoint="setMenu" color="" ref="layout" view="hHR Lpr lFf")
    q-toolbar.shadow-1(slot="header" style="webkit-app-region: drag")
      q-toolbar-title(style="font-family: 'Comfortaa'")
        | boid
        div(slot="subtitle")
      div(v-if="loginVisible")
        //- q-btn.gt-xs(v-if="!local" flat style="margin-right:10px;" @click="$router.push('/CreateEOSAccount')") EOS Accounts
          img.on-right(src="/statics/eoslogo.png" style="width:15px;")
        //- q-btn.gt-xs(v-if="!local" flat style="margin-right:10px;" @click="$router.push('/vote')") vote
        //- q-btn.gt-xs(v-if="!local" style="margin-right:10px;" @click="$router.push('/SeasonPass')" color="cyan") Season Launch
          //- q-icon.on-right(name="create")
        q-btn.gt-xs(@click="$router.push('/staking')" color="green" style="margin-right: 10px" v-if="!local") stake
          q-icon.on-right(name="show_chart")
        q-btn(@click="ipcRenderer.send('openURL', 'https://app.boid.com')" flat style="margin-right: 10px" v-if="local")
          q-icon(name="home")
        q-btn(@click="$router.push('/')" flat style="margin-right: 10px" v-else)
          q-icon(name="home")
        q-btn.text-black(@click="" color="light" flat v-if="transitWallet && !local")
          .on-right
            | {{ transitWallet.auth.accountName }}
          img.on-right(src="/statics/eoslogo.png" style="width: 15px")
          q-popover(anchor="bottom right" ref="profileMenu" self="top right")
            q-item(@click="transitWallet.terminate()" link)
              | Scatter Logout
            q-item(@click="openURL('https://bloks.io/account/' + transitWallet.auth.accountName), $refs.profileMenu.close()" link v-if="!local")
              | My EOS Account
        q-btn.on-left(@click="initTransitWallet('scatter')" color="green" v-if="!transitWallet && !local")
          | Scatter
        q-btn.text-black(@click="" color="light" flat v-if="authenticated")
          .on-right
            | {{ thisUser.username }}
          q-icon.on-right(name="account_circle")
          q-popover(anchor="bottom right" ref="profileMenu" self="top right")
            q-item(@click="handleLogout()" link)
              | Logout
            q-item(@click="$router.push({ name: 'User', params: { username: thisUser.username, teamname: thisUser.team.name } }), $refs.profileMenu.close()" link v-if="!local")
              | My Profile
            q-item(@click="ipcRenderer.send('openURL', 'https://app.boid.com/u/' + thisUser.username)" link v-else)
              | My Profile

        q-btn.on-left(@click="$root.$emit('modal', 'auth')" color="green" v-if="!authenticated")
          | Boid Login
        //- q-btn(@click="$root.$emit('resetScatter')") externaltest
      //- scatter
      //- q-btn( v-if="!local" @click='$router.push({name:"Stake"})'  color="green") BOID Staking
    .shadow-0(slot="left" v-if="showSideMenu && !local")
      q-list(inset-delimiter="" link="" no-border="")
        q-side-link(exact="" item="" to="/")
          q-item-side(icon="home")
          q-item-main(label="Home")
        //- q-side-link(item='', :to='{name:"Leaderboards"}')
        //-   q-item-side(icon='list')
        //-   q-item-main(label='Competitions')
        q-side-link(:to="{ name: 'Team', params: { teamname: thisUser.team.name } }" item="" v-if="thisUser.team")
          q-item-side(icon="fa-users")
          q-item-main(label="My Team")
        q-side-link(:to="{ name: 'User', params: { username: thisUser.username } }" item="")
          q-item-side(icon="account_circle")
          q-item-main(label="My profile")
    q-tabs(align="left" slot="navigation" v-if="showMenu && authenticated && !local")
      q-route-tab(exact="" icon="home" slot="title" to="/")
      //- q-route-tab(icon='list', :to='{name:"Leaderboards"}', exact='', slot='title')
      q-route-tab(:to="{ name: 'Team', params: { teamname: thisUser.team.name } }" exact="" icon="fa-users" slot="title" v-if="thisUser.team")
      q-route-tab(:to="{ name: 'User', params: { username: thisUser.username } }" exact="" icon="account_circle" slot="title")
    // div.text-grey-9(ref="warningBanner" v-if="showWarningBanner")
    //   div.bg-grey-4(style="padding:20px;")
    //     q-btn.infobtn.absolute-top-right( style="right:40px; top:20px;" size="30px" color='blue' flat round @click="showWarningBanner = false")
    //       q-icon(color='grey-9' name="close")
    //     h5 Boid Season 0 has ended
    //       h6.strong.text-black Season 1 starts April 21st
    //       h6 Token staking for Season 1 is now unlocked.
    //       h6 Token staking will be locked when Season 1 starts.
    .row.justify-center
      .col-12
        .row.justify-center
          //- q-btn(@click="transitWallet.terminate()" :disable="Boolean(!transitWallet)") Terminate
          //- q-btn(@click="initTransitWallet('scatter')" :disable="Boolean(transitWallet)") Init
          //- q-btn(@click="walletClaim('johnatboid11')") claim
          router-view(:adBlock="adBlock" :api="api" :authenticated="authenticated" :globalStats="globalStats" :leaderboard="leaderboard" :thatUser="thatUser" :thisDevice="thisDevice" :thisUser="thisUser" :transitWallet="transitWallet" @refreshUser="init()" style="width: 100%" v-if="show")
        #embed(channel="general" server="467640777187655700")
        div(style="height: 300px" v-if="!local")
          bFooter.absolute-bottom
    q-modal.position-relative.layout-padding(ref="infoModal")
      .layout-padding(style="max-width: 400px")
        h4.text-centered(style="color: #089cfc") {{ infoModal.heading }}
        p {{ infoModal.body }}
        br
        br
        q-btn.absolute(@click="$refs.infoModal.close()" color="blue" outline style="bottom: 20px; right: 20px")
          | done
    q-modal.shadow-3(@close="showOlark(true)" @open="showOlark(false)" ref="authModal")
      auth(:api="api" :authenticated.sync="authenticated" :thisModal="$refs.authModal" :thisUser.sync="thisUser")
    q-modal.shadow-3(@close="showOlark(true)" @open="showOlark(false)" ref="profileEditModal")
      profileEdit(:api="api" :thisModal="$refs.profileEditModal" :thisUser="thisUser")
    q-modal.shadow-3(@close="showOlark(true)" @open="showOlark(false)" ref="accountEditModal")
      accountEdit(:thisModal="$refs.accountEditModal" :thisUser="thisUser")
    q-modal.shadow-3(@close="showOlark(false)" @open="showOlark(false)" ref="boincConfigModal")
      .layout-padding1
        boincConfig(:config="boincConfigData" :thisModal="$refs.boincConfigModal")
    q-modal.position-relative(ref="socialModal")
      div(style="max-width: 800px")
        div(style="padding: 40px")
          h4.text-centered(style="color: #089cfc") Share Boid
          h6 When you invite a user, you will receive a small percentage of any Boid Power they generate.
        .layout-padding.position-relative
          p.text-center.light-paragraph Share this link
          h4.text-center(@click="selectText($event)")
            textarea.text-center.full-width(readonly ref="socialLink") app.boid.com/u/{{ thisUser.username }}
        br
        br
        q-btn.absolute(@click="selectText()" color="green" style="bottom: 20px; right: 100px")
          q-icon.on-left(name="content_copy")
          | Copy Link
        q-btn.absolute(@click="$refs.socialModal.close()" color="blue" outline style="bottom: 20px; right: 20px")
          | done
    q-modal(no-backdrop-dismiss no-esc-dismiss ref="addDeviceModal")
      addDeviceModal(:api="api" :modal="$refs.addDeviceModal" :thisUser="thisUser")
    q-modal(ref="removeDeviceModal")
      removeDeviceModal(:api="api" :modal="$refs.removeDeviceModal" :thisUser="thisUser")
    q-modal(no-backdrop-dismiss no-esc-dismiss ref="nueModal")
      nueModal(:api="api" :modal="$refs.nueModal" :thisUser="thisUser")
    q-modal(@close="showOlark(true), (thisModal = null)" ref="modal")
      component(:is="thisModal" :modal="$refs.modal" :teamLeaderboard="teamLeaderboard" :thisModal="$refs.modal" :thisUser="thisUser" :transitWallet="transitWallet")
    .bg-white.fullscreen(v-if="pending")
      q-inner-loading(:visible="pending")
        q-spinner-ball(color="blue" size="70px")
</template>

<script>
// window.olark.identify('3844-769-10-6059')
import "quasar-extras/animate"
import { Loading, Toast, openURL } from "quasar"
import auth from "@/Auth.vue"
import profileEdit from "@/ProfileEdit.vue"
import scatter from "@/Scatter.vue"
import boincConfig from "@/BoincConfig.vue"
import addDeviceModal from "@/addDeviceModal.vue"
import removeDeviceModal from "@/removeDeviceModal.vue"
import accountEdit from "@/AccountEdit.vue"
import nueModal from "@/nueModal.vue"
import bFooter from "@/Footer.vue"
import updatePayoutModal from "@/updatePayoutModal.vue"
import changeTeam from "@/changeTeam.vue"
import exchangeModal from "@/exchange.vue"
import eosAuth from "@/eosAuth.vue"

require("./lib/initTransit")()
const initWallet = window.transit.initWallet
var hashInterval = null
var data = {
  series: [[5, 2, 4, 2, 0]]
}
var defaultConfig = null

var miner = null

var CPUCores = navigator.hardwareConcurrency
import state from "./lib/state"

window.showOlark = function(val) {
  // try {
  // if (val) {
  // if (this.local) return window.olark('api.box.hide')
  // else window.olark('api.box.show')
  //   // } else window.olark('api.box.hide')
  // } catch (error) {
  //   console.error(error)
  // }
}

export default {
  data() {
    return {
      global: state.global,
      show: true,
      boidWallet: "Hello Dawg",
      showSideMenu: true,
      ipcRenderer: null,
      loginVisible: true,
      tiersLeaderboard: null,
      globalStats: {},
      showWarningBanner: true,
      boincConfigData: defaultConfig,
      thisDevice: null,
      leaderboard: null,
      teamLeaderboard: null,
      adBlock: false,
      pending: true,
      local: false,
      thisModal: null,
      auth: {},
      infoModal: {},
      thisUser: { team: { name: "placeholder" } },
      thisTeam: {},
      thatUser: {},
      api: this.$api,
      userPoll: null,
      authenticated: null,
      showMenu: true,
      menuBreakpoint: 0,
      transitWallet: null,
      txResult: null,
      menuStyle: {
        width: "180px",
        background: "rgb(247, 247, 247)"
      }
    }
  },
  computed: {
    notLocal() {
      return !this.local
    }
  },
  methods: {
    openURL,
    async initTransitWallet(walletType) {
      this.global.transitWallet = await initWallet("scatter")
      this.transitWallet = this.global.transitWallet
      if (!this.transitWallet) return
      this.transitWallet.subscribe(state => {
        console.log("Transit Wallet State:", state)
        if (state.connected === false) this.transitWallet = null
      })
    },
    async walletClaim() {
      if (!this.transitWallet) return
      try {
        const result = await this.transitWallet.eosApi.transact({ actions: [boidjs.tx.claim(this.transitWallet.auth).actions[0]] }, boidjs.tx.tapos)
        this.txResult = result
        this.$root.$emit("modal", "txResult")
      } catch (error) {
        console.error(error)
        this.txResult = error
      }
      alert(result)
    },
    updateBoidWallet: async function(account) {
      console.log(account)
      this.$root.boidWallet = await window.boidjs.get.wallet(account)
      console.log(this.boidWallet)
    },
    reload() {
      this.show = false
      setTimeout(() => {
        this.show = true
      }, 500)
    },
    openWebsite(url) {},
    showOlark: window.showOlark,
    updateLeaderboards: async function() {
      this.globalStats = await this.$api.globalStats().catch(console.error)
      // console.log('got globalStats',this.globalStats)
    },
    selectText(data) {
      this.$refs.socialLink.select()
      console.log(this.$refs.socialLink)
      Toast.create.info("Link copied to clipboard")
      document.execCommand("Copy")
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
      if (this.local) {
        this.$nextTick(function() {
          // window.olark("api.box.hide")
          this.$root.$emit("modal", "auth")
        })
      }
    },
    init: async function(id) {
      if (!id) {
        id = this.$api.localUser()
        console.log("id here:", id)
        if (id) return this.init(id)
        else {
          this.pending = false
          this.authenticated = false
          if (this.local) this.$root.$emit("modal", "auth")
          return
        }
      }
      const userData = await this.$api.getUser({ id })
      console.log("userData from Init", userData)
      if (!userData) return
      this.thisUser = userData
      this.pending = false
      this.authenticated = true
      Loading.hide()
    },
    hideAllMenus(val) {
      if (val) {
        this.showMenu = false
        this.showSideMenu = false
        this.loginVisible = false
      } else {
        if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
        this.showSideMenu = true
        this.loginVisible = true
      }
    }
  },
  mounted: async function() {
    // if (this.local && !this.authenticated) this.handleLogin()
    if (this.local) this.ipcRenderer = window.local.ipcRenderer
    // if (this.local) window.olark("api.box.hide")
    if (!this.local) this.initTransitWallet()
    setTimeout(() => {
      this.pending = false
      // this.$root.$emit('modal.nue',true)
    }, 1000)
    setTimeout(() => {
      // if (adBlocker.isDetected()) {
      //   this.adBlock = true
      //   console.log('adblock detected2')
      // }
    }, 500)
    if (window.olark) {
      // window.olark.configure("system.hb_position", "right")
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
      console.log("FOUND LOCAL IN APP", window.local.ipcRenderer)
    }
    if (!this.local) {
      this.updateLeaderboards().catch(console.error)
      setInterval(this.updateLeaderboards, 128000)
    }
    this.$root.$on("initTransitWallet", val => {
      this.initTransitWallet()
    })
    this.$root.$on("browserDeviceThrottle", input => {
      if (miner) {
        if (input) {
          if (input > 0.9) input = 0.9
          if (input < 0.09) input = 0
          miner.setThrottle(input)
        }
        this.ch.throttle = miner.getThrottle()
      } else {
        this.ch.throttle = 0
      }
    })
    this.$root.$on("localDeviceName", val => {
      this.localDeviceName = val
    })
    this.$root.$on("hideAllMenus", val => {
      this.hideAllMenus(val)
    })
    this.$root.$on("modal", val => {
      this.thisModal = val
      if (val) this.$refs.modal.open(), this.showOlark(false)
      else this.$refs.modal.close(), this.showOlark(true)
    })
    this.$e.$on("thatUser", value => {
      console.log("thatUser", value)
      this.thatUser = value
      console.log(this.thatUser)
    })
    this.$e.$on("refreshUser", id => {
      console.log("got Refreshuser")
      this.updateLeaderboards()
      if (id) this.init(id)
      else this.init(this.thisUser.id)
    })
    this.$root.$on("updateBoidWallet", data => {
      this.updateBoidWallet(data)
    })
    this.$e.$on("showInfoModal", data => {
      this.infoModal = data
      this.$refs.infoModal.open()
    })
    this.$e.$on("openAuthModal", () => {
      this.handleLogin()
    })
    this.$e.$on("thisTeam", data => {
      this.thisTeam = data
    })
    this.$e.$on("openProfileEditModal", () => {
      this.$refs.profileEditModal.open()
    })
    this.$e.$on("openAccountEditModal", () => {
      this.$refs.accountEditModal.open()
    })
    this.$e.$on("openSocialModal", () => {
      this.$refs.socialModal.open()
    })
    this.$e.$on("thisDevice", device => {
      this.thisDevice = device
    })
    this.$e.$on("logout", () => {
      this.handleLogout()
    })
    this.$e.$on("openBoincConfigModal", configData => {
      this.boincConfigData = configData
      if (configData.run_if_user_active == 1) {
        configData.run_if_user_active = false
      } else {
        configData.run_if_user_active = true
      }
      if (window.olark) {
        window.olark("api.box.hide")
      }
      this.$refs.boincConfigModal.open()
    })
    this.$e.$on("boincConfigChanged", configData => {
      this.boincConfigData = defaultConfig
      if (this.local) {
        if (configData.run_if_user_active == true) {
          configData.run_if_user_active = 0
        } else {
          configData.run_if_user_active = 1
        }
        window.local.ipcRenderer.send("boinc.config.set", configData)
      }
    })
  },
  components: {
    auth,
    profileEdit,
    accountEdit,
    boincConfig,
    addDeviceModal,
    removeDeviceModal,
    nueModal,
    bFooter,
    updatePayoutModal,
    scatter,
    changeTeam,
    exchangeModal
  },
  watch: {
    "global.errorMsg"(message) {
      if (!message) return
      Toast.create.negative(message)
      this.global.errorMsg = null
    },
    "global.successMsg"(message) {
      if (!message) return
      Toast.create.positive(message)
      this.global.successMsg = null
    },
    "$route.name"(name) {
      if (name === "ChangeAccount") this.hideAllMenus(true)
      else this.hideAllMenus(false)
    },
    "$route.path"(path) {
      if (path === "/device") {
        this.$router.push("/desktop")
      } else if (this.$route.name === "confirmPayoutAccount") {
        // this.handleLogout()
        this.handleLogin()
      }
    },
    authenticated(authed) {
      this.pending = false
      if (authed) {
        // if (this.local) this.$router.push({ name: 'Desktop' })
        console.log("close authModal")
        this.$refs.authModal.close()
        this.menuBreakpoint = 1200
        if (this.local) {
        } else if (window.olark) {
          // window.olark("api.visitor.updateFullName", {
          //   fullName: this.thisUser.username
          // })
          // window.olark("api.visitor.updateEmailAddress", {
          //   emailAddress: this.thisUser.email
          // })
        }
        if (!this.userPoll) {
          var count = 0
          this.userPoll = setInterval(() => {
            this.init(this.thisUser.id)
            if (!this.local) {
            }
          }, 120000)
        }
      } else {
        // if(this.local) this.handleLogin()
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
  /* user-select: none; */
}
</style>
