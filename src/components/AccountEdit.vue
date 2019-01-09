<template lang="pug">
  div(style="padding:30px; max-width: 750px; min-width:350px;").relative-position
    div
      h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Update Account
      div(v-if="false")
      div(v-else-if="changeRequestSent")
        h5  {{finishedMessage}}
        div.text-center(style="padding-top:90px;")
          q-btn.text-center(@click="thisModal.close()" style="margin-auto" invert color="grey") done
      div.relative-position(v-else)
        .small.absolute-top Account Email
          p.text-red.inline.text-center(v-if="$v.account.email.$error") Not a valid email
        div(style="height:5px;")
        q-input(
          v-model.trim="account.email"
          @input="$v.account.email.$touch()"
          :error="$v.account.email.$error"
          type="email"
          :placeholder="thisUser.email"
          @keyup.enter="initiateChangeAccount(_self,'EMAIL')"
        )
        div(style="height:40px;")
          //- p.text-red.inline.text-center(v-if="$v.account.email.$error") Not a valid email
          q-btn.full-width( :disabled="updateEmailBtn" color="blue" 
          @click="initiateChangeAccount(_self,'EMAIL')") Change Email
        div(style="height:130px; padding-top:30px;")
          .small(style="padding-bottom:20px;") Account password 
          q-btn( color="blue" @click="initiateChangeAccount(_self,'PASSWORD')").full-width Change Password
        div(style="height:80px; padding-top:10px;")
          .small Linked EOS Account
          div(v-if="thisUser.payoutAccount")
            h5.text-center {{thisUser.payoutAccount}}
            q-btn( color="blue" @click="goToPayoutModal()").full-width change Payout Account
          div(v-else)
            h5.text-center.text-red No EOS Account Linked!
            q-btn( color="green" @click="goToPayoutModal()").full-width Link Payout Account

        div.text-center(style="padding-top:90px;")
          q-btn.text-center.on-left(@click="goToProfileModal()" style="margin-auto" flat color="blue") < Go To Profile
          q-btn.text-center(@click="thisModal.close()" style="margin-auto" invert color="grey") cancel
      q-inner-loading(:visible="pending")
        q-spinner-ball(size="70px" color="blue")
      

</template>
<script>
import { email } from "vuelidate/lib/validators"
import { Toast } from 'quasar'


async function initiateChangeAccount(v,type){
  try {
    v.pending = true
    const result = await v.$api.createAccountUpdateRequest({type,newEmail:v.account.email})
    if (result.invalid){
      Toast.create.negative(result.invalid)
      setTimeout(() => {
        v.pending = false
      }, 1500)
      return
    }
    else {
      v.changeRequestSent = true
      v.pending = false
      console.log(result)
      this.finishedMessage = result.message
    }
  } catch (error) {
    v.pending = false
    alert(error.message)
  }

}

var slideshowInterval = null
import {openURL} from 'quasar'
export default {
  data(){
    return {
      finishedMessage:"",
      initialized:false,
      pending:false,
      changeRequestSent:false,
      account:{
        email:""
      }
    }
  },
  validations: {
  account:{
    email:{email}
  }
  },
  created(){
    this.$e.$on('openAccountEditModal', () => {
      this.init()
    })
  },
  methods:{
    initiateChangeAccount,
    init(){
      this.account.email = ""
      this.changeRequestSent = false
      this.pending = false
      this.$v.account.$reset
    },
    goToPayoutModal(){
      this.thisModal.close()
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.$root.$emit('modal.updatePayout',true)
        })
      },5)
   
    },
    goToProfileModal(){
      this.thisModal.close()
      setTimeout(()=>{
        this.$nextTick(()=>{
          this.$e.$emit('openProfileEditModal')
        })
      },5)

    }
  },
  computed:{
    updateEmailBtn(){
      if (!this.$v.account.email.$error && this.account.email != "" &&this.account.email != this.thisUser.email) return false
      else return true
    }
  },
  props:['thisModal','api','thisUser'],
  watch:{
    modal(modal){
      console.log(modal)
    },
    thisUser(){
      if (!this.account.initialized){
        // this.account = this.thisUser
        // this.initialized = true
      }
    }
  }
}
</script>