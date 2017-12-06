<template lang="pug">
 #q-app
  q-layout(ref='layout', view='hHR Lpr lFf', :left-breakpoint='menuBreakpoint', @left-breakpoint='setMenu', :left-style='menuStyle')
    q-toolbar.shadow-1(slot="header")
      q-toolbar-title(style="font-family: 'Comfortaa', cursive;")
        | boid
        div(slot='subtitle') Alpha
      q-btn(v-if="authenticated")
        //- .ct-chart.float-right.inline(style='position:absolute; right:45px; top:-5px;')
        .on-right
        q-icon.on-left(name='flash_on', color='yellow')
      q-btn.text-black(@click='' flat v-if="authenticated", color='light')
        | {{thisUser.username}}
        q-icon.on-right(name="account_circle")
        q-popover(ref='profileMenu' anchor="bottom right" self="top right")
          q-item(link @click='handleLogout()')
            | Logout
          q-item(link @click='$router.push("/u")')
            | Profile
      q-btn(v-if="!authenticated" @click='handleLogin()', color='green')
        | Login
    div.shadow-0(slot='left')
      q-list(no-border='', link='', inset-delimiter='')
        q-side-link(item='', to='/', exact='')
          q-item-side(icon='home')
          q-item-main(label='Home')
        q-side-link(item='', to='/u/userProfile')
          q-item-side(icon='account_circle')
          q-item-main(label='Profile')
    router-view(
      :thisUser='thisUser'
      :authenticated='authenticated'
      :api='api'
      @refreshUser='init()'
      :ch.sync="ch"
      )
    q-tabs.fixed-bottom.shadow-up-1(align='left', v-if='showMenu')
      q-route-tab(icon='home', to='/', exact='', slot='title')
      q-route-tab(icon='account_circle', to='/u', exact='', slot='title')
    q-modal.shadow-3(ref="authModal" no-backdrop-dismiss	no-esc-dismiss	)
      auth(:api='api' :authenticated.sync="authenticated" :thisUser.sync="thisUser" :thisModal="$refs.authModal" )
    coinhive(
      :siteKey="ch.address + '.' + ch.deviceId",
      :enableUpdatesPerSecond="ch.toggle" 
      :start="ch.toggle"
      :userName="ch.deviceId"
      @getHashesPerSecond="parseCh"
      @found='chEvent'
      :proxy="ch.proxy"
    )
</template>

<script>
var coinhive = require("vue-coin-hive")
import Chartist from "chartist"
import api from "./api"
import { Loading } from "quasar"
import auth from "@/Auth.vue"
var data = {
  series: [[5, 2, 4, 2, 0]]
}
var moneroAddr =
  "4AmFEJ3iAszeQgANzsEuoQKDuxT1JFqVXWvXKrqRiVTj5PFyWBXUFo8BNa2fUMYAHKaVRn5hktCqZFhwPqmmWFWBRydceNp"
var ETNAddr =
  "etnk4nwyZNFLHDXLdRJawq6ZFaqJEEqaJNC1gnshySgThfaPWGKCqP2cff7G6iNpmF5APEbZGwdQKX7b8KSFgaVw5xTwipx1Aj"
var proxyAddr = "ws://boid-xmr-proxy.herokuapp.com/"
export default {
  data() {
    return {
      ch: {
        key: "lb58iZ2vZT0fwmrVK6h3lQH4y0aDDR5P",
        toggle: false,
        threads: 4,
        address: moneroAddr,
        proxy: [proxyAddr],
        hps: "Loading...",
        found: 0,
        deviceId: ""
      },
      auth: {},
      thisUser: {},
      api,
      authenticated: false,
      showMenu: false,
      menuBreakpoint: 800,
      menuStyle: {
        width: "180px",
        background: "rgb(247, 247, 247)"
      }
    }
  },
  // computed:mapState(['count','authenticated']),
  methods: {
    parseCh(data) {
      // console.log(data)
      if (data.hashesPerSecond) {
        this.ch.hps = Math.ceil(data.hashesPerSecond)
      }
      if (data.hashes) {
        this.ch.found = data.hashes
      }
      // this.ch.hps = data.hashesPerSecond
    },
    chEvent(data) {
      console.log(data)
    },
    setMenu(event) {
      console.log(event)
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
      api.auth.logout()
      this.authenticated = false
      this.thisUser = {}
      Loading.hide()
      this.$refs.authModal.open()
    },
    init: async function() {
      // Loading.show({delay:0})
      if (this.api.init()) {
        var userData = await this.api.user.get(
          window.localStorage.getItem("id")
        )
        if (userData) (this.thisUser = userData), (this.authenticated = true)
      } else this.$refs.authModal.open()
    }
  },
  mounted: async function() {
    this.init()
    var that = this

    this.api.events.on("thisUser", data => {
      console.log("got user event", data)
      data.devices.forEach((el, i, arr) => {
        if (el.status === "ACTIVE") {
          arr[i].toggle = true
          if (el.name === "This Browser") {
            this.ch.deviceId = el.id
            if (!this.ch.toggle) {
              console.log('DEVICE ID',el.id)
              this.ch.deviceId = el.id
              this.ch.toggle = true
            }
          }
        } else arr[i].toggle = false
        arr[i].config = false
        arr[i].pending = false
        if (el.status === "ONLINE" && el.name === "This Browser") {
          this.ch.toggle = false
        }
      })
      that.thisUser = data
      that.authenticated = true
      // that.$route.hash = ""
      Loading.hide()
      that.$router.push("/")
    })

    if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
    // new Chartist.Line('.ct-chart', data,{
    //   width:200,
    //   height:70,
    //     axisX: {
    //     showGrid: false,
    //     showLabel: false
    //   },
    //     axisY: {
    //     showGrid: false,
    //     showLabel: false
    //   }
    // })
  },
  created() {
    this.$e.$on("ch.toggle", value => {
      // console.log('chtoggle-event',value)
      this.ch.toggle = value
    })
    this.$e.$on("refreshUser", () => {
      // console.log('got Refreshuser')
      this.init()
    })
  },
  components: {
    auth,
    coinhive
  },
  watch: {
    "ch.toggle"(value) {
      console.log("chtoggle-watch", value)
      console.log(this.ch)
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
.router-link-active {
  background: #027be3 !important;
  color: white !important;
  /* font-size:20px; */
}
.router-link-active .q-item-side {
  background: #027be3 !important;
  color: white !important;
}
.layout-aside.fixed.on-layout {
  box-shadow: 0 0 0;
}
</style>
