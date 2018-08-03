<template lang="pug">
div(style="min-height:100px; margin-top:40px;").full-width.bg-grey-9
  .row.justify-end
    .col-auto(style="margin: 10px;")
      q-btn(flat @click="openURL('https://discordapp.com/invite/DCQ6FrC')") Discord
        img.on-right(src="/statics/images/discordicon.svg")
      q-btn.on-right(flat @click="openURL('https://twitter.com/boidcom')") Twitter
        img.on-right(src="/statics/images/twitterlogo.svg")
      q-btn.on-right.text-blue-5(flat @click="openURL('https://www.boid.com')") What is Boid?
      
</template>
<style lang="stylus" scoped>
.q-btn
  color white
img
  width 30px
</style>

<script>
import {openURL} from 'quasar'
export default {
  data(){
    return{

    }
  },
  methods:{
    openURL
  }
}
</script>


