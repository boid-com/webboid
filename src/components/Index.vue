<template lang="pug">
.layout-padding(v-if="authenticated")
  big.thin-paragraph User Dashboard
  br
  br
  .row.gutter.justify-center
    .col-auto
      q-card.animate-scale
        p.light-paragraph.text-center Power Rating
        div(style="margin:auto")
          p.text-center 500
            q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
        q-btn(small flat color="blue").block.full-width
          | Increase Power Rating
          q-icon.on-right(name="add")
    .col
      q-card.animate-scale
        p.light-paragraph.text-center My Devices
        q-list(highlight)
          q-list-header My Devices
        div(style="margin:auto")
          p.text-center 500
            q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
        q-btn(small flat color="blue").block
          | Increase Power Rating
  
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
  props:['thisUser','authenticated']
}
</script>

<style lang="stylus">
.q-card
  padding:10px
  box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12)
</style>
