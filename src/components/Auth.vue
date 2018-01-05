<template lang="pug">
.layout-padding.relative-position
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    div
      h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") boid
      h6.light-paragraph.text-center(style="margin-bottom:30px;") The Social Supercomputer
      h6.thin-paragraph.text-center(style="margin-bottom:30px;" v-if="invitedByUser") You were invited by: {{invitedByUser.username}}

      div(v-if="!registering")
        q-input(
          v-model="form.email"
          @blur="$v.form.email.$touch"
          @keyup.enter="submit"
          :error="$v.form.email.$error"
          stack-label="email"
          type="text"
        )
        q-input(
          stack-label="password"
          type="password"
          v-model="form.password"
          @keyup.enter="submit"
        )
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
import { required, email, minLength } from "vuelidate/lib/validators"
import { Toast } from "quasar"

export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        invitedById: null
      },
      pending:false,
      rememberMe:false,
      invitedByUser:null,
      registering:false
    }
  },
  validations: {
    form: {
      email: { required, email }
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
        Toast.create("Please review fields again.")
        return
      }
    this.pending = true
    
    delete this.form.invitedById
    var result = await this.api.auth.login(this.form)


    if (result.error){
      Toast.create.negative(result.error)
      setTimeout(()=>{
        this.pending=false
      },1500)
    } else{
      this.$router.push("/")
      console.log('loginResult',result)
      var userData = await this.api.user.get(result.id)
      this.$emit('update:thisUser',userData)
      this.$emit('update:authenticated',true)

    }
    },
    join: async function() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create("Please review fields again.")
        return
      }
    this.pending = true
    var result = await this.api.auth.authenticateUser(this.form)
    
    console.log(result)
    if (result.error){
      Toast.create.negative(result.error)
      setTimeout(()=>{
        this.pending=false
      },1500)
    }else{
      console.log('we are here')
      var userData = await this.api.user.get(result.id)
      this.$emit('update:thisUser',userData)
      this.$emit('update:authenticated',true)

      
    }
    },
    checkInvitedBy: async function(){
      var invitedBy = this.$route.params.username
      if (invitedBy) var validUser = await this.api.user.getByUsername(invitedBy)
      if (validUser){
        this.form.invitedById = validUser.id
        this.invitedByUser = validUser
      }
      this.$router.push("/")
    }
  },
  props: ["thisUser", "authenticated", "api", "thisModal"],
  mounted() {
    if (JSON.parse(window.localStorage.getItem('rememberMe'))) this.rememberMe = true
    console.log()
    setTimeout(()=>{
      this.checkInvitedBy()
    },1000)
  },
  watch:{
    rememberMe:function(value){
      window.localStorage.setItem('rememberMe',value)
    }

  }

}
</script>

<style lang="stylus">

</style>
