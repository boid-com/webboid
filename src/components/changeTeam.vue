<template lang="pug">
  div(style="padding:20px; max-width: 400px; min-width:350px; max-height:100%;").relative-position
    h4.light-paragraph.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:35px;") Change Teams
    div(v-if="!canChangeTeams")
      h6 You can only change teams once every 48 hours.
      h6 You can next change teams at 
      h5 {{nextChangeDate}}
      br
      br
      q-btn.on-right(outline color="grey-8" @click="$root.$emit('modal')") Back
    div(v-else-if="page==0")
      .small.text-grey-8.relative-position Your Current Team
        .small.text-grey-8.absolute-right earnings bonus
      q-card.teamCard
        .row
          .col-auto
            img(:src="thisUser.team.image")
          .col
            p.on-right {{thisUser.team.name | removeDash}}
          .col-3.relative-position
            p.absolute-center.text-green-8 {{percent(thisUser.team.bonus)}}
      br
      .small.text-grey-8.relative-position Joinable Teams
        .small.text-grey-8.absolute-right earnings bonus
      q-card(style="min-height:300px; max-height:300px; overflow:scroll;")
        q-card.teamCard.selectable.cursor-pointer(
          v-for="team of teamsList" :key="team.id" @click="selectedTeam = team"
          :class="{selected:team.selected}"
          )
          .row.no-pointer-events
            .col-auto
              img(:src="team.image")
            .col.relative-position
              .small.on-right(style="padding-top:5px;") {{team.name | removeDash}}
            .col-3.relative-position
              p.absolute-center.text-green-8 {{percent(team.bonus)}}
      div(style="height:50px;")
      div.absolute-bottom.relative-position(style="padding:20px;")
        q-btn.float-right(:disabled="!selectedTeam" color="blue" @click="page=1") Continue
        q-btn(outline color="grey-8" @click="$root.$emit('modal')") Cancel
    div(v-else)
      .small.text-grey-8.relative-position Your Selected Team
        .small.text-grey-8.absolute-right earnings bonus
      q-card.teamCard
        .row
          .col-auto
            img(:src="selectedTeam.image")
          .col.relative-position
            p.absolute-center {{selectedTeam.name | removeDash}}
          .col-3.relative-position
            p.absolute-center.text-green-8 {{percent(selectedTeam.bonus)}}
      br
      //- q-card(color="red-4")
      //-   .row
      //-     .col-auto
      //-       div
      //-         h2(style="margin:0px; padding-right:15px; padding-left:10px;") ! 
          //- .col 
          //-   p You can only change teams once every 48 hours. Changing teams during a season break does not impact your Boid Power.
      //- h6 Currently Boid Season 0 has not started, there is no Boid Power penalty for changing teams.
      //- h6 The next time you will be able to change teams again is
      h6 Some teams have ongoing promotions for long-running contributors.

      h6 Are you sure you want to change your team?
      .row.justify-center
        q-btn(color="green" @click="executeTeamChange(_self,selectedTeam)") Change Team     

      div(style="padding-top:40px;")
        q-btn(outline @click="page=0") < back
        q-btn.on-right(outline color="grey-8" @click="$root.$emit('modal')") Cancel

    
    q-inner-loading(:visible="pending")
      q-spinner-ball(size="70px" color="blue")
      

</template>
<style scoped lang="stylus">
@import '~variables'
.teamCard
  max-height 70px
img
  height 30px
.selectable:hover
  background-color $grey-3
.selected
  background-color $blue-2
.selected:hover
  background-color $blue-2


</style>

<script>
import { email,required, sameAs, minLength } from "vuelidate/lib/validators"
import { Toast } from 'quasar'

async function executeTeamChange(v,newTeam){
  try {
    console.log('execute team change')
      v.pending = true
      const finished = await v.$api.changeUserTeam(newTeam)
      v.pending = false
      if(!finished) return alert('there was a problem')
      else if (finished.invalid) {
        Toast.create.negative(finished.invalid)
        v.$router.replace('/')
        v.$e.$emit('refreshUser')
        v.$root.$emit('modal')
      }
      else if (finished.success === true){
        v.finished = true
        v.finishedMessage = finished.message
        Toast.create.positive(finished.message)
        v.$e.$emit('refreshUser')
        v.$root.$emit('modal')
        // v.$router.replace('/')
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
    pending:false,
    selectedTeam:null,
    page:0,
    teams:null
    }
  },
  async created(){

    this.teams = await this.$api.getTeams()
    console.log(this.teams)
  },
  methods:{
    executeTeamChange,
    percent(dec){
      if (!dec) return 0.0
      else return "+"+ (dec*100).toFixed(2) +"%" 
    }
  },
  computed:{
    teamsList(){
      if (!this.teams) return null
      return this.teams
      .filter( team => { return (team.id != this.thisUser.team.id && team.locked != true)})
      .sort((b,a) => a.bonus - b.bonus)
      .map(el => {
        if (this.selectedTeam && this.selectedTeam.id === el.id) el.selected = true
        else el.selected = false
        el.bonusDisplay = (el.bonus * 10).toFixed(2)
        return el
       })
      
    },
    canChangeTeams(){
      return true
      if (!this.thisUser.lastTeamChange) return true
      else return (Date.now() - Date.parse(this.thisUser.lastTeamChange)) > 172800000
    },
    nextChangeDate(){
      return new Date(Date.parse(this.thisUser.lastTeamChange) + 172800000).toLocaleString()
    }
  },
  props:['api','thisUser','authenticated','teamLeaderboard'],
  watch:{
    teams(data){
      this.pending = !data
    }
  }
}
</script>