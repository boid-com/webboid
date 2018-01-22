<template lang="pug">
.layout-padding
  .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
    .row.justify-center.gutter
      q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal',true)") Join Boid
  .row.row-gutter
    .col
      q-card.animate-scale.relative-position(style="min-width:300px")
        .layout-padding.full-width.relative-position(style="height:140px;")
          img.absolute-center.block(style="width:120px; height:120px;" :src="team.image")
  .row.justify-center.gutter
    .layout-padding(v-if="!authenticated")
      .layout-padding
        q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal')") Join Boid

</template>

<script>

export default {
  name: 'index',
  data () {
    return {
      team:{}
    }
  },
  computed: {

  },
  methods: {

  },
  watch:{
    team(val){
      console.log('gotTeam',val)
    }
  },
  created(){
    this.$e.$on('team',team => {this.team = team})
  },
  props:['thisUser','api','authenticated'],
}
</script>

<style lang="stylus">
.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.tokenimg{
  width:50px;
}
</style>
