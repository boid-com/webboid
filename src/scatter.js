import ScatterJS, { Network } from "scatterjs-core"
import ScatterEOS from "scatterjs-plugin-eosjs2"
import { Api, JsonRpc } from "eosjs"
ScatterJS.plugins(new ScatterEOS())


// MAINNET
//const network = Network.fromJson({
//    blockchain:'eos',
//    host:'nodes.get-scatter.com',
//    port:443,
//    protocol:'https',
//    chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
//});

// JUNGLE
const network = Network.fromJson({
  blockchain: "eos",
  protocol: "https",
  host: "jungle2.cryptolions.io",
  port: 443,
  chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
})

let eos
var scatter = {}
const rpc = new JsonRpc(network.fullhost())
ScatterJS.scatter.connect("boid").then(connected => {
  if (!connected) {
    console.error("Could not connect to Scatter.");
    alert("Could not connect to Scatter, try refreshing the page");
    return;
  }
  scatter = ScatterJS.scatter
  console.log('scatterId:',scatter.identity)
  
})



var s = {
  identity:null,
  login(){
    scatter.getIdentity({ accounts: [network] })
  },
  logout(){
    scatter.forgetIdentity()
  }
}

export {scatter,s}