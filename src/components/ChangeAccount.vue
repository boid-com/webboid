<template lang="pug">
  div(style="padding:30px; max-width: 550px; min-width:350px;").relative-position
    div
      div(v-if="false")
        h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Update Account
        h4.text-center You need to login to proceed
        .row.justify-center
          q-btn(color="green" @click="$e.$emit('openAuthModal')") Login
      div(v-if="finished")
        h5.text-center {{finishedMessage}}
        .row.justify-center
          q-btn(@click="finishBtn()") Continue
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
      div(v-else-if="changeType ==='EMAIL'")
        h5 Your password was changed!
        h6 {{newEmail}}
      div(v-else-if="changeType ==='EOS'")
        div(v-if="!scatterId")
          h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Update Boid EOS Account
          h4.text-center You need to login to Scatter to proceed
          h5.text-center You must login to your {{this.newEos}} account
          .row.justify-center
            q-btn(color="green" @click="$root.$emit('scatterLogin')") Scatter Login
        div(v-else-if="scatterId.name != this.newEos")
          h6 You logged in as {{this.scatterId.name}}
          h6 You must login to your {{this.newEos}} account
          .row.justify-center
            q-btn(color="green" @click="$root.$emit('resetScatter')") Change Scatter Id
        div(v-else-if="true")
          h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Update Boid EOS Account
          .row.justify-center
            .col-8
              h6 EOS account found: 
              h5 {{scatterId.name}} 
              h6 Linking EOS account to your Boid account...
            //- .col.relative-position
            //-   q-spinner-ball.absolute-center(size="60px" color="blue")
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
    console.log('execute account change')
    newData.requestId = v.requestId
    if(true){
      v.pending = true
      const finished = await v.$api.executeAccountUpdateRequest(newData)
      v.pending = false
      if(!finished) return alert('there was a problem')
      else if (finished.invalid) {
        Toast.create.negative(finished.invalid)
        v.$router.replace('/')
      }
      else if (finished.success === true){
        v.finished = true
        v.finishedMessage = finished.message
        // Toast.create.positive(finished.message)
        // v.$router.replace('/')
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
      finished:false,
      finishedMessage:"h there dkdksl dkf dkd ",
      changeExecuted:false,
      requestId:null,
      scatterId:null,
      scatterAuth:null,
      changeType:"",
      newEmail:"",
      newEos:"",
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
    if (!this.requestId) this.requestId = this.$route.params.requestId
    this.$root.$on('scatterAuth',(data)=>{
      console.log('got ScatterAuth',data)
      this.scatterAuth = data
    })
    this.$root.$on('scatterId',(data)=>{
      this.scatterId = data
    })

  },
  methods:{
    async getScatterId(){
      if (!window.scatter) return
      const result = await window.scatter.getIdentity({ accounts: [window.network] })
      this.scatterId = result
      return result
      console.log(result)
    },
    executeAccountChange,
    finishBtn(){
      if (this.changeType === "EOS" ) this.$router.replace('/')
      else{
        this.$e.$emit('logout')
        setTimeout(()=>{
          this.$router.replace('/')
        },500)
        setTimeout(()=>{
          this.$e.$emit('openAuthModal')
        },1500)
      }
      
    },
    async verifyEosAccount(){
      this.pending = true
      console.log('requestScatterAuth')
      this.$root.$emit('requestScatterAuth',this.requestId.substring(0,12),'boid',this.scatterId.publicKey)
      console.log('we are here')
      this.$once('scatterAuthRdy',()=>{
        console.log('execute')
        executeAccountChange(this,{scatterAuth:this.scatterAuth, pubKey:this.scatterId.publicKey})
      })
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
        console.log('we are here')
        const accountChangeRequest = await this.$api.getAccountUpdateRequest({requestId:this.requestId})
        this.pending = false
        console.log(accountChangeRequest)
        if (!accountChangeRequest) alert('error retreiving Account Change Request')
        else if(accountChangeRequest.invalid){
          Toast.create.negative(accountChangeRequest.invalid)
          this.$router.push('/')
          return
        }
        this.changeType = accountChangeRequest.type
        this.newEmail = accountChangeRequest.newEmail
        this.newEos = accountChangeRequest.newEos
        if (accountChangeRequest.type === 'EMAIL'){
          executeAccountChange(this,{email:true})
        }
        if (accountChangeRequest.type === 'EOS'){
          if (!this.scatterId){
            setTimeout(()=>{
              if (!this.scatterId){
                this.$root.$emit('scatterLogin')
              }
            },2000)
          }
        }
      } catch (error) {
        this.$router.replace('/')
        alert(error.message)
      }
    },
    scatterId: async function(){
      if (!this.scatterId) return
      console.log('got Scatterid')
      console.log(this.changeType)
      if (this.changeType === 'EOS' && this.scatterId.name === this.newEos) this.verifyEosAccount()
    },
    scatterAuth(){
      if (!this.scatterAuth) alert('scatter auth error')
      console.log('got scatter auth')
      this.$emit('scatterAuthRdy')
    },
    pending: async function(){

    }
  }
}
</script>