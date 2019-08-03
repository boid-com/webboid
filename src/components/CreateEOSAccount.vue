<template lang="pug">
div(style="padding:20px; max-width: 1200px;")
  h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Create EOS Account
  .row.justify-center(style="padding:30px;")
    .col-xs-12.col-xl-8
      p.inline You can now generate an EOS account directly from your Boid pending balance. This means anyone can now earn an EOS account by just generating Boid Power with their CPU Cycles. If you have an existing EOS Account with BOID tokens you can use those tokens to generate new EOS accounts as well.
  .row.justify-center(style="min-height:140px;")
   q-card.relative-position
    h5.text-center(style="margin-top:0px;") Account Creation Cost
    .row.justify-center.items-center
      .col-auto
        img(src="https://assets.boid.com/images/NewBoidLogo.svg" style="width:60px;")
      .col-auto
        h4.text-center(v-if="boidCost") {{format(boidCost)}} BOID
  .row.justify-center(style="min-height:200px;")
    q-card.relative-position(v-if="false")
      div
        p.light-paragraph.text-center Use Existing EOS Account
        .row.justify-center.full-width(style="" v-if="!EOSAccount")
          q-btn(color="blue").absolute-center.full-width EOS Account Login

        q-btn.full-width.absolute-bottom(color="green" @click="" :disabled="!EOSAccount") Create EOS Account
    q-card.relative-position
      div
        p.light-paragraph.text-center Use Pending BOID Balance
        .row.justify-center.full-width(style="" v-if="!authenticated")
          q-btn(color="blue" @click="$root.$emit('modal','auth')").absolute-center.full-width Boid Account Login
        div(v-if="authenticated")
          .row.justify-center
            q-card.relative-position.shadow-4
              div
                .row.justify-center
                  div.justify-center
                    .row.justify-center(style="padding-bottom:10px;")
                      img.avatar(style="width:70px; height:70px;" :src="thisUser.image")
              div.text-center(style="padding-bottom:5px;") {{thisUser.username}}
              div(v-if="userPending && userPending > 0") #[small Pending:] {{format(userPending)}} BOID
              div(v-else) #[small Pending:] 00.00 BOID
              div(style="height:25px;")
              q-btn.full-width.absolute-bottom(color="grey-8" flat small @click="$root.$emit('modal','auth')") Change Boid Account
          .row
            div(v-if="userPending > boidCost")
              .row.items-center(style="max-width:280px; padding-top:10px;")
                .col-auto(style="padding:5px;")
                  q-icon(name="check" color="green" style="font-size:40px;")
                .col
                  div You have enough pending BOID to create an EOS account.
            div(v-else)
              .row.items-center(style="max-width:280px; padding-top:10px;")
                .col-auto(style="padding:5px;")
                  q-icon(name="close" color="red" style="font-size:40px;")
                .col
                  p(style="margin-top:12px;") You do not have enough pending BOID to create an EOS account.
                small(style="margin:10px;") Earn more BOID by generating Boid Power.
        div(style="height:45px;")
        q-btn.full-width.absolute-bottom(color="blue" @click="openCreateAccountModal()" :disabled="userPending < boidCost") Create EOS Account
        createModal(v-if="showModal" ref="createModal")
</template>
<style lang="stylus" scoped>
  @import '~variables'

  .q-card
    padding 20px !important
    padding-bottom 5px !important
</style>


<script>
import { openURL } from 'quasar'
var formatnum = require('format-number')()
import createModal from '@/CreateEOSAccountModal.vue'
function format(data){if (data) return formatnum(parseFloat(data.toFixed(0).replace(/[^0-9.]/g, "")))}

export default {
  data(){
    return {
      accountCost:10000,
      createStats:null,
      showModal:true
    }
  },
  props:['thisUser','authenticated'],
  components:{createModal},
  async mounted(){
    // this.openCreateAccountModal()
    this.createStats = await this.$api.getAccountCreateStats()
    console.log(this.createStats)
  },
  computed:{
    boidCost(){ if (this.createStats) 
    try {
      return this.createStats.results.ramCost.boid
    }catch(error){
      console.log(createStats)
      alert(error)}},
    EOSAccount(){return false},
    userPending(){
      if (this.authenticated){
        console.log(this.thisUser.tokens)
        return this.thisUser.tokens.find(el => el.type.name == "BOID").balance
      }
      else return 0
    }
  },
  methods:{
    openURL,
    format,
    openCreateAccountModal(){
      this.resetModal(()=>{
        this.$nextTick(()=>{
          this.$refs.createModal.$refs.modal.open()
        })
      })
    },
    resetModal(cb){
      this.showModal = false
      setTimeout(() => {
        this.showModal = true
        if (cb) cb()
      }, 10)
    }
  },
  watch:{

  }
}
</script>

