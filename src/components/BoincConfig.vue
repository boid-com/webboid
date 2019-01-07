<template lang='pug'>
  div(v-if="config" style="padding-left:20px; padding-right:20px;")
    h6.text-centered CPU Settings:
    q-field(icon="fa-tachometer" label="CPU Utilization" helper="Maximum CPU usage")
      big {{config.max_ncpus_pct}}%
      q-slider( v-if="config.max_ncpus_pct" v-model="config.max_ncpus_pct" :step="5" :min="5" :max="100" snap markers fill-handle-always )
    q-field(icon="fa-pause" label="Pause when user activity detected" helper="If Enabled, Boid will pause computing while mouse/keyboard is being used.")
      q-toggle(v-model="config.run_if_user_active")
    br
    br
    .row.gutter.justify-center
      q-btn( outline @click="thisModal.close()") < Back
      q-btn.on-right(color="green" @click="$e.$emit('boincConfigChanged',config),thisModal.close()") Confirm
</template>

<script>
function valBetween(v, min, max) {
  return Math.min(max, Math.max(min, v))
}
export default {
  data() {
    return {}
  },
  watch: {
    config(val) {
      console.log('got config', val)
    },
    'config.max_ncpus_pct'(val) {
      if (val) {
        var cpuPercent = valBetween(val * 1 + 15, 70, 100)
        if (this.config) {
          this.config.cpu_usage_limit = cpuPercent
        }
      }else{
        var cpuPercent = valBetween(80 * 1 + 15, 70, 100)
        if (this.config) {
          this.config.cpu_usage_limit = cpuPercent
        }
      }
    }
  },
  props: ['config', 'thisModal']
}
</script>

<style>

</style>
