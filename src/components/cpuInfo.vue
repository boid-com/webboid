<template lang="pug">
  div(v-if="$parent.state")
    .row.justify-center.no-wrap
      div(v-for="nav in navigation")
        q-btn.relative-position( flat small :class="{selected: page === nav.name}" @click="page = nav.name" :disable="nav.disabled")
          div(v-if="nav.name === 'Active'").on-left {{activeWorkUnits.length}}
          div(v-if="nav.name === 'Completed'").on-left {{completed.length}}
          //- div(v-if="nav.name === 'Pending'").on-left {{pendingWU.length}}
          //- div(v-if="nav.name === 'Validated'").on-left {{validWU.length}}
          | {{nav.name}}
          q-progress.absolute-bottom(style="height:10%;" v-if="loadingPendingWU && nav.name === 'Pending' || nav.name === 'Validated' && loadingValidWU " indeterminate color="grey-5")
    q-card-separator
    div(v-if="page === 'Logs'")
      div(style="overflow:auto; height:285px;")
        div(v-for="log of $parent.reverseLog" style="padding:0px; margin:10px; overflow:hidden; user-select:auto;" ref="logDisplay")
          small.block {{log.time}}
          pre(style="margin:0px;")
            small(style="padding:0px;").text-black {{log.text}}
      q-btn(small flat @click="$parent.selectText()" :disable="$parent.reverseLog.length < 1" style="right:0px;").absolute-bottom-right.bg-white Copy Log
    div(v-if="page === 'Pending' || page === 'Validated' ")
        .row
          .col-12
            div(style="height:250px;overflow:auto;user-select:auto;margin:5px;").ellipsis
              div(v-for="wu of _self[completedPage]").ellipsis
                //- p {{wu}}
                div(v-if="true")
                  .shadow-1(style="margin:5px; padding:5px;").ellipsis
                    small.no-margin #[small Name:] {{wu.name}} #[small ID:] {{wu.workUnitId}}
                    .row.justify-center.no-wrap
                      div.infoBox
                        .row.justify-center
                          small.block.no-margin {{wu.sentTime[0]}}
                        .row.justify-center
                          small.block.no-margin {{wu.sentTime[1]}}
                        small.no-margin Downloaded
                      div.infoBox
                        .row.justify-center
                          p.block.no-margin.adjust {{wu.cpuTime.toFixed(2)}}
                        small CPU Hours
                      div.infoBox
                        .row.justify-center
                          small.block.no-margin {{wu.receivedTime[0]}}
                        .row.justify-center
                          small.block.no-margin {{wu.receivedTime[1]}}
                        small.no-margin Result Sent
                      div.infoBox
                        p.block.adjust.no-margin.text-center {{wu.grantedCredit.toFixed(0) || 0}}
                        small Credit
                      div.infoBox
                        p.block.adjust.no-margin.text-center {{wu.weight.toFixed(2) || 0}}
                        small Weight
                      div.infoBox
                        p.block.adjust.no-margin.text-center {{wu.power.toFixed(2) || 0}}
                        small Power
    div(v-if="page === 'Active' ").relative-position
      div(style=" padding:5px;")
        div.shadow-6(style="margin:5px; padding:20px; z-index:4; width:80%;" v-if="!closeNotice").absolute-center.bg-white
          q-btn( @click="closeNotice=true" flat color="red" style="right:-10px; top:-10px;").float-right
            q-icon(name="close" color="red")
          p.strong.block Notice
          p.text-grey-9 Work units require 6-12 hours to complete before Boid Power is credited. Progress is only updated in the interface hourly.
        .row.justify-center(style="height:22px;")
          .col-auto
            p.light-paragraph.inline Work Units
          .col-auto
            q-icon.on-right.inline(name="info_outline" color="green" @click="closeNotice = false" v-if="closeNotice" style="padding-top:5px;" ).cursor-pointer

        .row(style="height:255px; overflow:auto;")
          .col-4( style="margin:0px;" v-for="workUnit of workUnits" :key="workUnit.slot[0]" ).relative-position
            div(style="margin:5px; padding:8px;" :class="{paused:wuPaused(workUnit)}").shadow-1
              //- q-btn(@click="alert(workUnit)")
              .row.items-center
                //- .col-4
                //-   .flex.flex-center
                //-     img(src="/statics/images/magnifyingglass.svg" style="width:100%; height:100%;")
                    //- q-icon(name="info" size="30")
                .col-12
                  .row.items-center
                    .col.ellipsis
                      small {{workUnit.result_name[0]}}
                      q-tooltip {{workUnit.result_name[0]}}
                  .row.items-center(v-if="!wuPaused(workUnit)")
                    .col
                      q-icon(name="play_arrow" size="15px" color="blue")
                        q-tooltip Status: Active
                      small {{wuProgress(workUnit).toFixed(0)}} %
                      div(style="padding-top:3px; padding-bottom:3px;")
                        q-progress(style="height:10px;" color="blue" :buffer="0" :percentage="wuProgress(workUnit)")
                  .row.items-center(v-else)
                    .col
                      q-icon(name="pause" size="15px" color="grey-5") 
                        q-tooltip Status: Paused
                      small {{wuProgress(workUnit).toFixed(0)}} %
                      div(style="padding-top:3px; padding-bottom:3px;")
                        q-progress(:buffer="0" style="height:10px;" :percentage="wuProgress(workUnit)" color="grey-4")
                  small.block Elapsed: {{ (parseFloat(workUnit.checkpoint_elapsed_time[0])/100/60).toFixed(2) }} hours
                    q-tooltip Elapsed Time
