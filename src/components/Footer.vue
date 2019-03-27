<template lang="pug">
div(style="min-height:100px; margin-top:40px;").full-width.bg-grey-9
  .row.justify-end
    .col-auto(style="margin: 10px;")
      q-btn(flat @click="openURL('https://discordapp.com/invite/DCQ6FrC')")
        //- q-icon(name="fa-discord")
        img(src="/statics/images/discordicon.svg")
      q-btn.on-right(flat @click="openURL('https://twitter.com/boidcom')")
        //- img(src="/statics/images/twitterlogo.svg")
        q-icon(name="fa-twitter")

      q-btn.on-right(flat @click="openURL('https://github.com/Boid-John')")
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


