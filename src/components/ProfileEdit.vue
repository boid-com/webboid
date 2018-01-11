<template lang="pug">
.layout-padding.relative-position
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    div
      h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Update Profile
      .layout-padding.full-width.relative-position(style="height:140px;")
        img.avatar.absolute-center.block(style="width:120px; height:120px;" :src="thisUser.image")
      h5.text-center {{thisUser.username}}
      h5.light-paragraph {{thisUser.tagline}}
      br
      div
        q-input(
          v-model="form.imageURL"
          @input="$v.form.imageURL.$touch()"
          :error="$v.form.imageURL.$error"
          stack-label="Profile Image URL"
          type="text"
          :placeholder="thisUser.image"
        )
        p.text-red.inline(v-if="$v.form.imageURL.$error") Image URL needs to be valid (.jpg .png .svg)
        p.light-paragraph Changing your username changes your sharing URL
        q-input(
          @input="$v.form.username.$touch()"
          stack-label="username"
          type="text"
          v-model="form.username"
          :error="$v.form.username.$error"
          :placeholder="thisUser.username"
        )
        p.text-red.inline(v-if="$v.form.username.$error") Username already claimed
        br
      div.text-center(style="margin-top:10px;")
          q-btn.text-center(@click="thisModal.close()" style="margin-auto" invert color="red") cancel
          q-btn.text-center.on-right(@click="submit" style="margin-auto" :disabled="!rdy" invert  color="green") Update

      q-inner-loading(:visible="pending")
        q-spinner-ball(size="70px" color="blue")

</template>

<script>
import { required, email, minLength,url } from "vuelidate/lib/validators"
import { Toast } from "quasar"

export default {
  data() {
    return {
      form: {
        imageURL:"",
        username:"",
        tagline:""
      },
      pending:false
    }
  },
  validations: {
      form: {
        imageURL: { url },
        username: {     checkUsername: async function(value){
      if (value === '') return true
      var result = (await this.api.user.checkValidUsername(value))
      return !result
    }}
      }
  },
  computed: {
    rdy() {
      if ((this.form.username==="" && this.form.imageURL === "") || this.$v.form.$invalid){
        return false
      } else return true
    }
  },
  methods: {
    init: async function() {
      this.form.imageURL = ""
      this.form.username = ""
    },
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
      // Update user Info Here

      
    }
    }
  },
  props: ["thisUser","api", "thisModal"],
  created() {
    this.$e.$on("openProfileEditModal",()=>{
      this.init()
      this.$v.form.$reset
    })
  },
  watch:{
    "$v.form.$invalid"(){
      console.log('ok')
    }

  }

}
</script>

<style lang="stylus">

</style>
