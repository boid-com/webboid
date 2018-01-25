<template lang="pug">
.layout-padding()
  .layout-padding.full-width(v-if=("!authenticated") style="min-height=300px;")
    .row.justify-center.gutter
      q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal',true)") Join US
  .row.gutter.justify-center
    .col
      q-card.animate-scale.relative-position(style="min-width:300px")
        .layout-padding.full-width.relative-position(style="height:140px;")
          img.absolute-center.block(style="width:120px; height:120px;" :src="team.image")
        h5.text-center {{team.name | removeDash}}
        h6.light-paragraph.text-center {{team.tagline}}
        br
  .row.gutter.justify-center.items-stretch
      q-card.animate-scale(style="min-width:70px;")
        //- p.light-paragraph.text-center Power
        div.relative-position(style="margin:auto; margin-top:30px")
          p.text-center(style="z-index:5;") {{parseInt(team.power)}}
            q-icon.text-center.absolute-center(color="yellow-3" name='flash_on' style="font-size:70px; z-index:-4") 
      q-card.animate-scale(style="min-width:70px;")
        //- p.light-paragraph.text-center Members
        div.relative-position(style="margin:auto; margin-top:30px")
          p.text-center(style="z-index:5;") {{parseInt(team._membersMeta.count)}}
            q-icon.text-center.absolute-center(color="green-1" name='fa-users' style="font-size:50px; z-index:-4;")
      q-card(v-if="team.owner")
        p.light-paragraph.text-center Manager
        q-item(highlight :to="{name:'User',params:{username:team.owner.username}}")
          q-item-side(:avatar="team.owner.image")
          q-item-main
            q-item-tile(label) {{team.owner.username}}
            q-item-tile(sublabel) {{team.owner.tagline}}
          q-item-side(right icon="flash_on" stamp="") 
            small.text-center {{parseInt(team.owner.powerRatings[0].power)}}
  .row.gutter.justify-center
    .col
      q-card.animate-scale
        p.light-paragraph.text-center Top Users on {{team.name | removeDash}}
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th 
              th Username
              th Power
                q-icon(name="flash_on" color="yellow")
              th Rank
          tbody(v-for="(user,index) in leaderboard" :key="user.id")
            tr.user.cursor-pointer(@click="$router.push({name:'User',params:{username:user.username}})")
              td 
                img.avatar(:src="user.image")
              td.ellipsis(style="max-width:20px;" data-th="Username") {{user.username}}
                small.block.light-paragraph {{user.tagline}}
              td(data-th="Power") {{parseInt(user.power)}}
              td {{index + 1}}
  .row.justify-center.gutter
    .layout-padding(v-if="!authenticated")
      .layout-padding
        q-btn( big rounded push glossy color="green" style="font-size:35px;" @click="$e.$emit('openAuthModal')") Join US

</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      team: {
        _membersMeta: {
          count: 0
        },
        owner: {
          image: '',
          username: 'placeholder',
          tagline: '',
          powerRatings: [
            {
              power: 0
            }
          ]
        }
      },
      leaderboard: []
    }
  },
  computed: {},
  methods: {
    setupLeaderboard: async function() {
      this.leaderboard = await this.api.leaderboard.global(this.team.id)
      console.log('Team Leaderboard:', this.leaderboard)
    }
  },
  watch: {
    team(val) {
      console.log('gotTeam', val)
    }
  },
  created() {
    this.$e.$on('team', team => {
      this.team = team
      this.setupLeaderboard()
    })
  },
  props: ['thisUser', 'api', 'authenticated']
}
</script>
<style lang="stylus">
@import '~variables'
.q-card {
  padding: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);
}
.tokenimg{
  width:50px;
}
.user:hover {
  background-color: $grey-2;
}
</style>
