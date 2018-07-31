<template lang="pug">
.row.justify-center.full-width
  .col-md-12.col-lg-6
    q-card.animate-scale.full-wi
      p.light-paragraph.text-center Top Users
      table.q-table.horizontal-separator(style="width:100%")
        thead
          tr
            th 
            th.relative-position(style="width:50px;") 
              q-tooltip User Boid Power
              img.absolute-center(src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
        tbody(v-for="(user,index) in leaderboard" :key="user.id")
          tr.user.cursor-pointer(@click="$router.push({name:'User',params:{username:user.username}})")
            td.relative-position
              .absolute-left.text-grey-7 {{index + 1}}
              .row
                .col-auto
                  img.avatar(:src="user.image")
                .col(style="padding:15px;")
                  .ellipsis(data-th="Username") {{user.username}}
                  small.block.light-paragraph {{user.tagline}}
            td(data-th="Power") {{parseInt(user.power)}}
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
                  .ellipsis(style="max-width:120px;") {{team.name | removeDash}}
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
  props: ['thisUser', 'api', 'authenticated', 'leaderboard', 'teamLeaderboard']
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
