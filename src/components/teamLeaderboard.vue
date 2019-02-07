<template lang="pug">
div
  .row.justify-center.full-width(v-if="leaderboard")
    .col-12
      div
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

  },
  created() {

  },
  props: ['thisUser','leaderboard']
}
</script>

<style lang="stylus">
@import '~variables'
.puck{
  border-radius: 50% 50% 50% 50%
  width:20px
  height:20px
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);

}
.puck-lg{
  border-radius: 50% 50% 50% 50%
  width:20px
  height:20px
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);

}
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
