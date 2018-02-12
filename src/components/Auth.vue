<template lang="pug">
.layout-padding.relative-position
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    div
      h3.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") boid
      h6.light-paragraph.text-center(style="margin-bottom:30px;") The Social Supercomputer
      h6.light-paragraph.text-center(style="margin-bottom:30px;" v-if="invitedByUser && registering") You were invited by 
        h6.text-center {{invitedByUser.username}}
      h6.light-paragraph.text-center(v-if="localAuth" style="margin-bottom:30px;") Desktop Application
      div
        q-input(
          v-model="form.email"
          @blur="$v.form.email.$touch"
          :error="$v.form.email.$error"
          stack-label="email"
          type="text"
        )
        q-input(
          stack-label="password"
          type="password"
          v-model="form.password"
          @blur="$v.form.password.$touch"
          :error="$v.form.password.$error"
        )
        p.float-left.text-red(v-if="$v.form.password.$error" color="red") Password should be longer
        br
        q-checkbox(v-model="rememberMe" label="remember me")
      br
      br
      div.text-center(style="margin-top:10px;")
          q-btn.text-center(@click="join" style="margin-auto" :disabled="!loginRdy" invert color="blue") register
          q-btn.text-center.on-right(@click="submit" style="margin-auto" :disabled="!loginRdy" invert  color="green" v-if="!registering") Login
      q-inner-loading(:visible="pending")
        q-spinner-ball(size="70px" color="blue")
    //- q-btn.float-left.on-left(@click="submit" outline color="blue") Register

</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import { Toast } from 'quasar'

export default {
  data() {
    return {
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
        if (this.localAuth) window.local.ipcRenderer.sendToHost('token', result)
        else {
          console.log('loginResult', result)
          var userData = await this.api.user.get(result.id)
          this.$emit('update:thisUser', userData)
          this.$emit('update:authenticated', true)
          this.pending = false
          this.thisModal.close()
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
    // console.log(window.local.device)

    if (window.local) {
      // window.local.ipcRenderer.sendToHost('user', 'USER WORKS')
      this.localAuth = true
      this.$e.$emit('logout')
      // var i = 0
      // window.local.ipcRenderer.on('deviceReadyAuth', (event, device) => {
      //   i += 1
      //   console.log(i, 'got Device in Auth Window')
      //   this.form.device = device
      //   console.log(JSON.stringify(this.form.device, null, 2))
      // })
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

    this.$e.$on('openAuthModal', (val) => {
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

</style>
