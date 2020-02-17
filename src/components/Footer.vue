<template lang="pug">
div(style="min-height:100px; margin-top:40px;").full-width.bg-grey-9
  .row.justify-end
    .col-auto(style="margin: 10px;")
      q-btn.on-right(flat @click="openURL('https://community.boid.com')")
        q-icon(name="fa-users")
      q-btn.on-right(flat @click="openURL('https://t.me/Boidcom_official')")
        q-icon(name="fa-telegram")
      q-btn(flat @click="openURL('https://discordapp.com/invite/zJnRpVz')")
        img(src="/statics/images/discordicon.svg")
      q-btn.on-right(flat @click="openURL('https://twitter.com/boidcom')")
        q-icon(name="fa-twitter")
      q-btn.on-right(flat @click="openURL('https://discussions.app/tag/boid')")
        q-icon(name="blur_on")
      q-btn.on-right(flat @click="openURL('https://github.com/boid-com')")
        q-icon(name="fa-github")
      q-btn.text-blue-5(flat @click="openURL('https://www.boid.com')") What is Boid?
      
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


