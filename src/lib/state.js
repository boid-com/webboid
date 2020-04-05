const ax = require('axios')
const state = {
  global:{
    transitWallet:null,
    boidWallet:null,
    stakeConfig:null,
    pendingClaim:null,
    maxPendingClaim:null,
    errorMsg:null,
    successMsg:null,
    get poweredStake(){
      if (!this.pendingClaim || !this.boidWallet) return 0
      if (this.boidWallet.allStaked < this.pendingClaim.maxPoweredStake) return this.boidWallet.allStaked
      else return this.pendingClaim.maxPoweredStake
    },
    do:{
      async claimCPU(){
        try {
          const result = await ax.get('https://localhost:3000/claimCPU?chain=kylin')
        } catch (error) {
          console.error(error.toString())
          state.global.errorMsg = error.toString()
        }
      },
      async updateBoidWallet(){
        if (!state.global.transitWallet) return 
        state.global.boidWallet = await boidjs.get.wallet(state.global.transitWallet.auth.accountName)
        console.log('UpdateBoidWallet',state)
      },
      async updatePendingClaim(){
        if (!state.global.boidWallet) return console.log('Initialize Boid Wallet before calling updatePendingClaim.')
        state.global.pendingClaim = await boidjs.get.pendingClaim(state.global.boidWallet,state.global.stakeConfig)
        state.global.pendingClaim.total = state.global.pendingClaim.power + state.global.pendingClaim.stake
        console.log('PENDING CLAIM:',state.global.pendingClaim )
      },
      async updateMaxPendingClaim(){
        if (!state.global.boidWallet || !state.global.pendingClaim) return 
        var thisWallet = JSON.parse(JSON.stringify(state.global.boidWallet))
        thisWallet.allStaked = state.global.pendingClaim.maxPoweredStake
        state.global.maxPendingClaim = await boidjs.get.pendingClaim(thisWallet,state.global.stakeConfig)
        state.global.maxPendingClaim.total = state.global.maxPendingClaim.power + state.global.maxPendingClaim.stake

        console.log('MAX PENDING CLAIM:',state.global.pendingClaim )
      },
      async updateTokenConfig(){
        state.global.stakeConfig = await boidjs.get.stakeConfig()
      },
      async refreshAccountData(){
        try {
          await this.updateTokenConfig()
          if (state.global.transitWallet) await this.updateBoidWallet() 
          await this.updatePendingClaim()
          await this.updateMaxPendingClaim()
        } catch (error) {
          console.error(error.toString())
          state.global.errorMsg = error.toString()
        }
      },
      async claim(){
        if (!state.global.transitWallet) return
        const auth = state.global.transitWallet.auth
        const result = await state.global.transitWallet.eosApi.transact(boidjs.tx.claim(auth),boidjs.tx.tapos).catch(err => alert(err.message))
        if (!result) return
        console.log(result)
      },
      async transfer(from,to,coin,quantity,memo){
        try {
          if (!state.global.transitWallet) return
          if (!memo) memo = ""
          const auth = state.global.transitWallet.auth
          const authorization = [{actor:auth.accountName,permission:auth.permission}]
          const symbol = coin.sym.split(',')
          quantity = parseFloat(quantity).toFixed(symbol[0]) + " " + symbol[1]
          const action = {
            account: coin.contract,
            name: 'transfer',
            authorization,
            data: { from, to, quantity, memo }
          }
          console.log('Transfer Action',coin)
          const result = await state.global.transitWallet.eosApi.transact({actions:[action]},boidjs.tx.tapos)
          if (!result) throw("There was an error")
          state.global.successMsg = "Transaction successful"
          console.log(result)
        } catch (error) {
          console.error(error.toString())
          state.global.errorMsg = error.toString()
        }
      },
      async getNewdexPrice(token,contract) {
        try {
          var symbol = contract + '-' + token.toLowerCase() + '-eos'
          var timestamp = Date.now()
          var queryString = `symbol=${symbol}&timestamp=${timestamp}`
          var queryString = "symbol="+symbol
          var tokenData = (await ax.get('https://api.newdex.io/v1/ticker/?' + queryString,null))
          console.log(tokenData)
          return tokenData
        } catch (error) {
          console.error(error)
          return
        }

      }
    }
  }
}

module.exports = state
