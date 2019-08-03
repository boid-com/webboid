<template lang="pug">
  q-modal( style="overflow:hidden;" ref="modal" @open="showOlark(false)" @close="showOlark(true)" :no-backdrop-dismiss="true").no-scroll
    div(style="margin:20px; min-content:800px; height:95%; overflow:hidden;").relative-position.no-scroll
      q-btn.absolute-right(big flat round color="red-5" style="top:-10px;" @click="$refs.modal.close()" :disabled="accountCreating")
        q-icon(name="close")
      div
        h4.text-blue Create EOS Account &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
      div(v-if="page==1")
        div
          div.strong Choose your EOS Account name.
        div.relative-position
          .row.no-padding
            .col-5
              q-input(
                type="text"
                @keyup.enter="submit(form.username)"
                v-model.trim="form.username"
                :error="errormsgB"
                placeholder="placeholder"
                :max-length="12"
                :loading="checkName")
            div.absolute-right(style="margin-top:20px; z-index:100;").bg-white
              q-btn(small @click="randomName()") randomize
                q-icon.on-right(name="refresh")
          .row(style="margin-bottom:10px;")
            div.text-red.float-left(v-if="errormsg" style="padding-top:5px") {{errormsg}}
        .row.full-width
          .col-10
            small.block Account name must be exactly 12 chararcters.
            small Account name can only contain lowercase letters and 0-5
          .col-2.relative-position
            div.full-width
              .absolute-center
                div {{form.username.length || 0}}/12
        //- div(style="margin-top:20px;")
        //-   div.strong Choose your Vote Proxy
        //-   small You can change your vote at any time later.
        //- div(style="padding:20px;")
        //-   div(style="padding-bottom:20px;")
        //-     q-radio(v-model="form.proxyVote" val="boidcomproxy").full-width
        //-       .row
        //-         .col
        //-           .on-right boidcomproxy 
        //-         .col
        //-           .on-right.text-green.strong (Recommended)
        //-     small Learn more at vote.boid.com
        //-   div
        //-     q-radio(v-model="form.proxyVote" val="custom" label="Select my own proxy" )
        //-     div(v-if="form.proxyVote === 'custom'")
        //-       .row.justify-center
        //-         .col-10
        //-           q-input(placeholder="Vote Proxy Name" v-model="form.customProxy" style="padding-top:0px;")
        //-   q-radio(v-model="form.proxyVote" val="null" style="padding-top:20px;")
        //-     .row
        //-       .col-auto
        //-         .on-right I'll vote manually 
        //-       .col-auto
        //-         .on-right.text-red.strong (Advanced)
        div(style="height:70px;")
        div.absolute-bottom(style="margin:10px;")
          .row.justify-center
            q-btn(@click="submit(form.username)" color="blue") Continue
      div(v-if="page==2")
        div
          p.strong Input your account public keys
        div(style="max-height:500px; overflow:auto; grid-template-columns: fit-content(500px) fit-content(500px) 1fr;")
          div
            small Owner Public Key
            q-input(
              type="text"
              v-model.trim="form.keys.owner"
              :error="errormsgB"
              placeholder="Required"
              :max-length="53"
            )
            .row(style="margin-bottom:10px;")
              div.text-red.float-left(v-if="errormsg" style="padding-top:5px") {{errormsg}}
          div
            small Active Public Key
            q-input(
              type="text"
              v-model.trim="form.keys.active"
              :error="errormsgB2"
              placeholder="Optional"
              :max-length="53"
            )
            .row(style="margin-bottom:10px;")
              div.text-red.float-left(v-if="errormsg2" style="padding-top:5px") {{errormsg2}}
          //- div
          //-   small Vote Public Key
          //-   q-input(
          //-     type="text"
          //-     v-model.trim="form.keys.vote"
          //-     :error="errormsgB3"
          //-     placeholder="Optional"
          //-     :max-length="53"
          //-   )
          //-   .row(style="margin-bottom:10px;")
          //-     div.text-red.float-left(v-if="errormsg3" style="padding-top:5px") {{errormsg3}}
          div(style="padding:20px;")
            p.light-paragraph.text-center How to generate Account Keys
            .row
              small Online
            a( target="_blank" href="https://eosauthority.com/generate_eos_private_key") EOS Authority Key Generator
            .row
              small EOS Wallet
            a( target="_blank" href="https://get-scatter.com/") Scatter
        div(style="height:70px;")
        div.absolute-bottom
          .row.justify-center(style="margin:10px;")
            q-btn(@click="page = 1" flat) Back
            q-btn.on-right(color="blue" @click="checkKeys()" :disabled="!validKeys") Continue
        
      div(v-if="page==3")
        div
          p.strong Final Confirmation
        div(style="max-height:500px; overflow:auto;")
          div
            q-card(style="padding:20px;")
              p.light-paragraph.text-center New EOS Account
              .row
                .col-auto
                  small Account Name
                .col-auto 
                  p.on-right {{form.username}}
              .row
                .col 
                  small Owner Key:
                .col-9 
                  textarea.full-width(readonly style="user-select:all; font-size:12px;") {{form.keys.owner}}
              .row(v-if="form.keys.active")
                .col 
                  small Active Key:
                .col-9 
                  textarea.full-width(readonly style="user-select:all;font-size:12px;") {{form.keys.active}}
              //- .row(v-if="form.keys.vote")
              //-   .col 
              //-     small Vote Key:
              //-   .col-9  
              //-     textarea.full-width(readonly style="height:67px;") {{form.keys.vote}}
              div(style="padding-top:10px;")
                .row
                  .col
                    small Account Creation Cost: 
                  .col
                    p {{$parent.format($parent.boidCost)}} BOID
                .row
                  .col
                    small User Pending Balance:
                  .col
                    p {{$parent.format($parent.userPending)}} BOID
                .row
                  .col
                    small Remaining balance:
                  .col
                    p {{$parent.format($parent.boidCost - $parent.userPending)}} BOID
                div(style="max-width:300px;")
                  small Remaining balance will be automatically sent to your new EOS account after the account is created.
          q-card.bg-red.text-white
            .row
              .col-2.relative-position
                .absolute-center
                  q-icon(name="warning" size="50px;")
              .col
                q-field( style="padding:10px;" color="white" inverted )
                  q-checkbox(v-model="form.confirmed" label="I have saved and backed up my private keys." color="white")
                  .row
                    small(style="padding:10px; max-width:350px;") Make sure you understand proper key management. Your account is not recoverable if you lose access to your keys.
        div(style="height:70px;")
        div.absolute-bottom(style="bottom:20px;")
          .row.justify-center
            q-btn(@click="page = 2" flat ) Back
            q-btn.on-right(@click="createAccount()" color="blue" :disabled="!form.confirmed" ) Create Account
      div(v-if="page==4" style="overflow:hidden;")
        div(style="height:500px; overflow:hidden;")
          div(v-if="accountCreating" style="margin-top:100px;").relative-position
            q-spinner-ball.absolute-center(size="60px" color="blue" style="margin-top:-10px;")
            h4.absolute-center(style="margin-top:150px;").text-blue.full-width.text-center Creating Account...
              div(style="padding:20px;").text-grey-8.user-select
                .row.justify-center
                  small creation ID
                .row.justify-center
                  small(readonly style="user-select:all;") {{creationID}}
          div(v-else-if="accountCreateError" style="margin-top:100px;").relative-position
            q-icon.absolute-center(size="60px" color="red" name="close" style="margin-top:-10px;")
            h4.absolute-center(style="margin-top:160px;").text-red.full-width.text-center Error
              div(style="padding-top:20px;").full-width
                p.text-black {{creationState.errorMessage}}
              div(style="padding:20px;").text-grey-8.user-select
                .row.justify-center
                  small creation ID
                .row.justify-center
                  small(readonly style="user-select:all;") {{creationID}}
                .row.justify-center
                  small Contact us
                .row.justify-center
                  small(readonly style="user-select:all;") support@boid.com
          div(v-else style="margin-top:100px;").relative-position
            q-icon.absolute-center(size="60px" color="green" name="check" style="margin-top:-10px;")
            h4.absolute-center(style="margin-top:170px;").text-green.full-width.text-center Account Created
              div(style="padding-top:20px;").full-width
                p.text-black Your account is now live on the EOS blockchain and linked to your Boid account. Earned BOID tokens will automatically be sent to your new EOS account.
              div(style="padding:20px;").text-grey-8.user-select
                .row.justify-center
                  small Account
                .row.justify-center
                  a(target="_blank" :href="accountURL") {{form.username}}
              div(style="padding-top:5px;").full-width
                p.text-black Download #[a(target="_blank" href="https://get-scatter.com" ) Scatter Wallet] 
            
          div.absolute-bottom(style="margin:20px;")
            .row.justify-center
              q-btn.on-right(@click="$refs.modal.close()" color="blue" :disabled="accountCreating") Continue
