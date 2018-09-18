<template lang="pug">
.relative-position(style="padding:20px; overflow:hidden;")
  div.relative-position.q-pa-lg(style="min-height: 350px;")
    div
      h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") boid
      h6.text-weight-light.text-center(style="margin-bottom:30px;") The Social Supercomputer
      h6.text-weight-light.text-center(style="margin-bottom:30px;" v-if="invitedByUser && registering") You were invited by 
      div(v-if="confirmAccount")
        h6.text-weight-light.text-center(style="margin-bottom:30px;" ) You are linking your EOS account
          h4.text-black {{confirmAccount.accountName}}
      
    .row.justify-center
      h6.text-weight-light.q-mb-md.text-grey-9(v-if="!confirmAccount") Login / Register
    div(v-if="!emailForm")
      .row.justify-center(style="padding-top:30px")
        // .col-auto(v-for="login in socialLogins" :key="login.name")
          .row.justify-center
            .socialBtn(q-ripple @click="login.auth()")
              img.socialIcon(:src="login.icon")
      .row.justify-center(style="margin-top:20px")
        q-btn.full-width( round big flat color="grey-10" @click="emailForm = true" style="max-width: 270px" :disable="disableBtns")
          q-icon.on-left(name="mail" color="grey-7")
          | Email/password
    div(v-if="emailForm" style="padding-left:20px; padding-right: 20px;")
      div
        q-input(
          style="font-size: 20px;"
          v-model="form.email"
          @blur="$v.form.email.$touch"
          :error="$v.form.email.$error"
          stack-label="email"
          type="text"
          @keyup.enter="join"
        )
        .q-ma-lg
        q-input(
          style="font-size: 20px;"
          stack-label="password"
          type="password"
          v-model="form.password"
          @blur="$v.form.password.$touch"
          :error="$v.form.password.$error"
          @keyup.enter="join"
        )
        .col
          .row.justify-center.q-mt-sm(style="min-height:35px;")
            p.float-left.text-red(v-if="$v.form.password.$error" color="red") Password should be longer
          .row
            q-checkbox(v-if="!localAuth" v-model="rememberMe" label="remember me")
      br
      br
      div.text-center(style="margin-top:10px;")
          //- q-btn.text-center( big @click="emailForm = false" flat style="margin-auto" invert color="blue")
          //-   q-icon.on-left(name="arrow_back")
          //-   | Back 
          
          q-btn.text-center( v-if="!confirmAccount" big @click="join" style="margin-auto" :disabled="!loginRdy" invert color="green" size="lg") Go
            q-icon.on-right(name="arrow_forward")
          q-btn.text-center( v-else big @click="submit" style="margin-auto" :disabled="!loginRdy" invert color="green" size="lg") Confirm
            q-icon.on-right(name="arrow_forward")
    q-inner-loading(:visible="pending")
      q-spinner-ball(size="90px" color="blue")
    //- q-btn.float-left.on-left(@click="submit" outline color="blue") Register


