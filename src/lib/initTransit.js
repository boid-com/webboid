import { initAccessContext } from 'eos-transit'
import scatter from 'eos-transit-scatter-provider'
import keycat from 'eos-transit-keycat-provider'
function err(error){
  console.error(error)
}


async function init(){
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
        keycat()
        // ledger()
      ]
    })
  } catch (error) {
    err(error)
  }
  const walletProviders = accessContext.getWalletProviders()
  console.log(walletProviders)
  const wallet = accessContext.initWallet(walletProviders[1])
  await wallet.connect()
  let discoveryData = await wallet.discover({ pathIndexList: [ 0,1,2,3 ] })
  if (discoveryData.keyToAccountMap.length > 0) {
    // Let the user choose an account here
    // await wallet.login(accountName, authorization) 
  } else { await wallet.login() }
  window.transit = {wallet}
  return wallet
}

// init().catch(err)
module.exports = init