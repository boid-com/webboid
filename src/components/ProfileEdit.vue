<template lang="pug">
.layout-padding.relative-position
  q-transition(        
  appear
  enter="fadeIn"
  leave="fadeOut")
    div
      h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Update Profile
      .layout-padding.full-width.relative-position(style="height:140px;")
        img.avatar.absolute-center.block(v-if="$v.form.imageURL.$invalid || form.imageURL === '' " style="width:120px; height:120px;" :src="thisUser.image")
        img.avatar.absolute-center.block(v-else style="width:120px; height:120px;" :src="form.imageURL")
      h5.text-center(v-if="!rdy && !$v.form.$pending || form.username === '' ") {{thisUser.username}}
      h5.text-center(v-else) {{form.username}}
      .tagline(v-if="thisUser.tagline || form.tagline != ''")
        h6.light-paragraph.text-center(v-if="form.tagline === '' ") {{thisUser.tagline}}
        h6.light-paragraph.text-center(v-else) {{form.tagline}}

      br
      div
        q-input(
          v-model.trim="form.imageURL"
          @input="$v.form.imageURL.$touch()"
          :error="$v.form.imageURL.$error"
          stack-label="Profile Image URL"
          type="text"
          :placeholder="thisUser.image"
        )
        p.text-red.inline(v-if="$v.form.imageURL.$error") Image URL needs to be valid (.jpg .png .svg)
        br
        q-field(:count="15")
          q-input(
            stack-label="username"
            @input="$v.form.username.$touch()"
            type="text"
            v-model.trim="form.username"
            :error="$v.form.username.$error"
            :placeholder="thisUser.username"
            :max-length="15"
            :loading="this.$v.form.$pending"
          )
          div.text-red.float-left(v-if="$v.form.username.$error" style="padding-top:5px") Username already claimed
          small.thin-paragraph.float-left(v-else) Changing your username will change your invite link
        br
        q-field(:count="50")
          q-input(
            stack-label="tagline"
            type="text"
            v-model.trim="form.tagline"
            :placeholder="thisUser.tagline"
            :max-length="50"
          )
          small.thin-paragraph.float-left Your tagline appears under your name in leaderboards
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

import isImageUrl from 'is-image-url'

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
        imageURL: { checkImage: function(value){
          if (value === '') return true
          else return isImageUrl(value) 
          }
        },
        username: {     
          checkUsername: async function(value){
            if (value === '') return true
            var result = (await this.api.user.checkValidUsername(value))
            return !result
          }
        }
      }
  },
  computed: {
    rdy() {
      if ((this.form.username==="" && this.form.imageURL === ""  && this.form.tagline === "") || this.$v.form.$invalid){
        return false
      } else return true
    }
  },
  methods: {
    init: async function() {
      this.form.imageURL = ""
      this.form.username = ""
      this.form.tagline = ""
    },
    submit: async function() {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        Toast.create("Please review fields again.")
        return
      }
      this.pending = true
      
      var params = {}

      params.userId = this.thisUser.id
      
      if (this.form.username != '') params.username = this.form.username
      if (this.form.imageURL != '') params.imageURL = this.form.imageURL 
      if (this.form.tagline != '') params.tagline = this.form.tagline
      
      var result = (await this.api.user.updateProfile(params))
      console.log(result)

      if (result.error){
        Toast.create.negative(result.error)
        setTimeout(()=>{
          this.pending=false
        },1500)
      } else{
        this.$e.$emit('refreshUser')
        this.$e.$emit('userUpdated')
        setTimeout(()=>{
          this.pending=false
          this.thisModal.close()
        },1000)

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
    "form.username": function(val){
      if(val.split(" ").length > 1){
        this.form.username = val.split(" ").join('')
      }
      // if (val === this.thisUser.username) this.form.username = "",this.$v.form.imageURL.$reset()
      // this.form.username = this.form.username.toLowerCase()
    },
    "form.imageURL":function(val){
      if (val==="") this.$v.form.imageURL.$reset()
    }
    
  }

}
</script>

<style lang="stylus">
@import '~variables'

.q-field-label
  color black
.tagline
  padding 10px 
  background-color $grey-2
  border-radius 10px

</style>