</template>

<script>
import { required,minLength } from "vuelidate/lib/validators"
var randomstring = require("randomstring")
function validateKey(key){
  if (key.length!= 53) return false
  if (key.search('EOS[a-zA-Z0-9]{50}') > -1) return true
  else return false
}

function setupDebug(v){
  // v.page = 3
  v.form.username = "waccountname"
  v.form.keys.owner = 'EOS8HuvjfQeUS7tMdHPPrkTFMnEP7nr6oivvuJyNcvW9Sx5MxJSkZ'
}


export default {
  data(){
    return {
      creationID:null,
      creationState:null,
      accountCreatedMsg:null,
      accountCreating:false,
      accountCreateError:false,
      checkName:false,
      page:1,
      errormsg:null,
      errormsg2:null,
      errormsg3:null,
      errormsgB:false,
      errormsgB2:false,
      errormsgB3:false,
      validKeys:false,
      form: {
        customProxy:null,
        keys:{
          owner:null,
          active:null,
          vote:null
        },
        proxyVote:"boidcomproxy",
        username:"",
        confirmed:false
      }
    }
  },
  computed:{
    accountURL(){if (this.form.username) return "https://bloks.io/account/"+this.form.username}
  },
  mounted(){
    // setupDebug(this)
  },
  methods:{
    randomName(){
      const rand = randomstring.generate({length:20})
      .toLowerCase().split("")
      .filter(el => {
        const result = el.search('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)')
        if (result != 0) return false
        else return true
        }).join("")
      console.log(rand)
      this.form.username = rand.substring(0,12)

    },
    showOlark:window.showOlark,
    async createAccount(){
      this.page = 4
      this.accountCreating = true
      const jobID = await this.$api.initializeEOSAccountCreationJob({form:this.form,createStats:this.$parent.createStats})
      this.creationID = jobID
      const checkStatus = setInterval(async () => {
        this.creationState = await this.$api.getAccountCreateJob({jobID})
        console.log(this.creationState)
        if (this.creationState.errorMessage){
          this.$e.emit('refreshUser')
          clearInterval(checkStatus)
          this.accountCreating = false
          this.accountCreateError = true
          // alert(this.creationState.errorMessage)
        }
        else if(this.creationState.executed){
          this.$e.emit('refreshUser')
          clearInterval(checkStatus)
          this.accountCreating = false
          this.accountCreateError = false
        }
      }, 2000)
    },
    async submit(username){
      const valid = username.search('(^[a-z1-5.]{0,11}[a-z1-5]$)|(^[a-z1-5.]{12}[a-j1-5]$)')
      if (valid != 0) return this.errormsg = "Invalid EOS Account Name"
      if (username.length != 12) return this.errormsg = "Account Name must be exactly 12 characters"
      try {
        this.checkName = true
        const checkExisting = await window.eosjs.rpc.get_account(this.form.username)
        if (checkExisting) {
          this.checkName = false
          return this.errormsg = "Account name is already taken"}
      } catch (error) {
        this.checkName = false
        this.errormsg = null
        this.page = 2
      }
    },
    async checkKeys(){
      if (!this.form.keys.owner) return this.errormsg = "Owner Key is required"
      if (!validateKey(this.form.keys.owner)) return this.errormsg = "Invalid Owner Key"
      if (this.form.keys.active) {
        if (!validateKey(this.form.keys.active)) {
          return this.errormsg2 = "Invalid Active Key"
        }
      }
      if (this.form.keys.vote) {
        if (!validateKey(this.form.keys.vote)) {
          return this.errormsg3 = "Invalid Vote Key"
        }
      }
      this.page = 3
    }
  },
  watch:{
    'form.proxyVote'(val){
      if (val != 'custom') this.form.customProxy = null
    },
    'form.username'(val){
      if (val.length < 12) this.errormsg = null
    },
    'form.keys.owner'(val){
      if (val.length === 0) this.errormsg = null
      if (validateKey(val)) this.validKeys = true
      else this.validKeys = false
    },
    'form.keys.active'(val){
      if (!val) return this.errormsg2 = null
      if (val.length === 0) {
        this.errormsg2 = null
        this.form.keys.active = null
      }
    },
    'form.keys.vote'(val){
      if (!val) return this.errormsg3 = null
      if (val.length === 0) {
        this.form.keys.vote = null
        this.errormsg3 = null
        }
    },
    errormsg(val){
      if (val) return this.errormsgB = true
      else this.errormsgB = false
    },
    errormsg2(val){
      if (val) return this.errormsgB2 = true
      else this.errormsgB2 = false
    },
    errormsg3(val){
      if (val) return this.errormsgB3 = true
      else this.errormsgB3 = false
    }
  }
}
</script>
<style lang="stylus" scoped>
  div.modal-content.scroll
    overflow hidden !important
  .q-if
    padding-top:0px;
  input.q-input-target
    height 30px !important
</style>

