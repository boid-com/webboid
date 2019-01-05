<template lang="pug">
  div(style="padding:30px; max-width: 550px; min-width:350px;").relative-position
    div
      
      div(v-if="!authenticated")
        h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Update Account
        h4.text-center You need to login to proceed
        .row.justify-center
          q-btn(color="green" @click="$e.$emit('openAuthModal')") Login
      //- div(v-else-if="finished")
      //-   h5.text-center {{finishedMessage}}
      //-   .row.justify-center
      //-     q-btn(@click="$router.push('/')") Continue
      div(v-else-if="changeType ==='PASSWORD'")
        h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:25px;") Change Password
        //- .small.text-grey-9 Change Account Password
        q-input(
          v-model.trim="newPassword.password"
          @blur="$v.newPassword.password.$touch()"
          :error="$v.newPassword.password.$error"
          float-label="New Password"
          type="password"
          @keyup.enter="executeAccountChange(_self,newPassword)"
        )
        p.text-red.inline.text-center(v-if="$v.newPassword.password.$error") Password must be at least 6 characters long
        q-input(
          v-model.trim="newPassword.passwordRepeat"
          @input="$v.newPassword.passwordRepeat.$touch()"
          :error="$v.newPassword.passwordRepeat.$error"
          float-label="Repeat Password"
          type="password"
          @keyup.enter="executeAccountChange(_self,newPassword)"
        )
        p.text-red.inline.text-center(v-if="$v.newPassword.passwordRepeat.$error") Password Doesn't Match
        div(style="height:20px;")
        q-btn(
          :disabled="$v.newPassword.$error || !$v.newPassword.$dirty" 
          color="green"
          @click="executeAccountChange(_self,newPassword)") Submit
      q-inner-loading(:visible="pending")
        q-spinner-ball(size="70px" color="blue")
      

</template>
<style scoped lang="stylus">
.q-card {
  padding: 20px
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)
}
</style>

<script>
import { email,required, sameAs, minLength } from "vuelidate/lib/validators"
import { Toast } from 'quasar'

async function executeAccountChange(v,newData){
  try {
    if (v.$v.$error || !v.$v.$dirty) return
    newData.requestId = v.requestId
    if(newData.password){
      v.pending = true
      const finished = await v.$api.executeAccountUpdateRequest(newData)
      v.pending = false
      if(!finished) return alert('there was a problem')
      else if (finished.invalid) {
        Toast.create.negative(finished.invalid)
        v.$router.push('/')
      }
      else if (finished.success=== true){
        v.finished = true
        v.finishedMessage = finished.message
        Toast.create.positive(finished.message)
        v.$router.push('/')
      }
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
      initialized:false,
      pending:false,
      finished:true,
      finishedMessage:"h there dkdksl dkf dkd ",
      changeExecuted:false,
      requestId:null,
      changeType:"",
      newEmail:"",
      newPassword:{
        password:"",
        passwordRepeat:""
      },

    }
  },
  validations: {
  newPassword:{
    password:{
      required,
      minLength: minLength(6)
    },
    passwordRepeat:{
      same: sameAs('password')
    }
  }
  },
  created(){
    this.$root.$emit('hideAllMenus',true)
    console.log(this.$route)
  },
  methods:{
    executeAccountChange,
    init(){
      this.requestId = this.$route.params.requestId
    }
  },
  computed:{
    newPasswordBtn(){
      // if (!this.$v.account.newPassword.$error && this.account.email != "" &&this.account.email != this.thisUser.email) return false
      // else return true
      return true
    }
  },
  props:['api','thisUser','authenticated'],
  watch:{
    'this.$route.params.requestId'(){
      console.log('got requestID change')
    },
    changeType(){
      // if (this.changeType === "" && this.authenticated){
      //   this.pending = true
      // }else this.pending = false
    },
    modal(modal){
      console.log(modal)
    },
    requestId: async function(){
      try {
        this.pending = true
        const accountChangeRequest = await this.$api.getAccountUpdateRequest({requestId:this.requestId})
        this.pending = false
        if (!accountChangeRequest) alert('error retreiving Account Change Request')
        else if(accountChangeRequest.invalid){
          Toast.create.negative(accountChangeRequest.invalid)
          this.$router.push('/')
          return
        }
        this.changeType = accountChangeRequest.type
      } catch (error) {
        this.$router.push('/')
        alert(error.message)
      }
    },
    authenticated:{
      immediate: true,
      handler(val){
        console.log('hi')
        if(val){
          this.init()
        }else{
          console.log('need to authenticate')
        }
      }
    }
  }
}
</script>