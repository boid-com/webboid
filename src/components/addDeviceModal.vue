<template lang="pug">
  div(style="padding:30px; max-width: 750px;").relative-position
    .relative-position
      h4 Add Device
      p Devices generate ⚡️Boid Power.
      a(href="https://github.com/Boid-John") Boid is open source #[q-icon(name="fa-heart")]
        q-btn.absolute-right(big flat round color="red-5" style="top:-10px;" @click="modal.close()" v-if="!explainWebDevice")
          q-icon(name="close")
      div(style="padding-top:20px;")
    .row.justify-center.md-gutter(v-if="!explainWebDevice")
      .col-12(v-if="!phone")
        .deviceCard.shadow-4.bg-green
          .row
            .col-sm-12.col-md-6
              h4.text-bold.text-center.text-white Native App
              p.text-white The best way to generate Boid Power
              table.reactive.full-width(v-if="webMinerHidden")
                tbody
                  tr(v-for="item in nativeAppList" :key="item")
                    td(style="padding-right:15px;")
                      q-icon.text-white( size="30px" name="check")
                    td 
                      p.text-white {{item}}
            .gt-sm.col-6(v-if="webMinerHidden")
              div.relative-position(style="padding: 40px;")
                img(src="https://assets.boid.com/images/connectdevices.svg")
          div(style="height:25px;")
          .row.justify-center
            q-btn.text-white(@click="openURL(downloadButton.url),modal.close()" big color="blue" v-if="webMinerHidden") 
              q-icon.on-left(name="fa-download")
              | {{downloadButton.label}}
              q-icon.on-right(:name="downloadButton.icon")
            q-btn.text-white(big color="blue" v-if="!webMinerHidden" @click="webMinerHidden = true") Learn More
      .col-12
        .deviceCard.bg-grey-3
          h5.text-bold.text-center In Browser
          p You can generate Boid Power inside your web browser but we strongly suggest using the native app instead. Only use the 'in browser' device if you are unable to install the native application.
          div(v-if="!webMinerHidden")
            table.reactive.full-width
              tbody
                tr(v-for="(item,index) in webAppList" :key="item")
                  td(style="padding-right:15px;")
                    q-icon.text-black( size="30px" :name="webMinerIcon(index)")
                  td 
                    p.text-black {{item}}
            div(style="height:25px;")
            .row.justify-center
              q-btn.text-grey-3(big color="grey-7" @click="initUserWebDevice()") activate
          .row.justify-center(v-if="webMinerHidden")
            q-btn.text-grey-3( flat color="grey-7" @click="webMinerHidden = false" disabled ) Learn More
          p.text-red-9.text-center Browser Mining is currently offline, sorry!
    .row(v-if="explainWebDevice").md-gutter
      .col-6
        h4 You activated the Web Device
        ul
          li
            h5 You need to manually toggle this device on each time you login.
          li
            h5 This device is only active when the website is open.
          li
            h5 Don't enable the web device on a computer where the native app is already running.
        img.full-width(:src="'https://assets.boid.com/images/newBrowserDevice' + slideShowIndex + '.png'")
      .col-6
        h4 Whitelist this site in your ad-blocker and anti-virus
        ul
          li
            h5 The Boid web device uses javascript web-mining technology.
        div(style="padding:30px;")
          img(src="https://assets.boid.com/images/adblock.png" style="width: 100%;").shadow-3   
    q-btn.full-width(big flat v-if="explainWebDevice" @click="modal.close()") I understand

      

</template>
<style lang="stylus">
@import '~variables'
  .deviceCard
    padding 20px
  .deviceListIcon
    width: 50px

</style>
<script>
var slideshowInterval = null
import {openURL} from 'quasar'
export default {
  data(){
    return {
      phone:false,
      webMinerHidden:true,
      modalRdy:false,
      slideShowIndex:0,
      explainWebDevice:false,
      nativeAppList:[
        'Conveniently run in the background or manually toggle on/off as you like.',
        'Generates maximum ⚡️️️️️️️️️Boid Power: 2 - 5x more than web app.',
        'Contributes towards blockchain and distributed scientific computing networks simutaneously.',
        'Compatible with MacOS and Windows.'
      ],
      webAppList:[
        'You must manually activate the app when you login and leave the website open to allow it to run.',
        'Reduced performance and earnings vs native app.',
        'Cryptocurrency networks only (no science projects).',
        'Runs on any device with a web browser (even gaming consoles).'
      ]
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    openURL,
    webMinerIcon(index){if(index === 3) {return 'check'} else return 'clear'},
    init(){
      this.$root.$on('modal.addDevice',(toggle) =>{
        if (toggle){
          this.modal.open()
        } else{
          this.modal.close()
        }
      })
    },
    initUserWebDevice: async function(){
      this.explainWebDevice = true
      this.slideShow()
      if (this.thisUser.devices.some((el)=>{return el.type==="BROWSER"})) return
      var result = await this.$api.addDevice({name:"This Browser",type:"BROWSER"}).catch(console.log)
      this.$e.$emit('refreshUser')
      // console.log(result)
    },
    slideShow(){
      slideshowInterval = setInterval(()=>{
        if (this.slideShowIndex>0){
          this.slideShowIndex = 0
        } else {
          this.slideShowIndex += 1
        }
      },1000)
    },
    modalOpened(){
      this.disable = false
      this.webMinerHidden = true
      this.explainWebDevice = false
      console.log('modal opened')
      console.log('explainWebDevice',this.explainWebDevice)
    },
    modalClosed(){
      console.log('modal closed')
      if ( slideshowInterval ){ clearInterval(slideshowInterval) }
      this.webMinerHidden = true
      this.explainWebDevice = false
    } 
  },
  computed:{
    downloadButton(){
      if (this.$q.platform.is.win){
        return {
          label:"Download for Windows",
          icon:'fa-windows',
          url:'https://github.com/Boid-John/BoidDesktop/releases/download/0.0.3/Boid-windows-installer-0.0.3.exe.zip'
        }
      }else if (this.$q.platform.is.mac){
        return {
          label:"Download for Mac",
          icon:'fa-apple',
          url:'https://github.com/Boid-John/BoidDesktop/releases/download/0.0.3/Boid-0.0.03.dmg'
        }
      }else if (this.$q.platform.is.linux){
        return {
          label:"Install the Linux CLI Tool",
          icon:'fa-linux',
          url:'https://github.com/Boid-John/boidcmd'
        }
      }else{
        this.phone = true
        return {
          label:"",
          icon:'',
          url:''
        }
      }
      
    }
  },
  props:['modal','api','thisUser'],
  watch:{
    modal(modal){
      if (modal){
        // this.modal.$on('close',this.modalClosed)
        // this.modal.$on('open',this.modalOpened)
      }
    },
    thisUser(){
    }
  }
}
</script>