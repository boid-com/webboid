<template lang="pug">
  div.bg-green-6 
    .row.justify-center.xl-padding.md-padding(style="padding-top:145px; padding-bottom: 10px;" )
      .col-4
        .row.justify-center.relative-position
          img.heroicon.absolute-center(src="https://assets.boid.com/images/connectdevices.svg")
        .herocard
          h5.text-center.text-white Connect Your Devices
      .col-4
        .row.justify-center.relative-position
          img.heroicon.absolute-center(src="https://assets.boid.com/images/contribute3.svg")
        .herocard
          h5.text-center.text-white Contribute To Big Ideas
      .col-4
        .row.justify-center.relative-position
          img.heroicon.absolute-center(src="https://assets.boid.com/images/earnrewards3.svg")
        .herocard
          h5.text-center.text-white Earn Rewards
    div(style="height:10px")
</template>
<style lang="stylus">
@import '~variables'
.herocard {
  // background-color: white;
  border-radius: 30px;
  z-index: 1;
  padding-top: 125px;
  margin-left:15px;
  margin-right:15px;
  @media screen and (max-width 500px) {
    padding-top: 60px;
  }
}
.heroicon 
  background-color $grey-1
  border-radius 20%
  padding: 20px;
  width: 220px;
  height: 220px;
  filter: drop-shadow( 2px 3px 2px alpha(black,.2))
  @media screen and (max-width 1000px) 
    width: 170px
    height: 170px;
  @media screen and (max-width 500px) 
    width: 110px
    height: 110px;

  // @media screen and (max-width $breakpoint-md) 
  //   width: 290px
</style>
<script>
export default {}
</script>