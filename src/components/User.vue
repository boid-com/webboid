<template lang="pug">
.layout-padding
  big.thin-paragraph(v-if="myProfile") My Profile
  big.thin-paragraph(v-else) User Profile
  //- | {{thatUser.username}}
  .row.gutter
    .col-3
      q-card.animate-scale.relative-position(v-if="thatUser.powerRatings")
        p.light-paragraph.text-center Power Rating
        div(style="margin:auto;")
          p.text-center {{parseInt(thatUser.powerRatings[0].power)}}
            q-icon.text-center(color="yellow" name='flash_on' style="font-size:50px;")
      q-card.animate-scale.relative-position
        div.light-paragraph.text-center My Team
        table.q-table(style="width:100%")
          tbody()
            tr
              td 
                img.tokenimg(:src="thisUser.team.image")
              td {{thisUser.team.name}}
        q-btn.full-width(color="blue" outline @click="openURL(thisUser.team.meta.social.telegram)")
          | Telegram Chat
    .col
      q-card.relative-position.layout-padding(style="min-width:300px")
        h5.text-center {{thatUser.username}}
        .layout-padding.full-width.relative-position(style="height:140px;")
          img.avatar.absolute-center.block(style="width:120px; height:120px;" :src="thatUser.image")
        .tagline(v-if="thatUser.tagline")
          h6.light-paragraph.text-center {{thatUser.tagline}}
        .tagline(v-else-if="myProfile")
          h6.light-paragraph.text-center add a cool tagline here
        br
        br
        .layout-padding(v-if="myProfile").relative-position
          q-btn.full-width.absolute-center(color='blue' @click="$e.$emit('openProfileEditModal')") Update Profile
  .row.justify-center.gutter
    .layout-padding(v-if="!authenticated")
      h5.text-center.light-paragraph.animate-spin You Are Invited!!!!
      .layout-padding
        br
        br
        br
        q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal')") Join Boid



  //- img.avatar.text-center(v-else :src="thisUser.image")


  
</template>

<script>
import profileEdit from "@/ProfileEdit"

export default {
  name: 'index',
  data () {
    return {
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

    }

  },
  created(){
  },
  props:['thisUser','thatUser','api','authenticated'],
  components:{profileEdit}
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
