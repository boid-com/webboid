import { openURL, Toast } from 'quasar'
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
    text:"The top contributors will receive a rare NFT season pass and exclusive physical merchandise.",
    img:"/statics/seasonpass/top-contributors.svg"
  }
]
const icons = '/statics/tokenicons/'

module.exports = {
  state:{
    getCoinsInterval:null,
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
      leaderboard:true,
      cpuClaim:true
    }
  },
  computed:{
    totalPowerGranted(){
      if (!this.leaderboard) return
      return this.leaderboard.reduce((prev,el) => prev += el.total_power_granted,0).toFixed(0)
    },
    totalEOSContributed(){
      if (!this.leaderboard) return
      return this.leaderboard.reduce((prev,el) => prev += el.usdValue,0).toFixed(0)
    },
    donationText(){
      if (this.remainingDonations < 2 ) return "donation"
      else return "donations"
    },
    remainingDonations(){
      if (!this.contributor) return 0
      return 10 - (this.contributor.donations - this.contributor.level*10)
    },
    selectedCoin(){
      if (!this.selectedPay || !this.coins) return false 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      return selectedCoin
    },
    amountLow(){
      if (!this.selectedPay || !this.coins) return false 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      if (!selectedCoin) return false 
      // console.log(this.payAmount,selectedCoin.min_contribution)
      if (this.payAmount < parseFloat(selectedCoin.min_contribution.toFixed(4))) return true
      else return false
    },
    powerBonus(){
      if (!this.config || !this.contributor || !this.contributor) return 0
      // console.log('PowerBonus:',this.config.user_power_reward_increment)
      if (this.contributor.level < 1) return 5
      else return this.contributor.level * this.config.user_power_reward_increment  
    }
  },
  methods:{
    async claimCPU(){
      try {
        this.loading.cpuClaim = true
        await this.global.do.claimCPU()
        await this.global.do.checkCPUClaim()
        this.loading.cpuClaim = false
      } catch (error) {
        this.loading.cpuClaim = false
        console.error(error.toString())
      }
    },
    async checkFreeCPU(){
      try {
        this.loading.cpuClaim = true
        await this.global.do.checkCPUClaim()
        this.loading.cpuClaim = false
      } catch (error) {
        this.loading.cpuClaim = false
        console.error(error.toString())
      }
    },
    updateSelectedPay(symbol){
      this.selectedPay = symbol
    },
    checkAmount(){
      if (!this.selectedPay || !this.coins) return 
      const selectedCoin = this.coins.find(el => el.symbol === this.selectedPay)
      if (!selectedCoin) return 
      if (this.payAmount < selectedCoin.min_contribution) this.payAmount = parseFloat(selectedCoin.min_contribution)
    },
    async donate(){
      try {
        this.loading.selectPanel = true
        await this.getCoins(true)
        this.checkAmount()
        const coin = this.coins.find(el => el.symbol === this.selectedPay)
        await this.global.do.transfer(this.global.transitWallet.auth.accountName,'boiddonation',coin.token,parseFloat(this.payAmount.toFixed(4)))
        await sleep(1000)
        await this.getAll()
        this.updatePayAmount()
        this.updateSelectedPay(this.selectedPay)
        this.loading.selectPanel = false
        console.log('Donate')
      } catch (error) {
        console.log(error.toString())
        this.global.errorMsg = error.toString()
      }
    },
    async claim(){
      try {
        this.loading.accountPanel = true
        await this.global.do.claim()
        await this.global.do.refreshAccountData()
        this.loading.accountPanel = false
        Toast.create.positive("Transaction successful")

      } catch (error) {
        console.log(error.toString())
        this.global.errorMsg = error.toString()
      }
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
      // console.log('SELECTEDCOIN',selectedCoin)
      this.payAmount = parseFloat(selectedCoin.min_contribution)
    },
    adjustPay(percent) {
      this.payAmount += this.payAmount * (percent*.01)
    },
    openURL,
    calcPowerBonus(available,multiplier){
      const power = (this.powerBonus * multiplier)
      const result = available - power
      // console.log(result)
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
      this.updateSelectedPay(this.selectedPay)
    },
    getPage(){
      console.log(this.page)

    },
    async getLeaderboard(){
      console.log('Get Leaderboard')
      this.loading.leaderboard = true
      try {
        const leaderboard = await ax.get('https://api.boid.com/donationsLeaderboard?chain=kylin')
        this.leaderboard = leaderboard.data
        // console.log('LEADERBOARD',this.leaderboard)

      } catch (error) {
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
          table: "tokens",
          limit:-1
        })).rows.map(coin => {
          coin.symbol = coin.token.sym.split(',')[1]
          coin.contract = coin.token.contract
          coin.precision = coin.token.sym.split(',')[0]
          coin.img = icons + coin.symbol +'.png'
          coin.min_contribution = parseFloat(parseFloat(coin.min_contribution).toFixed(coin.token.sym.split(',')[0]))+ 0.0001
          coin.minContribution = coin.min_contribution.toLocaleString(undefined,{ minimumFractionDigits: 4 })
          coin.availablePower = parseFloat(coin.current_power_available)
          // coin.lastUpdated = coin.
          return coin
        })
        // this.updateTokenPrices()
        // console.log(this.coins)
        if (!disableLoading) this.loading.selectPanel = false

      } catch (error) {
        this.coins = []
        console.error(error.toString())
        this.loading.selectPanel = false
      }
    },
    async updateTokenPrices(){
      for (var coin of this.coins) {
        // console.log('coincontract',coin)
        const price = await this.global.do.getNewdexPrice(coin.symbol,coin.contract)
        // console.log(price)
      }
    },
    async getContributor(accountName){
      if (!accountName) accountName = this.contributor.account
      // console.log('Get Contributor',accountName)
      this.loading.progressPanel = true
      try {
        const contributor = (await rpc.get_table_rows({
          code: "boiddonation",
          scope: "boiddonation",
          table: "contributors",
          lower_bound:accountName,
          limit:1
        })).rows[0]
        if (contributor && contributor.account === accountName) this.contributor = contributor
        else this.contributor = {
          account:accountName,
          coins:[],
          donations:0,
          level:0,
          total_power_granted:0
        }
        this.loading.progressPanel = false
      } catch (error) {
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
      } catch (error) {
        this.coins = []
        console.error(error.toString())
      }
    },
    async getBalances(){
      
    }
  }
}