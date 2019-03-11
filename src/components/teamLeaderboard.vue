<template lang="pug">
div
  .row.justify-center(style="margin:20px; margin-bottom:0px; margin-top:0px;")
    small(style="padding-bottom:10px;") {{type}}
    small.light-paragraph(v-if="type === 'AVERAGE' ") This Leaderboard is based on the average Boid Power of users during the promotion timeframe. Users are only eligible for this type of promotion if they are on the team when the promotion starts, and remain on the team until the end of the promotion timeframe.
    small.light-paragraph(v-if="type === 'CUMULATIVE' ") This leaderboard is based on the cumulative BOID Tokens earned by users on this team during the promotion timeframe. Users who change teams will remain on the cumulative promotional leaderboards for each team where they make contributions.
    small.light-paragraph(v-if="type === 'LIVE' ") This leaderboard is a live reading of the Boid Power of users who are currently on this team.
  .row.justify-center.full-width(v-if="leaderboard")
    .col-12
      div
        table.q-table.horizontal-separator(style="width:100%")
          thead
            tr
              th 
              th.relative-position(style="width:50px;") 
                q-tooltip(v-if="type==='AVERAGE' | type==='LIVE'") User Boid Power
                q-tooltip(v-else) User cumulative BOID mined
                img.absolute-center(v-if="type==='AVERAGE' | type==='LIVE'" src="/statics/images/BoidPower.svg" style="height:30px; top:15px;")
                img.absolute-center(v-else src="/statics/BOIDLogo.png" style="height:40px; top:15px;")
          tbody(v-for="(user,index) in leaderboard" :key="user.id")
            tr.user(style="cursor: pointer;" @click="$router.push({name:'User',params:{username:user.username}})")
              td.relative-position
                .absolute-left.text-grey-7
                  .bg-white.puck.text-center {{index + 1}}
                .row
                  .col-auto
                    img.avatar(:src="user.image")
                  .col.relative-position(style="padding:15px; padding-bottom:30px;")
                    .ellipsis(data-th="Username") {{user.username}}
                    small.ellipsis.block.light-paragraph.absolute(
                      style="bottom:0px; max-width:100%;"
                      ) {{user.tagline}}
              td(data-th="Power") {{parseInt(user.tPower).toLocaleString()}}
            .row.full-width(v-if="user.tokenTransaction" style="padding:10px;").bg-green-1
              .row
                .col
                  small.on-left Paid:
              .row {{user.tokenTransaction.amount.toFixed(4)}} {{user.tokenTransaction.token.type.name}}
              a.on-right(v-if="user.tokenTransaction.tokenPayout && user.tokenTransaction.tokenPayout.txid" :href="blokstx(user.tokenTransaction.tokenPayout.txid)") txid
            .full-width.bg-grey-4(style="height:1px; margin-bottom:15px;")
                

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
  methods: {
    blokstx(txid){
      return 'https://www.bloks.io/transaction/' + txid
    }
  },
  watch: {
    type(val){
    }
  },
  created() {

  },
  props: ['thisUser','leaderboard', 'type']
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