</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { Toast } from 'quasar'
Toast.setDefaults({
  timeout: 10000,
})
export default {
  data() {
    return {
      confirmAccount:null,
      emailForm:false,
      disableBtns:false,
      socialLogins:[
        {
          name:'Google',
          icon:"https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          auth(){
            console.log('google Social Auth')
            }
        },
        {
          name: 'Twitter',
          icon: "https://upload.wikimedia.org/wikipedia/fr/c/c8/Twitter_Bird.svg",
          auth(){
            console.log('Twitter Social Auth')
          }
        },
        {
          name: 'Facebook',
          icon: "https://upload.wikimedia.org/wikipedia/commons/c/c2/F_icon.svg",
          auth(){
            console.log('Facebook Social Auth')
          }
        }
      ],
      modal: false,
      localAuth: false,
      form: {
        email: '',
        password: '',
        invitedById: null,
        device: null
      },
      pending: false,
      rememberMe: true,
      invitedByUser: null,
      registering: false
    }
  },
  validations: {
    form: {
      email: { required, email },
      password: { required, minLength: minLength(5) }
    }
  },
  computed: {
    loginRdy() {
      if (!this.$v.form.$error) {
        return true
      }
    }
  },
  methods: {
    submit: async function() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create('Please review fields again.')
        return
      }
      this.pending = true

      // delete this.form.invitedById
      var result = await this.api.auth.login(this.form)
      if (result.error) {
        Toast.create.negative(result.error)
        setTimeout(() => {
          this.pending = false
        }, 1500)
      } else {
        if (this.confirmAccount) this.$router.push('/')
        console.log('loginResult', result)
        var userData = await this.api.user.get(result.id).catch(console.log)
        this.$emit('update:thisUser', userData)
        this.$emit('update:authenticated', true)
        if (this.confirmAccount){
          var validateRequest = await this.api.auth.validatePayoutAccountRequest(this.confirmAccount.requestId).catch(console.log)
          console.log(validateRequest)
          this.pending = false
          if (validateRequest.error){
            Toast.create.negative(validateRequest.error)   
            this.confirmAccount = null       
          } 
          else{
            Toast.create.positive('EOS Account linked successfully')
            this.thisModal.close()
            this.$router.push('/')
            this.confirmAccount = null
            this.$e.$emit('refreshUser')
            this.$e.$emit('userUpdated')
            setTimeout(()=>{
              window.location.replace('https://app.boid.com')
            },3000)
          } 
        }else{
          this.thisModal.close()
        }
        this.pending = false
        if (this.localAuth) {
          window.local.ipcRenderer.sendToHost('token', result)
          window.local.ipcRenderer.sendToHost('user', userData)
          if (this.form.device) {
            console.log('ready to check user device!!!!!!', this.form.device)
          }
          // $router.push({name:'Team',params:{teamname:thisUser.team.name}})
        } 
      }
    },
    join: async function() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create('Please review fields again.')
        return
      }
      this.pending = true
      if (this.invitedByUser) this.form.invitedById = this.invitedByUser.id
      console.log('this form', this.form)
      var result = await this.api.auth.authenticateUser(this.form)
      console.log(result)
      if (result.error) {
        if (result.error.search('already registered') > -1){
          return this.submit()
        }
        Toast.create.negative(result.error)
        setTimeout(() => {
          this.pending = false
        }, 1500)
      } else {
        console.log('we are here')
        var userData = await this.api.user.get(result.id)
        this.$emit('update:thisUser', userData)
        this.$emit('update:authenticated', true)
        this.pending = false
        this.thisModal.close()
        this.$nextTick(function() {
          setTimeout(() => {
            this.$router.push('/')
          }, 1000)
          setTimeout(()=>{
            console.log('open nue modal')
            this.$root.$emit('modal.nue',true)
          },1000)
        })
      }
    },
    checkInvitedBy: async function() {
      console.log(this.$route)

      // var invitedBy = this.$route.params.username
      // if (invitedBy) var validUser = await this.api.user.getByUsername(invitedBy)
      // if (validUser){
      //   this.form.invitedById = validUser.id
      //   this.invitedByUser = validUser
      // }
      // this.$router.push("/")
    }
  },
  props: ['thisUser', 'authenticated', 'api', 'thisModal'],
  created: async function() {
    if (window.local) {
      console.log("FOUND WINDOW.LOCAL")
      this.localAuth = true
    }
    if (window.localStorage.getItem('rememberMe') === null) window.localStorage.setItem('rememberMe', 'true')
    else this.rememberMe = JSON.parse(window.localStorage.getItem('rememberMe'))
    var username = window.localStorage.getItem('invitedBy')
    if (username) {
      var user = await this.api.user.getByUsername(username)
      if (!user) return localStorage.removeItem('invitedBy')
      if (this.thisUser.id === user.id) return
      this.form.invitedById = user.id
      this.invitedByUser = user
    }

    this.$e.$on('openAuthModal', val => {
      console.log(val)
      this.pending = false
      this.form = {
        email: '',
        password: '',
        invitedById: null
      }
      this.$v.form.$reset()
      // this.registering = val
    })
  },
  watch: {
    rememberMe: function(value) {
      window.localStorage.setItem('rememberMe', value)
    },
    '$route.name'(name){
      if (name != 'confirmPayoutAccount') return
      this.emailForm = true
      this.confirmAccount = {
        requestId: this.$route.params.requestId,
        accountName: this.$route.params.accountName,
      }
    },
    'window.local'() {
      console.log(window.local)
    },
    '$route.params.username': async function(username) {
      if (!username) return
      var user = await this.api.user.getByUsername(username)
      if (!user) return this.$router.push('/')
      this.$e.$emit('thatUser', user)
      console.log('on User Page', user.username)
      // if (this.thisUser.id === user.id) return
      window.localStorage.setItem('invitedBy', user.username)
      this.form.invitedById = user.id
      this.invitedByUser = user
    },
    '$route.params.teamname': async function(teamname) {
      if (!teamname) return
      console.log('found Teamname', teamname)
      var team = await this.api.team.getByName(teamname)
      if (!team) return
      console.log(team)
      this.$e.$emit('team', team)
      if (!team.owner) return
      this.invitedByUser = team.owner
      this.form.invitedById = team.owner.id
      window.localStorage.setItem('invitedBy', team.owner.username)
    },
    'form.email'(val) {
      // console.log(this.$v.form.email.$error)
      // // if()
      // if (!val && this.form.email != "" ){
      //   console.log(this.form.email)
      // }
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
 
.socialBtn
  background-color white
  margin 5px
  padding 10px
  border-radius 100%
  height: 50px
  width: 50px
  drop-shadow: 0px 2px 5px black
  cursor: pointer
  transition background-color .4s
.socialBtn:hover
  background-color $grey-2
  box-shadow 0px 2px 1px $grey-5
input.q-input-target
  height: 40px;
  padding-top 5px

.socialIcon
  height: 70px
  width: 70px
  margin: 20px

.q-if
  padding 0px
  padding-top 5px

</style>
