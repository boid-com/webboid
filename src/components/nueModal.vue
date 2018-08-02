<template lang="pug">
div(style="padding:30px; min-height:300px; max-width:460px;" )
  h4(style="margin-bottom:0px;").text-blue Welcome to boid
  h6(style="margin-top:6px;") The Social Supercomputer
  div(style="margin-bottom: 100px")
    .row.justify-center
      div
        img.nueimg(:src="pageContent[0].image")
    h6(style="") {{pageContent[0].text}}
    div(style="height:50px;")
    .row.justify-center
      div
        img.nueimg(:src="pageContent[1].image")
    h6(style="") {{pageContent[1].text}}

  div.absolute-bottom(style="height:70px;")
    // q-btn(v-if="page < 4" big style="margin:30px; margin-bottom:30px;" color="green" @click="turnPage()").absolute-bottom-right Next >
    q-btn(big style="margin:30px; margin-bottom:30px;" color="green" @click="modal.close()").absolute-bottom-right Start!
    // q-btn.full-width(flat small style="margin-top:40px;" color="grey") I'll figure it out
</template>
<style lang="stylus">
@import '~variables'
.nueimg
  padding: 10px;
  width: 160px;

</style>
<script>
export default {
  data(){
    return {
      page:0,
      pageContent:[
        {
          image:"/statics/images/nueimg.png",
          text:"Use the the question icons to learn more about how Boid works."
        },
        {
          image:"/statics/images/contactus.png",
          text:"Please contact us using the message box if you have any questions or bug reports."
        },
        {
          image:"",
          text:""
        },
        {
          image:"",
          text:""
        }
      ]
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      this.$root.$on('modal.nue',(toggle) =>{
        if (toggle){
          this.modal.open()
        } else{
          this.modal.close()
        }
      })
      
    },
    turnPage(){
      this.page += 1
    },
    modalOpened(){

    },
    modalClosed(){

    } 
  },
  computed:{
  },
  props:['modal','api','thisUser'],
  watch:{
    modal(modal){
      if (modal){
        this.modal.$on('close',this.modalClosed)
        this.modal.$on('open',this.modalOpened)
      }
    },
    thisUser(){
    }
  }
}
</script>