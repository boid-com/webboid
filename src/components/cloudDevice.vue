<template lang="pug">
  q-card(:class="{active:selected,selectable:selectable}" @click="handleSelected()" v-ripple="selectable").relative-position
    .row.justify-center
      .col-6
        .infobox
          .row.justify-center
            small cores
          div.text-center {{device.cores}}
      .col-6
        .infobox
          .row.justify-center
            small RAM
          div.text-center {{device.ram}} GB
      .col-12
        .infobox
          .row.justify-center
            small Boid Power Estimate
          .row.justify-center
            div.relative-position(style="padding:2px;")
              img.absolute-left(src="/statics/images/BoidPower.svg" style="height:20px; left:-13px; top:3px;")
              div.text-center {{(device.cores * corePowerRate).toLocaleString() }} #[small.text-grey-8 +/- 20%]
      .row.justify-center(v-if="!small")
        .col-12
          .infobox
            .row.justify-center
              small Cost Per Core
            .row.justify-center
              .col
                div.text-center ${{(device.coreRate * 24).toLocaleString() }} #[small.text-grey-8 24hr]
        .col-12
          .infobox
            .row.justify-center
              small Total Cost
            .row.justify-center
              .col
                .row.justify-center
                  small.light-paragraph Weekly
                div.text-center ${{(device.coreRate * device.cores * 24 * 7).toLocaleString() }} 
              .col
                .col
                .row.justify-center
                  small.light-paragraph Monthly
                div.text-center ${{(device.coreRate * device.cores * 24 * 30).toLocaleString() }} 
          .col-12(style="height:30px;")
          div.absolute-bottom(v-if="selected")
            div.bg-green(style="padding:5px;").text-center
              small.text-white SELECTED
</template>

<script>
export default {
  data(){
    return {
      selected:false,
      corePowerRate: 250
    }
  },
  props:['device','selectable','small'],
  methods:{
    handleSelected(){
      if (!this.selectable) return 
      else this.$parent.selectedCloudSpec = this.device.id
    }
  },
  watch: {
    '$parent.selectedCloudSpec'(val){
      if (!this.selectable) return false
      if (val === this.device.id) this.selected = true
      else this.selected = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '~variables'
  .infobox
    padding 5px
    margin 5px
    // box-shadow: 0 2px 5px 2px $grey-4
  .active
    box-shadow: 0 2px 10px 2px $green-5
    outline 2px solid $green-4
    background-color white
    // color white
  .q-card.selectable:hover
    background-color: $grey-1
    outline 2px solid $green-4
  .selectable
    cursor: pointer
    user-select: auto
  .q-card
    padding 0px

</style>