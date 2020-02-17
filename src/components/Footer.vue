<template lang="pug">
div(style="min-height:100px; margin-top:40px;").full-width.bg-grey-9
  .row.justify-end
    .col-auto(style="margin: 10px;")
      q-btn.on-right(flat @click="openURL('https://community.boid.com')").linkbtn
        q-icon(name="fa-users")
      q-btn.on-right(flat @click="openURL('https://t.me/Boidcom_official')").linkbtn
        q-icon(name="fa-telegram")
      q-btn.on-right(flat @click="openURL('https://discordapp.com/invite/zJnRpVz')").linkbtn
        img(src="/statics/images/discordicon.svg")
      q-btn.on-right(flat @click="openURL('https://twitter.com/boidcom')").linkbtn
        q-icon(name="fa-twitter")
      q-btn.on-right(flat @click="openURL('https://discussions.app/tag/boid')").linkbtn
        img(src="/statics/images/discussions.svg")
      q-btn.on-right(flat @click="openURL('https://github.com/boid-com')").linkbtn
        q-icon(name="fa-github")
      q-btn.text-blue-5(flat @click="openURL('https://www.boid.com')") What is Boid?
      
</template>
<style lang="stylus" scoped>
.q-btn
  color white
img
  width 30px
.linkbtn
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


