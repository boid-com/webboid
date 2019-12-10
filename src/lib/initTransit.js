import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
import keycat from 'eos-transit-keycat-provider'
import ledger from 'eos-transit-ledger-provider'
import { Keycat } from 'keycatjs'

function err (error) {
  console.error(error)
}

function rand (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

import { Api, JsonRpc } from "eosjs"

const endpoints = [
  'https://eos.greymass.com',
  'https://eos.greymass.com:443',
  'https://api.eossweden.org',
  'https://api.eosn.io',
  'http://bp.cryptolions.io:8888',
  'https://eu1.eosdac.io:443',
  'https://api.main.alohaeos.com:443',
  'https://node1.eosphere.io',
  'https://node2.eosphere.io',
]

function pickEndpoint () {
  const endpoint = endpoints[rand(0, endpoints.length - 1)]
  console.log(endpoint)
  return endpoint
}
const rpc = new JsonRpc(pickEndpoint())
const boidjs = require('boidjs')({ rpc })
window.boidjs = boidjs
window.transit = {}

async function getTotalStake (account) {
  try {
    let res = await rpc.get_table_rows({
      json: true,
      code: 'boidcomtoken',
      scope: account,
      table: "staked",
      limit: 10000
    })
    const userTotalStaked = res.rows.reduce((acc, el) => parseFloat(el.quantity) + acc, 0)
    return userTotalStaked
  } catch (error) {
    console.log(error)
    return undefined
  }
}

async function getTotalDelegated (account) {
  try {
    let res = await rpc.get_table_rows({
      json: true,
      code: 'boidcomtoken',
      scope: account,
      table: "delegation",
      limit: 10000
    })
    console.log(res)
    const userTotalDelegated = res.rows.reduce((acc, el) => parseFloat(el.quantity) + acc, 0)
    console.log(userTotalDelegated)
    return userTotalDelegated
  } catch (error) {
    console.log(error)
    return undefined
  }
}

async function init () {

  window.eosjs = { rpc, getTotalStake, getTotalDelegated }

  var accessContext
  try {
    accessContext = initAccessContext({
      appName: 'app.boid.com',
      network: {
        blockchain: 'eos',
        host: 'eos.greymass.com',
        port: 443,
        protocol: 'https',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      },
      walletProviders: [
        scatter()]
      // keycat()      ]
    })
  } catch (error) {
    err(error)
  }

  window.transit.initWallet = async (providerName, alert) => {
    try {
      providerName = providerName.toLowerCase()
      const providers = accessContext.getWalletProviders()
      console.log(providers)
      const selected = providers.find(el => el.id.toLowerCase() === providerName)
      if(!selected) throw ('Invalid Wallet Provider')
      var wallet = accessContext.initWallet(selected)
      await wallet.connect()
      await wallet.login()
      console.log(wallet)
      wallet.eosAPI = setupFuel(wallet.eosApi)
      return wallet
    } catch (error) {
      if(!error.message) error = { message: error }
      console.error(error)
      if(alert) alert(error.message)
    }
  }
}

const fuelAuth = {
  actor: 'greymassfuel',
  permission: 'cosign',
}

const fueltx = {
  account: 'greymassnoop',
  name: 'noop',
  authorization: [fuelAuth],
  data: {},
}

window.fuelAuth = fuelAuth
window.fueltx = fueltx
const ax = require('axios')
async function checkFuel(account){
const status = await ax.post('https://eos.greymass.com/v1/fuel/get_quota_usage',{account}).catch(console.log)
console.log(status.data[0])
if (!status.data || !status.data[0] || status.data[0].cpu < (status.data[0].quota_cpu - 2500) ) return fueltx
}

window.checkFuel = checkFuel


function setupFuel (api) {
  console.log(api.authorityProvider)
  const getRequiredKeys = api.authorityProvider.getRequiredKeys.bind(api.authorityProvider)
  api.authorityProvider.getRequiredKeys = async (args) => {
    const actions = args.transaction.actions.map((action) => {
      const authorization = action.authorization.filter(
        ({ actor, permission }) =>
        !(actor === fuelAuth.actor && permission === fuelAuth.permission),
      )
      return {
        ...action,
        authorization,
      }
    })
    const transaction = {
      ...args.transaction,
      actions,
    }
    return getRequiredKeys({
      ...args,
      transaction,
    })
  }
  return api
}

// window.transit.initWallet('keycat') 

// const wallet = accessContext.initWallet(window.transit.walletProviders[1])
// await wallet.connect()
// let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2,3 ] })
// if (discoveryData.keyToAccountMap.length > 0) {
//   // Let the user choose an account here
//   // await wallet.login(accountName, authorization) 
// } else { await wallet.login() }
// window.transit = {wallet}
// return wallet

init().catch(err)
module.exports = init