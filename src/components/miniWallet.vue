<template lang="pug">
  div
    p.light-paragraph.text-center BOID Wallet
    div(v-if="$parent.thisUser.payoutAccount")
      .row.gutter-md(style="padding-top:10px")
        .col-12(v-if="wallet" style="padding-top:10px;")
          .row
            .col
              div Total Balance
              .row(style="padding:10px;")
                strong {{printNum(wallet.balance)}}
            .col
              div.justify-center Liquid Balance
              .row(style="padding:10px;")
                strong {{printNum(wallet.liquidBalance)}}
          .row
            .col-8
              div Total Stake
              .row(style="padding:10px;")
                .col
                  strong {{printNum(wallet.totalStake)}}
            .col.relative-position
              q-btn.full-width.absolute-center(color="blue" flat @click="claim()") Stake  
          .row
            .col-8
              div Pending Payout
              .row(style="padding:10px;")
                .col
                  strong {{pendingClaimPrint}}
            .col.relative-position
              q-btn.full-width.absolute-center(color="blue" flat @click="claim()") Claim  
          .row
            .col-8
              div Linked EOS Account
              .row(style="padding:10px;")
                .col
                  strong {{$parent.thisUser.payoutAccount}}
            .col.relative-position
              q-btn.full-width.absolute-center(color="green" flat @click="$root.$emit('modal','updatePayoutModal')") Change  
    div(v-else)
      p.light-paragraph.text-center You have not linked an EOS account yet
      q-btn.full-width(color="green" @click="$root.$emit('modal','updatePayoutModal')") Link EOS Account  
    br
    q-btn.full-width(color="blue" flat disabled) Advanced Wallet
    q-inner-loading(:visible="loading" style="min-height:200px;")
      q-spinner-ball(size="60px" color="blue")
</template>
<style lang="stylus" scoped>

</style>
<script>
const boidjs = window.boidjs
function printNum(num){
  if (!num) return 0
  return num.toLocaleString('en',{maximumFractionDigits: 0})
}
export default {

  data(){
    return {
      wallet:null,
      eosAccount:this.$parent.thisUser.payoutAccount,
      pendingClaim:null,
      loading:true,
      scatterWallet:null
    }
  },
  async mounted(){
    this.updateBoidWallet()
    this.$parent.$on('refreshWallet',this.updateBoidWallet)
    // this.scatterWallet = await window.transit.initWallet('scatter')

  },
  computed:{
    pendingClaimPrint(){
      if (!this.pendingClaim) return 0
      const total = this.pendingClaim.power + this.pendingClaim.stake
      return '~ '+ total.toLocaleString('en').split('.')[0] + ' BOID'
    }
  },
  methods:{
    async claim(){
      // const wallet = window.transit.initWallet('scatter')
      console.log(this.scatterWallet)
    },
    async updateBoidWallet(){
      this.loading = true
      this.wallet = await boidjs.get.wallet(this.eosAccount)
      this.pendingClaim = await boidjs.get.pendingClaim(this.eosAccount)
      this.loading = false
    },
    printNum
  },
  watch:{

  }
}
</script>