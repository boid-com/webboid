<template lang="pug">
div(style="padding:20px; max-width: 1200px;")
  h2.text-weight-light.text-center(style="font-family: 'Comfortaa', cursive; color:#089cfc; user-select: none; margin-bottom:5px;") Boid Voter Proxy
  .row.justify-center(style="padding:30px;")
    .row
      div
       p.inline The Boid voter proxy grades other proxies on a scale from 1-3. We generate a list of block producers weighted by the grade of votes received from our rated proxies. The #[a.inline(href="https://bloks.io/account/boidcomproxy") boidcomproxy] then votes for the top 30 BPs in this weighted list. Read more about our grading technique #[a(href="https://medium.com/@boidcom/boid-eos-proxy-voting-review-march-2019-81661dd1224") here].
  .row.justify-center
    q-btn(color="blue" large  :disabled="!userLoggedIn"
    @click="proxyVote()"
    style="margin-bottom:10px; font-size:25px; padding:15px;") Vote Boidcomproxy
    q-btn(v-if="userLoggedIn" style="margin-bottom:10px;padding:15px;" @click="walletLogout()") Logout
  .row.justify-center
    p.justify-center.text-amber-10.bg-grey-7(v-if="errormsg" style="padding:10px;") {{errormsg}}
    p.justify-center.text-blue-6(v-if="statusmsg") {{statusmsg}}
  .row.justify-center(v-if="userLoggedIn")
    p Scatter Login: {{wallet.accountInfo.account_name}}
  .row.justify-center
    q-card
      p.light-paragraph.text-center Whitelisted Proxy Ratings
      div(v-if="proxies")
        .row
          div(v-for="(list,index) in proxies" v-if="list.length>0")
            .row.justify-center
              .rating.relative-position(:class="ratingColor(index)")
                .absolute-center {{index}}
            div(style="max-height:500px; overflow:auto;")
              table.q-table.horizontal-separator.full-width
                tbody.full-width(
                  v-for="(proxy,index) in list" 
                  :key="proxy.name" 
                  style="height:0px;")
                  tr.user
                    td.relative-position
                      h6 {{proxy.name}}
        q-btn.full-width(large flat color="green" style="margin-top:10px;" @click="openURL('https://trello.com/b/oosshNqk/proxy')") FULL LIST
    q-card
      p.light-paragraph.text-center Weighted BP list
      div(v-if="weightedList")
        .row
          .col
            thead
              tr
                th.light-paragraph(style="padding:10px") Block Producer
                th.light-paragraph(style="padding:10px") Vote Weight
                th.light-paragraph(style="padding:10px") Voting
            div(style="height:490px; overflow:auto;")
              table.q-table.horizontal-separator.full-width
                tbody.full-width(
                  v-for="(bp,index) in weightedList" 
                  :key="bp[0]")
                  tr.user
                    td.relative-position
                      h6 {{bp[0]}}
                    td.relative-position
                      h6 {{bp[1]}}
                    td.relative-position
                      q-icon(:name="bpVoted(bp[0])")
        q-btn.full-width(large flat color="green" style="margin-top:10px;" @click="openURL('https://medium.com/@boidcom/boid-eos-proxy-voting-review-march-2019-81661dd1224')") Learn More
</template>
<style lang="stylus" scoped>
  @import '~variables'

  .q-card
    padding 20px !important
    padding-bottom 5px !important
  .rating
    padding 10px
    background-color $grey-7
    box-shadow: 1px 1px 4px #888888
    color: white
    font-size:20px
    border-radius 100%
    width:50px
    height:50px
</style>


<script>
import { openURL } from 'quasar'
import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
// import ledger from 'eos-transit-ledger-provider'
var accessContext
try {
  accessContext = initAccessContext({
    appName: 'app.boid.com',
    network: {
      blockchain:'eos',
      host:'public.eosinfra.io',
      port:443,
      protocol:'https',
      chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    },
    walletProviders: [
      scatter(),
      // ledger()
    ]
  })
} catch (error) {
  console.log('error here')
}


export default {
  data(){
    return {
      proxies:null,
      weightedList:null,
      wallet:null,
      errormsg:null,
      statusmsg:'Connecting to Scatter (Desktop Only)...'
    }
  },
  mounted(){
    this.getData()
    this.scatterSetup()
  },
  computed:{
    userLoggedIn(){
      if (!this.wallet) return false
      if (this.wallet && this.wallet.active) return true
      else return false
    }
  },
  methods:{
    openURL,
    async walletLogout(){
      this.wallet.logout()
      this.wallet = null
    },
    async getData(){
      this.proxyInfo = (await this.$api.proxyInfo())[0]
      const proxies = this.proxyInfo.results.proxies
      var parsed = []
      for (var i = 0; i < 4; i++){
        parsed[i] = proxies.filter(el => el.rating === i)
      }
      this.proxies = parsed

      const bpList = this.proxyInfo.results.weightedList
      this.weightedList = bpList

    },
    async scatterSetup(){
      try {
        const walletProviders = accessContext.getWalletProviders()
        const selectedWallet = walletProviders[0]
        const wallet = accessContext.initWallet(selectedWallet)
        await wallet.connect()
        await wallet.login()
        this.wallet = wallet
        this.statusmsg = null
      } catch (error) {
        this.statusmsg = null
        this.errormsg = error
        // alert(error)
      }

    },
    async proxyVote(){
      try {
        this.statusmsg = 'Sending Transaction...'
        const result = await this.wallet.eosApi.transact({
          actions: [
            {
              account: 'eosio',
              name: 'voteproducer',
              authorization: [
                {
                  actor: this.wallet.auth.accountName,
                  permission: this.wallet.auth.permission
                }
              ],
              data: {
                voter:this.wallet.auth.accountName,
                proxy:'boidcomproxy',
                producers:""
              }
            }
          ]
        },{
          broadcast: true,
          blocksBehind: 3,
          expireSeconds: 60
        })
        console.log(result)
        this.errormsg = null
        this.statusmsg = 'Success'
      } catch (error) {
        console.log(error)
        this.errormsg = error
        this.statusmsg = null
      }

    },
    ratingColor(index){
      if (index === 1) return 'bg-red-4'
      if (index === 2) return 'bg-amber-7'
      if (index === 3) return 'bg-green-5'
    },
    bpVoted(bpName){
      if (this.proxyInfo.results.producers.find(el=> el === bpName)) return 'check'
    }
  },
  watch:{
  }
}
</script>

