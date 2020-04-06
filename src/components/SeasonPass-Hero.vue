<template lang="pug">
div
  .row.justify-center.relative-position.gt-md(style="margin-top:40px;")
    div(style="height:5px; width:800px; top:95px;").absolute-center.bg-blue-2.gt-sm
    .col.infobox(v-for="(instruction,index) of instructions" :key="instruction.text")
      .row
        .col
          .row
            .col-auto.on-left
              h5.text-blue {{index+1}}
            .col
              .row.justify-center(style="padding-top:20px; padding-bottom:25px;").relative-position
                img(:src="instruction.img" style="height:150px; padding:15px; filter: drop-shadow(2px 2px 2px #9999)")
              .row.items-center(style="padding-bottom:35px;")
                .col(style="padding-top:20px;")
                  p {{instruction.text}}
  .row.lt-lg.justify-center(style="margin-bottom:40px; margin-top:40px;")
    .col.col-auto(v-for="(instruction,index) of instructions" :key="instruction.text")
      .row.justify-center(style="padding:10px; padding-left:10px;")
        .col-auto.on-left
          h3.text-blue {{index+1}}
        .col-auto.on-left
          img(:src="instruction.img" style="height:100px; padding:5px; margin filter: drop-shadow(2px 2px 2px #9999)")
        .col-auto
          p(style="width:300px;") {{instruction.text}}
</template>
<style lang="stylus" scoped>
  @import '~variables'
  .q-card
    // padding 20px !important
    // padding-bottom 5px !important
  .selectedTab
    background-color $blue-6
    color: white
  .selectedpay
    // background-color $-4
    // color white
    outline 1px solid $green-3
    box-shadow: 0 4px 10px 2px $green-8
</style>

<script>
import seasonPass from '../lib/seasonPass'

export default {
  data(){
    return seasonPass.state
  },
  methods:seasonPass.methods,
  computed:seasonPass.computed,
  mounted(){

  },
  watch:{
    
  }
}
</script>

