<template lang="pug">
  .div(style="padding:10px; max-width:1300px;")
    .layout-padding(v-if="thisUser.id")
      .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
        .row.justify-center.gutter
          div
            q-btn.on-left(big style="font-size:30px" color="green" @click="$e.$emit('openAuthModal',true)") Join Us
            q-btn.on-left(big style="font-size:20px" color="blue" @click="openURL('https://www.boid.com')") Learn More
    .row.full-width.justify-center
      .col
        .relative-position(ref="chartDiv" style="height:385px; padding: 10px; padding-top: 0px;")
          .full-width.relative-position(style="height:100px;")
            .row.full-width.justify-center
              .col-sm-12.col-lg-4.relative-position
                .relative-position(style="height:85px; margin-top:20px;")
                  .row.justify-center(v-if="parseSocial" style="padding-top:30px")
                    .col(v-for="(social,index) in parseSocial" :key="index")
                      .row.justify-center
                        q-btn.socialbtn(flat round @click="openURL(social.url)")
                          img.socialbtn(:src="social.img" style="max-width:35px; filter:opacity(.8)")
                          q-tooltip {{social.url}}
              .col-sm-12.col-lg-4.relative-position
                p.light-paragraph.text-center(style="font-size:24px;margin-top:0px;") {{thisUser.username}}
              .col-sm-12.col-lg-4.relative-position
                .relative-position(v-if="thisUser.team" style="height:85px;")
                  div(style="margin:10px")
                    p {{thisUser.tagline}}
            .row.full-width.justify-center
              img.avatar.absolute-center.block( style="width:95px; object-fit:cover; height:95px; margin-top:30px;" :src="thisUser.image").bg-white
          userChart( style="margin-top:0" v-if="powerChart" :chartData="powerChart" :height="295")
          q-inner-loading(:visible="!powerChart")
            q-spinner-ball(size="60px" color="blue")
    .row.justify-center
      .col
        q-card.animate-scale.relative-position(v-if="authenticated")
          q-list( v-for="(device,index) in devices" :key="device.id")
            q-item.relative-position
              q-item-side()
                label.relative-position(style="margin-right:20px;") {{index+1}}.
                q-icon(:name="parseDevice.icon(device)" :color="parseDevice.color(device)")
              q-item-main
                q-item-tile(label style="user-select: none;") {{device.name}}
                  label.relative-position(style="padding-left:15px;margin-left:20px;" sublabel ) OS: {{device.type}}
                    div.absolute-top-left(style="width:100px; height:30px;")
                  label.relative-position(style="padding-left:15px;margin-left:20px;" sublabel ) CPU: {{device.boincPower.toLocaleString()}}
                    | {{displayPending(device)}}
                    q-tooltip Device Power (Pending)
                    img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")
                  label.relative-position(style="padding-left:15px;margin-left:20px;" sublabel ) GPU: {{device.rvnPower.toLocaleString()}}
                    div.absolute-top-left(style="width:100px; height:30px;")
                    img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:0px;")
                  label.relative-position(style="padding-left:15px;margin-left:20px;" sublabel ) DATE: 2019-06-21

            .row.justify-center(style="width:100%; margin:0 !important;" v-if="thisUser.devices.length > 3 " )
              q-btn(flat :class="{activeTab:true}" style = "background-color:#ddca43;" @click="deviceDisplay(false)" v-if="!devShowFlag") Show more
              q-btn(flat :class="{activeTab:true}" style = "background-color:#ddca43;" @click="deviceDisplay(true)" v-else) Hide
    .row
      .col
        .row(style="width:100%; margin:0 !important;")
          q-card.animate-scale.relative-position(style="width:100%; padding:10px;")
            .h6.light-paragraph.text-center Work Units
              .row.justify-center(style="width:100%; padding:10px;")
                q-btn(flat :class="{activeTab:powDisplay === false}" @click="powDisplay = false")
                  | Completed
                q-btn(flat :class="{activeTab:powDisplay === true}" @click="powDisplay = true") Progress
              h6.light-paragraph.text-center(v-if="powDisplay===false") Completed
              h6.light-paragraph.text-center(v-else) Progress
      .col
        .row(style="width:100%; margin:0 !important;")
          q-card.animate-scale.relative-position(style="width:100%; padding:10px;")
            .h6.light-paragraph.text-center Shares from POW mining
              .row.justify-center(style="width:100%; padding:10px;")
</template>
<script>
  import device from './Device'
  import parseDevice from 'src/lib/parseDevice'
  import { openURL } from 'quasar'
  import userChart from './userChart.vue'
  import parseSocials from 'lib/parseSocial.js'

  export default {
    name: 'index',
    components:{userChart,device},
    data() {
      return {
        openURL,
        devices: [],
        devShowFlag:false,
        parseDevice,
        chartData:null,
        parseSocial:[],
        powDisplay:false,
      }
    },
    computed: {
      powerChart(){
        if (!this.chartData) return null;
        var labels = [];
        var data = [];
        this.chartData.forEach((el)=>{
          if (!el.createdAt) return null;
          const created = new Date(el.createdAt.toString());
          labels.push(created.getMonth() + 1 + '/' + created.getDate());
          data.push(parseInt(el.userPower));
        });
        return {labels,datasets:[{data:data, userName: this.thisUser.username, userPower: this.thisUser.tPower}]}
      },
    },
    methods: {
      async init() {
        if (!this.thisUser) return;
        let team = await this.$api.getTeam({name:this.thisUser.team.name});
        this.parseSocial = parseSocials( team.social );
        this.devShowFlag = false;
        this.devices = [];
        this.devices = this.thisUser.devices.filter((Item,key)=>(key<=2));
      },
      async getUserChart(){
        // todo should be updated with correct Api fix_me
        this.chartData = [];
        for( let i =0; i < 14; i ++ ){
          let power = Math.random()*1000;
          this.chartData.push({
            userPower:power,
            createdAt:new Date(new Date().getTime() - (new Date(2012,0,2).getTime() - new Date(2012, 0, 1).getTime())*(14-i))
          });
        }
      },
      deviceDisplay( displayFlag ){
        if( !displayFlag ){
          this.devShowFlag = true;
          this.devices = this.thisUser.devices;
        }
        else{
          this.devShowFlag = false;
          this.devices = [];
          this.devices = this.thisUser.devices.filter((Item,key)=>(key<=2));
          console.log("DEV>>>>>", this.devices)
        }
      },
      displayPending(device){
        if (device.pending) return `(${device.pending})`
        else return ""
      },
    },
    mounted() {
      this.getUserChart();
      this.init()
    },
    watch: {
      thisUser() {
        this.init();
      },
    },
    props: ['thisUser', 'authenticated', 'api'],
  }
</script>

<style lang="stylus">
  @import '~variables'
  .q-card {
    padding: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
  }
  .tokenimg{
    width:50px;
  }
  .teamRange{
    width:100%
  }
  .user:hover {
    background-color: $grey-2;
  }
  .infobtn {
    right: 15px !important;
    top: 15px !important;
    color: $blue !important;
  }

  .infobtn:hover {
    color: $green-8 !important;
  }
  .q-btn-round.q-btn-small {
    width: 30px;
    height: 30px;
  }
  .hovericon:hover {
    color: $blue;
  }

  .hovericon {
    color: $grey-5;
  }
  .mask{
    width:90%;
    height:30px;
    background-color:white;
    position:absolute;
    top:400px;
  }
  .socialbtn:hover
    filter: opacity(1.0)
  .activeTab
    background-color: $green-7
    color: white
</style>
