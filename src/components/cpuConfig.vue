<template lang="pug">
  div(style="overflow:hidden;")
    div(v-if="config && !showAdvanced" style="padding-left:20px; padding-right:20px; height:600px; overflow:hidden;").relative-position
      h4.text-blue.text-center(style="padding:20px;") CPU Settings
      q-field(icon="fa-tachometer" label="CPU Utilization" helper="Percentage of CPU to utilize. Boid automatically runs at a low priority and pauses when other applications use > 30% CPU.")
        .row
          .col-2
            big.float-left {{prefs.max_ncpus_pct}}%
          .col-10
            .row.justify-center
              .col-10
                q-slider( v-model="prefs.max_ncpus_pct" :step="5" :min="10" :max="100" snap markers fill-handle-always )
      q-field(icon="refresh"  helper="Toggle on CPU automatically when Boid is launched.")
        q-checkbox(v-model="config.autoStart" label="Start on Launch")
      q-field(icon="battery_alert"  helper="Extend battery life by pausing Boid when disconnected from a power source. Boid will resume when power is restored.")
        q-checkbox(v-model="pauseOnBattery" label="Pause on Battery Power")
      q-field(icon="mouse"
      helper="If enabled, Boid will pause computing while mouse/keyboard is being used. Will resume after a set number of minutes of inactivity.") 
        q-checkbox(v-model="pauseOnActivity" label="Pause on user activity ")
        div(style="height:30px;")
          .row.items-center
            .col-auto.item-start
              small.text-grey-8 Resume after
            .col-2
              q-input(:disable="!pauseOnActivity" type="number" :min="1" :decimals="0" style="height:25px; padding-top:0px; margin-bottom:0px; margin-top:0px; padding-bottom:10px; padding-left:10px;" v-model="prefs.idle_time_to_run")
            .col
              small.text-grey-8 minutes of inactivity
      .flex.flex-center(style="padding-top:20px;")
        q-btn(v-if="!showAdvanced" color="grey-7" flat @click="showAdvanced = true") advanced
    div(style="padding:10px; height:90%;" v-if="showAdvanced").absolute-center.bg-white.full-width
      p.text-center ADVANCED
      div(style="padding:10px;")
        .row.items-center
          .col-4
            q-btn(color="blue" style="padding:5px;" small outline @click="ipc.send('boinc.openDirectory')") open BOINC Directory
          .col
            small(style="padding:10px;").block You can manually edit config files for BOINC.
        .row.items-center
          .col-4
            .flex.flex-center
              q-btn(color="red" small @click="ipc.send('boinc.reset')") Reset
          .col
            small(style="padding:10px;").block Removes all Boid CPU files and restarts Boid. Files will be reinstalled on startup. You will lose progress on any Work-Units currently being worked on.
    .row.gutter.justify-center.absolute-bottom(style="bottom:50px;")
      q-btn( outline @click="backbtn()") < Back
      q-btn.on-right(color="green" @click="updateCpuConfig()") Confirm

</template>

<script>
function valBetween(v, min, max) {
  return Math.min(max, Math.max(min, v))
}
export default {
  data(){
    return {
      config:null,
      prefs:null,
      ipc:window.local.ipcRenderer,
      showAdvanced:false
    }
  },
  props:['data','thisModal'],
  methods:{
    updateCpuConfig(){
      try {
      console.log('update CPU settings here')
      if (this.prefs.idle_time_to_run < 1) this.prefs.idle_time_to_run = 3
      this.$root.$emit('updateCPUConfig',{prefs:this.prefs,config:this.config})
      this.$parent.close()
      } catch (error) {
        alert(error)
        console.log(error)
      }
    },
    backbtn(){
      if (this.showAdvanced) this.showAdvanced = false
      else this.$parent.close()
    }
  },
  computed:{
    pauseOnBattery:{
      // set(val){return this.prefs.run_on_batteries = !val},
      // get(val){return !this.prefs.run_on_batteries}
      set(val){return this.config.run_on_batteries = !val},
      get(val){return !this.config.run_on_batteries}
    },
    pauseOnActivity:{
      // set(val){return this.prefs.run_if_user_active = !val},
      // get(val){return !this.prefs.run_if_user_active}
      set(val){return this.config.run_if_user_active = !val},
      get(val){return !this.config.run_if_user_active}
    }
  },
  mounted(){
    console.log(this.data.prefs)
    this.prefs = Object.assign({},this.data.prefs)
    this.config = Object.assign({},this.data.config)
  },
  watch: {
    'prefs.max_ncpus_pct'(val) {
      if (val) {
        var cpuPercent = valBetween(val * 1 + 15, 70, 100)
        this.prefs.cpu_usage_limit = cpuPercent
      }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