</template>
<script>
function parseWUs(WUs){
  if (!WUs) return []
  return WUs.map(el => {
    if (el.sentTime) el.sentTime = new Date(el.sentTime).toLocaleString().split(',')
    if (el.receivedTime) el.receivedTime = new Date(el.receivedTime).toLocaleString().split(',')
    return el
  })
}
export default {
  data(){
    return {
      navigation:[{name:"Active"},{name:"Pending"},{name:"Validated"},{name:"Logs"}],
      page:'Logs',
      completedPage:'validWU',
      expandSlot:null,
      closeNotice:JSON.parse(window.localStorage.getItem('closeWUNotice')),
      validWU:[],
      pendingWU:[],
      loadingValidWU:false,
      loadingPendingWU:false

    }
  },
  mounted(){
    this.getCompletedWU()
    if (window.cpuInfoInterval) clearInterval(window.cpuInfoInterval)
    window.cpuInfoInterval = setInterval(() => {
      if(!this.$parent.selected) return clearInterval(window.cpuInfoInterval)
      console.log(window.cpuInfoInterval)
      this.getCompletedWU()
    }, 3600000)
  },
  beforeDestroy(){
    if (window.cpuInfoInterval) clearInterval(window.cpuInfoInterval)
  },
  methods:{
    async getCompletedWU(){
      try {
        this.loadingValidWU = true
        this.$api.getWorkUnits({wcgid:this.$parent.thisDevice.wcgid,valid:true}).then(data =>{
          this.validWU = parseWUs(data.sort(function(b,a){return Date.parse(a.receivedTime) - Date.parse(b.receivedTime)}))
          this.loadingValidWU = false
        })
        this.loadingPendingWU = true
        this.$api.getWorkUnits({wcgid:this.$parent.thisDevice.wcgid,valid:false}).then(data =>{
          this.pendingWU = parseWUs(data.sort(function(b,a){return Date.parse(a.receivedTime) - Date.parse(b.receivedTime)}))
          this.loadingPendingWU = false
        })
      } catch (error) {
        this.loadingValidWU = false
        this.loadingPendingWU = false
        alert(error)
      }

    },
    alert(data){alert(JSON.stringify(data,null,2))},
    wuProgress(workUnit){
      if (!workUnit) return 0
      return parseFloat(workUnit.checkpoint_fraction_done[0]) * 100
    },
    expand(val){
      if (this.expandSlot === val) this.expandSlot = null
      else this.expandSlot = val
    },
    wuPaused(workUnit){
      if (workUnit.active_task_state[0] == 1 && this.$parent.toggle && !this.$parent.isPaused) return false
      else return true
    }
  },
  computed:{
    results(){
      var sorted = this.completed.sort(function(a, b){return parseFloat(a.completed_time) - parseFloat(b.completed_time)})
      const parsed = sorted.map(el => {
        var data = {}
        data.completedDate = new Date( parseFloat(el.completed_time)*1000 ).toLocaleString()
        data.name = el.name[0]
        data.receivedDate = new Date( parseFloat(el.received_time)*1000 ).toLocaleString()
        data.elapsedTime = parseFloat(el.final_elapsed_time)/3600
        data.cpuTime = parseFloat(el.final_cpu_time)/3600
        data.state = parseInt(el.state)
        return data
      })
      return parsed
    },
    activeWorkUnits(){
      try {
        if (this.$parent.toggle) return this.$parent.state.workUnits.filter(el => el.active_task_state[0] == 1)
        else return []
      } catch (error) {
        console.error(error)
        return []
      }

    },
    completed(){
      try {
        return this.$parent.state.results.filter((el)=> parseInt(el.state) != 2)
      }catch(error){
        console.error(error)
        return []
      }
    },
    workUnits(){
      try {
        return this.$parent.state.workUnits
      } catch (error) {
        console.error(error)
        return []
      }
    }
  },
  watch:{
    closeNotice(val){
      window.localStorage.setItem('closeWUNotice',val)
    },
    page(val){
      if (val === 'Pending'){
        this.completedPage = 'pendingWU'
        this.getCompletedWU()
      }
      if (val === 'Validated'){
        this.completedPage = 'validWU'
        this.getCompletedWU()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .adjust
    padding-bottom 2px
  .infoBox
    margin 5px
    padding 5px
  .selected
    background-color $green-5
    color: white
  .paused
    color grey
</style>

