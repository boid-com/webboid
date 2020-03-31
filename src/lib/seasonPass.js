import { openURL } from 'quasar'
const rpc = window.eosjs.rpc
const ax = require('axios')
const state = require('../lib/state')
const sleep = async(ms) => new Promise((resolve) => setTimeout(resolve, ms))
const instructions = [
  { 
    text:"Pick a coin to make a donation with. Each donation causes the minimum for that coin to increase. ",
    img:"/statics/seasonpass/pick-a-coin.svg"
  },
  {
    text:"Send the donation! Each donation provides a Boid Power bonus as a thank-you.",
    img:"/statics/seasonpass/send-the-donation.svg"
  },
  {
    text:"Level up to increase the Boid Power reward you receive for your donation. You level up every 10 donations made.",
    img:"/statics/seasonpass/boid-power-increase.svg"
  },
  {
    text:"The top 20% of contributors will receive a rare NFT season pass and exclusive physical merchandise.",
    img:"/statics/seasonpass/top-contributors.svg"
  }
]
const icons = '/statics/tokenicons/'

module.exports = {
  state:{
    global:state.global,
    page:'rules',
    instructions,
    coins:[],
    contributor:null,
    config:null,
    selectedPay:"EOS",
    payAmount:0,
    leaderboard:null,
    loading:{
      accountPanel:true,
      progressPanel:true,
      selectPanel:true,
      leaderboard:true
    }
  },
  computed:{
    selectedCoin(){
      if (!this.selectedPay || !this.coins) return false 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      return selectedCoin
    },
    amountLow(){
      if (!this.selectedPay || !this.coins) return false 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      if (!selectedCoin) return false 
      console.log(this.payAmount,selectedCoin.min_contribution)
      if (this.payAmount < selectedCoin.min_contribution) return true
      else return false
    },
    powerBonus(){
      if (!this.config || !this.contributor || !this.contributor) return 0
      console.log('PowerBonus:',this.config.user_power_reward_increment)
      return this.contributor.level * this.config.user_power_reward_increment + this.config.user_power_reward_increment
    }
  },
  methods:{
    checkAmount(){
      if (!this.selectedPay || !this.coins) return 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      if (!selectedCoin) return 
      if (this.payAmount < selectedCoin.minContribution) this.payAmount = selectedCoin.minContribution
    },
    async donate(){
      this.loading.selectPanel = true
      await this.getCoins(true)
      this.checkAmount()
      const coin = this.coins.find(el => el.symbol === this.selectedPay)
      await this.global.do.transfer(this.global.transitWallet.auth.accountName,'boiddonation',coin.token_sym,this.payAmount)
      await sleep(1000)
      await this.getAll()
      this.loading.selectPanel = false
      console.log('Donate')
    },
    async claim(){
      this.loading.accountPanel = true
      await this.global.do.claim()
      await this.global.do.refreshAccountData()
      this.loading.accountPanel = false
    },
    async updateAccountPanel(){
      this.loading.accountPanel = true
      await this.global.do.refreshAccountData()
      this.loading.accountPanel = false
    },
    updatePayAmount(){
      if (!this.selectedPay || !this.coins) return 0
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      if (!selectedCoin) return ""
      console.log('SELECTEDCOIN',selectedCoin)
      this.payAmount = parseFloat(selectedCoin.min_contribution)
    },
    adjustPay(percent) {
      this.payAmount += this.payAmount * (percent*.01)
    },
    openURL,
    calcPowerBonus(available,multiplier){
      const power = (this.powerBonus * multiplier)
      const result = available - power
      if (result > 0) return power
      else return this.powerBonus + result
    },
    userReward(coin){
      if (!coin || !this.contributor || !this.config ) return 0
      return this.config.level
    },
    async getAll(){
      this.getCoins()
      if (this.global.transitWallet) this.getContributor(this.global.transitWallet.auth.accountName)
      this.updateAccountPanel()
      this.getConfig()
      this.global.do.updateBoidWallet()
      this.getLeaderboard()
    },
    getPage(){
      console.log(this.page)

    },
    async getLeaderboard(){
      console.log('Get Leaderboard')
      this.loading.leaderboard = true
      try {
        const contributors = (await rpc.get_table_rows({
          code: "boiddonation",
          scope: "boiddonation",
          table: "contributors",
          limit:-1
        })).rows
        var leaderboard = []
        // for (user of contributors) {
        //   const 
        //   leaderboard.push(user)
        // }
        // this.leaderboard = leaderboard.sort()
        this.leaderboard = contributors

      } catch (error) {
        this.leaderboard = null
        this.global.errorMsg = error.toString()
        console.error(error.toString())
      }
      this.loading.leaderboard = false
    },
    async getCoins(disableLoading){
      if (!disableLoading) this.loading.selectPanel = true
      try {
        this.coins = (await rpc.get_table_rows({
          code: "boiddonation",
          scope: "boiddonation",
          table: "tokens"
        })).rows.map(coin => {
          coin.symbol = coin.token_sym.sym.split(',')[1]
          coin.contract = coin.token_sym.sym.contract
          coin.img = icons + coin.symbol +'.png'
          coin.min_contribution = parseFloat(parseFloat(coin.min_contribution).toFixed(coin.token_sym.sym.split(',')[0]))+ 0.0001
          coin.minContribution = coin.min_contribution.toLocaleString(undefined,{ minimumFractionDigits: 4 })
          coin.availablePower = parseFloat(coin.current_power_available)
          // coin.lastUpdated = coin.
          return coin
        })
        console.log(this.coins)
        if (!disableLoading) this.loading.selectPanel = false

      } catch (error) {
        this.coins = []
        console.error(error.toString())
        this.loading.selectPanel = false

      }
    },
    async getContributor(accountName){
      if (!accountName) return null
      console.log('Get Contributor',accountName)
      this.loading.progressPanel = true
      try {
        this.contributor = (await rpc.get_table_rows({
          code: "boiddonation",
          scope: "boiddonation",
          table: "contributors",
          lower_bound:accountName,
          limit:1
        })).rows[0]
        console.log(this.contributor)
        this.loading.progressPanel = false
      } catch (error) {
        this.coins = []
        console.error(error.toString())
        this.loading.progressPanel = false
      }
    },
    async getConfig(){
      try {
        this.config = (await rpc.get_table_rows({
          code: "boiddonation",
          scope: "boiddonation",
          table: "config"
        })).rows[0]
        console.log(this.config)
      } catch (error) {
        this.coins = []
        console.error(error.toString())
      }
    },
    async getBalances(){
      
    }
  }
}