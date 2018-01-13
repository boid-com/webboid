<template lang="pug">
.layout-padding
  h4.text-center Team
  img.avatar.text-center(:src="thisUser.image")
</template>

<script>

export default {
  name: 'index',
  data () {
    return {
    }
  },
  computed: {

  },
  methods: {

  },
  watch:{
    "thisTeam":async function(team){
      if (!team) return
      console.log('team is ready',team)
    }
  },
  props:['thisUser','thisTeam','api']
}
</script>

<style lang="stylus">

</style>
