<template lang="pug">
.layout-padding
  h4.text-center user Profile
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
  props:['thisUser','api']
}
</script>

<style lang="stylus">

</style>
