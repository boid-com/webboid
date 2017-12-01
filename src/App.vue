<template lang="pug">
 #q-app
  q-layout(ref='layout', view='hHR Lpr lFf', :left-breakpoint='menuBreakpoint', @left-breakpoint='setMenu', :left-style='menuStyle')
    q-toolbar.shadow-1(slot="header")
      q-toolbar-title(style="font-family: 'Comfortaa', cursive;")
        | boid
        div(slot='subtitle') Alpha
      q-btn(v-if="authenticated")
        //- .ct-chart.float-right.inline(style='position:absolute; right:45px; top:-5px;')
        .on-right 200
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
      )
    q-tabs.fixed-bottom.shadow-up-1(align='left', v-if='showMenu')
      q-route-tab(icon='home', to='/', exact='', slot='title')
      q-route-tab(icon='account_circle', to='/u', exact='', slot='title')

</template>

<script>
 import Chartist from 'chartist'
 import api from './api'
 import {Loading} from 'quasar'
  var data = {
  series: [
    [5, 2, 4, 2, 0]
  ]
}
export default {
  data(){
    return{
      auth:{},
      thisUser:{},
      api,
      authenticated:false,
      showMenu:false,
      menuBreakpoint:800,
      menuStyle:{
        width:'180px',
        background:'rgb(247, 247, 247)'
      }
    }
  },
  // computed:mapState(['count','authenticated']),
  methods:{
    setMenu(event){
      console.log(event)
      this.showMenu = !event
    },
    handleLogin(){
      Loading.show({delay:0})
      this.api.auth.login()
    },
    handleLogout(){
      Loading.show({delay:0})
      api.auth.logout()
      this.authenticated = false
      this.thisUser = {}
      Loading.hide()
    },
    init: async function(){
      var that = this
      Loading.show({delay:0})
      var token = window.localStorage.getItem("accessToken")
      console.log(token)
      if (token){
        try {
          console.log('found token, attempting auth')
          var userId = await api.auth.authenticateUser(token)
          console.log('got UserId',userId)
          var userProfile = await api.user.get(userId)
          console.log('got UserProfile',userProfile)
          if (userProfile){
            this.authenticated = true
            this.thisUser = userProfile
            Loading.hide()
          }else{
            authFailed()
          }
        } catch (error) {
          authFailed()
        }
      }else{
          authFailed()
        }
      function authFailed(){
          
          that.authenticated = false
          Loading.hide()
          console.log('token auth failed')
      }
    }
  },
  mounted: async function(){
    console.log(this.$route.hash.length)
    if (this.$route.hash.length > 5){
      Loading.show({delay:0})
    }
    var that = this
    // Loading.show({delay:0})
    this.api.events.on('thisUser', (data) => {
      console.log('got user event', data)
      that.thisUser = data
      that.authenticated = true
      // that.$route.hash = ""
      Loading.hide()
      that.$router.push('/')
    })

    this.init()
    // if (!this.isLoggedIn()) this.handleLogin()

    
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
  }
}
</script>

<style>
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
.router-link-active{
  background: #027be3 !important;
  color:white !important;
  /* font-size:20px; */
}
.router-link-active .q-item-side  {
  background: #027be3 !important;
  color:white !important;
}
.layout-aside.fixed.on-layout{
  box-shadow:0 0 0;
}
</style>
