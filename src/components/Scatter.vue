<template lang="pug">
div
  //- q-btn(@click='logout()') Logout
  q-btn(@click='$router.push({name:"Stake"})'  color="green") BOID Staking
  //- p(v-if="account") {{account.name}}
//- h1 Boid Stake, Claim, Unstake
//- h5
//- | boid Scatter Example
//- br
//- section(v-if='scatter && account')
//- button(@click='stake') Stake
//- q-input(v-model.number='stakeAmount', type='number', placeholder='stake amount')
//- input(v-model.number='stakeTime', type='number', placeholder='stake time')
//- section(v-if='scatter && account')
//- button(@click='unstake') Unstake
//- section(v-if='scatter && account')
//- button(@click='claim') Claim
//- button(@click='login' v-if='scatter && !account') Login with Scatter
//- section.logged-in-with(v-if='scatter && account')
//- | Logged in with: {{account.name}}
//- button.small(@click='logout') Logout
//- section(v-if='!scatter')
//- | You need Scatter to interact with this website.
//- a(href='https://get-scatter.com/' target='_blank') Click here to get it.
</template>

<script>
import ScatterJS, { Network } from "scatterjs-core";
import ScatterEOS from "scatterjs-plugin-eosjs2";
import { Api, JsonRpc } from "eosjs";
ScatterJS.plugins(new ScatterEOS());

// MAINNET
const network = Network.fromJson({
   blockchain:'eos',
   host:'https://public.eosinfra.io',
   port:443,
   protocol:'https',
   chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
});

// JUNGLE
// const network = Network.fromJson({
//   blockchain: "eos",
//   protocol: "https",
//   host: "jungle2.cryptolions.io",
//   port: 443,
//   chainId: "e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473"
// });
window.network = network

let eos;
const rpc = new JsonRpc(network.fullhost());
export default {
  data() {
    return {
      scatter: null,
      stakeAmount: null,
      stakeTime: null,
      scatterAuth:null,
      scatterId:null
    };
  },
  mounted() {
    this.setEosInstance();
    // this.init()
    this.$root.$on('requestScatterAuth',this.authenticate)
    this.$root.$on('scatterLogin',this.login)
    this.$root.$on('scatterLogout',this.logout)
    this.$root.$on('resetScatter',()=>{
      this.logout()
      setTimeout(()=>{this.login()},1000)
      })


  },
  computed: {
    account() {
      if (!this.scatter || !this.scatter.identity) return null;
      return this.scatter.identity.accounts[0];
    }
  },
  methods: {
    async init(){
      try {
        const connected = await ScatterJS.scatter.connect("boid")
        if (!connected) {
          console.error("Could not connect to Scatter.")
          return false
        }
        this.scatter = ScatterJS.scatter
        window.scatter = ScatterJS.scatter
        this.$root.$emit('scatter',this.scatter)
        return true
        console.log("SCATTER ID", this.scatter.identity)
      } catch (error) {
        console.log(error)
      }

    },
    async login() {
      console.log('got login')
      if (!this.scatter) { 
        const result = await this.init()
        if (!result) alert('could not connect to Scatter, make sure Scatter is running and refresh the page.')
      }
      try {
        const result = await this.scatter.getIdentity({ accounts: [network] })

        console.log(result)
      } catch (error) {
        console.log(error)
      }
    },
    logout() {
      if (!this.scatter) return
      this.scatter.forgetIdentity()
      this.scatterId = null
      this.scatterAuth = null
    },
    async stake() {
      const options = {
        authorization: [`${this.account.name}@${this.account.authority}`]
      };
      await eos.transact(
        {
          actions: [
            {
              account: "we3i5kdsdo12",
              name: "stake",
              authorization: [
                {
                  actor: this.account.name,
                  permission: this.account.authority
                }
              ],
              data: {
                _stake_account: this.account.name,
                _stake_period: this.stakeTime,
                _staked: this.stakeAmount.toFixed(4) + " BOID",
                memo: "memo"
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
    },
    async unstake() {
      try {
        const options = {
          authorization: [`${this.account.name}@${this.account.authority}`]
        };
        await eos.transact(
          {
            actions: [
              {
                account: "we3i5kdsdo12",
                name: "unstake",
                authorization: [
                  {
                    actor: this.account.name,
                    permission: this.account.authority
                  }
                ],
                data: {
                  _stake_account: this.account.name
                }
              }
            ]
          },
          {
            blocksBehind: 3,
            expireSeconds: 30
          }
        );
      } catch (e) {
        console.log(e);
      }
    },
    async claim() {
      const options = {
        authorization: [`${this.account.name}@${this.account.authority}`]
      };
      await eos.transact(
        {
          actions: [
            {
              account: "we3i5kdsdo12",
              name: "claim",
              authorization: [
                {
                  actor: this.account.name,
                  permission: this.account.authority
                }
              ],
              data: {
                _stake_account: this.account.name
              }
            }
          ]
        },
        {
          blocksBehind: 3,
          expireSeconds: 30
        }
      );
    },
    setEosInstance() {
      if (this.account) {
        eos = this.scatter.eos(network, Api, { rpc });
      } else {
        eos = new Api({ rpc });
      }
    },
    async authenticate(nonce,msg,key){
      try {
        if (!this.scatter) return null
        const sig = await this.scatter.authenticate(nonce,msg,key)
        if(!sig) return null
        this.scatterAuth = sig
        return sig
      } catch (error) {
        console.error(error)
        return null
      }
    }
  },
  watch: {
    ["account"]() {
      this.setEosInstance()
      this.$root.$emit('scatterId',this.account)

    },
    scatterAuth(){
      this.$root.$emit('scatterAuth',this.scatterAuth)
    }
  }
};
</script>

//hello