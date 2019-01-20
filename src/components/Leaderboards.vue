<template lang="pug">
div
  .row.justify-center
    .col-xs-12
      q-card(v-if="globalStats") 
        p.light-paragraph.text-center Network Stats
        .row.justify-center
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{parseInt(globalStats.dPower).toLocaleString()}}
              p.light-paragraph.text-center Total Power
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{globalStats.activeUsers}}
              p.light-paragraph.text-center Active Users
          .col-auto
            div(style="width:200px;")
              .row.justify-center
                h5 {{parseInt(globalStats.averagePower).toLocaleString()}}
              p.light-paragraph.text-center Average Power 
  .row.justify-center.full-width
    .col-md-12.col-lg-6
      q-card.animate-scale
        p.light-paragraph.text-center Top Users
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th 
              th.relative-position(style="width:50px;") 
                q-tooltip User Boid Power
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
          tbody(v-for="(user,index) in leaderboard" :key="user.id")
            tr.user(style="cursor: pointer;" @click="$router.push({name:'User',params:{username:user.username}})")
              td.relative-position
                .absolute-left.text-grey-7 {{index + 1}}
                .row
                  .col-auto
                    img.avatar(:src="user.image")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
    .col-md-12.col-lg-6
      q-card.animate-scale
        p.light-paragraph.text-center Top Teams
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th(style="width:0px;")
              th.relative-position(style="width:50px;") 
                q-tooltip Team Boid Power
                img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
          tbody(v-for="(team,index) in teamLeaderboard" :key="team.id")
            tr.user.cursor-pointer(@click="$router.push({name:'Team',params:{teamname:team.name}})")
              td.relative-position
                .absolute-left.text-grey-7 {{index + 1}}
                .row
                  .col-auto
                    img.tokenimg(:src="team.image")
                  .col(style="padding:15px;")
                    .ellipsis(style="max-width:100%;") {{team.name | removeDash}}
              td(data-th="Power") {{parseInt(team.power)}}

</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      team: {}
    }
  },
  computed: {},
  methods: {},
  watch: {
    team(val) {
      console.log('gotTeam', val)
    }
  },
  created() {
    this.$e.$on('team', team => {
      this.team = team
    })
  },
  props: ['thisUser', 'api', 'authenticated', 'leaderboard', 'teamLeaderboard','globalStats','tiersLeaderboard']
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
  background-color: $grey-2
}
</style>
