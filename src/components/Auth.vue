<template lang="pug">
.layout-padding.relative-position
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    div
      h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") boid
      h6.light-paragraph.text-center(style="margin-bottom:30px;") The Social Supercomputer
      //- h6.light-paragraph Sign in 
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
          q-btn.text-center(@click="join" style="margin-auto" :disabled="!loginRdy" invert outline color="blue") Join
          q-btn.text-center.on-right(@click="submit" style="margin-auto" :disabled="!loginRdy" invert outline color="green") Login
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
        password: ""
      },
      pending:false,
      rememberMe:false
    }
  },
  validations: {
    form: {
      email: { required, email }
    }
  },
  computed: {
    ref() {
      console.log(this.$route.params.ref)
      return this.$route.params.ref
    },
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
    var result = await this.api.auth.login(this.form)


    if (result.error){
      Toast.create.negative(result.error)
      setTimeout(()=>{
        this.pending=false
      },1500)
    } else{
      this.$emit('update:authenticated',true)
      var userData = await this.api.user.get(result.id)
      this.$emit('update:thisUser',userData)
      this.pending = false
      this.form = {}
      this.thisModal.close()
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
      this.$emit('update:authenticated',true)
      var userData = await this.api.user.get(result.id)
      this.$emit('update:thisUser',userData)
      this.pending = false
      this.form = {}
      this.thisModal.close()
    }
    }
  },
  props: ["thisUser", "authenticated", "api", "thisModal"],
  mounted() {
    if (JSON.parse(window.localStorage.getItem('rememberMe'))) this.rememberMe = true
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
