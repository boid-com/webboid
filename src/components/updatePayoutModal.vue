<template lang="pug">
div.relative-position(v-if="thisUser" style="padding:30px; min-height:300px; max-width:460px;" )
  h4(style="margin-bottom:0px;").text-blue Update your EOS Account
  h6(style="margin-top:6px;" v-if="page===0") Tokens earned in Boid are automatically sent to your EOS account.
  br
  .row.justify-center
    q-btn(color="amber-8" flat @click="openURL('https://www.youtube.com/watch?v=VVlGjVDek_M')") I need help!
  div(v-if="page === 0" style="margin-bottom: 100px")
    .row
      div
        p.text-center(v-if="!thisUser.payoutAccount") 
        div(v-else)
          br
          p.text-grey-7 Your linked EOS account:
          h5.text-center {{thisUser.payoutAccount}}
      div(v-if="!thisUser.payoutAccount")
        q-card(color="red-4")
          .row
            .col-auto
              div
                h2(style="margin:0px; padding-right:15px; padding-left:10px;") ! 
            .col 
              p You need to link an EOS account to redeem your earnings.

        p.text-grey-9(style="padding-top:10px;") Don't have an EOS account?
        //- .row.justify-center(style="padding:20px;")
        //-   q-btn(color="blue") Buy EOS account with BOIDs
      div(v-if="!scatterId")
        p.text-grey-9 Link your existing EOS account using Scatter
        .row.justify-center
          q-btn(color="green" style="margin:20px;" @click="$root.$emit('scatterLogin')") Scatter Login
      div(v-else)
        p.text-grey-8 Scatter Identity:
          h4.text-center {{scatterId.name}}
          .row.justify-center(style="padding:20px; padding-top:0px;")
            q-btn(@click="$root.$emit('resetScatter')") Change Scatter Id
            q-btn(color="green" @click="linkAccount()" ) Link EOS Account
              
        //- p This EOS account will receive tokens earned from this Boid account.
      
  div(v-if="page === 1" style="margin-bottom: 100px")
    h6 Great! We sent a confirmation email to you at:
    h5 {{thisUser.email}}
    h6 You need to click the button in the email.
  div.absolute-bottom(v-if="page === 0" style="height:70px;")
    //- q-btn(big style="margin:30px; margin-bottom:30px;" color="green" @click="createRequest()").absolute-bottom-right Link
    q-btn(big outline style="margin:30px; margin-bottom:30px;" color="grey" @click="modal.close()").absolute-bottom-right Cancel
  div.absolute-bottom(v-if="page === 1" style="height:70px;")
    q-btn(big style="margin:30px; margin-bottom:30px;" color="blue" @click="modal.close()").absolute-bottom-right Confirm by Email
  q-inner-loading(:visible="pending")
    q-spinner-ball(size="90px" color="blue")

</template>
<style lang="stylus">
@import '~variables'
.nueimg
  padding: 10px;
  width: 160px;

</style>
<script>
import {openURL} from 'quasar'
export default {
  data(){
    return {
      newPayoutAccount:"",
      page:0,
      pending:false,
      scatterAuth:null,
      scatterId:null
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    openURL,
    reset(){
      this.page = 0
      this.newPayoutAccount = ""
    },
    init(){
      this.$root.$on('scatterAuth',(data)=>{
        this.scatterAuth = data
      })
      this.$root.$on('scatterId',(data)=>{
        this.scatterId = data
      })
      this.$root.$on('modal.updatePayout',(toggle) =>{
        if (toggle){
          this.modal.open()
        } else{
          this.modal.close()
        }
      })
      
    },
    async linkAccount(){
      const result = await this.$api.createAccountUpdateRequest({type:"EOS",newEos:this.scatterId.name})
      if(!result) alert('there was a problem with this request')
      if(result.success){
        this.page = 1
      }
    },
    modalOpened(){
      console.log('modal open')
      this.reset()
      window.olark('api.box.hide')

    },
    modalClosed(){
      console.log('modal closed')
      this.reset()
      window.olark('api.box.show')

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