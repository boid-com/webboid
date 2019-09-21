<template lang="pug">
  q-card
    .light-paragraph.text-center BOID Stake Discount
    .row.justify-center(style="padding:10px;")
      small You can save money on your order if you have some BOID staked.
    .row(style="padding-bottom:20px;")
      .col-xs-12.col-md-3.col-lg-6
        div(style="padding:5px;")
          .row
            .col
              .light-paragraph BOID Staked
            .col-4
              .light-paragraph Discount
          .row.discountRow(:class="{selected:$parent.eosAccountStaked >= 100000 }")
            .col
              div >= 100,000
            .col-3
              div 5%
          .row.discountRow(:class="{selected:$parent.eosAccountStaked >= 1000000}")
            .col
              div >= 1,000,000
            .col-3
              div 10%
      .col-md-4.col-lg-6(style="padding:0px;")
        div(style="padding:5px;")
          .light-paragraph.text-center EOS Account
          .row
            .col(style="padding-left:10px;")
              q-input(
              type="text"
              @keyup.enter="$parent.checkEOSStake($parent.eosAccount)"
              v-model.trim="$parent.eosAccount"
              placeholder="EOS Account"
              :max-length="12"
              :loading="$parent.checkName")
              small(v-if="$parent.errormsg").text-red {{$parent.errormsg}}
            .col-4
              q-btn( color="green" style="margin-top:5px;" @click="$parent.checkEOSStake($parent.eosAccount)") Check Stake
      .col
        div(style="padding:5px;")
          .light-paragraph.text-center Account Stake
          .row.justify-center
            div
              h4.text-center {{$parent.eosAccountStaked}} BOID
          .row.justify-center
            q-btn(flat small @click="$router.push('/staking')") Adjust Stake
      .col
        .light-paragraph.text-center Discount
        .row(style="padding-top:16px;").justify-center
          div(style="border-radius:100%; height:70px; width:70px; padding-top:4px;").bg-blue.shadow-3.text-white
            .row.justify-center
              div
                h4.text-center {{$parent.discountAmount * 100}}% 
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~variables'
  .selected
    background-color $blue-6
    color $white
  .discountRow
    padding 5px
    margin 0px
    outline 1px solid $grey-4
  .q-card
    margin-bottom 40px
    padding-bottom 40px
</style>