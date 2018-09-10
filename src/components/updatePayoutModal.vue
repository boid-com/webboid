<template lang="pug">
div(v-if="thisUser" style="padding:30px; min-height:300px; max-width:460px;" )
  h4(style="margin-bottom:0px;").text-blue Update your EOS Account
  h6(style="margin-top:6px;" v-if="page===0") Tokens earned in Boid are automatically sent to your EOS account.
  br
  div(v-if="page === 0" style="margin-bottom: 100px")
    .row
      div
        h4.text-center(v-if="!thisUser.payoutAccount") You haven't setup an EOS account yet!
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
        p Don't have an EOS account? Here are some ways to create one. 
        ul
          li 
            a(href="https://eos-account-creator.com/choose/") Online
          li
            a(href="https://eoslynx.com/") App
    p.text-grey-7(v-if="!thisUser.payoutAccount") Add EOS Account:
    p.text-grey-7(v-else) Change EOS Account:
    div
      q-field(:count="12")
        q-input(
          stack-label="EOS Account"
          type="text"
          v-model.trim="newPayoutAccount"
          :max-length="12"
        )
        small.thin-paragraph.float-left(style="padding-top:8dpx;") This EOS account will receive tokens earned from this Boid account.
      
  div(v-if="page === 1" style="margin-bottom: 100px")
    h6 Great! We sent a confirmation email to you at:
    h5 {{thisUser.email}}
    h6 You need to click the button in the email.
  div.absolute-bottom(v-if="page === 0" style="height:70px;")
    q-btn(big style="margin:30px; margin-bottom:30px;" color="green" @click="createRequest()").absolute-bottom-right Update
    q-btn(big outline style="margin:30px; margin-bottom:30px; right:105px;" color="grey" @click="modal.close()").absolute-bottom-right Cancel
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
export default {
  data(){
    return {
      newPayoutAccount:"",
      page:0,
      pending:false
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    reset(){
      this.page = 0
      this.newPayoutAccount = ""
    },
    init(){
      this.$root.$on('modal.updatePayout',(toggle) =>{
        if (toggle){
          this.modal.open()
        } else{
          this.modal.close()
        }
      })
      
    },
    createRequest: async function (){
      if (
        this.newPayoutAccount.length > 3 && 
        this.newPayoutAccount.length < 13
        ){
          if (this.newPayoutAccount === this.thisUser.payoutAccount){
            alert('The EOS Account you added is already linked to this Boid account')
          }
          this.pending = true
          const result = await this.api.auth.updatePayoutAccount(this.newPayoutAccount)
          this.pending = false
          console.log(result)
          if (result.error) alert(result.error)
          else this.page = 1
        }
        else{
          alert('The EOS Account you entered is not valid')
        }

    },
    modalOpened(){
      this.reset()
    },
    modalClosed(){
      this.reset()
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