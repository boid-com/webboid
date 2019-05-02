<template lang="pug">
  div(v-if="config" style="padding-left:20px; padding-right:20px; height:100%;").relative-position
    p {{config}}
    h6.text-centered GPU Settings:
    //- q-field(icon="fa-tachometer" label="GPU Utilization" helper="Maximum GPU usage")
    //-   big {{config.max_ncpus_pct}}%
    //-   q-slider( v-if="config.max_ncpus_pct" v-model="config.max_ncpus_pct" :step="5" :min="5" :max="100" snap markers fill-handle-always )
    //- q-field(icon="fa-pause" label="Pause when user activity detected" helper="If Enabled, Boid will pause computing while mouse/keyboard is being used.")
    //-   q-toggle(v-model="config.run_if_user_active")
    //- br
    //- br
    .row.gutter.justify-center.absolute-bottom(style="bottom:20px;")
      q-btn( outline @click="$parent.close()") < Back
      q-btn.on-right(color="green" @click="updateGpuConfig(),$parent.close()") Confirm

</template>

<script>
export default {
  data(){
    return {
      config:null
    }
  },
  methods:{
    updateGpuConfig(){
      console.log('update GPU settings here')
    }
  },
  mounted(){
    this.config = window.gpuConfig
  }
}
</script>

<style>

</style>
