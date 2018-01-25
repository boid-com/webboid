<template lang="pug">
.layout-padding(v-if="thatUser.id")
  .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
    .row.justify-center.gutter
      q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal',true)") Join Boid
  .row.row-gutter
    .col
      q-card.animate-scale.relative-position(style="min-width:300px")
        .layout-padding.full-width.relative-position(style="height:140px;")
          img.avatar.absolute-center.block( v-if="myProfile" style="width:120px; height:120px;" :src="thisUser.image")
          img.avatar.absolute-center.block(v-else style="width:120px; height:120px;" :src="thatUser.image")
        h5.text-center(v-if="myProfile") {{thisUser.username}}
        h5.text-center(v-else) {{thatUser.username}}
        div(v-if="!myProfile")
          .tagline(v-if="thatUser.tagline")
            h6.light-paragraph.text-center {{thatUser.tagline}}
          .tagline(v-else-if="myProfile")
            h6.light-paragraph.text-center add a cool tagline here
        div(v-else)
          .tagline(v-if="thisUser.tagline")
            h6.light-paragraph.text-center {{thisUser.tagline}}
      div(v-if="myProfile" style="margin:8px; margin-bottom:0px;")
        q-btn.full-width(color='blue' @click="$e.$emit('openProfileEditModal')") Update Profile
      .row
        q-card.animate-scale.relative-position(v-if="thatUser.powerRatings")
          p.light-paragraph.text-center Power Rating
          div(style="margin:auto;")
            p.text-center {{parseInt(thatUser.powerRatings[0].power)}}
              q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
              
        q-card.animate-scale.relative-position(v-if="thatUser.powerRatings")
          p.light-paragraph.text-center Social
          div(style="margin:auto;")
            h5.text-center.light-paragraph {{thatUser._invitedMeta.count}}
            p.text-center Invited Users
          q-btn.full-width(v-if="myProfile" color="green" @click="$e.$emit('openSocialModal')")
                | Get Invite Link
        q-card.animate-scale.relative-position(v-if="thatUser.team")
          div.light-paragraph.text-center My Team
          table.q-table(style="width:100%")
            tbody()
              tr
                td 
                  img.tokenimg( :src="thatUser.team.image")
                td {{thatUser.team.name}}
          q-btn.full-width(v-if="thatUser.team.meta.social.telegram" color="blue" outline @click="openURL(thatUser.team.meta.social.telegram)")
            | Telegram Chat
          q-btn.full-width( v-if="thatUser.team.meta.social.facebook" color="blue" outline @click="openURL(thatUser.team.meta.social.facebook)")
            | Facebook Group
  .row.justify-center.gutter
    .layout-padding(v-if="!authenticated")
      .layout-padding

        q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal')") Join Boid

</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'index',
  data () {
    return {
      openURL
    }
  },
  computed: {
    myProfile: function(){
      if (this.thisUser && this.thatUser){
        return this.thisUser.id === this.thatUser.id
      }else return false
    }
  },
  methods: {

  },
  watch:{
    'thatUser'(){
          console.log('thatUser',this.thatUser)

    },
    "thisUser":function(val,oldVal){
      if ((val.username != oldVal.username) && this.myProfile && this.$route.params.username){
        setTimeout(()=>{
          this.$router.push({name:"User",params:{username:this.thisUser.username}})
        },1000)
      }
    }

  },
  created(){
    this.$e.$on('userUpdated',()=>{
      console.log('userUpdated',this.myProfile,this.$route.params.username)
    })
  },
  props:['thisUser','thatUser','api','authenticated'],
}
</script>

<style lang="stylus">
.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.tokenimg{
  width:50px;
}
</style>
