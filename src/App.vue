<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">

  <q-layout
    ref="layout"
    view="hHR Lpr lFf"
    :left-breakpoint="menuBreakpoint"
    @left-breakpoint="setMenu"
    :left-style="menuStyle"
  >
    <q-toolbar slot="header">
      <q-toolbar-title style="font-family: 'Comfortaa', cursive;">
        boid
        <div slot="subtitle">Alpha</div>
      </q-toolbar-title>

      <q-btn flat>
        <div class="ct-chart float-right inline" style="position:absolute; right:45px; top:-5px;"></div>
        <div class="on-right">200</div>
        
        <q-icon class="on-left"  name="flash_on" color="yellow" />
        
    </q-btn>

    <q-btn
      @click="handleLogout()"
      color="red"
    >
      Logout
    </q-btn>
    <q-btn
      @click="handleLogin()"
      color="green"
    >
      Login
    </q-btn>

    </q-toolbar>

    <div slot="left" class="">
      <q-list no-border link inset-delimiter>
        <q-side-link item to="/" exact>
          <q-item-side icon="home" />
          <q-item-main label="Home" />
        </q-side-link>
        <q-side-link item to="/u/userProfile">
          <q-item-side icon="account_circle" />
          <q-item-main label="Profile" />
        </q-side-link>
      </q-list>
    </div>
    <q-tabs
      slot="navigation"
      align="left"
      v-if="showMenu"
    >
    <q-route-tab
      icon="home"
      to="/"
      exact
      slot="title"
    />
    <q-route-tab
    icon="account_circle"
    to="/u"
    exact
    slot="title"
    />
  </q-tabs>

  <router-view

  />

  </q-layout>
    
  </div>

</template>

<script>
 import Chartist from 'chartist'
 import auth from 'lib/auth/auth.js'
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
      authenticated:false,
      userProfile:{},
      showMenu:false,
      menuBreakpoint:800,
      menuStyle:{
        width:'180px',
        background:'rgb(247, 247, 247)'
      }
    }
  },
  methods:{
    setMenu(event){
      console.log(event)
      this.showMenu = !event
    },
    handleLogin(){
      Loading.show({delay:0})
      auth.login()
    },
    handleLogout(){
      Loading.show({delay:0})
      auth.logout()
    },
    isLoggedIn(){
      var result = isLoggedIn()
      console.log(auth.getToken())
      this.authenticated = result
      return result
    }
  },
  mounted(){
    // if (!this.isLoggedIn()) this.handleLogin()

    if (window.innerWidth <= this.menuBreakpoint) this.showMenu = true
    new Chartist.Line('.ct-chart', data,{
      width:200,
      height:70,
        axisX: {
        showGrid: false,
        showLabel: false
      },
        axisY: {
        showGrid: false,
        showLabel: false
      }
    });
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
</style>
