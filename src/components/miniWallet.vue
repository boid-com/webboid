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
                  strong {{printNum(wallet.allStake)}}
            .col.relative-position
              q-btn.full-width.absolute-center(color="blue" flat @click="$router.push({name:'Stake'})" :disable="disableActions") Stake  
          .row
            .col-8
              div Pending Payout
              small approximation 
              .row(style="padding:10px;")
                .col
                  strong {{pendingClaimPrint}}
            .col.relative-position
              q-btn.full-width.absolute-center(:color="highlightClaim" flat @click="claim()" :disable="disableActions" ) Claim  
            small The pending payout accumulates until it is claimed. Claiming more/less often does not impact your profitability. Soon we will offer an automatic claim service.
          .row
            .col-8
              div Linked EOS Account
              .row(style="padding:10px;")
                .col
                  strong {{$parent.thisUser.payoutAccount}}
            .col.relative-position
              q-btn.full-width.absolute-center(color="green" flat @click="$root.$emit('modal','updatePayoutModal')") Change 
          .row(v-if="$parent.transitWallet && noMatch")
            .col-8
              div Scatter Account
              .row(style="padding:10px;")
                .col
                  strong {{$parent.transitWallet.auth.accountName}}
            .col.relative-position
            q-card.bg-red
              small.text-white You are logged in with a EOS account which is not linked to this Boid account. You can login with a different account, or link this account to your Boid account.
            .row.full-width.justify-center
              .col-auto.text-center
                q-btn(@click="reLogin()") Change Login
              .col-auto.text-center
                q-btn(@click="$root.$emit('modal','updatePayoutModal')") Link
          .row.justify-center(v-else-if="!$parent.transitWallet")
            q-btn(@click="$root.$emit('initTransitWallet')" color="green") Scatter
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
    highlightClaim(){
      if (!this.pendingClaim) return "grey"
      if (this.pendingClaim.power > 1000 || this.pendingClaim.stake > 1000) return "blue"
      else return "grey"
    },
    disableActions(){
      if (!this.$parent.transitWallet || this.noMatch) return true
    },
    noMatch(){
      console.log(this.$parent.transitWallet)
      if (!this.$parent.thisUser || !this.$parent.transitWallet) return true
      return this.$parent.thisUser.payoutAccount !== this.$parent.transitWallet.auth.accountName
    },
    pendingClaimPrint(){
      if (!this.pendingClaim) return 0
      var total = this.pendingClaim.power + this.pendingClaim.stake - 100
      if (total < 0) total = 0

      return '≈	'+ total.toLocaleString('en').split('.')[0] + ' BOID'
    }
  },
  methods:{
    reLogin(){
      this.$parent.transitWallet.terminate()
      setTimeout(el => {
        this.$root.$emit('initTransitWallet')
      },1000)
    },
    async claim(){
      const result = await this.$parent.transitWallet.eosApi.transact(boidjs.tx.claim(this.$parent.transitWallet.auth),boidjs.tx.tapos)
      console.log(result)
      window.alert('Claim was successful.')
      setTimeout(() => {
        this.updateBoidWallet()
      }, 1000)
    },
    async updateBoidWallet(){
      this.loading = true
      this.wallet = await boidjs.get.wallet(this.eosAccount)
      this.pendingClaim = await boidjs.get.pendingClaim(this.wallet)
      this.loading = false
    },
    printNum
  },
  watch:{

  }
}
</script>